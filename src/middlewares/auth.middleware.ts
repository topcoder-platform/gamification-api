import { NextFunction, Request, RequestHandler, Response } from 'express';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import jwksClient, { JwksClient } from 'jwks-rsa';
import { AUTH_SECRET, VALID_ISSUERS } from '@config';

type AuthUser = JwtPayload & {
  userId?: number;
  handle?: unknown;
  roles?: unknown;
  scopes?: string[];
  isMachine?: boolean;
  azpHash?: number;
};

type ValidIssuers = [string, ...string[]];

interface AuthenticatorOptions {
  authSecret?: string;
  validIssuers: ValidIssuers;
  signingKeyProvider?: (issuer: string, keyId: string) => Promise<string>;
}

const jwksClients = new Map<string, JwksClient>();

const parseValidIssuers = (configuredIssuers: string): ValidIssuers => {
  const issuers: unknown = JSON.parse(configuredIssuers);
  if (!Array.isArray(issuers) || issuers.length === 0 || !issuers.every(issuer => typeof issuer === 'string')) {
    throw new Error('JWT issuers are not configured correctly');
  }
  return issuers as ValidIssuers;
};

const getJwksClient = (issuer: string): JwksClient => {
  const existingClient = jwksClients.get(issuer);
  if (existingClient) return existingClient;

  const issuerUrl = issuer.endsWith('/') ? issuer : `${issuer}/`;
  const client = jwksClient({
    cache: true,
    cacheMaxEntries: 5,
    cacheMaxAge: 24 * 60 * 60 * 1000,
    jwksUri: new URL('.well-known/jwks.json', issuerUrl).toString(),
    requestHeaders: {},
    timeout: 5000,
  });
  jwksClients.set(issuer, client);
  return client;
};

const getSigningKey = async (issuer: string, keyId: string): Promise<string> => {
  const key = await getJwksClient(issuer).getSigningKey(keyId);
  return key.getPublicKey();
};

const verifyToken = (token: string, secret: Secret, algorithm: 'HS256' | 'RS256', validIssuers: ValidIssuers): Promise<JwtPayload> =>
  new Promise((resolve, reject) => {
    jwt.verify(token, secret, { algorithms: [algorithm], issuer: validIssuers }, (error, decoded) => {
      if (error || !decoded || typeof decoded === 'string') {
        reject(new Error('Failed to authenticate token'));
      } else {
        resolve(decoded);
      }
    });
  });

const findClaim = (payload: JwtPayload, claimName: string): unknown => Object.entries(payload).find(([key]) => key.includes(claimName))?.[1];

const getAzpHash = (authorizedParty: string): number => {
  let hash = 100000;
  for (let index = 0; index < authorizedParty.length; index += 1) {
    hash += authorizedParty.charCodeAt(index) * (index + 1);
  }
  return hash * -1;
};

const sendAuthError = (req: Request & { id?: string }, res: Response, message: string): void => {
  res.status(403).json({
    id: req.id,
    version: 'v3',
    result: {
      success: false,
      status: 403,
      content: { message },
    },
  });
};

const enrichAuthUser = (payload: JwtPayload): AuthUser => {
  const authUser: AuthUser = { ...payload };
  const userId = Number.parseInt(String(findClaim(payload, 'userId') ?? ''), 10);
  if (Number.isFinite(userId)) authUser.userId = userId;

  authUser.handle = findClaim(payload, 'handle');
  authUser.roles = findClaim(payload, 'roles');

  const scope = findClaim(payload, 'scope');
  if (typeof scope === 'string') {
    authUser.scopes = scope.split(' ').filter(Boolean);
    const grantType = findClaim(payload, 'gty');
    if (grantType === 'client-credentials' && !authUser.userId && !authUser.roles && typeof authUser.azp === 'string') {
      authUser.isMachine = true;
      authUser.azpHash = getAzpHash(authUser.azp);
    }
  }

  return authUser;
};

export const createAuthMiddleware = (options: AuthenticatorOptions): RequestHandler => {
  const allowedIssuers = new Set(options.validIssuers);
  const signingKeyProvider = options.signingKeyProvider || getSigningKey;

  return async (req: Request | any, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;
    const match = typeof authorization === 'string' ? /^Bearer\s+([^\s]+)$/i.exec(authorization) : null;
    if (!match) return sendAuthError(req, res, 'No token provided.');

    try {
      const token = match[1];
      const decoded = jwt.decode(token, { complete: true });
      if (!decoded || typeof decoded.payload === 'string' || typeof decoded.payload.iss !== 'string') {
        throw new Error('Invalid token');
      }

      const issuer = decoded.payload.iss;
      if (!allowedIssuers.has(issuer)) throw new Error('Invalid token issuer');

      let verifiedPayload: JwtPayload;
      if (decoded.header.alg === 'RS256' && typeof decoded.header.kid === 'string') {
        const signingKey = await signingKeyProvider(issuer, decoded.header.kid);
        verifiedPayload = await verifyToken(token, signingKey, 'RS256', options.validIssuers);
      } else if (decoded.header.alg === 'HS256' && options.authSecret) {
        verifiedPayload = await verifyToken(token, options.authSecret, 'HS256', options.validIssuers);
      } else {
        throw new Error('Unsupported token algorithm');
      }

      req.authUser = enrichAuthUser(verifiedPayload);
      return next();
    } catch {
      return sendAuthError(req, res, 'Failed to authenticate token.');
    }
  };
};

const authMiddleware = createAuthMiddleware({
  authSecret: AUTH_SECRET,
  validIssuers: parseValidIssuers(VALID_ISSUERS),
});

export default authMiddleware;

import { NextFunction, Request, RequestHandler, Response } from 'express';
import { auth } from 'tc-core-library-js';
import { AUTH_SECRET, VALID_ISSUERS } from '@config';

/** Optional explicit member trust for isolated tests; Keycloak settings remain server-owned. */
interface AuthenticatorOptions {
  authSecret?: string;
  validIssuers: string[];
}

/** Write the legacy API error envelope using a static status/message; never includes credentials. */
const sendAuthError = (req: Request & { id?: string }, res: Response, status: number, message: string): void => {
  res.status(status).json({ id: req.id, version: 'v3', result: { success: false, status, content: { message } } });
};

/** Create a persistent shared-core validator for protected member badge operations.
 * @param options Explicit member HMAC secret and trusted issuer list.
 * @returns Express middleware setting normalized authUser; invalid tokens return 401,
 * while service identities and members missing an audit handle return 403.
 * @throws TypeError when the required Keycloak/provider configuration is invalid.
 * Role authorization remains in rolesMiddleware; no raw claims or synthetic IDs are used.
 */
export const createAuthMiddleware = (options: AuthenticatorOptions): RequestHandler => {
  const validator = auth.createValidator({ AUTH_SECRET: options.authSecret, VALID_ISSUERS: options.validIssuers });
  return async (req: Request | any, res: Response, next: NextFunction) => {
    let principal;
    try {
      const match = typeof req.headers.authorization === 'string' ? /^Bearer ([^\s]+)$/i.exec(req.headers.authorization) : null;
      if (!match) throw new Error('Missing token');
      principal = await validator.verify(match[1]);
    } catch {
      return sendAuthError(req, res, 401, 'Invalid or expired token.');
    }
    if (principal.kind !== 'user' || !principal.handle) return sendAuthError(req, res, 403, 'Member authentication required.');
    req.authUser = principal;
    return next();
  };
};

const authMiddleware = createAuthMiddleware({ authSecret: AUTH_SECRET, validIssuers: JSON.parse(VALID_ISSUERS) });
export default authMiddleware;

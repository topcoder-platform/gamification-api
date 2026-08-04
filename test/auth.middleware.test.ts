import { Request, Response } from 'express';
import express from 'express';
import { generateKeyPairSync } from 'crypto';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { createAuthMiddleware } from '@middlewares/auth.middleware';

const issuer = 'https://issuer.example/';
const authSecret = 'a-test-only-secret-that-is-long-enough';

const invokeMiddleware = async (authorization?: string) => {
  const req = { headers: { authorization } } as Request & { authUser?: Record<string, unknown> };
  const next = jest.fn();
  const middleware = createAuthMiddleware({ authSecret, validIssuers: [issuer] });

  await middleware(req, {} as Response, next);
  return { req, next };
};

const createTestApp = () => {
  const app = express();
  const middleware = createAuthMiddleware({ authSecret, validIssuers: [issuer] });
  app.get('/secure', middleware, (req: Request & { authUser?: Record<string, unknown> }, res: Response) => {
    res.json({ authUser: req.authUser });
  });
  return app;
};

describe('auth middleware', () => {
  it('verifies an HS256 token and maps Topcoder namespaced claims', async () => {
    const token = jwt.sign(
      {
        'https://topcoder.com/userId': '12345',
        'https://topcoder.com/handle': 'security-tester',
        'https://topcoder.com/roles': ['administrator'],
        scope: 'read:badges write:badges',
      },
      authSecret,
      { algorithm: 'HS256', expiresIn: '5m', issuer },
    );

    const { req, next } = await invokeMiddleware(`Bearer ${token}`);

    expect(next).toHaveBeenCalledWith();
    expect(req.authUser).toMatchObject({
      userId: 12345,
      handle: 'security-tester',
      roles: ['administrator'],
      scopes: ['read:badges', 'write:badges'],
      iss: issuer,
    });
  });

  it('rejects a request without a bearer token', async () => {
    await request(createTestApp())
      .get('/secure')
      .expect(403)
      .expect({
        version: 'v3',
        result: { success: false, status: 403, content: { message: 'No token provided.' } },
      });
  });

  it('verifies an RS256 token with the issuer JWKS signing key', async () => {
    const { privateKey, publicKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      privateKeyEncoding: { format: 'pem', type: 'pkcs8' },
      publicKeyEncoding: { format: 'pem', type: 'spki' },
    });
    const token = jwt.sign({ 'https://topcoder.com/roles': ['administrator'] }, privateKey, {
      algorithm: 'RS256',
      expiresIn: '5m',
      issuer,
      keyid: 'test-key-id',
    });
    const req = { headers: { authorization: `Bearer ${token}` } } as Request & { authUser?: Record<string, unknown> };
    const next = jest.fn();
    const signingKeyProvider = jest.fn().mockResolvedValue(publicKey);
    const middleware = createAuthMiddleware({ validIssuers: [issuer], signingKeyProvider });

    await middleware(req, {} as Response, next);

    expect(signingKeyProvider).toHaveBeenCalledWith(issuer, 'test-key-id');
    expect(next).toHaveBeenCalledWith();
    expect(req.authUser).toMatchObject({ roles: ['administrator'], iss: issuer });
  });

  it('rejects a token from an issuer outside the allowlist', async () => {
    const token = jwt.sign({}, authSecret, {
      algorithm: 'HS256',
      expiresIn: '5m',
      issuer: 'https://untrusted.example/',
    });

    await request(createTestApp())
      .get('/secure')
      .set('Authorization', `Bearer ${token}`)
      .expect(403)
      .expect({
        version: 'v3',
        result: { success: false, status: 403, content: { message: 'Failed to authenticate token.' } },
      });
  });
});

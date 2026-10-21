import { Request, Response } from 'express';
import express from 'express';
import { generateKeyPairSync } from 'crypto';
import jwt from 'jsonwebtoken';
import nock from 'nock';
import request from 'supertest';
import { createAuthMiddleware } from '@middlewares/auth.middleware';
import rolesMiddleware from '@middlewares/roles.middleware';

const issuer = 'https://issuer.example/';
const authSecret = 'a-test-only-secret-that-is-long-enough';
const { privateKey, publicKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
const memberClaims = { userId: 12345, handle: 'security-tester', roles: ['administrator'] };

/** Mount real member authentication/role middleware over HTTP; no database work occurs. */
const createTestApp = () => {
  const app = express();
  app.get('/secure', createAuthMiddleware({ authSecret, validIssuers: [issuer] }), rolesMiddleware(['administrator']),
    (req: Request & { authUser?: Record<string, unknown> }, res: Response) => res.json({ authUser: req.authUser }));
  app.use((error, req, res, next) => res.status(error.status || 500).json({ message: error.message }));
  return app;
};

beforeAll(() => {
  const keys = [{ ...publicKey.export({ format: 'jwk' }), kid: 'test-key-id', alg: 'RS256', use: 'sig' }];
  nock(issuer).persist().get('/.well-known/jwks.json').reply(200, { keys });
  nock('https://gamification-keycloak.test').persist().get('/realms/m2m/protocol/openid-connect/certs').reply(200, { keys });
});
afterAll(() => nock.cleanAll());

describe('shared-core badge authentication', () => {
  it('normalizes namespaced member claims and strips service scopes', async () => {
    const token = jwt.sign({ 'https://topcoder.com/userId': '12345', 'https://topcoder.com/handle': 'security-tester',
      'https://topcoder.com/roles': ['administrator'], scope: 'read:badges write:badges' }, authSecret, { algorithm: 'HS256', expiresIn: '5m', issuer });
    const response = await request(createTestApp()).get('/secure').set('Authorization', `Bearer ${token}`).expect(200);
    expect(response.body.authUser).toMatchObject({ kind: 'user', ...memberClaims, scopes: [], iss: issuer });
  });
  it('rejects missing credentials and untrusted issuer tokens with sanitized 401', async () => {
    await request(createTestApp()).get('/secure').expect(401);
    const token = jwt.sign(memberClaims, authSecret, { algorithm: 'HS256', expiresIn: '5m', issuer: 'https://untrusted.example/' });
    await request(createTestApp()).get('/secure').set('Authorization', `Bearer ${token}`).expect(401)
      .expect({ version: 'v3', result: { success: false, status: 401, content: { message: 'Invalid or expired token.' } } });
  });
  it('verifies RS256 members through the trusted shared-core JWKS path', async () => {
    const token = jwt.sign(memberClaims, privateKey, { algorithm: 'RS256', expiresIn: '5m', issuer, keyid: 'test-key-id' });
    await request(createTestApp()).get('/secure').set('Authorization', `Bearer ${token}`).expect(200);
  });
  it('rejects verified service tokens from badge administrator operations', async () => {
    const token = jwt.sign({ sub: 'service-test', azp: 'gamification-test', gty: 'client-credentials', scope: 'write:badges' }, privateKey,
      { algorithm: 'RS256', expiresIn: '15m', issuer: process.env.KEYCLOAK_ISSUER, audience: process.env.KEYCLOAK_AUDIENCE, keyid: 'test-key-id' });
    await request(createTestApp()).get('/secure').set('Authorization', `Bearer ${token}`).expect(403);
  });
  it('rejects malformed member IDs, nickname-only profiles and missing admin roles', async () => {
    for (const [claims, status] of [[{ ...memberClaims, userId: '123bad' }, 401], [{ userId: 123, roles: ['administrator'], nickname: 'test' }, 403],
      [{ ...memberClaims, roles: ['member'] }, 403]] as const) {
      const token = jwt.sign(claims, authSecret, { algorithm: 'HS256', expiresIn: '5m', issuer });
      await request(createTestApp()).get('/secure').set('Authorization', `Bearer ${token}`).expect(status);
    }
  });
});

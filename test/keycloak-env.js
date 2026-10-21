/* Explicit synthetic issuer trust for unit tests; never used in production. */
Object.assign(process.env, {
  M2M_PROVIDER: 'keycloak', KEYCLOAK_ISSUER: 'https://gamification-keycloak.test/realms/m2m',
  KEYCLOAK_AUDIENCE: 'https://api.test', KEYCLOAK_TOKEN_URL: 'https://gamification-keycloak.test/m2m/token',
  VALID_ISSUERS: '["https://issuer.example/"]', AUTH_SECRET: 'a-test-only-secret-that-is-long-enough',
  ALLOW_LEGACY_USER_AUDIENCE: 'true',
});

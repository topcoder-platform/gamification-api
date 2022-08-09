import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, GAMIFICATION_DATABASE_URL, SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN } = process.env;
export const AUTH_SECRET = process.env.AUTH_SECRET || 'mysecret';
export const VALID_ISSUERS =
  process.env.VALID_ISSUERS ||
  '["https://api.topcoder-dev.com", "https://api.topcoder.com", "https://topcoder-dev.auth0.com/", "https://auth.topcoder-dev.com/","https://topcoder.auth0.com/","https://auth.topcoder.com/"]';
export const API_BASE = '';
export const ACCESS_ROLES = ['Gamification Admin'];

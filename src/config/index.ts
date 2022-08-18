import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

console.log('process.env.POSTGRE_SQL_USER', process.env.POSTGRE_SQL_USER);

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const {
  NODE_ENV,
  PORT,
  POSTGRE_SQL_USER,
  POSTGRE_SQL_PASS,
  POSTGRE_SQL_DATABASE,
  SECRET_KEY,
  LOG_FORMAT,
  ORIGIN
  // AWS_ACCESS_KEY_ID,
  // AWS_SECRET_ACCESS_KEY,
} = process.env;
export const AUTH_SECRET = process.env.AUTH_SECRET || 'mysecret';
export const VALID_ISSUERS =
  process.env.VALID_ISSUERS ||
  '["https://api.topcoder-dev.com", "https://api.topcoder.com", "https://topcoder-dev.auth0.com/", "https://auth.topcoder-dev.com/","https://topcoder.auth0.com/","https://auth.topcoder.com/"]';
export const API_BASE = '';
export const ADMIN_ACCESS_ROLES = ['Gamification Admin'];
export const VALID_UPLOAD_TYPES = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg'];
export const CDN_S3_BUCKET_NAME = 'tc-gamification';
export const DEFAULT_PAGE_LIMIT = 20;
export const VALID_CSV_UPLOAD_TYPES = ['text/csv'];

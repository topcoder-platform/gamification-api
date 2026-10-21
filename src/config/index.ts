import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const {
  NODE_ENV,
  PORT,
  POSTGRE_SQL_USER,
  POSTGRE_SQL_PASS,
  POSTGRE_SQL_DATABASE,
  POSTGRE_SQL_SCHEMA,
  SECRET_KEY,
  LOG_FORMAT,
  // LOG_DIR,
  ORIGIN,
  // AWS_ACCESS_KEY_ID,
  // AWS_SECRET_ACCESS_KEY,
  CDN_S3_BUCKET_NAME,
  CDN_DOMAIN,
} = process.env;
export const AUTH_SECRET = process.env.AUTH_SECRET;
export const VALID_ISSUERS = process.env.VALID_ISSUERS || '[]';
export const API_BASE = '/v5/gamification';
export const ADMIN_ACCESS_ROLES = ['administrator'];
export const VALID_UPLOAD_TYPES = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/webp', 'image/svg', 'image/svg+xml'];
export const DEFAULT_PAGE_LIMIT = 20;
export const VALID_CSV_UPLOAD_TYPES = ['text/csv'];

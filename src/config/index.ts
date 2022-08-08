import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const { NODE_ENV, PORT, GAMIFICATION_DATABASE_URL, SECRET_KEY, LOG_FORMAT, LOG_DIR, ORIGIN, AUTH_SECRET, VALID_ISSUERS } = process.env;
export const API_BASE = '';
export const ACCESS_ROLES = ['Gamification Admin'];

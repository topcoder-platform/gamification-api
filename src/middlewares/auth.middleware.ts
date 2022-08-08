import { NextFunction, Request, Response } from 'express';
import { middleware } from 'tc-core-library-js';
import { AUTH_SECRET, VALID_ISSUERS } from '@config';

const authenticator = middleware.jwtAuthenticator;
const authenticatorOptions = { AUTH_SECRET, VALID_ISSUERS };

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  return authenticator(authenticatorOptions)(req, res, next);
};

export default authMiddleware;

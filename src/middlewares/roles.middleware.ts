import { RequestHandler } from 'express';
import { HttpException } from '@exceptions/HttpException';

const rolesMiddleware = (requireRoles: string[]): RequestHandler => {
  return (req: any, res, next) => {
    if (!req.authUser) {
      return next(new HttpException(500, "rolesMiddleware can't verify missing req.authUser"));
    }
    const userRoles = Array.isArray(req.authUser.roles) ? req.authUser.roles : [];
    // make sure all required roles are present in auth JWT of this member
    if (!requireRoles.every(role => userRoles.includes(role))) {
      return next(new HttpException(403, 'Forbidden operation for your role'));
    } else {
      return next();
    }
  };
};

export default rolesMiddleware;

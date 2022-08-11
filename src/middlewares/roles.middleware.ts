import { RequestHandler } from 'express';
import { HttpException } from '@exceptions/HttpException';
import { intersection } from 'lodash';

const rolesMiddleware = (requireRoles: string[]): RequestHandler => {
  return (req: any, res, next) => {
    if (!req.authUser) {
      return next(new HttpException(500, "rolesMiddleware can't verify missing req.authUser"));
    }
    const matchedRoles = intersection(req.authUser.roles, requireRoles);
    // make sure all required roles are present in auth JWT of this member
    if (matchedRoles.length !== requireRoles.length) {
      return next(new HttpException(403, 'Forbidden operation for your role'));
    } else {
      return next();
    }
  };
};

export default rolesMiddleware;

import { RequestHandler } from 'express';
import { HttpException } from '@exceptions/HttpException';
import { intersection } from 'lodash';

const rolesMiddleware = (requireRoles: string[]): RequestHandler => {
  return (req: any, res, next) => {
    const matchedRoles = intersection(req.authUser.roles, requireRoles);
    // make sure all required roles are present in auth JWT of this member
    if (matchedRoles.length !== requireRoles.length) {
      next(new HttpException(403, 'Forbidden operation for your role'));
    } else {
      next();
    }
  };
};

export default rolesMiddleware;

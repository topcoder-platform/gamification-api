import { Router } from 'express';
import BadgesController from '@controllers/badges/badges.controller';
import { Routes } from '@interfaces/routes.interface';
import { API_BASE, ACCESS_ROLES, VALID_UPLOAD_TYPES } from '@config';
import authMiddleware from '@middlewares/auth.middleware';
import rolesMiddleware from '@/middlewares/roles.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import { CreateBadgeDto, ValidOrgIdDto } from '@/dtos/badges.dto';
import multer from 'multer';
import fileMiddleware from '@/middlewares/file.middleware';

// muliter instance to handle badge image file uploads
// use in memory storage - we handle destinations in the controller
const upload = multer({
  limits: {
    fileSize: 50000000, // 50Mb max
  },
  // validate fyle type against allowed types
  fileFilter: (req, file, cb) => {
    if (VALID_UPLOAD_TYPES.indexOf(file.mimetype) === -1) {
      cb(null, false);
      const e: any = new Error(`Only ${VALID_UPLOAD_TYPES.join()} are supported file types for upload`);
      e.status = 400;

      return cb(e);
    } else {
      cb(null, true);
    }
  },
});

class BadgesRoute implements Routes {
  public path = `${API_BASE}/badges`;
  public router = Router();
  public badgesController = new BadgesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `${this.path}`,
      authMiddleware,
      rolesMiddleware(ACCESS_ROLES),
      upload.single('file'),
      validationMiddleware(ValidOrgIdDto, 'body', false, true, false),
      fileMiddleware,
      validationMiddleware(CreateBadgeDto, 'body'),
      this.badgesController.createNewBadge,
    );
  }
}

export default BadgesRoute;

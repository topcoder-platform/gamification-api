import { Router } from 'express';
import BadgesController from '@controllers/badges/badges.controller';
import { Routes } from '@interfaces/routes.interface';
import { API_BASE, ADMIN_ACCESS_ROLES, VALID_UPLOAD_TYPES, VALID_CSV_UPLOAD_TYPES } from '@config';
import authMiddleware from '@middlewares/auth.middleware';
import rolesMiddleware from '@/middlewares/roles.middleware';
import validationMiddleware from '@/middlewares/validation.middleware';
import {
  CreateBadgeDto,
  ValidOrgIdDto,
  GetBadgesQueryDto,
  AssignBadgeToMemberDto,
  VallidMemberIdDto,
  GetMemberBadgesQueryDto,
  ValidBadgeIdDto,
  ModifyBadgeDto,
} from '@/dtos/badges.dto';
import multer from 'multer';
import fileUploadMiddleware from '@/middlewares/fileUpload.middleware';

// muliter instance to handle badge image file uploads
// use in memory storage - we handle destinations in the controller
const upload = multer({
  limits: {
    fileSize: 5000000, // 5Mb max
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

// muliter instance to handle bulk badge assign
// use in memory storage - we handle destinations in the controller
const uploadCSV = multer({
  limits: {
    fileSize: 50000000, // 5Mb max
  },
  // validate fyle type against allowed types
  fileFilter: (req, file, cb) => {
    if (VALID_CSV_UPLOAD_TYPES.indexOf(file.mimetype) === -1) {
      cb(null, false);
      const e: any = new Error(`Only ${VALID_CSV_UPLOAD_TYPES.join()} are supported file types for upload`);
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
    // Create new badge
    this.router.post(
      `${this.path}`,
      authMiddleware,
      rolesMiddleware(ADMIN_ACCESS_ROLES),
      upload.single('file'),
      validationMiddleware(ValidOrgIdDto, 'body', false, true, false),
      fileUploadMiddleware,
      validationMiddleware(CreateBadgeDto, 'body'),
      this.badgesController.createNewBadge,
    );
    // Get badges
    this.router.get(
      `${this.path}`,
      authMiddleware,
      rolesMiddleware(ADMIN_ACCESS_ROLES),
      validationMiddleware(GetBadgesQueryDto, 'query'),
      this.badgesController.getOrgBadges,
    );
    // Get badge details
    this.router.get(
      `${this.path}/:badge_id`,
      authMiddleware,
      rolesMiddleware(ADMIN_ACCESS_ROLES),
      validationMiddleware(ValidBadgeIdDto, 'params'),
      this.badgesController.getBadge,
    );
    // Get member badges
    this.router.get(
      `${this.path}/assigned/:member_id`,
      validationMiddleware(VallidMemberIdDto, 'params'),
      validationMiddleware(GetMemberBadgesQueryDto, 'query'),
      this.badgesController.getMemberBadges,
    );
    // Assign a badge to a member
    this.router.post(
      `${this.path}/:badge_id/assign/:member_id`,
      authMiddleware,
      rolesMiddleware(ADMIN_ACCESS_ROLES),
      validationMiddleware(AssignBadgeToMemberDto, 'params'),
      this.badgesController.assignBadgeToMember,
    );
    // Unssign a badge from a member
    this.router.delete(
      `${this.path}/:badge_id/assign/:member_id`,
      authMiddleware,
      rolesMiddleware(ADMIN_ACCESS_ROLES),
      validationMiddleware(AssignBadgeToMemberDto, 'params'),
      this.badgesController.unassignBadgeFromMember,
    );
    // Assign a badge to a member
    this.router.post(
      `${this.path}/assign`,
      authMiddleware,
      rolesMiddleware(ADMIN_ACCESS_ROLES),
      uploadCSV.single('file'),
      this.badgesController.bulkAssignBadges,
    );
    // PATCH a badge
    this.router.post(
      `${this.path}/:badge_id`,
      authMiddleware,
      rolesMiddleware(ADMIN_ACCESS_ROLES),
      upload.single('file'),
      validationMiddleware(ModifyBadgeDto, 'body'),
      this.badgesController.modifyBadge,
    );
  }
}

export default BadgesRoute;

import { Router } from 'express';
import BadgesController from '@controllers/badges/badges.controller';
import { Routes } from '@interfaces/routes.interface';
import { API_BASE, ACCESS_ROLES } from '@config';
import authMiddleware from '@middlewares/auth.middleware';
import rolesMiddleware from '@/middlewares/roles.middleware';

class BadgesRoute implements Routes {
  public path = `${API_BASE}/badges`;
  public router = Router();
  public badgesController = new BadgesController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(`${this.path}`, authMiddleware, rolesMiddleware(ACCESS_ROLES), this.badgesController.createNewBadge);
  }
}

export default BadgesRoute;

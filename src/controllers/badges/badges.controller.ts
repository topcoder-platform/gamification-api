import { NextFunction, Request, Response } from 'express';

class BadgesController {
  public createNewBadge = (req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(req.body);
    } catch (error) {
      next(error);
    }
  };
}

export default BadgesController;

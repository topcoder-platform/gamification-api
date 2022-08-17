import { NextFunction, Request, Response } from 'express';
import {
  createBadge,
  getBadges,
  assignBadge,
  removeBadge,
  getMemberEarnedBadges,
  getBadgeWithMembers,
  bulkAssignBadges,
} from '@services/badges.service';
import { getMemberInfo } from '@services/members.service';
import AWS from 'aws-sdk';
import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, CDN_S3_BUCKET_NAME, DEFAULT_PAGE_LIMIT } from '@config';
import { parse } from 'csv-parse';
import { has } from 'lodash';
import { validate as uuidValidate } from 'uuid';

// config the AWS S3 environment
const s3 = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

class BadgesController {
  /**
   * Create new badge under given organization
   */
  public createNewBadge = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
      const newBadge = await createBadge(req.body);
      // all set in db, delete the TEMP tag from image file
      // there is Lifecycle rule configured wich will clean up all TEMP uploads after 1 day
      await s3
        .deleteObjectTagging({
          Bucket: CDN_S3_BUCKET_NAME,
          Key: req.body.file_name,
        })
        .promise();

      res.json(newBadge);
    } catch (error) {
      if (!error.status) error.status = 400;
      next(error);
    }
  };
  /**
   * Get badges in given organization/s
   */
  public getOrgBadges = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
      const { offset, limit } = req.query;
      const { count, rows } = await getBadges(req.query);

      res.json({
        count,
        offset: Number(offset || 0),
        limit: Number(limit || DEFAULT_PAGE_LIMIT),
        rows,
      });
    } catch (error) {
      if (!error.status) error.status = 400;
      next(error);
    }
  };
  /**
   * Assign a badge to a member
   */
  public assignBadgeToMember = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
      const { member_id, badge_id } = req.params;
      const member = await getMemberInfo(member_id);
      if (!member) throw new Error(`Member ${member_id} does not exists`);
      if (member.status !== 'ACTIVE') throw new Error(`Member ${member_id} is not in ACTIVE status`);
      // all good - try to assing the badge
      const assign = await assignBadge(badge_id, member_id, req.authUser.nickname || req.authUser.name, member.handle);

      res.json(assign);
    } catch (error) {
      if (!error.status) error.status = 400;
      next(error);
    }
  };
  /**
   * Unassign a badge from a member
   */
  public unassignBadgeFromMember = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
      const { member_id, badge_id } = req.params;
      // all good - try to unassing the badge
      const unassign = await removeBadge(badge_id, member_id);

      res.json(unassign);
    } catch (error) {
      if (!error.status) error.status = 400;
      next(error);
    }
  };
  /**
   * Get member badges
   */
  public getMemberBadges = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
      const { offset, limit } = req.query;
      const { member_id } = req.params;
      const { count, rows } = await getMemberEarnedBadges(member_id, req.query);

      res.json({
        count,
        offset: Number(offset || 0),
        limit: Number(limit || DEFAULT_PAGE_LIMIT),
        rows,
      });
    } catch (error) {
      if (!error.status) error.status = 400;
      next(error);
    }
  };
  /**
   * Get badge
   */
  public getBadge = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
      const { badge_id } = req.params;
      const badge = await getBadgeWithMembers(badge_id);

      res.json(badge);
    } catch (error) {
      if (!error.status) error.status = 400;
      next(error);
    }
  };

  public bulkAssignBadges = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
      const { file } = req;
      if (!file) throw new Error('CSV file not provided');
      // try parse the file and process the records...
      parse(
        file.buffer.toString(),
        {
          columns: true,
        },
        async (err, records) => {
          if (err) {
            if (!err.status) err.status = 400;
            return next(err);
          }
          // we good, try process the records
          try {
            const assignments = await bulkAssignBadges(
              records.map((r: { tc_handle: any; badge_id: string; awarded_at: string | number | Date; awarded_by: any }) => {
                if (!has(r, 'tc_handle') || !has(r, 'badge_id'))
                  throw new Error('CSV has invalid structure, tc_handle & badge_id are required fields');
                if (!uuidValidate(r.badge_id)) throw new Error('CSV has invalid structure, badge_id has to be UUIDs');
                // map to db fields
                return {
                  user_handle: r.tc_handle,
                  org_badge_id: r.badge_id,
                  awarded_at: (Number(new Date(r.awarded_at)) ? new Date(r.awarded_at) : false) || new Date(),
                  awarded_by: r.awarded_by || req.authUser.nickname || req.authUser.name,
                };
              }),
            );
            res.json(assignments);
          } catch (e) {
            console.log(e);
            if (!e.status) e.status = 400;
            next(e);
          }
        },
      );
    } catch (error) {
      if (!error.status) error.status = 400;
      next(error);
    }
  };
}

export default BadgesController;

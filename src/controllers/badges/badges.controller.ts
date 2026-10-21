import { NextFunction, Request, Response } from 'express';
import {
  createBadge,
  getBadges,
  assignBadge,
  removeBadge,
  getMemberEarnedBadges,
  getBadgeWithMembers,
  bulkAssignBadges,
  getBadgeMemberAssignees,
} from '@services/badges.service';
import { getMemberInfo } from '@services/members.service';
import { DeleteObjectCommand, DeleteObjectTaggingCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { CDN_S3_BUCKET_NAME, DEFAULT_PAGE_LIMIT, CDN_DOMAIN } from '@config';
import { parse } from 'csv-parse';
import { isUUID } from 'class-validator';
import { randomUUID } from 'crypto';
import { isEmpty } from '@utils/util';
import path from 'path';

const s3 = new S3Client({});

class BadgesController {
  /**
   * Create new badge under given organization
   */
  public createNewBadge = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
      const newBadge = await createBadge(req.body);
      // all set in db, delete the TEMP tag from image file
      // there is Lifecycle rule configured wich will clean up all TEMP uploads after 1 day
      await s3.send(
        new DeleteObjectTaggingCommand({
          Bucket: CDN_S3_BUCKET_NAME,
          Key: req.body.file_name,
        }),
      );

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
      const assign = await assignBadge(badge_id, member_id, req.authUser.handle, member.handle);

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
  /**
   * Bulk assign via CSV file
   */
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
                if (!Object.prototype.hasOwnProperty.call(r, 'tc_handle') || !Object.prototype.hasOwnProperty.call(r, 'badge_id'))
                  throw new Error('CSV has invalid structure, tc_handle & badge_id are required fields');
                if (!isUUID(r.badge_id)) throw new Error('CSV has invalid structure, badge_id has to be UUIDs');
                // map to db fields
                return {
                  user_handle: r.tc_handle,
                  org_badge_id: r.badge_id,
                  awarded_at: (Number(new Date(r.awarded_at)) ? new Date(r.awarded_at) : false) || new Date(),
                  awarded_by: r.awarded_by || req.authUser.handle,
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
  /**
   * Update existing badge
   */
  public modifyBadge = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
      const { badge_id } = req.params;
      const { file } = req;

      if (isEmpty(req.body) && !file) {
        throw new Error('Empty badge update request');
      }

      const badge = await getBadgeWithMembers(badge_id);

      // badge image update request
      // upload it to S3 and delete the older badge file
      if (file) {
        const fileID = randomUUID();
        const ext = path.extname(file.originalname);
        const fileName = `${badge.organization_id}/${fileID}${ext}`;
        await s3.send(
          new PutObjectCommand({
            Bucket: CDN_S3_BUCKET_NAME,
            Body: file.buffer,
            Key: fileName,
            ContentType: file.mimetype,
            CacheControl: 'max-age=31536000',
          }),
        );
        // delete the revious image file
        const prevKey = badge.badge_image_url.split('/');
        await s3.send(
          new DeleteObjectCommand({
            Bucket: CDN_S3_BUCKET_NAME,
            Key: `${prevKey[prevKey.length - 2]}/${prevKey[prevKey.length - 1]}`,
          }),
        );
        // new image file uplaoded to S3, update the badge
        badge.set({
          badge_image_url: `${CDN_DOMAIN}/${fileName}`,
        });
      }

      // set other updates coming with the body
      if (!isEmpty(req.body)) {
        badge.set(req.body);
      }

      // save all updates
      await badge.save();

      res.json(badge);
    } catch (error) {
      if (!error.status) error.status = 400;
      next(error);
    }
  };
  /**
   * Get badge winners/assignees
   */
  public getBadgeAssignees = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
      const { badge_id } = req.params;
      const { offset, limit } = req.query;
      const { count, rows } = await getBadgeMemberAssignees(badge_id, req.query);

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
}

export default BadgesController;

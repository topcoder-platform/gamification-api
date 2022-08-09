import { NextFunction, Request, Response } from 'express';
import { createBadge } from '@services/badges.service';
import AWS from 'aws-sdk';
import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, CDN_S3_BUCKET_NAME } from '@config';

// config the AWS S3 environment
const s3 = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

class BadgesController {
  public createNewBadge = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
      console.log('createNewBadge', req.file, req.body);
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
}

export default BadgesController;

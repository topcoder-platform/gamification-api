import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';
import AWS from 'aws-sdk';
import { CDN_S3_BUCKET_NAME } from '@config';
// import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, CDN_S3_BUCKET_NAME } from '@config';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// config the AWS S3 environment
const s3 = new AWS.S3({
  // accessKeyId: AWS_ACCESS_KEY_ID,
  // secretAccessKey: AWS_SECRET_ACCESS_KEY,
});

const fileUploadMiddleware = (req: Request | any, res: Response, next: NextFunction) => {
  const { file } = req;
  // empty file submitted
  if (!file) return next(new HttpException(400, 'Badge image file is required'));
  // upload it to S3 and set it with `UPLOAD:TEMP` tag
  // there is Lifecycle rule configured wich will clean up all TEMP uploads after 1 day
  const fileID = uuidv4();
  const ext = path.extname(file.originalname);
  const fileName = `${req.body.organization_id}/${fileID}${ext}`;
  s3.upload({
    Bucket: CDN_S3_BUCKET_NAME,
    ACL: 'public-read',
    Body: file.buffer,
    Key: fileName,
    ContentType: file.mimetype,
    CacheControl: 'max-age=31536000',
    Tagging: 'UPLOAD=TEMP',
  })
    .promise()
    .then(s3Data => {
      // set the url in the body for further ops
      // and continue...
      req.body.badge_image_url = s3Data.Location;
      req.body.file_name = fileName;
      // all good, continue...
      next();
    })
    .catch(e => next(e));
};

export default fileUploadMiddleware;

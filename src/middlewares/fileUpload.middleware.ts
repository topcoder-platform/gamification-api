import { NextFunction, Request, Response } from 'express';
import { HttpException } from '@exceptions/HttpException';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { CDN_S3_BUCKET_NAME, CDN_DOMAIN } from '@config';
import path from 'path';
import { randomUUID } from 'crypto';

const s3 = new S3Client({});

const fileUploadMiddleware = (req: Request | any, res: Response, next: NextFunction) => {
  const { file } = req;
  // empty file submitted
  if (!file) return next(new HttpException(400, 'Badge image file is required'));
  // upload it to S3 and set it with `UPLOAD:TEMP` tag
  // there is Lifecycle rule configured wich will clean up all TEMP uploads after 1 day
  const fileID = randomUUID();
  const ext = path.extname(file.originalname);
  const fileName = `${req.body.organization_id}/${fileID}${ext}`;
  s3.send(
    new PutObjectCommand({
      Bucket: CDN_S3_BUCKET_NAME,
      Body: file.buffer,
      Key: fileName,
      ContentType: file.mimetype,
      CacheControl: 'max-age=31536000',
      Tagging: 'UPLOAD=TEMP',
    }),
  )
    .then(() => {
      // set the url in the body for further ops
      // and continue...
      req.body.badge_image_url = `${CDN_DOMAIN}/${fileName}`;
      req.body.file_name = fileName;
      // all good, continue...
      next();
    })
    .catch(e => next(e));
};

export default fileUploadMiddleware;

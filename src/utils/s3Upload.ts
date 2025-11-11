import { PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { s3Config } from '../config/s3.config';
import { randomBytes } from 'crypto';

export interface UploadResult {
  url: string;
  key: string;
}

export const  uploadToS3 = async (
  file: Express.Multer.File,
  folder: string = 'uploads'
): Promise<UploadResult> => {
  const fileExtension = file.originalname.split('.').pop();
  const uniqueId = randomBytes(16).toString('hex');
  const fileName = `${folder}/${uniqueId}.${fileExtension}`;

  const command = new PutObjectCommand({
    Bucket: s3Config.bucketName,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: 'public-read',
  });

  await s3Config.client.send(command);

  const url = `https://${s3Config.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

  return { url, key: fileName };
};

export const uploadMultipleToS3 = async (
  files: Express.Multer.File[],
  folder: string = 'uploads'
): Promise<UploadResult[]> => {
  const uploadPromises = files.map((file) => uploadToS3(file, folder));
  return Promise.all(uploadPromises);
};

export const deleteFromS3 = async (key: string): Promise<void> => {
  const command = new DeleteObjectCommand({
    Bucket: s3Config.bucketName,
    Key: key,
  });

  await s3Config.client.send(command);
};

export interface S3Image {
  key: string;
  url: string;
  size: number;
  lastModified: Date;
}

export const listImagesFromS3 = async (folder: string = ''): Promise<S3Image[]> => {
  const prefix = folder ? `${folder}/` : '';
  
  const command = new ListObjectsV2Command({
    Bucket: s3Config.bucketName,
    Prefix: prefix,
  });

  const response = await s3Config.client.send(command);

  if (!response.Contents || response.Contents.length === 0) {
    return [];
  }

  return response.Contents.map((item) => ({
    key: item.Key || '',
    url: `https://${s3Config.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${item.Key}`,
    size: item.Size || 0,
    lastModified: item.LastModified || new Date(),
  }));
};

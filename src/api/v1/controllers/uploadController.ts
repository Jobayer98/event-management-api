import { Request, Response } from 'express';
import { uploadToS3, uploadMultipleToS3, listImagesFromS3, deleteFromS3 } from '../../../utils/s3Upload';
import { logger } from '../../../config';

export const uploadSingleImage = async (req: Request, res: Response) => {
  try {
    console.log('Content-Type:', req.headers['content-type']);
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const folder = req.body.folder || 'uploads';
    const result = await uploadToS3(req.file, folder);

    res.status(200).json({
      message: 'Image uploaded successfully',
      data: result,
    });
  } catch (error: any) {
    logger.info(error)
    res.status(500).json({ error: error.message || 'Failed to upload image' });
  }
};

export const uploadMultipleImages = async (req: Request, res: Response) => {
  try {
    console.log('Multiple upload - Request body:', req.body);
    console.log('Multiple upload - Request files:', req.files);
    
    if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const folder = req.body.folder || 'uploads';
    const results = await uploadMultipleToS3(req.files, folder);

    res.status(200).json({
      message: 'Images uploaded successfully',
      data: results,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to upload images' });
  }
};

// Test endpoint to verify multer is working
export const testUpload = async (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Multer middleware executed',
    hasFile: !!req.file,
    file: req.file ? {
      fieldname: req.file.fieldname,
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
    } : null,
    body: req.body,
    contentType: req.headers['content-type'],
  });
};

export const listImages = async (req: Request, res: Response) => {
  try {
    const folder = req.query.folder as string || '';
    
    const images = await listImagesFromS3(folder);

    res.status(200).json({
      message: 'Images retrieved successfully',
      folder: folder || 'all',
      count: images.length,
      data: images,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to list images' });
  }
};

export const deleteImage = async (req: Request, res: Response) => {
  try {
    console.log('Delete request body:', req.body);
    console.log('Delete request params:', req.params);
    
    const { key } = req.body;

    if (!key) {
      return res.status(400).json({ error: 'Image key is required' });
    }

    console.log('Attempting to delete key:', key);
    await deleteFromS3(key);

    res.status(200).json({
      message: 'Image deleted successfully',
      key,
    });
  } catch (error: any) {
    console.error('Delete image error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete image' });
  }
};

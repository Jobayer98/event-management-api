import { Router } from 'express';
import { upload } from '../../../middleware/upload.middleware';
import { uploadSingleImage, uploadMultipleImages, testUpload, listImages, deleteImage } from '../controllers/uploadController';
import { authenticateToken, requireRole } from '../../../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/v1/upload/single:
 *   post:
 *     summary: Upload a single image to S3
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               folder:
 *                 type: string
 *                 description: Optional folder name (default is 'uploads')
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *       400:
 *         description: No file uploaded
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 *       500:
 *         description: Server error
 */
router.post('/single', upload.single('image'), authenticateToken, requireRole(['admin']), uploadSingleImage);

/**
 * @swagger
 * /api/v1/upload/multiple:
 *   post:
 *     summary: Upload multiple images to S3
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               folder:
 *                 type: string
 *                 description: Optional folder name (default is 'uploads')
 *     responses:
 *       200:
 *         description: Images uploaded successfully
 *       400:
 *         description: No files uploaded
 *       500:
 *         description: Server error
 */
router.post('/multiple', upload.array('images', 10), authenticateToken, requireRole(['admin']), uploadMultipleImages);

/**
 * @swagger
 * /api/v1/upload/list:
 *   get:
 *     summary: List all images from S3 (optionally filtered by folder)
 *     tags: [Upload]
*     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: folder
 *         schema:
 *           type: string
 *         description: Folder name to filter images (e.g., 'venues', 'meals')
 *     responses:
 *       200:
 *         description: Images retrieved successfully
 *       500:
 *         description: Server error
 */
router.get('/list', authenticateToken, requireRole(['admin']), listImages);

/**
 * @swagger
 * /api/v1/upload/delete:
 *   delete:
 *     summary: Delete an image from S3
 *     tags: [Upload]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               key:
 *                 type: string
 *                 description: S3 object key (e.g., 'venues/abc123.jpg')
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *       400:
 *         description: Image key is required
 *       500:
 *         description: Server error
 */
router.delete('/delete', authenticateToken, requireRole(['admin']), deleteImage);

export default router;

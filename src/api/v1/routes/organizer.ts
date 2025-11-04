import { Router } from 'express';
import {
    loginAdmin,
    getAdminProfile,
    updateAdminProfile,
    updateAdminPassword
} from '../controllers/organizerController';
import { validateBody } from '../../../middleware/validation';
import { authenticateToken, requireRole } from '../../../middleware/auth';
import {
    loginOrganizerSchema,
    updateAdminProfileSchema,
    updateAdminPasswordSchema
} from '../../../schemas/auth';

const router = Router();



/**
 * @swagger
 * /api/v1/admin/login:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Login admin
 *     description: Authenticates an admin with email and password, returns JWT tokens with admin privileges
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 maxLength: 150
 *                 example: "admin@admin.com"
 *                 description: "Admin's email address"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 255
 *                 example: "Admin123!@"
 *                 description: "Admin's password"
 *     responses:
 *       200:
 *         description: Admin logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Admin logged in successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     organizer:
 *                       $ref: '#/components/schemas/Admin'
 *                     token:
 *                       type: string
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/login', validateBody(loginOrganizerSchema), loginAdmin);

/**
 * @swagger
 * /api/v1/admin/profile:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get admin profile
 *     description: Retrieves the current admin's profile information
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Admin profile retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     admin:
 *                       $ref: '#/components/schemas/Admin'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Admin not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/profile', authenticateToken, requireRole(['organizer', 'admin']), getAdminProfile);

/**
 * @swagger
 * /api/v1/admin/profile:
 *   put:
 *     tags:
 *       - Admin
 *     summary: Update admin profile
 *     description: Updates the current admin's profile information (name and phone)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: "Updated Admin Name"
 *                 description: "Admin's full name"
 *               phone:
 *                 type: string
 *                 maxLength: 20
 *                 pattern: "^\\+?[\\d\\s\\-\\(\\)]+$"
 *                 example: "+1234567890"
 *                 description: "Admin's phone number"
 *     responses:
 *       200:
 *         description: Admin profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Admin profile updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     admin:
 *                       $ref: '#/components/schemas/Admin'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Admin not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/profile', authenticateToken, requireRole(['organizer', 'admin']), validateBody(updateAdminProfileSchema), updateAdminProfile);

/**
 * @swagger
 * /api/v1/admin/password:
 *   put:
 *     tags:
 *       - Admin
 *     summary: Update admin password
 *     description: Updates the current admin's password
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 255
 *                 example: "CurrentPassword123!"
 *                 description: "Current password for verification"
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *                 maxLength: 255
 *                 pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]"
 *                 example: "NewPassword123!"
 *                 description: "New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
 *     responses:
 *       200:
 *         description: Admin password updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Admin password updated successfully"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       401:
 *         description: Unauthorized or current password incorrect
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Admin not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/password', authenticateToken, requireRole(['organizer', 'admin']), validateBody(updateAdminPasswordSchema), updateAdminPassword);

export default router;
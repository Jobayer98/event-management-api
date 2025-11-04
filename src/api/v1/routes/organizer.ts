import { Router } from 'express';
import { registerOrganizer, loginOrganizer } from '../controllers/organizerController';
import { validateBody } from '../../../middleware/validation';
import { registerOrganizerSchema, loginOrganizerSchema } from '../../../schemas/auth';

const router = Router();

/**
 * @swagger
 * /api/v1/organizer/register:
 *   post:
 *     tags:
 *       - Organizers
 *     summary: Register new organizer
 *     description: Creates a new organizer account with elevated privileges for venue and meal management
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: "Jane Smith"
 *                 description: "Organizer's full name"
 *               email:
 *                 type: string
 *                 format: email
 *                 maxLength: 150
 *                 example: "jane.smith@eventcompany.com"
 *                 description: "Organizer's email address (must be unique)"
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 maxLength: 255
 *                 pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]"
 *                 example: "OrganizerPass123!"
 *                 description: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
 *               phone:
 *                 type: string
 *                 maxLength: 20
 *                 pattern: "^\\+?[\\d\\s\\-\\(\\)]+$"
 *                 example: "+1234567890"
 *                 description: "Optional phone number"
 *     responses:
 *       201:
 *         description: Organizer registered successfully
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
 *                   example: "Organizer registered successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     organizer:
 *                       $ref: '#/components/schemas/Organizer'
 *                     tokens:
 *                       $ref: '#/components/schemas/AuthTokens'
 *             examples:
 *               success:
 *                 summary: Successful organizer registration
 *                 value:
 *                   success: true
 *                   message: "Organizer registered successfully"
 *                   data:
 *                     organizer:
 *                       id: "123e4567-e89b-12d3-a456-426614174000"
 *                       name: "Jane Smith"
 *                       email: "jane.smith@eventcompany.com"
 *                       phone: "+1234567890"
 *                       role: "organizer"
 *                       createdAt: "2024-01-15T10:30:00Z"
 *                       updatedAt: "2024-01-15T10:30:00Z"
 *                     tokens:
 *                       accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                       refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                       expiresIn: 3600
 *       400:
 *         description: Validation error or bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *             examples:
 *               validation_error:
 *                 summary: Validation errors
 *                 value:
 *                   success: false
 *                   message: "Validation failed"
 *                   errors:
 *                     - field: "email"
 *                       message: "Invalid email format"
 *                     - field: "password"
 *                       message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
 *       409:
 *         description: Email already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               email_exists:
 *                 summary: Email already registered
 *                 value:
 *                   success: false
 *                   message: "Email already exists"
 *                   error: "An organizer with this email address is already registered"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/register', validateBody(registerOrganizerSchema), registerOrganizer);

/**
 * @swagger
 * /api/v1/organizer/login:
 *   post:
 *     tags:
 *       - Organizers
 *     summary: Login organizer
 *     description: Authenticates an organizer with email and password, returns JWT tokens with elevated privileges
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
 *                 example: "jane.smith@eventcompany.com"
 *                 description: "Organizer's email address"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 255
 *                 example: "OrganizerPass123!"
 *                 description: "Organizer's password"
 *     responses:
 *       200:
 *         description: Organizer logged in successfully
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
 *                   example: "Organizer logged in successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     organizer:
 *                       $ref: '#/components/schemas/Organizer'
 *                     tokens:
 *                       $ref: '#/components/schemas/AuthTokens'
 *             examples:
 *               success:
 *                 summary: Successful organizer login
 *                 value:
 *                   success: true
 *                   message: "Organizer logged in successfully"
 *                   data:
 *                     organizer:
 *                       id: "123e4567-e89b-12d3-a456-426614174000"
 *                       name: "Jane Smith"
 *                       email: "jane.smith@eventcompany.com"
 *                       phone: "+1234567890"
 *                       role: "organizer"
 *                       createdAt: "2024-01-15T10:30:00Z"
 *                       updatedAt: "2024-01-15T10:30:00Z"
 *                     tokens:
 *                       accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                       refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                       expiresIn: 3600
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *             examples:
 *               validation_error:
 *                 summary: Invalid credentials format
 *                 value:
 *                   success: false
 *                   message: "Validation failed"
 *                   errors:
 *                     - field: "email"
 *                       message: "Invalid email format"
 *                     - field: "password"
 *                       message: "Password is required"
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalid_credentials:
 *                 summary: Wrong email or password
 *                 value:
 *                   success: false
 *                   message: "Invalid credentials"
 *                   error: "Email or password is incorrect"
 *       404:
 *         description: Organizer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               organizer_not_found:
 *                 summary: Organizer does not exist
 *                 value:
 *                   success: false
 *                   message: "Organizer not found"
 *                   error: "No organizer found with this email address"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/login', validateBody(loginOrganizerSchema), loginOrganizer);

export default router;
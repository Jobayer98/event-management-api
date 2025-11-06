import { Router } from 'express';
import { registerUser, loginUser, requestPasswordReset, confirmPasswordReset } from '../controllers/authController';
import { validateBody } from '../../../middleware/validation';
import { registerUserSchema, loginUserSchema, resetPasswordRequestSchema, resetPasswordConfirmSchema } from '../../../schemas/auth';

const router = Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     description: Creates a new user account with email, password, name, and optional phone number
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
 *                 example: "John Doe"
 *                 description: "User's full name"
 *               email:
 *                 type: string
 *                 format: email
 *                 maxLength: 150
 *                 example: "john.doe@example.com"
 *                 description: "User's email address (must be unique)"
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 maxLength: 255
 *                 pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]"
 *                 example: "SecurePass123!"
 *                 description: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
 *               phone:
 *                 type: string
 *                 maxLength: 20
 *                 pattern: "^\\+?[\\d\\s\\-\\(\\)]+$"
 *                 example: "+1234567890"
 *                 description: "Optional phone number"
 *     responses:
 *       201:
 *         description: User registered successfully
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
 *                   example: "User registered successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     tokens:
 *                       $ref: '#/components/schemas/AuthTokens'
 *             examples:
 *               success:
 *                 summary: Successful registration
 *                 value:
 *                   success: true
 *                   message: "User registered successfully"
 *                   data:
 *                     user:
 *                       id: "123e4567-e89b-12d3-a456-426614174000"
 *                       name: "John Doe"
 *                       email: "john.doe@example.com"
 *                       phone: "+1234567890"
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
 *                   error: "A user with this email address is already registered"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               server_error:
 *                 summary: Server error
 *                 value:
 *                   success: false
 *                   message: "Internal server error"
 *                   error: "An unexpected error occurred"
 */
router.post('/register', validateBody(registerUserSchema), registerUser);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login user
 *     description: Authenticates a user with email and password, returns JWT tokens
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
 *                 example: "john.doe@example.com"
 *                 description: "User's email address"
 *               password:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 255
 *                 example: "SecurePass123!"
 *                 description: "User's password"
 *     responses:
 *       200:
 *         description: User logged in successfully
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
 *                   example: "User logged in successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     tokens:
 *                       $ref: '#/components/schemas/AuthTokens'
 *             examples:
 *               success:
 *                 summary: Successful login
 *                 value:
 *                   success: true
 *                   message: "User logged in successfully"
 *                   data:
 *                     user:
 *                       id: "123e4567-e89b-12d3-a456-426614174000"
 *                       name: "John Doe"
 *                       email: "john.doe@example.com"
 *                       phone: "+1234567890"
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
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               user_not_found:
 *                 summary: User does not exist
 *                 value:
 *                   success: false
 *                   message: "User not found"
 *                   error: "No user found with this email address"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/login', validateBody(loginUserSchema), loginUser);

/**
 * @swagger
 * /api/v1/auth/reset:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Request password reset
 *     description: Sends a password reset token to the user's email address
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 maxLength: 150
 *                 example: "john.doe@example.com"
 *                 description: "Email address of the user requesting password reset"
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
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
 *                   example: "Password reset email sent successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     resetToken:
 *                       type: string
 *                       example: "abc123def456ghi789"
 *                       description: "Reset token (only in development mode)"
 *             examples:
 *               success_production:
 *                 summary: Success in production (no token returned)
 *                 value:
 *                   success: true
 *                   message: "Password reset email sent successfully"
 *               success_development:
 *                 summary: Success in development (token returned for testing)
 *                 value:
 *                   success: true
 *                   message: "Password reset email sent successfully"
 *                   data:
 *                     resetToken: "abc123def456ghi789"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *             examples:
 *               validation_error:
 *                 summary: Invalid email format
 *                 value:
 *                   success: false
 *                   message: "Validation failed"
 *                   errors:
 *                     - field: "email"
 *                       message: "Invalid email format"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               user_not_found:
 *                 summary: Email not registered
 *                 value:
 *                   success: false
 *                   message: "User not found"
 *                   error: "No user found with this email address"
 *       429:
 *         description: Too many reset requests
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               rate_limit:
 *                 summary: Rate limit exceeded
 *                 value:
 *                   success: false
 *                   message: "Too many reset requests"
 *                   error: "Please wait before requesting another password reset"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/reset', validateBody(resetPasswordRequestSchema), requestPasswordReset);

/**
 * @swagger
 * /api/v1/auth/reset:
 *   put:
 *     tags:
 *       - Authentication
 *     summary: Confirm password reset
 *     description: Resets the user's password using a valid reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - newPassword
 *             properties:
 *               token:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 500
 *                 example: "abc123def456ghi789"
 *                 description: "Password reset token received via email"
 *               newPassword:
 *                 type: string
 *                 minLength: 8
 *                 maxLength: 255
 *                 pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]"
 *                 example: "NewSecurePass123!"
 *                 description: "New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
 *     responses:
 *       200:
 *         description: Password reset successfully
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
 *                   example: "Password reset successfully"
 *             examples:
 *               success:
 *                 summary: Password changed successfully
 *                 value:
 *                   success: true
 *                   message: "Password reset successfully"
 *       400:
 *         description: Validation error or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *             examples:
 *               validation_error:
 *                 summary: Invalid password format
 *                 value:
 *                   success: false
 *                   message: "Validation failed"
 *                   errors:
 *                     - field: "newPassword"
 *                       message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
 *               invalid_token:
 *                 summary: Invalid or expired token
 *                 value:
 *                   success: false
 *                   message: "Invalid reset token"
 *                   error: "The reset token is invalid or has expired"
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               user_not_found:
 *                 summary: User associated with token not found
 *                 value:
 *                   success: false
 *                   message: "User not found"
 *                   error: "No user found for this reset token"
 *       410:
 *         description: Token expired
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               token_expired:
 *                 summary: Reset token has expired
 *                 value:
 *                   success: false
 *                   message: "Reset token expired"
 *                   error: "The reset token has expired. Please request a new password reset"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/reset', validateBody(resetPasswordConfirmSchema), confirmPasswordReset);

export default router;
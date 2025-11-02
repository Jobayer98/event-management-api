/**
 * @swagger
 * components:
 *   schemas:
 *     # Request Schemas
 *     RegisterUserRequest:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           example: "John Doe"
 *           description: "User's full name"
 *         email:
 *           type: string
 *           format: email
 *           maxLength: 150
 *           example: "john.doe@example.com"
 *           description: "User's email address (must be unique)"
 *         password:
 *           type: string
 *           minLength: 8
 *           maxLength: 255
 *           pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]"
 *           example: "SecurePass123!"
 *           description: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
 *         phone:
 *           type: string
 *           maxLength: 20
 *           pattern: "^\\+?[\\d\\s\\-\\(\\)]+$"
 *           example: "+1234567890"
 *           description: "Optional phone number"
 * 
 *     LoginUserRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           maxLength: 150
 *           example: "john.doe@example.com"
 *           description: "User's email address"
 *         password:
 *           type: string
 *           minLength: 1
 *           maxLength: 255
 *           example: "SecurePass123!"
 *           description: "User's password"
 * 
 *     PasswordResetRequest:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           maxLength: 150
 *           example: "john.doe@example.com"
 *           description: "Email address of the user requesting password reset"
 * 
 *     PasswordResetConfirmRequest:
 *       type: object
 *       required:
 *         - token
 *         - newPassword
 *       properties:
 *         token:
 *           type: string
 *           minLength: 1
 *           maxLength: 500
 *           example: "abc123def456ghi789"
 *           description: "Password reset token received via email"
 *         newPassword:
 *           type: string
 *           minLength: 8
 *           maxLength: 255
 *           pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]"
 *           example: "NewSecurePass123!"
 *           description: "New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
 * 
 *     # Response Schemas
 *     AuthSuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "User logged in successfully"
 *         data:
 *           type: object
 *           properties:
 *             user:
 *               $ref: '#/components/schemas/User'
 *             tokens:
 *               $ref: '#/components/schemas/AuthTokens'
 *       required:
 *         - success
 *         - message
 *         - data
 * 
 *     PasswordResetResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Password reset email sent successfully"
 *         data:
 *           type: object
 *           properties:
 *             resetToken:
 *               type: string
 *               example: "abc123def456ghi789"
 *               description: "Reset token (only in development mode)"
 *       required:
 *         - success
 *         - message
 * 
 *     PasswordResetConfirmResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Password reset successfully"
 *       required:
 *         - success
 *         - message
 * 
 *     # Error Response Schemas
 *     ValidationError:
 *       type: object
 *       properties:
 *         field:
 *           type: string
 *           example: "email"
 *           description: "The field that failed validation"
 *         message:
 *           type: string
 *           example: "Invalid email format"
 *           description: "The validation error message"
 *       required:
 *         - field
 *         - message
 * 
 *     UnauthorizedError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Unauthorized"
 *         error:
 *           type: string
 *           example: "Invalid or expired token"
 *       required:
 *         - success
 *         - message
 * 
 *     ForbiddenError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Forbidden"
 *         error:
 *           type: string
 *           example: "Insufficient permissions"
 *       required:
 *         - success
 *         - message
 * 
 *     NotFoundError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Resource not found"
 *         error:
 *           type: string
 *           example: "The requested resource could not be found"
 *       required:
 *         - success
 *         - message
 * 
 *     ConflictError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Resource already exists"
 *         error:
 *           type: string
 *           example: "A user with this email already exists"
 *       required:
 *         - success
 *         - message
 * 
 *     RateLimitError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Rate limit exceeded"
 *         error:
 *           type: string
 *           example: "Too many requests. Please try again later"
 *         retryAfter:
 *           type: number
 *           example: 300
 *           description: "Seconds to wait before retrying"
 *       required:
 *         - success
 *         - message
 * 
 *     InternalServerError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Internal server error"
 *         error:
 *           type: string
 *           example: "An unexpected error occurred"
 *       required:
 *         - success
 *         - message
 */
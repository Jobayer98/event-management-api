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
 *
 *     # Event Schemas
 *     Event:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         eventType:
 *           type: string
 *           example: "Wedding Reception"
 *           description: "Type of event being organized"
 *         peopleCount:
 *           type: integer
 *           example: 150
 *           description: "Number of attendees"
 *         status:
 *           type: string
 *           enum: [pending, confirmed, cancelled]
 *           example: "confirmed"
 *           description: "Current status of the event"
 *         startTime:
 *           type: string
 *           format: date-time
 *           example: "2024-12-25T10:00:00.000Z"
 *           description: "Event start time"
 *         endTime:
 *           type: string
 *           format: date-time
 *           example: "2024-12-25T18:00:00.000Z"
 *           description: "Event end time"
 *         venue:
 *           $ref: '#/components/schemas/Venue'
 *         meal:
 *           allOf:
 *             - $ref: '#/components/schemas/Meal'
 *           nullable: true
 *           description: "Associated meal (optional)"
 *         user:
 *           $ref: '#/components/schemas/User'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00Z"
 *       required:
 *         - id
 *         - eventType
 *         - peopleCount
 *         - status
 *         - startTime
 *         - endTime
 *         - venue
 *         - user
 *         - createdAt
 *         - updatedAt
 *
 *     # Meal Schemas
 *     Meal:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         name:
 *           type: string
 *           example: "Deluxe Wedding Buffet"
 *           description: "Name of the meal"
 *         type:
 *           type: string
 *           enum: [veg, nonveg, buffet]
 *           example: "buffet"
 *           description: "Type of meal service"
 *         pricePerPerson:
 *           type: number
 *           example: 45.99
 *           description: "Cost per person for the meal"
 *         description:
 *           type: string
 *           nullable: true
 *           example: "International cuisine buffet with live cooking stations"
 *           description: "Detailed description of the meal"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00Z"
 *       required:
 *         - id
 *         - name
 *         - pricePerPerson
 *         - createdAt
 *         - updatedAt
 *
 *     # Venue Schema (referenced by Event)
 *     Venue:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "456e7890-e89b-12d3-a456-426614174001"
 *         name:
 *           type: string
 *           example: "Grand Ballroom"
 *         location:
 *           type: string
 *           example: "Downtown Convention Center"
 *         capacity:
 *           type: integer
 *           example: 200
 *         pricePerHour:
 *           type: number
 *           example: 150.00
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00Z"
 *       required:
 *         - id
 *         - name
 *         - location
 *         - capacity
 *         - pricePerHour
 *         - createdAt
 *         - updatedAt
 *
 *     # Pagination Schema
 *     Pagination:
 *       type: object
 *       properties:
 *         page:
 *           type: integer
 *           example: 1
 *           description: "Current page number"
 *         limit:
 *           type: integer
 *           example: 10
 *           description: "Number of items per page"
 *         total:
 *           type: integer
 *           example: 25
 *           description: "Total number of items"
 *         pages:
 *           type: integer
 *           example: 3
 *           description: "Total number of pages"
 *       required:
 *         - page
 *         - limit
 *         - total
 *         - pages
 *
 *     # Organizer Schema
 *     Organizer:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *         name:
 *           type: string
 *           example: "Jane Smith"
 *           description: "Organizer's full name"
 *         email:
 *           type: string
 *           format: email
 *           example: "jane.smith@eventcompany.com"
 *           description: "Organizer's email address"
 *         phone:
 *           type: string
 *           nullable: true
 *           example: "+1234567890"
 *           description: "Organizer's phone number"
 *         role:
 *           type: string
 *           example: "organizer"
 *           description: "User role with elevated privileges"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00Z"
 *       required:
 *         - id
 *         - name
 *         - email
 *         - role
 *         - createdAt
 *         - updatedAt
 */
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
 *         description:
 *           type: string
 *           nullable: true
 *           example: "International cuisine buffet with live cooking stations and premium beverages"
 *           description: "Detailed description of the meal"
 *         type:
 *           type: string
 *           enum: [veg, nonveg, buffet, plated]
 *           example: "buffet"
 *           description: "Type of meal"
 *         cuisine:
 *           type: string
 *           nullable: true
 *           example: "international"
 *           description: "Cuisine type"
 *         servingStyle:
 *           type: string
 *           enum: [buffet, plated, family_style]
 *           example: "buffet"
 *           description: "How the meal is served"
 *         pricePerPerson:
 *           type: number
 *           example: 75.99
 *           description: "Cost per person for the meal"
 *         minimumGuests:
 *           type: integer
 *           example: 50
 *           description: "Minimum number of guests required"
 *         menuItems:
 *           type: object
 *           nullable: true
 *           example: {
 *             "appetizers": ["Bruschetta", "Stuffed Mushrooms"],
 *             "main_course": ["Grilled Salmon", "Beef Tenderloin"],
 *             "desserts": ["Tiramisu", "Chocolate Cake"]
 *           }
 *           description: "Menu items organized by category"
 *         beverages:
 *           type: array
 *           items:
 *             type: string
 *             enum: [tea, coffee, soft_drinks, juices, water, mocktails, herbal_tea, fresh_juices, coconut_water, kombucha]
 *           example: ["tea", "coffee", "juices", "mocktails"]
 *           description: "Available beverages"
 *         specialDietary:
 *           type: array
 *           items:
 *             type: string
 *             enum: [halal, kosher, gluten_free, dairy_free, nut_free, vegan]
 *           example: ["halal", "gluten_free"]
 *           description: "Special dietary accommodations"
 *         serviceHours:
 *           type: object
 *           nullable: true
 *           properties:
 *             setup:
 *               type: number
 *               minimum: 0
 *               maximum: 24
 *             service:
 *               type: number
 *               minimum: 0
 *               maximum: 24
 *             cleanup:
 *               type: number
 *               minimum: 0
 *               maximum: 24
 *           example: { "setup": 2, "service": 4, "cleanup": 1 }
 *           description: "Service time breakdown in hours"
 *         staffIncluded:
 *           type: boolean
 *           example: true
 *           description: "Whether service staff is included"
 *         equipmentIncluded:
 *           type: boolean
 *           example: true
 *           description: "Whether serving equipment is included"
 *         images:
 *           type: array
 *           items:
 *             type: string
 *             format: uri
 *           example: ["https://example.com/meal1.jpg", "https://example.com/meal2.jpg"]
 *           description: "Array of food image URLs"
 *         isActive:
 *           type: boolean
 *           example: true
 *           description: "Whether the meal is active"
 *         isPopular:
 *           type: boolean
 *           example: false
 *           description: "Whether the meal is marked as popular"
 *         rating:
 *           type: number
 *           nullable: true
 *           minimum: 0
 *           maximum: 5
 *           example: 4.5
 *           description: "Average rating of the meal"
 *         totalReviews:
 *           type: integer
 *           example: 127
 *           description: "Total number of reviews"
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
 *         - type
 *         - servingStyle
 *         - pricePerPerson
 *         - minimumGuests
 *         - beverages
 *         - specialDietary
 *         - staffIncluded
 *         - equipmentIncluded
 *         - images
 *         - isActive
 *         - isPopular
 *         - totalReviews
 *         - createdAt
 *         - updatedAt
 *
 *     # Meal List Response (User - Basic Info)
 *     MealListItem:
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
 *       required:
 *         - id
 *         - name
 *
 *     # Admin Meal List Response (Detailed Info)
 *     AdminMealListItem:
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
 *         description:
 *           type: string
 *           nullable: true
 *           example: "International cuisine buffet with live cooking stations"
 *           description: "Detailed description of the meal"
 *         price_per_person:
 *           type: number
 *           example: 75.99
 *           description: "Cost per person for the meal"
 *         minimum_guests:
 *           type: integer
 *           example: 50
 *           description: "Minimum number of guests required"
 *         serving_style:
 *           type: string
 *           enum: [buffet, plated, family_style]
 *           example: "buffet"
 *           description: "How the meal is served"
 *         meal_type:
 *           type: string
 *           enum: [veg, nonveg, buffet, plated]
 *           example: "buffet"
 *           description: "Type of meal"
 *         cuisine:
 *           type: string
 *           nullable: true
 *           example: "international"
 *           description: "Cuisine type"
 *       required:
 *         - id
 *         - name
 *         - description
 *         - price_per_person
 *         - minimum_guests
 *         - serving_style
 *         - meal_type
 *         - cuisine
 *
 *     # Meal Request Schemas
 *     CreateMealRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           example: "Premium Wedding Buffet"
 *           description: "Name of the meal"
 *         description:
 *           type: string
 *           maxLength: 2000
 *           example: "Exquisite international cuisine buffet with live cooking stations"
 *           description: "Detailed description of the meal"
 *         type:
 *           type: string
 *           enum: [veg, nonveg, buffet, plated]
 *           example: "buffet"
 *           description: "Type of meal"
 *         cuisine:
 *           type: string
 *           maxLength: 50
 *           example: "international"
 *           description: "Cuisine type"
 *         servingStyle:
 *           type: string
 *           enum: [buffet, plated, family_style]
 *           example: "buffet"
 *           description: "How the meal is served"
 *         pricePerPerson:
 *           type: number
 *           minimum: 0
 *           maximum: 9999.99
 *           example: 75.99
 *           description: "Cost per person for the meal"
 *         minimumGuests:
 *           type: integer
 *           minimum: 1
 *           maximum: 10000
 *           example: 50
 *           description: "Minimum number of guests required"
 *         menuItems:
 *           type: object
 *           example: {
 *             "appetizers": ["Bruschetta", "Stuffed Mushrooms"],
 *             "main_course": ["Grilled Salmon", "Beef Tenderloin"],
 *             "desserts": ["Tiramisu", "Chocolate Cake"]
 *           }
 *           description: "Menu items organized by category"
 *         beverages:
 *           type: array
 *           items:
 *             type: string
 *             enum: [tea, coffee, soft_drinks, juices, water, mocktails, herbal_tea, fresh_juices, coconut_water, kombucha]
 *           example: ["tea", "coffee", "juices", "mocktails"]
 *           description: "Available beverages"
 *         specialDietary:
 *           type: array
 *           items:
 *             type: string
 *             enum: [halal, kosher, gluten_free, dairy_free, nut_free, vegan]
 *           example: ["halal", "gluten_free"]
 *           description: "Special dietary accommodations"
 *         serviceHours:
 *           type: object
 *           properties:
 *             setup:
 *               type: number
 *               minimum: 0
 *               maximum: 24
 *             service:
 *               type: number
 *               minimum: 0
 *               maximum: 24
 *             cleanup:
 *               type: number
 *               minimum: 0
 *               maximum: 24
 *           example: { "setup": 2, "service": 4, "cleanup": 1 }
 *           description: "Service time breakdown in hours"
 *         staffIncluded:
 *           type: boolean
 *           example: true
 *           description: "Whether service staff is included"
 *         equipmentIncluded:
 *           type: boolean
 *           example: true
 *           description: "Whether serving equipment is included"
 *         images:
 *           type: array
 *           items:
 *             type: string
 *             format: uri
 *           example: ["https://example.com/meal1.jpg", "https://example.com/meal2.jpg"]
 *           description: "Array of food image URLs"
 *         isActive:
 *           type: boolean
 *           example: true
 *           description: "Whether the meal is active"
 *         isPopular:
 *           type: boolean
 *           example: false
 *           description: "Whether the meal is marked as popular"
 *       required:
 *         - name
 *         - type
 *         - servingStyle
 *         - pricePerPerson
 *
 *     UpdateMealRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *           example: "Premium Wedding Buffet"
 *           description: "Updated name of the meal"
 *         description:
 *           type: string
 *           maxLength: 2000
 *           example: "Updated description of the meal"
 *           description: "Updated detailed description"
 *         type:
 *           type: string
 *           enum: [veg, nonveg, buffet, plated]
 *           example: "buffet"
 *           description: "Updated meal type"
 *         pricePerPerson:
 *           type: number
 *           minimum: 0
 *           maximum: 9999.99
 *           example: 85.99
 *           description: "Updated cost per person"
 *
 *     AdminUpdateMealRequest:
 *       allOf:
 *         - $ref: '#/components/schemas/CreateMealRequest'
 *         - type: object
 *           properties:
 *             rating:
 *               type: number
 *               minimum: 0
 *               maximum: 5
 *               example: 4.5
 *               description: "Meal rating (admin can update)"
 *             totalReviews:
 *               type: integer
 *               minimum: 0
 *               example: 127
 *               description: "Total number of reviews (admin can update)"
 *
 *     # Meal Response Schemas
 *     MealListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Meals retrieved successfully"
 *         data:
 *           type: object
 *           properties:
 *             meals:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MealListItem'
 *             pagination:
 *               $ref: '#/components/schemas/Pagination'
 *           required:
 *             - meals
 *             - pagination
 *       required:
 *         - success
 *         - message
 *         - data
 *
 *     AdminMealListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Meals retrieved successfully"
 *         data:
 *           type: object
 *           properties:
 *             meals:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AdminMealListItem'
 *             pagination:
 *               $ref: '#/components/schemas/Pagination'
 *           required:
 *             - meals
 *             - pagination
 *       required:
 *         - success
 *         - message
 *         - data
 *
 *     MealDetailResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Meal retrieved successfully"
 *         data:
 *           type: object
 *           properties:
 *             meal:
 *               $ref: '#/components/schemas/Meal'
 *           required:
 *             - meal
 *       required:
 *         - success
 *         - message
 *         - data
 *
 *     MealCreateResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Meal created successfully"
 *         data:
 *           type: object
 *           properties:
 *             meal:
 *               $ref: '#/components/schemas/Meal'
 *           required:
 *             - meal
 *       required:
 *         - success
 *         - message
 *         - data
 *
 *     MealUpdateResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Meal updated successfully"
 *         data:
 *           type: object
 *           properties:
 *             meal:
 *               $ref: '#/components/schemas/Meal'
 *           required:
 *             - meal
 *       required:
 *         - success
 *         - message
 *         - data
 *
 *     MealDeleteResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Meal deleted successfully"
 *       required:
 *         - success
 *         - message
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
 *         pricePerDay:
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
 *         - pricePerDay
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
 *
 *     # Payment Schemas
 *     PaymentMethod:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           enum: [card, bkash, nagad, rocket, bank_transfer]
 *           example: "bkash"
 *           description: "Payment method identifier"
 *         name:
 *           type: string
 *           example: "bKash"
 *           description: "Display name of the payment method"
 *         description:
 *           type: string
 *           example: "Pay using bKash mobile financial service"
 *           description: "Description of the payment method"
 *       required:
 *         - id
 *         - name
 *         - description
 *
 *     Payment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *           description: "Unique payment identifier"
 *         eventId:
 *           type: string
 *           format: uuid
 *           example: "456e7890-e89b-12d3-a456-426614174001"
 *           description: "Associated event ID"
 *         amount:
 *           type: number
 *           format: decimal
 *           example: 15750.50
 *           description: "Payment amount in BDT"
 *         method:
 *           type: string
 *           enum: [card, bkash, nagad, rocket, bank_transfer]
 *           example: "bkash"
 *           description: "Payment method used"
 *         status:
 *           type: string
 *           enum: [pending, success, failed, refunded]
 *           example: "success"
 *           description: "Current payment status"
 *         transactionId:
 *           type: string
 *           example: "BKS1703845200ABC123"
 *           description: "Unique transaction identifier from payment provider"
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00Z"
 *           description: "Payment creation timestamp"
 *       required:
 *         - id
 *         - eventId
 *         - amount
 *         - method
 *         - status
 *         - transactionId
 *         - createdAt
 *
 *     CostBreakdown:
 *       type: object
 *       properties:
 *         venueCost:
 *           type: number
 *           format: decimal
 *           example: 12000.00
 *           description: "Total venue rental cost"
 *         mealCost:
 *           type: number
 *           format: decimal
 *           example: 4500.00
 *           description: "Total meal cost"
 *         subtotal:
 *           type: number
 *           format: decimal
 *           example: 16500.00
 *           description: "Subtotal before taxes and fees"
 *         tax:
 *           type: number
 *           format: decimal
 *           example: 1320.00
 *           description: "Tax amount (8%)"
 *         serviceFee:
 *           type: number
 *           format: decimal
 *           example: 825.00
 *           description: "Service fee (5%)"
 *         totalAmount:
 *           type: number
 *           format: decimal
 *           example: 18645.00
 *           description: "Final total amount"
 *         breakdown:
 *           type: object
 *           properties:
 *             venue:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "Grand Ballroom"
 *                 pricePerDay:
 *                   type: number
 *                   example: 6000.00
 *                 days:
 *                   type: integer
 *                   example: 2
 *                 cost:
 *                   type: number
 *                   example: 12000.00
 *               required:
 *                 - name
 *                 - pricePerDay
 *                 - days
 *                 - cost
 *             meal:
 *               type: object
 *               nullable: true
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "Deluxe Wedding Buffet"
 *                 pricePerPerson:
 *                   type: number
 *                   example: 45.00
 *                 people:
 *                   type: integer
 *                   example: 100
 *                 cost:
 *                   type: number
 *                   example: 4500.00
 *               required:
 *                 - name
 *                 - pricePerPerson
 *                 - people
 *                 - cost
 *             fees:
 *               type: object
 *               properties:
 *                 tax:
 *                   type: number
 *                   example: 1320.00
 *                 serviceFee:
 *                   type: number
 *                   example: 825.00
 *               required:
 *                 - tax
 *                 - serviceFee
 *           required:
 *             - venue
 *             - fees
 *       required:
 *         - venueCost
 *         - mealCost
 *         - subtotal
 *         - tax
 *         - serviceFee
 *         - totalAmount
 *         - breakdown
 *
 *     # Payment Request Schemas
 *     CalculateCostRequest:
 *       type: object
 *       properties:
 *         venueId:
 *           type: string
 *           format: uuid
 *           example: "456e7890-e89b-12d3-a456-426614174001"
 *           description: "ID of the venue to book"
 *         mealId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           example: "789e0123-e89b-12d3-a456-426614174002"
 *           description: "ID of the meal package (optional)"
 *         peopleCount:
 *           type: integer
 *           minimum: 1
 *           maximum: 10000
 *           example: 100
 *           description: "Number of attendees"
 *         startTime:
 *           type: string
 *           format: date-time
 *           example: "2024-12-25T10:00:00.000Z"
 *           description: "Event start time"
 *         endTime:
 *           type: string
 *           format: date-time
 *           example: "2024-12-25T22:00:00.000Z"
 *           description: "Event end time (must be after start time)"
 *       required:
 *         - venueId
 *         - peopleCount
 *         - startTime
 *         - endTime
 *
 *     ProcessPaymentRequest:
 *       type: object
 *       properties:
 *         paymentMethod:
 *           type: string
 *           enum: [card, bkash, nagad, rocket, bank_transfer]
 *           example: "bkash"
 *           description: "Payment method to use"
 *         venueId:
 *           type: string
 *           format: uuid
 *           example: "456e7890-e89b-12d3-a456-426614174001"
 *           description: "ID of the venue to book"
 *         mealId:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           example: "789e0123-e89b-12d3-a456-426614174002"
 *           description: "ID of the meal package (optional)"
 *         peopleCount:
 *           type: integer
 *           minimum: 1
 *           maximum: 10000
 *           example: 100
 *           description: "Number of attendees"
 *         startTime:
 *           type: string
 *           format: date-time
 *           example: "2024-12-25T10:00:00.000Z"
 *           description: "Event start time"
 *         endTime:
 *           type: string
 *           format: date-time
 *           example: "2024-12-25T22:00:00.000Z"
 *           description: "Event end time (must be after start time)"
 *         eventType:
 *           type: string
 *           maxLength: 100
 *           example: "Wedding Reception"
 *           description: "Type of event (optional)"
 *       required:
 *         - paymentMethod
 *         - venueId
 *         - peopleCount
 *         - startTime
 *         - endTime
 *
 *     PaymentStatusRequest:
 *       type: object
 *       properties:
 *         transactionId:
 *           type: string
 *           minLength: 1
 *           example: "BKS1703845200ABC123"
 *           description: "Transaction ID to check status for"
 *       required:
 *         - transactionId
 *
 *     RefundPaymentRequest:
 *       type: object
 *       properties:
 *         paymentId:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *           description: "ID of the payment to refund"
 *         reason:
 *           type: string
 *           minLength: 10
 *           maxLength: 500
 *           example: "Event cancelled due to weather conditions"
 *           description: "Reason for requesting the refund"
 *       required:
 *         - paymentId
 *         - reason
 *
 *     WebhookPayload:
 *       type: object
 *       properties:
 *         transactionId:
 *           type: string
 *           example: "BKS1703845200ABC123"
 *           description: "Transaction ID from payment provider"
 *         status:
 *           type: string
 *           enum: [success, failed, pending]
 *           example: "success"
 *           description: "Updated payment status"
 *         amount:
 *           type: number
 *           format: decimal
 *           example: 15750.50
 *           description: "Payment amount"
 *         method:
 *           type: string
 *           example: "bkash"
 *           description: "Payment method used"
 *         timestamp:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00Z"
 *           description: "Webhook timestamp"
 *         signature:
 *           type: string
 *           example: "sha256=abc123def456..."
 *           description: "Webhook signature for verification"
 *       required:
 *         - transactionId
 *         - status
 *         - amount
 *         - method
 *         - timestamp
 *
 *     RefundWebhookPayload:
 *       allOf:
 *         - $ref: '#/components/schemas/WebhookPayload'
 *         - type: object
 *           properties:
 *             originalTransactionId:
 *               type: string
 *               example: "BKS1703845200ABC123"
 *               description: "Original transaction ID being refunded"
 *           required:
 *             - originalTransactionId
 *
 *     # Payment Response Schemas
 *     PaymentMethodsResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Payment methods retrieved successfully"
 *         data:
 *           type: object
 *           properties:
 *             paymentMethods:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PaymentMethod'
 *           required:
 *             - paymentMethods
 *       required:
 *         - success
 *         - message
 *         - data
 *
 *     CalculateCostResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Cost calculated successfully"
 *         data:
 *           type: object
 *           properties:
 *             costBreakdown:
 *               $ref: '#/components/schemas/CostBreakdown'
 *             paymentMethods:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PaymentMethod'
 *             venue:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 name:
 *                   type: string
 *                 pricePerDay:
 *                   type: number
 *               required:
 *                 - id
 *                 - name
 *                 - pricePerDay
 *             meal:
 *               type: object
 *               nullable: true
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 name:
 *                   type: string
 *                 pricePerPerson:
 *                   type: number
 *               required:
 *                 - id
 *                 - name
 *                 - pricePerPerson
 *           required:
 *             - costBreakdown
 *             - paymentMethods
 *             - venue
 *       required:
 *         - success
 *         - message
 *         - data
 *
 *     ProcessPaymentResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Payment processed successfully and event booked!"
 *         data:
 *           type: object
 *           properties:
 *             event:
 *               allOf:
 *                 - $ref: '#/components/schemas/Event'
 *                 - type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: "confirmed"
 *             payment:
 *               $ref: '#/components/schemas/Payment'
 *             transactionId:
 *               type: string
 *               example: "BKS1703845200ABC123"
 *             costBreakdown:
 *               $ref: '#/components/schemas/CostBreakdown'
 *           required:
 *             - event
 *             - payment
 *             - transactionId
 *             - costBreakdown
 *       required:
 *         - success
 *         - message
 *         - data
 *
 *     PaymentStatusResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Payment status retrieved successfully"
 *         data:
 *           type: object
 *           properties:
 *             payment:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 status:
 *                   type: string
 *                   enum: [pending, success, failed, refunded]
 *                 amount:
 *                   type: number
 *                 method:
 *                   type: string
 *                 transactionId:
 *                   type: string
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *               required:
 *                 - id
 *                 - status
 *                 - amount
 *                 - method
 *                 - transactionId
 *                 - createdAt
 *           required:
 *             - payment
 *       required:
 *         - success
 *         - message
 *         - data
 *
 *     RefundPaymentResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Refund processed successfully"
 *         data:
 *           type: object
 *           properties:
 *             refund:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "REF_123e4567-e89b-12d3-a456-426614174000"
 *                 paymentId:
 *                   type: string
 *                   format: uuid
 *                 transactionId:
 *                   type: string
 *                   example: "REF1703845200XYZ789"
 *                 amount:
 *                   type: number
 *                 reason:
 *                   type: string
 *                 processedAt:
 *                   type: string
 *                   format: date-time
 *                 status:
 *                   type: string
 *                   example: "processed"
 *               required:
 *                 - id
 *                 - paymentId
 *                 - transactionId
 *                 - amount
 *                 - reason
 *                 - processedAt
 *                 - status
 *             originalPayment:
 *               $ref: '#/components/schemas/Payment'
 *           required:
 *             - refund
 *             - originalPayment
 *       required:
 *         - success
 *         - message
 *         - data
 *
 *     PaymentHistoryResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Payment history retrieved successfully"
 *         data:
 *           type: object
 *           properties:
 *             payments:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Payment'
 *                   - type: object
 *                     properties:
 *                       event:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           eventType:
 *                             type: string
 *                           startTime:
 *                             type: string
 *                             format: date-time
 *                           endTime:
 *                             type: string
 *                             format: date-time
 *                           venue:
 *                             type: object
 *                             properties:
 *                               id:
 *                                 type: string
 *                                 format: uuid
 *                               name:
 *                                 type: string
 *                             required:
 *                               - id
 *                               - name
 *                           meal:
 *                             type: object
 *                             nullable: true
 *                             properties:
 *                               id:
 *                                 type: string
 *                                 format: uuid
 *                               name:
 *                                 type: string
 *                             required:
 *                               - id
 *                               - name
 *                         required:
 *                           - id
 *                           - eventType
 *                           - startTime
 *                           - endTime
 *                           - venue
 *                     required:
 *                       - event
 *             pagination:
 *               allOf:
 *                 - $ref: '#/components/schemas/Pagination'
 *                 - type: object
 *                   properties:
 *                     totalPages:
 *                       type: integer
 *                       example: 3
 *                   required:
 *                     - totalPages
 *             summary:
 *               type: object
 *               properties:
 *                 totalAmount:
 *                   type: number
 *                   example: 125000.00
 *                   description: "Total amount of successful payments"
 *                 successfulPayments:
 *                   type: integer
 *                   example: 8
 *                   description: "Number of successful payments"
 *                 failedPayments:
 *                   type: integer
 *                   example: 2
 *                   description: "Number of failed payments"
 *                 refundedPayments:
 *                   type: integer
 *                   example: 1
 *                   description: "Number of refunded payments"
 *               required:
 *                 - totalAmount
 *                 - successfulPayments
 *                 - failedPayments
 *                 - refundedPayments
 *           required:
 *             - payments
 *             - pagination
 *             - summary
 *       required:
 *         - success
 *         - message
 *         - data
 *
 *     WebhookResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Webhook processed successfully"
 *         transactionId:
 *           type: string
 *           example: "BKS1703845200ABC123"
 *       required:
 *         - success
 *         - message
 *         - transactionId
 *//**
 *
 @swagger
 * components:
 *   schemas:
 *     # Analytics Schemas
 *     DashboardStats:
 *       type: object
 *       properties:
 *         totalEvents:
 *           type: integer
 *           example: 1250
 *           description: "Total number of events"
 *         totalRevenue:
 *           type: number
 *           format: decimal
 *           example: 2875000.50
 *           description: "Total revenue generated"
 *         averageEventValue:
 *           type: number
 *           format: decimal
 *           example: 2300.00
 *           description: "Average value per event"
 *         totalUsers:
 *           type: integer
 *           example: 850
 *           description: "Total number of registered users"
 *         totalVenues:
 *           type: integer
 *           example: 45
 *           description: "Total number of venues"
 *         totalMeals:
 *           type: integer
 *           example: 120
 *           description: "Total number of meal packages"
 *         recentEvents:
 *           type: integer
 *           example: 75
 *           description: "Number of events in the last 30 days"
 *         pendingEvents:
 *           type: integer
 *           example: 25
 *           description: "Number of pending events"
 *         confirmedEvents:
 *           type: integer
 *           example: 980
 *           description: "Number of confirmed events"
 *         cancelledEvents:
 *           type: integer
 *           example: 245
 *           description: "Number of cancelled events"
 *       required:
 *         - totalEvents
 *         - totalRevenue
 *         - averageEventValue
 *         - totalUsers
 *         - totalVenues
 *         - totalMeals
 *         - recentEvents
 *         - pendingEvents
 *         - confirmedEvents
 *         - cancelledEvents
 *
 *     RevenueAnalytics:
 *       type: object
 *       properties:
 *         period:
 *           type: string
 *           example: "2024-03"
 *           description: "Time period (format depends on groupBy parameter)"
 *         totalRevenue:
 *           type: number
 *           format: decimal
 *           example: 125000.50
 *           description: "Total revenue for the period"
 *         eventCount:
 *           type: integer
 *           example: 45
 *           description: "Number of events in the period"
 *         averageEventValue:
 *           type: number
 *           format: decimal
 *           example: 2777.78
 *           description: "Average revenue per event"
 *       required:
 *         - period
 *         - totalRevenue
 *         - eventCount
 *         - averageEventValue
 *
 *     TopVenue:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "456e7890-e89b-12d3-a456-426614174001"
 *           description: "Venue ID"
 *         name:
 *           type: string
 *           example: "Grand Ballroom"
 *           description: "Venue name"
 *         eventCount:
 *           type: integer
 *           example: 85
 *           description: "Number of events hosted"
 *         totalRevenue:
 *           type: number
 *           format: decimal
 *           example: 425000.00
 *           description: "Total revenue generated"
 *         averageEventValue:
 *           type: number
 *           format: decimal
 *           example: 5000.00
 *           description: "Average revenue per event"
 *       required:
 *         - id
 *         - name
 *         - eventCount
 *         - totalRevenue
 *         - averageEventValue
 *
 *     TopMeal:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: "789e0123-e89b-12d3-a456-426614174002"
 *           description: "Meal ID"
 *         name:
 *           type: string
 *           example: "Premium Wedding Buffet"
 *           description: "Meal name"
 *         orderCount:
 *           type: integer
 *           example: 65
 *           description: "Number of times ordered"
 *         totalRevenue:
 *           type: number
 *           format: decimal
 *           example: 195000.00
 *           description: "Total revenue generated"
 *         averageOrderValue:
 *           type: number
 *           format: decimal
 *           example: 3000.00
 *           description: "Average revenue per order"
 *       required:
 *         - id
 *         - name
 *         - orderCount
 *         - totalRevenue
 *         - averageOrderValue
 *
 *     EventTypeAnalytics:
 *       type: object
 *       properties:
 *         eventType:
 *           type: string
 *           example: "Wedding Reception"
 *           description: "Type of event"
 *         count:
 *           type: integer
 *           example: 320
 *           description: "Number of events of this type"
 *         totalRevenue:
 *           type: number
 *           format: decimal
 *           example: 1280000.00
 *           description: "Total revenue from this event type"
 *         averageValue:
 *           type: number
 *           format: decimal
 *           example: 4000.00
 *           description: "Average revenue per event of this type"
 *         percentage:
 *           type: number
 *           format: decimal
 *           example: 25.6
 *           description: "Percentage of total events"
 *       required:
 *         - eventType
 *         - count
 *         - totalRevenue
 *         - averageValue
 *         - percentage
 *
 *   tags:
 *     - name: Admin Analytics
 *       description: Analytics and reporting endpoints for administrators
 *
 *   responses:
 *     BadRequest:
 *       description: Bad request - Invalid input parameters
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               success:
 *                 type: boolean
 *                 example: false
 *               message:
 *                 type: string
 *                 example: "Invalid request parameters"
 *               errors:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/ValidationError'
 *             required:
 *               - success
 *               - message
 *
 *     Unauthorized:
 *       description: Unauthorized - Authentication required
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UnauthorizedError'
 *
 *     Forbidden:
 *       description: Forbidden - Insufficient permissions
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ForbiddenError'
 *
 *     InternalServerError:
 *       description: Internal server error
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InternalServerError'
 */
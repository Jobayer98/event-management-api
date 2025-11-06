
import { Router } from "express";
import { authenticateToken, requireRole } from "../../../middleware/auth";
import { validateBody } from "../../../middleware/validation";
import { createVenueSchema, updateVenueSchema } from "../../../schemas/venue";
import { createVenue, deleteVenue, getVenues, updateVenue } from "../controllers/venueController";

const router = Router();


/**
 * @swagger
 * /api/v1/admin/venues:
 *   get:
 *     tags:
 *       - Admin - Venues
 *     summary: Get venues
 *     description: Retrieve a paginated list of available venues with comprehensive filtering options
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of venues per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           maxLength: 100
 *         description: Search venues by name, address, or description
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *           maxLength: 100
 *         description: Filter by city
 *       - in: query
 *         name: venueType
 *         schema:
 *           type: string
 *           enum: [indoor, outdoor, hybrid]
 *         description: Filter by venue type
 *       - in: query
 *         name: minCapacity
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Minimum capacity filter
 *       - in: query
 *         name: maxCapacity
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Maximum capacity filter
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Minimum price per hour filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Maximum price per hour filter
 *       - in: query
 *         name: facilities
 *         schema:
 *           type: string
 *         description: Comma-separated list of required facilities (e.g., "parking,ac,wifi")
 *       - in: query
 *         name: amenities
 *         schema:
 *           type: string
 *         description: Comma-separated list of required amenities (e.g., "bridal_room,dance_floor")
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, capacity, pricePerDay, rating, createdAt]
 *           default: createdAt
 *         description: Sort venues by field
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Venues retrieved successfully
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
 *                   example: "Venues retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     venues:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Venue'
 *                     pagination:
 *                       $ref: '#/components/schemas/Pagination'
 *             examples:
 *               success:
 *                 summary: Successful venues retrieval
 *                 value:
 *                   success: true
 *                   message: "Venues retrieved successfully"
 *                   data:
 *                     venues:
 *                       - id: "123e4567-e89b-12d3-a456-426614174000"
 *                         name: "Grand Ballroom"
 *                         address: "123 Main St, Downtown"
 *                         capacity: 200
 *                         pricePerDay: 5500.00
 *                         description: "Elegant ballroom perfect for weddings"
 *                         createdAt: "2024-01-15T10:30:00Z"
 *                         updatedAt: "2024-01-15T10:30:00Z"
 *                       - id: "456e7890-e89b-12d3-a456-426614174001"
 *                         name: "Conference Center"
 *                         address: "456 Business Ave, Uptown"
 *                         capacity: 100
 *                         pricePerDay: 7500.00
 *                         description: "Modern conference facility"
 *                         createdAt: "2024-01-15T10:30:00Z"
 *                         updatedAt: "2024-01-15T10:30:00Z"
 *                     pagination:
 *                       page: 1
 *                       limit: 10
 *                       total: 25
 *                       pages: 3
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */   
router.get('/', getVenues);

/**
 * @swagger
 * /api/v1/admin/venues:
 *   post:
 *     tags:
 *       - Admin - Venues
 *     summary: Create new venue
 *     description: Create a new venue with comprehensive details (admin access required)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - address
 *               - city
 *               - state
 *               - capacity
 *               - venueType
 *               - pricePerDay
 *               - servingStyle
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 150
 *                 example: "Grand Ballroom"
 *                 description: "Name of the venue"
 *               description:
 *                 type: string
 *                 maxLength: 2000
 *                 example: "Elegant ballroom perfect for weddings and corporate events"
 *                 description: "Detailed description of the venue"
 *               address:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 500
 *                 example: "123 Main Street, Downtown City"
 *                 description: "Physical address of the venue"
 *               city:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: "Dhaka"
 *                 description: "City where the venue is located"
 *               state:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: "Dhaka Division"
 *                 description: "State or division"
 *               zipCode:
 *                 type: string
 *                 maxLength: 20
 *                 example: "1000"
 *                 description: "Postal/ZIP code"
 *               country:
 *                 type: string
 *                 maxLength: 100
 *                 example: "Bangladesh"
 *                 description: "Country (defaults to Bangladesh)"
 *               latitude:
 *                 type: number
 *                 minimum: -90
 *                 maximum: 90
 *                 example: 23.8103
 *                 description: "GPS latitude coordinate"
 *               longitude:
 *                 type: number
 *                 minimum: -180
 *                 maximum: 180
 *                 example: 90.4125
 *                 description: "GPS longitude coordinate"
 *               capacity:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 10000
 *                 example: 500
 *                 description: "Maximum number of people the venue can accommodate"
 *               area:
 *                 type: number
 *                 minimum: 0
 *                 example: 5000.00
 *                 description: "Area in square feet"
 *               venueType:
 *                 type: string
 *                 enum: [indoor, outdoor, hybrid]
 *                 example: "indoor"
 *                 description: "Type of venue"
 *               pricePerDay:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 999999.99
 *                 example: 25000.00
 *                 description: "Daily rental rate"
 *               minimumDays:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 365
 *                 example: 1
 *                 description: "Minimum booking days"
 *               securityDeposit:
 *                 type: number
 *                 minimum: 0
 *                 example: 5000.00
 *                 description: "Security deposit amount"
 *               facilities:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [parking, ac, wifi, sound_system, lighting, stage, kitchen, restrooms, wheelchair_accessible, projector, elevator, garden]
 *                 example: ["parking", "ac", "wifi", "sound_system"]
 *                 description: "Available facilities"
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [bridal_room, groom_room, vip_lounge, dance_floor, bar_area, outdoor_space, gazebo, fountain]
 *                 example: ["bridal_room", "dance_floor"]
 *                 description: "Available amenities"
 *               cateringAllowed:
 *                 type: boolean
 *                 example: true
 *                 description: "Whether catering is allowed"
 *               decorationAllowed:
 *                 type: boolean
 *                 example: true
 *                 description: "Whether decoration is allowed"
 *               alcoholAllowed:
 *                 type: boolean
 *                 example: false
 *                 description: "Whether alcohol is allowed"
 *               smokingAllowed:
 *                 type: boolean
 *                 example: false
 *                 description: "Whether smoking is allowed"
 *               petFriendly:
 *                 type: boolean
 *                 example: false
 *                 description: "Whether pets are allowed"
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *                 example: ["https://example.com/venue1.jpg", "https://example.com/venue2.jpg"]
 *                 description: "Array of image URLs"
 *               virtualTourUrl:
 *                 type: string
 *                 format: uri
 *                 example: "https://example.com/virtual-tour"
 *                 description: "Virtual tour URL"
 *               contactPerson:
 *                 type: string
 *                 maxLength: 100
 *                 example: "Ahmed Hassan"
 *                 description: "Contact person name"
 *               contactPhone:
 *                 type: string
 *                 maxLength: 20
 *                 example: "+8801712345678"
 *                 description: "Contact phone number"
 *               contactEmail:
 *                 type: string
 *                 format: email
 *                 maxLength: 150
 *                 example: "contact@venue.com"
 *                 description: "Contact email address"
 *               operatingHours:
 *                 type: object
 *                 example: {
 *                   "monday": {"open": "09:00", "close": "23:00"},
 *                   "tuesday": {"open": "09:00", "close": "23:00"}
 *                 }
 *                 description: "Operating hours for each day"
 *               isActive:
 *                 type: boolean
 *                 example: true
 *                 description: "Whether the venue is active"
 *     responses:
 *       201:
 *         description: Venue created successfully
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
 *                   example: "Venue created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     venue:
 *                       $ref: '#/components/schemas/Venue'
 *             examples:
 *               success:
 *                 summary: Venue created successfully
 *                 value:
 *                   success: true
 *                   message: "Venue created successfully"
 *                   data:
 *                     venue:
 *                       id: "123e4567-e89b-12d3-a456-426614174000"
 *                       name: "Grand Ballroom"
 *                       address: "123 Main Street, Downtown City"
 *                       capacity: 200
 *                       pricePerDay: 15000.00
 *                       description: "Elegant ballroom with crystal chandeliers"
 *                       createdAt: "2024-01-15T10:30:00Z"
 *                       updatedAt: "2024-01-15T10:30:00Z"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *             examples:
 *               validation_error:
 *                 summary: Invalid venue data
 *                 value:
 *                   success: false
 *                   message: "Validation failed"
 *                   errors:
 *                     - field: "name"
 *                       message: "Venue name must be at least 2 characters"
 *                     - field: "pricePerDay"
 *                       message: "Price per hour cannot be negative"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 *       403:
 *         description: Forbidden - Organizer access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForbiddenError'
 *             examples:
 *               insufficient_permissions:
 *                 summary: Not an organizer
 *                 value:
 *                   success: false
 *                   message: "Forbidden"
 *                   error: "Organizer access required to create venues"
 *       409:
 *         description: Venue name already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               name_exists:
 *                 summary: Duplicate venue name
 *                 value:
 *                   success: false
 *                   message: "Venue name already exists"
 *                   error: "A venue with this name already exists"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', validateBody(createVenueSchema), authenticateToken, requireRole(['organizer']), createVenue);

/**
 * @swagger
 * /api/v1/admin/venues/{id}:
 *   put:
 *     tags:
 *       - Admin - Venues
 *     summary: Update venue
 *     description: Update venue details (organizer access required)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Venue ID
 *         example: "123e4567-e89b-12d3-a456-426614174000"
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
 *                 maxLength: 150
 *                 example: "Premium Grand Ballroom"
 *                 description: "Updated name of the venue"
 *               address:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 500
 *                 example: "456 Premium Street, Downtown City, State 12345"
 *                 description: "Updated physical address of the venue"
 *               capacity:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 10000
 *                 example: 250
 *                 description: "Updated maximum capacity"
 *               pricePerDay:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 999999.99
 *                 example: 7500.00
 *                 description: "Updated daily rental rate"
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *                 example: "Premium ballroom with upgraded amenities and modern lighting"
 *                 description: "Updated detailed description"
 *             minProperties: 1
 *     responses:
 *       200:
 *         description: Venue updated successfully
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
 *                   example: "Venue updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     venue:
 *                       $ref: '#/components/schemas/Venue'
 *             examples:
 *               success:
 *                 summary: Venue updated successfully
 *                 value:
 *                   success: true
 *                   message: "Venue updated successfully"
 *                   data:
 *                     venue:
 *                       id: "123e4567-e89b-12d3-a456-426614174000"
 *                       name: "Premium Grand Ballroom"
 *                       address: "456 Premium Street, Downtown City"
 *                       capacity: 250
 *                       pricePerDay: 17500.00
 *                       description: "Premium ballroom with upgraded amenities"
 *                       createdAt: "2024-01-15T10:30:00Z"
 *                       updatedAt: "2024-01-15T11:30:00Z"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *             examples:
 *               validation_error:
 *                 summary: Invalid venue data
 *                 value:
 *                   success: false
 *                   message: "Validation failed"
 *                   errors:
 *                     - field: "capacity"
 *                       message: "Capacity cannot exceed 10,000"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 *       403:
 *         description: Forbidden - Organizer access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForbiddenError'
 *       404:
 *         description: Venue not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Venue name already exists
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
router.put('/:id', validateBody(updateVenueSchema), authenticateToken, requireRole(['organizer']), updateVenue);

/**
 * @swagger
 * /api/v1/admin/venues/{id}:
 *   delete:
 *     tags:
 *       - Admin - Venues
 *     summary: Delete venue
 *     description: Delete a venue (organizer access required). Cannot delete venues that have associated events.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Venue ID
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Venue deleted successfully
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
 *                   example: "Venue deleted successfully"
 *             examples:
 *               success:
 *                 summary: Venue deleted successfully
 *                 value:
 *                   success: true
 *                   message: "Venue deleted successfully"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 *       403:
 *         description: Forbidden - Organizer access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForbiddenError'
 *       404:
 *         description: Venue not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               venue_not_found:
 *                 summary: Venue does not exist
 *                 value:
 *                   success: false
 *                   message: "Venue not found"
 *                   error: "No venue found with the specified ID"
 *       409:
 *         description: Cannot delete venue - has associated events
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               venue_in_use:
 *                 summary: Venue has associated events
 *                 value:
 *                   success: false
 *                   message: "Cannot delete venue"
 *                   error: "This venue has associated events and cannot be deleted"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', authenticateToken, requireRole(['organizer']), deleteVenue);

export default router;
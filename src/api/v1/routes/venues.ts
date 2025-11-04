import { Router } from 'express';
import { 
  createVenue, 
  getVenueById, 
  updateVenue, 
  deleteVenue, 
  getVenues 
} from '../controllers/venueController';
import { validateBody } from '../../../middleware/validation';
import { authenticateToken, requireRole } from '../../../middleware/auth';
import { createVenueSchema, updateVenueSchema, venueQuerySchema } from '../../../schemas/venue';

const router = Router();

/**
 * @swagger
 * /api/v1/venues:
 *   get:
 *     tags:
 *       - Venues
 *     summary: Get venues
 *     description: Retrieve a paginated list of available venues with optional filters
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
 *         description: Search venues by name or address
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
 *                         pricePerHour: 150.00
 *                         description: "Elegant ballroom perfect for weddings"
 *                         createdAt: "2024-01-15T10:30:00Z"
 *                         updatedAt: "2024-01-15T10:30:00Z"
 *                       - id: "456e7890-e89b-12d3-a456-426614174001"
 *                         name: "Conference Center"
 *                         address: "456 Business Ave, Uptown"
 *                         capacity: 100
 *                         pricePerHour: 75.00
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
 * /api/v1/venues:
 *   post:
 *     tags:
 *       - Venues
 *     summary: Create new venue
 *     description: Create a new venue (organizer access required)
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
 *               - pricePerHour
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 150
 *                 example: "Grand Ballroom"
 *                 description: "Name of the venue"
 *               address:
 *                 type: string
 *                 minLength: 5
 *                 maxLength: 500
 *                 example: "123 Main Street, Downtown City, State 12345"
 *                 description: "Physical address of the venue"
 *               capacity:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 10000
 *                 example: 200
 *                 description: "Maximum number of people the venue can accommodate"
 *               pricePerHour:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 999999.99
 *                 example: 150.00
 *                 description: "Hourly rental rate for the venue"
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *                 example: "Elegant ballroom with crystal chandeliers, perfect for weddings and formal events"
 *                 description: "Detailed description of the venue and its amenities"
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
 *                       pricePerHour: 150.00
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
 *                     - field: "pricePerHour"
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
 * /api/v1/venues/{id}:
 *   get:
 *     tags:
 *       - Venues
 *     summary: Get venue by ID
 *     description: Retrieve detailed information about a specific venue
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
 *         description: Venue retrieved successfully
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
 *                   example: "Venue retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     venue:
 *                       $ref: '#/components/schemas/Venue'
 *             examples:
 *               success:
 *                 summary: Venue details retrieved
 *                 value:
 *                   success: true
 *                   message: "Venue retrieved successfully"
 *                   data:
 *                     venue:
 *                       id: "123e4567-e89b-12d3-a456-426614174000"
 *                       name: "Grand Ballroom"
 *                       address: "123 Main Street, Downtown City, State 12345"
 *                       capacity: 200
 *                       pricePerHour: 150.00
 *                       description: "Elegant ballroom with crystal chandeliers, perfect for weddings and formal events. Features include dance floor, stage, and full catering kitchen."
 *                       createdAt: "2024-01-15T10:30:00Z"
 *                       updatedAt: "2024-01-15T10:30:00Z"
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
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', getVenueById);

/**
 * @swagger
 * /api/v1/venues/{id}:
 *   put:
 *     tags:
 *       - Venues
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
 *               pricePerHour:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 999999.99
 *                 example: 175.00
 *                 description: "Updated hourly rental rate"
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
 *                       pricePerHour: 175.00
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
 * /api/v1/venues/{id}:
 *   delete:
 *     tags:
 *       - Venues
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
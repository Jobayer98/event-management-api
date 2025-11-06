import { Router } from 'express';
import { 
  getVenueById, 
  getVenues 
} from '../controllers/venueController';

const router = Router();

/**
 * @swagger
 * /api/v1/venues:
 *   get:
 *     tags:
 *       - User - Venues
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
 * /api/v1/venues/{id}:
 *   get:
 *     tags:
 *       - User - Venues
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
 *                       pricePerDay: 15000.00
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

export default router;
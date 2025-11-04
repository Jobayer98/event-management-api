import { Router } from 'express';
import { 
  checkAvailability,
  createEvent,
  getUserEvents,
  getEventById,
  updateEvent
} from '../controllers/eventController';
import { validateBody } from '../../../middleware/validation';
import { authenticateToken } from '../../../middleware/auth';
import { checkAvailabilitySchema, createEventSchema, updateEventSchema } from '../../../schemas/event';

const router = Router();

/**
 * @swagger
 * /api/v1/events/check-availability:
 *   post:
 *     tags:
 *       - Events
 *     summary: Check venue availability
 *     description: Check if a venue is available for booking during specified time period
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - venueId
 *               - startTime
 *               - endTime
 *             properties:
 *               venueId:
 *                 type: string
 *                 format: uuid
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *                 description: "UUID of the venue to check availability for"
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-12-25T10:00:00.000Z"
 *                 description: "Event start time in ISO 8601 format"
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-12-25T18:00:00.000Z"
 *                 description: "Event end time in ISO 8601 format"
 *     responses:
 *       200:
 *         description: Availability check completed successfully
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
 *                   example: "Venue availability checked successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     available:
 *                       type: boolean
 *                       example: true
 *                       description: "Whether the venue is available during the specified time"
 *                     conflictingEvents:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                             format: uuid
 *                           startTime:
 *                             type: string
 *                             format: date-time
 *                           endTime:
 *                             type: string
 *                             format: date-time
 *                       description: "List of conflicting events if venue is not available"
 *             examples:
 *               available:
 *                 summary: Venue is available
 *                 value:
 *                   success: true
 *                   message: "Venue availability checked successfully"
 *                   data:
 *                     available: true
 *                     conflictingEvents: []
 *               unavailable:
 *                 summary: Venue is not available
 *                 value:
 *                   success: true
 *                   message: "Venue availability checked successfully"
 *                   data:
 *                     available: false
 *                     conflictingEvents:
 *                       - id: "456e7890-e89b-12d3-a456-426614174001"
 *                         startTime: "2024-12-25T14:00:00.000Z"
 *                         endTime: "2024-12-25T16:00:00.000Z"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *             examples:
 *               validation_error:
 *                 summary: Invalid time range
 *                 value:
 *                   success: false
 *                   message: "Validation failed"
 *                   errors:
 *                     - field: "endTime"
 *                       message: "End time must be after start time"
 *                     - field: "startTime"
 *                       message: "Event start time must be in the future"
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
router.post('/check-availability', validateBody(checkAvailabilitySchema), checkAvailability);

/**
 * @swagger
 * /api/v1/events:
 *   get:
 *     tags:
 *       - Events
 *     summary: Get user's events
 *     description: Retrieve a paginated list of events for the authenticated user with optional filters
 *     security:
 *       - bearerAuth: []
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
 *         description: Number of events per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, cancelled]
 *         description: Filter events by status
 *       - in: query
 *         name: eventType
 *         schema:
 *           type: string
 *           maxLength: 100
 *         description: Filter events by type
 *     responses:
 *       200:
 *         description: Events retrieved successfully
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
 *                   example: "Events retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     events:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Event'
 *                     pagination:
 *                       $ref: '#/components/schemas/Pagination'
 *             examples:
 *               success:
 *                 summary: Successful events retrieval
 *                 value:
 *                   success: true
 *                   message: "Events retrieved successfully"
 *                   data:
 *                     events:
 *                       - id: "123e4567-e89b-12d3-a456-426614174000"
 *                         eventType: "Wedding"
 *                         peopleCount: 150
 *                         status: "confirmed"
 *                         startTime: "2024-12-25T10:00:00.000Z"
 *                         endTime: "2024-12-25T18:00:00.000Z"
 *                         venue:
 *                           id: "456e7890-e89b-12d3-a456-426614174001"
 *                           name: "Grand Ballroom"
 *                         meal:
 *                           id: "789e0123-e89b-12d3-a456-426614174002"
 *                           name: "Wedding Feast"
 *                           type: "buffet"
 *                           pricePerPerson: 45.99
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
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', authenticateToken, getUserEvents);

/**
 * @swagger
 * /api/v1/events:
 *   post:
 *     tags:
 *       - Events
 *     summary: Create new event
 *     description: Create a new event booking with optional meal selection
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - venueId
 *               - eventType
 *               - peopleCount
 *               - startTime
 *               - endTime
 *             properties:
 *               venueId:
 *                 type: string
 *                 format: uuid
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *                 description: "UUID of the venue to book"
 *               eventType:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: "Wedding Reception"
 *                 description: "Type of event being organized"
 *               peopleCount:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 10000
 *                 example: 150
 *                 description: "Expected number of attendees"
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-12-25T10:00:00.000Z"
 *                 description: "Event start time in ISO 8601 format"
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 example: "2024-12-25T18:00:00.000Z"
 *                 description: "Event end time in ISO 8601 format"
 *               meal:
 *                 type: object
 *                 description: "Optional meal configuration for the event"
 *                 properties:
 *                   name:
 *                     type: string
 *                     minLength: 2
 *                     maxLength: 100
 *                     example: "Wedding Feast"
 *                     description: "Name of the meal"
 *                   type:
 *                     type: string
 *                     enum: [veg, nonveg, buffet]
 *                     example: "buffet"
 *                     description: "Type of meal service"
 *                   pricePerPerson:
 *                     type: number
 *                     minimum: 0
 *                     maximum: 9999.99
 *                     example: 45.99
 *                     description: "Cost per person for the meal"
 *                   description:
 *                     type: string
 *                     maxLength: 1000
 *                     example: "Traditional wedding buffet with multiple cuisines"
 *                     description: "Detailed description of the meal"
 *                 required:
 *                   - name
 *                   - pricePerPerson
 *     responses:
 *       201:
 *         description: Event created successfully
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
 *                   example: "Event created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     event:
 *                       $ref: '#/components/schemas/Event'
 *             examples:
 *               success:
 *                 summary: Event created with meal
 *                 value:
 *                   success: true
 *                   message: "Event created successfully"
 *                   data:
 *                     event:
 *                       id: "123e4567-e89b-12d3-a456-426614174000"
 *                       eventType: "Wedding Reception"
 *                       peopleCount: 150
 *                       status: "pending"
 *                       startTime: "2024-12-25T10:00:00.000Z"
 *                       endTime: "2024-12-25T18:00:00.000Z"
 *                       venue:
 *                         id: "456e7890-e89b-12d3-a456-426614174001"
 *                         name: "Grand Ballroom"
 *                       meal:
 *                         id: "789e0123-e89b-12d3-a456-426614174002"
 *                         name: "Wedding Feast"
 *                         type: "buffet"
 *                         pricePerPerson: 45.99
 *                       createdAt: "2024-01-15T10:30:00Z"
 *                       updatedAt: "2024-01-15T10:30:00Z"
 *       400:
 *         description: Validation error or venue unavailable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *             examples:
 *               validation_error:
 *                 summary: Invalid event data
 *                 value:
 *                   success: false
 *                   message: "Validation failed"
 *                   errors:
 *                     - field: "peopleCount"
 *                       message: "People count must be at least 1"
 *                     - field: "endTime"
 *                       message: "End time must be after start time"
 *               venue_unavailable:
 *                 summary: Venue not available
 *                 value:
 *                   success: false
 *                   message: "Venue not available"
 *                   error: "The selected venue is not available during the specified time period"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 *       404:
 *         description: Venue not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Venue booking conflict
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
router.post('/', authenticateToken, validateBody(createEventSchema), createEvent);

/**
 * @swagger
 * /api/v1/events/{id}:
 *   get:
 *     tags:
 *       - Events
 *     summary: Get event by ID
 *     description: Retrieve detailed information about a specific event
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Event ID
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Event retrieved successfully
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
 *                   example: "Event retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     event:
 *                       $ref: '#/components/schemas/Event'
 *             examples:
 *               success:
 *                 summary: Event details retrieved
 *                 value:
 *                   success: true
 *                   message: "Event retrieved successfully"
 *                   data:
 *                     event:
 *                       id: "123e4567-e89b-12d3-a456-426614174000"
 *                       eventType: "Wedding Reception"
 *                       peopleCount: 150
 *                       status: "confirmed"
 *                       startTime: "2024-12-25T10:00:00.000Z"
 *                       endTime: "2024-12-25T18:00:00.000Z"
 *                       venue:
 *                         id: "456e7890-e89b-12d3-a456-426614174001"
 *                         name: "Grand Ballroom"
 *                         location: "Downtown Convention Center"
 *                         capacity: 200
 *                         pricePerHour: 150.00
 *                       meal:
 *                         id: "789e0123-e89b-12d3-a456-426614174002"
 *                         name: "Wedding Feast"
 *                         type: "buffet"
 *                         pricePerPerson: 45.99
 *                         description: "Traditional wedding buffet"
 *                       user:
 *                         id: "abc12345-e89b-12d3-a456-426614174003"
 *                         name: "John Doe"
 *                         email: "john.doe@example.com"
 *                       createdAt: "2024-01-15T10:30:00Z"
 *                       updatedAt: "2024-01-15T10:30:00Z"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 *       403:
 *         description: Forbidden - Not your event
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForbiddenError'
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               event_not_found:
 *                 summary: Event does not exist
 *                 value:
 *                   success: false
 *                   message: "Event not found"
 *                   error: "No event found with the specified ID"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', authenticateToken, getEventById);

/**
 * @swagger
 * /api/v1/events/{id}:
 *   put:
 *     tags:
 *       - Events
 *     summary: Update event
 *     description: Update event details (people count and meal configuration only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Event ID
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               peopleCount:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 10000
 *                 example: 175
 *                 description: "Updated number of attendees"
 *               meal:
 *                 type: object
 *                 description: "Updated meal configuration"
 *                 properties:
 *                   name:
 *                     type: string
 *                     minLength: 2
 *                     maxLength: 100
 *                     example: "Premium Wedding Feast"
 *                   type:
 *                     type: string
 *                     enum: [veg, nonveg, buffet]
 *                     example: "buffet"
 *                   pricePerPerson:
 *                     type: number
 *                     minimum: 0
 *                     maximum: 9999.99
 *                     example: 55.99
 *                   description:
 *                     type: string
 *                     maxLength: 1000
 *                     example: "Premium buffet with international cuisines"
 *                 required:
 *                   - name
 *                   - pricePerPerson
 *               removeMeal:
 *                 type: boolean
 *                 example: false
 *                 description: "Set to true to remove meal from event"
 *             minProperties: 1
 *     responses:
 *       200:
 *         description: Event updated successfully
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
 *                   example: "Event updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     event:
 *                       $ref: '#/components/schemas/Event'
 *             examples:
 *               success:
 *                 summary: Event updated with new meal
 *                 value:
 *                   success: true
 *                   message: "Event updated successfully"
 *                   data:
 *                     event:
 *                       id: "123e4567-e89b-12d3-a456-426614174000"
 *                       eventType: "Wedding Reception"
 *                       peopleCount: 175
 *                       status: "confirmed"
 *                       startTime: "2024-12-25T10:00:00.000Z"
 *                       endTime: "2024-12-25T18:00:00.000Z"
 *                       venue:
 *                         id: "456e7890-e89b-12d3-a456-426614174001"
 *                         name: "Grand Ballroom"
 *                       meal:
 *                         id: "789e0123-e89b-12d3-a456-426614174002"
 *                         name: "Premium Wedding Feast"
 *                         type: "buffet"
 *                         pricePerPerson: 55.99
 *                       updatedAt: "2024-01-15T11:30:00Z"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *             examples:
 *               validation_error:
 *                 summary: Invalid update data
 *                 value:
 *                   success: false
 *                   message: "Validation failed"
 *                   errors:
 *                     - field: "peopleCount"
 *                       message: "People count must be at least 1"
 *               conflicting_fields:
 *                 summary: Cannot provide both meal and removeMeal
 *                 value:
 *                   success: false
 *                   message: "Validation failed"
 *                   errors:
 *                     - field: "meal"
 *                       message: "Cannot provide both meal data and removeMeal flag"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 *       403:
 *         description: Forbidden - Not your event or event cannot be modified
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForbiddenError'
 *       404:
 *         description: Event not found
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
router.put('/:id', authenticateToken, validateBody(updateEventSchema), updateEvent);

export default router;
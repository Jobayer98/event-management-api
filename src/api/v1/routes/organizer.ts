import { Router } from 'express';
import {
    loginAdmin,
    getAdminProfile,
    updateAdminProfile,
    updateAdminPassword,
    getAllEvents,
    getEventById,
    updateEventStatus
} from '../controllers/organizerController';
import { validateBody, validateQuery } from '../../../middleware/validation';
import { authenticateToken, requireRole } from '../../../middleware/auth';
import {
    loginOrganizerSchema,
    updateAdminProfileSchema,
    updateAdminPasswordSchema
} from '../../../schemas/auth';
import {
    updateEventStatusSchema,
    adminEventQuerySchema
} from '../../../schemas/event';

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

/**
 * @swagger
 * /api/v1/admin/events:
 *   get:
 *     tags:
 *       - Admin Events
 *     summary: Get all events (Admin/Organizer only)
 *     description: |
 *       Retrieves a paginated list of all events in the system with optional filtering capabilities.
 *       This endpoint is restricted to admin and organizer users only.
 *       
 *       **Features:**
 *       - Pagination support with configurable page size
 *       - Filter by event status (pending, confirmed, cancelled)
 *       - Filter by event type with partial text matching
 *       - Returns complete event details including venue and meal information
 *       - Sorted by creation date (newest first)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination (starts from 1)
 *         example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of events per page (maximum 100)
 *         example: 10
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, cancelled]
 *         description: Filter events by their current status
 *         example: pending
 *       - in: query
 *         name: eventType
 *         schema:
 *           type: string
 *           maxLength: 100
 *         description: Filter events by event type using partial text matching (case-insensitive)
 *         example: wedding
 *     responses:
 *       200:
 *         description: Events retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventListResponse'
 *             examples:
 *               success:
 *                 summary: Successful response with events
 *                 value:
 *                   success: true
 *                   message: "Events retrieved successfully"
 *                   data:
 *                     events:
 *                       - id: "123e4567-e89b-12d3-a456-426614174000"
 *                         eventType: "Wedding Reception"
 *                         peopleCount: 150
 *                         status: "pending"
 *                         startTime: "2024-12-25T10:00:00.000Z"
 *                         endTime: "2024-12-25T18:00:00.000Z"
 *                         venue:
 *                           name: "Grand Ballroom"
 *                           address: "123 Main Street"
 *                         meal:
 *                           name: "Premium Buffet"
 *                           type: "buffet"
 *                     pagination:
 *                       currentPage: 1
 *                       totalPages: 5
 *                       totalEvents: 47
 *                       hasNextPage: true
 *                       hasPreviousPage: false
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *             example:
 *               success: false
 *               message: "Query validation failed"
 *               errors:
 *                 - field: "page"
 *                   message: "Page must be at least 1"
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Unauthorized"
 *               error: "Authentication token required"
 *       403:
 *         description: Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Forbidden"
 *               error: "Admin or organizer role required"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Internal server error"
 *               error: "Failed to retrieve events"
 */
router.get('/events',
    authenticateToken,
    requireRole(['organizer', 'admin']),
    getAllEvents
);

/**
 * @swagger
 * /api/v1/admin/events/{eventId}:
 *   get:
 *     tags:
 *       - Admin Events
 *     summary: Get event by ID (Admin/Organizer only)
 *     description: |
 *       Retrieves detailed information about a specific event by its unique identifier.
 *       This endpoint is restricted to admin and organizer users only.
 *       
 *       **Returns:**
 *       - Complete event details including venue and meal information
 *       - Event status and timing information
 *       - Associated user information
 *       - Cost breakdown if available
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique identifier of the event to retrieve
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Event retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventResponse'
 *             example:
 *               success: true
 *               message: "Event retrieved successfully"
 *               data:
 *                 event:
 *                   id: "123e4567-e89b-12d3-a456-426614174000"
 *                   userId: "456e7890-e89b-12d3-a456-426614174001"
 *                   eventType: "Wedding Reception"
 *                   peopleCount: 150
 *                   status: "confirmed"
 *                   startTime: "2024-12-25T10:00:00.000Z"
 *                   endTime: "2024-12-25T18:00:00.000Z"
 *                   totalCost: 15750.50
 *                   venue:
 *                     id: "789e0123-e89b-12d3-a456-426614174002"
 *                     name: "Grand Ballroom"
 *                     address: "123 Main Street, Downtown"
 *                     capacity: 200
 *                     pricePerDay: 5000.00
 *                   meal:
 *                     id: "012e3456-e89b-12d3-a456-426614174003"
 *                     name: "Premium Buffet"
 *                     type: "buffet"
 *                     pricePerPerson: 45.00
 *       400:
 *         description: Invalid event ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Bad Request"
 *               error: "Invalid event ID format"
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Unauthorized"
 *               error: "Authentication token required"
 *       403:
 *         description: Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Forbidden"
 *               error: "Admin or organizer role required"
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Not Found"
 *               error: "Event not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Internal server error"
 *               error: "Failed to retrieve event"
 */
router.get('/events/:eventId',
    authenticateToken,
    requireRole(['organizer', 'admin']),
    getEventById
);

/**
 * @swagger
 * /api/v1/admin/events/{eventId}/status:
 *   patch:
 *     tags:
 *       - Admin Events
 *     summary: Update event status (Admin/Organizer only)
 *     description: |
 *       Updates the status of a specific event. This is a key administrative function that allows
 *       organizers to manage the lifecycle of events in the system.
 *       
 *       **Status Transitions:**
 *       - `pending` → `confirmed`: Approve the event booking
 *       - `pending` → `cancelled`: Reject or cancel the event
 *       - `confirmed` → `cancelled`: Cancel a previously confirmed event
 *       - Any status → `pending`: Reset event to pending (rare use case)
 *       
 *       **Business Impact:**
 *       - Changing to `confirmed` finalizes the booking and may trigger notifications
 *       - Changing to `cancelled` may initiate refund processes
 *       - Status changes are logged for audit purposes
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique identifier of the event to update
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEventStatusRequest'
 *           examples:
 *             confirm_event:
 *               summary: Confirm a pending event
 *               value:
 *                 status: "confirmed"
 *             cancel_event:
 *               summary: Cancel an event
 *               value:
 *                 status: "cancelled"
 *             reset_to_pending:
 *               summary: Reset event to pending
 *               value:
 *                 status: "pending"
 *     responses:
 *       200:
 *         description: Event status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/EventResponse'
 *             examples:
 *               confirmed:
 *                 summary: Event confirmed successfully
 *                 value:
 *                   success: true
 *                   message: "Event status updated to confirmed successfully"
 *                   data:
 *                     event:
 *                       id: "123e4567-e89b-12d3-a456-426614174000"
 *                       status: "confirmed"
 *                       eventType: "Wedding Reception"
 *                       peopleCount: 150
 *                       venue:
 *                         name: "Grand Ballroom"
 *               cancelled:
 *                 summary: Event cancelled successfully
 *                 value:
 *                   success: true
 *                   message: "Event status updated to cancelled successfully"
 *                   data:
 *                     event:
 *                       id: "123e4567-e89b-12d3-a456-426614174000"
 *                       status: "cancelled"
 *                       eventType: "Wedding Reception"
 *       400:
 *         description: Validation error or invalid status transition
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationErrorResponse'
 *             examples:
 *               invalid_status:
 *                 summary: Invalid status value
 *                 value:
 *                   success: false
 *                   message: "Validation failed"
 *                   errors:
 *                     - field: "status"
 *                       message: "Status must be one of: pending, confirmed, cancelled"
 *               missing_field:
 *                 summary: Missing required field
 *                 value:
 *                   success: false
 *                   message: "Validation failed"
 *                   errors:
 *                     - field: "status"
 *                       message: "Status is required"
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Unauthorized"
 *               error: "Authentication token required"
 *       403:
 *         description: Insufficient permissions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Forbidden"
 *               error: "Admin or organizer role required"
 *       404:
 *         description: Event not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Not Found"
 *               error: "Event not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               message: "Internal server error"
 *               error: "Failed to update event status"
 */
router.patch('/events/:eventId/status',
    authenticateToken,
    requireRole(['organizer', 'admin']),
    validateBody(updateEventStatusSchema),
    updateEventStatus
);

export default router;
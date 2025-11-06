import { Router } from 'express';
import { 
  getRevenueAnalytics,
  getTopVenues,
  getTopMeals,
  getEventTypeAnalytics,
  getDashboardStats
} from '../controllers/analyticsController';
import { authenticateToken, requireRole } from '../../../middleware/auth';
import { validateQuery } from '../../../middleware/validation';
import { 
  analyticsQuerySchema,
  revenueAnalyticsQuerySchema,
  topPerformersQuerySchema
} from '../../../schemas/analytics';

const router = Router();

// Apply authentication and role-based access control to all routes
router.use(authenticateToken);
router.use(requireRole(['admin', 'organizer']));

/**
 * @swagger
 * /api/v1/admin/analytics/dashboard:
 *   get:
 *     summary: Get dashboard statistics
 *     description: Retrieve comprehensive dashboard statistics including total events, revenue, users, and status counts
 *     tags: [Admin Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date for analytics (ISO 8601 format)
 *         example: "2024-01-01T00:00:00Z"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date for analytics (ISO 8601 format)
 *         example: "2024-12-31T23:59:59Z"
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/DashboardStats'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/dashboard', validateQuery(analyticsQuerySchema), getDashboardStats);

/**
 * @swagger
 * /api/v1/admin/analytics/revenue:
 *   get:
 *     summary: Get revenue analytics
 *     description: Retrieve revenue analytics grouped by time periods (day, week, month, year)
 *     tags: [Admin Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date for analytics (ISO 8601 format)
 *         example: "2024-01-01T00:00:00Z"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date for analytics (ISO 8601 format)
 *         example: "2024-12-31T23:59:59Z"
 *       - in: query
 *         name: groupBy
 *         schema:
 *           type: string
 *           enum: [day, week, month, year]
 *           default: month
 *         description: Time period to group revenue data by
 *         example: "month"
 *     responses:
 *       200:
 *         description: Revenue analytics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/RevenueAnalytics'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/revenue', validateQuery(revenueAnalyticsQuerySchema), getRevenueAnalytics);

/**
 * @swagger
 * /api/v1/admin/analytics/venues/top:
 *   get:
 *     summary: Get top performing venues
 *     description: Retrieve top venues ranked by total revenue and event count
 *     tags: [Admin Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Number of top venues to return
 *         example: 10
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date for analytics (ISO 8601 format)
 *         example: "2024-01-01T00:00:00Z"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date for analytics (ISO 8601 format)
 *         example: "2024-12-31T23:59:59Z"
 *     responses:
 *       200:
 *         description: Top venues retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TopVenue'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/venues/top', validateQuery(topPerformersQuerySchema), getTopVenues);

/**
 * @swagger
 * /api/v1/admin/analytics/meals/top:
 *   get:
 *     summary: Get top performing meals
 *     description: Retrieve top meals ranked by total revenue and order count
 *     tags: [Admin Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Number of top meals to return
 *         example: 10
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date for analytics (ISO 8601 format)
 *         example: "2024-01-01T00:00:00Z"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date for analytics (ISO 8601 format)
 *         example: "2024-12-31T23:59:59Z"
 *     responses:
 *       200:
 *         description: Top meals retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TopMeal'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/meals/top', validateQuery(topPerformersQuerySchema), getTopMeals);

/**
 * @swagger
 * /api/v1/admin/analytics/event-types:
 *   get:
 *     summary: Get event type analytics
 *     description: Retrieve analytics data grouped by event types with counts, revenue, and percentages
 *     tags: [Admin Analytics]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date for analytics (ISO 8601 format)
 *         example: "2024-01-01T00:00:00Z"
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date for analytics (ISO 8601 format)
 *         example: "2024-12-31T23:59:59Z"
 *     responses:
 *       200:
 *         description: Event type analytics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/EventTypeAnalytics'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.get('/event-types', validateQuery(analyticsQuerySchema), getEventTypeAnalytics);

export default router;
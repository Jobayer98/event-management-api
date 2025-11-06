import { Router } from 'express';
import { 
  createMeal, 
  getMealById, 
  adminUpdateMeal, 
  deleteMeal, 
  getAdminMeals 
} from '../controllers/mealController';
import { validateBody } from '../../../middleware/validation';
import { authenticateToken, requireRole } from '../../../middleware/auth';
import { createMealSchema, adminUpdateMealSchema } from '../../../schemas/meal';

const router = Router();

/**
 * @swagger
 * /api/v1/admin/meals:
 *   get:
 *     tags:
 *       - Admin - Meals
 *     summary: Get meals (Admin)
 *     description: Retrieve a paginated list of meals with detailed information for admin management
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
 *         description: Number of meals per page
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [veg, nonveg, buffet, plated]
 *         description: Filter meals by type
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           maxLength: 100
 *         description: Search meals by name or description
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Minimum price per person filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *           minimum: 0
 *         description: Maximum price per person filter
 *     responses:
 *       200:
 *         description: Meals retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminMealListResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       500:
 *         description: Internal server error
 */
router.get('/', authenticateToken, requireRole(['organizer']), getAdminMeals);

/**
 * @swagger
 * /api/v1/admin/meals:
 *   post:
 *     tags:
 *       - Admin - Meals
 *     summary: Create new meal (Admin)
 *     description: Create a new meal option with comprehensive details
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMealRequest'
 *     responses:
 *       201:
 *         description: Meal created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       409:
 *         description: Meal name already exists
 *       500:
 *         description: Internal server error
 */
router.post('/', authenticateToken, requireRole(['organizer']), validateBody(createMealSchema), createMeal);

/**
 * @swagger
 * /api/v1/admin/meals/{id}:
 *   get:
 *     tags:
 *       - Admin - Meals
 *     summary: Get meal by ID (Admin)
 *     description: Retrieve detailed information about a specific meal
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Meal ID
 *     responses:
 *       200:
 *         description: Meal retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Meal not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', authenticateToken, requireRole(['organizer']), getMealById);

/**
 * @swagger
 * /api/v1/admin/meals/{id}:
 *   put:
 *     tags:
 *       - Admin - Meals
 *     summary: Update meal (Admin - Comprehensive)
 *     description: Update all meal properties including name, description, pricing, menu items, service details, and status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Meal ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminUpdateMealRequest'
 *     responses:
 *       200:
 *         description: Meal updated successfully
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
 *                   example: "Meal updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     meal:
 *                       $ref: '#/components/schemas/Meal'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Meal not found
 *       409:
 *         description: Meal name already exists
 *       500:
 *         description: Internal server error
 */
router.put('/:id', authenticateToken, requireRole(['organizer']), validateBody(adminUpdateMealSchema), adminUpdateMeal);

/**
 * @swagger
 * /api/v1/admin/meals/{id}:
 *   delete:
 *     tags:
 *       - Admin - Meals
 *     summary: Delete meal (Admin)
 *     description: Delete a meal (cannot delete meals associated with events)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Meal ID
 *     responses:
 *       200:
 *         description: Meal deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         description: Meal not found
 *       409:
 *         description: Cannot delete meal - associated with events
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authenticateToken, requireRole(['organizer']), deleteMeal);

export default router;
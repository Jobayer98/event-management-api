import { Router } from 'express';
import { 
  createMeal, 
  getMealById, 
  updateMeal, 
  deleteMeal, 
  getMeals 
} from '../controllers/mealController';
import { validateBody } from '../../../middleware/validation';
import { authenticateToken, requireRole } from '../../../middleware/auth';
import { createMealSchema, updateMealSchema } from '../../../schemas/meal';

const router = Router();

/**
 * @swagger
 * /api/v1/meals:
 *   get:
 *     tags:
 *       - Meals
 *     summary: Get meals
 *     description: Retrieve a paginated list of available meals with optional filters
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
 *           enum: [veg, nonveg, buffet]
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
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Meals retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     meals:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Meal'
 *                     pagination:
 *                       $ref: '#/components/schemas/Pagination'
 *             examples:
 *               success:
 *                 summary: Successful meals retrieval
 *                 value:
 *                   success: true
 *                   message: "Meals retrieved successfully"
 *                   data:
 *                     meals:
 *                       - id: "123e4567-e89b-12d3-a456-426614174000"
 *                         name: "Deluxe Buffet"
 *                         type: "buffet"
 *                         pricePerPerson: 45.99
 *                         description: "International cuisine buffet with multiple stations"
 *                         createdAt: "2024-01-15T10:30:00Z"
 *                         updatedAt: "2024-01-15T10:30:00Z"
 *                       - id: "456e7890-e89b-12d3-a456-426614174001"
 *                         name: "Vegetarian Feast"
 *                         type: "veg"
 *                         pricePerPerson: 35.99
 *                         description: "Fresh vegetarian dishes with organic ingredients"
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
router.get('/', getMeals);

/**
 * @swagger
 * /api/v1/meals:
 *   post:
 *     tags:
 *       - Meals
 *     summary: Create new meal
 *     description: Create a new meal option (organizer access required)
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
 *               - pricePerPerson
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 example: "Deluxe Wedding Buffet"
 *                 description: "Name of the meal"
 *               type:
 *                 type: string
 *                 enum: [veg, nonveg, buffet]
 *                 example: "buffet"
 *                 description: "Type of meal service"
 *               pricePerPerson:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 9999.99
 *                 example: 45.99
 *                 description: "Cost per person for the meal"
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *                 example: "International cuisine buffet with live cooking stations, dessert bar, and premium beverages"
 *                 description: "Detailed description of the meal"
 *     responses:
 *       201:
 *         description: Meal created successfully
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
 *                   example: "Meal created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     meal:
 *                       $ref: '#/components/schemas/Meal'
 *             examples:
 *               success:
 *                 summary: Meal created successfully
 *                 value:
 *                   success: true
 *                   message: "Meal created successfully"
 *                   data:
 *                     meal:
 *                       id: "123e4567-e89b-12d3-a456-426614174000"
 *                       name: "Deluxe Wedding Buffet"
 *                       type: "buffet"
 *                       pricePerPerson: 45.99
 *                       description: "International cuisine buffet with live cooking stations"
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
 *                 summary: Invalid meal data
 *                 value:
 *                   success: false
 *                   message: "Validation failed"
 *                   errors:
 *                     - field: "name"
 *                       message: "Meal name must be at least 2 characters"
 *                     - field: "pricePerPerson"
 *                       message: "Price per person cannot be negative"
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
 *                   error: "Organizer access required to create meals"
 *       409:
 *         description: Meal name already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               name_exists:
 *                 summary: Duplicate meal name
 *                 value:
 *                   success: false
 *                   message: "Meal name already exists"
 *                   error: "A meal with this name already exists"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', authenticateToken, requireRole(['organizer']), validateBody(createMealSchema), createMeal);

/**
 * @swagger
 * /api/v1/meals/{id}:
 *   get:
 *     tags:
 *       - Meals
 *     summary: Get meal by ID
 *     description: Retrieve detailed information about a specific meal
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Meal ID
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Meal retrieved successfully
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
 *                   example: "Meal retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     meal:
 *                       $ref: '#/components/schemas/Meal'
 *             examples:
 *               success:
 *                 summary: Meal details retrieved
 *                 value:
 *                   success: true
 *                   message: "Meal retrieved successfully"
 *                   data:
 *                     meal:
 *                       id: "123e4567-e89b-12d3-a456-426614174000"
 *                       name: "Deluxe Wedding Buffet"
 *                       type: "buffet"
 *                       pricePerPerson: 45.99
 *                       description: "International cuisine buffet with live cooking stations, dessert bar, and premium beverages"
 *                       createdAt: "2024-01-15T10:30:00Z"
 *                       updatedAt: "2024-01-15T10:30:00Z"
 *       404:
 *         description: Meal not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               meal_not_found:
 *                 summary: Meal does not exist
 *                 value:
 *                   success: false
 *                   message: "Meal not found"
 *                   error: "No meal found with the specified ID"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', getMealById);

/**
 * @swagger
 * /api/v1/meals/{id}:
 *   put:
 *     tags:
 *       - Meals
 *     summary: Update meal
 *     description: Update meal details (organizer access required)
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
 *                 maxLength: 100
 *                 example: "Premium Wedding Buffet"
 *                 description: "Updated name of the meal"
 *               type:
 *                 type: string
 *                 enum: [veg, nonveg, buffet]
 *                 example: "buffet"
 *                 description: "Updated type of meal service"
 *               pricePerPerson:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 9999.99
 *                 example: 55.99
 *                 description: "Updated cost per person for the meal"
 *               description:
 *                 type: string
 *                 maxLength: 1000
 *                 example: "Premium international cuisine buffet with live cooking stations and gourmet desserts"
 *                 description: "Updated detailed description of the meal"
 *             minProperties: 1
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
 *             examples:
 *               success:
 *                 summary: Meal updated successfully
 *                 value:
 *                   success: true
 *                   message: "Meal updated successfully"
 *                   data:
 *                     meal:
 *                       id: "123e4567-e89b-12d3-a456-426614174000"
 *                       name: "Premium Wedding Buffet"
 *                       type: "buffet"
 *                       pricePerPerson: 55.99
 *                       description: "Premium international cuisine buffet with live cooking stations"
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
 *                 summary: Invalid meal data
 *                 value:
 *                   success: false
 *                   message: "Validation failed"
 *                   errors:
 *                     - field: "pricePerPerson"
 *                       message: "Price per person cannot exceed 9,999.99"
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
 *         description: Meal not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Meal name already exists
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
router.put('/:id', authenticateToken, requireRole(['organizer']), validateBody(updateMealSchema), updateMeal);

/**
 * @swagger
 * /api/v1/meals/{id}:
 *   delete:
 *     tags:
 *       - Meals
 *     summary: Delete meal
 *     description: Delete a meal (organizer access required). Cannot delete meals that are currently associated with events.
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
 *         example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Meal deleted successfully
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
 *                   example: "Meal deleted successfully"
 *             examples:
 *               success:
 *                 summary: Meal deleted successfully
 *                 value:
 *                   success: true
 *                   message: "Meal deleted successfully"
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
 *         description: Meal not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               meal_not_found:
 *                 summary: Meal does not exist
 *                 value:
 *                   success: false
 *                   message: "Meal not found"
 *                   error: "No meal found with the specified ID"
 *       409:
 *         description: Cannot delete meal - associated with events
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               meal_in_use:
 *                 summary: Meal is associated with events
 *                 value:
 *                   success: false
 *                   message: "Cannot delete meal"
 *                   error: "This meal is currently associated with one or more events and cannot be deleted"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', authenticateToken, requireRole(['organizer']), deleteMeal);

export default router;
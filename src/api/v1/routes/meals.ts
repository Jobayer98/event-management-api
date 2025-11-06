import { Router } from 'express';
import { 
  getMealById, 
  getMeals 
} from '../controllers/mealController';

const router = Router();

/**
 * @swagger
 * /api/v1/meals:
 *   get:
 *     tags:
 *       - User - Meals
 *     summary: Get meals (User)
 *     description: Retrieve a paginated list of available meals (id and name only) for selection purposes
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
 *         name: cuisine
 *         schema:
 *           type: string
 *           maxLength: 50
 *         description: Filter by cuisine type
 *       - in: query
 *         name: servingStyle
 *         schema:
 *           type: string
 *           enum: [buffet, plated, family_style]
 *         description: Filter by serving style
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
 *       - in: query
 *         name: minGuests
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Minimum guest requirement filter
 *       - in: query
 *         name: maxGuests
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Maximum guest requirement filter
 *       - in: query
 *         name: specialDietary
 *         schema:
 *           type: string
 *         description: Comma-separated list of dietary requirements (e.g., "halal,gluten_free")
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: isPopular
 *         schema:
 *           type: boolean
 *         description: Filter by popular status
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, pricePerPerson, rating, createdAt, minimumGuests]
 *           default: createdAt
 *         description: Sort meals by field
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Meals retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MealListResponse'
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
 *                       - id: "456e7890-e89b-12d3-a456-426614174001"
 *                         name: "Vegetarian Feast"
 *                       - id: "789e0123-e89b-12d3-a456-426614174002"
 *                         name: "Seafood Special"
 *                       - id: "999e0123-e89b-12d3-a456-426614174999"
 *                         name: "Premium Wedding Feast"
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
 * /api/v1/meals/{id}:
 *   get:
 *     tags:
 *       - User - Meals
 *     summary: Get meal by ID (User)
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
 *               $ref: '#/components/schemas/MealDetailResponse'
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



export default router;
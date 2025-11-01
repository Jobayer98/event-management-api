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
 * @route   GET /api/v1/meals
 * @desc    Get meals with pagination and filters
 * @access  Public
 */
router.get('/', getMeals);

/**
 * @route   POST /api/v1/meals
 * @desc    Create a new meal
 * @access  Admin only
 */
router.post('/', authenticateToken, requireRole(['organizer']), validateBody(createMealSchema), createMeal);

/**
 * @route   GET /api/v1/meals/:id
 * @desc    Get meal by ID
 * @access  Public
 */
router.get('/:id', getMealById);

/**
 * @route   PUT /api/v1/meals/:id
 * @desc    Update meal by ID
 * @access  Admin only
 */
router.put('/:id', authenticateToken, requireRole(['organizer']), validateBody(updateMealSchema), updateMeal);

/**
 * @route   DELETE /api/v1/meals/:id
 * @desc    Delete meal by ID
 * @access  Admin only
 */
router.delete('/:id', authenticateToken, requireRole(['organizer']), deleteMeal);

export default router;
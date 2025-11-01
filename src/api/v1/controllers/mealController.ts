import { Request, Response, NextFunction } from 'express';
import { mealService } from '../services/mealService';
import { logger } from '../../../config';
import { CreateMealInput, UpdateMealInput, MealQueryInput } from '../../../schemas/meal';

/**
 * Create a new meal
 * POST /api/v1/meals
 */
export const createMeal = async (
  req: Request<{}, {}, CreateMealInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const mealData = req.body;

    logger.info(`Admin creating meal: ${mealData.name}`);

    // Call the meal service to create the meal
    const meal = await mealService.createMeal(mealData);

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Meal created successfully',
      data: meal,
    });

  } catch (error: any) {
    logger.error('Create meal controller error:', {
      error: error.message,
      stack: error.stack,
      mealData: req.body,
    });

    // Pass the error to the error handler middleware
    next(error);
  }
};

/**
 * Get meal by ID
 * GET /api/v1/meals/:id
 */
export const getMealById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    logger.info(`Fetching meal by ID: ${id}`);

    // Call the meal service to get the meal
    const meal = await mealService.getMealById(id);

    // Return success response
    res.status(200).json({
      success: true,
      data: meal,
    });

  } catch (error: any) {
    logger.error('Get meal by ID controller error:', {
      error: error.message,
      stack: error.stack,
      mealId: req.params.id,
    });

    // Pass the error to the error handler middleware
    next(error);
  }
};

/**
 * Update meal by ID
 * PUT /api/v1/meals/:id
 */
export const updateMeal = async (
  req: Request<{ id: string }, {}, UpdateMealInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    logger.info(`Admin updating meal: ${id}`);

    // Call the meal service to update the meal
    const meal = await mealService.updateMeal(id, updateData);

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Meal updated successfully',
      data: meal,
    });

  } catch (error: any) {
    logger.error('Update meal controller error:', {
      error: error.message,
      stack: error.stack,
      mealId: req.params.id,
      updateData: req.body,
    });

    // Pass the error to the error handler middleware
    next(error);
  }
};

/**
 * Delete meal by ID
 * DELETE /api/v1/meals/:id
 */
export const deleteMeal = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    logger.info(`Admin deleting meal: ${id}`);

    // Call the meal service to delete the meal
    await mealService.deleteMeal(id);

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Meal deleted successfully',
    });

  } catch (error: any) {
    logger.error('Delete meal controller error:', {
      error: error.message,
      stack: error.stack,
      mealId: req.params.id,
    });

    // Pass the error to the error handler middleware
    next(error);
  }
};

/**
 * Get meals with pagination and filters
 * GET /api/v1/meals
 */
export const getMeals = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = req.query as any;
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const type = query.type;
    const search = query.search;
    const minPrice = query.minPrice ? parseFloat(query.minPrice) : undefined;
    const maxPrice = query.maxPrice ? parseFloat(query.maxPrice) : undefined;

    logger.info(`Fetching meals with filters`, { 
      page, 
      limit, 
      type, 
      search, 
      minPrice, 
      maxPrice 
    });

    // Prepare filters
    const filters = {
      ...(type && { type }),
      ...(search && { search }),
      ...(minPrice && { minPrice }),
      ...(maxPrice && { maxPrice }),
    };

    // Call the meal service to get meals
    const result = await mealService.getMeals(page, limit, filters);

    // Return success response
    res.status(200).json({
      success: true,
      data: result.meals,
      pagination: result.pagination,
    });

  } catch (error: any) {
    logger.error('Get meals controller error:', {
      error: error.message,
      stack: error.stack,
      query: req.query,
    });

    // Pass the error to the error handler middleware
    next(error);
  }
};
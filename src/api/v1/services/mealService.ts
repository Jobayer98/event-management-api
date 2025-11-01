import { mealRepository, CreateMealData, UpdateMealData, MealResponse, MealFilters } from '../repositories/mealRepository';
import { createError } from '../../../middleware/errorHandler';
import { logger } from '../../../config';

export interface CreateMealInput {
  name: string;
  type?: string;
  pricePerPerson: number;
  description?: string;
}

export interface UpdateMealInput {
  name?: string;
  type?: string;
  pricePerPerson?: number;
  description?: string;
}

export interface MealListResponse {
  meals: MealResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export class MealService {
  /**
   * Create a new meal
   */
  async createMeal(mealData: CreateMealInput): Promise<MealResponse> {
    const { name, type, pricePerPerson, description } = mealData;

    logger.info(`Creating new meal: ${name}`);

    try {
      // Prepare meal data
      const createData: CreateMealData = {
        name,
        type: type || null,
        pricePerPerson,
        description: description || null,
      };

      // Create meal
      const meal = await mealRepository.create(createData);

      logger.info(`Meal created successfully: ${meal.id} - ${name}`);
      return meal;

    } catch (error: any) {
      logger.error('Meal creation error:', {
        error: error.message,
        name,
      });

      // Handle database errors
      if (error.code?.startsWith('P')) {
        throw createError('Unable to create meal at this time. Please try again later.', 500);
      }

      throw createError('Unable to create meal at this time. Please try again later.', 500);
    }
  }

  /**
   * Get meal by ID
   */
  async getMealById(id: string): Promise<MealResponse> {
    logger.info(`Fetching meal by ID: ${id}`);

    const meal = await mealRepository.findById(id);
    if (!meal) {
      logger.warn(`Meal not found: ${id}`);
      throw createError('The requested meal could not be found. It may have been removed from the menu.', 404);
    }

    return meal;
  }

  /**
   * Update meal by ID
   */
  async updateMeal(id: string, updateData: UpdateMealInput): Promise<MealResponse> {
    logger.info(`Updating meal: ${id}`);

    try {
      // Check if meal exists
      const exists = await mealRepository.existsById(id);
      if (!exists) {
        logger.warn(`Meal update failed - not found: ${id}`);
        throw createError('The requested meal could not be found. It may have been removed from the menu.', 404);
      }

      // Prepare update data
      const updateMealData: UpdateMealData = {
        ...(updateData.name && { name: updateData.name }),
        ...(updateData.type !== undefined && { type: updateData.type || null }),
        ...(updateData.pricePerPerson !== undefined && { pricePerPerson: updateData.pricePerPerson }),
        ...(updateData.description !== undefined && { description: updateData.description || null }),
      };

      // Update meal
      const meal = await mealRepository.updateById(id, updateMealData);

      logger.info(`Meal updated successfully: ${id}`);
      return meal;

    } catch (error: any) {
      // If it's already our custom error, re-throw it
      if (error.statusCode) {
        throw error;
      }

      logger.error('Meal update error:', {
        error: error.message,
        id,
      });

      // Handle record not found errors
      if (error.code === 'P2025') {
        throw createError('The requested meal could not be found. It may have been removed from the menu.', 404);
      }

      // Handle other database errors
      if (error.code?.startsWith('P')) {
        throw createError('Unable to update meal at this time. Please try again later.', 500);
      }

      throw createError('Unable to update meal at this time. Please try again later.', 500);
    }
  }

  /**
   * Delete meal by ID
   */
  async deleteMeal(id: string): Promise<void> {
    logger.info(`Deleting meal: ${id}`);

    try {
      // Check if meal exists
      const exists = await mealRepository.existsById(id);
      if (!exists) {
        logger.warn(`Meal deletion failed - not found: ${id}`);
        throw createError('The requested meal could not be found. It may have already been removed.', 404);
      }

      // Delete meal
      await mealRepository.deleteById(id);

      logger.info(`Meal deleted successfully: ${id}`);

    } catch (error: any) {
      // If it's already our custom error, re-throw it
      if (error.statusCode) {
        throw error;
      }

      logger.error('Meal deletion error:', {
        error: error.message,
        id,
      });

      // Handle record not found errors
      if (error.code === 'P2025') {
        throw createError('The requested meal could not be found. It may have already been removed.', 404);
      }

      // Handle foreign key constraint errors (meal has events)
      if (error.code === 'P2003') {
        throw createError('Cannot delete meal that is currently selected for existing events. Please remove it from events first.', 409);
      }

      // Handle other database errors
      if (error.code?.startsWith('P')) {
        throw createError('Unable to delete meal at this time. Please try again later.', 500);
      }

      throw createError('Unable to delete meal at this time. Please try again later.', 500);
    }
  }

  /**
   * Get meals with pagination and filters
   */
  async getMeals(
    page: number = 1,
    limit: number = 10,
    filters: MealFilters = {}
  ): Promise<MealListResponse> {
    logger.info(`Fetching meals - page: ${page}, limit: ${limit}`, { filters });

    try {
      const skip = (page - 1) * limit;

      // Get meals and total count
      const [meals, total] = await Promise.all([
        mealRepository.findMany(skip, limit, filters),
        mealRepository.count(filters),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        meals,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };

    } catch (error: any) {
      logger.error('Meal listing error:', {
        error: error.message,
        page,
        limit,
        filters,
      });

      throw createError('Unable to retrieve meals at this time. Please try again later.', 500);
    }
  }
}

// Export singleton instance
export const mealService = new MealService();
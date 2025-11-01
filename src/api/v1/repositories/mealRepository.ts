import { prisma } from '../../../config';

export interface CreateMealData {
  name: string;
  type?: string | null;
  pricePerPerson: number;
  description?: string | null;
}

export interface UpdateMealData {
  name?: string;
  type?: string | null;
  pricePerPerson?: number;
  description?: string | null;
}

export interface MealResponse {
  id: string;
  name: string;
  type: string | null;
  pricePerPerson: number;
  description: string | null;
}

export interface MealFilters {
  search?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
}

export class MealRepository {
  /**
   * Create a new meal
   */
  async create(mealData: CreateMealData): Promise<MealResponse> {
    const meal = await prisma.meal.create({
      data: mealData,
      select: {
        id: true,
        name: true,
        type: true,
        pricePerPerson: true,
        description: true,
      },
    });

    return {
      ...meal,
      pricePerPerson: Number(meal.pricePerPerson),
    };
  }

  /**
   * Find meal by ID
   */
  async findById(id: string): Promise<MealResponse | null> {
    const meal = await prisma.meal.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        type: true,
        pricePerPerson: true,
        description: true,
      },
    });

    if (!meal) return null;

    return {
      ...meal,
      pricePerPerson: Number(meal.pricePerPerson),
    };
  }

  /**
   * Update meal by ID
   */
  async updateById(id: string, updateData: UpdateMealData): Promise<MealResponse> {
    const meal = await prisma.meal.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        type: true,
        pricePerPerson: true,
        description: true,
      },
    });

    return {
      ...meal,
      pricePerPerson: Number(meal.pricePerPerson),
    };
  }

  /**
   * Delete meal by ID
   */
  async deleteById(id: string): Promise<void> {
    await prisma.meal.delete({
      where: { id },
    });
  }

  /**
   * Get meals with pagination and filters
   */
  async findMany(
    skip: number = 0,
    take: number = 10,
    filters: MealFilters = {}
  ): Promise<MealResponse[]> {
    const { search, type, minPrice, maxPrice } = filters;

    const whereClause: any = {};

    // Search filter (name or description)
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Type filter
    if (type) {
      whereClause.type = type;
    }

    // Price filters
    if (minPrice !== undefined || maxPrice !== undefined) {
      whereClause.pricePerPerson = {};
      if (minPrice !== undefined) {
        whereClause.pricePerPerson.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        whereClause.pricePerPerson.lte = maxPrice;
      }
    }

    const meals = await prisma.meal.findMany({
      where: whereClause,
      skip,
      take,
      select: {
        id: true,
        name: true,
        type: true,
        pricePerPerson: true,
        description: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return meals.map(meal => ({
      ...meal,
      pricePerPerson: Number(meal.pricePerPerson),
    }));
  }

  /**
   * Count meals with filters
   */
  async count(filters: MealFilters = {}): Promise<number> {
    const { search, type, minPrice, maxPrice } = filters;

    const whereClause: any = {};

    // Search filter (name or description)
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Type filter
    if (type) {
      whereClause.type = type;
    }

    // Price filters
    if (minPrice !== undefined || maxPrice !== undefined) {
      whereClause.pricePerPerson = {};
      if (minPrice !== undefined) {
        whereClause.pricePerPerson.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        whereClause.pricePerPerson.lte = maxPrice;
      }
    }

    return await prisma.meal.count({
      where: whereClause,
    });
  }

  /**
   * Check if meal exists by ID
   */
  async existsById(id: string): Promise<boolean> {
    const meal = await prisma.meal.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!meal;
  }
}

// Export singleton instance
export const mealRepository = new MealRepository();
import { prisma } from '../../../config';

export interface CreateMealData {
  name: string;
  description?: string | null;
  type: string;
  cuisine?: string | null;
  servingStyle: string;
  pricePerPerson: number;
  minimumGuests?: number;
  menuItems?: any;
  beverages?: string[];
  specialDietary?: string[];
  serviceHours?: any;
  staffIncluded?: boolean;
  equipmentIncluded?: boolean;
  images?: string[];
  isActive?: boolean;
  isPopular?: boolean;
}

export interface UpdateMealData {
  name?: string;
  description?: string | null;
  type?: string;
  cuisine?: string | null;
  servingStyle?: string;
  pricePerPerson?: number;
  minimumGuests?: number;
  menuItems?: any;
  beverages?: string[];
  specialDietary?: string[];
  serviceHours?: any;
  staffIncluded?: boolean;
  equipmentIncluded?: boolean;
  images?: string[];
  isActive?: boolean;
  isPopular?: boolean;
}

export interface MealResponse {
  id: string;
  name: string;
  description: string | null;
  type: string;
  cuisine: string | null;
  servingStyle: string;
  pricePerPerson: number;
  minimumGuests: number;
  menuItems: any;
  beverages: string[];
  specialDietary: string[];
  serviceHours: any;
  staffIncluded: boolean;
  equipmentIncluded: boolean;
  images: string[];
  isActive: boolean;
  isPopular: boolean;
  rating: number | null;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MealListResponse {
  id: string;
  name: string;
}

export interface MealDetailResponse {
  id: string;
  name: string;
  description: string | null;
  type: string;
  cuisine: string | null;
  servingStyle: string;
  pricePerPerson: number;
  minimumGuests: number;
  specialDietary: string[];
  rating: number | null;
  totalReviews: number;
  images: string[];
  isPopular: boolean;
  createdAt: Date;
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
    });

    return {
      ...meal,
      pricePerPerson: Number(meal.pricePerPerson),
      rating: meal.rating ? Number(meal.rating) : null,
    };
  }

  /**
   * Find meal by ID
   */
  async findById(id: string): Promise<MealResponse | null> {
    const meal = await prisma.meal.findUnique({
      where: { id },
    });

    if (!meal) return null;

    return {
      ...meal,
      pricePerPerson: Number(meal.pricePerPerson),
      rating: meal.rating ? Number(meal.rating) : null,
    };
  }

  /**
   * Update meal by ID
   */
  async updateById(id: string, updateData: UpdateMealData): Promise<MealResponse> {
    const meal = await prisma.meal.update({
      where: { id },
      data: updateData,
    });

    return {
      ...meal,
      pricePerPerson: Number(meal.pricePerPerson),
      rating: meal.rating ? Number(meal.rating) : null,
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
   * Get meals with pagination and filters (list view - essential data only)
   */
  async findMany(
    skip: number = 0,
    take: number = 10,
    filters: MealFilters = {}
  ): Promise<MealListResponse[]> {
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
      },
      orderBy: {
        name: 'asc',
      },
    });

    return meals;
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
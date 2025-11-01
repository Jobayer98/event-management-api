import { prisma } from '../../../config';
import { Venue } from '@prisma/client';

export interface CreateVenueData {
  name: string;
  address?: string | null;
  capacity?: number | null;
  pricePerHour: number;
  description?: string | null;
}

export interface UpdateVenueData {
  name?: string;
  address?: string | null;
  capacity?: number | null;
  pricePerHour?: number;
  description?: string | null;
}

export interface VenueResponse {
  id: string;
  name: string;
  address: string | null;
  capacity: number | null;
  pricePerHour: number;
  description: string | null;
  createdAt: Date;
}

export interface VenueFilters {
  search?: string;
  minCapacity?: number;
  maxCapacity?: number;
  minPrice?: number;
  maxPrice?: number;
}

export class VenueRepository {
  /**
   * Create a new venue
   */
  async create(venueData: CreateVenueData): Promise<VenueResponse> {
    const venue = await prisma.venue.create({
      data: venueData as any, // Type assertion to bypass Prisma client type mismatch
      select: {
        id: true,
        name: true,
        address: true,
        capacity: true,
        pricePerHour: true,
        description: true,
        createdAt: true,
      },
    });

    return {
      ...venue,
      pricePerHour: Number(venue.pricePerHour),
    };
  }

  /**
   * Find venue by ID
   */
  async findById(id: string): Promise<VenueResponse | null> {
    const venue = await prisma.venue.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        address: true,
        capacity: true,
        pricePerHour: true,
        description: true,
        createdAt: true,
      },
    });

    if (!venue) return null;

    return {
      ...venue,
      pricePerHour: Number(venue.pricePerHour),
    };
  }

  /**
   * Update venue by ID
   */
  async updateById(id: string, updateData: UpdateVenueData): Promise<VenueResponse> {
    const venue = await prisma.venue.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        address: true,
        capacity: true,
        pricePerHour: true,
        description: true,
        createdAt: true,
      },
    });

    return {
      ...venue,
      pricePerHour: Number(venue.pricePerHour),
    };
  }

  /**
   * Delete venue by ID
   */
  async deleteById(id: string): Promise<void> {
    await prisma.venue.delete({
      where: { id },
    });
  }

  /**
   * Get venues with pagination and filters
   */
  async findMany(
    skip: number = 0,
    take: number = 10,
    filters: VenueFilters = {}
  ): Promise<VenueResponse[]> {
    const { search, minCapacity, maxCapacity, minPrice, maxPrice } = filters;

    const whereClause: any = {};

    // Search filter (name or address)
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Capacity filters
    if (minCapacity !== undefined || maxCapacity !== undefined) {
      whereClause.capacity = {};
      if (minCapacity !== undefined) {
        whereClause.capacity.gte = minCapacity;
      }
      if (maxCapacity !== undefined) {
        whereClause.capacity.lte = maxCapacity;
      }
    }

    // Price filters
    if (minPrice !== undefined || maxPrice !== undefined) {
      whereClause.pricePerHour = {};
      if (minPrice !== undefined) {
        whereClause.pricePerHour.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        whereClause.pricePerHour.lte = maxPrice;
      }
    }

    const venues = await prisma.venue.findMany({
      where: whereClause,
      skip,
      take,
      select: {
        id: true,
        name: true,
        address: true,
        capacity: true,
        pricePerHour: true,
        description: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return venues.map(venue => ({
      ...venue,
      pricePerHour: Number(venue.pricePerHour),
    }));
  }

  /**
   * Count venues with filters
   */
  async count(filters: VenueFilters = {}): Promise<number> {
    const { search, minCapacity, maxCapacity, minPrice, maxPrice } = filters;

    const whereClause: any = {};

    // Search filter (name or address)
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Capacity filters
    if (minCapacity !== undefined || maxCapacity !== undefined) {
      whereClause.capacity = {};
      if (minCapacity !== undefined) {
        whereClause.capacity.gte = minCapacity;
      }
      if (maxCapacity !== undefined) {
        whereClause.capacity.lte = maxCapacity;
      }
    }

    // Price filters
    if (minPrice !== undefined || maxPrice !== undefined) {
      whereClause.pricePerHour = {};
      if (minPrice !== undefined) {
        whereClause.pricePerHour.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        whereClause.pricePerHour.lte = maxPrice;
      }
    }

    return await prisma.venue.count({
      where: whereClause,
    });
  }

  /**
   * Check if venue exists by ID
   */
  async existsById(id: string): Promise<boolean> {
    const venue = await prisma.venue.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!venue;
  }

  /**
   * Check if venue name exists (for uniqueness validation)
   */
  async existsByName(name: string, excludeId?: string): Promise<boolean> {
    const whereClause: any = {
      name: { equals: name, mode: 'insensitive' },
    };

    if (excludeId) {
      whereClause.id = { not: excludeId };
    }

    const venue = await prisma.venue.findFirst({
      where: whereClause,
      select: { id: true },
    });
    return !!venue;
  }
}

// Export singleton instance
export const venueRepository = new VenueRepository();
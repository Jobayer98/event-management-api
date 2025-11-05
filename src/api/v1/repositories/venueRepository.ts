import { prisma } from '../../../config';

export interface CreateVenueData {
  name: string;
  description?: string | null;
  address: string;
  city: string;
  state: string;
  zipCode?: string | null;
  country?: string;
  latitude?: number | null;
  longitude?: number | null;
  capacity: number;
  area?: number | null;
  venueType: string;
  pricePerDay: number;
  minimumDays?: number;
  securityDeposit?: number | null;
  facilities?: string[];
  amenities?: string[];
  cateringAllowed?: boolean;
  decorationAllowed?: boolean;
  alcoholAllowed?: boolean;
  smokingAllowed?: boolean;
  petFriendly?: boolean;
  images?: string[];
  virtualTourUrl?: string | null;
  contactPerson?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  operatingHours?: any;
  isActive?: boolean;
}

export interface UpdateVenueData {
  name?: string;
  description?: string | null;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string | null;
  country?: string;
  latitude?: number | null;
  longitude?: number | null;
  capacity?: number;
  area?: number | null;
  venueType?: string;
  pricePerDay?: number;
  minimumDays?: number;
  securityDeposit?: number | null;
  facilities?: string[];
  amenities?: string[];
  cateringAllowed?: boolean;
  decorationAllowed?: boolean;
  alcoholAllowed?: boolean;
  smokingAllowed?: boolean;
  petFriendly?: boolean;
  images?: string[];
  virtualTourUrl?: string | null;
  contactPerson?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  operatingHours?: any;
  isActive?: boolean;
}

export interface VenueResponse {
  id: string;
  name: string;
  description: string | null;
  address: string;
  city: string;
  state: string;
  zipCode: string | null;
  country: string;
  latitude: number | null;
  longitude: number | null;
  capacity: number;
  area: number | null;
  venueType: string;
  pricePerDay: number;
  minimumDays: number;
  securityDeposit: number | null;
  facilities: string[];
  amenities: string[];
  cateringAllowed: boolean;
  decorationAllowed: boolean;
  alcoholAllowed: boolean;
  smokingAllowed: boolean;
  petFriendly: boolean;
  images: string[];
  virtualTourUrl: string | null;
  contactPerson: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  operatingHours: any;
  isActive: boolean;
  rating: number | null;
  totalReviews: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface VenueListResponse {
  id: string;
  name: string;
  description: string | null;
  address: string;
  city: string;
  capacity: number;
  venueType: string;
  pricePerDay: number;
  rating: number | null;
  totalReviews: number;
  images: string[];
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
      data: venueData,
    });

    return {
      ...venue,
      pricePerDay: Number(venue.pricePerDay),
      latitude: venue.latitude ? Number(venue.latitude) : null,
      longitude: venue.longitude ? Number(venue.longitude) : null,
      area: venue.area ? Number(venue.area) : null,
      securityDeposit: venue.securityDeposit ? Number(venue.securityDeposit) : null,
      rating: venue.rating ? Number(venue.rating) : null,
    };
  }

  /**
   * Find venue by ID
   */
  async findById(id: string): Promise<VenueResponse | null> {
    const venue = await prisma.venue.findUnique({
      where: { id },
    });

    if (!venue) return null;

    return {
      ...venue,
      pricePerDay: Number(venue.pricePerDay),
      latitude: venue.latitude ? Number(venue.latitude) : null,
      longitude: venue.longitude ? Number(venue.longitude) : null,
      area: venue.area ? Number(venue.area) : null,
      securityDeposit: venue.securityDeposit ? Number(venue.securityDeposit) : null,
      rating: venue.rating ? Number(venue.rating) : null,
    };
  }

  /**
   * Update venue by ID
   */
  async updateById(id: string, updateData: UpdateVenueData): Promise<VenueResponse> {
    const venue = await prisma.venue.update({
      where: { id },
      data: updateData,
    });

    return {
      ...venue,
      pricePerDay: Number(venue.pricePerDay),
      latitude: venue.latitude ? Number(venue.latitude) : null,
      longitude: venue.longitude ? Number(venue.longitude) : null,
      area: venue.area ? Number(venue.area) : null,
      securityDeposit: venue.securityDeposit ? Number(venue.securityDeposit) : null,
      rating: venue.rating ? Number(venue.rating) : null,
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
   * Get venues with pagination and filters (list view - essential data only)
   */
  async findMany(
    skip: number = 0,
    take: number = 10,
    filters: VenueFilters = {}
  ): Promise<VenueListResponse[]> {
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
      whereClause.pricePerDay = {};
      if (minPrice !== undefined) {
        whereClause.pricePerDay.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        whereClause.pricePerDay.lte = maxPrice;
      }
    }

    const venues = await prisma.venue.findMany({
      where: whereClause,
      skip,
      take,
      select: {
        id: true,
        name: true,
        description: true,
        address: true,
        city: true,
        capacity: true,
        venueType: true,
        pricePerDay: true,
        rating: true,
        totalReviews: true,
        images: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return venues.map(venue => ({
      ...venue,
      pricePerDay: Number(venue.pricePerDay),
      rating: venue.rating ? Number(venue.rating) : null,
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
      whereClause.pricePerDay = {};
      if (minPrice !== undefined) {
        whereClause.pricePerDay.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        whereClause.pricePerDay.lte = maxPrice;
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
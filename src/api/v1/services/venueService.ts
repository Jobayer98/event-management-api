import { venueRepository, CreateVenueData, UpdateVenueData, VenueResponse, VenueFilters } from '../repositories/venueRepository';
import { createError } from '../../../middleware/errorHandler';
import { logger } from '../../../config';

export interface CreateVenueInput {
  name: string;
  address?: string;
  capacity?: number;
  pricePerHour: number;
  description?: string;
}

export interface UpdateVenueInput {
  name?: string;
  address?: string;
  capacity?: number;
  pricePerHour?: number;
  description?: string;
}

export interface VenueListResponse {
  venues: VenueResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export class VenueService {
  /**
   * Create a new venue
   */
  async createVenue(venueData: CreateVenueInput): Promise<VenueResponse> {
    const { name, address, capacity, pricePerHour, description } = venueData;

    logger.info(`Creating new venue: ${name}`);

    try {
      // Check if venue name already exists
      const nameExists = await venueRepository.existsByName(name);
      if (nameExists) {
        logger.warn(`Venue creation failed - name already exists: ${name}`);
        throw createError('Venue name already exists', 409);
      }

      // Prepare venue data
      const createData: CreateVenueData = {
        name,
        address: address || null,
        capacity: capacity || null,
        pricePerHour,
        description: description || null,
      };

      // Create venue
      const venue = await venueRepository.create(createData);

      logger.info(`Venue created successfully: ${venue.id} - ${name}`);
      return venue;

    } catch (error: any) {
      // If it's already our custom error, re-throw it
      if (error.statusCode) {
        throw error;
      }

      logger.error('Venue creation error:', {
        error: error.message,
        name,
      });

      // Handle Prisma unique constraint errors
      if (error.code === 'P2002') {
        throw createError('Venue name already exists', 409);
      }

      // Handle other database errors
      if (error.code?.startsWith('P')) {
        throw createError('Database error occurred', 500);
      }

      throw createError('Failed to create venue', 500);
    }
  }

  /**
   * Get venue by ID
   */
  async getVenueById(id: string): Promise<VenueResponse> {
    logger.info(`Fetching venue by ID: ${id}`);

    const venue = await venueRepository.findById(id);
    if (!venue) {
      logger.warn(`Venue not found: ${id}`);
      throw createError('Venue not found', 404);
    }

    return venue;
  }

  /**
   * Update venue by ID
   */
  async updateVenue(id: string, updateData: UpdateVenueInput): Promise<VenueResponse> {
    logger.info(`Updating venue: ${id}`);

    try {
      // Check if venue exists
      const exists = await venueRepository.existsById(id);
      if (!exists) {
        logger.warn(`Venue update failed - not found: ${id}`);
        throw createError('Venue not found', 404);
      }

      // Check if name is being updated and already exists
      if (updateData.name) {
        const nameExists = await venueRepository.existsByName(updateData.name, id);
        if (nameExists) {
          logger.warn(`Venue update failed - name already exists: ${updateData.name}`);
          throw createError('Venue name already exists', 409);
        }
      }

      // Prepare update data
      const updateVenueData: UpdateVenueData = {
        ...(updateData.name && { name: updateData.name }),
        ...(updateData.address !== undefined && { address: updateData.address || null }),
        ...(updateData.capacity !== undefined && { capacity: updateData.capacity || null }),
        ...(updateData.pricePerHour !== undefined && { pricePerHour: updateData.pricePerHour }),
        ...(updateData.description !== undefined && { description: updateData.description || null }),
      };

      // Update venue
      const venue = await venueRepository.updateById(id, updateVenueData);

      logger.info(`Venue updated successfully: ${id}`);
      return venue;

    } catch (error: any) {
      // If it's already our custom error, re-throw it
      if (error.statusCode) {
        throw error;
      }

      logger.error('Venue update error:', {
        error: error.message,
        id,
      });

      // Handle Prisma unique constraint errors
      if (error.code === 'P2002') {
        throw createError('Venue name already exists', 409);
      }

      // Handle record not found errors
      if (error.code === 'P2025') {
        throw createError('Venue not found', 404);
      }

      // Handle other database errors
      if (error.code?.startsWith('P')) {
        throw createError('Database error occurred', 500);
      }

      throw createError('Failed to update venue', 500);
    }
  }

  /**
   * Delete venue by ID
   */
  async deleteVenue(id: string): Promise<void> {
    logger.info(`Deleting venue: ${id}`);

    try {
      // Check if venue exists
      const exists = await venueRepository.existsById(id);
      if (!exists) {
        logger.warn(`Venue deletion failed - not found: ${id}`);
        throw createError('Venue not found', 404);
      }

      // Delete venue
      await venueRepository.deleteById(id);

      logger.info(`Venue deleted successfully: ${id}`);

    } catch (error: any) {
      // If it's already our custom error, re-throw it
      if (error.statusCode) {
        throw error;
      }

      logger.error('Venue deletion error:', {
        error: error.message,
        id,
      });

      // Handle record not found errors
      if (error.code === 'P2025') {
        throw createError('Venue not found', 404);
      }

      // Handle foreign key constraint errors (venue has events)
      if (error.code === 'P2003') {
        throw createError('Cannot delete venue with existing events', 409);
      }

      // Handle other database errors
      if (error.code?.startsWith('P')) {
        throw createError('Database error occurred', 500);
      }

      throw createError('Failed to delete venue', 500);
    }
  }

  /**
   * Get venues with pagination and filters
   */
  async getVenues(
    page: number = 1,
    limit: number = 10,
    filters: VenueFilters = {}
  ): Promise<VenueListResponse> {
    logger.info(`Fetching venues - page: ${page}, limit: ${limit}`, { filters });

    try {
      const skip = (page - 1) * limit;

      // Get venues and total count
      const [venues, total] = await Promise.all([
        venueRepository.findMany(skip, limit, filters),
        venueRepository.count(filters),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        venues,
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
      logger.error('Venue listing error:', {
        error: error.message,
        page,
        limit,
        filters,
      });

      throw createError('Failed to fetch venues', 500);
    }
  }
}

// Export singleton instance
export const venueService = new VenueService();
import { Request, Response, NextFunction } from 'express';
import { venueService } from '../services/venueService';
import { logger } from '../../../config';
import { CreateVenueInput, UpdateVenueInput, VenueQueryInput } from '../../../schemas/venue';

/**
 * Create a new venue
 * POST /api/v1/venues
 */
export const createVenue = async (
  req: Request<{}, {}, CreateVenueInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const venueData = req.body;

    logger.info(`Admin creating venue: ${venueData.name}`);

    // Call the venue service to create the venue
    const venue = await venueService.createVenue(venueData);

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Venue created successfully',
      data: venue,
    });

  } catch (error: any) {
    logger.error('Create venue controller error:', {
      error: error.message,
      stack: error.stack,
      venueData: req.body,
    });

    // Pass the error to the error handler middleware
    next(error);
  }
};

/**
 * Get venue by ID
 * GET /api/v1/venues/:id
 */
export const getVenueById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    logger.info(`Fetching venue by ID: ${id}`);

    // Call the venue service to get the venue
    const venue = await venueService.getVenueById(id);

    // Return success response
    res.status(200).json({
      success: true,
      data: venue,
    });

  } catch (error: any) {
    logger.error('Get venue by ID controller error:', {
      error: error.message,
      stack: error.stack,
      venueId: req.params.id,
    });

    // Pass the error to the error handler middleware
    next(error);
  }
};

/**
 * Update venue by ID
 * PUT /api/v1/venues/:id
 */
export const updateVenue = async (
  req: Request<{ id: string }, {}, UpdateVenueInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    logger.info(`Admin updating venue: ${id}`);

    // Call the venue service to update the venue
    const venue = await venueService.updateVenue(id, updateData);

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Venue updated successfully',
      data: venue,
    });

  } catch (error: any) {
    logger.error('Update venue controller error:', {
      error: error.message,
      stack: error.stack,
      venueId: req.params.id,
      updateData: req.body,
    });

    // Pass the error to the error handler middleware
    next(error);
  }
};

/**
 * Delete venue by ID
 * DELETE /api/v1/venues/:id
 */
export const deleteVenue = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    logger.info(`Admin deleting venue: ${id}`);

    // Call the venue service to delete the venue
    await venueService.deleteVenue(id);

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Venue deleted successfully',
    });

  } catch (error: any) {
    logger.error('Delete venue controller error:', {
      error: error.message,
      stack: error.stack,
      venueId: req.params.id,
    });

    // Pass the error to the error handler middleware
    next(error);
  }
};

/**
 * Get venues with pagination and filters
 * GET /api/v1/venues
 */
export const getVenues = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = req.query as any;
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const search = query.search;
    const minCapacity = query.minCapacity ? parseInt(query.minCapacity) : undefined;
    const maxCapacity = query.maxCapacity ? parseInt(query.maxCapacity) : undefined;
    const minPrice = query.minPrice ? parseFloat(query.minPrice) : undefined;
    const maxPrice = query.maxPrice ? parseFloat(query.maxPrice) : undefined;

    logger.info(`Fetching venues with filters`, { 
      page, 
      limit, 
      search, 
      minCapacity, 
      maxCapacity, 
      minPrice, 
      maxPrice 
    });

    // Prepare filters
    const filters = {
      ...(search && { search }),
      ...(minCapacity && { minCapacity }),
      ...(maxCapacity && { maxCapacity }),
      ...(minPrice && { minPrice }),
      ...(maxPrice && { maxPrice }),
    };

    // Call the venue service to get venues
    const result = await venueService.getVenues(page, limit, filters);

    // Return success response
    res.status(200).json({
      success: true,
      data: result.venues,
      pagination: result.pagination,
    });

  } catch (error: any) {
    logger.error('Get venues controller error:', {
      error: error.message,
      stack: error.stack,
      query: req.query,
    });

    // Pass the error to the error handler middleware
    next(error);
  }
};
import { Request, Response, NextFunction } from 'express';
import { eventService } from '../services/eventService';
import { logger } from '../../../config';
import { CheckAvailabilityInput, CreateEventInput, UpdateEventInput, EventQueryInput } from '../../../schemas/event';

/**
 * Check venue availability for event booking
 * POST /api/v1/events/check-availability
 */
export const checkAvailability = async (
  req: Request<{}, {}, CheckAvailabilityInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const availabilityData = req.body;

    logger.info(`Checking availability for venue ${availabilityData.venueId}`);

    // Call the event service to check availability
    const result = await eventService.checkAvailability(availabilityData);

    // Return response with appropriate status
    const statusCode = result.available ? 200 : 409;
    
    res.status(statusCode).json({
      success: true,
      data: result,
    });

  } catch (error: any) {
    logger.error('Check availability controller error:', {
      error: error.message,
      stack: error.stack,
      requestData: req.body,
    });

    // Pass the error to the error handler middleware
    next(error);
  }
};

/**
 * Create a new event booking
 * POST /api/v1/events
 */
export const createEvent = async (
  req: Request<{}, {}, CreateEventInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const eventData = req.body;
    
    // Get user ID from JWT token (assuming auth middleware sets req.user)
    const userId = (req as any).user?.userId;
    if (!userId) {
      logger.warn('Event creation attempted without user authentication');
      return next({ statusCode: 401, message: 'Please log in to book an event. Authentication is required.' });
    }

    logger.info(`User ${userId} creating event at venue ${eventData.venueId}`);

    // Call the event service to create the event
    const event = await eventService.createEvent({
      ...eventData,
      userId,
    });

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Event booked successfully',
      data: event,
    });

  } catch (error: any) {
    logger.error('Create event controller error:', {
      error: error.message,
      stack: error.stack,
      eventData: req.body,
      userId: (req as any).user?.userId,
    });

    // Pass the error to the error handler middleware
    next(error);
  }
};

/**
 * Get user's events with pagination and filters
 * GET /api/v1/events
 */
export const getUserEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get user ID from JWT token
    const userId = (req as any).user?.userId;
    if (!userId) {
      logger.warn('Get events attempted without user authentication');
      return next({ statusCode: 401, message: 'Please log in to view your events. Authentication is required.' });
    }

    const query = req.query as any;
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const status = query.status;
    const eventType = query.eventType;

    logger.info(`Fetching events for user ${userId}`, { 
      page, 
      limit, 
      status, 
      eventType 
    });

    // Prepare filters
    const filters = {
      ...(status && { status }),
      ...(eventType && { eventType }),
    };

    // Call the event service to get user events
    const result = await eventService.getUserEvents(userId, page, limit, filters);

    // Return success response
    res.status(200).json({
      success: true,
      data: result.events,
      pagination: result.pagination,
    });

  } catch (error: any) {
    logger.error('Get user events controller error:', {
      error: error.message,
      stack: error.stack,
      query: req.query,
      userId: (req as any).user?.userId,
    });

    // Pass the error to the error handler middleware
    next(error);
  }
};

/**
 * Get event by ID
 * GET /api/v1/events/:id
 */
export const getEventById = async (
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    
    // Get user ID from JWT token
    const userId = (req as any).user?.userId;
    if (!userId) {
      logger.warn('Get event by ID attempted without user authentication');
      return next({ statusCode: 401, message: 'Please log in to view event details. Authentication is required.' });
    }

    logger.info(`User ${userId} fetching event ${id}`);

    // Call the event service to get the event
    const event = await eventService.getEventById(id, userId);

    // Return success response
    res.status(200).json({
      success: true,
      data: event,
    });

  } catch (error: any) {
    logger.error('Get event by ID controller error:', {
      error: error.message,
      stack: error.stack,
      eventId: req.params.id,
      userId: (req as any).user?.userId,
    });

    // Pass the error to the error handler middleware
    next(error);
  }
};

/**
 * Update event (people count and meal only)
 * PUT /api/v1/events/:id
 */
export const updateEvent = async (
  req: Request<{ id: string }, {}, UpdateEventInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Get user ID from JWT token
    const userId = (req as any).user?.userId;
    if (!userId) {
      logger.warn('Event update attempted without user authentication');
      return next({ statusCode: 401, message: 'Please log in to update your event. Authentication is required.' });
    }

    logger.info(`User ${userId} updating event ${id}`);

    // Call the event service to update the event
    const event = await eventService.updateEvent(id, userId, updateData);

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: event,
    });

  } catch (error: any) {
    logger.error('Update event controller error:', {
      error: error.message,
      stack: error.stack,
      eventId: req.params.id,
      updateData: req.body,
      userId: (req as any).user?.userId,
    });

    // Pass the error to the error handler middleware
    next(error);
  }
};
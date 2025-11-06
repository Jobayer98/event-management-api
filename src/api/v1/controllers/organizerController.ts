import { Request, Response, NextFunction } from 'express';
import { organizerService } from '../services/organizerService';
import { logger } from '../../../config';
import { LoginOrganizerInput, UpdateAdminProfileInput, UpdateAdminPasswordInput } from '../../../schemas/auth';
import { UpdateEventStatusInput, AdminEventQueryInput } from '../../../schemas/event';

/**
 * Login admin
 * POST /api/v1/admin/login
 */
export const loginAdmin = async (
  req: Request<{}, {}, LoginOrganizerInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    logger.info(`Admin login attempt: ${email}`);

    // Call the organizer service to login the admin
    const result = await organizerService.loginOrganizer({
      email,
      password,
    });

    logger.info(`Admin login successful: ${email}`);

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Admin logged in successfully',
      data: result,
    });

  } catch (error: any) {
    logger.error('Admin login controller error:', {
      error: error.message,
      stack: error.stack,
      email: req.body?.email,
    });

    // Pass the error to the error handler middleware
    next(error);
  }
};

/**
 * Get admin profile
 * GET /api/v1/admin/profile
 */
export const getAdminProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const adminId = req.user?.userId;

    if (!adminId) {
      return next(new Error('Admin ID not found in token'));
    }

    logger.info(`Admin profile request: ${adminId}`);

    // Get admin profile
    const admin = await organizerService.getOrganizerById(adminId);

    if (!admin) {
      return next(new Error('Admin not found'));
    }

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Admin profile retrieved successfully',
      data: { admin },
    });

  } catch (error: any) {
    logger.error('Get admin profile controller error:', {
      error: error.message,
      stack: error.stack,
      adminId: req.user?.userId,
    });

    // Pass the error to the error handler middleware
    next(error);
  }
};

/**
 * Update admin profile
 * PUT /api/v1/admin/profile
 */
export const updateAdminProfile = async (
  req: Request<{}, any, UpdateAdminProfileInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const adminId = req.user?.userId;
    const { name, phone } = req.body;

    if (!adminId) {
      return next(new Error('Admin ID not found in token'));
    }

    logger.info(`Admin profile update request: ${adminId}`);

    // Update admin profile
    const updatedAdmin = await organizerService.updateAdminProfile(adminId, {
      name,
      phone,
    });

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Admin profile updated successfully',
      data: { admin: updatedAdmin },
    });

  } catch (error: any) {
    logger.error('Update admin profile controller error:', {
      error: error.message,
      stack: error.stack,
      adminId: req.user?.userId,
    });

    // Pass the error to the error handler middleware
    next(error);
  }
};

/**
 * Update admin password
 * PUT /api/v1/admin/password
 */
export const updateAdminPassword = async (
  req: Request<{}, any, UpdateAdminPasswordInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const adminId = req.user?.userId;
    const { currentPassword, newPassword } = req.body;

    if (!adminId) {
      return next(new Error('Admin ID not found in token'));
    }

    logger.info(`Admin password update request: ${adminId}`);

    // Update admin password
    await organizerService.updateAdminPassword(adminId, {
      currentPassword,
      newPassword,
    });

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Admin password updated successfully',
    });

  } catch (error: any) {
    logger.error('Update admin password controller error:', {
      error: error.message,
      stack: error.stack,
      adminId: req.user?.userId,
    });

    // Pass the error to the error handler middleware
    next(error);
  }
};

/**
 * Get all events (Admin/Organizer only)
 * GET /api/v1/admin/events
 */
export const getAllEvents = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get query parameters directly from request (validation already passed)
    const query = req.query as any;

    // Convert and validate query parameters with safe defaults
    const queryParams: AdminEventQueryInput = {
      page: query.page ? parseInt(String(query.page), 10) || 1 : 1,
      limit: query.limit ? parseInt(String(query.limit), 10) || 10 : 10,
      status: query.status || undefined,
      eventType: query.eventType || undefined,
    };

    logger.info('Admin get all events request:', {
      adminId: req.user?.userId,
      queryParams,
    });

    // Get all events with pagination and filters
    const result = await organizerService.getAllEvents(queryParams);

    logger.info('Admin get all events successful:', {
      adminId: req.user?.userId,
      totalEvents: result.pagination.totalEvents,
      currentPage: result.pagination.currentPage,
    });

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Events retrieved successfully',
      data: result,
    });

  } catch (error: any) {
    logger.error('Admin get all events controller error:', {
      error: error.message,
      stack: error.stack,
      adminId: req.user?.userId,
      queryParams: req.query,
    });

    // Pass the error to the error handler middleware
    next(error);
  }
};

/**
 * Get event by ID (Admin/Organizer only)
 * GET /api/v1/admin/events/:eventId
 */
export const getEventById = async (
  req: Request<{ eventId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { eventId } = req.params;

    logger.info('Admin get event by ID request:', {
      adminId: req.user?.userId,
      eventId,
    });

    // Get event by ID
    const event = await organizerService.getEventById(eventId);

    logger.info('Admin get event by ID successful:', {
      adminId: req.user?.userId,
      eventId,
    });

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Event retrieved successfully',
      data: { event },
    });

  } catch (error: any) {
    logger.error('Admin get event by ID controller error:', {
      error: error.message,
      stack: error.stack,
      adminId: req.user?.userId,
      eventId: req.params.eventId,
    });

    // Pass the error to the error handler middleware
    next(error);
  }
};

/**
 * Update event status (Admin/Organizer only)
 * PATCH /api/v1/admin/events/:eventId/status
 */
export const updateEventStatus = async (
  req: Request<{ eventId: string }, {}, UpdateEventStatusInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { eventId } = req.params;
    const statusData = req.body;

    logger.info('Admin update event status request:', {
      adminId: req.user?.userId,
      eventId,
      newStatus: statusData.status,
    });

    // Update event status
    const updatedEvent = await organizerService.updateEventStatus(eventId, statusData);

    logger.info('Admin update event status successful:', {
      adminId: req.user?.userId,
      eventId,
      newStatus: statusData.status,
    });

    // Return success response
    res.status(200).json({
      success: true,
      message: `Event status updated to ${statusData.status} successfully`,
      data: { event: updatedEvent },
    });

  } catch (error: any) {
    logger.error('Admin update event status controller error:', {
      error: error.message,
      stack: error.stack,
      adminId: req.user?.userId,
      eventId: req.params.eventId,
      statusData: req.body,
    });

    // Pass the error to the error handler middleware
    next(error);
  }
};
import { Request, Response, NextFunction } from 'express';
import { organizerService } from '../services/organizerService';
import { logger } from '../../../config';
import { RegisterOrganizerInput, LoginOrganizerInput } from '../../../schemas/auth';

/**
 * Register a new organizer
 * POST /api/v1/organizer/register
 */
export const registerOrganizer = async (
  req: Request<{}, {}, RegisterOrganizerInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, phone } = req.body;

    // Call the organizer service to register the organizer
    const result = await organizerService.registerOrganizer({
      name,
      email,
      password,
      phone,
    });

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Organizer registered successfully',
      data: result,
    });

  } catch (error: any) {
    logger.error('Organizer registration controller error:', {
      error: error.message,
      stack: error.stack,
      email: req.body?.email,
    });

    // Pass the error to the error handler middleware
    next(error);
  }
};

/**
 * Login organizer
 * POST /api/v1/organizer/login
 */
export const loginOrganizer = async (
  req: Request<{}, {}, LoginOrganizerInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    logger.info(`Organizer login attempt: ${email}`);

    // Call the organizer service to login the organizer
    const result = await organizerService.loginOrganizer({
      email,
      password,
    });

    logger.info(`Organizer login successful: ${email}`);

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Organizer logged in successfully',
      data: result,
    });

  } catch (error: any) {
    logger.error('Organizer login controller error:', {
      error: error.message,
      stack: error.stack,
      email: req.body?.email,
    });

    // Pass the error to the error handler middleware
    next(error);
  }
};

/**
 * Debug endpoint to check admin status
 * GET /api/v1/organizer/debug/admin
 */
export const debugAdminStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@eventmanagement.com';
    const admin = await organizerService.getOrganizerByEmail(adminEmail);

    res.status(200).json({
      success: true,
      data: {
        adminExists: !!admin,
        adminEmail,
        admin: admin ? {
          id: admin.id,
          name: admin.name,
          email: admin.email,
          createdAt: admin.createdAt,
        } : null,
      },
    });

  } catch (error: any) {
    logger.error('Debug admin status error:', error);
    next(error);
  }
};
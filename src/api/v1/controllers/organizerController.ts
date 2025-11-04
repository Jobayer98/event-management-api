import { Request, Response, NextFunction } from 'express';
import { organizerService } from '../services/organizerService';
import { logger } from '../../../config';
import { LoginOrganizerInput, UpdateAdminProfileInput, UpdateAdminPasswordInput } from '../../../schemas/auth';

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
import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';
import { logger } from '../../../config';
import { RegisterUserInput } from '../../../schemas/auth';

/**
 * Register a new user
 * POST /api/v1/auth/register
 */
export const registerUser = async (
  req: Request<{}, {}, RegisterUserInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, phone } = req.body;

    // Call the auth service to register the user
    const result = await authService.registerUser({
      name,
      email,
      password,
      phone,
    });

    // Return success response
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: result,
    });

  } catch (error: any) {
    logger.error('Registration controller error:', {
      error: error.message,
      stack: error.stack,
      email: req.body?.email,
    });

    // Pass the error to the error handler middleware
    next(error);
  }
};
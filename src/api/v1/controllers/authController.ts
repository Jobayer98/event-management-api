import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';
import { logger } from '../../../config';
import { RegisterUserInput, LoginUserInput, ResetPasswordRequestInput, ResetPasswordConfirmInput } from '../../../schemas/auth';

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

/**
 * Login user
 * POST /api/v1/auth/login
 */
export const loginUser = async (
  req: Request<{}, {}, LoginUserInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Call the auth service to login the user
    const result = await authService.loginUser({
      email,
      password,
    });

    // Return success response
    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      data: result,
    });

  } catch (error: any) {
    logger.error('Login controller error:', {
      error: error.message,
      stack: error.stack,
      email: req.body?.email,
    });

    // Pass the error to the error handler middleware
    next(error);
  }
};

/**
 * Request password reset
 * POST /api/v1/auth/reset
 */
export const requestPasswordReset = async (
  req: Request<{}, {}, ResetPasswordRequestInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;

    // Call the auth service to request password reset
    const result = await authService.requestPasswordReset({ email });

    // Return success response
    res.status(200).json({
      success: true,
      message: result.message,
      ...(result.resetToken && { data: { resetToken: result.resetToken } }),
    });

  } catch (error: any) {
    logger.error('Password reset request controller error:', {
      error: error.message,
      stack: error.stack,
      email: req.body?.email,
    });

    // Pass the error to the error handler middleware
    next(error);
  }
};

/**
 * Confirm password reset
 * PUT /api/v1/auth/reset
 */
export const confirmPasswordReset = async (
  req: Request<{}, {}, ResetPasswordConfirmInput>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token, newPassword } = req.body;

    // Call the auth service to confirm password reset
    const result = await authService.confirmPasswordReset({
      token,
      newPassword,
    });

    // Return success response
    res.status(200).json({
      success: true,
      message: result.message,
    });

  } catch (error: any) {
    logger.error('Password reset confirmation controller error:', {
      error: error.message,
      stack: error.stack,
    });

    // Pass the error to the error handler middleware
    next(error);
  }
};
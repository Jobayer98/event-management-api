import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/auth';
import { createError } from './errorHandler';
import { logger } from '../config';

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role?: string;
      };
    }
  }
}

/**
 * Authentication middleware to verify JWT tokens
 */
export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      logger.warn('Authentication failed - no token provided');
      return next(createError('Please log in to access this feature. No authentication token provided.', 401));
    }

    // Verify the token
    const decoded = verifyToken(token);
    
    // Add user info to request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    logger.info(`User authenticated: ${decoded.userId} (${decoded.email})`);
    next();

  } catch (error: any) {
    logger.warn('Authentication failed - invalid token:', error.message);
    next(createError('Your session has expired or the token is invalid. Please log in again.', 401));
  }
};

/**
 * Authorization middleware to check user roles
 */
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(createError('Please log in to access this feature. Authentication is required.', 401));
    }

    const userRole = req.user.role || 'user';
    
    if (!allowedRoles.includes(userRole)) {
      logger.warn(`Authorization failed - user ${req.user.userId} with role ${userRole} tried to access resource requiring roles: ${allowedRoles.join(', ')}`);
      return next(createError('You do not have permission to access this feature. Admin privileges required.', 403));
    }

    next();
  };
};
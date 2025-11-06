import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';
import logger from '../config/logger';

/**
 * Middleware to validate request body using Zod schema
 */
export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      // Validate and parse the request body
      const validatedData = schema.parse(req.body);
      
      // Replace req.body with validated and sanitized data
      req.body = validatedData;
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));

        logger.warn('Validation failed:', {
          url: req.url,
          method: req.method,
          errors: validationErrors,
        });

        res.status(400).json({
          success: false,
          error: {
            message: 'Validation failed',
            details: validationErrors,
          },
        });
        return;
      }

      // Handle unexpected errors
      logger.error('Unexpected validation error:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Internal server error during validation',
        },
      });
    }
  };
};

/**
 * Middleware to validate query parameters using Zod schema
 */
export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      logger.info('Query validation input:', { query: req.query });
      const validatedData = schema.parse(req.query);
      logger.info('Query validation success:', { validatedData });
      req.query = validatedData as any;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.issues.map((issue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));

        logger.warn('Zod validation failed:', {
          query: req.query,
          errors: validationErrors
        });

        res.status(400).json({
          success: false,
          error: {
            message: 'Query validation failed',
            details: validationErrors,
          },
        });
        return;
      }

      logger.error('Non-Zod validation error:', {
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        query: req.query
      });

      res.status(500).json({
        success: false,
        error: {
          message: 'Internal server error during query validation',
        },
      });
    }
  };
};
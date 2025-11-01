import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  
  // Log the incoming request
  logger.http(`${req.method} ${req.url} - ${req.ip}`);
  
  // Listen for the response to finish
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    
    // Determine log level based on status code
    const logLevel = statusCode >= 400 ? 'warn' : 'http';
    
    logger.log(logLevel, `${req.method} ${req.url} ${statusCode} - ${duration}ms`);
  });
  
  next();
};
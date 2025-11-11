import { Request, Response, NextFunction } from 'express';
import logger, { logRequest } from '../config/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  
  // Log the incoming request
  logger.http(`Incoming: ${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
    contentType: req.get('content-type'),
  });
  
  // Listen for the response to finish
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusCode = res.statusCode;
    
    // Use structured logging helper
    logRequest(req.method, req.url, statusCode, duration, {
      ip: req.ip,
      userAgent: req.get('user-agent'),
      contentLength: res.get('content-length'),
    });
    
    // Log slow requests
    if (duration > 1000) {
      logger.warn(`Slow request detected: ${req.method} ${req.url}`, {
        duration: `${duration}ms`,
        statusCode,
      });
    }
  });
  
  next();
};
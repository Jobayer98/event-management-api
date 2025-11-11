import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Tell winston to link the colors
winston.addColors(colors);

// Define which level to log based on environment
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'info';
};

// Console format with colors and readable output
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => {
    const { timestamp, level, message, ...meta } = info;
    let metaStr = '';

    // Add metadata if present
    if (Object.keys(meta).length > 0) {
      metaStr = '\n' + JSON.stringify(meta, null, 2);
    }

    return `${timestamp} [${level}]: ${message}${metaStr}`;
  }),
);

// File format with structured JSON
const fileLogFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.metadata({ fillExcept: ['message', 'level', 'timestamp', 'label'] }),
  winston.format.json(),
);

// Daily rotate file transport for combined logs
const combinedRotateTransport = new DailyRotateFile({
  filename: path.join('logs', 'combined-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d',
  format: fileLogFormat,
  level: 'http',
});

// Daily rotate file transport for error logs
const errorRotateTransport = new DailyRotateFile({
  filename: path.join('logs', 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '30d',
  format: fileLogFormat,
  level: 'error',
});

// Daily rotate file transport for HTTP requests
const httpRotateTransport = new DailyRotateFile({
  filename: path.join('logs', 'http-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '7d',
  format: fileLogFormat,
  level: 'http',
});

// Define transports
const transports: winston.transport[] = [
  // Console transport
  new winston.transports.Console({
    format: consoleFormat,
  }),
  combinedRotateTransport,
  errorRotateTransport,
  httpRotateTransport,
];

// Create the logger
const logger = winston.createLogger({
  level: level(),
  levels,
  transports,
  // Handle uncaught exceptions
  exceptionHandlers: [
    new DailyRotateFile({
      filename: path.join('logs', 'exceptions-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
      format: fileLogFormat,
    }),
  ],
  // Handle unhandled promise rejections
  rejectionHandlers: [
    new DailyRotateFile({
      filename: path.join('logs', 'rejections-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
      format: fileLogFormat,
    }),
  ],
  // Exit on handled exceptions
  exitOnError: false,
});

// Log rotation events
combinedRotateTransport.on('rotate', (oldFilename, newFilename) => {
  logger.info('Log file rotated', { oldFilename, newFilename });
});

// Helper methods for structured logging
export const logError = (message: string, error: Error, metadata?: Record<string, any>) => {
  logger.error(message, {
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name,
    },
    ...metadata,
  });
};

export const logRequest = (method: string, url: string, statusCode: number, duration: number, metadata?: Record<string, any>) => {
  const logLevel = statusCode >= 400 ? 'warn' : 'http';
  logger.log(logLevel, `${method} ${url} ${statusCode} - ${duration}ms`, metadata);
};

export const logAuth = (action: string, userId?: string, success: boolean = true, metadata?: Record<string, any>) => {
  logger.info(`Auth: ${action}`, {
    userId,
    success,
    action,
    ...metadata,
  });
};

export const logDatabase = (operation: string, table: string, duration?: number, metadata?: Record<string, any>) => {
  logger.debug(`DB: ${operation} on ${table}`, {
    operation,
    table,
    duration: duration ? `${duration}ms` : undefined,
    ...metadata,
  });
};

export const logPerformance = (operation: string, duration: number, metadata?: Record<string, any>) => {
  const level = duration > 1000 ? 'warn' : 'debug';
  logger.log(level, `Performance: ${operation} took ${duration}ms`, {
    operation,
    duration,
    ...metadata,
  });
};

export default logger;
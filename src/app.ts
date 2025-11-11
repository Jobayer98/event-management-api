import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { apiLimiter } from './middleware/rateLimiter';
import v1Routes from './api';
import logger from './config/logger';
import { swaggerSpec } from './config/swagger';

// Load environment variables
dotenv.config();

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Helmet security headers
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
      crossOriginEmbedderPolicy: false, // Allow Swagger UI to work
    }));

    // CORS configuration
    const corsOptions = {
      origin: process.env.NODE_ENV === 'production'
        ? process.env.ALLOWED_ORIGINS?.split(',') || []
        : true, // Allow all origins in development
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'Cache-Control',
        'Pragma'
      ],
      credentials: true,
      optionsSuccessStatus: 200
    };

    this.app.use(cors(corsOptions));

    // Trust proxy (for rate limiting behind reverse proxy)
    this.app.set('trust proxy', 1);

    // Request logging middleware
    this.app.use(requestLogger);

    // Global rate limiter (applied to all routes)
    this.app.use('/api/', apiLimiter);

    // Body parsing middleware - skip only for file upload routes (single/multiple)
    this.app.use((req, res, next) => {
      if (req.path === '/api/v1/upload/single' ||
        req.path === '/api/v1/upload/multiple' ||
        req.path === '/api/v1/upload/test') {
        return next();
      }
      express.json({ limit: '10mb' })(req, res, next);
    });
    this.app.use((req, res, next) => {
      if (req.path === '/api/v1/upload/single' ||
        req.path === '/api/v1/upload/multiple' ||
        req.path === '/api/v1/upload/test') {
        return next();
      }
      express.urlencoded({ extended: true })(req, res, next);
    });

    logger.info('Security middlewares initialized');
  }

  private initializeRoutes(): void {
    // Swagger documentation
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'Event Management API Documentation',
      swaggerOptions: {
        requestInterceptor: (req: any) => {
          // Don't override Content-Type for multipart/form-data requests (file uploads)
          if (!req.url.includes('/upload')) {
            req.headers['Content-Type'] = 'application/json';
          }
          return req;
        }
      }
    }));

    // API routes
    this.app.use('/api', v1Routes);

    // Root endpoint
    this.app.get('/', (req, res) => {
      res.json({
        success: true,
        message: 'Express + Prisma + PostgreSQL API Server',
        version: '1.0.0',
        documentation: '/api-docs'
      });
    });
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use(notFoundHandler);

    // Global error handler
    this.app.use(errorHandler);
  }
}

export default new App().app;
import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
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

    // this.app.use(cors());
    this.app.use(cors());
    // Request logging middleware
    this.app.use(requestLogger);

    // Body parsing middleware
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));

    // Basic security headers
    this.app.use((_req, res, next) => {
      res.header('X-Content-Type-Options', 'nosniff');
      res.header('X-Frame-Options', 'DENY');
      res.header('X-XSS-Protection', '1; mode=block');
      next();
    });

    logger.info('Middlewares initialized');
  }

  private initializeRoutes(): void {
    // Swagger documentation
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'Event Management API Documentation',
      swaggerOptions: {
        requestInterceptor: (req: any) => {
          req.headers['Content-Type'] = 'application/json';
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
import { organizerRepository } from './api/v1/repositories/organizerRepository';
import app from './app';
import { logger, DatabaseConnection } from './config';
import { hashPassword } from './utils/auth';
import { startMetricsLogging, startStatsLogging, getSystemMetrics } from './utils/monitoring';


const PORT = Number(process.env.PORT) || 3000;

async function startServer(): Promise<void> {
    try {
        logger.info('Starting server initialization...');

        // Connect to database
        await DatabaseConnection.connect();
        logger.info('Database connection established');

        // Create admin user if not exists (before starting server)
        const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@admin.com";
        const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin123!@";
        const ADMIN_NAME = process.env.ADMIN_NAME || "System Administrator";

        const existingAdmin = await organizerRepository.findByEmail(ADMIN_EMAIL);
        if (!existingAdmin) {
            const passwordHash = await hashPassword(ADMIN_PASSWORD);
            await organizerRepository.create({
                email: ADMIN_EMAIL,
                passwordHash,
                name: ADMIN_NAME
            });
            logger.info('Admin user created successfully');
        } else {
            logger.info('Admin user already exists');
        }

        // Start Express server
        const server = app.listen(PORT, '0.0.0.0', () => {
            logger.info(`Server running on port ${PORT}`);
            logger.info(`Health check: http://localhost:${PORT}/api/health`);
            logger.info(`Swagger docs: http://localhost:${PORT}/api-docs`);
            logger.info('Server is ready to accept connections');

            // Log initial system metrics
            const metrics = getSystemMetrics();
            logger.info('Initial system state', metrics);
        });

        // Start monitoring (log metrics every 15 minutes, stats every 30 minutes)
        startMetricsLogging(15);
        startStatsLogging(30);
        logger.info('Monitoring services started');

        // Add error handler for server
        server.on('error', (error: any) => {
            logger.error('Server error:', error);
            process.exit(1);
        });

        // Graceful shutdown
        const gracefulShutdown = async (signal: string) => {
            logger.info(`${signal} received, shutting down gracefully...`);

        // Stop accepting new connections
            server.close(async () => {
                logger.info('HTTP server closed');

                // Disconnect from database
                await DatabaseConnection.disconnect();
                logger.info('Database connection closed');

                // Log final metrics
                const finalMetrics = getSystemMetrics();
                logger.info('Final system state', finalMetrics);

                logger.info('Server shutdown complete');
                process.exit(0);
            });

            // Force shutdown after 30 seconds
            setTimeout(() => {
                logger.error('Forced shutdown after timeout');
                process.exit(1);
            }, 30000);
        };

        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));

        process.on('exit', (code) => {
            logger.info(`Process exiting with code: ${code}`);
        });

        // Handle uncaught exceptions
        process.on('uncaughtException', (error) => {
            logger.error('Uncaught Exception:', error);
            gracefulShutdown('uncaughtException');
        });

        // Handle unhandled promise rejections
        process.on('unhandledRejection', (reason, promise) => {
            logger.error('Unhandled Rejection at:', { promise, reason });
        });

        logger.info('Server startup complete, entering event loop...');

    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

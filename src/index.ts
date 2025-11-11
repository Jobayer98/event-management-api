import { organizerRepository } from './api/v1/repositories/organizerRepository';
import app from './app';
import { logger, DatabaseConnection } from './config';
import { hashPassword } from './utils/auth';


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
        });

        // Add error handler for server
        server.on('error', (error: any) => {
            logger.error('Server error:', error);
            process.exit(1);
        });

        // Graceful shutdown
        process.on('SIGTERM', async () => {
            logger.info('SIGTERM received, shutting down gracefully...');
            server.close(async () => {
                await DatabaseConnection.disconnect();
                logger.info('Server shutdown complete');
                process.exit(0);
            });
        });

        process.on('SIGINT', async () => {
            logger.info('SIGINT received, shutting down gracefully...');
            server.close(async () => {
                await DatabaseConnection.disconnect();
                logger.info('Server shutdown complete');
                process.exit(0);
            });
        });

        process.on('exit', (code) => {
            logger.info(`Process exiting with code: ${code}`);
        });

        logger.info('Server startup complete, entering event loop...');

    } catch (error) {
        logger.error('Failed to start server:', error);
        process.exit(1);
    }
}

startServer();

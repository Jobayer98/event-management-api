import app from './app';
import { logger, DatabaseConnection } from './config';


const PORT = Number(process.env.PORT) || 3000;

async function startServer(): Promise<void> {
    try {
        logger.info('Starting server initialization...');

        // Connect to database
        await DatabaseConnection.connect();
        logger.info('Database connection established');

        // Start Express server
        const server = app.listen(PORT, 'localhost', () => {
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

        // Keep the process alive with heartbeat
        // setInterval(() => {
        //     logger.debug(`Server heartbeat - ${new Date().toISOString()}`);
        // }, 60000); // Log every minute

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

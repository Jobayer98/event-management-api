import { Router } from 'express';
import { prisma } from '../config/database';
import { getSystemMetrics, RequestTracker } from '../utils/monitoring';
import logger from '../config/logger';

const router = Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint
 *     description: Check API health status, database connectivity, and system metrics
 *     tags: [System]
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: API is healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                   description: Server uptime in seconds
 *                 database:
 *                   type: string
 *                   example: connected
 *                 memory:
 *                   type: object
 *                   properties:
 *                     used:
 *                       type: number
 *                       description: Memory used in MB
 *                     total:
 *                       type: number
 *                       description: Total memory in MB
 *                     percentage:
 *                       type: number
 *                       description: Memory usage percentage
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalRequests:
 *                       type: number
 *                     totalErrors:
 *                       type: number
 *       503:
 *         description: Service unavailable
 */
router.get('/', async (req, res) => {
    const startTime = Date.now();

    try {
        // Check database connection with timeout
        const dbCheckPromise = prisma.$queryRaw`SELECT 1`;
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Database timeout')), 5000)
        );

        await Promise.race([dbCheckPromise, timeoutPromise]);

        const dbResponseTime = Date.now() - startTime;
        const metrics = getSystemMetrics();
        const stats = RequestTracker.getStats();

        res.json({
            success: true,
            message: 'API is healthy',
            timestamp: new Date().toISOString(),
            uptime: Math.floor(metrics.uptime),
            database: {
                status: 'connected',
                responseTime: `${dbResponseTime}ms`
            },
            memory: metrics.memory,
            stats: {
                totalRequests: stats.totalRequests,
                totalErrors: stats.totalErrors,
            },
            environment: process.env.NODE_ENV || 'development',
        });
    } catch (error) {
        logger.error('Health check failed', { error });

        const metrics = getSystemMetrics();

        res.status(503).json({
            success: false,
            message: 'Service unavailable',
            timestamp: new Date().toISOString(),
            uptime: Math.floor(metrics.uptime),
            database: {
                status: 'disconnected',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            memory: metrics.memory,
        });
    }
});


export default router;
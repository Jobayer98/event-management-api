import { Router } from 'express';
import { prisma } from '../config/database';

const router = Router();

// Health check endpoint
router.get('/', async (req, res) => {
    try {
        // Check database connection
        await prisma.$queryRaw`SELECT 1`;

        res.json({
            success: true,
            message: 'API is healthy',
            timestamp: new Date().toISOString(),
            database: 'connected',
        });
    } catch (error) {
        res.status(503).json({
            success: false,
            message: 'Service unavailable',
            timestamp: new Date().toISOString(),
            database: 'disconnected',
        });
    }
});


export default router;
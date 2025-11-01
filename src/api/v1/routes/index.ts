import { Router } from 'express';
import authRoutes from './auth';
import organizerRoutes from './organizer';

const router = Router();

// Authentication routes
router.use('/auth', authRoutes);

// Organizer routes
router.use('/organizer', organizerRoutes);

export default router;
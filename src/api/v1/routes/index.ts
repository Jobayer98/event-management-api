import { Router } from 'express';
import authRoutes from './auth';
import organizerRoutes from './organizer';
import venueRoutes from './venues';

const router = Router();

// Authentication routes
router.use('/auth', authRoutes);

// Organizer routes
router.use('/organizer', organizerRoutes);

// Venue routes
router.use('/venues', venueRoutes);

export default router;
import { Router } from 'express';
import authRoutes from './auth';
import organizerRoutes from './organizer';
import venueRoutes from './venues';
import eventRoutes from './events';
import mealRoutes from './meals';
import paymentRoutes from './payments';

const router = Router();

// Authentication routes
router.use('/auth', authRoutes);

// Admin routes
router.use('/admin', organizerRoutes);

// Venue routes
router.use('/venues', venueRoutes);

// Meal routes
router.use('/meals', mealRoutes);

// Event routes
router.use('/events', eventRoutes);

router.use('/payments', paymentRoutes);

export default router;
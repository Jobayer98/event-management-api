import { Router } from 'express';
import authRoutes from './auth';
import organizerRoutes from './organizer';
import venueRoutes from './venues';
import eventRoutes from './events';
import mealRoutes from './meals';
import paymentRoutes from './payments';
import adminMealRoutes from './admin/meals';

const router = Router();

// Authentication routes
router.use('/auth', authRoutes);

// Admin routes
router.use('/admin', organizerRoutes);
router.use('/admin/meals', adminMealRoutes);

// Venue routes
router.use('/venues', venueRoutes);

// Meal routes (User)
router.use('/meals', mealRoutes);

// Event routes
router.use('/events', eventRoutes);

router.use('/payments', paymentRoutes);

export default router;
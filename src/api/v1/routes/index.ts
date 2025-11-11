import { Router } from 'express';
import authRoutes from './auth';
import organizerRoutes from './adminAuth';
import venueRoutes from './venues';
import eventRoutes from './events';
import mealRoutes from './meals';
import paymentRoutes from './payments';
import adminMealRoutes from './adminMeals';
import adminVenueRoutes from './adminVenues';
import adminEventRoutes from './adminEvents';
import adminAnalyticsRoutes from './adminAnalytics';
import uploadRoutes from './upload';

const router = Router();

// Authentication routes
router.use('/auth', authRoutes);

// Admin routes
router.use('/admin', organizerRoutes);
router.use('/admin/meals', adminMealRoutes);
router.use('/admin/venues', adminVenueRoutes);
router.use('/admin/events', adminEventRoutes);
router.use('/admin/analytics', adminAnalyticsRoutes);

// Venue routes
router.use('/venues', venueRoutes);

// Meal routes (User)
router.use('/meals', mealRoutes);

// Event routes
router.use('/events', eventRoutes);

router.use('/payments', paymentRoutes);

// Upload routes
router.use('/upload', uploadRoutes);

export default router;
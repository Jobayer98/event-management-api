import { Request, Response, NextFunction } from 'express';
import { analyticsService } from '../services/analyticsService';
import { logger } from '../../../config';
import { 
  AnalyticsQueryInput, 
  RevenueAnalyticsQueryInput, 
  TopPerformersQueryInput 
} from '../../../schemas/analytics';

/**
 * Get revenue analytics with time-based grouping
 * GET /api/v1/admin/analytics/revenue
 */
export const getRevenueAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = req.query as any;

    logger.info('Admin fetching revenue analytics', { query });

    const analytics = await analyticsService.getRevenueAnalytics(query);

    res.status(200).json({
      success: true,
      data: analytics,
    });

  } catch (error: any) {
    logger.error('Revenue analytics controller error:', {
      error: error.message,
      stack: error.stack,
      query: req.query,
    });

    next(error);
  }
};

/**
 * Get top performing venues
 * GET /api/v1/admin/analytics/venues/top
 */
export const getTopVenues = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = req.query as any;

    logger.info('Admin fetching top venues', { query });

    const topVenues = await analyticsService.getTopVenues(query);

    res.status(200).json({
      success: true,
      data: topVenues,
    });

  } catch (error: any) {
    logger.error('Top venues controller error:', {
      error: error.message,
      stack: error.stack,
      query: req.query,
    });

    next(error);
  }
};

/**
 * Get top performing meals
 * GET /api/v1/admin/analytics/meals/top
 */
export const getTopMeals = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = req.query as any;

    logger.info('Admin fetching top meals', { query });

    const topMeals = await analyticsService.getTopMeals(query);

    res.status(200).json({
      success: true,
      data: topMeals,
    });

  } catch (error: any) {
    logger.error('Top meals controller error:', {
      error: error.message,
      stack: error.stack,
      query: req.query,
    });

    next(error);
  }
};

/**
 * Get event type analytics
 * GET /api/v1/admin/analytics/event-types
 */
export const getEventTypeAnalytics = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = req.query as any;

    logger.info('Admin fetching event type analytics', { query });

    const analytics = await analyticsService.getEventTypeAnalytics(query);

    res.status(200).json({
      success: true,
      data: analytics,
    });

  } catch (error: any) {
    logger.error('Event type analytics controller error:', {
      error: error.message,
      stack: error.stack,
      query: req.query,
    });

    next(error);
  }
};

/**
 * Get dashboard statistics
 * GET /api/v1/admin/analytics/dashboard
 */
export const getDashboardStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = req.query as any;

    logger.info('Admin fetching dashboard statistics', { query });

    const stats = await analyticsService.getDashboardStats(query);

    res.status(200).json({
      success: true,
      data: stats,
    });

  } catch (error: any) {
    logger.error('Dashboard stats controller error:', {
      error: error.message,
      stack: error.stack,
      query: req.query,
    });

    next(error);
  }
};
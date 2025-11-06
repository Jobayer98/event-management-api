import { analyticsRepository, RevenueAnalytics, TopVenue, TopMeal, EventTypeAnalytics, DashboardStats } from '../repositories/analyticsRepository';
import { createError } from '../../../middleware/errorHandler';
import { logger } from '../../../config';

export interface AnalyticsQueryInput {
  startDate?: string;
  endDate?: string;
  period?: 'day' | 'week' | 'month' | 'year';
}

export interface RevenueAnalyticsQueryInput extends AnalyticsQueryInput {
  groupBy?: 'day' | 'week' | 'month' | 'year';
}

export interface TopPerformersQueryInput {
  limit?: number;
  startDate?: string;
  endDate?: string;
}

export class AnalyticsService {
  /**
   * Get revenue analytics with time-based grouping
   */
  async getRevenueAnalytics(query: RevenueAnalyticsQueryInput): Promise<RevenueAnalytics[]> {
    const { startDate, endDate, groupBy = 'month' } = query;

    logger.info('Fetching revenue analytics', { startDate, endDate, groupBy });

    try {
      // Parse dates if provided
      const parsedStartDate = startDate ? new Date(startDate) : undefined;
      const parsedEndDate = endDate ? new Date(endDate) : undefined;

      // Validate date range
      if (parsedStartDate && parsedEndDate && parsedStartDate >= parsedEndDate) {
        throw createError('Start date must be before end date', 400);
      }

      const analytics = await analyticsRepository.getRevenueAnalytics(
        parsedStartDate,
        parsedEndDate,
        groupBy
      );

      logger.info(`Retrieved ${analytics.length} revenue analytics records`);
      return analytics;

    } catch (error: any) {
      if (error.statusCode) {
        throw error;
      }

      logger.error('Revenue analytics service error:', {
        error: error.message,
        query,
      });

      throw createError('Unable to retrieve revenue analytics at this time', 500);
    }
  }

  /**
   * Get top performing venues
   */
  async getTopVenues(query: TopPerformersQueryInput): Promise<TopVenue[]> {
    const { limit = 10, startDate, endDate } = query;

    logger.info('Fetching top venues', { limit, startDate, endDate });

    try {
      // Validate limit
      if (limit < 1 || limit > 50) {
        throw createError('Limit must be between 1 and 50', 400);
      }

      // Parse dates if provided
      const parsedStartDate = startDate ? new Date(startDate) : undefined;
      const parsedEndDate = endDate ? new Date(endDate) : undefined;

      // Validate date range
      if (parsedStartDate && parsedEndDate && parsedStartDate >= parsedEndDate) {
        throw createError('Start date must be before end date', 400);
      }

      const topVenues = await analyticsRepository.getTopVenues(
        limit,
        parsedStartDate,
        parsedEndDate
      );

      logger.info(`Retrieved ${topVenues.length} top venues`);
      return topVenues;

    } catch (error: any) {
      if (error.statusCode) {
        throw error;
      }

      logger.error('Top venues service error:', {
        error: error.message,
        query,
      });

      throw createError('Unable to retrieve top venues at this time', 500);
    }
  }

  /**
   * Get top performing meals
   */
  async getTopMeals(query: TopPerformersQueryInput): Promise<TopMeal[]> {
    const { limit = 10, startDate, endDate } = query;

    logger.info('Fetching top meals', { limit, startDate, endDate });

    try {
      // Validate limit
      if (limit < 1 || limit > 50) {
        throw createError('Limit must be between 1 and 50', 400);
      }

      // Parse dates if provided
      const parsedStartDate = startDate ? new Date(startDate) : undefined;
      const parsedEndDate = endDate ? new Date(endDate) : undefined;

      // Validate date range
      if (parsedStartDate && parsedEndDate && parsedStartDate >= parsedEndDate) {
        throw createError('Start date must be before end date', 400);
      }

      const topMeals = await analyticsRepository.getTopMeals(
        limit,
        parsedStartDate,
        parsedEndDate
      );

      logger.info(`Retrieved ${topMeals.length} top meals`);
      return topMeals;

    } catch (error: any) {
      if (error.statusCode) {
        throw error;
      }

      logger.error('Top meals service error:', {
        error: error.message,
        query,
      });

      throw createError('Unable to retrieve top meals at this time', 500);
    }
  }

  /**
   * Get event type analytics
   */
  async getEventTypeAnalytics(query: AnalyticsQueryInput): Promise<EventTypeAnalytics[]> {
    const { startDate, endDate } = query;

    logger.info('Fetching event type analytics', { startDate, endDate });

    try {
      // Parse dates if provided
      const parsedStartDate = startDate ? new Date(startDate) : undefined;
      const parsedEndDate = endDate ? new Date(endDate) : undefined;

      // Validate date range
      if (parsedStartDate && parsedEndDate && parsedStartDate >= parsedEndDate) {
        throw createError('Start date must be before end date', 400);
      }

      const analytics = await analyticsRepository.getEventTypeAnalytics(
        parsedStartDate,
        parsedEndDate
      );

      logger.info(`Retrieved ${analytics.length} event type analytics records`);
      return analytics;

    } catch (error: any) {
      if (error.statusCode) {
        throw error;
      }

      logger.error('Event type analytics service error:', {
        error: error.message,
        query,
      });

      throw createError('Unable to retrieve event type analytics at this time', 500);
    }
  }

  /**
   * Get dashboard statistics
   */
  async getDashboardStats(query: AnalyticsQueryInput): Promise<DashboardStats> {
    const { startDate, endDate } = query;

    logger.info('Fetching dashboard statistics', { startDate, endDate });

    try {
      // Parse dates if provided
      const parsedStartDate = startDate ? new Date(startDate) : undefined;
      const parsedEndDate = endDate ? new Date(endDate) : undefined;

      // Validate date range
      if (parsedStartDate && parsedEndDate && parsedStartDate >= parsedEndDate) {
        throw createError('Start date must be before end date', 400);
      }

      const stats = await analyticsRepository.getDashboardStats(
        parsedStartDate,
        parsedEndDate
      );

      logger.info('Retrieved dashboard statistics successfully');
      return stats;

    } catch (error: any) {
      if (error.statusCode) {
        throw error;
      }

      logger.error('Dashboard stats service error:', {
        error: error.message,
        query,
      });

      throw createError('Unable to retrieve dashboard statistics at this time', 500);
    }
  }
}

// Export singleton instance
export const analyticsService = new AnalyticsService();
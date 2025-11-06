import { PrismaClient } from '@prisma/client';
import { DatabaseConnection } from '../../../config';
import { logger } from '../../../config';

export interface RevenueAnalytics {
  period: string;
  totalRevenue: number;
  eventCount: number;
  averageEventValue: number;
}

export interface TopVenue {
  id: string;
  name: string;
  eventCount: number;
  totalRevenue: number;
  averageEventValue: number;
}

export interface TopMeal {
  id: string;
  name: string;
  orderCount: number;
  totalRevenue: number;
  averageOrderValue: number;
}

export interface EventTypeAnalytics {
  eventType: string;
  count: number;
  totalRevenue: number;
  averageValue: number;
  percentage: number;
}

export interface DashboardStats {
  totalEvents: number;
  totalRevenue: number;
  averageEventValue: number;
  totalUsers: number;
  totalVenues: number;
  totalMeals: number;
  recentEvents: number;
  pendingEvents: number;
  confirmedEvents: number;
  cancelledEvents: number;
}

export class AnalyticsRepository {
  private db: PrismaClient;

  constructor() {
    this.db = DatabaseConnection.getInstance();
  }

  /**
   * Get revenue analytics grouped by time period
   */
  async getRevenueAnalytics(
    startDate?: Date,
    endDate?: Date,
    groupBy: 'day' | 'week' | 'month' | 'year' = 'month'
  ): Promise<RevenueAnalytics[]> {
    try {
      const whereClause: any = {};
      
      if (startDate || endDate) {
        whereClause.createdAt = {};
        if (startDate) whereClause.createdAt.gte = startDate;
        if (endDate) whereClause.createdAt.lte = endDate;
      }

      // Get raw data
      const events = await this.db.event.findMany({
        where: whereClause,
        select: {
          totalCost: true,
          createdAt: true,
          status: true,
        },
      });

      // Group by time period
      const grouped = new Map<string, { totalRevenue: number; eventCount: number }>();

      events.forEach(event => {
        let periodKey: string;
        const date = event.createdAt;

        switch (groupBy) {
          case 'day':
            periodKey = date.toISOString().split('T')[0];
            break;
          case 'week':
            const weekStart = new Date(date);
            weekStart.setDate(date.getDate() - date.getDay());
            periodKey = weekStart.toISOString().split('T')[0];
            break;
          case 'month':
            periodKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            break;
          case 'year':
            periodKey = date.getFullYear().toString();
            break;
        }

        if (!grouped.has(periodKey)) {
          grouped.set(periodKey, { totalRevenue: 0, eventCount: 0 });
        }

        const group = grouped.get(periodKey)!;
        const cost = event.totalCost ? Number(event.totalCost) : 0;
        group.totalRevenue += cost;
        group.eventCount += 1;
      });

      // Convert to array and calculate averages
      return Array.from(grouped.entries()).map(([period, data]) => ({
        period,
        totalRevenue: data.totalRevenue,
        eventCount: data.eventCount,
        averageEventValue: data.eventCount > 0 ? data.totalRevenue / data.eventCount : 0,
      })).sort((a, b) => a.period.localeCompare(b.period));

    } catch (error: any) {
      logger.error('Revenue analytics repository error:', error);
      throw error;
    }
  }

  /**
   * Get top performing venues
   */
  async getTopVenues(limit: number = 10, startDate?: Date, endDate?: Date): Promise<TopVenue[]> {
    try {
      const whereClause: any = {};
      
      if (startDate || endDate) {
        whereClause.createdAt = {};
        if (startDate) whereClause.createdAt.gte = startDate;
        if (endDate) whereClause.createdAt.lte = endDate;
      }

      const venues = await this.db.venue.findMany({
        select: {
          id: true,
          name: true,
          events: {
            where: whereClause,
            select: {
              totalCost: true,
            },
          },
        },
      });

      const venueStats = venues.map(venue => {
        const eventCount = venue.events.length;
        const totalRevenue = venue.events.reduce((sum, event) => {
          const cost = event.totalCost ? Number(event.totalCost) : 0;
          return sum + cost;
        }, 0);
        
        return {
          id: venue.id,
          name: venue.name,
          eventCount,
          totalRevenue,
          averageEventValue: eventCount > 0 ? totalRevenue / eventCount : 0,
        };
      }).filter(venue => venue.eventCount > 0)
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, limit);

      return venueStats;

    } catch (error: any) {
      logger.error('Top venues repository error:', error);
      throw error;
    }
  }

  /**
   * Get top performing meals
   */
  async getTopMeals(limit: number = 10, startDate?: Date, endDate?: Date): Promise<TopMeal[]> {
    try {
      const whereClause: any = {
        mealId: { not: null },
      };
      
      if (startDate || endDate) {
        whereClause.createdAt = {};
        if (startDate) whereClause.createdAt.gte = startDate;
        if (endDate) whereClause.createdAt.lte = endDate;
      }

      const meals = await this.db.meal.findMany({
        select: {
          id: true,
          name: true,
          pricePerPerson: true,
          events: {
            where: whereClause,
            select: {
              peopleCount: true,
              totalCost: true,
            },
          },
        },
      });

      const mealStats = meals.map(meal => {
        const orderCount = meal.events.length;
        const totalRevenue = meal.events.reduce((sum, event) => {
          const mealCost = Number(meal.pricePerPerson) * event.peopleCount;
          return sum + mealCost;
        }, 0);
        
        return {
          id: meal.id,
          name: meal.name,
          orderCount,
          totalRevenue,
          averageOrderValue: orderCount > 0 ? totalRevenue / orderCount : 0,
        };
      }).filter(meal => meal.orderCount > 0)
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, limit);

      return mealStats;

    } catch (error: any) {
      logger.error('Top meals repository error:', error);
      throw error;
    }
  }

  /**
   * Get event type analytics
   */
  async getEventTypeAnalytics(startDate?: Date, endDate?: Date): Promise<EventTypeAnalytics[]> {
    try {
      const whereClause: any = {};
      
      if (startDate || endDate) {
        whereClause.createdAt = {};
        if (startDate) whereClause.createdAt.gte = startDate;
        if (endDate) whereClause.createdAt.lte = endDate;
      }

      const events = await this.db.event.findMany({
        where: whereClause,
        select: {
          eventType: true,
          totalCost: true,
        },
      });

      // Group by event type
      const grouped = new Map<string, { count: number; totalRevenue: number }>();
      let totalEvents = 0;
      let grandTotalRevenue = 0;

      events.forEach(event => {
        if (!grouped.has(event.eventType)) {
          grouped.set(event.eventType, { count: 0, totalRevenue: 0 });
        }

        const group = grouped.get(event.eventType)!;
        const cost = event.totalCost ? Number(event.totalCost) : 0;
        group.count += 1;
        group.totalRevenue += cost;
        totalEvents += 1;
        grandTotalRevenue += cost;
      });

      // Convert to array with percentages
      return Array.from(grouped.entries()).map(([eventType, data]) => ({
        eventType,
        count: data.count,
        totalRevenue: data.totalRevenue,
        averageValue: data.count > 0 ? data.totalRevenue / data.count : 0,
        percentage: totalEvents > 0 ? (data.count / totalEvents) * 100 : 0,
      })).sort((a, b) => b.totalRevenue - a.totalRevenue);

    } catch (error: any) {
      logger.error('Event type analytics repository error:', error);
      throw error;
    }
  }

  /**
   * Get dashboard statistics
   */
  async getDashboardStats(startDate?: Date, endDate?: Date): Promise<DashboardStats> {
    try {
      const whereClause: any = {};
      
      if (startDate || endDate) {
        whereClause.createdAt = {};
        if (startDate) whereClause.createdAt.gte = startDate;
        if (endDate) whereClause.createdAt.lte = endDate;
      }

      const [
        events,
        totalUsers,
        totalVenues,
        totalMeals,
        eventStatusCounts
      ] = await Promise.all([
        this.db.event.findMany({
          where: whereClause,
          select: {
            totalCost: true,
            status: true,
            createdAt: true,
          },
        }),
        this.db.user.count(),
        this.db.venue.count(),
        this.db.meal.count(),
        this.db.event.groupBy({
          by: ['status'],
          where: whereClause,
          _count: {
            status: true,
          },
        }),
      ]);

      const totalEvents = events.length;
      const totalRevenue = events.reduce((sum, event) => {
        const cost = event.totalCost ? Number(event.totalCost) : 0;
        return sum + cost;
      }, 0);
      const averageEventValue = totalEvents > 0 ? totalRevenue / totalEvents : 0;

      // Count recent events (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const recentEvents = events.filter(event => event.createdAt >= thirtyDaysAgo).length;

      // Count by status
      const statusCounts = eventStatusCounts.reduce((acc, item) => {
        acc[item.status] = item._count.status;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalEvents,
        totalRevenue,
        averageEventValue,
        totalUsers,
        totalVenues,
        totalMeals,
        recentEvents,
        pendingEvents: statusCounts.pending || 0,
        confirmedEvents: statusCounts.confirmed || 0,
        cancelledEvents: statusCounts.cancelled || 0,
      };

    } catch (error: any) {
      logger.error('Dashboard stats repository error:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const analyticsRepository = new AnalyticsRepository();
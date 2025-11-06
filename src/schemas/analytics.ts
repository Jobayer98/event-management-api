import { z } from 'zod';

// Analytics query schemas
export const analyticsQuerySchema = z.object({
  startDate: z.string().optional().refine((date) => {
    if (!date) return true;
    return !isNaN(Date.parse(date));
  }, { message: 'Invalid start date format' }),
  endDate: z.string().optional().refine((date) => {
    if (!date) return true;
    return !isNaN(Date.parse(date));
  }, { message: 'Invalid end date format' }),
  period: z.enum(['day', 'week', 'month', 'year']).optional().default('month'),
});

export const revenueAnalyticsQuerySchema = analyticsQuerySchema.extend({
  groupBy: z.enum(['day', 'week', 'month', 'year']).optional().default('month'),
});

export const topPerformersQuerySchema = z.object({
  limit: z.number().min(1).max(50).optional().default(10),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

// Type exports
export type AnalyticsQueryInput = z.infer<typeof analyticsQuerySchema>;
export type RevenueAnalyticsQueryInput = z.infer<typeof revenueAnalyticsQuerySchema>;
export type TopPerformersQueryInput = z.infer<typeof topPerformersQuerySchema>;
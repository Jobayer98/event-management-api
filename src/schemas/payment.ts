import { z } from 'zod';

export const calculateCostSchema = z.object({
  venueId: z.string().uuid('Invalid venue ID format'),
  mealId: z.string().uuid('Invalid meal ID format').optional(),
  peopleCount: z.number().int().min(50, 'People count must be at least 1').max(10000, 'People count cannot exceed 10,000'),
  startTime: z.string().datetime('Invalid start time format'),
  endTime: z.string().datetime('Invalid end time format')
}).refine(
  (data) => new Date(data.endTime) > new Date(data.startTime),
  {
    message: 'End time must be after start time',
    path: ['endTime']
  }
);

export const processPaymentSchema = z.object({
  eventId: z.string().uuid('Invalid event ID format').optional(),
  paymentMethod: z.enum(['card', 'bkash', 'nagad', 'rocket'], {
    message: 'Invalid payment method'
  }),
  venueId: z.string().uuid('Invalid venue ID format'),
  mealId: z.string().uuid('Invalid meal ID format').optional(),
  peopleCount: z.number().int().min(50, 'People count must be at least 1').max(10000, 'People count cannot exceed 10,000'),
  startTime: z.string().datetime('Invalid start time format'),
  endTime: z.string().datetime('Invalid end time format'),
  eventType: z.string().min(1, 'Event type is required').max(100, 'Event type too long').optional()
}).refine(
  (data) => new Date(data.endTime) > new Date(data.startTime),
  {
    message: 'End time must be after start time',
    path: ['endTime']
  }
);

export const refundPaymentSchema = z.object({
  paymentId: z.string().uuid('Invalid payment ID format'),
  reason: z.string().min(10, 'Refund reason must be at least 10 characters').max(500, 'Refund reason too long')
});

export const paymentStatusSchema = z.object({
  transactionId: z.string().min(1, 'Transaction ID is required')
});

export type CalculateCostInput = z.infer<typeof calculateCostSchema>;
export type ProcessPaymentInput = z.infer<typeof processPaymentSchema>;
export type RefundPaymentInput = z.infer<typeof refundPaymentSchema>;
export type PaymentStatusInput = z.infer<typeof paymentStatusSchema>;
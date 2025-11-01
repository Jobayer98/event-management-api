import { z } from 'zod';

// Check availability schema
export const checkAvailabilitySchema = z.object({
  venueId: z
    .string()
    .uuid('Invalid venue ID format'),
  
  startTime: z
    .string()
    .datetime('Invalid start time format. Use ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)'),
  
  endTime: z
    .string()
    .datetime('Invalid end time format. Use ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)')
}).refine(
  (data) => {
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);
    return end > start;
  },
  {
    message: 'End time must be after start time',
    path: ['endTime'],
  }
).refine(
  (data) => {
    const start = new Date(data.startTime);
    const now = new Date();
    return start > now;
  },
  {
    message: 'Event start time must be in the future',
    path: ['startTime'],
  }
);

export type CheckAvailabilityInput = z.infer<typeof checkAvailabilitySchema>;

// Create event booking schema
export const createEventSchema = z.object({
  venueId: z
    .string()
    .uuid('Invalid venue ID format'),
  
  mealId: z
    .string()
    .uuid('Invalid meal ID format')
    .optional(),
  
  eventType: z
    .string()
    .min(2, 'Event type must be at least 2 characters')
    .max(100, 'Event type must not exceed 100 characters')
    .trim(),
  
  peopleCount: z
    .number()
    .int('People count must be a whole number')
    .min(1, 'People count must be at least 1')
    .max(10000, 'People count cannot exceed 10,000'),
  
  startTime: z
    .string()
    .datetime('Invalid start time format. Use ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)'),
  
  endTime: z
    .string()
    .datetime('Invalid end time format. Use ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)')
}).refine(
  (data) => {
    const start = new Date(data.startTime);
    const end = new Date(data.endTime);
    return end > start;
  },
  {
    message: 'End time must be after start time',
    path: ['endTime'],
  }
).refine(
  (data) => {
    const start = new Date(data.startTime);
    const now = new Date();
    return start > now;
  },
  {
    message: 'Event start time must be in the future',
    path: ['startTime'],
  }
);

export type CreateEventInput = z.infer<typeof createEventSchema>;

// Event query schema for listing user events
export const eventQuerySchema = z.object({
  page: z
    .string()
    .regex(/^\d+$/, 'Page must be a number')
    .transform(Number)
    .refine(val => val >= 1, 'Page must be at least 1')
    .optional()
    .or(z.undefined())
    .default(1),
  
  limit: z
    .string()
    .regex(/^\d+$/, 'Limit must be a number')
    .transform(Number)
    .refine(val => val >= 1 && val <= 100, 'Limit must be between 1 and 100')
    .optional()
    .or(z.undefined())
    .default(10),
  
  status: z
    .enum(['pending', 'confirmed', 'cancelled'])
    .optional(),
  
  eventType: z
    .string()
    .max(100, 'Event type must not exceed 100 characters')
    .trim()
    .optional()
});

export type EventQueryInput = z.infer<typeof eventQuerySchema>;
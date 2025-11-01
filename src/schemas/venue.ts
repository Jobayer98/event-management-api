import { z } from 'zod';

// Create venue schema
export const createVenueSchema = z.object({
  name: z
    .string()
    .min(2, 'Venue name must be at least 2 characters')
    .max(150, 'Venue name must not exceed 150 characters')
    .trim(),
  
  address: z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(500, 'Address must not exceed 500 characters')
    .trim()
    .optional(),
  
  capacity: z
    .number()
    .int('Capacity must be a whole number')
    .min(1, 'Capacity must be at least 1')
    .max(10000, 'Capacity cannot exceed 10,000')
    .optional(),
  
  pricePerHour: z
    .number()
    .min(0, 'Price per hour cannot be negative')
    .max(999999.99, 'Price per hour cannot exceed 999,999.99'),
  
  description: z
    .string()
    .max(1000, 'Description must not exceed 1000 characters')
    .trim()
    .optional()
});

export type CreateVenueInput = z.infer<typeof createVenueSchema>;

// Update venue schema (all fields optional except validation rules)
export const updateVenueSchema = z.object({
  name: z
    .string()
    .min(2, 'Venue name must be at least 2 characters')
    .max(150, 'Venue name must not exceed 150 characters')
    .trim()
    .optional(),
  
  address: z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(500, 'Address must not exceed 500 characters')
    .trim()
    .optional(),
  
  capacity: z
    .number()
    .int('Capacity must be a whole number')
    .min(1, 'Capacity must be at least 1')
    .max(10000, 'Capacity cannot exceed 10,000')
    .optional(),
  
  pricePerHour: z
    .number()
    .min(0, 'Price per hour cannot be negative')
    .max(999999.99, 'Price per hour cannot exceed 999,999.99')
    .optional(),
  
  description: z
    .string()
    .max(1000, 'Description must not exceed 1000 characters')
    .trim()
    .optional()
});

export type UpdateVenueInput = z.infer<typeof updateVenueSchema>;

// Query parameters for venue listing
export const venueQuerySchema = z.object({
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
  
  search: z
    .string()
    .max(100, 'Search term must not exceed 100 characters')
    .trim()
    .optional(),
  
  minCapacity: z
    .string()
    .regex(/^\d+$/, 'Min capacity must be a number')
    .transform(Number)
    .optional(),
  
  maxCapacity: z
    .string()
    .regex(/^\d+$/, 'Max capacity must be a number')
    .transform(Number)
    .optional(),
  
  minPrice: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Min price must be a valid number')
    .transform(Number)
    .optional(),
  
  maxPrice: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Max price must be a valid number')
    .transform(Number)
    .optional()
});

export type VenueQueryInput = z.infer<typeof venueQuerySchema>;
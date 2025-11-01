import { z } from 'zod';

// Create meal schema
export const createMealSchema = z.object({
  name: z
    .string()
    .min(2, 'Meal name must be at least 2 characters')
    .max(100, 'Meal name must not exceed 100 characters')
    .trim(),
  
  type: z
    .enum(['veg', 'nonveg', 'buffet'], {
      message: 'Meal type must be one of: veg, nonveg, buffet'
    })
    .optional(),
  
  pricePerPerson: z
    .number()
    .min(0, 'Price per person cannot be negative')
    .max(9999.99, 'Price per person cannot exceed 9,999.99'),
  
  description: z
    .string()
    .max(1000, 'Description must not exceed 1000 characters')
    .trim()
    .optional()
});

export type CreateMealInput = z.infer<typeof createMealSchema>;

// Update meal schema (all fields optional except validation rules)
export const updateMealSchema = z.object({
  name: z
    .string()
    .min(2, 'Meal name must be at least 2 characters')
    .max(100, 'Meal name must not exceed 100 characters')
    .trim()
    .optional(),
  
  type: z
    .enum(['veg', 'nonveg', 'buffet'], {
      message: 'Meal type must be one of: veg, nonveg, buffet'
    })
    .optional(),
  
  pricePerPerson: z
    .number()
    .min(0, 'Price per person cannot be negative')
    .max(9999.99, 'Price per person cannot exceed 9,999.99')
    .optional(),
  
  description: z
    .string()
    .max(1000, 'Description must not exceed 1000 characters')
    .trim()
    .optional()
});

export type UpdateMealInput = z.infer<typeof updateMealSchema>;

// Query parameters for meal listing
export const mealQuerySchema = z.object({
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
  
  type: z
    .enum(['veg', 'nonveg', 'buffet'])
    .optional(),
  
  search: z
    .string()
    .max(100, 'Search term must not exceed 100 characters')
    .trim()
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

export type MealQueryInput = z.infer<typeof mealQuerySchema>;
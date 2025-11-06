import { z } from 'zod';

// Menu items schema
const menuItemsSchema = z.record(z.string(), z.array(z.string())).optional();

// Service hours schema
const serviceHoursSchema = z.object({
  setup: z.number().min(0).max(24),
  service: z.number().min(0).max(24),
  cleanup: z.number().min(0).max(24)
}).optional();

// Beverages and dietary options
const beveragesEnum = z.enum([
  'tea', 'coffee', 'soft_drinks', 'juices', 'water', 'mocktails',
  'herbal_tea', 'fresh_juices', 'coconut_water', 'kombucha'
]);

const specialDietaryEnum = z.enum([
  'halal', 'kosher', 'gluten_free', 'dairy_free', 'nut_free', 'vegan'
]);

// Create meal schema
export const createMealSchema = z.object({
  name: z
    .string()
    .min(2, 'Meal name must be at least 2 characters')
    .max(100, 'Meal name must not exceed 100 characters')
    .trim(),
  
  description: z
    .string()
    .max(2000, 'Description must not exceed 2000 characters')
    .trim()
    .optional(),

  // Meal Details
  type: z
    .enum(['veg', 'nonveg', 'buffet', 'plated'], {
      message: 'Meal type must be one of: veg, nonveg, buffet, plated'
    }),

  cuisine: z
    .string()
    .max(50, 'Cuisine must not exceed 50 characters')
    .trim()
    .optional(),
  
  servingStyle: z
    .enum(['buffet', 'plated', 'family_style'], {
      message: 'Serving style must be one of: buffet, plated, family_style'
    }),

  // Pricing
  pricePerPerson: z
    .number()
    .min(0, 'Price per person cannot be negative')
    .max(9999.99, 'Price per person cannot exceed 9,999.99'),
  
  minimumGuests: z
    .number()
    .int('Minimum guests must be a whole number')
    .min(1, 'Minimum guests must be at least 1')
    .max(10000, 'Minimum guests cannot exceed 10,000')
    .default(50),

  // Menu Details
  menuItems: menuItemsSchema,

  beverages: z
    .array(beveragesEnum)
    .default([]),

  specialDietary: z
    .array(specialDietaryEnum)
    .default([]),

  // Service Details
  serviceHours: serviceHoursSchema,

  staffIncluded: z.boolean().default(true),
  equipmentIncluded: z.boolean().default(true),

  // Media
  images: z
    .array(z.string().url('Each image must be a valid URL'))
    .default([]),

  // Availability & Status
  isActive: z.boolean().default(true),
  isPopular: z.boolean().default(false)
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
  
  description: z
    .string()
    .max(2000, 'Description must not exceed 2000 characters')
    .trim()
    .optional(),

  // Meal Details
  type: z
    .enum(['veg', 'nonveg', 'buffet', 'plated'], {
      message: 'Meal type must be one of: veg, nonveg, buffet, plated'
    })
    .optional(),
  
  cuisine: z
    .string()
    .max(50, 'Cuisine must not exceed 50 characters')
    .trim()
    .optional(),

  servingStyle: z
    .enum(['buffet', 'plated', 'family_style'], {
      message: 'Serving style must be one of: buffet, plated, family_style'
    })
    .optional(),

  // Pricing
  pricePerPerson: z
    .number()
    .min(0, 'Price per person cannot be negative')
    .max(9999.99, 'Price per person cannot exceed 9,999.99')
    .optional(),
  
  minimumGuests: z
    .number()
    .int('Minimum guests must be a whole number')
    .min(1, 'Minimum guests must be at least 1')
    .max(10000, 'Minimum guests cannot exceed 10,000')
    .optional(),

  // Menu Details
  menuItems: menuItemsSchema,

  beverages: z
    .array(beveragesEnum)
    .optional(),

  specialDietary: z
    .array(specialDietaryEnum)
    .optional(),

  // Service Details
  serviceHours: serviceHoursSchema,

  staffIncluded: z.boolean().optional(),
  equipmentIncluded: z.boolean().optional(),

  // Media
  images: z
    .array(z.string().url('Each image must be a valid URL'))
    .optional(),

  // Availability & Status
  isActive: z.boolean().optional(),
  isPopular: z.boolean().optional()
});

export type UpdateMealInput = z.infer<typeof updateMealSchema>;

// Admin update meal schema (comprehensive - all fields available)
export const adminUpdateMealSchema = z.object({
  name: z
    .string()
    .min(2, 'Meal name must be at least 2 characters')
    .max(100, 'Meal name must not exceed 100 characters')
    .trim()
    .optional(),

  description: z
    .string()
    .max(2000, 'Description must not exceed 2000 characters')
    .trim()
    .optional(),

  // Meal Details
  type: z
    .enum(['veg', 'nonveg', 'buffet', 'plated'], {
      message: 'Meal type must be one of: veg, nonveg, buffet, plated'
    })
    .optional(),

  cuisine: z
    .string()
    .max(50, 'Cuisine must not exceed 50 characters')
    .trim()
    .optional(),

  servingStyle: z
    .enum(['buffet', 'plated', 'family_style'], {
      message: 'Serving style must be one of: buffet, plated, family_style'
    })
    .optional(),

  // Pricing
  pricePerPerson: z
    .number()
    .min(0, 'Price per person cannot be negative')
    .max(9999.99, 'Price per person cannot exceed 9,999.99')
    .optional(),

  minimumGuests: z
    .number()
    .int('Minimum guests must be a whole number')
    .min(1, 'Minimum guests must be at least 1')
    .max(10000, 'Minimum guests cannot exceed 10,000')
    .optional(),

  // Menu Details
  menuItems: menuItemsSchema,

  beverages: z
    .array(beveragesEnum)
    .optional(),

  specialDietary: z
    .array(specialDietaryEnum)
    .optional(),

  // Service Details
  serviceHours: serviceHoursSchema,

  staffIncluded: z.boolean().optional(),
  equipmentIncluded: z.boolean().optional(),

  // Media
  images: z
    .array(z.string().url('Each image must be a valid URL'))
    .optional(),

  // Availability & Status
  isActive: z.boolean().optional(),
  isPopular: z.boolean().optional(),

  // Rating (admin can update this)
  rating: z
    .number()
    .min(0, 'Rating cannot be negative')
    .max(5, 'Rating cannot exceed 5')
    .optional(),

  totalReviews: z
    .number()
    .int('Total reviews must be a whole number')
    .min(0, 'Total reviews cannot be negative')
    .optional()
});

export type AdminUpdateMealInput = z.infer<typeof adminUpdateMealSchema>;

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
    .enum(['veg', 'nonveg', 'buffet', 'plated'])
    .optional(),

  cuisine: z
    .string()
    .max(50, 'Cuisine must not exceed 50 characters')
    .trim()
    .optional(),

  servingStyle: z
    .enum(['buffet', 'plated', 'family_style'])
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
    .optional(),

  minGuests: z
    .string()
    .regex(/^\d+$/, 'Min guests must be a number')
    .transform(Number)
    .optional(),

  maxGuests: z
    .string()
    .regex(/^\d+$/, 'Max guests must be a number')
    .transform(Number)
    .optional(),

  specialDietary: z
    .string()
    .transform(str => str.split(',').map(d => d.trim()))
    .optional(),

  isActive: z
    .string()
    .transform(str => str.toLowerCase() === 'true')
    .optional(),

  isPopular: z
    .string()
    .transform(str => str.toLowerCase() === 'true')
    .optional(),

  sortBy: z
    .enum(['name', 'pricePerPerson', 'rating', 'createdAt', 'minimumGuests'])
    .optional()
    .default('createdAt'),

  sortOrder: z
    .enum(['asc', 'desc'])
    .optional()
    .default('desc')
});

export type MealQueryInput = z.infer<typeof mealQuerySchema>;
import { z } from 'zod';

// Operating hours schema
const operatingHoursSchema = z.object({
  monday: z.object({ open: z.string(), close: z.string() }).optional(),
  tuesday: z.object({ open: z.string(), close: z.string() }).optional(),
  wednesday: z.object({ open: z.string(), close: z.string() }).optional(),
  thursday: z.object({ open: z.string(), close: z.string() }).optional(),
  friday: z.object({ open: z.string(), close: z.string() }).optional(),
  saturday: z.object({ open: z.string(), close: z.string() }).optional(),
  sunday: z.object({ open: z.string(), close: z.string() }).optional(),
}).optional();

// Facilities and amenities arrays
const facilitiesEnum = z.enum([
  'parking', 'ac', 'wifi', 'sound_system', 'lighting', 'stage', 'kitchen',
  'restrooms', 'wheelchair_accessible', 'projector', 'elevator', 'garden'
]);

const amenitiesEnum = z.enum([
  'bridal_room', 'groom_room', 'vip_lounge', 'dance_floor', 'bar_area',
  'outdoor_space', 'gazebo', 'fountain', 'conference_rooms', 'break_out_areas',
  'business_center', 'city_view', 'sunset_view', 'heritage_architecture',
  'vintage_decor', 'grand_staircase', 'courtyard'
]);

// Create venue schema
export const createVenueSchema = z.object({
  name: z
    .string()
    .min(2, 'Venue name must be at least 2 characters')
    .max(150, 'Venue name must not exceed 150 characters')
    .trim(),
  
  description: z
    .string()
    .max(2000, 'Description must not exceed 2000 characters')
    .trim()
    .optional(),

  // Location Details
  address: z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(500, 'Address must not exceed 500 characters')
    .trim(),

  city: z
    .string()
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City must not exceed 100 characters')
    .trim(),

  state: z
    .string()
    .min(2, 'State must be at least 2 characters')
    .max(100, 'State must not exceed 100 characters')
    .trim(),

  zipCode: z
    .string()
    .max(20, 'Zip code must not exceed 20 characters')
    .trim()
    .optional(),

  country: z
    .string()
    .max(100, 'Country must not exceed 100 characters')
    .trim()
    .default('Bangladesh'),

  latitude: z
    .number()
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90')
    .optional(),

  longitude: z
    .number()
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180')
    .optional(),

  // Venue Details
  capacity: z
    .number()
    .int('Capacity must be a whole number')
    .min(1, 'Capacity must be at least 1')
    .max(10000, 'Capacity cannot exceed 10,000'),

  area: z
    .number()
    .min(0, 'Area cannot be negative')
    .max(999999.99, 'Area cannot exceed 999,999.99 sq ft')
    .optional(),
  
  venueType: z
    .enum(['indoor', 'outdoor', 'hybrid'], {
      message: 'Venue type must be one of: indoor, outdoor, hybrid'
    }),

  // Pricing
  pricePerDay: z
    .number()
    .min(0, 'Price per day cannot be negative')
    .max(999999.99, 'Price per day cannot exceed 999,999.99'),
  
  minimumDays: z
    .number()
    .int('Minimum days must be a whole number')
    .min(1, 'Minimum days must be at least 1')
    .max(365, 'Minimum days cannot exceed 365')
    .default(1),

  securityDeposit: z
    .number()
    .min(0, 'Security deposit cannot be negative')
    .max(999999.99, 'Security deposit cannot exceed 999,999.99')
    .optional(),

  // Facilities & Amenities
  facilities: z
    .array(facilitiesEnum)
    .default([]),

  amenities: z
    .array(amenitiesEnum)
    .default([]),

  // Services
  cateringAllowed: z.boolean().default(true),
  decorationAllowed: z.boolean().default(true),
  alcoholAllowed: z.boolean().default(false),
  smokingAllowed: z.boolean().default(false),
  petFriendly: z.boolean().default(false),

  // Media
  images: z
    .array(z.string().url('Each image must be a valid URL'))
    .default([]),

  virtualTourUrl: z
    .string()
    .url('Virtual tour URL must be a valid URL')
    .optional(),

  // Contact & Availability
  contactPerson: z
    .string()
    .max(100, 'Contact person name must not exceed 100 characters')
    .trim()
    .optional(),

  contactPhone: z
    .string()
    .max(20, 'Contact phone must not exceed 20 characters')
    .regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number format')
    .optional(),

  contactEmail: z
    .string()
    .email('Invalid email format')
    .max(150, 'Contact email must not exceed 150 characters')
    .optional(),

  // Operating Hours
  operatingHours: operatingHoursSchema,

  // Status
  isActive: z.boolean().default(true)
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
  
  description: z
    .string()
    .max(2000, 'Description must not exceed 2000 characters')
    .trim()
    .optional(),

  // Location Details
  address: z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(500, 'Address must not exceed 500 characters')
    .trim()
    .optional(),
  
  city: z
    .string()
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City must not exceed 100 characters')
    .trim()
    .optional(),

  state: z
    .string()
    .min(2, 'State must be at least 2 characters')
    .max(100, 'State must not exceed 100 characters')
    .trim()
    .optional(),

  zipCode: z
    .string()
    .max(20, 'Zip code must not exceed 20 characters')
    .trim()
    .optional(),

  country: z
    .string()
    .max(100, 'Country must not exceed 100 characters')
    .trim()
    .optional(),

  latitude: z
    .number()
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90')
    .optional(),

  longitude: z
    .number()
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180')
    .optional(),

  // Venue Details
  capacity: z
    .number()
    .int('Capacity must be a whole number')
    .min(1, 'Capacity must be at least 1')
    .max(10000, 'Capacity cannot exceed 10,000')
    .optional(),
  
  area: z
    .number()
    .min(0, 'Area cannot be negative')
    .max(999999.99, 'Area cannot exceed 999,999.99 sq ft')
    .optional(),

  venueType: z
    .enum(['indoor', 'outdoor', 'hybrid'], {
      message: 'Venue type must be one of: indoor, outdoor, hybrid'
    })
    .optional(),

  // Pricing
  pricePerDay: z
    .number()
    .min(0, 'Price per day cannot be negative')
    .max(999999.99, 'Price per day cannot exceed 999,999.99')
    .optional(),
  
  minimumDays: z
    .number()
    .int('Minimum days must be a whole number')
    .min(1, 'Minimum days must be at least 1')
    .max(365, 'Minimum days cannot exceed 365')
    .optional(),

  securityDeposit: z
    .number()
    .min(0, 'Security deposit cannot be negative')
    .max(999999.99, 'Security deposit cannot exceed 999,999.99')
    .optional(),

  // Facilities & Amenities
  facilities: z
    .array(facilitiesEnum)
    .optional(),

  amenities: z
    .array(amenitiesEnum)
    .optional(),

  // Services
  cateringAllowed: z.boolean().optional(),
  decorationAllowed: z.boolean().optional(),
  alcoholAllowed: z.boolean().optional(),
  smokingAllowed: z.boolean().optional(),
  petFriendly: z.boolean().optional(),

  // Media
  images: z
    .array(z.string().url('Each image must be a valid URL'))
    .optional(),

  virtualTourUrl: z
    .string()
    .url('Virtual tour URL must be a valid URL')
    .optional(),

  // Contact & Availability
  contactPerson: z
    .string()
    .max(100, 'Contact person name must not exceed 100 characters')
    .trim()
    .optional(),

  contactPhone: z
    .string()
    .max(20, 'Contact phone must not exceed 20 characters')
    .regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number format')
    .optional(),

  contactEmail: z
    .string()
    .email('Invalid email format')
    .max(150, 'Contact email must not exceed 150 characters')
    .optional(),

  // Operating Hours
  operatingHours: operatingHoursSchema,

  // Status
  isActive: z.boolean().optional()
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
  
  city: z
    .string()
    .max(100, 'City must not exceed 100 characters')
    .trim()
    .optional(),

  venueType: z
    .enum(['indoor', 'outdoor', 'hybrid'])
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
    .optional(),

  facilities: z
    .string()
    .transform(str => str.split(',').map(f => f.trim()))
    .optional(),

  amenities: z
    .string()
    .transform(str => str.split(',').map(a => a.trim()))
    .optional(),

  isActive: z
    .string()
    .transform(str => str.toLowerCase() === 'true')
    .optional(),

  sortBy: z
    .enum(['name', 'capacity', 'pricePerDay', 'rating', 'createdAt'])
    .optional()
    .default('createdAt'),

  sortOrder: z
    .enum(['asc', 'desc'])
    .optional()
    .default('desc')
});

export type VenueQueryInput = z.infer<typeof venueQuerySchema>;
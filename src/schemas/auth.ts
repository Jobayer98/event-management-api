import { z } from 'zod';

// User registration schema
export const registerUserSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .trim(),
  
  email: z
    .string()
    .email('Invalid email format')
    .max(150, 'Email must not exceed 150 characters')
    .toLowerCase()
    .trim(),
  
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(255, 'Password must not exceed 255 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  
  phone: z
    .string()
    .max(20, 'Phone number must not exceed 20 characters')
    .regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number format')
    .optional()
    .or(z.literal(''))
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;

// User login schema
export const loginUserSchema = z.object({
  email: z
    .string()
    .email('Invalid email format')
    .max(150, 'Email must not exceed 150 characters')
    .toLowerCase()
    .trim(),

  password: z
    .string()
    .min(1, 'Password is required')
    .max(255, 'Password must not exceed 255 characters')
});

export type LoginUserInput = z.infer<typeof loginUserSchema>;
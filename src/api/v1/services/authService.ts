import { userRepository, CreateUserData, UserResponse } from '../repositories/userRepository';
import { hashPassword, generateToken } from '../../../utils/auth';
import { createError } from '../../../middleware/errorHandler';
import { logger } from '../../../config';

export interface RegisterUserData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface RegisterResponse {
  user: UserResponse;
  token: string;
}

export class AuthService {
  /**
   * Register a new user
   */
  async registerUser(userData: RegisterUserData): Promise<RegisterResponse> {
    const { name, email, password, phone } = userData;

    logger.info(`Registration attempt for email: ${email}`);

    // Check if user already exists
    const emailExists = await userRepository.emailExists(email);
    if (emailExists) {
      logger.warn(`Registration failed - email already exists: ${email}`);
      throw createError('Email already registered', 409);
    }

    // Hash the password
    const passwordHash = await hashPassword(password);

    // Prepare user data
    const createUserData: CreateUserData = {
      name,
      email,
      passwordHash,
      phone: phone || null,
    };

    try {
      // Create the user
      const user = await userRepository.create(createUserData);

      // Generate JWT token
      const token = generateToken({
        userId: user.id,
        email: user.email,
      });

      logger.info(`User registered successfully: ${user.id} - ${email}`);

      return {
        user,
        token,
      };
    } catch (error: any) {
      logger.error('User creation error:', {
        error: error.message,
        email,
      });

      // Handle Prisma unique constraint errors
      if (error.code === 'P2002') {
        throw createError('Email already registered', 409);
      }

      // Handle other database errors
      if (error.code?.startsWith('P')) {
        throw createError('Database error occurred', 500);
      }

      throw createError('Registration failed', 500);
    }
  }

  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<UserResponse | null> {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
    };
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string): Promise<UserResponse | null> {
    const user = await userRepository.findById(id);
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      createdAt: user.createdAt,
    };
  }
}

// Export singleton instance
export const authService = new AuthService();
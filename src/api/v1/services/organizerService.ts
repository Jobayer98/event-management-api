import { organizerRepository, CreateOrganizerData, OrganizerResponse } from '../repositories/organizerRepository';
import { hashPassword, generateToken, comparePassword } from '../../../utils/auth';
import { createError } from '../../../middleware/errorHandler';
import { logger } from '../../../config';

export interface RegisterOrganizerData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface RegisterOrganizerResponse {
  organizer: OrganizerResponse;
  token: string;
}

export interface LoginOrganizerData {
  email: string;
  password: string;
}

export interface LoginOrganizerResponse {
  organizer: OrganizerResponse;
  token: string;
}

export class OrganizerService {
  /**
   * Register a new organizer
   */
  async registerOrganizer(organizerData: RegisterOrganizerData): Promise<RegisterOrganizerResponse> {
    const { name, email, password, phone } = organizerData;

    logger.info(`Organizer registration attempt for email: ${email}`);

    // Check if organizer already exists
    const emailExists = await organizerRepository.emailExists(email);
    if (emailExists) {
      logger.warn(`Organizer registration failed - email already exists: ${email}`);
      throw createError('Email already registered', 409);
    }

    // Hash the password
    const passwordHash = await hashPassword(password);

    // Prepare organizer data
    const createOrganizerData: CreateOrganizerData = {
      name,
      email,
      passwordHash,
      phone: phone || null,
    };

    try {
      // Create the organizer
      const organizer = await organizerRepository.create(createOrganizerData);

      // Generate JWT token with organizer role
      const token = generateToken({
        userId: organizer.id,
        email: organizer.email,
        role: 'organizer',
      });

      logger.info(`Organizer registered successfully: ${organizer.id} - ${email}`);

      return {
        organizer,
        token,
      };
    } catch (error: any) {
      logger.error('Organizer creation error:', {
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
   * Login organizer with email and password
   */
  async loginOrganizer(loginData: LoginOrganizerData): Promise<LoginOrganizerResponse> {
    const { email, password } = loginData;

    try {
      
      // Find organizer with password hash
      const organizer = await organizerRepository.findByEmailWithPassword(email);
      
      if (!organizer) {
        logger.warn(`❌ Organizer login failed - organizer not found: ${email}`);
        throw createError('Invalid email or password', 401);
      }

      // Compare password with hash
      const isPasswordValid = await comparePassword(password, organizer.passwordHash);
      
      if (!isPasswordValid) {
        logger.warn(`❌ Organizer login failed - invalid password: ${email}`);
        throw createError('Invalid email or password', 401);
      }

      // Generate JWT token with organizer role
      const token = generateToken({
        userId: organizer.id,
        email: organizer.email,
        role: 'organizer',
      });

      // Prepare organizer response (exclude password hash)
      const organizerResponse: OrganizerResponse = {
        id: organizer.id,
        name: organizer.name,
        email: organizer.email,
        phone: organizer.phone,
        createdAt: organizer.createdAt,
      };

      logger.info(`✅ Organizer logged in successfully: ${organizer.id} - ${email}`);

      return {
        organizer: organizerResponse,
        token,
      };

    } catch (error: any) {
      // If it's already our custom error, re-throw it
      if (error.statusCode) {
        throw error;
      }

      logger.error('Organizer login error:', {
        error: error.message,
        email,
      });

      throw createError('Login failed', 500);
    }
  }

  /**
   * Get organizer by email
   */
  async getOrganizerByEmail(email: string): Promise<OrganizerResponse | null> {
    const organizer = await organizerRepository.findByEmail(email);
    if (!organizer) {
      return null;
    }

    return {
      id: organizer.id,
      name: organizer.name,
      email: organizer.email,
      phone: organizer.phone,
      createdAt: organizer.createdAt,
    };
  }

  /**
   * Get organizer by ID
   */
  async getOrganizerById(id: string): Promise<OrganizerResponse | null> {
    const organizer = await organizerRepository.findById(id);
    if (!organizer) {
      return null;
    }

    return {
      id: organizer.id,
      name: organizer.name,
      email: organizer.email,
      phone: organizer.phone,
      createdAt: organizer.createdAt,
    };
  }

  /**
   * Create default admin organizer if none exists
   */
  async createDefaultAdmin(): Promise<void> {
    try {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@admin.com';
      const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!@#';
      const adminName = process.env.ADMIN_NAME || 'System Administrator';

      logger.info(`🔍 Checking for existing admin with email: ${adminEmail}`);

      // Check if admin already exists
      const existingAdmin = await organizerRepository.findByEmail(adminEmail);
      
      if (existingAdmin) {
        logger.info(`✅ Default admin organizer already exists: ${adminEmail} (ID: ${existingAdmin.id})`);
        return;
      }

      logger.info(`🔨 Creating default admin organizer: ${adminEmail}`);

      // Create default admin
      const result = await this.registerOrganizer({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
      });

      logger.info(`✅ Default admin organizer created successfully: ${adminEmail} (ID: ${result.organizer.id})`);
    } catch (error: any) {
      logger.error('Failed to create default admin organizer:', error);
    }
  }
}

// Export singleton instance
export const organizerService = new OrganizerService();
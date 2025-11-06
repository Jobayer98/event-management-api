import { organizerRepository, CreateOrganizerData, OrganizerResponse } from '../repositories/organizerRepository';
import { eventRepository, EventResponse, EventFilters } from '../repositories/eventRepository';
import { hashPassword, generateToken, comparePassword } from '../../../utils/auth';
import { createError } from '../../../middleware/errorHandler';
import { logger } from '../../../config';
import { UpdateEventStatusInput, AdminEventQueryInput } from '../../../schemas/event';

export interface UpdateAdminProfileData {
  name?: string;
  phone?: string;
}

export interface UpdateAdminPasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface LoginOrganizerData {
  email: string;
  password: string;
}

export interface LoginOrganizerResponse {
  organizer: OrganizerResponse;
  token: string;
}

export interface OrganizerEventListResponse {
  events: EventResponse[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalEvents: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export class OrganizerService {

  /**
   * Login organizer with email and password
   */
  async loginOrganizer(loginData: LoginOrganizerData): Promise<LoginOrganizerResponse> {
    const { email, password } = loginData;

    try {
      
      // Find organizer with password hash
      const organizer = await organizerRepository.findByEmailWithPassword(email);
      
      if (!organizer) {
        logger.warn(`Organizer login failed - organizer not found: ${email}`);
        throw createError('Invalid email or password', 401);
      }

      // Compare password with hash
      const isPasswordValid = await comparePassword(password, organizer.passwordHash);
      
      if (!isPasswordValid) {
        logger.warn(`Organizer login failed - invalid password: ${email}`);
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

      logger.info(`Organizer logged in successfully: ${organizer.id} - ${email}`);

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
   * Update admin profile information
   */
  async updateAdminProfile(adminId: string, updateData: UpdateAdminProfileData): Promise<OrganizerResponse> {
    try {
      logger.info(`Admin profile update attempt for ID: ${adminId}`);

      // Check if admin exists
      const existingAdmin = await organizerRepository.findById(adminId);
      if (!existingAdmin) {
        logger.warn(`Admin profile update failed - admin not found: ${adminId}`);
        throw createError('Admin not found', 404);
      }

      // Prepare update data (only include fields that are provided)
      const updateFields: Partial<CreateOrganizerData> = {};
      if (updateData.name !== undefined) {
        updateFields.name = updateData.name;
      }
      if (updateData.phone !== undefined) {
        updateFields.phone = updateData.phone || null;
      }

      // Update admin profile
      const updatedAdmin = await organizerRepository.updateById(adminId, updateFields);

      logger.info(`Admin profile updated successfully: ${adminId}`);

      return updatedAdmin;
    } catch (error: any) {
      // If it's already our custom error, re-throw it
      if (error.statusCode) {
        throw error;
      }

      logger.error('Admin profile update error:', {
        error: error.message,
        adminId,
      });

      throw createError('Profile update failed', 500);
    }
  }

  /**
   * Update admin password
   */
  async updateAdminPassword(adminId: string, passwordData: UpdateAdminPasswordData): Promise<void> {
    try {
      logger.info(`Admin password update attempt for ID: ${adminId}`);

      // Find admin with password hash
      const admin = await organizerRepository.findByEmailWithPassword('');
      const adminWithPassword = await organizerRepository.findById(adminId);

      if (!adminWithPassword) {
        logger.warn(`Admin password update failed - admin not found: ${adminId}`);
        throw createError('Admin not found', 404);
      }

      // Get admin with password for verification
      const adminForVerification = await organizerRepository.findByEmailWithPassword(adminWithPassword.email);
      if (!adminForVerification) {
        throw createError('Admin not found', 404);
      }

      // Verify current password
      const isCurrentPasswordValid = await comparePassword(
        passwordData.currentPassword,
        adminForVerification.passwordHash
      );

      if (!isCurrentPasswordValid) {
        logger.warn(`Admin password update failed - invalid current password: ${adminId}`);
        throw createError('Current password is incorrect', 401);
      }

      // Hash new password
      const newPasswordHash = await hashPassword(passwordData.newPassword);

      // Update password
      await organizerRepository.updatePassword(adminId, newPasswordHash);

      logger.info(`Admin password updated successfully: ${adminId}`);
    } catch (error: any) {
      // If it's already our custom error, re-throw it
      if (error.statusCode) {
        throw error;
      }

      logger.error('Admin password update error:', {
        error: error.message,
        adminId,
      });

      throw createError('Password update failed', 500);
    }
  }

  /**
   * Get all events with pagination and filters (Organizer only)
   */
  async getAllEvents(queryParams: AdminEventQueryInput): Promise<OrganizerEventListResponse> {
    try {
      const { page, limit, status, eventType } = queryParams;

      const skip = (page - 1) * limit;
      const filters: EventFilters = {};

      if (status) filters.status = status;
      if (eventType) filters.eventType = eventType;

      // Get events and total count
      const [events, totalEvents] = await Promise.all([
        eventRepository.findAll(skip, limit, filters),
        eventRepository.countAll(filters)
      ]);

      const totalPages = Math.ceil(totalEvents / limit);

      return {
        events,
        pagination: {
          currentPage: page,
          totalPages,
          totalEvents,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      };
    } catch (error: any) {
      logger.error('Get all events error:', {
        error: error.message,
        queryParams,
      });

      throw createError('Failed to retrieve events', 500);
    }
  }

  /**
   * Get event by ID (Organizer only)
   */
  async getEventById(eventId: string): Promise<EventResponse> {
    try {
      const event = await eventRepository.findById(eventId);

      if (!event) {
        throw createError('Event not found', 404);
      }

      return event;
    } catch (error: any) {
      // If it's already our custom error, re-throw it
      if (error.statusCode) {
        throw error;
      }

      logger.error('Get event by ID error:', {
        error: error.message,
        eventId,
      });

      throw createError('Failed to retrieve event', 500);
    }
  }

  /**
   * Update event status (Organizer only)
   */
  async updateEventStatus(eventId: string, statusData: UpdateEventStatusInput): Promise<EventResponse> {
    try {
      // Check if event exists
      const existingEvent = await eventRepository.findById(eventId);

      if (!existingEvent) {
        throw createError('Event not found', 404);
      }

      // Update the event status
      const updatedEvent = await eventRepository.updateStatusById(eventId, statusData.status);

      logger.info(`Event status updated successfully: ${eventId} -> ${statusData.status}`);

      return updatedEvent;
    } catch (error: any) {
      // If it's already our custom error, re-throw it
      if (error.statusCode) {
        throw error;
      }

      logger.error('Update event status error:', {
        error: error.message,
        eventId,
        statusData,
      });

      throw createError('Failed to update event status', 500);
    }
  }


}

// Export singleton instance
export const organizerService = new OrganizerService();
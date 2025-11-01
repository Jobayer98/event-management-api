import { eventRepository, CreateEventData, EventResponse, EventFilters } from '../repositories/eventRepository';
import { venueRepository } from '../repositories/venueRepository';
import { createError } from '../../../middleware/errorHandler';
import { logger } from '../../../config';

export interface CheckAvailabilityInput {
  venueId: string;
  startTime: string;
  endTime: string;
}

export interface AvailabilityResponse {
  available: boolean;
  message: string;
  conflictingEvents?: Array<{
    startTime: Date;
    endTime: Date;
    eventType: string;
  }>;
  venue?: {
    id: string;
    name: string;
    address: string | null;
    capacity: number | null;
    pricePerHour: number;
  };
}

export interface CreateEventInput {
  userId: string;
  venueId: string;
  mealId?: string;
  eventType: string;
  peopleCount: number;
  startTime: string;
  endTime: string;
}

export interface EventListResponse {
  events: EventResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export class EventService {
  /**
   * Check venue availability for a specific time slot
   */
  async checkAvailability(availabilityData: CheckAvailabilityInput): Promise<AvailabilityResponse> {
    const { venueId, startTime, endTime } = availabilityData;

    logger.info(`Checking availability for venue ${venueId} from ${startTime} to ${endTime}`);

    try {
      // Check if venue exists
      const venue = await venueRepository.findById(venueId);
      if (!venue) {
        logger.warn(`Availability check failed - venue not found: ${venueId}`);
        throw createError('The selected venue could not be found. Please choose a different venue.', 404);
      }

      const startDateTime = new Date(startTime);
      const endDateTime = new Date(endTime);

      // Check availability
      const isAvailable = await eventRepository.checkVenueAvailability(
        venueId,
        startDateTime,
        endDateTime
      );

      if (isAvailable) {
        logger.info(`Venue ${venueId} is available for the requested time slot`);
        return {
          available: true,
          message: `${venue.name} is available for your event from ${startDateTime.toLocaleString()} to ${endDateTime.toLocaleString()}`,
          venue,
        };
      } else {
        // Get conflicting events for detailed message
        const conflictingEvents = await eventRepository.getConflictingEvents(
          venueId,
          startDateTime,
          endDateTime
        );

        logger.info(`Venue ${venueId} is not available - ${conflictingEvents.length} conflicting events found`);

        const conflictDetails = conflictingEvents.map(event => 
          `${event.eventType} from ${event.startTime.toLocaleString()} to ${event.endTime.toLocaleString()}`
        ).join(', ');

        return {
          available: false,
          message: `Sorry, ${venue.name} is not available for the requested time. There are conflicting events: ${conflictDetails}. Please choose a different time slot.`,
          conflictingEvents,
          venue,
        };
      }

    } catch (error: any) {
      // If it's already our custom error, re-throw it
      if (error.statusCode) {
        throw error;
      }

      logger.error('Availability check error:', {
        error: error.message,
        venueId,
        startTime,
        endTime,
      });

      throw createError('Unable to check venue availability at this time. Please try again later.', 500);
    }
  }

  /**
   * Create a new event booking
   */
  async createEvent(eventData: CreateEventInput): Promise<EventResponse> {
    const { userId, venueId, mealId, eventType, peopleCount, startTime, endTime } = eventData;

    logger.info(`Creating event booking for user ${userId} at venue ${venueId}`);

    try {
      // Check if venue exists
      const venue = await venueRepository.findById(venueId);
      if (!venue) {
        logger.warn(`Event creation failed - venue not found: ${venueId}`);
        throw createError('The selected venue is no longer available. Please choose a different venue.', 404);
      }

      const startDateTime = new Date(startTime);
      const endDateTime = new Date(endTime);

      // Check venue capacity
      if (venue.capacity && peopleCount > venue.capacity) {
        logger.warn(`Event creation failed - people count exceeds venue capacity: ${peopleCount} > ${venue.capacity}`);
        throw createError(`Venue capacity is ${venue.capacity} people, but you requested ${peopleCount} people`, 400);
      }

      // Double-check availability before booking
      const isAvailable = await eventRepository.checkVenueAvailability(
        venueId,
        startDateTime,
        endDateTime
      );

      if (!isAvailable) {
        logger.warn(`Event creation failed - venue not available: ${venueId}`);
        throw createError('Venue is no longer available for the selected time slot. Please check availability again.', 409);
      }

      // Calculate total cost (basic calculation - can be enhanced)
      const durationHours = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60);
      const venueCost = venue.pricePerHour * durationHours;
      
      // TODO: Add meal cost calculation when meal service is implemented
      const totalCost = venueCost;

      // Prepare event data
      const createData: CreateEventData = {
        userId,
        venueId,
        mealId: mealId || null,
        eventType,
        peopleCount,
        startTime: startDateTime,
        endTime: endDateTime,
        totalCost,
        status: 'pending',
      };

      // Create event
      const event = await eventRepository.create(createData);

      logger.info(`Event created successfully: ${event.id} for user ${userId}`);
      return event;

    } catch (error: any) {
      // If it's already our custom error, re-throw it
      if (error.statusCode) {
        throw error;
      }

      logger.error('Event creation error:', {
        error: error.message,
        userId,
        venueId,
        eventType,
      });

      // Handle database errors
      if (error.code?.startsWith('P')) {
        throw createError('Database error occurred', 500);
      }

      throw createError('Unable to create your event booking at this time. Please try again later.', 500);
    }
  }

  /**
   * Get user's events with pagination and filters
   */
  async getUserEvents(
    userId: string,
    page: number = 1,
    limit: number = 10,
    filters: EventFilters = {}
  ): Promise<EventListResponse> {
    logger.info(`Fetching events for user ${userId} - page: ${page}, limit: ${limit}`, { filters });

    try {
      const skip = (page - 1) * limit;

      // Get events and total count
      const [events, total] = await Promise.all([
        eventRepository.findByUserId(userId, skip, limit, filters),
        eventRepository.countByUserId(userId, filters),
      ]);

      const totalPages = Math.ceil(total / limit);

      return {
        events,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };

    } catch (error: any) {
      logger.error('Get user events error:', {
        error: error.message,
        userId,
        page,
        limit,
        filters,
      });

      throw createError('Unable to retrieve your events at this time. Please try again later.', 500);
    }
  }

  /**
   * Get event by ID (with user ownership check)
   */
  async getEventById(eventId: string, userId: string): Promise<EventResponse> {
    logger.info(`Fetching event ${eventId} for user ${userId}`);

    const event = await eventRepository.findById(eventId);
    if (!event) {
      logger.warn(`Event not found: ${eventId}`);
      throw createError('The requested event could not be found. It may have been cancelled or removed.', 404);
    }

    // Check if user owns this event
    if (event.userId !== userId) {
      logger.warn(`Unauthorized access to event ${eventId} by user ${userId}`);
      throw createError('You can only view your own events. This event belongs to another user.', 403);
    }

    return event;
  }
}

// Export singleton instance
export const eventService = new EventService();
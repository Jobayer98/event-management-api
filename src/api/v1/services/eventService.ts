import { eventRepository, CreateEventData, EventResponse, EventFilters, UpdateEventData } from '../repositories/eventRepository';
import { venueRepository } from '../repositories/venueRepository';
import { mealRepository } from '../repositories/mealRepository';
import { mealService } from './mealService';
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
  meal?: {
    name: string;
    type?: string;
    pricePerPerson: number;
    description?: string;
  };
  eventType: string;
  peopleCount: number;
  startTime: string;
  endTime: string;
}

export interface UpdateEventInput {
  peopleCount?: number;
  meal?: {
    name: string;
    type?: string;
    pricePerPerson: number;
    description?: string;
  };
  removeMeal?: boolean;
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
    const { userId, venueId, meal: mealData, eventType, peopleCount, startTime, endTime } = eventData;

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

      // Create meal if meal data is provided
      let createdMeal = null;
      let mealId = null;
      if (mealData) {
        logger.info(`Creating meal for event: ${mealData.name}`);
        try {
          createdMeal = await mealService.createMeal(mealData);
          mealId = createdMeal.id;
          logger.info(`Meal created successfully for event: ${createdMeal.id}`);
        } catch (mealError: any) {
          logger.error('Meal creation failed during event creation:', {
            error: mealError.message,
            mealData,
          });
          throw createError('Failed to create meal for your event. Please check meal details and try again.', 400);
        }
      }

      // Calculate total cost
      const durationHours = (endDateTime.getTime() - startDateTime.getTime()) / (1000 * 60 * 60);
      const venueCost = venue.pricePerHour * durationHours;
      const mealCost = createdMeal ? createdMeal.pricePerPerson * peopleCount : 0;
      const totalCost = venueCost + mealCost;

      // Prepare event data
      const createData: CreateEventData = {
        userId,
        venueId,
        mealId,
        eventType,
        peopleCount,
        startTime: startDateTime,
        endTime: endDateTime,
        totalCost,
        status: 'pending',
      };

      // Create event
      const event = await eventRepository.create(createData);

      logger.info(`Event created successfully: ${event.id} for user ${userId}${mealId ? ` with meal ${mealId}` : ''}`);
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

  /**
   * Update event (only people count and meal)
   */
  async updateEvent(eventId: string, userId: string, updateData: UpdateEventInput): Promise<EventResponse> {
    const { peopleCount, meal: mealData, removeMeal } = updateData;

    logger.info(`User ${userId} updating event ${eventId}`);

    try {
      // Check if event exists and user owns it
      const existingEvent = await eventRepository.findById(eventId);
      if (!existingEvent) {
        logger.warn(`Event update failed - not found: ${eventId}`);
        throw createError('The requested event could not be found. It may have been cancelled or removed.', 404);
      }

      if (existingEvent.userId !== userId) {
        logger.warn(`Unauthorized event update attempt by user ${userId} for event ${eventId}`);
        throw createError('You can only update your own events. This event belongs to another user.', 403);
      }

      // Check if event can be updated (not in the past or already confirmed)
      const now = new Date();
      if (existingEvent.startTime <= now) {
        logger.warn(`Event update failed - event already started: ${eventId}`);
        throw createError('Cannot update an event that has already started or passed.', 400);
      }

      if (existingEvent.status === 'confirmed') {
        logger.warn(`Event update failed - event already confirmed: ${eventId}`);
        throw createError('Cannot update a confirmed event. Please contact support for changes.', 400);
      }

      // Validate people count against venue capacity
      const finalPeopleCount = peopleCount || existingEvent.peopleCount;
      if (existingEvent.venue.capacity && finalPeopleCount > existingEvent.venue.capacity) {
        logger.warn(`Event update failed - people count exceeds venue capacity: ${finalPeopleCount} > ${existingEvent.venue.capacity}`);
        throw createError(`Venue capacity is ${existingEvent.venue.capacity} people, but you requested ${finalPeopleCount} people`, 400);
      }

      // Handle meal updates
      let newMealId = existingEvent.mealId;
      let createdMeal = null;

      if (removeMeal) {
        // Remove meal from event
        newMealId = null;
        logger.info(`Removing meal from event ${eventId}`);
      } else if (mealData) {
        // Create new meal for event
        logger.info(`Creating new meal for event update: ${mealData.name}`);
        try {
          createdMeal = await mealService.createMeal(mealData);
          newMealId = createdMeal.id;
          logger.info(`New meal created successfully for event update: ${createdMeal.id}`);
        } catch (mealError: any) {
          logger.error('Meal creation failed during event update:', {
            error: mealError.message,
            mealData,
          });
          throw createError('Failed to create meal for your event update. Please check meal details and try again.', 400);
        }
      }

      // Recalculate total cost
      const durationHours = (existingEvent.endTime.getTime() - existingEvent.startTime.getTime()) / (1000 * 60 * 60);
      const venueCost = existingEvent.venue.pricePerHour * durationHours;

      let mealCost = 0;
      if (newMealId) {
        if (createdMeal) {
          // Use newly created meal
          mealCost = createdMeal.pricePerPerson * finalPeopleCount;
        } else if (existingEvent.meal) {
          // Use existing meal (only people count changed)
          mealCost = existingEvent.meal.pricePerPerson * finalPeopleCount;
        }
      }

      const totalCost = venueCost + mealCost;

      // Prepare update data
      const updateEventData: UpdateEventData = {
        ...(peopleCount !== undefined && { peopleCount }),
        mealId: newMealId,
        totalCost,
      };

      // Update event
      const updatedEvent = await eventRepository.updateById(eventId, updateEventData);

      logger.info(`Event updated successfully: ${eventId} by user ${userId}${newMealId ? ` with meal ${newMealId}` : ' (meal removed)'}`);
      return updatedEvent;

    } catch (error: any) {
      // If it's already our custom error, re-throw it
      if (error.statusCode) {
        throw error;
      }

      logger.error('Event update error:', {
        error: error.message,
        eventId,
        userId,
      });

      // Handle record not found errors
      if (error.code === 'P2025') {
        throw createError('The requested event could not be found. It may have been cancelled or removed.', 404);
      }

      // Handle other database errors
      if (error.code?.startsWith('P')) {
        throw createError('Unable to update event at this time. Please try again later.', 500);
      }

      throw createError('Unable to update event at this time. Please try again later.', 500);
    }
  }
}

// Export singleton instance
export const eventService = new EventService();
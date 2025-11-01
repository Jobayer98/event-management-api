import { prisma } from '../../../config';
import { Event } from '@prisma/client';

export interface CreateEventData {
  userId: string;
  venueId: string;
  mealId?: string | null;
  eventType: string;
  peopleCount: number;
  startTime: Date;
  endTime: Date;
  totalCost?: number | null;
  status?: string;
}

export interface EventResponse {
  id: string;
  userId: string;
  venueId: string;
  mealId: string | null;
  eventType: string;
  peopleCount: number;
  startTime: Date;
  endTime: Date;
  totalCost: number | null;
  status: string;
  createdAt: Date;
  venue: {
    id: string;
    name: string;
    address: string | null;
    capacity: number | null;
    pricePerHour: number;
  };
  meal?: {
    id: string;
    name: string;
    type: string | null;
    pricePerPerson: number;
  } | null;
}

export interface EventFilters {
  status?: string;
  eventType?: string;
}

export class EventRepository {
  /**
   * Check if venue is available for the given time slot
   */
  async checkVenueAvailability(
    venueId: string,
    startTime: Date,
    endTime: Date,
    excludeEventId?: string
  ): Promise<boolean> {
    const whereClause: any = {
      venueId,
      status: {
        not: 'cancelled', // Don't consider cancelled events
      },
      OR: [
        // Event starts during the requested time
        {
          startTime: {
            gte: startTime,
            lt: endTime,
          },
        },
        // Event ends during the requested time
        {
          endTime: {
            gt: startTime,
            lte: endTime,
          },
        },
        // Event completely overlaps the requested time
        {
          startTime: {
            lte: startTime,
          },
          endTime: {
            gte: endTime,
          },
        },
      ],
    };

    // Exclude specific event (for updates)
    if (excludeEventId) {
      whereClause.id = { not: excludeEventId };
    }

    const conflictingEvent = await prisma.event.findFirst({
      where: whereClause,
      select: { id: true },
    });

    return !conflictingEvent; // Available if no conflicting event found
  }

  /**
   * Get conflicting events for a time slot
   */
  async getConflictingEvents(
    venueId: string,
    startTime: Date,
    endTime: Date
  ): Promise<Array<{ startTime: Date; endTime: Date; eventType: string }>> {
    const conflictingEvents = await prisma.event.findMany({
      where: {
        venueId,
        status: {
          not: 'cancelled',
        },
        OR: [
          {
            startTime: {
              gte: startTime,
              lt: endTime,
            },
          },
          {
            endTime: {
              gt: startTime,
              lte: endTime,
            },
          },
          {
            startTime: {
              lte: startTime,
            },
            endTime: {
              gte: endTime,
            },
          },
        ],
      },
      select: {
        startTime: true,
        endTime: true,
        eventType: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    return conflictingEvents;
  }

  /**
   * Create a new event
   */
  async create(eventData: CreateEventData): Promise<EventResponse> {
    const event = await prisma.event.create({
      data: eventData,
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            address: true,
            capacity: true,
            pricePerHour: true,
          },
        },
        meal: {
          select: {
            id: true,
            name: true,
            type: true,
            pricePerPerson: true,
          },
        },
      },
    });

    return {
      ...event,
      totalCost: event.totalCost ? Number(event.totalCost) : null,
      venue: {
        ...event.venue,
        pricePerHour: Number(event.venue.pricePerHour),
      },
      meal: event.meal ? {
        ...event.meal,
        pricePerPerson: Number(event.meal.pricePerPerson),
      } : null,
    };
  }

  /**
   * Find event by ID
   */
  async findById(id: string): Promise<EventResponse | null> {
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            address: true,
            capacity: true,
            pricePerHour: true,
          },
        },
        meal: {
          select: {
            id: true,
            name: true,
            type: true,
            pricePerPerson: true,
          },
        },
      },
    });

    if (!event) return null;

    return {
      ...event,
      totalCost: event.totalCost ? Number(event.totalCost) : null,
      venue: {
        ...event.venue,
        pricePerHour: Number(event.venue.pricePerHour),
      },
      meal: event.meal ? {
        ...event.meal,
        pricePerPerson: Number(event.meal.pricePerPerson),
      } : null,
    };
  }

  /**
   * Find events by user ID with pagination and filters
   */
  async findByUserId(
    userId: string,
    skip: number = 0,
    take: number = 10,
    filters: EventFilters = {}
  ): Promise<EventResponse[]> {
    const { status, eventType } = filters;

    const whereClause: any = { userId };

    if (status) {
      whereClause.status = status;
    }

    if (eventType) {
      whereClause.eventType = { contains: eventType, mode: 'insensitive' };
    }

    const events = await prisma.event.findMany({
      where: whereClause,
      skip,
      take,
      include: {
        venue: {
          select: {
            id: true,
            name: true,
            address: true,
            capacity: true,
            pricePerHour: true,
          },
        },
        meal: {
          select: {
            id: true,
            name: true,
            type: true,
            pricePerPerson: true,
          },
        },
      },
      orderBy: {
        startTime: 'desc',
      },
    });

    return events.map(event => ({
      ...event,
      totalCost: event.totalCost ? Number(event.totalCost) : null,
      venue: {
        ...event.venue,
        pricePerHour: Number(event.venue.pricePerHour),
      },
      meal: event.meal ? {
        ...event.meal,
        pricePerPerson: Number(event.meal.pricePerPerson),
      } : null,
    }));
  }

  /**
   * Count events by user ID with filters
   */
  async countByUserId(userId: string, filters: EventFilters = {}): Promise<number> {
    const { status, eventType } = filters;

    const whereClause: any = { userId };

    if (status) {
      whereClause.status = status;
    }

    if (eventType) {
      whereClause.eventType = { contains: eventType, mode: 'insensitive' };
    }

    return await prisma.event.count({
      where: whereClause,
    });
  }
}

// Export singleton instance
export const eventRepository = new EventRepository();
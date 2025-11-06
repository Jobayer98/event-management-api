import { Request, Response, NextFunction } from 'express';
import { paymentService } from '../services/paymentService';
import { eventService } from '../services/eventService';
import { venueRepository } from '../repositories/venueRepository';
import { mealRepository } from '../repositories/mealRepository';
import { eventRepository } from '../repositories/eventRepository';
import { paymentRepository } from '../repositories/paymentRepository';
import { logger } from '../../../config';
import { createError } from '../../../middleware/errorHandler';

export interface CalculateCostRequest {
  venueId: string;
  mealId?: string;
  peopleCount: number;
  startTime: string;
  endTime: string;
}

export interface ProcessPaymentRequest {
  eventId: string;
  paymentMethod: string;
  eventType?: string;
}

/**
 * Calculate cost for event booking
 * POST /api/v1/payments/calculate-cost
 */
export const calculateCost = async (
  req: Request<{}, {}, CalculateCostRequest>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { venueId, mealId, peopleCount, startTime, endTime } = req.body;

    logger.info('Calculating cost for event booking', {
      venueId,
      mealId,
      peopleCount,
      startTime,
      endTime
    });

    // Validate venue exists
    const venue = await venueRepository.findById(venueId);
    if (!venue) {
      return next(createError('Venue not found', 404));
    }

    // Validate meal if provided
    let meal = null;
    if (mealId) {
      meal = await mealRepository.findById(mealId);
      if (!meal) {
        return next(createError('Meal not found', 404));
      }

      // Check minimum guests requirement
      if (meal.minimumGuests && peopleCount < meal.minimumGuests) {
        return next(createError(
          `This meal requires a minimum of ${meal.minimumGuests} guests, but you have ${peopleCount} people.`,
          400
        ));
      }
    }

    // Check venue capacity
    if (venue.capacity && peopleCount > venue.capacity) {
      return next(createError(
        `Venue capacity is ${venue.capacity} people, but you requested ${peopleCount} people`,
        400
      ));
    }

    // Calculate cost
    const costCalculation = await paymentService.calculateEventCost(
      venue,
      meal,
      peopleCount,
      new Date(startTime),
      new Date(endTime)
    );

    res.status(200).json({
      success: true,
      message: 'Cost calculated successfully',
      data: {
        costBreakdown: costCalculation,
        venue: {
          id: venue.id,
          name: venue.name,
          pricePerDay: venue.pricePerDay
        },
        ...(meal && {
          meal: {
            id: meal.id,
            name: meal.name,
            pricePerPerson: meal.pricePerPerson
          }
        })
      }
    });

  } catch (error: any) {
    logger.error('Calculate cost controller error:', {
      error: error.message,
      stack: error.stack,
      requestData: req.body
    });

    next(error);
  }
};

/**
 * Process payment and create event
 * POST /api/v1/payments/process
 */
export const processPayment = async (
  req: Request<{}, {}, ProcessPaymentRequest & CalculateCostRequest>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { 
      paymentMethod, 
      venueId, 
      mealId, 
      peopleCount, 
      startTime, 
      endTime, 
      eventType 
    } = req.body;

    // Get user ID from JWT token
    const userId = (req as any).user?.userId;
    if (!userId) {
      return next(createError('Authentication required', 401));
    }

    logger.info(`Processing payment and creating event for user ${userId}`, {
      venueId,
      mealId,
      paymentMethod,
      peopleCount
    });

    // Validate payment method
    if (!paymentService.validatePaymentMethod(paymentMethod)) {
      return next(createError('Invalid payment method', 400));
    }

    // Validate venue exists
    const venue = await venueRepository.findById(venueId);
    if (!venue) {
      return next(createError('Venue not found', 404));
    }

    // Validate meal if provided
    let meal = null;
    if (mealId) {
      meal = await mealRepository.findById(mealId);
      if (!meal) {
        return next(createError('Meal not found', 404));
      }

      // Check minimum guests requirement
      if (meal.minimumGuests && peopleCount < meal.minimumGuests) {
        return next(createError(
          `This meal requires a minimum of ${meal.minimumGuests} guests, but you have ${peopleCount} people.`,
          400
        ));
      }
    }

    // Check venue capacity
    if (venue.capacity && peopleCount > venue.capacity) {
      return next(createError(
        `Venue capacity is ${venue.capacity} people, but you requested ${peopleCount} people`,
        400
      ));
    }

    const startDateTime = new Date(startTime);
    const endDateTime = new Date(endTime);

    // Check venue availability
    const isAvailable = await eventRepository.checkVenueAvailability(
      venueId,
      startDateTime,
      endDateTime
    );

    if (!isAvailable) {
      return next(createError('Venue is no longer available for the selected time slot', 409));
    }

    // Calculate total cost
    const costCalculation = await paymentService.calculateEventCost(
      venue,
      meal,
      peopleCount,
      startDateTime,
      endDateTime
    );

    // Create event first (with pending status)
    const event = await eventService.createEvent({
      userId,
      venueId,
      mealId,
      eventType: eventType || 'Event',
      peopleCount,
      startTime,
      endTime
    });

    // Process payment
    const paymentResult = await paymentService.processPayment({
      eventId: event.id,
      amount: costCalculation.totalAmount,
      method: paymentMethod
    });

    if (paymentResult.success) {
      // Update event status to confirmed
      await eventRepository.updateById(event.id, { totalCost: costCalculation.totalAmount });

      logger.info(`Payment successful and event confirmed: ${event.id}`, {
        transactionId: paymentResult.transactionId,
        amount: costCalculation.totalAmount
      });

      res.status(201).json({
        success: true,
        message: 'Payment processed successfully and event booked!',
        data: {
          event: {
            ...event,
            status: 'confirmed'
          },
          payment: paymentResult.payment,
          transactionId: paymentResult.transactionId,
          costBreakdown: costCalculation
        }
      });
    } else {
      // Payment failed, update event total cost
      await eventRepository.updateById(event.id, { totalCost: costCalculation.totalAmount });

      logger.warn(`Payment failed for event: ${event.id}`, {
        transactionId: paymentResult.transactionId
      });

      res.status(400).json({
        success: false,
        message: paymentResult.message,
        data: {
          event: {
            ...event,
            status: 'cancelled'
          },
          payment: paymentResult.payment,
          transactionId: paymentResult.transactionId
        }
      });
    }

  } catch (error: any) {
    logger.error('Process payment controller error:', {
      error: error.message,
      stack: error.stack,
      requestData: req.body,
      userId: (req as any).user?.userId
    });

    next(error);
  }
};

/**
 * Get available payment methods
 * GET /api/v1/payments/methods
 */
export const getPaymentMethods = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const paymentMethods = paymentService.getAvailablePaymentMethods();

    res.status(200).json({
      success: true,
      message: 'Payment methods retrieved successfully',
      data: {
        paymentMethods
      }
    });

  } catch (error: any) {
    logger.error('Get payment methods controller error:', {
      error: error.message,
      stack: error.stack
    });

    next(error);
  }
};

/**
 * Check payment status by transaction ID
 * POST /api/v1/payments/status
 */
export const getPaymentStatus = async (
  req: Request<{}, {}, { transactionId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { transactionId } = req.body;

    logger.info(`Checking payment status for transaction: ${transactionId}`);

    const payment = await paymentRepository.findByTransactionId(transactionId);

    if (!payment) {
      return next(createError('Payment not found', 404));
    }

    res.status(200).json({
      success: true,
      message: 'Payment status retrieved successfully',
      data: {
        payment: {
          id: payment.id,
          status: payment.status,
          amount: payment.amount,
          method: payment.method,
          transactionId: payment.transactionId,
          createdAt: payment.createdAt
        }
      }
    });

  } catch (error: any) {
    logger.error('Get payment status controller error:', {
      error: error.message,
      stack: error.stack,
      transactionId: req.body.transactionId
    });

    next(error);
  }
};

/**
 * Process payment refund
 * POST /api/v1/payments/refund
 */
export const refundPayment = async (
  req: Request<{}, {}, { paymentId: string; reason: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { paymentId, reason } = req.body;
    const userId = (req as any).user?.userId;

    if (!userId) {
      return next(createError('Authentication required', 401));
    }

    logger.info(`Processing refund for payment ${paymentId}`, {
      userId,
      reason
    });

    const payment = await paymentRepository.findById(paymentId);

    if (!payment) {
      return next(createError('Payment not found', 404));
    }

    if (payment.status !== 'success') {
      return next(createError('Only successful payments can be refunded', 400));
    }

    // Check if user owns this payment through the event
    const event = await eventRepository.findById(payment.eventId);
    if (!event || event.userId !== userId) {
      return next(createError('You can only refund your own payments', 403));
    }

    // Process refund through payment service
    const refundResult = await paymentService.processRefund(paymentId, reason);

    if (refundResult.success) {
      // Mark event as cancelled in the response (status is managed by the event service)
      // await eventRepository.updateById(payment.eventId, { status: 'cancelled' });

      res.status(200).json({
        success: true,
        message: 'Refund processed successfully',
        data: {
          refund: refundResult.refund,
          originalPayment: payment
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: refundResult.message,
        data: {
          originalPayment: payment
        }
      });
    }

  } catch (error: any) {
    logger.error('Refund payment controller error:', {
      error: error.message,
      stack: error.stack,
      paymentId: req.body.paymentId,
      userId: (req as any).user?.userId
    });

    next(error);
  }
};

/**
 * Get user payment history
 * GET /api/v1/payments/history
 */
export const getPaymentHistory = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      return next(createError('Authentication required', 401));
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100);
    const status = req.query.status as string;

    logger.info(`Fetching payment history for user ${userId}`, {
      page,
      limit,
      status
    });

    const paymentHistory = await paymentService.getUserPaymentHistory(userId, {
      page,
      limit,
      status
    });

    res.status(200).json({
      success: true,
      message: 'Payment history retrieved successfully',
      data: paymentHistory
    });

  } catch (error: any) {
    logger.error('Get payment history controller error:', {
      error: error.message,
      stack: error.stack,
      userId: (req as any).user?.userId
    });

    next(error);
  }
};
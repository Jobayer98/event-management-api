import { Request, Response, NextFunction } from 'express';
import { paymentRepository } from '../repositories/paymentRepository';
import { eventRepository } from '../repositories/eventRepository';
import { logger } from '../../../config';
import { createError } from '../../../middleware/errorHandler';

export interface WebhookPayload {
  transactionId: string;
  status: 'success' | 'failed' | 'pending';
  amount: number;
  method: string;
  timestamp: string;
  signature?: string;
}

/**
 * Handle payment webhook notifications
 * POST /api/v1/payments/webhook
 */
export const handlePaymentWebhook = async (
  req: Request<{}, {}, WebhookPayload>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { transactionId, status, amount, method, timestamp, signature } = req.body;

    logger.info('Received payment webhook', {
      transactionId,
      status,
      amount,
      method,
      timestamp
    });

    // Verify webhook signature (in production, you'd verify against the payment provider's signature)
    if (!verifyWebhookSignature(req.body, signature)) {
      logger.warn('Invalid webhook signature', { transactionId });
      return next(createError('Invalid webhook signature', 401));
    }

    // Find the payment by transaction ID
    const payment = await paymentRepository.findByTransactionId(transactionId);

    if (!payment) {
      logger.warn('Payment not found for webhook', { transactionId });
      return next(createError('Payment not found', 404));
    }

    // Update payment status if it has changed
    if (payment.status !== status) {
      await paymentRepository.updateStatus(payment.id, status);

      // Log event status changes based on payment status
      if (status === 'success') {
        logger.info('Event confirmed via webhook', {
          eventId: payment.eventId,
          transactionId
        });
      } else if (status === 'failed') {
        logger.info('Event cancelled via webhook', {
          eventId: payment.eventId,
          transactionId
        });
      }

      logger.info('Payment status updated via webhook', {
        paymentId: payment.id,
        oldStatus: payment.status,
        newStatus: status,
        transactionId
      });
    }

    // Send success response to payment provider
    res.status(200).json({
      success: true,
      message: 'Webhook processed successfully',
      transactionId
    });

  } catch (error: any) {
    logger.error('Payment webhook error:', {
      error: error.message,
      stack: error.stack,
      requestBody: req.body
    });

    // Always respond with 200 to prevent webhook retries for application errors
    res.status(200).json({
      success: false,
      message: 'Webhook processing failed',
      error: error.message
    });
  }
};

/**
 * Handle refund webhook notifications
 * POST /api/v1/payments/webhook/refund
 */
export const handleRefundWebhook = async (
  req: Request<{}, {}, WebhookPayload & { originalTransactionId: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { transactionId, originalTransactionId, status, amount, timestamp, signature } = req.body;

    logger.info('Received refund webhook', {
      transactionId,
      originalTransactionId,
      status,
      amount,
      timestamp
    });

    // Verify webhook signature
    if (!verifyWebhookSignature(req.body, signature)) {
      logger.warn('Invalid refund webhook signature', { transactionId });
      return next(createError('Invalid webhook signature', 401));
    }

    // Find the original payment
    const originalPayment = await paymentRepository.findByTransactionId(originalTransactionId);

    if (!originalPayment) {
      logger.warn('Original payment not found for refund webhook', { originalTransactionId });
      return next(createError('Original payment not found', 404));
    }

    // Update payment status to refunded if refund was successful
    if (status === 'success') {
      await paymentRepository.updateStatus(originalPayment.id, 'refunded');

      // Log event cancellation due to refund
      logger.info('Event cancelled due to refund', {
        eventId: originalPayment.eventId,
        refundTransactionId: transactionId
      });

      logger.info('Refund processed successfully via webhook', {
        originalPaymentId: originalPayment.id,
        refundTransactionId: transactionId,
        eventId: originalPayment.eventId
      });
    }

    res.status(200).json({
      success: true,
      message: 'Refund webhook processed successfully',
      transactionId
    });

  } catch (error: any) {
    logger.error('Refund webhook error:', {
      error: error.message,
      stack: error.stack,
      requestBody: req.body
    });

    res.status(200).json({
      success: false,
      message: 'Refund webhook processing failed',
      error: error.message
    });
  }
};

/**
 * Verify webhook signature (mock implementation)
 * In production, implement proper signature verification based on your payment provider
 */
function verifyWebhookSignature(payload: any, signature?: string): boolean {
  // Mock verification - always return true for development
  // In production, implement proper HMAC signature verification
  if (!signature) {
    return false;
  }

  // Example verification logic:
  // const expectedSignature = crypto
  //   .createHmac('sha256', process.env.WEBHOOK_SECRET!)
  //   .update(JSON.stringify(payload))
  //   .digest('hex');
  // 
  // return crypto.timingSafeEqual(
  //   Buffer.from(signature, 'hex'),
  //   Buffer.from(expectedSignature, 'hex')
  // );

  return true; // Mock implementation
}
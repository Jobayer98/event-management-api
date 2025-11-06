import { paymentRepository, PaymentResponse } from '../repositories/paymentRepository';
import { createError } from '../../../middleware/errorHandler';
import { logger } from '../../../config';

export interface PaymentCalculation {
  venueCost: number;
  mealCost: number;
  subtotal: number;
  tax: number;
  serviceFee: number;
  totalAmount: number;
  breakdown: {
    venue: {
      name: string;
      pricePerDay: number;
      days: number;
      cost: number;
    };
    meal?: {
      name: string;
      pricePerPerson: number;
      people: number;
      cost: number;
    };
    fees: {
      tax: number;
      serviceFee: number;
    };
  };
}

export interface PaymentRequest {
  eventId: string;
  amount: number;
  method: string;
}

export interface ProcessPaymentResponse {
  success: boolean;
  transactionId: string;
  message: string;
  payment: PaymentResponse;
}

export class PaymentService {
  private readonly TAX_RATE = 0.08; // 8% tax
  private readonly SERVICE_FEE_RATE = 0.05; // 5% service fee

  /**
   * Calculate total cost for an event booking
   */
  async calculateEventCost(
    venue: any,
    meal: any | null,
    peopleCount: number,
    startTime: Date,
    endTime: Date
  ): Promise<PaymentCalculation> {
    logger.info('Calculating event cost', {
      venueId: venue.id,
      mealId: meal?.id,
      peopleCount,
      startTime,
      endTime
    });

    try {
      // Calculate duration in days
      const durationDays = Math.ceil((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60 * 24));
      
      // Calculate venue cost
      const venueCost = venue.pricePerDay * durationDays;
      
      // Calculate meal cost
      const mealCost = meal ? meal.pricePerPerson * peopleCount : 0;
      
      // Calculate subtotal
      const subtotal = venueCost + mealCost;
      
      // Calculate tax and service fee
      const tax = subtotal * this.TAX_RATE;
      const serviceFee = subtotal * this.SERVICE_FEE_RATE;
      
      // Calculate total amount
      const totalAmount = subtotal + tax + serviceFee;

      const calculation: PaymentCalculation = {
        venueCost,
        mealCost,
        subtotal,
        tax,
        serviceFee,
        totalAmount,
        breakdown: {
          venue: {
            name: venue.name,
            pricePerDay: venue.pricePerDay,
            days: durationDays,
            cost: venueCost
          },
          ...(meal && {
            meal: {
              name: meal.name,
              pricePerPerson: meal.pricePerPerson,
              people: peopleCount,
              cost: mealCost
            }
          }),
          fees: {
            tax,
            serviceFee
          }
        }
      };

      logger.info('Event cost calculated successfully', {
        subtotal,
        totalAmount,
        venueCost,
        mealCost
      });

      return calculation;

    } catch (error: any) {
      logger.error('Cost calculation error:', {
        error: error.message,
        venueId: venue.id,
        mealId: meal?.id
      });

      throw createError('Unable to calculate event cost. Please try again later.', 500);
    }
  }

  /**
   * Process payment for an event booking (simulation)
   */
  async processPayment(paymentData: PaymentRequest): Promise<ProcessPaymentResponse> {
    const { eventId, amount, method } = paymentData;

    logger.info(`Processing payment for event ${eventId}`, {
      amount,
      method
    });

    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate mock transaction ID
      const transactionId = this.generateTransactionId(method);

      // Simulate payment success/failure (95% success rate)
      const isSuccess = Math.random() > 0.05;

      if (!isSuccess) {
        logger.warn(`Payment failed for event ${eventId}`, {
          transactionId,
          method,
          amount
        });

        // Create failed payment record
        const failedPayment = await paymentRepository.create({
          eventId,
          amount,
          method,
          status: 'failed',
          transactionId
        });

        return {
          success: false,
          transactionId,
          message: 'Payment processing failed. Please try again or use a different payment method.',
          payment: failedPayment
        };
      }

      // Create successful payment record
      const successfulPayment = await paymentRepository.create({
        eventId,
        amount,
        method,
        status: 'success',
        transactionId
      });

      logger.info(`Payment processed successfully for event ${eventId}`, {
        transactionId,
        paymentId: successfulPayment.id
      });

      return {
        success: true,
        transactionId,
        message: 'Payment processed successfully. Your event booking is confirmed!',
        payment: successfulPayment
      };

    } catch (error: any) {
      logger.error('Payment processing error:', {
        error: error.message,
        eventId,
        amount,
        method
      });

      throw createError('Payment processing failed. Please try again later.', 500);
    }
  }

  /**
   * Get payment methods available for booking
   */
  getAvailablePaymentMethods(): Array<{ id: string; name: string; description: string }> {
    return [
      {
        id: 'card',
        name: 'Credit/Debit Card',
        description: 'Pay securely with your credit or debit card'
      },
      {
        id: 'bkash',
        name: 'bKash',
        description: 'Pay using bKash mobile financial service'
      },
      {
        id: 'nagad',
        name: 'Nagad',
        description: 'Pay using Nagad mobile financial service'
      },
      {
        id: 'rocket',
        name: 'Rocket',
        description: 'Pay using Rocket mobile financial service'
      }
    ];
  }

  /**
   * Generate mock transaction ID based on payment method
   */
  private generateTransactionId(method: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const prefixes: { [key: string]: string } = {
      card: 'CARD',
      bkash: 'BKS',
      nagad: 'NGD',
      rocket: 'RKT',
      bank_transfer: 'BANK'
    };

    const prefix = prefixes[method] || 'PAY';
    return `${prefix}${timestamp}${random}`;
  }

  /**
   * Validate payment method
   */
  validatePaymentMethod(method: string): boolean {
    const availableMethods = this.getAvailablePaymentMethods();
    return availableMethods.some(m => m.id === method);
  }

  /**
   * Process payment refund (simulation)
   */
  async processRefund(paymentId: string, reason: string): Promise<{
    success: boolean;
    message: string;
    refund?: any;
  }> {
    logger.info(`Processing refund for payment ${paymentId}`, { reason });

    try {
      // Simulate refund processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Simulate refund success/failure (90% success rate)
      const isSuccess = Math.random() > 0.1;

      if (!isSuccess) {
        logger.warn(`Refund failed for payment ${paymentId}`);
        return {
          success: false,
          message: 'Refund processing failed. Please contact support for assistance.'
        };
      }

      // Update payment status to refunded
      const updatedPayment = await paymentRepository.updateStatus(paymentId, 'refunded');

      // Generate refund transaction ID
      const refundTransactionId = this.generateTransactionId('refund');

      logger.info(`Refund processed successfully for payment ${paymentId}`, {
        refundTransactionId
      });

      return {
        success: true,
        message: 'Refund processed successfully. Amount will be credited within 3-5 business days.',
        refund: {
          id: `REF_${paymentId}`,
          paymentId,
          transactionId: refundTransactionId,
          amount: updatedPayment.amount,
          reason,
          processedAt: new Date(),
          status: 'processed'
        }
      };

    } catch (error: any) {
      logger.error('Refund processing error:', {
        error: error.message,
        paymentId,
        reason
      });

      throw createError('Refund processing failed. Please try again later.', 500);
    }
  }

  /**
   * Get user payment history with pagination and filtering
   */
  async getUserPaymentHistory(userId: string, options: {
    page: number;
    limit: number;
    status?: string;
  }): Promise<{
    payments: any[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
    summary: {
      totalAmount: number;
      successfulPayments: number;
      failedPayments: number;
      refundedPayments: number;
    };
  }> {
    const { page, limit, status } = options;
    const offset = (page - 1) * limit;

    logger.info(`Fetching payment history for user ${userId}`, {
      page,
      limit,
      status,
      offset
    });

    try {
      // This would typically use a repository method with proper database queries
      // For now, we'll simulate the response structure
      const payments = await this.getPaymentsForUser(userId, { limit, offset, status });
      const totalCount = await this.getPaymentCountForUser(userId, status);

      // Calculate summary statistics
      const allUserPayments = await this.getAllPaymentsForUser(userId);
      const summary = {
        totalAmount: allUserPayments
          .filter(p => p.status === 'success')
          .reduce((sum, p) => sum + p.amount, 0),
        successfulPayments: allUserPayments.filter(p => p.status === 'success').length,
        failedPayments: allUserPayments.filter(p => p.status === 'failed').length,
        refundedPayments: allUserPayments.filter(p => p.status === 'refunded').length
      };

      return {
        payments,
        pagination: {
          page,
          limit,
          total: totalCount,
          totalPages: Math.ceil(totalCount / limit)
        },
        summary
      };

    } catch (error: any) {
      logger.error('Get user payment history error:', {
        error: error.message,
        userId,
        options
      });

      throw createError('Unable to fetch payment history. Please try again later.', 500);
    }
  }

  /**
   * Calculate payment processing fees
   */
  calculateProcessingFees(amount: number, method: string): {
    processingFee: number;
    netAmount: number;
  } {
    const feeRates: { [key: string]: number } = {
      card: 0.029, // 2.9%
      bkash: 0.018, // 1.8%
      nagad: 0.015, // 1.5%
      rocket: 0.018, // 1.8%
      bank_transfer: 0.005 // 0.5%
    };

    const feeRate = feeRates[method] || 0.025; // Default 2.5%
    const processingFee = amount * feeRate;
    const netAmount = amount - processingFee;

    return {
      processingFee: Math.round(processingFee * 100) / 100,
      netAmount: Math.round(netAmount * 100) / 100
    };
  }

  /**
   * Validate payment amount
   */
  validatePaymentAmount(amount: number): { valid: boolean; message?: string } {
    const MIN_AMOUNT = 100; // Minimum 100 BDT
    const MAX_AMOUNT = 1000000; // Maximum 1,000,000 BDT

    if (amount < MIN_AMOUNT) {
      return {
        valid: false,
        message: `Minimum payment amount is ${MIN_AMOUNT} BDT`
      };
    }

    if (amount > MAX_AMOUNT) {
      return {
        valid: false,
        message: `Maximum payment amount is ${MAX_AMOUNT} BDT`
      };
    }

    return { valid: true };
  }

  // Helper methods for payment history using the repository
  private async getPaymentsForUser(userId: string, options: {
    limit: number;
    offset: number;
    status?: string;
  }): Promise<any[]> {
    const page = Math.floor(options.offset / options.limit) + 1;
    const result = await paymentRepository.findByUserId(userId, {
      page,
      limit: options.limit,
      status: options.status
    });
    return result.payments;
  }

  private async getPaymentCountForUser(userId: string, status?: string): Promise<number> {
    const result = await paymentRepository.findByUserId(userId, {
      page: 1,
      limit: 1,
      status
    });
    return result.total;
  }

  private async getAllPaymentsForUser(userId: string): Promise<any[]> {
    const stats = await paymentRepository.getUserPaymentStats(userId);
    // Convert stats to array format for compatibility
    return [
      ...Array(stats.successfulPayments).fill({ status: 'success', amount: stats.totalAmount / stats.successfulPayments || 0 }),
      ...Array(stats.failedPayments).fill({ status: 'failed', amount: 0 }),
      ...Array(stats.refundedPayments).fill({ status: 'refunded', amount: 0 }),
      ...Array(stats.pendingPayments).fill({ status: 'pending', amount: 0 })
    ];
  }
}

// Export singleton instance
export const paymentService = new PaymentService();
import { PrismaClient, Payment } from '@prisma/client';
import { DatabaseConnection } from '../../../config';

export interface CreatePaymentData {
  eventId: string;
  amount: number;
  method: string;
  status: string;
  transactionId: string;
}

export interface PaymentResponse {
  id: string;
  eventId: string;
  amount: number;
  method: string;
  status: string;
  transactionId: string;
  createdAt: Date;
}

export class PaymentRepository {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = DatabaseConnection.getInstance();
  }

  /**
   * Create a new payment record
   */
  async create(data: CreatePaymentData): Promise<PaymentResponse> {
    const payment = await this.prisma.payment.create({
      data: {
        eventId: data.eventId,
        amount: data.amount,
        method: data.method,
        status: data.status,
        transactionId: data.transactionId,
      },
    });

    return this.mapToResponse(payment);
  }

  /**
   * Find payment by ID
   */
  async findById(id: string): Promise<PaymentResponse | null> {
    const payment = await this.prisma.payment.findUnique({
      where: { id },
    });

    return payment ? this.mapToResponse(payment) : null;
  }

  /**
   * Find payments by event ID
   */
  async findByEventId(eventId: string): Promise<PaymentResponse[]> {
    const payments = await this.prisma.payment.findMany({
      where: { eventId },
      orderBy: { createdAt: 'desc' },
    });

    return payments.map(this.mapToResponse);
  }

  /**
   * Find payment by transaction ID
   */
  async findByTransactionId(transactionId: string): Promise<PaymentResponse | null> {
    const payment = await this.prisma.payment.findFirst({
      where: { transactionId },
    });

    return payment ? this.mapToResponse(payment) : null;
  }

  /**
   * Update payment status
   */
  async updateStatus(id: string, status: string): Promise<PaymentResponse> {
    const payment = await this.prisma.payment.update({
      where: { id },
      data: { status },
    });

    return this.mapToResponse(payment);
  }

  /**
   * Get successful payment for an event
   */
  async getSuccessfulPaymentForEvent(eventId: string): Promise<PaymentResponse | null> {
    const payment = await this.prisma.payment.findFirst({
      where: {
        eventId,
        status: 'success',
      },
      orderBy: { createdAt: 'desc' },
    });

    return payment ? this.mapToResponse(payment) : null;
  }

  /**
   * Get payments for a user with pagination and filtering
   */
  async findByUserId(
    userId: string,
    options: {
      page: number;
      limit: number;
      status?: string;
    }
  ): Promise<{
    payments: (PaymentResponse & {
      event: {
        id: string;
        eventType: string;
        startTime: Date;
        endTime: Date;
        venue: {
          id: string;
          name: string;
        };
        meal?: {
          id: string;
          name: string;
        };
      };
    })[];
    total: number;
  }> {
    const { page, limit, status } = options;
    const skip = (page - 1) * limit;

    const where = {
      event: {
        userId
      },
      ...(status && { status })
    };

    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        include: {
          event: {
            include: {
              venue: {
                select: {
                  id: true,
                  name: true
                }
              },
              meal: {
                select: {
                  id: true,
                  name: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      this.prisma.payment.count({ where })
    ]);

    return {
      payments: payments.map(payment => ({
        ...this.mapToResponse(payment),
        event: {
          id: payment.event.id,
          eventType: payment.event.eventType,
          startTime: payment.event.startTime,
          endTime: payment.event.endTime,
          venue: payment.event.venue,
          meal: payment.event.meal || undefined
        }
      })),
      total
    };
  }

  /**
   * Get payment statistics for a user
   */
  async getUserPaymentStats(userId: string): Promise<{
    totalAmount: number;
    successfulPayments: number;
    failedPayments: number;
    refundedPayments: number;
    pendingPayments: number;
  }> {
    const stats = await this.prisma.payment.groupBy({
      by: ['status'],
      where: {
        event: {
          userId
        }
      },
      _sum: {
        amount: true
      },
      _count: {
        id: true
      }
    });

    const result = {
      totalAmount: 0,
      successfulPayments: 0,
      failedPayments: 0,
      refundedPayments: 0,
      pendingPayments: 0
    };

    stats.forEach(stat => {
      const amount = Number(stat._sum.amount || 0);
      const count = stat._count.id;

      switch (stat.status) {
        case 'success':
          result.successfulPayments = count;
          result.totalAmount += amount;
          break;
        case 'failed':
          result.failedPayments = count;
          break;
        case 'refunded':
          result.refundedPayments = count;
          break;
        case 'pending':
          result.pendingPayments = count;
          break;
      }
    });

    return result;
  }

  /**
   * Get recent payments for analytics
   */
  async getRecentPayments(limit: number = 10): Promise<PaymentResponse[]> {
    const payments = await this.prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    return payments.map(this.mapToResponse);
  }

  /**
   * Check if payment exists for event
   */
  async hasSuccessfulPaymentForEvent(eventId: string): Promise<boolean> {
    const payment = await this.prisma.payment.findFirst({
      where: {
        eventId,
        status: 'success'
      }
    });

    return !!payment;
  }

  /**
   * Map database model to response format
   */
  private mapToResponse(payment: Payment): PaymentResponse {
    return {
      id: payment.id,
      eventId: payment.eventId,
      amount: Number(payment.amount),
      method: payment.method || '',
      status: payment.status,
      transactionId: payment.transactionId || '',
      createdAt: payment.createdAt,
    };
  }
}

// Export singleton instance
export const paymentRepository = new PaymentRepository();
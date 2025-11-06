import { Router } from 'express';
import { 
  calculateCost,
  processPayment,
  getPaymentMethods,
  getPaymentStatus,
  refundPayment,
  getPaymentHistory
} from '../controllers/paymentController';
import {
  handlePaymentWebhook,
  handleRefundWebhook
} from '../controllers/paymentWebhookController';
import { validateBody } from '../../../middleware/validation';
import { authenticateToken } from '../../../middleware/auth';
import { 
  calculateCostSchema, 
  processPaymentSchema, 
  refundPaymentSchema,
  paymentStatusSchema 
} from '../../../schemas/payment';

const router = Router();

/**
 * @swagger
 * /api/v1/payments/methods:
 *   get:
 *     tags:
 *       - Payments
 *     summary: Get available payment methods
 *     description: |
 *       Retrieve a list of all available payment methods for event booking.
 *       This endpoint returns supported payment methods including mobile financial services
 *       (bKash, Nagad, Rocket), credit/debit cards, and bank transfers.
 *     responses:
 *       200:
 *         description: Payment methods retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentMethodsResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */
router.get('/methods', getPaymentMethods);

/**
 * @swagger
 * /api/v1/payments/calculate-cost:
 *   post:
 *     tags:
 *       - Payments
 *     summary: Calculate event booking cost
 *     description: |
 *       Calculate the total cost for an event booking including venue rental,
 *       meal costs (if selected), taxes (8%), and service fees (5%).
 *       
 *       The calculation considers:
 *       - Venue cost based on duration and daily rate
 *       - Meal cost based on number of people and per-person rate
 *       - Tax calculation (8% of subtotal)
 *       - Service fee (5% of subtotal)
 *       
 *       Returns detailed cost breakdown and available payment methods.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CalculateCostRequest'
 *           examples:
 *             wedding_with_meal:
 *               summary: Wedding with meal package
 *               value:
 *                 venueId: "456e7890-e89b-12d3-a456-426614174001"
 *                 mealId: "789e0123-e89b-12d3-a456-426614174002"
 *                 peopleCount: 150
 *                 startTime: "2024-12-25T10:00:00.000Z"
 *                 endTime: "2024-12-25T22:00:00.000Z"
 *             birthday_venue_only:
 *               summary: Birthday party - venue only
 *               value:
 *                 venueId: "456e7890-e89b-12d3-a456-426614174001"
 *                 peopleCount: 50
 *                 startTime: "2024-11-15T14:00:00.000Z"
 *                 endTime: "2024-11-15T20:00:00.000Z"
 *     responses:
 *       200:
 *         description: Cost calculated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CalculateCostResponse'
 *       400:
 *         description: Invalid request data or business rule violation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       404:
 *         description: Venue or meal not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */
router.post('/calculate-cost', validateBody(calculateCostSchema), calculateCost);

/**
 * @swagger
 * /api/v1/payments/process:
 *   post:
 *     tags:
 *       - Payments
 *     summary: Process payment and create event booking
 *     description: |
 *       Process payment for an event booking and create the event record.
 *       
 *       This endpoint:
 *       1. Validates the payment method and booking details
 *       2. Checks venue availability for the requested time slot
 *       3. Calculates the total cost including taxes and fees
 *       4. Creates a pending event record
 *       5. Processes the payment through the selected method
 *       6. Updates the event status based on payment result
 *       
 *       **Payment Methods:**
 *       - `card`: Credit/Debit Card (2.9% processing fee)
 *       - `bkash`: bKash Mobile Banking (1.8% processing fee)
 *       - `nagad`: Nagad Mobile Banking (1.5% processing fee)
 *       - `rocket`: Rocket Mobile Banking (1.8% processing fee)
 *       - `bank_transfer`: Direct Bank Transfer (0.5% processing fee)
 *       
 *       **Note:** This is a simulation. In production, integrate with actual payment gateways.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProcessPaymentRequest'
 *           examples:
 *             bkash_payment:
 *               summary: bKash payment for wedding
 *               value:
 *                 paymentMethod: "bkash"
 *                 venueId: "456e7890-e89b-12d3-a456-426614174001"
 *                 mealId: "789e0123-e89b-12d3-a456-426614174002"
 *                 peopleCount: 150
 *                 startTime: "2024-12-25T10:00:00.000Z"
 *                 endTime: "2024-12-25T22:00:00.000Z"
 *                 eventType: "Wedding Reception"
 *             card_payment:
 *               summary: Card payment for birthday party
 *               value:
 *                 paymentMethod: "card"
 *                 venueId: "456e7890-e89b-12d3-a456-426614174001"
 *                 peopleCount: 50
 *                 startTime: "2024-11-15T14:00:00.000Z"
 *                 endTime: "2024-11-15T20:00:00.000Z"
 *                 eventType: "Birthday Party"
 *     responses:
 *       201:
 *         description: Payment processed successfully and event created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProcessPaymentResponse'
 *       400:
 *         description: Payment failed or invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/ValidationError'
 *                 - $ref: '#/components/schemas/ProcessPaymentResponse'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 *       404:
 *         description: Venue or meal not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       409:
 *         description: Venue not available for selected time slot
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ConflictError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */
router.post('/process', authenticateToken, validateBody(processPaymentSchema), processPayment);

/**
 * @swagger
 * /api/v1/payments/status:
 *   post:
 *     tags:
 *       - Payments
 *     summary: Check payment status by transaction ID
 *     description: |
 *       Retrieve the current status of a payment using its transaction ID.
 *       This endpoint is useful for checking payment status after processing
 *       or for webhook verification purposes.
 *       
 *       **Payment Statuses:**
 *       - `pending`: Payment is being processed
 *       - `success`: Payment completed successfully
 *       - `failed`: Payment failed or was declined
 *       - `refunded`: Payment was successfully refunded
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentStatusRequest'
 *           examples:
 *             bkash_transaction:
 *               summary: Check bKash transaction status
 *               value:
 *                 transactionId: "BKS1703845200ABC123"
 *             card_transaction:
 *               summary: Check card transaction status
 *               value:
 *                 transactionId: "CARD1703845200XYZ789"
 *     responses:
 *       200:
 *         description: Payment status retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentStatusResponse'
 *       404:
 *         description: Payment not found with the provided transaction ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       400:
 *         description: Invalid transaction ID format
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */
router.post('/status', validateBody(paymentStatusSchema), getPaymentStatus);

/**
 * @swagger
 * /api/v1/payments/refund:
 *   post:
 *     tags:
 *       - Payments
 *     summary: Request payment refund
 *     description: |
 *       Request a refund for a successful payment. Only the user who made
 *       the original payment can request a refund.
 *       
 *       **Refund Requirements:**
 *       - Payment must have `success` status
 *       - User must own the payment (authenticated)
 *       - Refund reason must be provided (10-500 characters)
 *       - Payment cannot already be refunded
 *       
 *       **Refund Process:**
 *       1. Validates payment ownership and status
 *       2. Processes refund through payment provider
 *       3. Updates payment status to `refunded`
 *       4. Cancels associated event booking
 *       5. Returns refund confirmation details
 *       
 *       **Note:** Refunds typically take 3-5 business days to reflect in the original payment method.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RefundPaymentRequest'
 *           examples:
 *             event_cancellation:
 *               summary: Event cancelled by customer
 *               value:
 *                 paymentId: "123e4567-e89b-12d3-a456-426614174000"
 *                 reason: "Event cancelled due to weather conditions and venue unavailability"
 *             venue_issue:
 *               summary: Venue-related issue
 *               value:
 *                 paymentId: "123e4567-e89b-12d3-a456-426614174000"
 *                 reason: "Venue facilities not as described, requesting full refund"
 *     responses:
 *       200:
 *         description: Refund processed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RefundPaymentResponse'
 *       400:
 *         description: Invalid refund request or payment cannot be refunded
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - $ref: '#/components/schemas/ValidationError'
 *                 - $ref: '#/components/schemas/RefundPaymentResponse'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 *       403:
 *         description: Cannot refund payments that don't belong to you
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ForbiddenError'
 *       404:
 *         description: Payment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFoundError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */
router.post('/refund', authenticateToken, validateBody(refundPaymentSchema), refundPayment);

/**
 * @swagger
 * /api/v1/payments/history:
 *   get:
 *     tags:
 *       - Payments
 *     summary: Get user payment history
 *     description: |
 *       Retrieve paginated payment history for the authenticated user.
 *       Returns all payments made by the user with associated event details,
 *       venue information, and payment statistics.
 *       
 *       **Features:**
 *       - Paginated results with configurable page size
 *       - Filter by payment status
 *       - Includes event and venue details for each payment
 *       - Payment summary statistics (total amount, success rate, etc.)
 *       - Sorted by creation date (newest first)
 *       
 *       **Use Cases:**
 *       - User dashboard payment history
 *       - Financial tracking and reporting
 *       - Refund request management
 *       - Payment dispute resolution
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         description: Page number for pagination
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         example: 1
 *       - in: query
 *         name: limit
 *         description: Number of payments per page (max 100)
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         example: 20
 *       - in: query
 *         name: status
 *         description: Filter payments by status
 *         schema:
 *           type: string
 *           enum: [pending, success, failed, refunded]
 *         example: success
 *     responses:
 *       200:
 *         description: Payment history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentHistoryResponse'
 *       401:
 *         description: Authentication required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnauthorizedError'
 *       400:
 *         description: Invalid query parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InternalServerError'
 */
router.get('/history', authenticateToken, getPaymentHistory);

// /**
//  * @swagger
//  * /api/v1/payments/webhook:
//  *   post:
//  *     tags:
//  *       - Payments
//  *       - Webhooks
//  *     summary: Handle payment webhook notifications
//  *     description: |
//  *       **Internal API - Payment Provider Use Only**
//  *       
//  *       Receive real-time payment status updates from payment providers.
//  *       This endpoint is called by payment gateways to notify about
//  *       payment status changes.
//  *       
//  *       **Security:**
//  *       - Webhook signature verification required
//  *       - IP whitelisting recommended for production
//  *       - HTTPS only in production environment
//  *       
//  *       **Process:**
//  *       1. Verify webhook signature
//  *       2. Find payment by transaction ID
//  *       3. Update payment status if changed
//  *       4. Update associated event status
//  *       5. Log status change for audit trail
//  *       
//  *       **Note:** Always returns 200 status to prevent webhook retries,
//  *       even for application errors.
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/WebhookPayload'
//  *           examples:
//  *             successful_payment:
//  *               summary: Successful payment notification
//  *               value:
//  *                 transactionId: "BKS1703845200ABC123"
//  *                 status: "success"
//  *                 amount: 15750.50
//  *                 method: "bkash"
//  *                 timestamp: "2024-01-15T10:30:00Z"
//  *                 signature: "sha256=abc123def456..."
//  *             failed_payment:
//  *               summary: Failed payment notification
//  *               value:
//  *                 transactionId: "CARD1703845200XYZ789"
//  *                 status: "failed"
//  *                 amount: 12000.00
//  *                 method: "card"
//  *                 timestamp: "2024-01-15T10:35:00Z"
//  *                 signature: "sha256=def456ghi789..."
//  *     responses:
//  *       200:
//  *         description: Webhook processed successfully (or failed gracefully)
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/WebhookResponse'
//  *       401:
//  *         description: Invalid webhook signature
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/UnauthorizedError'
//  */
// router.post('/webhook', handlePaymentWebhook);

// /**
//  * @swagger
//  * /api/v1/payments/webhook/refund:
//  *   post:
//  *     tags:
//  *       - Payments
//  *       - Webhooks
//  *     summary: Handle refund webhook notifications
//  *     description: |
//  *       **Internal API - Payment Provider Use Only**
//  *       
//  *       Receive real-time refund status updates from payment providers.
//  *       This endpoint is called by payment gateways to notify about
//  *       refund processing results.
//  *       
//  *       **Security:**
//  *       - Webhook signature verification required
//  *       - IP whitelisting recommended for production
//  *       - HTTPS only in production environment
//  *       
//  *       **Process:**
//  *       1. Verify webhook signature
//  *       2. Find original payment by transaction ID
//  *       3. Update payment status to 'refunded' if successful
//  *       4. Cancel associated event booking
//  *       5. Log refund completion for audit trail
//  *       
//  *       **Refund Statuses:**
//  *       - `success`: Refund processed successfully
//  *       - `failed`: Refund processing failed
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             $ref: '#/components/schemas/RefundWebhookPayload'
//  *           examples:
//  *             successful_refund:
//  *               summary: Successful refund notification
//  *               value:
//  *                 transactionId: "REF1703845200ABC123"
//  *                 originalTransactionId: "BKS1703845200ABC123"
//  *                 status: "success"
//  *                 amount: 15750.50
//  *                 timestamp: "2024-01-15T12:30:00Z"
//  *                 signature: "sha256=refund123abc..."
//  *             failed_refund:
//  *               summary: Failed refund notification
//  *               value:
//  *                 transactionId: "REF1703845200XYZ789"
//  *                 originalTransactionId: "CARD1703845200XYZ789"
//  *                 status: "failed"
//  *                 amount: 12000.00
//  *                 timestamp: "2024-01-15T12:35:00Z"
//  *                 signature: "sha256=refund456def..."
//  *     responses:
//  *       200:
//  *         description: Refund webhook processed successfully (or failed gracefully)
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/WebhookResponse'
//  *       401:
//  *         description: Invalid webhook signature
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/UnauthorizedError'
//  */
// router.post('/webhook/refund', handleRefundWebhook);

export default router;
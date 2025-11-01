import { Router } from 'express';
import { 
  checkAvailability,
  createEvent,
  getUserEvents,
  getEventById
} from '../controllers/eventController';
import { validateBody } from '../../../middleware/validation';
import { authenticateToken } from '../../../middleware/auth';
import { checkAvailabilitySchema, createEventSchema } from '../../../schemas/event';

const router = Router();

/**
 * @route   POST /api/v1/events/check-availability
 * @desc    Check venue availability for event booking
 * @access  Public (but typically used by authenticated users)
 */
router.post('/check-availability', validateBody(checkAvailabilitySchema), checkAvailability);

/**
 * @route   GET /api/v1/events
 * @desc    Get user's events with pagination and filters
 * @access  Private (requires authentication)
 */
router.get('/', authenticateToken, getUserEvents);

/**
 * @route   POST /api/v1/events
 * @desc    Create a new event booking
 * @access  Private (requires authentication)
 */
router.post('/', authenticateToken, validateBody(createEventSchema), createEvent);

/**
 * @route   GET /api/v1/events/:id
 * @desc    Get event by ID
 * @access  Private (requires authentication)
 */
router.get('/:id', authenticateToken, getEventById);

export default router;
import { Router } from 'express';
import { 
  checkAvailability,
  createEvent,
  getUserEvents,
  getEventById,
  updateEvent
} from '../controllers/eventController';
import { validateBody } from '../../../middleware/validation';
import { authenticateToken } from '../../../middleware/auth';
import { checkAvailabilitySchema, createEventSchema, updateEventSchema } from '../../../schemas/event';

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

/**
 * @route   PUT /api/v1/events/:id
 * @desc    Update event (people count and meal only)
 * @access  Private (requires authentication)
 */
router.put('/:id', authenticateToken, validateBody(updateEventSchema), updateEvent);

export default router;
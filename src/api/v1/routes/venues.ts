import { Router } from 'express';
import { 
  createVenue, 
  getVenueById, 
  updateVenue, 
  deleteVenue, 
  getVenues 
} from '../controllers/venueController';
import { validateBody, validateQuery } from '../../../middleware/validation';
import { createVenueSchema, updateVenueSchema, venueQuerySchema } from '../../../schemas/venue';

const router = Router();

/**
 * @route   GET /api/v1/venues
 * @desc    Get venues with pagination and filters
 * @access  Public
 */   
router.get('/', getVenues);

/**
 * @route   POST /api/v1/venues
 * @desc    Create a new venue
 * @access  Admin only
 */
router.post('/', validateBody(createVenueSchema), createVenue);

/**
 * @route   GET /api/v1/venues/:id
 * @desc    Get venue by ID
 * @access  Public
 */
router.get('/:id', getVenueById);

/**
 * @route   PUT /api/v1/venues/:id
 * @desc    Update venue by ID
 * @access  Admin only
 */
router.put('/:id', validateBody(updateVenueSchema), updateVenue);

/**
 * @route   DELETE /api/v1/venues/:id
 * @desc    Delete venue by ID
 * @access  Admin only
 */
router.delete('/:id', deleteVenue);

export default router;
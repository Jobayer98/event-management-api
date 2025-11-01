import { Router } from 'express';
import { registerOrganizer, loginOrganizer, debugAdminStatus } from '../controllers/organizerController';
import { validateBody } from '../../../middleware/validation';
import { registerOrganizerSchema, loginOrganizerSchema } from '../../../schemas/auth';

const router = Router();

/**
 * @route   POST /api/v1/organizer/register
 * @desc    Register a new organizer
 * @access  Public
 */
router.post('/register', validateBody(registerOrganizerSchema), registerOrganizer);

/**
 * @route   POST /api/v1/organizer/login
 * @desc    Login organizer
 * @access  Public
 */
router.post('/login', validateBody(loginOrganizerSchema), loginOrganizer);

/**
 * @route   GET /api/v1/organizer/debug/admin
 * @desc    Debug endpoint to check admin status
 * @access  Public (for debugging only)
 */
router.get('/debug/admin', debugAdminStatus);

export default router;
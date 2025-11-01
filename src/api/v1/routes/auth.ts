import { Router } from 'express';
import { registerUser } from '../controllers/authController';
import { validateBody } from '../../../middleware/validation';
import { registerUserSchema } from '../../../schemas/auth';

const router = Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validateBody(registerUserSchema), registerUser);

export default router;
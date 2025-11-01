import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController';
import { validateBody } from '../../../middleware/validation';
import { registerUserSchema, loginUserSchema } from '../../../schemas/auth';

const router = Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', validateBody(registerUserSchema), registerUser);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post('/login', validateBody(loginUserSchema), loginUser);

export default router;
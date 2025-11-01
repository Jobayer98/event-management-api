import { Router } from 'express';
import { registerUser, loginUser, requestPasswordReset, confirmPasswordReset } from '../controllers/authController';
import { validateBody } from '../../../middleware/validation';
import { registerUserSchema, loginUserSchema, resetPasswordRequestSchema, resetPasswordConfirmSchema } from '../../../schemas/auth';

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

/**
 * @route   POST /api/v1/auth/reset
 * @desc    Request password reset
 * @access  Public
 */
router.post('/reset', validateBody(resetPasswordRequestSchema), requestPasswordReset);

/**
 * @route   PUT /api/v1/auth/reset
 * @desc    Confirm password reset with token
 * @access  Public
 */
router.put('/reset', validateBody(resetPasswordConfirmSchema), confirmPasswordReset);

export default router;
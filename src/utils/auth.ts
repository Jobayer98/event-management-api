import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import logger from '../config/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const RESET_TOKEN_SECRET = process.env.RESET_TOKEN_SECRET || 'your-reset-token-secret-change-in-production';
const BCRYPT_ROUNDS = 12;

/**
 * Hash a password using bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  try {
    const salt = await bcrypt.genSalt(BCRYPT_ROUNDS);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    logger.error('Error hashing password:', error);
    throw new Error('Failed to hash password');
  }
};

/**
 * Compare a password with its hash
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    logger.error('Error comparing password:', error);
    throw new Error('Failed to compare password');
  }
};

/**
 * Generate a JWT token
 */
export const generateToken = (payload: { userId: string; email: string; role?: string }): string => {
  try {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  } catch (error) {
    logger.error('Error generating JWT token:', error);
    throw new Error('Failed to generate token');
  }
};

/**
 * Verify a JWT token
 */
export const verifyToken = (token: string): { userId: string; email: string; role?: string } => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role?: string };
    
    return decoded;
  } catch (error) {
    logger.error('Error verifying JWT token:', error);
    throw new Error('Invalid or expired token');
  }
};

/**
 * Generate a password reset token
 */
export const generateResetToken = (payload: { userId: string; email: string }): string => {
  try {
    return jwt.sign(payload, RESET_TOKEN_SECRET, { expiresIn: '1h' });
  } catch (error) {
    logger.error('Error generating reset token:', error);
    throw new Error('Failed to generate reset token');
  }
};

/**
 * Verify a password reset token
 */
export const verifyResetToken = (token: string): { userId: string; email: string } => {
  try {
    const decoded = jwt.verify(token, RESET_TOKEN_SECRET) as { userId: string; email: string };

    return decoded;
  } catch (error) {
    logger.error('Error verifying reset token:', error);
    throw new Error('Invalid or expired reset token');
  }
};

/**
 * Generate a secure random token (alternative to JWT for reset tokens)
 */
export const generateSecureToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};
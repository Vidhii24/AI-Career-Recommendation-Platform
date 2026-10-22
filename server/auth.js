import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'careercompass-jwt-secret-key-2026-secure-token';
const JWT_EXPIRES_IN = '7d';

/**
 * Validate email format with standard regex
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validate password strength:
 * - At least 6 characters
 * - Contains at least one letter and one number
 */
export function validatePasswordStrength(password) {
  if (!password || typeof password !== 'string') {
    return { valid: false, message: 'Password is required' };
  }
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters long' };
  }
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  if (!hasLetter || !hasNumber) {
    return { valid: false, message: 'Password must contain at least one letter and one number' };
  }
  return { valid: true };
}

/**
 * Hash a plain password using bcrypt with salt rounds = 10
 */
export async function hashPassword(plainPassword) {
  return await bcrypt.hash(plainPassword, 10);
}

/**
 * Verify a plain password against stored bcrypt hash
 */
export async function verifyPassword(plainPassword, passwordHash) {
  return await bcrypt.compare(plainPassword, passwordHash);
}

/**
 * Generate a JWT token for authenticated user
 */
export function generateToken(user) {
  const payload = {
    userId: user.id,
    email: user.email,
    name: user.name
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Express middleware to authenticate JWT token from Authorization header
 */
export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required. Missing Authorization header.'
    });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      success: false,
      error: 'Invalid Authorization header format. Expected "Bearer <token>".'
    });
  }

  const token = parts[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired session token. Please log in again.'
      });
    }
    req.user = decoded;
    next();
  });
}

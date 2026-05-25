import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';
import { AppError } from './errorHandler.js';
import User from '../models/User.js';
import Property from '../models/Property.js';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

/**
 * Protect routes — verify JWT from Authorization header or cookie
 */
export const protect = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  let token: string | undefined;

  // Check Authorization header
  if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new AppError('Not authorized — no token provided', 401);
  }

  try {
    const decoded = verifyAccessToken(token);

    // Verify user still exists
    const user = await User.findById(decoded.id).select('_id role');
    if (!user) {
      throw new AppError('User no longer exists', 401);
    }

    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Not authorized — invalid token', 401);
  }
};

/**
 * Require a specific role
 */
export const requireRole = (...roles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError('Not authorized', 401);
    }

    if (!roles.includes(req.user.role)) {
      throw new AppError('You do not have permission to perform this action', 403);
    }

    next();
  };
};

/**
 * Check if the current user owns the property
 */
export const isOwner = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    throw new AppError('Property not found', 404);
  }

  if (property.agent.toString() !== req.user?.id) {
    throw new AppError('You are not the owner of this property', 403);
  }

  next();
};

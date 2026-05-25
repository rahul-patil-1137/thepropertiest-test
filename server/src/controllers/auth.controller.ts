import { Request, Response } from 'express';
import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.js';
import { sendResponse } from '../utils/response.js';
import { AppError } from '../middleware/errorHandler.js';
import { env } from '../config/env.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
};

/**
 * POST /api/v1/auth/register
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, phone, role } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email already registered', 400);
  }

  const user = await User.create({ name, email, password, phone, role });

  // Generate tokens
  const accessToken = generateAccessToken({ id: user._id.toString(), role: user.role });
  const refreshToken = generateRefreshToken({ id: user._id.toString(), role: user.role });

  // Save refresh token
  user.refreshToken = refreshToken;
  await user.save();

  // Set refresh token cookie
  res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);

  sendResponse(res, 201, 'Registration successful', {
    user: user.toJSON(),
    accessToken,
  });
};

/**
 * POST /api/v1/auth/login
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  // Generate tokens
  const accessToken = generateAccessToken({ id: user._id.toString(), role: user.role });
  const refreshToken = generateRefreshToken({ id: user._id.toString(), role: user.role });

  // Save refresh token
  user.refreshToken = refreshToken;
  await user.save();

  // Set refresh token cookie
  res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);

  sendResponse(res, 200, 'Login successful', {
    user: user.toJSON(),
    accessToken,
  });
};

/**
 * GET /api/v1/auth/me
 */
export const getMe = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(req.user?.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  sendResponse(res, 200, 'User profile retrieved', { user });
};

/**
 * PUT /api/v1/auth/me
 */
export const updateMe = async (req: Request, res: Response): Promise<void> => {
  const { name, phone } = req.body;
  let avatar = req.body.avatar;

  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, 'propertist/avatars');
    avatar = result.secure_url;
  } else if (req.body.avatar === '') {
    avatar = '';
  }

  const user = await User.findByIdAndUpdate(
    req.user?.id,
    { name, phone, ...(avatar && { avatar }) },
    { new: true, runValidators: true }
  );

  if (!user) {
    throw new AppError('User not found', 404);
  }

  sendResponse(res, 200, 'Profile updated successfully', { user });
};

/**
 * POST /api/v1/auth/logout
 */
export const logout = async (req: Request, res: Response): Promise<void> => {
  // Clear refresh token from DB
  await User.findByIdAndUpdate(req.user?.id, { refreshToken: undefined });

  // Clear refresh token cookie
  res.clearCookie('refreshToken', { path: '/' });

  sendResponse(res, 200, 'Logged out successfully');
};

/**
 * POST /api/v1/auth/refresh
 */
export const refreshAccessToken = async (req: Request, res: Response): Promise<void> => {
  const token = req.cookies?.refreshToken;

  if (!token) {
    throw new AppError('No refresh token provided', 401);
  }

  try {
    const decoded = verifyRefreshToken(token);

    // Verify refresh token matches what's stored
    const user = await User.findById(decoded.id).select('+refreshToken');
    if (!user || user.refreshToken !== token) {
      throw new AppError('Invalid refresh token', 401);
    }

    // Generate new tokens
    const accessToken = generateAccessToken({ id: user._id.toString(), role: user.role });
    const refreshToken = generateRefreshToken({ id: user._id.toString(), role: user.role });

    // Rotate refresh token
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie('refreshToken', refreshToken, REFRESH_COOKIE_OPTIONS);

    sendResponse(res, 200, 'Token refreshed', { accessToken });
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError('Invalid refresh token', 401);
  }
};

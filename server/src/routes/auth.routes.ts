import { Router } from 'express';
import {
  register,
  login,
  getMe,
  updateMe,
  logout,
  refreshAccessToken,
} from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { upload } from '../middleware/upload.js';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
} from '../validators/auth.validator.js';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/refresh', refreshAccessToken);
router.get('/me', protect, getMe);
router.put('/me', protect, upload.single('avatar'), validate(updateProfileSchema), updateMe);
router.post('/logout', protect, logout);

export default router;

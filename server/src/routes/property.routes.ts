import { Router } from 'express';
import {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getMyListings,
} from '../controllers/property.controller.js';
import { protect, requireRole, isOwner } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
import { validate } from '../middleware/validate.js';
import {
  createPropertySchema,
  updatePropertySchema,
  queryPropertySchema,
} from '../validators/property.validator.js';

const router = Router();

// Public routes
router.get('/', validate(queryPropertySchema), getProperties);
router.get('/agent/my-listings', protect, requireRole('agent'), getMyListings);
router.get('/:id', getProperty);

// Agent-protected routes
router.post(
  '/',
  protect,
  requireRole('agent'),
  upload.array('images', 5),
  validate(createPropertySchema),
  createProperty
);

router.put(
  '/:id',
  protect,
  requireRole('agent'),
  isOwner,
  upload.array('images', 5),
  validate(updatePropertySchema),
  updateProperty
);

router.delete(
  '/:id',
  protect,
  requireRole('agent'),
  isOwner,
  deleteProperty
);

export default router;

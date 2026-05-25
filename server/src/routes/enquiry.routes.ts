import { Router } from 'express';
import {
  createEnquiry,
  getMyEnquiries,
  updateEnquiryStatus,
} from '../controllers/enquiry.controller.js';
import { protect, requireRole } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import {
  createEnquirySchema,
  updateEnquiryStatusSchema,
} from '../validators/enquiry.validator.js';

const router = Router();

// Public — create enquiry
router.post('/', validate(createEnquirySchema), createEnquiry);

// Agent — get enquiries for my properties
router.get('/my', protect, requireRole('agent'), getMyEnquiries);

// Agent — update enquiry status
router.put(
  '/:id/status',
  protect,
  requireRole('agent'),
  validate(updateEnquiryStatusSchema),
  updateEnquiryStatus
);

export default router;

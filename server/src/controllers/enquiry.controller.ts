import { Request, Response } from 'express';
import Enquiry from '../models/Enquiry.js';
import Property from '../models/Property.js';
import { sendResponse } from '../utils/response.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * POST /api/v1/enquiries
 * Public — create enquiry for a property
 */
export const createEnquiry = async (req: Request, res: Response): Promise<void> => {
  const { property, name, email, phone, message } = req.body;

  // Verify property exists and is active
  const propertyDoc = await Property.findOne({ _id: property, isActive: true });
  if (!propertyDoc) {
    throw new AppError('Property not found or is no longer active', 404);
  }

  const enquiry = await Enquiry.create({
    property,
    seeker: req.user?.id || undefined,
    name,
    email,
    phone,
    message,
  });

  await enquiry.populate('property', 'title location.city price');

  sendResponse(res, 201, 'Enquiry submitted successfully', enquiry);
};

/**
 * GET /api/v1/enquiries/my
 * Agent only — get enquiries for agent's properties
 */
export const getMyEnquiries = async (req: Request, res: Response): Promise<void> => {
  const { page = 1, limit = 20, status } = req.query;
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  // Find all properties owned by the agent
  const agentProperties = await Property.find({ agent: req.user?.id }).select('_id');
  const propertyIds = agentProperties.map((p) => p._id);

  // Build filter
  const filter: Record<string, unknown> = { property: { $in: propertyIds } };
  if (status) {
    filter.status = status;
  }

  const [enquiries, total] = await Promise.all([
    Enquiry.find(filter)
      .populate('property', 'title location.city price images')
      .populate('seeker', 'name email phone')
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Enquiry.countDocuments(filter),
  ]);

  sendResponse(res, 200, 'Enquiries retrieved', enquiries, {
    page: pageNum,
    limit: limitNum,
    total,
    pages: Math.ceil(total / limitNum),
  });
};

/**
 * PUT /api/v1/enquiries/:id/status
 * Agent only — update enquiry status
 */
export const updateEnquiryStatus = async (req: Request, res: Response): Promise<void> => {
  const { status } = req.body;

  const enquiry = await Enquiry.findById(req.params.id).populate('property', 'agent');
  if (!enquiry) {
    throw new AppError('Enquiry not found', 404);
  }

  // Verify the agent owns the property this enquiry is for
  const propertyDoc = enquiry.property as unknown as { agent: { toString(): string } };
  if (propertyDoc.agent.toString() !== req.user?.id) {
    throw new AppError('You are not authorized to update this enquiry', 403);
  }

  enquiry.status = status;
  await enquiry.save();

  sendResponse(res, 200, 'Enquiry status updated', enquiry);
};

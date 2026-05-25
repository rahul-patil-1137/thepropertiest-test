import { Request, Response } from 'express';
import Property from '../models/Property.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';
import { sendResponse } from '../utils/response.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * GET /api/v1/properties
 * Public — list properties with filters & pagination
 */
export const getProperties = async (req: Request, res: Response): Promise<void> => {
  const {
    city,
    bhk,
    minPrice,
    maxPrice,
    type,
    status,
    page = 1,
    limit = 12,
    sort = '-createdAt',
  } = req.query;

  // Build filter
  const filter: Record<string, unknown> = { isActive: true };

  if (city) {
    filter['location.city'] = { $regex: city as string, $options: 'i' };
  }
  if (bhk) {
    filter.bhk = Number(bhk);
  }
  if (type) {
    filter.type = type;
  }
  if (status) {
    filter.status = status;
  }
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) (filter.price as Record<string, number>).$gte = Number(minPrice);
    if (maxPrice) (filter.price as Record<string, number>).$lte = Number(maxPrice);
  }

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const [properties, total] = await Promise.all([
    Property.find(filter)
      .populate('agent', 'name email phone avatar')
      .sort(sort as string)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Property.countDocuments(filter),
  ]);

  sendResponse(res, 200, 'Properties retrieved', properties, {
    page: pageNum,
    limit: limitNum,
    total,
    pages: Math.ceil(total / limitNum),
  });
};

/**
 * GET /api/v1/properties/:id
 * Public — get single property
 */
export const getProperty = async (req: Request, res: Response): Promise<void> => {
  const property = await Property.findOne({
    _id: req.params.id,
    isActive: true,
  }).populate('agent', 'name email phone avatar');

  if (!property) {
    throw new AppError('Property not found', 404);
  }

  sendResponse(res, 200, 'Property retrieved', property);
};

/**
 * POST /api/v1/properties
 * Agent only — create property with images
 */
export const createProperty = async (req: Request, res: Response): Promise<void> => {
  const {
    title, description, type, status, bhk, price,
    address, city, state, pincode, lat, lng,
    amenities, area, furnished,
  } = req.body;

  // Upload images to Cloudinary
  const images: string[] = [];
  if (req.files && Array.isArray(req.files)) {
    for (const file of req.files) {
      const result = await uploadToCloudinary(file.buffer, 'propertist/properties');
      images.push(result.secure_url);
    }
  }

  // Parse amenities (comma-separated string or array)
  let parsedAmenities: string[] = [];
  if (amenities) {
    parsedAmenities = typeof amenities === 'string'
      ? amenities.split(',').map((a: string) => a.trim()).filter(Boolean)
      : amenities;
  }

  const property = await Property.create({
    agent: req.user?.id,
    title,
    description,
    type,
    status,
    bhk: Number(bhk),
    price: Number(price),
    location: {
      address,
      city,
      state,
      pincode,
      ...(lat && lng ? { coordinates: { lat: Number(lat), lng: Number(lng) } } : {}),
    },
    images,
    amenities: parsedAmenities,
    area: area ? Number(area) : undefined,
    furnished: furnished || 'unfurnished',
  });

  await property.populate('agent', 'name email phone avatar');

  sendResponse(res, 201, 'Property created successfully', property);
};

/**
 * PUT /api/v1/properties/:id
 * Agent + Owner — update property
 */
export const updateProperty = async (req: Request, res: Response): Promise<void> => {
  const {
    title, description, type, status, bhk, price,
    address, city, state, pincode, lat, lng,
    amenities, area, furnished,
  } = req.body;

  const property = await Property.findById(req.params.id);
  if (!property) {
    throw new AppError('Property not found', 404);
  }

  // Upload new images if provided
  if (req.files && Array.isArray(req.files) && req.files.length > 0) {
    const newImages: string[] = [];
    for (const file of req.files) {
      const result = await uploadToCloudinary(file.buffer, 'propertist/properties');
      newImages.push(result.secure_url);
    }
    // Append new images (respect max 5)
    property.images = [...property.images, ...newImages].slice(0, 5);
  }

  // Update fields
  if (title) property.title = title;
  if (description) property.description = description;
  if (type) property.type = type;
  if (status) property.status = status;
  if (bhk) property.bhk = Number(bhk);
  if (price) property.price = Number(price);
  if (address) property.location.address = address;
  if (city) property.location.city = city;
  if (state) property.location.state = state;
  if (pincode) property.location.pincode = pincode;
  if (lat && lng) {
    property.location.coordinates = { lat: Number(lat), lng: Number(lng) };
  }
  if (amenities) {
    property.amenities = typeof amenities === 'string'
      ? amenities.split(',').map((a: string) => a.trim()).filter(Boolean)
      : amenities;
  }
  if (area) property.area = Number(area);
  if (furnished) property.furnished = furnished;

  await property.save();
  await property.populate('agent', 'name email phone avatar');

  sendResponse(res, 200, 'Property updated successfully', property);
};

/**
 * DELETE /api/v1/properties/:id
 * Agent + Owner — soft delete
 */
export const deleteProperty = async (req: Request, res: Response): Promise<void> => {
  const property = await Property.findById(req.params.id);
  if (!property) {
    throw new AppError('Property not found', 404);
  }

  property.isActive = false;
  await property.save();

  sendResponse(res, 200, 'Property deleted successfully');
};

/**
 * GET /api/v1/properties/agent/my-listings
 * Agent only — get own listings
 */
export const getMyListings = async (req: Request, res: Response): Promise<void> => {
  const { page = 1, limit = 12 } = req.query;
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const filter = { agent: req.user?.id };

  const [properties, total] = await Promise.all([
    Property.find(filter)
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Property.countDocuments(filter),
  ]);

  sendResponse(res, 200, 'My listings retrieved', properties, {
    page: pageNum,
    limit: limitNum,
    total,
    pages: Math.ceil(total / limitNum),
  });
};

import { z } from 'zod';

export const createPropertySchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: 'Title is required' })
      .min(1, 'Title is required')
      .max(200, 'Title cannot exceed 200 characters'),
    description: z
      .string({ required_error: 'Description is required' })
      .min(1, 'Description is required')
      .max(5000, 'Description cannot exceed 5000 characters'),
    type: z.enum(['apartment', 'house', 'villa', 'plot', 'commercial'], {
      required_error: 'Property type is required',
    }),
    status: z.enum(['sale', 'rent'], {
      required_error: 'Status is required',
    }),
    bhk: z.coerce
      .number({ required_error: 'BHK is required' })
      .int()
      .min(1, 'BHK must be at least 1')
      .max(10, 'BHK cannot exceed 10'),
    price: z.coerce
      .number({ required_error: 'Price is required' })
      .positive('Price must be positive'),
    address: z.string({ required_error: 'Address is required' }).min(1),
    city: z.string({ required_error: 'City is required' }).min(1),
    state: z.string({ required_error: 'State is required' }).min(1),
    pincode: z.string({ required_error: 'Pincode is required' }).min(1),
    lat: z.coerce.number().optional(),
    lng: z.coerce.number().optional(),
    amenities: z.union([z.string(), z.array(z.string())]).optional(),
    area: z.coerce.number().positive().optional(),
    furnished: z.enum(['furnished', 'semi-furnished', 'unfurnished']).optional(),
  }),
});

export const updatePropertySchema = z.object({
  body: z.object({
    title: z.string().max(200).optional(),
    description: z.string().max(5000).optional(),
    type: z.enum(['apartment', 'house', 'villa', 'plot', 'commercial']).optional(),
    status: z.enum(['sale', 'rent']).optional(),
    bhk: z.coerce.number().int().min(1).max(10).optional(),
    price: z.coerce.number().positive().optional(),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z.string().optional(),
    lat: z.coerce.number().optional(),
    lng: z.coerce.number().optional(),
    amenities: z.union([z.string(), z.array(z.string())]).optional(),
    area: z.coerce.number().positive().optional(),
    furnished: z.enum(['furnished', 'semi-furnished', 'unfurnished']).optional(),
  }),
  params: z.object({
    id: z.string().min(1),
  }),
});

export const queryPropertySchema = z.object({
  query: z.object({
    city: z.string().optional(),
    bhk: z.coerce.number().int().min(1).max(10).optional(),
    minPrice: z.coerce.number().positive().optional(),
    maxPrice: z.coerce.number().positive().optional(),
    type: z.enum(['apartment', 'house', 'villa', 'plot', 'commercial']).optional(),
    status: z.enum(['sale', 'rent']).optional(),
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().max(100).optional(),
    sort: z.string().optional(),
  }),
});

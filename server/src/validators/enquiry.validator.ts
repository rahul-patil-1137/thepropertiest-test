import { z } from 'zod';

export const createEnquirySchema = z.object({
  body: z.object({
    property: z.string({ required_error: 'Property ID is required' }).min(1),
    name: z
      .string({ required_error: 'Name is required' })
      .min(1, 'Name is required')
      .max(100, 'Name cannot exceed 100 characters'),
    email: z
      .string({ required_error: 'Email is required' })
      .email('Please provide a valid email'),
    phone: z
      .string({ required_error: 'Phone is required' })
      .min(1, 'Phone is required'),
    message: z
      .string({ required_error: 'Message is required' })
      .min(1, 'Message is required')
      .max(2000, 'Message cannot exceed 2000 characters'),
  }),
});

export const updateEnquiryStatusSchema = z.object({
  body: z.object({
    status: z.enum(['new', 'contacted', 'closed'], {
      required_error: 'Status is required',
      invalid_type_error: 'Status must be new, contacted, or closed',
    }),
  }),
  params: z.object({
    id: z.string().min(1),
  }),
});

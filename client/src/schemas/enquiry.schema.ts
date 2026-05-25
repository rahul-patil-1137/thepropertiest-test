import { z } from "zod";

export const enquirySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(1, "Phone is required"),
  message: z.string().min(1, "Message is required").max(2000),
});

export type EnquiryFormData = z.infer<typeof enquirySchema>;

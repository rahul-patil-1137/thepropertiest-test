import { z } from "zod";

export const propertySchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required").max(5000),
  type: z.enum(["apartment", "house", "villa", "plot", "commercial"], {
    required_error: "Property type is required",
  }),
  status: z.enum(["sale", "rent"], {
    required_error: "Status is required",
  }),
  bhk: z.coerce.number().int().min(1, "BHK must be at least 1").max(10),
  price: z.coerce.number().positive("Price must be positive"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().min(1, "Pincode is required"),
  area: z.coerce.number().positive().optional().or(z.literal("")),
  furnished: z.enum(["furnished", "semi-furnished", "unfurnished"]).optional(),
  amenities: z.string().optional(),
});

export type PropertyFormData = z.infer<typeof propertySchema>;

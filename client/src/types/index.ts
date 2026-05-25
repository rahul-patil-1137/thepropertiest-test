export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: "agent" | "seeker";
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LocationObj {
  address: string;
  city: string;
  state: string;
  pincode: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Property {
  _id: string;
  agent: User | string;
  title: string;
  description: string;
  type: "apartment" | "house" | "villa" | "plot" | "commercial";
  status: "sale" | "rent";
  bhk: number;
  price: number;
  location: LocationObj;
  images: string[];
  amenities: string[];
  area?: number;
  furnished: "furnished" | "semi-furnished" | "unfurnished";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Enquiry {
  _id: string;
  property: Property | string;
  seeker?: User | string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: "new" | "contacted" | "closed";
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  pagination?: PaginationMeta;
}

export interface PropertyFilters {
  city?: string;
  bhk?: string;
  minPrice?: string;
  maxPrice?: string;
  type?: string;
  status?: string;
  page?: string;
  limit?: string;
  sort?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: "agent" | "seeker";
}

export interface EnquiryPayload {
  property: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}

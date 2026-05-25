import mongoose, { Schema, Document } from 'mongoose';

export interface ILocation {
  address: string;
  city: string;
  state: string;
  pincode: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface IProperty extends Document {
  _id: mongoose.Types.ObjectId;
  agent: mongoose.Types.ObjectId;
  title: string;
  description: string;
  type: 'apartment' | 'house' | 'villa' | 'plot' | 'commercial';
  status: 'sale' | 'rent';
  bhk: number;
  price: number;
  location: ILocation;
  images: string[];
  amenities: string[];
  area: number;
  furnished: 'furnished' | 'semi-furnished' | 'unfurnished';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const propertySchema = new Schema<IProperty>(
  {
    agent: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Agent is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    type: {
      type: String,
      required: [true, 'Property type is required'],
      enum: {
        values: ['apartment', 'house', 'villa', 'plot', 'commercial'],
        message: 'Type must be apartment, house, villa, plot, or commercial',
      },
      index: true,
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: {
        values: ['sale', 'rent'],
        message: 'Status must be sale or rent',
      },
      index: true,
    },
    bhk: {
      type: Number,
      required: [true, 'BHK is required'],
      min: [1, 'BHK must be at least 1'],
      max: [10, 'BHK cannot exceed 10'],
      index: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price must be positive'],
      index: true,
    },
    location: {
      address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true,
      },
      city: {
        type: String,
        required: [true, 'City is required'],
        trim: true,
        index: true,
      },
      state: {
        type: String,
        required: [true, 'State is required'],
        trim: true,
      },
      pincode: {
        type: String,
        required: [true, 'Pincode is required'],
        trim: true,
      },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    images: {
      type: [String],
      validate: {
        validator: function (v: string[]) {
          return v.length <= 5;
        },
        message: 'Maximum 5 images allowed',
      },
      default: [],
    },
    amenities: {
      type: [String],
      default: [],
    },
    area: {
      type: Number,
      min: [0, 'Area must be positive'],
    },
    furnished: {
      type: String,
      enum: {
        values: ['furnished', 'semi-furnished', 'unfurnished'],
        message: 'Furnished must be furnished, semi-furnished, or unfurnished',
      },
      default: 'unfurnished',
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for common query patterns
propertySchema.index({ isActive: 1, 'location.city': 1, price: 1 });
propertySchema.index({ isActive: 1, type: 1, status: 1 });

// Remove __v from JSON output
propertySchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Property = mongoose.model<IProperty>('Property', propertySchema);
export default Property;

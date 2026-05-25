import mongoose, { Schema, Document } from 'mongoose';

export interface IEnquiry extends Document {
  _id: mongoose.Types.ObjectId;
  property: mongoose.Types.ObjectId;
  seeker?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'new' | 'contacted' | 'closed';
  createdAt: Date;
  updatedAt: Date;
}

const enquirySchema = new Schema<IEnquiry>(
  {
    property: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Property is required'],
      index: true,
    },
    seeker: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: {
        values: ['new', 'contacted', 'closed'],
        message: 'Status must be new, contacted, or closed',
      },
      default: 'new',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Remove __v from JSON output
enquirySchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete (ret as any).__v;
    return ret;
  },
});

const Enquiry = mongoose.model<IEnquiry>('Enquiry', enquirySchema);
export default Enquiry;

import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  category: 'eyeglasses' | 'sunglasses' | 'computer-glasses';
  price: number;
  originalPrice?: number;
  description: string;
  features: string[];
  frameShape: string;
  frameMaterial: string;
  frameWidth: string;
  colors: { name: string; hex: string }[];
  images: string[];
  weight: string;
  bestSeller: boolean;
  inStock: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: { 
      type: String, 
      required: true, 
      enum: ['eyeglasses', 'sunglasses', 'computer-glasses'] 
    },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    description: { type: String, required: true },
    features: [{ type: String }],
    frameShape: { type: String, required: true },
    frameMaterial: { type: String, required: true },
    frameWidth: { type: String, required: true },
    colors: [
      {
        name: { type: String, required: true },
        hex: { type: String, required: true }
      }
    ],
    images: [{ type: String }],
    weight: { type: String, required: true },
    bestSeller: { type: Boolean, default: false },
    inStock: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

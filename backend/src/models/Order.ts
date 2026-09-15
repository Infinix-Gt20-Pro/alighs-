import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  color: string;
  colorHex: string;
}

export interface IOrder extends Document {
  orderId: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    pincode: string;
  };
  items: IOrderItem[];
  totalAmount: number;
  paymentMethod: 'COD' | 'UPI' | 'ONLINE';
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  status: 'Pending' | 'Confirmed' | 'Dispatched' | 'Delivered' | 'Cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    orderId: { type: String, required: true, unique: true },
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String },
      address: { type: String, required: true },
      city: { type: String, required: true },
      pincode: { type: String, required: true }
    },
    items: [
      {
        productId: { type: String, required: true },
        slug: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        color: { type: String, required: true },
        colorHex: { type: String, required: true }
      }
    ],
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, required: true, enum: ['COD', 'UPI', 'ONLINE'] },
    paymentStatus: { type: String, default: 'Pending', enum: ['Pending', 'Paid', 'Failed'] },
    status: { 
      type: String, 
      default: 'Pending', 
      enum: ['Pending', 'Confirmed', 'Dispatched', 'Delivered', 'Cancelled'] 
    }
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

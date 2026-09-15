import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrder extends Document {
  orderId: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
    city: string;
    address: string;
    pincode: string;
  };
  items: {
    productId: string;
    name: string;
    color: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  paymentMethod: "cod" | "online" | "upi";
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "placed" | "confirmed" | "shipped" | "delivered";
  whatsappSent: boolean;
  notes?: string;
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String },
      city: { type: String, required: true },
      address: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        color: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
      },
    ],
    totalAmount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["cod", "online", "upi"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    orderStatus: {
      type: String,
      enum: ["placed", "confirmed", "shipped", "delivered"],
      default: "placed",
    },
    whatsappSent: { type: Boolean, default: false },
    notes: { type: String },
  },
  { timestamps: true }
);

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;

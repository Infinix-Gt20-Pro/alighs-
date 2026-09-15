import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAppointment extends Document {
  appointmentId: string;
  name: string;
  phone: string;
  preferredDate: Date;
  preferredTime: string;
  concern: "eye-checkup" | "power-change" | "frame-fitting" | "lens-consultation" | "other";
  concernDetails?: string;
  whatsappConfirm: boolean;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: Date;
}

const AppointmentSchema = new Schema<IAppointment>(
  {
    appointmentId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    preferredDate: { type: Date, required: true },
    preferredTime: { type: String, required: true },
    concern: {
      type: String,
      enum: ["eye-checkup", "power-change", "frame-fitting", "lens-consultation", "other"],
      required: true,
    },
    concernDetails: { type: String },
    whatsappConfirm: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Appointment: Model<IAppointment> =
  mongoose.models.Appointment ||
  mongoose.model<IAppointment>("Appointment", AppointmentSchema);

export default Appointment;

import mongoose, { Schema, Document } from 'mongoose';

export interface IAppointment extends Document {
  appointmentId: string;
  name: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  concern: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const AppointmentSchema: Schema = new Schema(
  {
    appointmentId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    preferredDate: { type: String, required: true },
    preferredTime: { type: String, required: true },
    concern: { type: String, required: true },
    status: { type: String, default: 'Scheduled', enum: ['Scheduled', 'Completed', 'Cancelled'] }
  },
  { timestamps: true }
);

export default mongoose.models.Appointment || mongoose.model<IAppointment>('Appointment', AppointmentSchema);

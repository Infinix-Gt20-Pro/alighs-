import { Request, Response } from 'express';
import Appointment from '../models/Appointment';

function generateAppointmentId(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  return `APT-${date}-${randomSuffix}`;
}

export async function bookAppointment(req: Request, res: Response) {
  try {
    const { name, phone, preferredDate, preferredTime, concern } = req.body;
    if (!name || !phone || !preferredDate || !preferredTime || !concern) {
      return res.status(400).json({ error: 'Missing required appointment fields' });
    }

    const appointmentId = generateAppointmentId();
    const appointment = new Appointment({
      appointmentId,
      name,
      phone,
      preferredDate,
      preferredTime,
      concern,
      status: 'Scheduled'
    });

    const saved = await appointment.save();
    res.status(201).json(saved);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    res.status(500).json({ error: message });
  }
}

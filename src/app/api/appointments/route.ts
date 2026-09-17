import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Appointment from '@/lib/models/Appointment';

function generateAppointmentId() {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `APT-${yyyy}${mm}${dd}-${suffix}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const preferredDate = body.preferredDate || body.date;
    const preferredTime = body.preferredTime || body.time;
    
    if (!body.name || !body.phone || !preferredDate || !preferredTime || !body.concern) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const appointmentId = generateAppointmentId();

    try {
      await connectDB();
      const newAppointment = new Appointment({
        appointmentId,
        name: body.name,
        phone: body.phone,
        preferredDate,
        preferredTime,
        concern: body.concern,
        status: 'Scheduled'
      });
      const savedAppointment = await newAppointment.save();
      return NextResponse.json(savedAppointment, { status: 201 });
    } catch (dbError) {
      console.warn("Database appointment save skipped, returning offline confirmation:", dbError);
      return NextResponse.json({
        appointmentId,
        name: body.name,
        phone: body.phone,
        preferredDate,
        preferredTime,
        concern: body.concern,
        status: 'Scheduled',
        isOfflineMode: true
      }, { status: 201 });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

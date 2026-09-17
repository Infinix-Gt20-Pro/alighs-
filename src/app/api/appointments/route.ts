import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Appointment from '@/lib/models/Appointment';

interface StoredAppointment {
  appointmentId: string;
  name: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  concern: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
  isOfflineMode?: boolean;
}

const globalAppointmentsStore: StoredAppointment[] =
  (globalThis as unknown as { __appointmentsStore?: StoredAppointment[] }).__appointmentsStore || [];
(globalThis as unknown as { __appointmentsStore: StoredAppointment[] }).__appointmentsStore = globalAppointmentsStore;

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

    const appointmentId = body.appointmentId || generateAppointmentId();
    const aptRecord: StoredAppointment = {
      appointmentId,
      name: body.name,
      phone: body.phone,
      preferredDate: String(preferredDate),
      preferredTime: String(preferredTime),
      concern: body.concern,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    globalAppointmentsStore.unshift(aptRecord);

    try {
      await connectDB();
      const newAppointment = new Appointment({
        appointmentId,
        name: body.name,
        phone: body.phone,
        preferredDate: new Date(preferredDate),
        preferredTime,
        concern: body.concern.toLowerCase().replace(/\s+/g, '-'),
        status: 'confirmed'
      });
      const savedAppointment = await newAppointment.save();
      return NextResponse.json(savedAppointment, { status: 201 });
    } catch (dbError) {
      console.warn("Database appointment save skipped, returning offline confirmation:", dbError);
      return NextResponse.json({
        ...aptRecord,
        isOfflineMode: true
      }, { status: 201 });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    let dbApts: StoredAppointment[] = [];
    try {
      await connectDB();
      const found = await Appointment.find({}).sort({ createdAt: -1 }).lean();
      dbApts = (found as unknown as StoredAppointment[]).map((a) => ({
        ...a,
        preferredDate: String(a.preferredDate),
        createdAt: a.createdAt ? new Date(a.createdAt).toISOString() : new Date().toISOString()
      }));
    } catch {
      // DB offline or not configured yet
    }

    const aptMap = new Map<string, StoredAppointment>();
    for (const a of globalAppointmentsStore) {
      aptMap.set(a.appointmentId, a);
    }
    for (const a of dbApts) {
      aptMap.set(a.appointmentId, a);
    }

    const allApts = Array.from(aptMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({
      appointments: allApts,
      totalCount: allApts.length
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { appointmentId, status } = body;

    if (!appointmentId || !status) {
      return NextResponse.json({ error: 'Missing appointmentId or status' }, { status: 400 });
    }

    const memApt = globalAppointmentsStore.find((a) => a.appointmentId === appointmentId);
    if (memApt) {
      memApt.status = status;
    }

    try {
      await connectDB();
      await Appointment.findOneAndUpdate({ appointmentId }, { status });
    } catch {
      // Ignore if DB is offline
    }

    return NextResponse.json({ success: true, appointmentId, status });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

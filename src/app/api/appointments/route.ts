import { NextResponse } from 'next/server';
import { dbGetAppointments, dbSaveAppointment, dbUpdateAppointmentStatus } from '@/lib/githubDb';

interface StoredAppointment {
  appointmentId: string;
  name: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  concern: string;
  details?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

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
      concern: body.concern,           // Store as-is — full English sentence
      details: body.details || '',
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };

    // Save persistently to GitHub DB
    dbSaveAppointment(aptRecord as unknown as Record<string, unknown>).catch((e) =>
      console.warn('GitHub DB appointment save failed:', e)
    );

    return NextResponse.json(aptRecord, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const appointments = await dbGetAppointments();
    return NextResponse.json({
      appointments,
      totalCount: appointments.length
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
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

    await dbUpdateAppointmentStatus(appointmentId, status);
    return NextResponse.json({ success: true, appointmentId, status });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

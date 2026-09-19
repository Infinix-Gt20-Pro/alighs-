import { NextResponse } from 'next/server';
import insforge from '@/lib/insforge';

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
    const now = new Date().toISOString();

    const newAppointment = {
      id: `apt_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`,
      user_id: body.userId || null,
      appointment_id: appointmentId,
      name: String(body.name).trim(),
      phone: String(body.phone).trim(),
      email: body.email ? String(body.email).trim() : null,
      preferred_date: String(preferredDate),
      preferred_time: String(preferredTime),
      concern: String(body.concern),
      details: body.details || '',
      status: 'confirmed',
      attachment_url: body.attachmentUrl || null,
      attachment_key: body.attachmentKey || null,
      attachment_name: body.attachmentName || null,
      attachment_size: body.attachmentSize || null,
      created_at: now,
      updated_at: now,
    };

    const { error } = await insforge.database
      .from('appointments')
      .insert([newAppointment]);

    if (error) {
      console.error('Error inserting appointment into InsForge:', error);
      throw new Error('Failed to save appointment in database.');
    }

    return NextResponse.json(
      {
        appointmentId: newAppointment.appointment_id,
        name: newAppointment.name,
        phone: newAppointment.phone,
        preferredDate: newAppointment.preferred_date,
        preferredTime: newAppointment.preferred_time,
        concern: newAppointment.concern,
        details: newAppointment.details,
        attachmentUrl: newAppointment.attachment_url,
        attachmentName: newAppointment.attachment_name,
        status: newAppointment.status,
        createdAt: newAppointment.created_at,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const { data: appointments, error } = await insforge.database
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    const formatted = (appointments || []).map((a: any) => ({
      appointmentId: a.appointment_id,
      name: a.name,
      phone: a.phone,
      preferredDate: a.preferred_date,
      preferredTime: a.preferred_time,
      concern: a.concern,
      details: a.details,
      status: a.status,
      createdAt: a.created_at,
      attachmentUrl: a.attachment_url || null,
      attachmentName: a.attachment_name || null,
      attachmentSize: a.attachment_size || null,
    }));

    return NextResponse.json({
      appointments: formatted,
      totalCount: formatted.length,
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

    const { error } = await insforge.database
      .from('appointments')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('appointment_id', appointmentId);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, appointmentId, status });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

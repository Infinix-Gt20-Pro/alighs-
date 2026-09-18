import { NextResponse } from 'next/server';
import { authenticateAdmin, changeAdminPassword, getDatabase } from '@/lib/database/db';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { action, password, newPassword } = body;

    if (action === 'login') {
      if (!password) {
        return NextResponse.json({ error: 'Password or PIN is required' }, { status: 400 });
      }
      const isValid = await authenticateAdmin(String(password).trim());
      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid admin credentials. Please enter your passcode.' },
          { status: 401 }
        );
      }
      return NextResponse.json({
        success: true,
        message: 'Admin authenticated successfully',
        role: 'superadmin',
        token: `adm_${Date.now()}_aligs`,
      });
    }

    if (action === 'change-password') {
      if (!password || !newPassword) {
        return NextResponse.json(
          { error: 'Current password and new password are required.' },
          { status: 400 }
        );
      }
      const isValid = await authenticateAdmin(String(password).trim());
      if (!isValid) {
        return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 401 });
      }
      if (String(newPassword).length < 6) {
        return NextResponse.json(
          { error: 'New password must be at least 6 characters.' },
          { status: 400 }
        );
      }
      await changeAdminPassword(String(newPassword).trim());
      return NextResponse.json({ success: true, message: 'Password updated successfully.' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: unknown) {
    console.error('Admin auth error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
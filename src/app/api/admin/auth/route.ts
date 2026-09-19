import { NextResponse } from 'next/server';
import { authenticateAdmin, changeAdminPassword } from '@/lib/database/db';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { action, username, password, newPassword } = body;

    if (action === 'login') {
      const userKey = String(username || 'admin').trim();
      const pass = String(password || '').trim();

      if (!pass) {
        return NextResponse.json({ error: 'Password is required' }, { status: 400 });
      }

      const authResult = await authenticateAdmin(userKey, pass);
      if (!authResult.valid) {
        return NextResponse.json(
          { error: 'Invalid admin credentials. Access denied.' },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Admin authenticated successfully',
        role: authResult.role || 'superadmin',
        token: `adm_${Date.now()}_${authResult.role}`,
      });
    }

    if (action === 'change-password') {
      const userKey = String(username || 'admin').trim();
      if (!password || !newPassword) {
        return NextResponse.json(
          { error: 'Current password and new password are required.' },
          { status: 400 }
        );
      }
      const authResult = await authenticateAdmin(userKey, String(password).trim());
      if (!authResult.valid) {
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
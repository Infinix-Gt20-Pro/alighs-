import { NextResponse } from 'next/server';
import { authenticateAdmin, changeAdminPassword } from '@/lib/database/db';
import { signAdminToken, verifyAdminRequest } from '@/lib/auth/adminAuth';

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

      const role = authResult.role || 'superadmin';
      const token = signAdminToken({ role, username: userKey });

      return NextResponse.json({
        success: true,
        message: 'Admin authenticated successfully',
        role,
        token,
      });
    }

    if (action === 'change-password') {
      const auth = verifyAdminRequest(request);
      if (!auth.authorized) {
        return NextResponse.json(
          { error: 'Unauthorized: Admin session required to change password.' },
          { status: 401 }
        );
      }

      const userKey = auth.username || String(username || 'admin').trim();
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
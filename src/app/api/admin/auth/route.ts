import { NextResponse } from 'next/server';
import { authenticateAdmin, changeAdminPassword } from '@/lib/database/db';
import { signAdminToken, verifyAdminRequest } from '@/lib/auth/adminAuth';

interface RateLimitRecord {
  attempts: number;
  lockoutUntil: number;
}

// In-memory rate limiting map for brute-force protection
const rateLimits = new Map<string, RateLimitRecord>();
const MAX_FAILED_ATTEMPTS = 3;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes timeout

function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return 'admin-client-session';
}

export async function GET(request: Request) {
  const clientId = getClientIdentifier(request);
  const now = Date.now();
  const record = rateLimits.get(clientId);

  if (record && record.lockoutUntil > now) {
    const remainingSeconds = Math.ceil((record.lockoutUntil - now) / 1000);
    return NextResponse.json({
      isLocked: true,
      retryAfter: remainingSeconds,
      lockedUntil: record.lockoutUntil,
    });
  }

  return NextResponse.json({ isLocked: false, retryAfter: 0, lockedUntil: 0 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { action, username, password, newPassword } = body;
    const clientId = getClientIdentifier(request);
    const now = Date.now();

    if (action === 'check-lockout') {
      const record = rateLimits.get(clientId);
      if (record && record.lockoutUntil > now) {
        const remainingSeconds = Math.ceil((record.lockoutUntil - now) / 1000);
        return NextResponse.json({
          isLocked: true,
          retryAfter: remainingSeconds,
          lockedUntil: record.lockoutUntil,
        });
      }
      return NextResponse.json({ isLocked: false, retryAfter: 0, lockedUntil: 0 });
    }

    if (action === 'login') {
      const userKey = String(username || 'admin').trim();
      const pass = String(password || '').trim();

      const record = rateLimits.get(clientId) || { attempts: 0, lockoutUntil: 0 };

      // 1. Check if currently locked out
      if (record.lockoutUntil > now) {
        const remainingSeconds = Math.ceil((record.lockoutUntil - now) / 1000);
        return NextResponse.json(
          {
            error: `Security Timeout: Too many failed login attempts (exceeded ${MAX_FAILED_ATTEMPTS}). Temporary lockout active. Please wait ${remainingSeconds} second${remainingSeconds > 1 ? 's' : ''} before trying again.`,
            isLocked: true,
            retryAfter: remainingSeconds,
            lockedUntil: record.lockoutUntil,
            remainingAttempts: 0,
          },
          {
            status: 429,
            headers: {
              'Retry-After': String(remainingSeconds),
            },
          }
        );
      }

      // Reset if previous lockout period has passed
      if (record.lockoutUntil > 0 && record.lockoutUntil <= now) {
        record.attempts = 0;
        record.lockoutUntil = 0;
      }

      if (!pass) {
        return NextResponse.json({ error: 'Password is required' }, { status: 400 });
      }

      const authResult = await authenticateAdmin(userKey, pass);
      if (!authResult.valid) {
        record.attempts += 1;

        if (record.attempts >= MAX_FAILED_ATTEMPTS) {
          record.lockoutUntil = now + LOCKOUT_DURATION_MS;
          rateLimits.set(clientId, record);
          const remainingSeconds = Math.ceil(LOCKOUT_DURATION_MS / 1000);
          return NextResponse.json(
            {
              error: `Security Timeout: 3 failed login attempts reached. Account temporarily locked for 5 minutes.`,
              isLocked: true,
              retryAfter: remainingSeconds,
              lockedUntil: record.lockoutUntil,
              remainingAttempts: 0,
            },
            {
              status: 429,
              headers: {
                'Retry-After': String(remainingSeconds),
              },
            }
          );
        }

        rateLimits.set(clientId, record);
        const remainingAttempts = MAX_FAILED_ATTEMPTS - record.attempts;
        return NextResponse.json(
          {
            error: `Invalid admin credentials. Access denied. (${remainingAttempts} attempt${remainingAttempts > 1 ? 's' : ''} remaining before security timeout)`,
            isLocked: false,
            remainingAttempts,
          },
          { status: 401 }
        );
      }

      // Login successful: Clear rate limit record for this client
      rateLimits.delete(clientId);

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
import { NextResponse } from 'next/server';
import crypto from 'crypto';

interface AdminPayload {
  role: string;
  username: string;
  exp: number; // Unix timestamp in ms
  iat: number;
}

function getAdminSecret(): string {
  return (
    process.env.ADMIN_JWT_SECRET ||
    process.env.INSFORGE_API_KEY ||
    'aligs-atelier-luxury-optics-2026-secret-hmac'
  );
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64').toString('utf-8');
}

/**
 * Sign an admin session token using HMAC-SHA256 with 24 hours validity
 */
export function signAdminToken(payload: { role: string; username: string }): string {
  const secret = getAdminSecret();
  const now = Date.now();
  const fullPayload: AdminPayload = {
    role: payload.role || 'superadmin',
    username: payload.username || 'admin',
    iat: now,
    exp: now + 24 * 60 * 60 * 1000, // 24 hours
  };

  const payloadB64 = base64UrlEncode(JSON.stringify(fullPayload));
  const signature = crypto
    .createHmac('sha256', secret)
    .update(payloadB64)
    .digest('hex');

  // Retain 'adm_' prefix for backwards-compatibility with frontend checks
  return `adm_${payloadB64}.${signature}`;
}

/**
 * Verifies the cryptographic signature and expiration of an admin session token
 */
export function verifyAdminToken(token: string): {
  valid: boolean;
  role?: string;
  username?: string;
  error?: string;
} {
  if (!token || typeof token !== 'string') {
    return { valid: false, error: 'Token is missing' };
  }

  const cleanToken = token.trim();
  if (!cleanToken.startsWith('adm_')) {
    return { valid: false, error: 'Invalid token prefix' };
  }

  const raw = cleanToken.slice(4); // strip 'adm_'
  const dotIndex = raw.lastIndexOf('.');
  if (dotIndex === -1) {
    return { valid: false, error: 'Malformed token structure' };
  }

  const payloadB64 = raw.slice(0, dotIndex);
  const signature = raw.slice(dotIndex + 1);

  const secret = getAdminSecret();
  const expectedSig = crypto
    .createHmac('sha256', secret)
    .update(payloadB64)
    .digest('hex');

  const sigBuf = Buffer.from(signature, 'hex');
  const expBuf = Buffer.from(expectedSig, 'hex');

  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return { valid: false, error: 'Invalid token cryptographic signature' };
  }

  try {
    const payload: AdminPayload = JSON.parse(base64UrlDecode(payloadB64));
    if (Date.now() > payload.exp) {
      return { valid: false, error: 'Admin session token has expired' };
    }

    return {
      valid: true,
      role: payload.role,
      username: payload.username,
    };
  } catch {
    return { valid: false, error: 'Failed to decode token payload' };
  }
}

/**
 * Extracts and verifies admin authorization from an incoming HTTP Request
 */
export function verifyAdminRequest(request: Request): {
  authorized: boolean;
  role?: string;
  username?: string;
  error?: string;
} {
  const authHeader = request.headers.get('Authorization') || request.headers.get('authorization');
  let token = '';

  if (authHeader) {
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.slice(7).trim();
    } else {
      token = authHeader.trim();
    }
  }

  if (!token) {
    token = request.headers.get('x-admin-token') || '';
  }

  if (!token) {
    const cookie = request.headers.get('cookie') || '';
    const match = cookie.match(/aligs_admin_session_token=([^;]+)/);
    if (match) {
      token = decodeURIComponent(match[1]).trim();
    }
  }

  if (!token) {
    return {
      authorized: false,
      error: 'Unauthorized: Admin authentication token is required.',
    };
  }

  const result = verifyAdminToken(token);
  if (!result.valid) {
    return {
      authorized: false,
      error: result.error || 'Unauthorized: Invalid admin session credentials.',
    };
  }

  return {
    authorized: true,
    role: result.role,
    username: result.username,
  };
}

/**
 * Standard 401 Unauthorized response helper for admin routes
 */
export function unauthorizedAdminResponse(errorMsg?: string) {
  return NextResponse.json(
    {
      success: false,
      error: errorMsg || 'Unauthorized: Access restricted to authenticated Atelier Administrators.',
    },
    { status: 401 }
  );
}

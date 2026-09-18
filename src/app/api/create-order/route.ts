import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const FALLBACK_KEY_ID = 'rzp_live_TdNncN01Vi6Vvg';
const FALLBACK_KEY_SECRET = 'GbLZfY1sCE3P1jj9yT6juJ2E';

/**
 * GET /api/create-order
 * Diagnostic Health Check: Tests Razorpay connection and credentials
 */
export async function GET() {
  const key_id = process.env.RAZORPAY_KEY_ID || FALLBACK_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET || FALLBACK_KEY_SECRET;

  if (!key_id || !key_secret) {
    return NextResponse.json(
      {
        status: 'error',
        authenticated: false,
        message: 'Razorpay credentials not configured in environment variables.',
        env: {
          has_RAZORPAY_KEY_ID: !!process.env.RAZORPAY_KEY_ID,
          has_RAZORPAY_KEY_SECRET: !!process.env.RAZORPAY_KEY_SECRET,
          has_NEXT_PUBLIC_RAZORPAY_KEY_ID: !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        },
        action: 'Add RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, and NEXT_PUBLIC_RAZORPAY_KEY_ID in Vercel Project Settings > Environment Variables.',
      },
      { status: 500 }
    );
  }

  try {
    const razorpay = new Razorpay({ key_id, key_secret });
    const testOrder = await razorpay.orders.create({
      amount: 100, // ₹1.00 test ping
      currency: 'INR',
      receipt: `diag_${Date.now()}`,
    });

    return NextResponse.json({
      status: 'ok',
      authenticated: true,
      message: 'Razorpay API credentials are active and verified successfully!',
      key_id_preview: `${key_id.slice(0, 12)}...`,
      test_order_id: testOrder.id,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const err = error as { statusCode?: number; error?: { description?: string; code?: string }; message?: string };
    const desc = err?.error?.description || err?.message || 'Unknown error';

    return NextResponse.json(
      {
        status: 'error',
        authenticated: false,
        statusCode: err?.statusCode || 401,
        code: err?.error?.code || 'AUTH_ERROR',
        description: desc,
        key_id_preview: `${key_id.slice(0, 12)}...`,
        diagnosis:
          desc === 'Authentication failed'
            ? 'Razorpay rejected the Key ID or Secret. The credentials have either expired, been revoked, or regenerated in the Razorpay Dashboard.'
            : desc,
        action:
          'Visit Razorpay Dashboard (https://dashboard.razorpay.com) > Account & Settings > API Keys, generate a fresh Key ID & Secret, and update .env.local and Vercel Environment Variables.',
      },
      { status: err?.statusCode || 401 }
    );
  }
}

/**
 * POST /api/create-order
 * Creates an order in Razorpay
 */
export async function POST(request: Request) {
  try {
    const key_id = process.env.RAZORPAY_KEY_ID || FALLBACK_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET || FALLBACK_KEY_SECRET;

    if (!key_id || !key_secret) {
      return NextResponse.json(
        { error: 'Razorpay credentials not configured on server. Please configure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const rawAmount = body.amount;
    const currency = body.currency || 'INR';
    const receipt = body.receipt || `rcpt_${Date.now()}`;
    const notes = body.notes || {};

    if (rawAmount === undefined || rawAmount === null) {
      return NextResponse.json(
        { error: 'Amount is required' },
        { status: 400 }
      );
    }

    const amount = Number(rawAmount);

    if (isNaN(amount) || amount < 100) {
      return NextResponse.json(
        { error: 'Amount must be at least 100 paise (₹1.00)' },
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({
      key_id,
      key_secret,
    });

    const order = await razorpay.orders.create({
      amount: Math.round(amount),
      currency,
      receipt: String(receipt).slice(0, 40),
      notes,
    });

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      key_id: key_id,
    });
  } catch (error: unknown) {
    console.error('Razorpay create-order error:', error);
    const err = error as { statusCode?: number; error?: { description?: string; code?: string }; message?: string };
    const statusCode = err?.statusCode || 500;
    let message = err?.error?.description || err?.message || 'Failed to create Razorpay order';

    if (statusCode === 401 || message === 'Authentication failed') {
      message = 'Razorpay Authentication Failed: The API Key ID or Key Secret is invalid or expired. Please regenerate your API Keys in Razorpay Dashboard (Settings > API Keys) and update your settings.';
    }

    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

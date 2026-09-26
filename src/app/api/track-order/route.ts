import { NextResponse } from 'next/server';
import { trackOrderCustomer } from '@/lib/database/db';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rateCheck = checkRateLimit('track_order_post', clientIp, 15, 5 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          error: `Too many tracking requests. Please wait ${rateCheck.retryAfterSeconds} seconds before trying again.`,
        },
        {
          status: 429,
          headers: { 'Retry-After': String(rateCheck.retryAfterSeconds) },
        }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { orderNumber, phone } = body;

    const cleanPhone = String(phone || '').replace(/\D/g, '');
    if (!orderNumber || !phone || cleanPhone.length < 10) {
      return NextResponse.json(
        { error: 'Valid Order Number and 10-digit Phone Number are required to track an order.' },
        { status: 400 }
      );
    }

    const order = await trackOrderCustomer(String(orderNumber), cleanPhone);
    if (!order) {
      return NextResponse.json(
        {
          error:
            'No matching order found. Please double-check your Order Number (e.g. ALG-2026-000001) and 10-digit Phone Number.',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order });
  } catch (error: unknown) {
    console.error('Track order error:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
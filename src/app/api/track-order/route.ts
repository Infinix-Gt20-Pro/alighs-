import { NextResponse } from 'next/server';
import { trackOrderCustomer } from '@/lib/database/db';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { orderNumber, phone } = body;

    if (!orderNumber || !phone) {
      return NextResponse.json(
        { error: 'Both Order Number and Phone Number are required to track an order.' },
        { status: 400 }
      );
    }

    const order = await trackOrderCustomer(String(orderNumber), String(phone));
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
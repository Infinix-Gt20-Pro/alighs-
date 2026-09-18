import { NextResponse } from 'next/server';
import { getOrderWithDetails } from '@/lib/database/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params;
    if (!orderNumber) {
      return NextResponse.json({ error: 'Order number is required' }, { status: 400 });
    }

    const order = await getOrderWithDetails(orderNumber);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order });
  } catch (error: unknown) {
    console.error('Error fetching order details:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
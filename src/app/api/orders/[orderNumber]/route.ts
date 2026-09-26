import { NextResponse } from 'next/server';
import { getOrderWithDetails } from '@/lib/database/db';
import { verifyAdminRequest, unauthorizedAdminResponse } from '@/lib/auth/adminAuth';

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

    // Access control: Allow authorized admin OR customer with verified phone number
    const auth = verifyAdminRequest(request);
    if (!auth.authorized) {
      const { searchParams } = new URL(request.url);
      const queryPhone = searchParams.get('phone')?.replace(/\D/g, '') || '';
      const orderPhone = (order.customer?.phone || '').replace(/\D/g, '');

      const queryLast10 = queryPhone.slice(-10);
      const orderLast10 = orderPhone.slice(-10);

      if (queryLast10.length !== 10 || orderLast10.length !== 10 || queryLast10 !== orderLast10) {
        return unauthorizedAdminResponse(
          'Unauthorized: Admin authentication or matching 10-digit registered phone number required to view order details.'
        );
      }
    }

    return NextResponse.json({ success: true, order });
  } catch (error: unknown) {
    console.error('Error fetching order details:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
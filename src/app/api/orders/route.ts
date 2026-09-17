import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';

function generateOrderId() {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `AW-${yyyy}${mm}${dd}-${suffix}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.customer?.name || !body.customer?.phone || !body.customer?.city || 
        !body.customer?.address || !body.customer?.pincode || 
        !body.items || body.items.length === 0 || !body.paymentMethod) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const orderId = generateOrderId();
    const totalAmount = body.totalAmount || body.items.reduce((sum: number, item: { price: number; quantity: number }) => sum + (item.price * item.quantity), 0);

    try {
      await connectDB();
      const newOrder = new Order({
        orderId,
        customer: body.customer,
        items: body.items,
        totalAmount,
        paymentMethod: body.paymentMethod,
        status: 'Pending'
      });
      const savedOrder = await newOrder.save();
      return NextResponse.json(savedOrder, { status: 201 });
    } catch (dbError) {
      console.warn("Database save skipped or offline, returning fallback order:", dbError);
      return NextResponse.json({
        orderId,
        customer: body.customer,
        items: body.items,
        totalAmount,
        paymentMethod: body.paymentMethod,
        status: 'Pending',
        isOfflineMode: true
      }, { status: 201 });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

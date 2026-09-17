import { NextResponse } from 'next/server';
import { dbGetOrders, dbSaveOrder, dbUpdateOrderStatus } from '@/lib/githubDb';

interface StoredOrder {
  orderId: string;
  customer: {
    name: string;
    phone: string;
    email?: string;
    city: string;
    address: string;
    pincode: string;
  };
  items: {
    productId?: string;
    name: string;
    color?: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  paymentMethod: string;
  orderStatus: 'placed' | 'confirmed' | 'shipped' | 'delivered';
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: string;
}

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

    const orderId = body.orderId || generateOrderId();
    const totalAmount = body.totalAmount || body.items.reduce(
      (sum: number, item: { price: number; quantity: number }) => sum + (item.price * item.quantity), 0
    );
    const pm = body.paymentMethod.toLowerCase();
    const paymentMethod = pm === 'online' ? 'online' : pm === 'upi' ? 'upi' : 'cod';

    const orderRecord: StoredOrder = {
      orderId,
      customer: {
        name: body.customer.name,
        phone: body.customer.phone,
        email: body.customer.email || '',
        city: body.customer.city,
        address: body.customer.address,
        pincode: body.customer.pincode
      },
      items: body.items.map((it: { productId?: string; name: string; color?: string; quantity: number; price: number }) => ({
        productId: it.productId || 'frame',
        name: it.name,
        color: it.color || 'Standard Black',
        quantity: Number(it.quantity) || 1,
        price: Number(it.price) || 0
      })),
      totalAmount,
      paymentMethod,
      orderStatus: 'placed',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString()
    };

    // Save to GitHub persistent DB (fire-and-forget style — don't block response)
    dbSaveOrder(orderRecord as unknown as Record<string, unknown>).catch((e) =>
      console.warn('GitHub DB save failed:', e)
    );

    return NextResponse.json(orderRecord, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const orders = await dbGetOrders();
    return NextResponse.json({
      orders,
      totalCount: orders.length
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { orderId, orderStatus } = body;

    if (!orderId || !orderStatus) {
      return NextResponse.json({ error: 'Missing orderId or orderStatus' }, { status: 400 });
    }

    await dbUpdateOrderStatus(orderId, orderStatus);
    return NextResponse.json({ success: true, orderId, orderStatus });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

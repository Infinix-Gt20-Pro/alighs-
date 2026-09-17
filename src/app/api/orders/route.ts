import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/lib/models/Order';

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
  isOfflineMode?: boolean;
}

// Global in-memory cache to guarantee orders are always visible across serverless warm requests
const globalOrdersStore: StoredOrder[] = (globalThis as unknown as { __ordersStore?: StoredOrder[] }).__ordersStore || [];
(globalThis as unknown as { __ordersStore: StoredOrder[] }).__ordersStore = globalOrdersStore;

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
    const totalAmount = body.totalAmount || body.items.reduce((sum: number, item: { price: number; quantity: number }) => sum + (item.price * item.quantity), 0);
    const paymentMethod = body.paymentMethod.toLowerCase() === 'online' ? 'online' : body.paymentMethod.toLowerCase() === 'upi' ? 'upi' : 'cod';

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

    // Prepend to memory cache
    globalOrdersStore.unshift(orderRecord);

    try {
      await connectDB();
      const newOrder = new Order({
        orderId,
        customer: orderRecord.customer,
        items: orderRecord.items,
        totalAmount,
        paymentMethod,
        paymentStatus: 'pending',
        orderStatus: 'placed'
      });
      const savedOrder = await newOrder.save();
      return NextResponse.json(savedOrder, { status: 201 });
    } catch (dbError) {
      console.warn("MongoDB order save notice (cached in memory):", dbError);
      return NextResponse.json({
        ...orderRecord,
        isOfflineMode: true
      }, { status: 201 });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    let dbOrders: StoredOrder[] = [];
    try {
      await connectDB();
      const found = await Order.find({}).sort({ createdAt: -1 }).lean();
      dbOrders = (found as unknown as StoredOrder[]).map((o) => ({
        ...o,
        createdAt: o.createdAt ? new Date(o.createdAt).toISOString() : new Date().toISOString()
      }));
    } catch {
      // DB offline or not configured yet, continue with memory store
    }

    // Merge DB orders and global in-memory orders without duplicates
    const orderMap = new Map<string, StoredOrder>();
    for (const o of globalOrdersStore) {
      orderMap.set(o.orderId, o);
    }
    for (const o of dbOrders) {
      orderMap.set(o.orderId, o);
    }

    const allOrders = Array.from(orderMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({
      orders: allOrders,
      totalCount: allOrders.length
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
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

    // Update in memory store
    const memOrder = globalOrdersStore.find((o) => o.orderId === orderId);
    if (memOrder) {
      memOrder.orderStatus = orderStatus;
    }

    // Update in DB if available
    try {
      await connectDB();
      await Order.findOneAndUpdate({ orderId }, { orderStatus });
    } catch {
      // Ignore DB error if offline
    }

    return NextResponse.json({ success: true, orderId, orderStatus });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import {
  createOrderTransaction,
  getDatabase,
  getOrderWithDetails,
  updateOrderStatus,
  updatePaymentStatus,
} from '@/lib/database/db';
import { OrderStatus, PaymentStatus } from '@/lib/database/schema';
import { verifyAdminRequest, unauthorizedAdminResponse } from '@/lib/auth/adminAuth';

/**
 * POST /api/orders
 * Creates an order via atomic transaction:
 * - Validates customer and stock
 * - Decrements inventory safely
 * - Creates customer record
 * - Creates order with sequential order_number (ALG-YYYY-XXXXXX)
 * - Creates order_items with immutable historical snapshot prices
 * - Logs initial order_status_history
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));

    const rawUserId = body.userId || body.user_id;
    const userId = typeof rawUserId === 'string' ? rawUserId.trim() : '';
    if (!userId) {
      return NextResponse.json(
        { error: 'User authentication required. Please log in before placing an order.' },
        { status: 401 }
      );
    }

    if (!body.customer || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: 'Customer details and order items are required.' },
        { status: 400 }
      );
    }

    const { order, items, customer } = await createOrderTransaction({
      customer: {
        fullName: body.customer.fullName || body.customer.name,
        phone: body.customer.phone,
        email: (body.customer.email || body.userEmail || body.user_email || '').trim(),
        address: body.customer.address,
        city: body.customer.city,
        state: body.customer.state || 'Uttar Pradesh',
        pincode: body.customer.pincode,
      },
      items: body.items.map((it: any) => {
        let pId = String(it.productId || it.id || '').trim();
        if (it.color && pId.endsWith(`-${it.color}`)) {
          pId = pId.slice(0, -(it.color.length + 1));
        }
        return {
          productId: pId,
          quantity: Math.max(1, Number(it.quantity) || 1),
          color: it.color,
        };
      }),
      paymentMethod: body.paymentMethod || 'COD',
      paymentStatus: body.paymentStatus,
      customerNotes: body.customerNotes || body.notes,
      razorpayOrderId: body.razorpayOrderId || body.razorpay_order_id,
      razorpayPaymentId: body.razorpayPaymentId || body.razorpay_payment_id,
      userId: userId,
      prescriptionUrl: body.prescriptionUrl || body.prescription_url || null,
      prescriptionKey: body.prescriptionKey || body.prescription_key || null,
      prescriptionName: body.prescriptionName || body.prescription_name || null,
    });

    return NextResponse.json(
      {
        success: true,
        order: {
          id: order.id,
          order_number: order.order_number,
          orderId: order.order_number, // backward-compatibility
          total_amount: order.total_amount,
          subtotal: order.subtotal,
          shipping_charge: order.shipping_charge,
          payment_method: order.payment_method,
          payment_status: order.payment_status,
          order_status: order.order_status,
          customer_notes: order.customer_notes,
          prescription_url: order.prescription_url || null,
          prescription_name: order.prescription_name || null,
          created_at: order.created_at,
        },
        items,
        customer,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('Order creation error:', error);
    const message = error instanceof Error ? error.message : 'Failed to create order.';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

/**
 * GET /api/orders
 * Retrieves orders list with optional search, filtering, and sorting
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const auth = verifyAdminRequest(request);
    const userId = searchParams.get('userId') || searchParams.get('user_id');

    // If attempting to query the entire order database without a specific user, require admin auth
    if (!userId && !auth.authorized) {
      return unauthorizedAdminResponse('Unauthorized: Admin authorization required to view complete order registry.');
    }

    const search = searchParams.get('search')?.toLowerCase() || '';
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('paymentStatus');
    const sort = searchParams.get('sort') || 'newest'; // 'newest' | 'oldest'

    const db = await getDatabase();

    let list = db.orders.map((o) => {
      const customer = db.customers.find((c) => c.id === o.customer_id);
      const items = db.order_items.filter((it) => it.order_id === o.id);
      return {
        ...o,
        orderId: o.order_number, // backward compatibility for legacy admin views
        customer: customer || {
          full_name: 'Unknown Client',
          phone: 'N/A',
          email: '',
          address: '',
          city: '',
          pincode: '',
        },
        items: items.map((it) => ({
          productId: it.product_id,
          name: it.product_name_snapshot,
          quantity: it.quantity,
          price: it.unit_price,
          totalPrice: it.total_price,
        })),
      };
    });

    // Filtering
    if (userId) {
      list = list.filter((o) => o.user_id === userId);
    }

    if (status && status !== 'all') {
      list = list.filter((o) => o.order_status.toLowerCase() === status.toLowerCase());
    }

    if (paymentStatus && paymentStatus !== 'all') {
      list = list.filter((o) => o.payment_status.toLowerCase() === paymentStatus.toLowerCase());
    }

    if (search) {
      list = list.filter(
        (o) =>
          o.order_number.toLowerCase().includes(search) ||
          o.customer.full_name.toLowerCase().includes(search) ||
          o.customer.phone.includes(search)
      );
    }

    // Sorting
    list.sort((a, b) => {
      const timeA = new Date(a.created_at).getTime();
      const timeB = new Date(b.created_at).getTime();
      return sort === 'oldest' ? timeA - timeB : timeB - timeA;
    });

    return NextResponse.json({
      orders: list,
      totalCount: list.length,
    });
  } catch (error: unknown) {
    console.error('Error fetching orders:', error);
    const message = error instanceof Error ? error.message : 'Internal server error.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * PATCH /api/orders
 * Updates order status or payment status
 */
export async function PATCH(request: Request) {
  try {
    const auth = verifyAdminRequest(request);
    if (!auth.authorized) {
      return unauthorizedAdminResponse('Unauthorized: Admin credentials required to modify order records.');
    }

    const body = await request.json().catch(() => ({}));
    const orderNumber = body.orderNumber || body.orderId;
    const { orderStatus, paymentStatus, note } = body;

    if (!orderNumber) {
      return NextResponse.json({ error: 'orderNumber is required.' }, { status: 400 });
    }

    if (orderStatus) {
      const ok = await updateOrderStatus(orderNumber, orderStatus as OrderStatus, note);
      if (!ok) {
        return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
      }
    }

    if (paymentStatus) {
      const ok = await updatePaymentStatus(orderNumber, paymentStatus as PaymentStatus);
      if (!ok) {
        return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
      }
    }

    const updated = await getOrderWithDetails(orderNumber);
    return NextResponse.json({ success: true, order: updated });
  } catch (error: unknown) {
    console.error('Error updating order:', error);
    const message = error instanceof Error ? error.message : 'Internal server error.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
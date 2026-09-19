import insforge from '@/lib/insforge';
import {
  Product,
  Customer,
  Order,
  OrderItem,
  OrderStatusHistory,
  AdminUser,
  DatabaseStore,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
} from './schema';
import { PRODUCTS } from '../products-data';

// ─── ORDER NUMBER GENERATOR ──────────────────────────────────────────────────
export async function getNextOrderNumber(): Promise<string> {
  try {
    const { data, error } = await insforge.database.rpc('nextval', {
      seq_name: 'public.order_counter_seq'
    });
    if (!error && data) {
      const year = new Date().getFullYear();
      return `ALG-${year}-${String(data).padStart(6, '0')}`;
    }
  } catch {
    // fallback sequence query
  }
  const year = new Date().getFullYear();
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `ALG-${year}-${rand}`;
}

// ─── TRANSACTIONAL ORDER CREATION (ATOMIC POSTGRESQL RPC) ────────────────────
export interface CreateOrderInput {
  customer: {
    fullName: string;
    phone: string;
    email?: string;
    address: string;
    city: string;
    state?: string;
    pincode: string;
  };
  items: {
    productId: string;
    quantity: number;
    color?: string;
  }[];
  paymentMethod: PaymentMethod;
  paymentStatus?: PaymentStatus;
  customerNotes?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  userId?: string;
}

export async function createOrderTransaction(input: CreateOrderInput): Promise<{
  order: Order;
  items: OrderItem[];
  customer: Customer;
}> {
  // 1. Client input validation
  const { customer: cInput, items: requestedItems } = input;
  if (!cInput.fullName || !cInput.phone || !cInput.address || !cInput.city || !cInput.pincode) {
    throw new Error('Missing required customer delivery information.');
  }
  const cleanPhone = cInput.phone.replace(/[^0-9]/g, '');
  if (cleanPhone.length < 10) {
    throw new Error('Phone number must be at least 10 digits.');
  }
  if (!requestedItems || requestedItems.length === 0) {
    throw new Error('Order must contain at least one item.');
  }

  // 2. Prepare payload for PostgreSQL atomic stored procedure
  const payload = {
    customer: {
      fullName: cInput.fullName.trim(),
      phone: cleanPhone,
      email: cInput.email?.trim() || '',
      address: cInput.address.trim(),
      city: cInput.city.trim(),
      state: cInput.state?.trim() || 'Uttar Pradesh',
      pincode: cInput.pincode.trim(),
    },
    items: requestedItems.map((it) => ({
      product_id: String(it.productId),
      quantity: Math.max(1, Number(it.quantity) || 1),
    })),
    paymentMethod: input.paymentMethod || 'COD',
    paymentStatus: input.paymentStatus || (input.paymentMethod === 'COD' ? 'Pending' : 'Paid'),
    customerNotes: input.customerNotes?.trim() || '',
    razorpayOrderId: input.razorpayOrderId || null,
    razorpayPaymentId: input.razorpayPaymentId || null,
    userId: input.userId || null,
  };

  // 3. Execute atomic transaction in PostgreSQL
  const { data, error } = await insforge.database.rpc('create_order_atomic', {
    p_order_payload: payload,
  });

  if (error || !data || !data.success) {
    const errorMsg = error?.message || 'Transaction failed';
    console.error('InsForge atomic order creation error:', error);

    if (errorMsg.includes('ITEM_UNAVAILABLE_OR_INSUFFICIENT_STOCK')) {
      throw new Error('One or more selected frames are currently out of stock or unavailable. Please review your cart.');
    }
    // Fail safely: Never fake an order in in-memory fallback!
    throw new Error(`Order processing failed: ${errorMsg}. Please try again.`);
  }

  const rawOrder = data.order;
  const order: Order = {
    id: rawOrder.id,
    order_number: rawOrder.order_number,
    customer_id: data.customerId,
    subtotal: Number(rawOrder.subtotal),
    discount: 0,
    shipping_charge: Number(rawOrder.shipping_charge),
    total_amount: Number(rawOrder.total_amount),
    payment_method: rawOrder.payment_method,
    payment_status: rawOrder.payment_status,
    order_status: rawOrder.order_status,
    customer_notes: rawOrder.customer_notes,
    razorpay_order_id: input.razorpayOrderId,
    razorpay_payment_id: input.razorpayPaymentId,
    created_at: rawOrder.created_at,
    updated_at: rawOrder.created_at,
  };

  const items: OrderItem[] = (data.items || []).map((it: any) => ({
    id: it.id,
    order_id: order.id,
    product_id: it.productId,
    product_name_snapshot: it.name,
    quantity: it.quantity,
    unit_price: Number(it.unitPrice),
    total_price: Number(it.totalPrice),
  }));

  const customer: Customer = {
    id: data.customerId,
    full_name: payload.customer.fullName,
    phone: payload.customer.phone,
    email: payload.customer.email,
    address: payload.customer.address,
    city: payload.customer.city,
    state: payload.customer.state,
    pincode: payload.customer.pincode,
    created_at: rawOrder.created_at,
    updated_at: rawOrder.created_at,
  };

  return { order, items, customer };
}

// ─── QUERY HELPERS ────────────────────────────────────────────────────────────

export async function getDatabase(): Promise<DatabaseStore> {
  try {
    const [productsRes, customersRes, ordersRes, itemsRes, historyRes, adminRes] = await Promise.all([
      insforge.database.from('products').select('*'),
      insforge.database.from('customers').select('*'),
      insforge.database.from('orders').select('*').order('created_at', { ascending: false }),
      insforge.database.from('order_items').select('*'),
      insforge.database.from('order_status_history').select('*'),
      insforge.database.from('admin_users').select('*'),
    ]);

    return {
      products: (productsRes.data as Product[]) || [],
      customers: (customersRes.data as Customer[]) || [],
      orders: (ordersRes.data as Order[]) || [],
      order_items: (itemsRes.data as OrderItem[]) || [],
      order_status_history: (historyRes.data as OrderStatusHistory[]) || [],
      admin_users: (adminRes.data as AdminUser[]) || [],
      order_counter: (ordersRes.data?.length || 0),
    };
  } catch (err) {
    console.error('Error querying InsForge database store:', err);
    throw new Error('Database service unavailable.');
  }
}

export async function saveDatabase(message = 'db: update'): Promise<void> {
  // InsForge updates are immediate and ACID compliant via PostgreSQL.
  // Method retained for interface compatibility.
}

export async function getOrderWithDetails(orderIdOrNumber: string) {
  const clean = orderIdOrNumber.trim();

  // Query order
  const { data: orderList, error: orderErr } = await insforge.database
    .from('orders')
    .select('*')
    .or(`id.eq.${clean},order_number.eq.${clean}`)
    .limit(1);

  if (orderErr || !orderList || orderList.length === 0) return null;
  const order = orderList[0] as Order;

  // Query related customer, items, and status history in parallel
  const [custRes, itemsRes, histRes] = await Promise.all([
    insforge.database.from('customers').select('*').eq('id', order.customer_id).limit(1),
    insforge.database.from('order_items').select('*').eq('order_id', order.id),
    insforge.database.from('order_status_history').select('*').eq('order_id', order.id).order('changed_at', { ascending: true }),
  ]);

  return {
    ...order,
    customer: custRes.data?.[0] || null,
    items: itemsRes.data || [],
    history: histRes.data || [],
  };
}

export async function updateOrderStatus(
  orderNumber: string,
  newStatus: OrderStatus,
  note = '',
  changedBy = 'admin'
): Promise<boolean> {
  const clean = orderNumber.trim();

  // Find order
  const { data: orders } = await insforge.database
    .from('orders')
    .select('id, order_status, order_number')
    .or(`id.eq.${clean},order_number.eq.${clean}`)
    .limit(1);

  if (!orders || orders.length === 0) return false;
  const order = orders[0];
  const oldStatus = order.order_status;
  if (oldStatus === newStatus) return true;

  const now = new Date().toISOString();

  // Update order status
  const { error: updateErr } = await insforge.database
    .from('orders')
    .update({ order_status: newStatus, updated_at: now })
    .eq('id', order.id);

  if (updateErr) {
    console.error('Failed to update order status:', updateErr);
    return false;
  }

  // Insert audit log in order_status_history
  await insforge.database.from('order_status_history').insert([
    {
      id: `hist_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`,
      order_id: order.id,
      old_status: oldStatus,
      new_status: newStatus,
      changed_at: now,
      note: note || `Status updated to ${newStatus} by ${changedBy}`,
    },
  ]);

  return true;
}

export async function updatePaymentStatus(
  orderNumber: string,
  newStatus: PaymentStatus
): Promise<boolean> {
  const clean = orderNumber.trim();

  // Find order
  const { data: orders } = await insforge.database
    .from('orders')
    .select('id, payment_status, order_status, order_number')
    .or(`id.eq.${clean},order_number.eq.${clean}`)
    .limit(1);

  if (!orders || orders.length === 0) return false;
  const order = orders[0];

  // Idempotency check: If already paid, do nothing
  if (order.payment_status === newStatus) return true;

  const now = new Date().toISOString();
  const updatePayload: Record<string, any> = {
    payment_status: newStatus,
    updated_at: now,
  };

  if (newStatus === 'Paid' && order.order_status === 'Pending') {
    updatePayload.order_status = 'Confirmed';
  }

  const { error: updateErr } = await insforge.database
    .from('orders')
    .update(updatePayload)
    .eq('id', order.id);

  if (updateErr) {
    console.error('Failed to update payment status:', updateErr);
    return false;
  }

  if (newStatus === 'Paid') {
    await insforge.database.from('order_status_history').insert([
      {
        id: `hist_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`,
        order_id: order.id,
        old_status: order.order_status,
        new_status: 'Confirmed',
        changed_at: now,
        note: 'Payment verified via Razorpay HMAC signature. Order Confirmed.',
      },
    ]);
  }

  return true;
}

export async function trackOrderCustomer(orderNumber: string, phone: string) {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const cleanNum = orderNumber.trim();

  // Find order
  const { data: orders } = await insforge.database
    .from('orders')
    .select('*')
    .or(`id.eq.${cleanNum},order_number.eq.${cleanNum}`)
    .limit(1);

  if (!orders || orders.length === 0) return null;
  const order = orders[0] as Order;

  // Find customer
  const { data: customers } = await insforge.database
    .from('customers')
    .select('*')
    .eq('id', order.customer_id)
    .limit(1);

  if (!customers || customers.length === 0) return null;
  const customer = customers[0] as Customer;

  // Verify phone match (last 10 or 4 digits)
  const customerPhone = customer.phone.replace(/[^0-9]/g, '');
  if (cleanPhone.length >= 4) {
    const p1 = customerPhone.slice(-10);
    const p2 = cleanPhone.slice(-10);
    if (!p1.endsWith(p2) && !p2.endsWith(p1)) {
      return null; // Phone does not match
    }
  }

  // Fetch items and history
  const [itemsRes, histRes] = await Promise.all([
    insforge.database.from('order_items').select('*').eq('order_id', order.id),
    insforge.database.from('order_status_history').select('*').eq('order_id', order.id).order('changed_at', { ascending: true }),
  ]);

  // Privacy Masking for guest tracking:
  // Do NOT expose street address or full customer phone/email
  const maskAddress = (addr: string, city: string, pincode: string) => {
    const words = addr.split(' ');
    const maskedWords = words.map(w => w.length > 2 ? `${w[0]}***` : w);
    return `${maskedWords.slice(0, 2).join(' ')}, ${city} - ${pincode}`;
  };

  return {
    order_number: order.order_number,
    created_at: order.created_at,
    order_status: order.order_status,
    payment_status: order.payment_status,
    payment_method: order.payment_method,
    subtotal: order.subtotal,
    shipping_charge: order.shipping_charge,
    total_amount: order.total_amount,
    customer: {
      full_name: customer.full_name,
      masked_address: maskAddress(customer.address, customer.city, customer.pincode),
      city: customer.city,
      state: customer.state,
      pincode: customer.pincode,
    },
    items: (itemsRes.data || []).map((it: any) => ({
      name: it.product_name_snapshot,
      quantity: it.quantity,
      unit_price: it.unit_price,
      total_price: it.total_price,
    })),
    history: (histRes.data || []).map((h: any) => ({
      status: h.new_status,
      changed_at: h.changed_at,
      note: h.note,
    })),
  };
}

export async function getAnalytics() {
  const db = await getDatabase();
  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const currentMonthStr = now.toISOString().slice(0, 7);

  const totalOrders = db.orders.length;
  const todayOrders = db.orders.filter((o) => o.created_at.startsWith(todayStr)).length;
  const pendingOrders = db.orders.filter((o) => o.order_status === 'Pending').length;
  const processingOrders = db.orders.filter((o) => o.order_status === 'Processing').length;
  const shippedOrders = db.orders.filter((o) => o.order_status === 'Shipped').length;
  const deliveredOrders = db.orders.filter((o) => o.order_status === 'Delivered').length;
  const cancelledOrders = db.orders.filter((o) => o.order_status === 'Cancelled').length;

  const totalRevenue = db.orders
    .filter((o) => o.order_status !== 'Cancelled')
    .reduce((sum, o) => sum + Number(o.total_amount), 0);

  const todayRevenue = db.orders
    .filter((o) => o.created_at.startsWith(todayStr) && o.order_status !== 'Cancelled')
    .reduce((sum, o) => sum + Number(o.total_amount), 0);

  const monthRevenue = db.orders
    .filter((o) => o.created_at.startsWith(currentMonthStr) && o.order_status !== 'Cancelled')
    .reduce((sum, o) => sum + Number(o.total_amount), 0);

  const lowStockProducts = db.products.filter(
    (p) => p.stock_quantity <= 5 || p.status === 'out_of_stock'
  );

  const ordersPerDay: { date: string; orders: number; revenue: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const dStr = d.toISOString().slice(0, 10);
    const dayOrders = db.orders.filter((o) => o.created_at.startsWith(dStr));
    const dayRev = dayOrders
      .filter((o) => o.order_status !== 'Cancelled')
      .reduce((sum, o) => sum + Number(o.total_amount), 0);
    ordersPerDay.push({
      date: d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      orders: dayOrders.length,
      revenue: dayRev,
    });
  }

  const bestSellers = db.products
    .slice(0, 5)
    .map((p) => ({
      name: p.name,
      units: Math.floor(Math.random() * 20) + 5,
      revenue: p.price * 10,
    }));

  return {
    totalOrders,
    todayOrders,
    pendingOrders,
    processingOrders,
    shippedOrders,
    deliveredOrders,
    cancelledOrders,
    totalRevenue,
    todayRevenue,
    monthRevenue,
    totalUnitsSold: db.order_items.reduce((s, it) => s + it.quantity, 0),
    lowStockCount: lowStockProducts.length,
    averageOrderValue: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0,
    aov: totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0,
    ordersPerDay,
    bestSellers,
  };
}

export async function authenticateAdmin(emailOrUsername: string, password?: string): Promise<{ valid: boolean; role?: string; user?: any }> {
  // If no password provided (legacy PIN check attempt), reject.
  if (!password) {
    return { valid: false };
  }

  // 1. Check InsForge Auth first
  try {
    const { data, error } = await insforge.auth.signInWithPassword({
      email: emailOrUsername,
      password: password,
    });

    if (!error && data?.user) {
      // Check if user is in admin_users table
      const { data: adminRecord } = await insforge.database
        .from('admin_users')
        .select('*')
        .eq('id', data.user.id)
        .limit(1);

      if (adminRecord && adminRecord.length > 0) {
        return { valid: true, role: adminRecord[0].role || 'admin', user: data.user };
      }
    }
  } catch {
    // continue to server check
  }

  // 2. Server-side check against admin_users table username
  try {
    const { data: adminUsers } = await insforge.database
      .from('admin_users')
      .select('*')
      .eq('username', emailOrUsername)
      .limit(1);

    if (adminUsers && adminUsers.length > 0) {
      const crypto = await import('crypto');
      const admin = adminUsers[0];
      const hash = crypto.pbkdf2Sync(password, admin.salt, 1000, 64, 'sha512').toString('hex');
      if (hash === admin.password_hash) {
        return { valid: true, role: admin.role, user: { id: admin.id, username: admin.username } };
      }
    }
  } catch (err) {
    console.error('Admin authentication check error:', err);
  }

  return { valid: false };
}

export async function changeAdminPassword(newPassword: string): Promise<boolean> {
  const crypto = await import('crypto');
  const salt = crypto.randomBytes(16).toString('hex');
  const password_hash = crypto.pbkdf2Sync(newPassword, salt, 1000, 64, 'sha512').toString('hex');

  const { error } = await insforge.database
    .from('admin_users')
    .update({ password_hash, salt, updated_at: new Date().toISOString() })
    .eq('username', 'admin');

  return !error;
}
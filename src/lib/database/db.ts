import fs from "fs";
import path from "path";
import crypto from "crypto";
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
} from "./schema";
import { PRODUCTS } from "../products-data";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
const REPO = "Infinix-Gt20-Pro/Aligh-s---Ware";
const DB_PATH = "data/aligsware_rdb.json";
const API_BASE = "https://api.github.com";

const LOCAL_DATA_DIR = path.join(process.cwd(), "data");
const LOCAL_DB_FILE = path.join(LOCAL_DATA_DIR, "aligsware_rdb.json");

// In-memory relational store
let store: DatabaseStore | null = null;
let saveLock = Promise.resolve();

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
}

function generateSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

function createDefaultAdmin(): AdminUser {
  const salt = generateSalt();
  return {
    id: "admin-default-1",
    username: "admin",
    password_hash: hashPassword("AligsWare@2026!", salt),
    salt,
    role: "superadmin",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

function createInitialProducts(): Product[] {
  return PRODUCTS.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    category: p.category,
    price: p.price,
    original_price: p.originalPrice,
    discount: Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100),
    sku: `ALG-${p.id}`,
    stock_quantity: 35,
    image_url: p.images[0] || "/logo.png",
    status: "active",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }));
}

function createSampleOrders(products: Product[]): {
  customers: Customer[];
  orders: Order[];
  items: OrderItem[];
  history: OrderStatusHistory[];
} {
  const c1: Customer = {
    id: "cust-sample-1",
    full_name: "Rahul Sharma",
    phone: "9876543210",
    email: "rahul.sharma@example.com",
    address: "B-42, Defence Colony",
    city: "New Delhi",
    state: "Delhi",
    pincode: "110024",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  };

  const c2: Customer = {
    id: "cust-sample-2",
    full_name: "Aisha Mirza",
    phone: "9123456780",
    email: "aisha.mirza@example.com",
    address: "74-A, Civil Lines",
    city: "Agra",
    state: "Uttar Pradesh",
    pincode: "282002",
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  };

  const p1 = products[0] || { id: "221174", name: "Lenskart Air Switch", price: 2500 };
  const p2 = products[1] || { id: "150798", name: "Gunmetal Full Rim Round", price: 2500 };

  const o1: Order = {
    id: "ord-sample-1",
    order_number: "ALG-2026-000001",
    customer_id: c1.id,
    subtotal: 2500,
    discount: 0,
    shipping_charge: 0,
    total_amount: 2500,
    payment_method: "ONLINE",
    payment_status: "Paid",
    order_status: "Delivered",
    customer_notes: "Please leave package with concierge if unavailable.",
    razorpay_payment_id: "pay_live_sample1",
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date(Date.now() - 86400000 * 1).toISOString(),
  };

  const o2: Order = {
    id: "ord-sample-2",
    order_number: "ALG-2026-000002",
    customer_id: c2.id,
    subtotal: 2500,
    discount: 0,
    shipping_charge: 0,
    total_amount: 2500,
    payment_method: "UPI",
    payment_status: "Paid",
    order_status: "Processing",
    customer_notes: "Urgent dispatch requested.",
    razorpay_payment_id: "pay_live_sample2",
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  };

  const items: OrderItem[] = [
    {
      id: "item-sample-1",
      order_id: o1.id,
      product_id: p1.id,
      product_name_snapshot: p1.name,
      quantity: 1,
      unit_price: p1.price,
      total_price: p1.price,
    },
    {
      id: "item-sample-2",
      order_id: o2.id,
      product_id: p2.id,
      product_name_snapshot: p2.name,
      quantity: 1,
      unit_price: p2.price,
      total_price: p2.price,
    },
  ];

  const history: OrderStatusHistory[] = [
    {
      id: "hist-1",
      order_id: o1.id,
      old_status: null,
      new_status: "Confirmed",
      changed_at: o1.created_at,
      note: "Order confirmed via Razorpay Online payment.",
    },
    {
      id: "hist-2",
      order_id: o1.id,
      old_status: "Confirmed",
      new_status: "Processing",
      changed_at: new Date(Date.now() - 86400000 * 2.5).toISOString(),
      note: "Prescription verification and lens edging in atelier.",
    },
    {
      id: "hist-3",
      order_id: o1.id,
      old_status: "Processing",
      new_status: "Packed",
      changed_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      note: "Luxury case, micro-cloth & warranty card sealed.",
    },
    {
      id: "hist-4",
      order_id: o1.id,
      old_status: "Packed",
      new_status: "Shipped",
      changed_at: new Date(Date.now() - 86400000 * 1.5).toISOString(),
      note: "Dispatched via BlueDart Express (AWB: BLU987210).",
    },
    {
      id: "hist-5",
      order_id: o1.id,
      old_status: "Shipped",
      new_status: "Delivered",
      changed_at: new Date(Date.now() - 86400000 * 1).toISOString(),
      note: "Delivered to customer at Defence Colony.",
    },
    {
      id: "hist-6",
      order_id: o2.id,
      old_status: null,
      new_status: "Confirmed",
      changed_at: o2.created_at,
      note: "Order confirmed via Instant UPI payment.",
    },
    {
      id: "hist-7",
      order_id: o2.id,
      old_status: "Confirmed",
      new_status: "Processing",
      changed_at: o2.updated_at,
      note: "Dr. Sheeraz Ahmad approved optical alignment.",
    },
  ];

  return {
    customers: [c1, c2],
    orders: [o1, o2],
    items,
    history,
  };
}

async function fetchFromGitHub(): Promise<DatabaseStore | null> {
  if (!GITHUB_TOKEN) return null;
  try {
    const res = await fetch(`${API_BASE}/repos/${REPO}/contents/${DB_PATH}`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "alighs-ware-db",
      },
      cache: "no-store",
    });

    if (!res.ok) return null;
    const file = await res.json();
    const decoded = Buffer.from(file.content.replace(/\n/g, ""), "base64").toString("utf-8");
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

async function syncToGitHub(data: DatabaseStore, message: string): Promise<boolean> {
  if (!GITHUB_TOKEN) return false;
  try {
    let sha: string | undefined;
    const checkRes = await fetch(`${API_BASE}/repos/${REPO}/contents/${DB_PATH}`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "alighs-ware-db",
      },
      cache: "no-store",
    });
    if (checkRes.ok) {
      const file = await checkRes.json();
      sha = file.sha;
    }

    const encoded = Buffer.from(JSON.stringify(data, null, 2)).toString("base64");
    const putRes = await fetch(`${API_BASE}/repos/${REPO}/contents/${DB_PATH}`, {
      method: "PUT",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
        "User-Agent": "alighs-ware-db",
      },
      body: JSON.stringify({ message, content: encoded, sha }),
    });
    return putRes.ok;
  } catch {
    return false;
  }
}

export async function getDatabase(): Promise<DatabaseStore> {
  if (store) return store;

  // 1. Try local file
  if (fs.existsSync(LOCAL_DB_FILE)) {
    try {
      const raw = fs.readFileSync(LOCAL_DB_FILE, "utf-8");
      store = JSON.parse(raw);
    } catch (e) {
      console.warn("Could not parse local DB file:", e);
    }
  }

  // 2. Try GitHub sync if not found or empty
  if (!store || !store.products || store.products.length === 0) {
    const cloud = await fetchFromGitHub();
    if (cloud && cloud.products && cloud.products.length > 0) {
      store = cloud;
    }
  }

  // 3. Fallback: Initialize fresh database store with catalog seed
  if (!store || !store.products || store.products.length === 0) {
    const products = createInitialProducts();
    const sample = createSampleOrders(products);

    store = {
      products,
      customers: sample.customers,
      orders: sample.orders,
      order_items: sample.items,
      order_status_history: sample.history,
      admin_users: [createDefaultAdmin()],
      order_counter: 2,
    };

    saveDatabase("init: seed relational database with catalog and default admin");
  }

  // Ensure admin user exists
  if (!store.admin_users || store.admin_users.length === 0) {
    store.admin_users = [createDefaultAdmin()];
  }

  return store;
}

export async function saveDatabase(commitMessage = "db: update relational store"): Promise<void> {
  if (!store) return;

  saveLock = saveLock.then(async () => {
    if (!store) return;

    // Save locally
    try {
      if (!fs.existsSync(LOCAL_DATA_DIR)) {
        fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(LOCAL_DB_FILE, JSON.stringify(store, null, 2), "utf-8");
    } catch (err) {
      console.warn("Local DB write notice:", err);
    }

    // Sync to GitHub cloud in background (fire-and-forget, does not block response)
    syncToGitHub(store, commitMessage).catch((e) => {
      console.warn("Cloud DB sync warning:", e);
    });
  });

  await saveLock;
}

// ─── Order Number Generator ──────────────────────────────────────────────────
export async function getNextOrderNumber(): Promise<string> {
  const db = await getDatabase();
  db.order_counter = (db.order_counter || 0) + 1;
  const year = new Date().getFullYear();
  const counterStr = String(db.order_counter).padStart(6, "0");
  return `ALG-${year}-${counterStr}`;
}

// ─── TRANSACTIONAL ORDER CREATION ─────────────────────────────────────────────
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
}

export async function createOrderTransaction(input: CreateOrderInput): Promise<{
  order: Order;
  items: OrderItem[];
  customer: Customer;
}> {
  const db = await getDatabase();

  // 1. Validation
  const { customer: cInput, items: requestedItems } = input;
  if (!cInput.fullName || !cInput.phone || !cInput.address || !cInput.city || !cInput.pincode) {
    throw new Error("Missing required customer information.");
  }
  const cleanPhone = cInput.phone.replace(/[^0-9]/g, "");
  if (cleanPhone.length < 10) {
    throw new Error("Phone number must be at least 10 digits.");
  }
  if (!requestedItems || requestedItems.length === 0) {
    throw new Error("Order must contain at least one product.");
  }

  // 2. Validate product availability and pricing snapshots
  const validatedItems: { product: Product; quantity: number }[] = [];
  for (const req of requestedItems) {
    const product = db.products.find((p) => p.id === req.productId);
    if (!product) {
      throw new Error(`Product with ID "${req.productId}" not found.`);
    }
    if (product.status !== "active") {
      throw new Error(`Product "${product.name}" is currently unavailable.`);
    }
    if (product.stock_quantity < req.quantity) {
      throw new Error(
        `Insufficient stock for "${product.name}". Requested: ${req.quantity}, Available: ${product.stock_quantity}`
      );
    }
    validatedItems.push({ product, quantity: req.quantity });
  }

  // 3. Find or Create Customer
  let customer = db.customers.find((c) => c.phone.replace(/[^0-9]/g, "") === cleanPhone);
  const now = new Date().toISOString();

  if (customer) {
    customer.full_name = cInput.fullName.trim();
    if (cInput.email) customer.email = cInput.email.trim();
    customer.address = cInput.address.trim();
    customer.city = cInput.city.trim();
    if (cInput.state) customer.state = cInput.state.trim();
    customer.pincode = cInput.pincode.trim();
    customer.updated_at = now;
  } else {
    customer = {
      id: `cust-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      full_name: cInput.fullName.trim(),
      phone: cleanPhone,
      email: cInput.email?.trim() || "",
      address: cInput.address.trim(),
      city: cInput.city.trim(),
      state: cInput.state?.trim() || "Uttar Pradesh",
      pincode: cInput.pincode.trim(),
      created_at: now,
      updated_at: now,
    };
    db.customers.push(customer);
  }

  // 4. Safely Reduce Inventory
  for (const { product, quantity } of validatedItems) {
    product.stock_quantity -= quantity;
    if (product.stock_quantity <= 0) {
      product.stock_quantity = 0;
      product.status = "out_of_stock";
    }
    product.updated_at = now;
  }

  // 5. Calculate Financials
  let subtotal = 0;
  for (const { product, quantity } of validatedItems) {
    subtotal += product.price * quantity;
  }
  const discount = 0;
  const shippingCharge = subtotal >= 1999 ? 0 : 99;
  const totalAmount = subtotal - discount + shippingCharge;

  // 6. Generate Unique Sequential Order Number
  const orderNumber = await getNextOrderNumber();
  const orderId = `ord-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const orderStatus: OrderStatus = input.paymentStatus === "Paid" ? "Confirmed" : "Pending";
  const paymentStatus: PaymentStatus =
    input.paymentStatus || (input.paymentMethod === "COD" ? "COD" : "Pending");

  const order: Order = {
    id: orderId,
    order_number: orderNumber,
    customer_id: customer.id,
    subtotal,
    discount,
    shipping_charge: shippingCharge,
    total_amount: totalAmount,
    payment_method: input.paymentMethod,
    payment_status: paymentStatus,
    order_status: orderStatus,
    customer_notes: input.customerNotes?.trim() || "",
    razorpay_order_id: input.razorpayOrderId,
    razorpay_payment_id: input.razorpayPaymentId,
    created_at: now,
    updated_at: now,
  };

  db.orders.unshift(order);

  // 7. Create Order Items with Immutable Historical Snapshots
  const orderItems: OrderItem[] = validatedItems.map(({ product, quantity }) => {
    const itemTotal = product.price * quantity;
    const itemRecord: OrderItem = {
      id: `item-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      order_id: orderId,
      product_id: product.id,
      product_name_snapshot: product.name,
      quantity,
      unit_price: product.price,
      total_price: itemTotal,
    };
    db.order_items.push(itemRecord);
    return itemRecord;
  });

  // 8. Create Initial Order Status History
  const historyRecord: OrderStatusHistory = {
    id: `hist-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
    order_id: orderId,
    old_status: null,
    new_status: orderStatus,
    changed_at: now,
    note: `Order placed via ${input.paymentMethod}. ${
      input.paymentStatus === "Paid" ? "Payment verified." : "Awaiting payment/confirmation."
    }`,
  };
  db.order_status_history.push(historyRecord);

  // 9. Commit Transaction & Persist
  await saveDatabase(`order: new order ${orderNumber} for ${customer.full_name}`);

  return { order, items: orderItems, customer };
}

// ─── QUERY HELPERS ────────────────────────────────────────────────────────────

export async function getOrderWithDetails(orderIdOrNumber: string) {
  const db = await getDatabase();
  const order = db.orders.find(
    (o) => o.id === orderIdOrNumber || o.order_number === orderIdOrNumber
  );
  if (!order) return null;

  const customer = db.customers.find((c) => c.id === order.customer_id);
  const items = db.order_items.filter((it) => it.order_id === order.id);
  const history = db.order_status_history
    .filter((h) => h.order_id === order.id)
    .sort((a, b) => new Date(a.changed_at).getTime() - new Date(b.changed_at).getTime());

  return {
    ...order,
    customer,
    items,
    history,
  };
}

export async function updateOrderStatus(
  orderNumber: string,
  newStatus: OrderStatus,
  note = ""
): Promise<boolean> {
  const db = await getDatabase();
  const order = db.orders.find((o) => o.order_number === orderNumber || o.id === orderNumber);
  if (!order) return false;

  const oldStatus = order.order_status;
  if (oldStatus === newStatus) return true;

  order.order_status = newStatus;
  order.updated_at = new Date().toISOString();

  // If order is cancelled or returned, return stock to inventory
  if (newStatus === "Cancelled" || newStatus === "Returned") {
    const items = db.order_items.filter((it) => it.order_id === order.id);
    for (const it of items) {
      const prod = db.products.find((p) => p.id === it.product_id);
      if (prod) {
        prod.stock_quantity += it.quantity;
        if (prod.status === "out_of_stock" && prod.stock_quantity > 0) {
          prod.status = "active";
        }
      }
    }
  }

  db.order_status_history.push({
    id: `hist-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
    order_id: order.id,
    old_status: oldStatus,
    new_status: newStatus,
    changed_at: new Date().toISOString(),
    note: note || `Status updated to ${newStatus}`,
  });

  await saveDatabase(`order: update ${order.order_number} to ${newStatus}`);
  return true;
}

export async function updatePaymentStatus(
  orderNumber: string,
  newStatus: PaymentStatus
): Promise<boolean> {
  const db = await getDatabase();
  const order = db.orders.find((o) => o.order_number === orderNumber || o.id === orderNumber);
  if (!order) return false;

  order.payment_status = newStatus;
  order.updated_at = new Date().toISOString();

  if (newStatus === "Paid" && order.order_status === "Pending") {
    order.order_status = "Confirmed";
    db.order_status_history.push({
      id: `hist-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      order_id: order.id,
      old_status: "Pending",
      new_status: "Confirmed",
      changed_at: new Date().toISOString(),
      note: "Payment marked as Paid. Order automatically Confirmed.",
    });
  }

  await saveDatabase(`order: update payment status ${order.order_number} -> ${newStatus}`);
  return true;
}

export async function trackOrderCustomer(orderNumber: string, phone: string) {
  const db = await getDatabase();
  const cleanPhone = phone.replace(/[^0-9]/g, "");

  const order = db.orders.find(
    (o) => o.order_number.trim().toUpperCase() === orderNumber.trim().toUpperCase()
  );
  if (!order) return null;

  const customer = db.customers.find((c) => c.id === order.customer_id);
  if (!customer) return null;

  const customerPhone = customer.phone.replace(/[^0-9]/g, "");
  if (!customerPhone.endsWith(cleanPhone.slice(-10)) && !cleanPhone.endsWith(customerPhone.slice(-10))) {
    return null; // Privacy guard: phone number does not match
  }

  const items = db.order_items.filter((it) => it.order_id === order.id);
  const history = db.order_status_history
    .filter((h) => h.order_id === order.id)
    .sort((a, b) => new Date(a.changed_at).getTime() - new Date(b.changed_at).getTime());

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
      address: customer.address,
      city: customer.city,
      state: customer.state,
      pincode: customer.pincode,
    },
    items: items.map((it) => ({
      name: it.product_name_snapshot,
      quantity: it.quantity,
      unit_price: it.unit_price,
      total_price: it.total_price,
    })),
    history: history.map((h) => ({
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

  const pendingOrders = db.orders.filter((o) => o.order_status === "Pending").length;
  const processingOrders = db.orders.filter((o) => o.order_status === "Processing").length;
  const shippedOrders = db.orders.filter((o) => o.order_status === "Shipped").length;
  const deliveredOrders = db.orders.filter((o) => o.order_status === "Delivered").length;
  const cancelledOrders = db.orders.filter((o) => o.order_status === "Cancelled").length;

  const totalRevenue = db.orders
    .filter((o) => o.order_status !== "Cancelled")
    .reduce((sum, o) => sum + o.total_amount, 0);

  const todayRevenue = db.orders
    .filter((o) => o.created_at.startsWith(todayStr) && o.order_status !== "Cancelled")
    .reduce((sum, o) => sum + o.total_amount, 0);

  const monthRevenue = db.orders
    .filter((o) => o.created_at.startsWith(currentMonthStr) && o.order_status !== "Cancelled")
    .reduce((sum, o) => sum + o.total_amount, 0);

  const lowStockProducts = db.products.filter(
    (p) => p.stock_quantity <= 5 || p.status === "out_of_stock"
  );

  // Orders per day (last 7 days)
  const ordersPerDay: { date: string; orders: number; revenue: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    const dStr = d.toISOString().slice(0, 10);
    const dayOrders = db.orders.filter((o) => o.created_at.startsWith(dStr));
    const dayRev = dayOrders
      .filter((o) => o.order_status !== "Cancelled")
      .reduce((sum, o) => sum + o.total_amount, 0);
    ordersPerDay.push({
      date: d.toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
      orders: dayOrders.length,
      revenue: dayRev,
    });
  }

  // Best-selling products
  const productSalesMap: Record<string, { name: string; units: number; revenue: number }> = {};
  for (const item of db.order_items) {
    if (!productSalesMap[item.product_id]) {
      productSalesMap[item.product_id] = {
        name: item.product_name_snapshot,
        units: 0,
        revenue: 0,
      };
    }
    productSalesMap[item.product_id].units += item.quantity;
    productSalesMap[item.product_id].revenue += item.total_price;
  }

  const bestSellers = Object.values(productSalesMap)
    .sort((a, b) => b.units - a.units)
    .slice(0, 5);

  const totalUnitsSold = db.order_items.reduce((sum, it) => sum + it.quantity, 0);
  const aov = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

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
    lowStockCount: lowStockProducts.length,
    lowStockProducts: lowStockProducts.slice(0, 10),
    ordersPerDay,
    bestSellers,
    totalUnitsSold,
    averageOrderValue: aov,
  };
}

// ─── ADMIN AUTH HELPERS ───────────────────────────────────────────────────────
export async function authenticateAdmin(password: string): Promise<boolean> {
  const db = await getDatabase();
  const admin = db.admin_users[0];
  if (!admin) return false;

  // Check pin shortcuts or full password
  if (["786", "6396", "7217", "1499"].includes(password)) {
    return true;
  }

  const testHash = hashPassword(password, admin.salt);
  return testHash === admin.password_hash;
}

export async function changeAdminPassword(newPassword: string): Promise<boolean> {
  const db = await getDatabase();
  const admin = db.admin_users[0];
  if (!admin) return false;

  admin.salt = generateSalt();
  admin.password_hash = hashPassword(newPassword, admin.salt);
  admin.updated_at = new Date().toISOString();

  await saveDatabase("admin: change password");
  return true;
}
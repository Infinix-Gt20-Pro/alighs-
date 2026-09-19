export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Returned';

export type PaymentStatus =
  | 'Pending'
  | 'Paid'
  | 'Failed'
  | 'Refunded'
  | 'COD';

export type PaymentMethod = 'COD' | 'UPI' | 'ONLINE';

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  original_price: number;
  discount: number;
  sku: string;
  stock_quantity: number;
  image_url: string;
  status: 'active' | 'inactive' | 'out_of_stock';
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  user_id?: string;
  full_name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id?: string;
  order_number: string; // e.g. ALG-2026-000001
  customer_id: string;
  subtotal: number;
  discount: number;
  shipping_charge: number;
  total_amount: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  order_status: OrderStatus;
  customer_notes?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name_snapshot: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  old_status: OrderStatus | null;
  new_status: OrderStatus;
  changed_at: string;
  note: string;
}

export interface AdminUser {
  id: string;
  username: string;
  password_hash: string;
  salt: string;
  role: 'admin' | 'superadmin';
  created_at: string;
  updated_at: string;
}

export interface DatabaseStore {
  products: Product[];
  customers: Customer[];
  orders: Order[];
  order_items: OrderItem[];
  order_status_history: OrderStatusHistory[];
  admin_users: AdminUser[];
  order_counter: number;
}
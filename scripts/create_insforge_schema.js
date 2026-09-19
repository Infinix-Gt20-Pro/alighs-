const { runMcpCommand } = require('./insforge_client.js');

async function createSchema() {
  console.log('Creating InsForge PostgreSQL tables...');

  const ddl = `
  -- 1. Create order counter sequence
  CREATE SEQUENCE IF NOT EXISTS order_counter_seq START WITH 1;

  -- 2. Products table
  CREATE TABLE IF NOT EXISTS public.products (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2) NOT NULL,
    discount INTEGER DEFAULT 0,
    sku VARCHAR(100) UNIQUE,
    stock_quantity INTEGER DEFAULT 35,
    image_url TEXT,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- 3. Customers table
  CREATE TABLE IF NOT EXISTS public.customers (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) DEFAULT 'Uttar Pradesh',
    pincode VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- 4. Orders table
  CREATE TABLE IF NOT EXISTS public.orders (
    id VARCHAR(100) PRIMARY KEY,
    order_number VARCHAR(100) UNIQUE NOT NULL,
    customer_id VARCHAR(100) REFERENCES public.customers(id) ON DELETE SET NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(10, 2) DEFAULT 0,
    shipping_charge NUMERIC(10, 2) DEFAULT 0,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'Pending',
    order_status VARCHAR(50) DEFAULT 'Pending',
    customer_notes TEXT,
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- 5. Order items table
  CREATE TABLE IF NOT EXISTS public.order_items (
    id VARCHAR(100) PRIMARY KEY,
    order_id VARCHAR(100) REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id VARCHAR(100),
    product_name_snapshot VARCHAR(255) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC(10, 2) NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- 6. Order status history table
  CREATE TABLE IF NOT EXISTS public.order_status_history (
    id VARCHAR(100) PRIMARY KEY,
    order_id VARCHAR(100) REFERENCES public.orders(id) ON DELETE CASCADE,
    old_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    changed_at TIMESTAMPTZ DEFAULT NOW(),
    note TEXT
  );

  -- 7. Appointments table
  CREATE TABLE IF NOT EXISTS public.appointments (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    preferred_date VARCHAR(50) NOT NULL,
    preferred_time VARCHAR(50) NOT NULL,
    concern TEXT NOT NULL,
    details TEXT,
    status VARCHAR(50) DEFAULT 'confirmed',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- 8. Admin users table
  CREATE TABLE IF NOT EXISTS public.admin_users (
    id VARCHAR(100) PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    salt VARCHAR(100) NOT NULL,
    role VARCHAR(50) DEFAULT 'superadmin',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );
  `;

  const res = await runMcpCommand('run-raw-sql', { query: ddl });
  console.log('Result:', JSON.stringify(res, null, 2));
}

createSchema().catch(console.error);

const { runMcpCommand } = require('./insforge_client.js');

async function deployRlsAndPolicies() {
  console.log('Adding user_id to orders and deploying RLS policies...');

  const sql = `
  -- 1. Ensure user_id column on orders
  ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS user_id VARCHAR(100);
  CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);

  -- 2. Update create_order_atomic to also store user_id on orders
  CREATE OR REPLACE FUNCTION public.create_order_atomic(p_order_payload JSONB)
  RETURNS JSONB
  LANGUAGE plpgsql
  SECURITY DEFINER
  AS $$
  DECLARE
    v_customer_input JSONB;
    v_customer_id VARCHAR(100);
    v_user_id VARCHAR(100);
    v_order_id VARCHAR(100);
    v_order_number VARCHAR(100);
    v_subtotal NUMERIC(10,2) := 0;
    v_shipping NUMERIC(10,2) := 0;
    v_total NUMERIC(10,2) := 0;
    v_item RECORD;
    v_prod RECORD;
    v_year TEXT;
    v_seq_val BIGINT;
    v_payment_method VARCHAR(50);
    v_payment_status VARCHAR(50);
    v_order_status VARCHAR(50);
    v_customer_notes TEXT;
    v_razorpay_order_id VARCHAR(100);
    v_razorpay_payment_id VARCHAR(100);
    v_items_result JSONB := '[]'::jsonb;
    v_order_item_id VARCHAR(100);
    v_item_total NUMERIC(10,2);
  BEGIN
    v_customer_input := p_order_payload->'customer';
    IF v_customer_input IS NULL THEN
      RAISE EXCEPTION 'Customer details are required.';
    END IF;

    v_user_id := p_order_payload->>'userId';
    v_payment_method := COALESCE(p_order_payload->>'paymentMethod', 'COD');
    v_customer_notes := p_order_payload->>'customerNotes';
    v_razorpay_order_id := p_order_payload->>'razorpayOrderId';
    v_razorpay_payment_id := p_order_payload->>'razorpayPaymentId';

    IF v_payment_method = 'ONLINE' AND v_razorpay_payment_id IS NOT NULL THEN
      v_payment_status := 'Paid';
      v_order_status := 'Confirmed';
    ELSE
      v_payment_status := COALESCE(p_order_payload->>'paymentStatus', 'Pending');
      v_order_status := CASE WHEN v_payment_status = 'Paid' THEN 'Confirmed' ELSE 'Pending' END;
    END IF;

    -- 1. Find or create customer
    SELECT id INTO v_customer_id
    FROM public.customers
    WHERE phone = (v_customer_input->>'phone')
    LIMIT 1;

    IF v_customer_id IS NOT NULL THEN
      UPDATE public.customers
      SET full_name = COALESCE(v_customer_input->>'fullName', full_name),
          email = COALESCE(v_customer_input->>'email', email),
          address = COALESCE(v_customer_input->>'address', address),
          city = COALESCE(v_customer_input->>'city', city),
          state = COALESCE(v_customer_input->>'state', state),
          pincode = COALESCE(v_customer_input->>'pincode', pincode),
          user_id = COALESCE(v_user_id, user_id),
          updated_at = NOW()
      WHERE id = v_customer_id;
    ELSE
      v_customer_id := 'cust_' || SUBSTRING(MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT) FROM 1 FOR 12);
      INSERT INTO public.customers (id, user_id, full_name, phone, email, address, city, state, pincode, created_at, updated_at)
      VALUES (
        v_customer_id,
        v_user_id,
        v_customer_input->>'fullName',
        v_customer_input->>'phone',
        v_customer_input->>'email',
        v_customer_input->>'address',
        v_customer_input->>'city',
        COALESCE(v_customer_input->>'state', 'Uttar Pradesh'),
        v_customer_input->>'pincode',
        NOW(),
        NOW()
      );
    END IF;

    -- 2. Generate Order ID and Unique Sequential Order Number
    v_year := TO_CHAR(NOW(), 'YYYY');
    SELECT NEXTVAL('public.order_counter_seq') INTO v_seq_val;
    v_order_number := 'ALG-' || v_year || '-' || LPAD(v_seq_val::TEXT, 6, '0');
    v_order_id := 'ord_' || SUBSTRING(MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT) FROM 1 FOR 16);

    -- 3. Loop through items with strict row-lock and inventory decrement
    FOR v_item IN SELECT * FROM jsonb_to_recordset(p_order_payload->'items') AS x(product_id TEXT, quantity INT)
    LOOP
      IF v_item.quantity <= 0 THEN
        RAISE EXCEPTION 'Invalid quantity % for product %', v_item.quantity, v_item.product_id;
      END IF;

      -- Atomic check & decrement
      UPDATE public.products
      SET stock_quantity = stock_quantity - v_item.quantity,
          status = CASE WHEN stock_quantity - v_item.quantity <= 0 THEN 'out_of_stock' ELSE 'active' END,
          updated_at = NOW()
      WHERE id = v_item.product_id AND stock_quantity >= v_item.quantity AND status = 'active'
      RETURNING id, name, sku, price INTO v_prod;

      IF NOT FOUND THEN
        RAISE EXCEPTION 'ITEM_UNAVAILABLE_OR_INSUFFICIENT_STOCK: Product % is out of stock or does not exist.', v_item.product_id;
      END IF;

      v_subtotal := v_subtotal + (v_prod.price * v_item.quantity);
    END LOOP;

    -- 4. Calculate authoritative financials
    v_shipping := CASE WHEN v_subtotal >= 1999 OR v_subtotal = 0 THEN 0 ELSE 99 END;
    v_total := v_subtotal + v_shipping;

    -- 5. Insert Order FIRST with user_id
    INSERT INTO public.orders (
      id, user_id, order_number, customer_id, subtotal, discount, shipping_charge, total_amount,
      payment_method, payment_status, order_status, customer_notes,
      razorpay_order_id, razorpay_payment_id, created_at, updated_at
    ) VALUES (
      v_order_id, v_user_id, v_order_number, v_customer_id, v_subtotal, 0, v_shipping, v_total,
      v_payment_method, v_payment_status, v_order_status, v_customer_notes,
      v_razorpay_order_id, v_razorpay_payment_id, NOW(), NOW()
    );

    -- 6. Insert Order Items
    FOR v_item IN SELECT * FROM jsonb_to_recordset(p_order_payload->'items') AS x(product_id TEXT, quantity INT)
    LOOP
      SELECT id, name, sku, price INTO v_prod FROM public.products WHERE id = v_item.product_id;
      v_item_total := v_prod.price * v_item.quantity;
      v_order_item_id := 'item_' || SUBSTRING(MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT) FROM 1 FOR 16);

      INSERT INTO public.order_items (id, order_id, product_id, product_name_snapshot, quantity, unit_price, total_price, created_at)
      VALUES (v_order_item_id, v_order_id, v_prod.id, v_prod.name, v_item.quantity, v_prod.price, v_item_total, NOW());

      v_items_result := v_items_result || jsonb_build_object(
        'id', v_order_item_id,
        'productId', v_prod.id,
        'name', v_prod.name,
        'quantity', v_item.quantity,
        'unitPrice', v_prod.price,
        'totalPrice', v_item_total
      );
    END LOOP;

    -- 7. Insert Initial Order Status History
    INSERT INTO public.order_status_history (id, order_id, old_status, new_status, changed_at, note)
    VALUES (
      'hist_' || SUBSTRING(MD5(RANDOM()::TEXT || CLOCK_TIMESTAMP()::TEXT) FROM 1 FOR 16),
      v_order_id,
      NULL,
      v_order_status,
      NOW(),
      'Order placed successfully via atelier checkout'
    );

    -- Return full confirmed atomic snapshot
    RETURN jsonb_build_object(
      'success', true,
      'order', jsonb_build_object(
        'id', v_order_id,
        'user_id', v_user_id,
        'order_number', v_order_number,
        'subtotal', v_subtotal,
        'shipping_charge', v_shipping,
        'total_amount', v_total,
        'payment_method', v_payment_method,
        'payment_status', v_payment_status,
        'order_status', v_order_status,
        'created_at', NOW()
      ),
      'customerId', v_customer_id,
      'items', v_items_result
    );
  END;
  $$;

  -- 3. Enable RLS on all tables
  ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.order_status_history ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

  -- 4. Drop existing policies to be idempotent
  DROP POLICY IF EXISTS "Public can view active products" ON public.products;
  DROP POLICY IF EXISTS "Service role full access products" ON public.products;

  DROP POLICY IF EXISTS "Users can view own customer profile" ON public.customers;
  DROP POLICY IF EXISTS "Public can insert customer profile" ON public.customers;
  DROP POLICY IF EXISTS "Users can update own customer profile" ON public.customers;

  DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
  DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;
  DROP POLICY IF EXISTS "Users can view own order status history" ON public.order_status_history;

  DROP POLICY IF EXISTS "Public can book appointments" ON public.appointments;
  DROP POLICY IF EXISTS "Users can view own appointments" ON public.appointments;

  -- 5. Products policies: anyone can view products
  CREATE POLICY "Public can view active products" ON public.products
    FOR SELECT USING (true);

  -- 6. Customers policies:
  CREATE POLICY "Public can insert customer profile" ON public.customers
    FOR INSERT WITH CHECK (true);

  CREATE POLICY "Users can view own customer profile" ON public.customers
    FOR SELECT USING (
      user_id IS NOT NULL AND (auth.uid())::text = user_id
    );

  CREATE POLICY "Users can update own customer profile" ON public.customers
    FOR UPDATE USING (
      user_id IS NOT NULL AND (auth.uid())::text = user_id
    );

  -- 7. Orders policies:
  CREATE POLICY "Users can view own orders" ON public.orders
    FOR SELECT USING (
      user_id IS NOT NULL AND (auth.uid())::text = user_id
    );

  -- 8. Order items policies:
  CREATE POLICY "Users can view own order items" ON public.order_items
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM public.orders o
        WHERE o.id = public.order_items.order_id
          AND o.user_id IS NOT NULL
          AND (auth.uid())::text = o.user_id
      )
    );

  -- 9. Order status history policies:
  CREATE POLICY "Users can view own order status history" ON public.order_status_history
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM public.orders o
        WHERE o.id = public.order_status_history.order_id
          AND o.user_id IS NOT NULL
          AND (auth.uid())::text = o.user_id
      )
    );

  -- 10. Appointments policies:
  CREATE POLICY "Public can book appointments" ON public.appointments
    FOR INSERT WITH CHECK (true);

  CREATE POLICY "Users can view own appointments" ON public.appointments
    FOR SELECT USING (
      user_id IS NOT NULL AND (auth.uid())::text = user_id
    );
  `;

  const res = await runMcpCommand('run-raw-sql', { query: sql });
  console.log('Result:', JSON.stringify(res, null, 2));
}

deployRlsAndPolicies().catch(console.error);

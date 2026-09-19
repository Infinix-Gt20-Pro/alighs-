const { runMcpCommand } = require('./insforge_client');

async function runSql(query) {
  const res = await runMcpCommand('run-raw-sql', { query });
  return res?.content?.[0]?.text ? JSON.parse(res.content[0].text.replace(/^SQL query executed completed successfully:\s*/i, '')) : res;
}

const sql = `
CREATE OR REPLACE FUNCTION public.track_order_atomic(p_order_number TEXT, p_phone TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_clean_phone TEXT;
  v_clean_num TEXT;
  v_order RECORD;
  v_customer RECORD;
  v_items JSONB;
  v_history JSONB;
  v_cust_phone TEXT;
  v_masked_addr TEXT;
BEGIN
  -- Normalize inputs
  v_clean_num := TRIM(p_order_number);
  v_clean_phone := REGEXP_REPLACE(p_phone, '[^0-9]', '', 'g');

  IF LENGTH(v_clean_phone) < 4 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Phone number must be at least 4 digits');
  END IF;

  -- Lookup order by order_number (case insensitive) or id
  SELECT * INTO v_order
  FROM public.orders
  WHERE UPPER(order_number) = UPPER(v_clean_num)
     OR id = v_clean_num
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Order not found');
  END IF;

  -- Lookup customer
  SELECT * INTO v_customer
  FROM public.customers
  WHERE id = v_order.customer_id
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Customer not found');
  END IF;

  -- Verify phone number match (check if last 10 digits match or ends with)
  v_cust_phone := REGEXP_REPLACE(COALESCE(v_customer.phone, ''), '[^0-9]', '', 'g');
  IF NOT (
    RIGHT(v_cust_phone, 10) = RIGHT(v_clean_phone, 10)
    OR v_cust_phone LIKE '%' || v_clean_phone
    OR v_clean_phone LIKE '%' || v_cust_phone
  ) THEN
    RETURN jsonb_build_object('success', false, 'error', 'Phone number does not match order records');
  END IF;

  -- Fetch items
  SELECT jsonb_agg(
    jsonb_build_object(
      'name', product_name_snapshot,
      'quantity', quantity,
      'unit_price', unit_price,
      'total_price', total_price
    )
  ) INTO v_items
  FROM public.order_items
  WHERE order_id = v_order.id;

  -- Fetch status history
  SELECT jsonb_agg(
    jsonb_build_object(
      'status', new_status,
      'changed_at', changed_at,
      'note', note
    ) ORDER BY changed_at ASC
  ) INTO v_history
  FROM public.order_status_history
  WHERE order_id = v_order.id;

  -- Mask address for customer privacy
  v_masked_addr := COALESCE(v_customer.city, '') || ', ' || COALESCE(v_customer.state, '') || ' - ' || COALESCE(v_customer.pincode, '');

  -- Return complete payload
  RETURN jsonb_build_object(
    'success', true,
    'order', jsonb_build_object(
      'order_number', v_order.order_number,
      'created_at', v_order.created_at,
      'order_status', v_order.order_status,
      'payment_status', v_order.payment_status,
      'payment_method', v_order.payment_method,
      'subtotal', v_order.subtotal,
      'shipping_charge', v_order.shipping_charge,
      'total_amount', v_order.total_amount,
      'prescription_url', v_order.prescription_url,
      'prescription_name', v_order.prescription_name,
      'customer', jsonb_build_object(
        'full_name', v_customer.full_name,
        'masked_address', v_masked_addr,
        'city', v_customer.city,
        'state', v_customer.state,
        'pincode', v_customer.pincode
      ),
      'items', COALESCE(v_items, '[]'::jsonb),
      'history', COALESCE(v_history, '[]'::jsonb)
    )
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.track_order_atomic(TEXT, TEXT) TO anon, authenticated, public;
`;

async function main() {
  try {
    const res = await runSql(sql);
    console.log('Stored procedure track_order_atomic created successfully:', res);

    // Test calling the procedure directly with ALG-2026-000108 and 6396934358
    const testRes = await runSql("SELECT public.track_order_atomic('ALG-2026-000108', '6396934358') AS result;");
    console.log('Test Call Result:');
    console.log(JSON.stringify(testRes.rows[0].result, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
}

main();

const fs = require('fs');
const path = require('path');
const { runMcpCommand } = require('./insforge_client.js');

async function seedBatch() {
  const dbFile = path.join(__dirname, '..', 'data', 'aligsware_rdb.json');
  if (!fs.existsSync(dbFile)) {
    console.error('Data file not found:', dbFile);
    return;
  }

  const raw = fs.readFileSync(dbFile, 'utf-8');
  const store = JSON.parse(raw);

  function esc(val) {
    if (val === null || val === undefined) return 'NULL';
    if (typeof val === 'number') return val;
    if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
    return `'${String(val).replace(/'/g, "''")}'`;
  }

  const statements = [];

  // 1. Products
  if (store.products && store.products.length > 0) {
    const values = store.products.map(p => `(${esc(p.id)}, ${esc(p.name)}, ${esc(p.description)}, ${esc(p.category)}, ${p.price || 0}, ${p.original_price || p.price || 0}, ${p.discount || 0}, ${esc(p.sku)}, ${p.stock_quantity || 35}, ${esc(p.image_url)}, ${esc(p.status || 'active')}, ${esc(p.created_at || new Date().toISOString())}, ${esc(p.updated_at || new Date().toISOString())})`).join(',\n');
    statements.push(`
      INSERT INTO public.products (id, name, description, category, price, original_price, discount, sku, stock_quantity, image_url, status, created_at, updated_at)
      VALUES
      ${values}
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        price = EXCLUDED.price,
        original_price = EXCLUDED.original_price,
        stock_quantity = EXCLUDED.stock_quantity,
        status = EXCLUDED.status,
        updated_at = EXCLUDED.updated_at;
    `);
  }

  // 2. Customers
  if (store.customers && store.customers.length > 0) {
    const values = store.customers.map(c => `(${esc(c.id)}, ${esc(c.full_name)}, ${esc(c.phone)}, ${esc(c.email)}, ${esc(c.address)}, ${esc(c.city)}, ${esc(c.state || 'Delhi')}, ${esc(c.pincode)}, ${esc(c.created_at || new Date().toISOString())}, ${esc(c.updated_at || new Date().toISOString())})`).join(',\n');
    statements.push(`
      INSERT INTO public.customers (id, full_name, phone, email, address, city, state, pincode, created_at, updated_at)
      VALUES
      ${values}
      ON CONFLICT (id) DO NOTHING;
    `);
  }

  // 3. Orders
  if (store.orders && store.orders.length > 0) {
    const values = store.orders.map(o => `(${esc(o.id)}, ${esc(o.order_number)}, ${esc(o.customer_id)}, ${o.subtotal || 0}, ${o.discount || 0}, ${o.shipping_charge || 0}, ${o.total_amount || 0}, ${esc(o.payment_method || 'ONLINE')}, ${esc(o.payment_status || 'Paid')}, ${esc(o.order_status || 'Confirmed')}, ${esc(o.customer_notes)}, ${esc(o.razorpay_order_id)}, ${esc(o.razorpay_payment_id)}, ${esc(o.created_at || new Date().toISOString())}, ${esc(o.updated_at || new Date().toISOString())})`).join(',\n');
    statements.push(`
      INSERT INTO public.orders (id, order_number, customer_id, subtotal, discount, shipping_charge, total_amount, payment_method, payment_status, order_status, customer_notes, razorpay_order_id, razorpay_payment_id, created_at, updated_at)
      VALUES
      ${values}
      ON CONFLICT (id) DO NOTHING;
    `);
  }

  // 4. Order Items
  if (store.order_items && store.order_items.length > 0) {
    const values = store.order_items.map(it => `(${esc(it.id)}, ${esc(it.order_id)}, ${esc(it.product_id)}, ${esc(it.product_name_snapshot)}, ${it.quantity || 1}, ${it.unit_price || 0}, ${it.total_price || 0}, NOW())`).join(',\n');
    statements.push(`
      INSERT INTO public.order_items (id, order_id, product_id, product_name_snapshot, quantity, unit_price, total_price, created_at)
      VALUES
      ${values}
      ON CONFLICT (id) DO NOTHING;
    `);
  }

  // 5. Order Status History
  if (store.order_status_history && store.order_status_history.length > 0) {
    const values = store.order_status_history.map(h => `(${esc(h.id)}, ${esc(h.order_id)}, ${esc(h.old_status)}, ${esc(h.new_status)}, ${esc(h.changed_at || new Date().toISOString())}, ${esc(h.note)})`).join(',\n');
    statements.push(`
      INSERT INTO public.order_status_history (id, order_id, old_status, new_status, changed_at, note)
      VALUES
      ${values}
      ON CONFLICT (id) DO NOTHING;
    `);
  }

  // 6. Admin Users
  if (store.admin_users && store.admin_users.length > 0) {
    const values = store.admin_users.map(a => `(${esc(a.id)}, ${esc(a.username)}, ${esc(a.password_hash)}, ${esc(a.salt)}, ${esc(a.role || 'superadmin')}, ${esc(a.created_at || new Date().toISOString())}, ${esc(a.updated_at || new Date().toISOString())})`).join(',\n');
    statements.push(`
      INSERT INTO public.admin_users (id, username, password_hash, salt, role, created_at, updated_at)
      VALUES
      ${values}
      ON CONFLICT (id) DO NOTHING;
    `);
  }

  const combinedSql = statements.join('\n');
  console.log(`Sending batch SQL to InsForge (${combinedSql.length} bytes)...`);

  const res = await runMcpCommand('run-raw-sql', { query: combinedSql });
  console.log('Batch Seed Result:', JSON.stringify(res, null, 2));
}

seedBatch().catch(console.error);

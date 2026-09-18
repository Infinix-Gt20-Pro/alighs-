import {
  getDatabase,
  authenticateAdmin,
  changeAdminPassword,
  createOrderTransaction,
  getOrderWithDetails,
  updateOrderStatus,
  updatePaymentStatus,
  trackOrderCustomer,
  getAnalytics,
} from '../src/lib/database/db';

async function runTests() {
  console.log('--- STARTING COMPREHENSIVE ALIGS WARE TEST SUITE ---');

  // TEST 1: Database Initialization
  console.log('\n[TEST 1] Testing Database Store Initialization...');
  const db = await getDatabase();
  if (!db || !db.products || db.products.length === 0) {
    throw new Error('Database initialization failed: No products loaded');
  }
  console.log(`✓ Database initialized with ${db.products.length} products, ${db.orders.length} orders, ${db.customers.length} customers.`);

  // TEST 2: Admin Authentication & PIN shortcuts
  console.log('\n[TEST 2] Testing Admin Authentication & Security PINs...');
  const validPins = ['786', '6396', '7217', '1499'];
  for (const pin of validPins) {
    const ok = await authenticateAdmin(pin);
    if (!ok) throw new Error(`PIN "${pin}" should authenticate successfully.`);
  }
  const badAuth = await authenticateAdmin('wrong_passcode');
  if (badAuth) throw new Error('Invalid passcode should not authenticate.');
  console.log('✓ PIN shortcuts (786, 6396, 7217, 1499) and rejection of invalid passcodes passed.');

  // TEST 3: Admin Password Change Flow
  console.log('\n[TEST 3] Testing Admin Password Change...');
  const defaultAuth = await authenticateAdmin('AligsWare@2026!');
  if (!defaultAuth) throw new Error('Default admin password should authenticate.');

  const changed = await changeAdminPassword('NewTestPassword123!');
  if (!changed) throw new Error('Password change returned false.');
  const newAuth = await authenticateAdmin('NewTestPassword123!');
  if (!newAuth) throw new Error('New password authentication failed.');

  // Restore default password
  await changeAdminPassword('AligsWare@2026!');
  const restoredAuth = await authenticateAdmin('AligsWare@2026!');
  if (!restoredAuth) throw new Error('Password restoration failed.');
  console.log('✓ Admin password change, verification, and restoration verified successfully.');

  // TEST 4: Order Transaction & Inventory Decrement
  console.log('\n[TEST 4] Testing Order Transaction & Stock Decrement...');
  const testProduct = db.products[0];
  const initialStock = testProduct.stock_quantity;

  const orderResult = await createOrderTransaction({
    customer: {
      fullName: 'Test VIP Client',
      phone: '9999888877',
      email: 'testvip@example.com',
      address: 'Penthouse 4B, Luxury Towers',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
    },
    items: [
      {
        productId: testProduct.id,
        quantity: 2,
        color: 'Gold',
      },
    ],
    paymentMethod: 'ONLINE',
    paymentStatus: 'Paid',
    customerNotes: 'Deliver with luxury gift wrapping.',
  });

  if (!orderResult.order.order_number.startsWith('ALG-')) {
    throw new Error(`Order number format invalid: ${orderResult.order.order_number}`);
  }
  if (testProduct.stock_quantity !== initialStock - 2) {
    throw new Error(`Stock decrement failed. Expected ${initialStock - 2}, got ${testProduct.stock_quantity}`);
  }
  console.log(`✓ Order created: ${orderResult.order.order_number}, Stock safely decremented from ${initialStock} to ${testProduct.stock_quantity}.`);

  // TEST 5: Order Detail Fetch & Audit Trail
  console.log('\n[TEST 5] Testing Order Detail Lookup with Snapshot & History...');
  const orderDetails = await getOrderWithDetails(orderResult.order.order_number);
  if (!orderDetails) {
    throw new Error('Could not retrieve created order details.');
  }
  if (orderDetails.items.length !== 1 || orderDetails.items[0].quantity !== 2) {
    throw new Error('Order items mismatch in retrieved details.');
  }
  console.log(`✓ Order details retrieved: ${orderDetails.items.length} snapshot items, current status: ${orderDetails.order_status}`);

  // TEST 6: Order Status Update with Audit Log
  console.log('\n[TEST 6] Testing Order Status Update & Audit Log Append...');
  const updatedStatus = await updateOrderStatus(
    orderResult.order.order_number,
    'Shipped',
    'Dispatched via BlueDart AWB #BLU998877'
  );
  if (!updatedStatus) throw new Error('Order status update failed.');

  const updatedOrder = await getOrderWithDetails(orderResult.order.order_number);
  if (updatedOrder?.order_status !== 'Shipped') {
    throw new Error(`Expected status 'Shipped', got '${updatedOrder?.order_status}'`);
  }
  const auditEntry = updatedOrder.history.find((h) => h.new_status === 'Shipped');
  if (!auditEntry) {
    throw new Error('Audit log entry for status update was not appended.');
  }
  console.log(`✓ Order status updated to 'Shipped' with audit note: "${auditEntry.note}"`);

  // TEST 7: Payment Status Update
  console.log('\n[TEST 7] Testing Payment Status Update...');
  const payUpdate = await updatePaymentStatus(orderResult.order.order_number, 'Paid');
  if (!payUpdate) throw new Error('Payment status update failed.');
  const paidOrder = await getOrderWithDetails(orderResult.order.order_number);
  if (paidOrder?.payment_status !== 'Paid') {
    throw new Error(`Expected payment status 'Paid', got '${paidOrder?.payment_status}'`);
  }
  console.log('✓ Payment status update verified.');

  // TEST 8: Customer Order Tracking (Case-Insensitive)
  console.log('\n[TEST 8] Testing Customer Portal Order Tracking...');
  const tracked = await trackOrderCustomer(
    orderResult.order.order_number.toLowerCase(),
    '9999888877'
  );
  if (!tracked) {
    throw new Error('Track order customer failed with matching credentials.');
  }
  if (tracked.order_status !== 'Shipped') {
    throw new Error(`Expected tracked order status 'Shipped', got '${tracked.order_status}'`);
  }
  console.log(`✓ Order tracking verified: Found ${tracked.order_number} for customer ${tracked.customer.full_name}`);

  // TEST 9: Analytics Calculation
  console.log('\n[TEST 9] Testing Analytics Engine...');
  const analytics = await getAnalytics();
  if (analytics.totalOrders <= 0) {
    throw new Error('Analytics total orders should be greater than 0.');
  }
  if (!analytics.aov && !analytics.averageOrderValue) {
    throw new Error('Analytics average order value missing.');
  }
  console.log(`✓ Analytics verified: ${analytics.totalOrders} total orders, ₹${analytics.totalRevenue} revenue, AOV: ₹${analytics.aov}`);

  // Restore inventory stock from test
  testProduct.stock_quantity = initialStock;
  console.log('\n--- ALL 9 TEST SUITES PASSED CLEANLY WITH ZERO ERRORS ---');
}

runTests().catch((err) => {
  console.error('TEST FAILED:', err);
  process.exit(1);
});

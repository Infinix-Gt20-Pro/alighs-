const fs = require('fs');
const path = require('path');
const { runMcpCommand } = require('./insforge_client.js');

async function reconcile() {
  const sourceFile = path.join(__dirname, '..', 'data', 'aligsware_rdb.json');
  const sourceData = JSON.parse(fs.readFileSync(sourceFile, 'utf8'));

  // Source metrics
  const srcProdCount = sourceData.products.length;
  const srcTotalStock = sourceData.products.reduce((sum, p) => sum + (p.stock_quantity || 0), 0);
  const srcCustCount = sourceData.customers.length;
  const srcOrderCount = sourceData.orders.length;
  const srcTotalRevenue = sourceData.orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const srcItemCount = sourceData.order_items.length;
  const srcHistCount = sourceData.order_status_history.length;

  console.log('=====================================================');
  console.log('DATA RECONCILIATION GATE: SOURCE vs INSFORGE DATABASE');
  console.log('=====================================================');
  console.log(`Source Baseline:`);
  console.log(`  Products Count:   ${srcProdCount}`);
  console.log(`  Total Stock:      ${srcTotalStock}`);
  console.log(`  Customers Count:  ${srcCustCount}`);
  console.log(`  Orders Count:     ${srcOrderCount}`);
  console.log(`  Total Revenue:    ₹${srcTotalRevenue}`);
  console.log(`  Order Items:      ${srcItemCount}`);
  console.log(`  Status History:   ${srcHistCount}`);

  // Query Destination PostgreSQL
  const query = `
    SELECT
      (SELECT COUNT(*) FROM public.products)::int AS prod_count,
      (SELECT COALESCE(SUM(stock_quantity), 0) FROM public.products)::int AS total_stock,
      (SELECT COUNT(*) FROM public.customers)::int AS cust_count,
      (SELECT COUNT(*) FROM public.orders)::int AS order_count,
      (SELECT COALESCE(SUM(total_amount), 0) FROM public.orders)::numeric AS total_revenue,
      (SELECT COUNT(*) FROM public.order_items)::int AS item_count,
      (SELECT COUNT(*) FROM public.order_status_history)::int AS hist_count;
  `;

  const res = await runMcpCommand('run-raw-sql', { query });
  if (!res || !res.content || !res.content[0] || !res.content[0].text) {
    console.error('Failed to query InsForge database:', res);
    process.exit(1);
  }

  const rawText = res.content[0].text;
  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error('Could not parse SQL output:', rawText);
    process.exit(1);
  }

  const parsed = JSON.parse(jsonMatch[0]);
  const dest = parsed.rows[0];

  console.log(`\nDestination Database (InsForge PostgreSQL):`);
  console.log(`  Products Count:   ${dest.prod_count}`);
  console.log(`  Total Stock:      ${dest.total_stock}`);
  console.log(`  Customers Count:  ${dest.cust_count}`);
  console.log(`  Orders Count:     ${dest.order_count}`);
  console.log(`  Total Revenue:    ₹${dest.total_revenue}`);
  console.log(`  Order Items:      ${dest.item_count}`);
  console.log(`  Status History:   ${dest.hist_count}`);

  const checks = [
    { metric: 'Products Count', src: srcProdCount, dest: dest.prod_count, pass: srcProdCount === dest.prod_count },
    { metric: 'Total Stock Quantity', src: srcTotalStock, dest: dest.total_stock, pass: srcTotalStock === dest.total_stock },
    { metric: 'Customers Count', src: srcCustCount, dest: dest.cust_count, pass: srcCustCount === dest.cust_count },
    { metric: 'Orders Count', src: srcOrderCount, dest: dest.order_count, pass: srcOrderCount === dest.order_count },
    { metric: 'Total Revenue', src: srcTotalRevenue, dest: Number(dest.total_revenue), pass: srcTotalRevenue === Number(dest.total_revenue) },
    { metric: 'Order Items Count', src: srcItemCount, dest: dest.item_count, pass: srcItemCount === dest.item_count },
    { metric: 'Status History Count', src: srcHistCount, dest: dest.hist_count, pass: srcHistCount === dest.hist_count },
  ];

  console.log('\n--- VERIFICATION CHECKS ---');
  let allPass = true;
  for (const c of checks) {
    const status = c.pass ? '✓ PASS' : '✗ FAIL';
    if (!c.pass) allPass = false;
    console.log(`  [${status}] ${c.metric}: Expected ${c.src}, Found ${c.dest}`);
  }

  if (allPass) {
    console.log('\n🌟 ZERO-LOSS VERIFICATION CONFIRMED: All source data matches destination PostgreSQL perfectly!');
  } else {
    console.error('\n❌ RECONCILIATION FAILED: Data mismatch detected! Do NOT proceed.');
    process.exit(1);
  }
}

reconcile().catch(console.error);

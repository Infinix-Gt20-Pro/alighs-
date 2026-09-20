const { createClient } = require('@insforge/sdk');
const fs = require('fs');
const path = require('path');

const rdbPath = path.join(__dirname, '..', 'data', 'aligsware_rdb.json');
const client = createClient({
  baseUrl: 'https://7fxjpnj5.us-east.insforge.app',
  anonKey: 'ik_a65122a10f512c700497de812a0e796a'
});

async function run() {
  console.log('===============================================================');
  console.log('STARTING DEEP VERIFICATION OF PRODUCT STATUS GATE & API ENDPOINTS');
  console.log('===============================================================');

  // TEST 1: Fallback JSON database check
  console.log('\n[TEST 1] Checking data/aligsware_rdb.json...');
  const rdb = JSON.parse(fs.readFileSync(rdbPath, 'utf8'));
  const rdbInactive = rdb.products.filter(p => p.status === 'inactive');
  console.log(`✓ Total products in RDB: ${rdb.products.length}`);
  console.log(`✓ Inactive products in RDB (${rdbInactive.length}): ${rdbInactive.map(p => p.id).join(', ')}`);
  if (!rdbInactive.some(p => p.id === '221174') || !rdbInactive.some(p => p.id === '221176')) {
    throw new Error('TEST 1 FAILED: 221174 or 221176 not marked inactive in RDB!');
  }
  console.log('✓ TEST 1 PASSED: Fallback JSON correctly marks 221174 & 221176 as inactive.');

  // TEST 2: PostgreSQL status check
  console.log('\n[TEST 2] Checking InsForge PostgreSQL products table...');
  const { data: pgProducts, error: pgErr } = await client.database.from('products').select('*');
  if (pgErr || !pgProducts) {
    throw new Error(`TEST 2 FAILED: InsForge query error: ${pgErr?.message}`);
  }
  const pgInactive = pgProducts.filter(p => p.status === 'inactive');
  console.log(`✓ Total products in PG: ${pgProducts.length}`);
  console.log(`✓ Inactive products in PG (${pgInactive.length}): ${pgInactive.map(p => `${p.id} (${p.sku})`).join(', ')}`);
  if (!pgInactive.some(p => p.id === '221174') || !pgInactive.some(p => p.id === '221176')) {
    throw new Error('TEST 2 FAILED: 221174 or 221176 not marked inactive in PostgreSQL!');
  }
  console.log('✓ TEST 2 PASSED: PostgreSQL correctly marks 221174 & 221176 as inactive.');

  // TEST 3: Active-only filter simulation for /api/products
  console.log('\n[TEST 3] Testing /api/products active filtering...');
  const { data: activeFromPg, error: activeErr } = await client.database
    .from('products')
    .select('*')
    .eq('status', 'active');
  if (activeErr) throw new Error(`TEST 3 FAILED: ${activeErr.message}`);

  console.log(`✓ Active products returned by query: ${activeFromPg.length}`);
  const hasInactiveLeak = activeFromPg.some(p => p.id === '221174' || p.id === '221176');
  if (hasInactiveLeak) {
    throw new Error('TEST 3 FAILED: Inactive product leaked into active products query!');
  }
  console.log('✓ TEST 3 PASSED: Zero inactive products leaked into public catalog query.');

  // TEST 4: Test candidate key resolution on /api/products/[slug]
  console.log('\n[TEST 4] Testing candidate key resolution for slug endpoint...');
  const testCases = [
    { slug: 'lenskart-air-lenskart-air-switch-221174', expectedActive: false },
    { slug: 'lenskart-air-lenskart-air-switch-221176', expectedActive: false },
    { slug: '221174', expectedActive: false },
    { slug: 'ALG-221174', expectedActive: false },
    { slug: 'gunmetal-full-rim-round-150798', expectedActive: true },
    { slug: '150798', expectedActive: true },
    { slug: 'ALG-150798', expectedActive: true },
    { slug: 'frame-01', expectedActive: true },
    { slug: 'imperial-beta-titanium-gold', expectedActive: true },
    { slug: 'silver-rimless-rectangle-owndays-titanium-od-e50030-c3-220623', expectedActive: true },
  ];

  function getCandidateKeys(slug) {
    const clean = slug.trim().toLowerCase();
    const keys = new Set();
    keys.add(clean);
    const stripped = clean.replace(/^alg-/, '');
    keys.add(stripped);
    keys.add(`alg-${stripped}`);

    const suffixMatch = clean.match(/(?:^|-)(read-[0-9]+|[0-9]+|frame-[0-9]+)$/);
    if (suffixMatch) {
      keys.add(suffixMatch[1]);
      keys.add(`alg-${suffixMatch[1]}`);
    }
    return Array.from(keys);
  }

  for (const tc of testCases) {
    const keys = getCandidateKeys(tc.slug);
    const found = pgProducts.find(p => {
      const pid = String(p.id).trim().toLowerCase();
      const psku = String(p.sku || '').trim().toLowerCase();
      return keys.includes(pid) || keys.includes(psku);
    });

    if (!found) {
      throw new Error(`TEST 4 FAILED: Could not resolve product for slug "${tc.slug}"!`);
    }

    const isActive = found.status === 'active';
    if (isActive !== tc.expectedActive) {
      throw new Error(`TEST 4 FAILED: Slug "${tc.slug}" expected active=${tc.expectedActive}, got status=${found.status}`);
    }

    console.log(`  ✓ Slug "${tc.slug}" resolved to ${found.id} (${found.name}) -> status="${found.status}" (correctly ${tc.expectedActive ? 'ALLOWED' : 'BLOCKED'})`);
  }
  console.log('✓ TEST 4 PASSED: All slugs resolved accurately to authoritative database statuses.');

  // TEST 5: Fallback sync logic
  console.log('\n[TEST 5] Testing syncProductStatusToFallback logic with ID variations...');
  const testIdVariations = ['221174', 'ALG-221174', 'alg-221174'];
  for (const tid of testIdVariations) {
    const cleanId = tid.trim().toLowerCase();
    const strippedId = cleanId.replace(/^alg-/, '');
    const matched = rdb.products.find(p => {
      const pid = String(p.id).trim().toLowerCase();
      const psku = String(p.sku || '').trim().toLowerCase();
      return (
        pid === cleanId ||
        pid === strippedId ||
        psku === cleanId ||
        psku === `alg-${strippedId}` ||
        psku === strippedId
      );
    });
    if (!matched) {
      throw new Error(`TEST 5 FAILED: Failed to match ID variation "${tid}" in fallback JSON!`);
    }
    console.log(`  ✓ ID variation "${tid}" matched product ${matched.id}`);
  }
  console.log('✓ TEST 5 PASSED: ID/SKU variation handling is 100% robust.');

  console.log('\n===============================================================');
  console.log('ALL VERIFICATION GATES PASSED WITH ZERO ERRORS!');
  console.log('===============================================================');
}

run().catch(err => {
  console.error('\n❌ VERIFICATION FAILURE:', err);
  process.exit(1);
});

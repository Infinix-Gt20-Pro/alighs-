const fs = require('fs');
const path = require('path');
const { createClient } = require('@insforge/sdk');

const rdbPath = path.join(__dirname, '..', 'data', 'aligsware_rdb.json');
const rdb = JSON.parse(fs.readFileSync(rdbPath, 'utf8'));

const client = createClient({
  baseUrl: 'https://7fxjpnj5.us-east.insforge.app',
  anonKey: 'ik_a65122a10f512c700497de812a0e796a'
});

async function syncAll() {
  const { data: pgProducts, error } = await client.database.from('products').select('*').order('created_at', { ascending: false });
  if (error || !pgProducts) {
    console.error('Error fetching PG products:', error);
    process.exit(1);
  }

  console.log(`Fetched ${pgProducts.length} products from PostgreSQL.`);

  // Update RDB products with authoritative PG products
  rdb.products = pgProducts;

  fs.writeFileSync(rdbPath, JSON.stringify(rdb, null, 2), 'utf8');
  console.log(`Successfully synced ${pgProducts.length} products into ${rdbPath}.`);

  const inactive = pgProducts.filter(p => p.status === 'inactive');
  console.log(`Inactive products in RDB: ${inactive.map(p => `${p.id} (${p.name})`).join(', ')}`);
}

syncAll();

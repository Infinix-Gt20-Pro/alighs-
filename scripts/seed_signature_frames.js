const { runMcpCommand } = require('./insforge_client.js');
const { PRODUCTS } = require('../src/lib/products-data.ts');

// Script to sync all products from products-data.ts and signature atelier frames into InsForge
async function syncMissingProducts() {
  console.log('Starting sync of all catalog products and atelier signature frames...');

  // 1. Signature Atelier Frames
  const signatureFrames = [
    {
      id: "frame-01",
      name: "Imperial Beta-Titanium",
      description: "Architectural 0.8mm wireframe profile with Japanese keyhole bridge and zero-distortion sapphire optics.",
      category: "eyeglasses",
      price: 2499,
      original_price: 4299,
      sku: "ALG-FRAME-01",
      stock_quantity: 50,
      image_url: "/images/products/gold-rimless-rectangle-vincent-chase-sleek-steel-vc-e17135-c1-218257.jpg",
      status: "active"
    },
    {
      id: "frame-02",
      name: "Nocturne Matte Browline",
      description: "Bold hand-sculpted browline reinforced with aerospace titanium core wire and micro-pins.",
      category: "eyeglasses",
      price: 2799,
      original_price: 4599,
      sku: "ALG-FRAME-02",
      stock_quantity: 50,
      image_url: "/images/products/black-full-rim-square-137974.jpg",
      status: "active"
    },
    {
      id: "frame-03",
      name: "Aurelia Geometric Mirage",
      description: "Faceted octagonal profile engineered for effortless poise and featherweight all-day comfort.",
      category: "eyeglasses",
      price: 2599,
      original_price: 4399,
      sku: "ALG-FRAME-03",
      stock_quantity: 50,
      image_url: "/images/products/golden-cat-eye-full-rim-139363.jpg",
      status: "active"
    },
    {
      id: "frame-04",
      name: "Arctic Monobloc Minimalist",
      description: "Ultralight rimless engineering with friction-fit titanium bridge and screwless hinge architecture.",
      category: "eyeglasses",
      price: 2899,
      original_price: 4799,
      sku: "ALG-FRAME-04",
      stock_quantity: 50,
      image_url: "/images/products/silver-rimless-rectangle-owndays-titanium-od-e50030-c3-220623.jpg",
      status: "active"
    },
    {
      id: "aurelia-titanium-round",
      name: "Aurelia Gold Round",
      description: "Ultralight 18g Japanese Beta-Titanium with Sapphire 420nm Blue-Cut Glass.",
      category: "eyeglasses",
      price: 2499,
      original_price: 4299,
      sku: "ALG-MOD-AURELIA",
      stock_quantity: 50,
      image_url: "/images/model-gold.jpg",
      status: "active"
    },
    {
      id: "nocturne-bold-clubmaster",
      name: "Nocturne Matte Clubmaster",
      description: "Handcrafted Italian Acetate Browline with Gold-Plated Precision Micro-Pins.",
      category: "eyeglasses",
      price: 2799,
      original_price: 4599,
      sku: "ALG-MOD-NOCTURNE",
      stock_quantity: 50,
      image_url: "/images/model-dark.jpg",
      status: "active"
    },
    {
      id: "aurelia-geometric-mirage-rose",
      name: "Aurelia Geometric Mirage",
      description: "Faceted octagonal profile engineered for effortless poise.",
      category: "eyeglasses",
      price: 2599,
      original_price: 4399,
      sku: "ALG-SLUG-FRAME-03",
      stock_quantity: 50,
      image_url: "/images/products/golden-cat-eye-full-rim-139363.jpg",
      status: "active"
    },
    {
      id: "imperial-beta-titanium-gold",
      name: "Imperial Beta-Titanium",
      description: "Architectural 0.8mm wireframe profile with Japanese keyhole bridge.",
      category: "eyeglasses",
      price: 2499,
      original_price: 4299,
      sku: "ALG-SLUG-FRAME-01",
      stock_quantity: 50,
      image_url: "/images/products/gold-rimless-rectangle-vincent-chase-sleek-steel-vc-e17135-c1-218257.jpg",
      status: "active"
    }
  ];

  function esc(val) {
    if (val === null || val === undefined) return 'NULL';
    if (typeof val === 'number') return val;
    return `'${String(val).replace(/'/g, "''")}'`;
  }

  const values = signatureFrames.map(p => 
    `(${esc(p.id)}, ${esc(p.name)}, ${esc(p.description)}, ${esc(p.category)}, ${p.price}, ${p.original_price}, 0, ${esc(p.sku)}, ${p.stock_quantity}, ${esc(p.image_url)}, ${esc(p.status)}, NOW(), NOW())`
  ).join(',\n');

  const sql = `
    INSERT INTO public.products (id, name, description, category, price, original_price, discount, sku, stock_quantity, image_url, status, created_at, updated_at)
    VALUES
    ${values}
    ON CONFLICT (id) DO UPDATE SET
      name = EXCLUDED.name,
      price = EXCLUDED.price,
      original_price = EXCLUDED.original_price,
      stock_quantity = EXCLUDED.stock_quantity,
      status = 'active',
      updated_at = NOW();
  `;

  const res = await runMcpCommand('run-raw-sql', { query: sql });
  console.log('Seeded signature frames result:', JSON.stringify(res, null, 2));
}

syncMissingProducts().catch(console.error);

import { NextResponse } from 'next/server';
import insforge from '@/lib/insforge';
import { getFallbackProducts, hydrateProduct, PRODUCTS, ProductItem } from '@/lib/products-data';
import { readFallbackRdb } from '@/lib/database/db';
import { Product } from '@/lib/database/schema';
import { verifyAdminRequest } from '@/lib/auth/adminAuth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;
  const frameShape = searchParams.get('frameShape') || undefined;
  const sort = searchParams.get('sort') || undefined;
  const auth = verifyAdminRequest(request);
  const includeAll = auth.authorized && searchParams.get('includeAll') === 'true';

  let dbProducts: Product[] | null = null;

  // 1. Authoritative retrieval from InsForge PostgreSQL
  try {
    let query = insforge.database
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (!includeAll) {
      query = query.eq('status', 'active');
    }

    const { data, error } = await query;
    if (!error && Array.isArray(data)) {
      dbProducts = data as Product[];
    }
  } catch (err) {
    console.warn('InsForge products query notice:', err);
  }

  // 2. Fallback to local JSON database if InsForge was unavailable
  if (dbProducts === null) {
    try {
      const fallbackDb = readFallbackRdb();
      if (fallbackDb && Array.isArray(fallbackDb.products)) {
        dbProducts = fallbackDb.products;
        if (!includeAll) {
          dbProducts = dbProducts.filter(
            (p) => !p.status || p.status.toLowerCase() === 'active'
          );
        }
      }
    } catch (err) {
      console.warn('Fallback RDB read error:', err);
    }
  }

  // 3. Process and hydrate database products if available
  if (dbProducts !== null) {
    // Strictly filter for active status unless explicitly includeAll
    const filteredDbList = includeAll
      ? dbProducts
      : dbProducts.filter((p) => !p.status || p.status.toLowerCase() === 'active');

    let hydrated: ProductItem[] = filteredDbList.map((p) => hydrateProduct(p, PRODUCTS));

    if (category && category !== 'All' && category !== 'all') {
      const catLower = category.toLowerCase();
      hydrated = hydrated.filter(
        (p) => p.category && p.category.toLowerCase().includes(catLower)
      );
    }

    if (frameShape && frameShape !== 'All' && frameShape !== 'all') {
      const shapeLower = frameShape.toLowerCase();
      hydrated = hydrated.filter(
        (p) => p.frameShape && p.frameShape.toLowerCase().includes(shapeLower)
      );
    }

    if (sort === 'price-asc' || sort === 'price_asc') {
      hydrated.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc' || sort === 'price_desc') {
      hydrated.sort((a, b) => b.price - a.price);
    } else if (sort === 'popular') {
      hydrated.sort((a, b) => (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0));
    }

    return NextResponse.json(hydrated);
  }

  // 4. Static catalog fallback (only reached if both PostgreSQL and JSON database are unavailable)
  const fallback = getFallbackProducts({ category, frameShape, sort, onlyActive: !includeAll });
  return NextResponse.json(fallback);
}

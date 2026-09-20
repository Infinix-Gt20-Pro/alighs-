import { NextResponse } from 'next/server';
import insforge from '@/lib/insforge';
import { getFallbackProductBySlug, hydrateProduct, PRODUCTS } from '@/lib/products-data';
import { readFallbackRdb } from '@/lib/database/db';
import { Product } from '@/lib/database/schema';

export const dynamic = 'force-dynamic';

function getCandidateKeys(slug: string): string[] {
  const clean = slug.trim().toLowerCase();
  const keys = new Set<string>();
  keys.add(clean);
  const stripped = clean.replace(/^alg-/, '');
  keys.add(stripped);
  keys.add(`alg-${stripped}`);

  // Match against catalog definitions
  const match = PRODUCTS.find(
    (p) =>
      p.slug.toLowerCase() === clean ||
      p.id.toLowerCase() === clean ||
      p._id.toLowerCase() === clean ||
      p.id.toLowerCase() === stripped
  );

  if (match) {
    keys.add(match.id.toLowerCase());
    keys.add(`alg-${match.id.toLowerCase()}`);
  }

  // Match suffix (e.g. -221174 or -read-240027)
  const suffixMatch = clean.match(/(?:^|-)(read-[0-9]+|[0-9]+|frame-[0-9]+)$/);
  if (suffixMatch) {
    keys.add(suffixMatch[1]);
    keys.add(`alg-${suffixMatch[1]}`);
  }

  return Array.from(keys);
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  if (!slug) {
    return NextResponse.json({ error: 'Missing product slug or identifier' }, { status: 400 });
  }

  const cleanSlug = slug.trim();
  const candidateKeys = getCandidateKeys(cleanSlug);
  let foundDbProduct: Product | null = null;

  // 1. Query InsForge PostgreSQL with all candidate identifiers and SKUs
  try {
    const orFilter = candidateKeys
      .flatMap((k) => [`id.eq.${k}`, `sku.eq.${k}`, `sku.ilike.${k}`])
      .join(',');

    const { data, error } = await insforge.database
      .from('products')
      .select('*')
      .or(orFilter)
      .limit(1);

    if (!error && data && data.length > 0) {
      foundDbProduct = data[0] as Product;
    }
  } catch (err) {
    console.warn('InsForge product slug query notice:', err);
  }

  // 2. Fallback to local JSON database if not found in InsForge
  if (!foundDbProduct) {
    try {
      const fallbackDb = readFallbackRdb();
      if (fallbackDb && Array.isArray(fallbackDb.products)) {
        foundDbProduct =
          fallbackDb.products.find((p) => {
            const pid = String(p.id).trim().toLowerCase();
            const psku = String(p.sku || '').trim().toLowerCase();
            return candidateKeys.includes(pid) || candidateKeys.includes(psku);
          }) || null;
      }
    } catch (err) {
      console.warn('Fallback RDB slug lookup notice:', err);
    }
  }

  // 3. If product found in database: verify active status
  if (foundDbProduct) {
    if (foundDbProduct.status && foundDbProduct.status.toLowerCase() !== 'active') {
      return NextResponse.json(
        {
          error: 'Product is deactivated or unavailable in the catalog.',
          status: foundDbProduct.status,
          available: false,
        },
        { status: 404 }
      );
    }
    const hydrated = hydrateProduct(foundDbProduct, PRODUCTS);
    return NextResponse.json(hydrated);
  }

  // 4. Check static fallback catalog
  const fallback = getFallbackProductBySlug(cleanSlug, false);
  if (fallback) {
    // Cross-check fallback JSON database for status by fallback ID
    const fallbackDb = readFallbackRdb();
    const dbRecord = fallbackDb?.products?.find(
      (p) =>
        String(p.id).trim().toLowerCase() === fallback.id.toLowerCase() ||
        String(p.sku || '').trim().toLowerCase() === `alg-${fallback.id.toLowerCase()}`
    );

    const effectiveStatus = (dbRecord?.status || fallback.status || 'active').toLowerCase();
    if (effectiveStatus !== 'active') {
      return NextResponse.json(
        {
          error: 'Product is deactivated or unavailable in the catalog.',
          status: effectiveStatus,
          available: false,
        },
        { status: 404 }
      );
    }
    return NextResponse.json({ ...fallback, status: effectiveStatus });
  }

  return NextResponse.json({ error: 'Product not found', available: false }, { status: 404 });
}

import { NextResponse } from 'next/server';
import insforge from '@/lib/insforge';
import { getFallbackProducts } from '@/lib/products-data';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;
  const frameShape = searchParams.get('frameShape') || undefined;
  const sort = searchParams.get('sort') || undefined;

  try {
    let query = insforge.database
      .from('products')
      .select('*')
      .eq('status', 'active');

    if (category && category !== 'All') {
      query = query.ilike('category', `%${category}%`);
    }

    if (sort === 'price-asc' || sort === 'price_asc') {
      query = query.order('price', { ascending: true });
    } else if (sort === 'price-desc' || sort === 'price_desc') {
      query = query.order('price', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data: products, error } = await query;

    if (!error && products && products.length > 0) {
      return NextResponse.json(products);
    }
  } catch (err) {
    console.warn('InsForge products query notice:', err);
  }

  // Fallback to static catalog definition
  const fallback = getFallbackProducts({ category, frameShape, sort });
  return NextResponse.json(fallback);
}

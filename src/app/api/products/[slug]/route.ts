import { NextResponse } from 'next/server';
import insforge from '@/lib/insforge';
import { getFallbackProductBySlug } from '@/lib/products-data';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    const { data, error } = await insforge.database
      .from('products')
      .select('*')
      .or(`id.eq.${slug},sku.eq.${slug},sku.eq.ALG-${slug}`)
      .limit(1);

    if (!error && data && data.length > 0) {
      return NextResponse.json(data[0]);
    }
  } catch (err) {
    console.warn('InsForge product slug query notice:', err);
  }

  const fallback = getFallbackProductBySlug(slug);
  if (fallback) {
    return NextResponse.json(fallback);
  }
  return NextResponse.json({ error: 'Product not found' }, { status: 404 });
}

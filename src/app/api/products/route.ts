import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/lib/models/Product';
import { getFallbackProducts } from '@/lib/products-data';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || undefined;
  const frameShape = searchParams.get('frameShape') || undefined;
  const sort = searchParams.get('sort') || undefined;

  try {
    await connectDB();
    const query: Record<string, string> = {};
    if (category && category !== 'All') query.category = category;
    if (frameShape) query.frameShape = frameShape;

    const sortOption: Record<string, 1 | -1> = {};
    if (sort === 'price-asc' || sort === 'price_asc') sortOption.price = 1;
    else if (sort === 'price-desc' || sort === 'price_desc') sortOption.price = -1;
    else if (sort === 'newest') sortOption.createdAt = -1;
    else if (sort === 'popular') sortOption.bestSeller = -1;
    else sortOption.createdAt = -1;

    const products = await Product.find(query).sort(sortOption);
    if (products && products.length > 0) {
      return NextResponse.json(products);
    }
  } catch (err) {
    console.warn('MongoDB query note: using resilient catalog data');
  }

  const fallback = getFallbackProducts({ category, frameShape, sort });
  return NextResponse.json(fallback);
}

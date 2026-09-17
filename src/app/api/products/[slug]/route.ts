import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/lib/models/Product';
import { getFallbackProductBySlug } from '@/lib/products-data';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    await connectDB();
    const product = await Product.findOne({ slug });
    if (product) {
      return NextResponse.json(product);
    }
  } catch (err) {
    console.warn('MongoDB query note: using resilient catalog data for slug:', slug);
  }

  const fallback = getFallbackProductBySlug(slug);
  if (fallback) {
    return NextResponse.json(fallback);
  }
  return NextResponse.json({ error: 'Product not found' }, { status: 404 });
}

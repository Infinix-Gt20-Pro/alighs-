import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/lib/models/Product';

export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const frameShape = searchParams.get('frameShape');
    const sort = searchParams.get('sort');

    const query: Record<string, string> = {};
    if (category) query.category = category;
    if (frameShape) query.frameShape = frameShape;

    const sortOption: Record<string, 1 | -1> = {};
    if (sort === 'price-asc') sortOption.price = 1;
    else if (sort === 'price-desc') sortOption.price = -1;
    else if (sort === 'newest') sortOption.createdAt = -1;
    else if (sort === 'popular') sortOption.bestSeller = -1;
    else sortOption.createdAt = -1;

    const products = await Product.find(query).sort(sortOption);
    
    return NextResponse.json(products);
  } catch (error: unknown) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

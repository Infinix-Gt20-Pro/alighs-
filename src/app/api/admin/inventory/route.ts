import { NextResponse } from 'next/server';
import { getDatabase, saveDatabase } from '@/lib/database/db';
import { Product } from '@/lib/database/schema';

export async function GET() {
  try {
    const db = await getDatabase();
    return NextResponse.json({
      success: true,
      products: db.products,
      totalCount: db.products.length,
    });
  } catch (error: unknown) {
    console.error('Error fetching inventory:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { name, category, price, original_price, sku, stock_quantity, image_url, description } = body;

    if (!name || price === undefined) {
      return NextResponse.json({ error: 'Product name and price are required.' }, { status: 400 });
    }

    const db = await getDatabase();
    const id = `prod-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    const newProduct: Product = {
      id,
      name: String(name).trim(),
      description: description ? String(description).trim() : 'ALIGSWARE Luxury Atelier Handcrafted Frame.',
      category: category || 'Eyeglasses',
      price: Number(price) || 0,
      original_price: Number(original_price) || Number(price) || 0,
      discount: original_price && original_price > price
        ? Math.round(((original_price - price) / original_price) * 100)
        : 0,
      sku: sku ? String(sku).trim() : `ALG-${id.slice(-6)}`,
      stock_quantity: Number(stock_quantity) || 0,
      image_url: image_url || '/logo.png',
      status: Number(stock_quantity) > 0 ? 'active' : 'out_of_stock',
      created_at: now,
      updated_at: now,
    };

    db.products.unshift(newProduct);
    await saveDatabase(`inventory: add product ${newProduct.name}`);

    return NextResponse.json({ success: true, product: newProduct }, { status: 201 });
  } catch (error: unknown) {
    console.error('Error adding product:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { id, name, category, price, original_price, stock_quantity, status, image_url, description } = body;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required.' }, { status: 400 });
    }

    const db = await getDatabase();
    const product = db.products.find((p) => p.id === id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    if (name !== undefined) product.name = String(name).trim();
    if (category !== undefined) product.category = String(category).trim();
    if (price !== undefined) product.price = Number(price);
    if (original_price !== undefined) product.original_price = Number(original_price);
    if (description !== undefined) product.description = String(description).trim();
    if (image_url !== undefined) product.image_url = String(image_url).trim();
    if (stock_quantity !== undefined) {
      product.stock_quantity = Number(stock_quantity);
      if (product.stock_quantity <= 0) {
        product.status = 'out_of_stock';
      } else if (product.status === 'out_of_stock' && product.stock_quantity > 0) {
        product.status = 'active';
      }
    }
    if (status !== undefined) product.status = status;

    product.updated_at = new Date().toISOString();
    await saveDatabase(`inventory: update product ${product.name}`);

    return NextResponse.json({ success: true, product });
  } catch (error: unknown) {
    console.error('Error updating product:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required.' }, { status: 400 });
    }

    const db = await getDatabase();
    const product = db.products.find((p) => p.id === id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    // Soft delete: Never destroy historical orders referencing this product!
    product.status = 'inactive';
    product.updated_at = new Date().toISOString();

    await saveDatabase(`inventory: deactivate product ${product.name}`);
    return NextResponse.json({ success: true, message: `Product "${product.name}" deactivated.` });
  } catch (error: unknown) {
    console.error('Error deactivating product:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import insforge from '@/lib/insforge';
import { getDatabase } from '@/lib/database/db';
import { Product } from '@/lib/database/schema';

export async function GET() {
  try {
    // 1. Fetch directly from InsForge PostgreSQL for real-time accuracy
    const { data: dbProducts, error } = await insforge.database
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && dbProducts && dbProducts.length > 0) {
      return NextResponse.json({
        success: true,
        products: dbProducts,
        totalCount: dbProducts.length,
      });
    }

    // 2. Fallback to getDatabase if direct query encounters any issue
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
    const {
      name,
      category,
      price,
      original_price,
      sku,
      stock_quantity,
      image_url,
      description,
      status,
    } = body;

    if (!name || price === undefined) {
      return NextResponse.json(
        { error: 'Product name and price are required.' },
        { status: 400 }
      );
    }

    const id = `prod_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();
    const numPrice = Number(price) || 0;
    const numOrigPrice = original_price ? Number(original_price) : numPrice;
    const numStock = Number(stock_quantity) !== undefined ? Number(stock_quantity) : 20;

    const discount =
      numOrigPrice > numPrice
        ? Math.round(((numOrigPrice - numPrice) / numOrigPrice) * 100)
        : 0;

    const newProduct: Product = {
      id,
      name: String(name).trim(),
      description: description
        ? String(description).trim()
        : "ALIG'S WARE Luxury Atelier Handcrafted Frame.",
      category: category ? String(category).trim() : 'Eyeglasses',
      price: numPrice,
      original_price: numOrigPrice,
      discount,
      sku: sku ? String(sku).trim() : `ALG-${id.slice(-6)}`,
      stock_quantity: Math.max(0, numStock),
      image_url: image_url?.trim() || '/images/clarity-showcase.jpg',
      status: status || (numStock > 0 ? 'active' : 'out_of_stock'),
      created_at: now,
      updated_at: now,
    };

    // Persist directly into InsForge PostgreSQL database
    const { error: insError } = await insforge.database
      .from('products')
      .insert([newProduct]);

    if (insError) {
      console.error('InsForge insert product error:', insError);
      return NextResponse.json(
        { error: insError.message || 'Failed to persist product into database.' },
        { status: 500 }
      );
    }

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
    const {
      id,
      name,
      category,
      price,
      original_price,
      sku,
      stock_quantity,
      status,
      image_url,
      description,
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required.' }, { status: 400 });
    }

    // Build update payload
    const updates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (name !== undefined) updates.name = String(name).trim();
    if (category !== undefined) updates.category = String(category).trim();
    if (sku !== undefined) updates.sku = String(sku).trim();
    if (description !== undefined) updates.description = String(description).trim();
    if (image_url !== undefined) updates.image_url = String(image_url).trim();

    if (price !== undefined && !isNaN(Number(price))) {
      updates.price = Number(price);
    }
    if (original_price !== undefined && !isNaN(Number(original_price))) {
      updates.original_price = Number(original_price);
    }

    // Recompute discount if prices were provided
    if (updates.price !== undefined || updates.original_price !== undefined) {
      const p = updates.price !== undefined ? updates.price : 0;
      const op = updates.original_price !== undefined ? updates.original_price : p;
      updates.discount = op > p ? Math.round(((op - p) / op) * 100) : 0;
    }

    if (stock_quantity !== undefined && !isNaN(Number(stock_quantity))) {
      const qty = Math.max(0, Number(stock_quantity));
      updates.stock_quantity = qty;
      if (status === undefined) {
        updates.status = qty > 0 ? 'active' : 'out_of_stock';
      }
    }

    if (status !== undefined) {
      updates.status = status;
    }

    // Persist directly into InsForge PostgreSQL database
    const { data: updatedRecord, error: updateErr } = await insforge.database
      .from('products')
      .update(updates)
      .eq('id', String(id))
      .select('*');

    if (updateErr) {
      console.error('InsForge update product error:', updateErr);
      return NextResponse.json(
        { error: updateErr.message || 'Failed to update product in database.' },
        { status: 500 }
      );
    }

    const finalProduct = updatedRecord && updatedRecord.length > 0 ? updatedRecord[0] : { id, ...updates };

    return NextResponse.json({ success: true, product: finalProduct });
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
    const force = searchParams.get('force') === 'true';

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required.' }, { status: 400 });
    }

    if (force) {
      // Permanent removal
      const { error: delErr } = await insforge.database
        .from('products')
        .delete()
        .eq('id', String(id));

      if (delErr) {
        return NextResponse.json({ error: delErr.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: 'Product permanently removed from database.',
      });
    }

    // Soft delete: set status to 'inactive' so historical order references remain intact
    const { error: updateErr } = await insforge.database
      .from('products')
      .update({
        status: 'inactive',
        updated_at: new Date().toISOString(),
      })
      .eq('id', String(id));

    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Product marked as inactive in catalog.',
    });
  } catch (error: unknown) {
    console.error('Error deactivating product:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import {
  dbGetInventory,
  dbSaveInventoryItem,
  dbDeleteInventoryItem,
  dbUpdateInventoryStock,
  type InventoryItem,
} from '@/lib/githubDb';
import { verifyAdminRequest, unauthorizedAdminResponse } from '@/lib/auth/adminAuth';

function generateId() {
  return `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

/** GET /api/inventory — fetch all inventory items */
export async function GET() {
  try {
    const items = await dbGetInventory();
    const lowStock = items.filter((i) => i.stock <= i.lowStockThreshold).length;
    return NextResponse.json({ items, totalCount: items.length, lowStock });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** POST /api/inventory — add a new inventory item */
export async function POST(request: Request) {
  try {
    const auth = verifyAdminRequest(request);
    if (!auth.authorized) {
      return unauthorizedAdminResponse(auth.error);
    }

    const body = await request.json();
    if (!body.name || !body.category || body.price == null || body.stock == null) {
      return NextResponse.json({ error: 'name, category, price, stock are required' }, { status: 400 });
    }
    const item: InventoryItem = {
      id: body.id || generateId(),
      name: body.name,
      category: body.category,
      frameShape: body.frameShape || '',
      brand: body.brand || 'ALIG\'S WARE',
      sku: body.sku || '',
      price: Number(body.price),
      stock: Number(body.stock),
      lowStockThreshold: Number(body.lowStockThreshold) || 5,
      colors: body.colors || [],
      notes: body.notes || '',
      updatedAt: new Date().toISOString(),
    };
    await dbSaveInventoryItem(item);
    return NextResponse.json(item, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** PATCH /api/inventory — update stock or full item */
export async function PATCH(request: Request) {
  try {
    const auth = verifyAdminRequest(request);
    if (!auth.authorized) {
      return unauthorizedAdminResponse(auth.error);
    }

    const body = await request.json();
    const { id } = body;
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    // Quick stock-only update
    if (body.stockOnly) {
      await dbUpdateInventoryStock(id, Number(body.stock));
      return NextResponse.json({ success: true, id, stock: body.stock });
    }

    // Full item update
    const item: InventoryItem = {
      id,
      name: body.name,
      category: body.category,
      frameShape: body.frameShape || '',
      brand: body.brand || 'ALIG\'S WARE',
      sku: body.sku || '',
      price: Number(body.price),
      stock: Number(body.stock),
      lowStockThreshold: Number(body.lowStockThreshold) || 5,
      colors: body.colors || [],
      notes: body.notes || '',
      updatedAt: new Date().toISOString(),
    };
    await dbSaveInventoryItem(item);
    return NextResponse.json({ success: true, item });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** DELETE /api/inventory — delete an item by id */
export async function DELETE(request: Request) {
  try {
    const auth = verifyAdminRequest(request);
    if (!auth.authorized) {
      return unauthorizedAdminResponse(auth.error);
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    await dbDeleteInventoryItem(id);
    return NextResponse.json({ success: true, id });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

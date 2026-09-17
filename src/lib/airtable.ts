/**
 * src/lib/airtable.ts
 * Integration with Airtable REST API for live inventory synchronization.
 * Zero external dependencies — uses native fetch for optimal speed and reliability.
 */

import { InventoryItem } from './githubDb';

export interface AirtableConfig {
  apiKey?: string;
  baseId?: string;
  tableName?: string;
  syncEnabled?: boolean;
  lastSync?: string;
}

interface AirtableRecord {
  id: string;
  fields: Record<string, unknown>;
  createdTime?: string;
}

interface AirtableListResponse {
  records?: AirtableRecord[];
  offset?: string;
  error?: { type: string; message: string };
}

/**
 * Resolves active Airtable configuration from parameters, environment variables, or defaults
 */
export function resolveAirtableConfig(override?: Partial<AirtableConfig>): AirtableConfig {
  return {
    apiKey: override?.apiKey || process.env.AIRTABLE_PERSONAL_ACCESS_TOKEN || process.env.AIRTABLE_API_KEY || '',
    baseId: override?.baseId || process.env.AIRTABLE_BASE_ID || '',
    tableName: override?.tableName || process.env.AIRTABLE_TABLE_NAME || 'Inventory',
    syncEnabled: override?.syncEnabled !== undefined ? override.syncEnabled : true,
    lastSync: override?.lastSync,
  };
}

/**
 * Tests connection with Airtable using given credentials
 */
export async function testAirtableConnection(config: AirtableConfig): Promise<{
  success: boolean;
  recordCount?: number;
  error?: string;
}> {
  if (!config.apiKey || !config.baseId) {
    return { success: false, error: 'Airtable Access Token aur Base ID zaroori hain.' };
  }

  const table = encodeURIComponent(config.tableName || 'Inventory');
  const url = `https://api.airtable.com/v0/${config.baseId}/${table}?maxRecords=1`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${config.apiKey.trim()}`,
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      const errData = (await res.json().catch(() => ({}))) as AirtableListResponse;
      const msg = errData?.error?.message || `HTTP ${res.status}: ${res.statusText}`;
      return { success: false, error: msg };
    }

    const data = (await res.json()) as AirtableListResponse;
    return { success: true, recordCount: data.records?.length || 0 };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Network error';
    return { success: false, error: msg };
  }
}

/**
 * Maps an Airtable record into an InventoryItem
 */
export function mapAirtableToInventory(record: AirtableRecord): InventoryItem {
  const f = record.fields;

  // Case-insensitive / alias resolution for fields
  const name = String(f.Name || f.name || f.Title || f.title || f['Product Name'] || 'Unnamed Frame');
  const category = String(f.Category || f.category || f.Type || 'Eyeglasses');
  const frameShape = String(f.Shape || f.shape || f['Frame Shape'] || f.frameShape || '');
  const brand = String(f.Brand || f.brand || "ALIG'S WARE");
  const sku = String(f.SKU || f.sku || f.Code || f.code || '');
  const price = Number(f.Price || f.price || f.MRP || 0);
  const stock = Number(f.Stock || f.stock || f.Quantity || f.quantity || 0);
  const lowStockThreshold = Number(f.LowStockThreshold || f['Low Stock Alert'] || 5);
  const notes = String(f.Notes || f.notes || f.Description || f.description || '');

  // Colors can be array, comma string, or single string
  let colors: string[] = [];
  if (Array.isArray(f.Colors)) {
    colors = f.Colors.map(String);
  } else if (typeof f.Colors === 'string') {
    colors = f.Colors.split(',').map((c) => c.trim()).filter(Boolean);
  } else if (f.Color) {
    colors = [String(f.Color)];
  }

  return {
    id: record.id,
    name,
    category,
    frameShape,
    brand,
    sku,
    price,
    stock,
    lowStockThreshold,
    colors,
    notes,
    updatedAt: record.createdTime || new Date().toISOString(),
  };
}

/**
 * Fetches all inventory items from Airtable
 */
export async function fetchAirtableInventory(config: AirtableConfig): Promise<{
  success: boolean;
  items: InventoryItem[];
  error?: string;
}> {
  if (!config.apiKey || !config.baseId) {
    return { success: false, items: [], error: 'Airtable credentials missing' };
  }

  const table = encodeURIComponent(config.tableName || 'Inventory');
  let allRecords: AirtableRecord[] = [];
  let offset: string | undefined = undefined;

  try {
    do {
      const url = `https://api.airtable.com/v0/${config.baseId}/${table}${offset ? `?offset=${offset}` : ''}`;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${config.apiKey.trim()}`,
          Accept: 'application/json',
        },
        cache: 'no-store',
      });

      if (!res.ok) {
        const errData = (await res.json().catch(() => ({}))) as AirtableListResponse;
        return {
          success: false,
          items: [],
          error: errData?.error?.message || `Airtable error ${res.status}`,
        };
      }

      const data = (await res.json()) as AirtableListResponse;
      if (data.records) {
        allRecords = allRecords.concat(data.records);
      }
      offset = data.offset;
    } while (offset);

    const items = allRecords.map(mapAirtableToInventory);
    return { success: true, items };
  } catch (err) {
    return {
      success: false,
      items: [],
      error: err instanceof Error ? err.message : 'Failed to fetch from Airtable',
    };
  }
}

/**
 * Updates an existing item's stock in Airtable
 */
export async function updateAirtableRecordStock(
  config: AirtableConfig,
  recordId: string,
  newStock: number
): Promise<boolean> {
  if (!config.apiKey || !config.baseId || !recordId) return false;

  const table = encodeURIComponent(config.tableName || 'Inventory');
  const url = `https://api.airtable.com/v0/${config.baseId}/${table}/${recordId}`;

  try {
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${config.apiKey.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          Stock: newStock,
        },
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

/**
 * Creates a new product row in Airtable
 */
export async function createAirtableProduct(
  config: AirtableConfig,
  item: Partial<InventoryItem>
): Promise<{ success: boolean; recordId?: string; error?: string }> {
  if (!config.apiKey || !config.baseId) {
    return { success: false, error: 'Airtable credentials not configured' };
  }

  const table = encodeURIComponent(config.tableName || 'Inventory');
  const url = `https://api.airtable.com/v0/${config.baseId}/${table}`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.apiKey.trim()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: {
          Name: item.name,
          Category: item.category,
          'Frame Shape': item.frameShape || '',
          Brand: item.brand || "ALIG'S WARE",
          SKU: item.sku || '',
          Price: item.price || 0,
          Stock: item.stock || 0,
          LowStockThreshold: item.lowStockThreshold || 5,
          Notes: item.notes || '',
        },
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err?.error?.message || 'Airtable save error' };
    }

    const data = (await res.json()) as { id: string };
    return { success: true, recordId: data.id };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Network error' };
  }
}

/**
 * Deletes a record from Airtable
 */
export async function deleteAirtableRecord(config: AirtableConfig, recordId: string): Promise<boolean> {
  if (!config.apiKey || !config.baseId || !recordId) return false;

  const table = encodeURIComponent(config.tableName || 'Inventory');
  const url = `https://api.airtable.com/v0/${config.baseId}/${table}/${recordId}`;

  try {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${config.apiKey.trim()}`,
      },
    });
    return res.ok;
  } catch {
    return false;
  }
}

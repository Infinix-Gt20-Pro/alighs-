/**
 * src/lib/wordpress.ts
 * Headless WordPress & WooCommerce REST API integration for ALIG'S WARE.
 * Connects any free WordPress / WooCommerce installation to the Next.js Vercel website.
 */

import { InventoryItem } from './githubDb';

export interface WordPressConfig {
  siteUrl: string;
  consumerKey?: string;
  consumerSecret?: string;
  syncEnabled?: boolean;
  lastSync?: string;
}

interface WcProduct {
  id: number;
  name: string;
  slug: string;
  price: string;
  regular_price: string;
  stock_quantity: number | null;
  stock_status: string;
  categories: { id: number; name: string }[];
  images: { id: number; src: string; name: string }[];
  short_description?: string;
  sku?: string;
}

/**
 * Normalizes WordPress site URL (removes trailing slashes)
 */
export function cleanWpUrl(url: string): string {
  let cleaned = url.trim().replace(/\/+$/, '');
  if (!cleaned.startsWith('http://') && !cleaned.startsWith('https://')) {
    cleaned = 'https://' + cleaned;
  }
  return cleaned;
}

/**
 * Tests connection with WordPress site
 */
export async function testWordPressConnection(config: WordPressConfig): Promise<{
  success: boolean;
  siteName?: string;
  hasWooCommerce?: boolean;
  productCount?: number;
  error?: string;
}> {
  if (!config.siteUrl) {
    return { success: false, error: 'WordPress site URL zaroori hai' };
  }

  const base = cleanWpUrl(config.siteUrl);

  try {
    // 1. Test WordPress core REST API
    const wpRes = await fetch(`${base}/wp-json/`, {
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });

    if (!wpRes.ok) {
      return {
        success: false,
        error: `WordPress connect nahi hua (HTTP ${wpRes.status}). Kripya URL check karein.`,
      };
    }

    const wpData = await wpRes.json().catch(() => ({}));
    const siteName = wpData?.name || 'WordPress Site';
    const namespaces = (wpData?.namespaces as string[]) || [];
    const hasWooCommerce = namespaces.some((ns) => ns.startsWith('wc/'));

    // 2. If WooCommerce keys provided, test WooCommerce API
    let productCount = 0;
    if (config.consumerKey && config.consumerSecret) {
      const authHeader = 'Basic ' + Buffer.from(`${config.consumerKey}:${config.consumerSecret}`).toString('base64');
      const wcRes = await fetch(`${base}/wp-json/wc/v3/products?per_page=1`, {
        headers: {
          Authorization: authHeader,
          Accept: 'application/json',
        },
        cache: 'no-store',
      });

      if (wcRes.ok) {
        const total = wcRes.headers.get('x-wp-total');
        productCount = total ? parseInt(total, 10) : 0;
      }
    }

    return {
      success: true,
      siteName,
      hasWooCommerce,
      productCount,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Network error connecting to WordPress',
    };
  }
}

/**
 * Fetches products from WooCommerce and maps to InventoryItem
 */
export async function fetchWooCommerceProducts(config: WordPressConfig): Promise<{
  success: boolean;
  items: InventoryItem[];
  error?: string;
}> {
  if (!config.siteUrl || !config.consumerKey || !config.consumerSecret) {
    return { success: false, items: [], error: 'WooCommerce credentials missing' };
  }

  const base = cleanWpUrl(config.siteUrl);
  const authHeader = 'Basic ' + Buffer.from(`${config.consumerKey}:${config.consumerSecret}`).toString('base64');

  try {
    const res = await fetch(`${base}/wp-json/wc/v3/products?per_page=100`, {
      headers: {
        Authorization: authHeader,
        Accept: 'application/json',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return { success: false, items: [], error: `WooCommerce error (HTTP ${res.status})` };
    }

    const products: WcProduct[] = await res.json();
    const items: InventoryItem[] = products.map((p) => {
      const category = p.categories?.[0]?.name || 'Eyeglasses';
      const price = parseFloat(p.price || p.regular_price || '0');
      const stock = p.stock_quantity ?? (p.stock_status === 'instock' ? 10 : 0);

      return {
        id: `wc-${p.id}`,
        name: p.name,
        category,
        brand: "ALIG'S WARE",
        sku: p.sku || `WC-${p.id}`,
        price,
        stock,
        lowStockThreshold: 5,
        notes: p.short_description?.replace(/<[^>]*>/g, '') || '',
        updatedAt: new Date().toISOString(),
      };
    });

    return { success: true, items };
  } catch (err) {
    return {
      success: false,
      items: [],
      error: err instanceof Error ? err.message : 'Failed to fetch WooCommerce products',
    };
  }
}

/**
 * Updates stock in WooCommerce directly
 */
export async function updateWooCommerceStock(
  config: WordPressConfig,
  wcProductId: number | string,
  newStock: number
): Promise<boolean> {
  if (!config.siteUrl || !config.consumerKey || !config.consumerSecret) return false;

  const id = String(wcProductId).replace('wc-', '');
  const base = cleanWpUrl(config.siteUrl);
  const authHeader = 'Basic ' + Buffer.from(`${config.consumerKey}:${config.consumerSecret}`).toString('base64');

  try {
    const res = await fetch(`${base}/wp-json/wc/v3/products/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        manage_stock: true,
        stock_quantity: newStock,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

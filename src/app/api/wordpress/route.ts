import { NextResponse } from 'next/server';
import {
  testWordPressConnection,
  fetchWooCommerceProducts,
  updateWooCommerceStock,
  cleanWpUrl,
  WordPressConfig,
} from '@/lib/wordpress';
import { dbSetInventory, dbGetInventory } from '@/lib/githubDb';

// In-memory / env fallback for WordPress config
let memoryWpConfig: WordPressConfig = {
  siteUrl: process.env.WORDPRESS_URL || '',
  consumerKey: process.env.WOOCOMMERCE_KEY || '',
  consumerSecret: process.env.WOOCOMMERCE_SECRET || '',
  syncEnabled: true,
};

/**
 * GET /api/wordpress — returns connection status
 */
export async function GET() {
  try {
    const isConfigured = Boolean(memoryWpConfig.siteUrl);
    let connectionOk = false;
    let siteName = '';
    let hasWooCommerce = false;
    let productCount = 0;
    let errorMsg: string | undefined;

    if (isConfigured) {
      const test = await testWordPressConnection(memoryWpConfig);
      connectionOk = test.success;
      siteName = test.siteName || '';
      hasWooCommerce = test.hasWooCommerce || false;
      productCount = test.productCount || 0;
      errorMsg = test.error;
    }

    return NextResponse.json({
      configured: isConfigured,
      connected: connectionOk,
      siteName,
      hasWooCommerce,
      productCount,
      error: errorMsg,
      config: {
        siteUrl: memoryWpConfig.siteUrl,
        hasKeys: Boolean(memoryWpConfig.consumerKey && memoryWpConfig.consumerSecret),
        syncEnabled: memoryWpConfig.syncEnabled,
        lastSync: memoryWpConfig.lastSync || null,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * POST /api/wordpress — test, save_config, sync
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const action = body.action || 'sync';

    // 1. TEST CONNECTION
    if (action === 'test') {
      const { siteUrl, consumerKey, consumerSecret } = body;
      if (!siteUrl) {
        return NextResponse.json({ error: 'WordPress URL zaroori hai' }, { status: 400 });
      }
      const test = await testWordPressConnection({
        siteUrl: cleanWpUrl(siteUrl),
        consumerKey,
        consumerSecret,
      });
      return NextResponse.json(test);
    }

    // 2. SAVE CONFIG
    if (action === 'save_config') {
      const { siteUrl, consumerKey, consumerSecret, syncEnabled } = body;
      if (!siteUrl) {
        return NextResponse.json({ error: 'WordPress URL zaroori hai' }, { status: 400 });
      }

      memoryWpConfig = {
        siteUrl: cleanWpUrl(siteUrl),
        consumerKey: consumerKey ? consumerKey.trim() : memoryWpConfig.consumerKey,
        consumerSecret: consumerSecret ? consumerSecret.trim() : memoryWpConfig.consumerSecret,
        syncEnabled: syncEnabled !== undefined ? Boolean(syncEnabled) : true,
      };

      const test = await testWordPressConnection(memoryWpConfig);
      return NextResponse.json({
        success: true,
        testResult: test,
        message: 'WordPress settings save ho gayi hain!',
      });
    }

    // 3. SYNC PRODUCTS FROM WOOCOMMERCE
    if (action === 'sync') {
      if (!memoryWpConfig.siteUrl || !memoryWpConfig.consumerKey || !memoryWpConfig.consumerSecret) {
        return NextResponse.json(
          { error: 'Pehle WordPress URL aur WooCommerce API Keys save karein.' },
          { status: 400 }
        );
      }

      const fetchRes = await fetchWooCommerceProducts(memoryWpConfig);
      if (!fetchRes.success) {
        return NextResponse.json({ error: fetchRes.error }, { status: 502 });
      }

      const wcItems = fetchRes.items;
      const now = new Date().toISOString();

      if (wcItems.length > 0) {
        const current = await dbGetInventory();
        // Merge without losing non-WC items
        const nonWcItems = current.filter((i) => !i.id.startsWith('wc-'));
        await dbSetInventory([...wcItems, ...nonWcItems]);
      }

      memoryWpConfig.lastSync = now;

      return NextResponse.json({
        success: true,
        syncedCount: wcItems.length,
        lastSync: now,
        items: wcItems,
        message: `${wcItems.length} products WordPress / WooCommerce se sync ho gaye!`,
      });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * PATCH /api/wordpress — update stock in WooCommerce
 */
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { productId, stock } = body;

    if (!productId || stock === undefined) {
      return NextResponse.json({ error: 'productId aur stock zaroori hain' }, { status: 400 });
    }

    const ok = await updateWooCommerceStock(memoryWpConfig, productId, Number(stock));
    return NextResponse.json({ success: ok, productId, stock });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

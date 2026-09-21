import { NextResponse } from 'next/server';
import {
  dbGetAirtableConfig,
  dbSaveAirtableConfig,
  dbSetInventory,
  dbGetInventory,
} from '@/lib/githubDb';
import {
  resolveAirtableConfig,
  testAirtableConnection,
  fetchAirtableInventory,
  updateAirtableRecordStock,
  AirtableConfig,
} from '@/lib/airtable';
import { verifyAdminRequest, unauthorizedAdminResponse } from '@/lib/auth/adminAuth';

function maskKey(key?: string): string {
  if (!key) return '';
  if (key.length <= 8) return '********';
  return key.slice(0, 4) + '...' + key.slice(-4);
}

/**
 * GET /api/inventory/airtable
 * Returns connection status and config metadata
 */
export async function GET(request: Request) {
  try {
    const auth = verifyAdminRequest(request);
    if (!auth.authorized) {
      return unauthorizedAdminResponse(auth.error);
    }

    const savedConfig = await dbGetAirtableConfig();
    const config = resolveAirtableConfig(savedConfig);

    const hasCreds = Boolean(config.apiKey && config.baseId);
    let connectionOk = false;
    let recordCount = 0;
    let errorMsg: string | undefined;

    if (hasCreds) {
      const test = await testAirtableConnection(config);
      connectionOk = test.success;
      recordCount = test.recordCount || 0;
      errorMsg = test.error;
    }

    return NextResponse.json({
      configured: hasCreds,
      connected: connectionOk,
      recordCount,
      error: errorMsg,
      config: {
        baseId: config.baseId,
        tableName: config.tableName || 'Inventory',
        maskedKey: maskKey(config.apiKey),
        syncEnabled: config.syncEnabled ?? true,
        lastSync: config.lastSync || null,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * POST /api/inventory/airtable
 * Actions: 'sync' | 'test' | 'save_config'
 */
export async function POST(request: Request) {
  try {
    const auth = verifyAdminRequest(request);
    if (!auth.authorized) {
      return unauthorizedAdminResponse(auth.error);
    }

    const body = await request.json();
    const action = body.action || 'sync';

    // 1. SAVE CONFIGURATION
    if (action === 'save_config') {
      const { apiKey, baseId, tableName, syncEnabled } = body;
      if (!baseId) {
        return NextResponse.json({ error: 'Base ID zaroori hai' }, { status: 400 });
      }

      const current = await dbGetAirtableConfig();
      const updatedConfig: AirtableConfig = {
        apiKey: apiKey ? apiKey.trim() : current.apiKey,
        baseId: baseId.trim(),
        tableName: (tableName || 'Inventory').trim(),
        syncEnabled: syncEnabled !== undefined ? Boolean(syncEnabled) : true,
      };

      // Test before saving if key is provided
      const resolved = resolveAirtableConfig(updatedConfig);
      const test = await testAirtableConnection(resolved);
      if (!test.success) {
        return NextResponse.json(
          {
            error: `Connection test fail hua: ${test.error}. Kripya Token aur Base ID check karein.`,
            testFailed: true,
          },
          { status: 400 }
        );
      }

      await dbSaveAirtableConfig(updatedConfig);
      return NextResponse.json({
        success: true,
        message: 'Airtable settings save ho gayi hain aur connection successful hai!',
      });
    }

    // 2. TEST CONNECTION ONLY
    if (action === 'test') {
      const { apiKey, baseId, tableName } = body;
      const config = resolveAirtableConfig({
        apiKey,
        baseId,
        tableName: tableName || 'Inventory',
      });
      const test = await testAirtableConnection(config);
      return NextResponse.json(test);
    }

    // 3. TRIGGER FULL SYNC
    if (action === 'sync') {
      const savedConfig = await dbGetAirtableConfig();
      const config = resolveAirtableConfig(savedConfig);

      if (!config.apiKey || !config.baseId) {
        return NextResponse.json(
          { error: 'Pehle Airtable connect karein (Access Token aur Base ID daalein).' },
          { status: 400 }
        );
      }

      const fetchRes = await fetchAirtableInventory(config);
      if (!fetchRes.success) {
        return NextResponse.json({ error: fetchRes.error }, { status: 502 });
      }

      const airtableItems = fetchRes.items;
      const now = new Date().toISOString();

      // If Airtable has items, replace/sync with DB
      if (airtableItems.length > 0) {
        await dbSetInventory(airtableItems);
      }

      await dbSaveAirtableConfig({
        ...savedConfig,
        lastSync: now,
      });

      return NextResponse.json({
        success: true,
        message: `${airtableItems.length} products Airtable se website par sync ho gaye!`,
        syncedCount: airtableItems.length,
        lastSync: now,
        items: airtableItems,
      });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * PATCH /api/inventory/airtable
 * Quick update to a record's stock in Airtable
 */
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { recordId, stock } = body;

    if (!recordId || stock === undefined) {
      return NextResponse.json({ error: 'recordId aur stock zaroori hain' }, { status: 400 });
    }

    const savedConfig = await dbGetAirtableConfig();
    const config = resolveAirtableConfig(savedConfig);

    // If it's an Airtable record ID (starts with 'rec')
    if (recordId.startsWith('rec') && config.apiKey && config.baseId) {
      const ok = await updateAirtableRecordStock(config, recordId, Number(stock));
      return NextResponse.json({ success: ok, recordId, stock });
    }

    return NextResponse.json({ success: true, localOnly: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

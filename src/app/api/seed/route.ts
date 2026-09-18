import { NextResponse } from 'next/server';

/**
 * POST /api/seed
 * DISABLED — This endpoint has been removed for security.
 * Seeding is no longer needed; the database module auto-seeds from products-data.ts
 * when initialised with an empty store.
 */
export async function POST() {
  return NextResponse.json(
    { error: 'Seed endpoint is disabled in production.' },
    { status: 403 }
  );
}

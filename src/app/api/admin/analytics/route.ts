import { NextResponse } from 'next/server';
import { getAnalytics } from '@/lib/database/db';

export async function GET() {
  try {
    const analytics = await getAnalytics();
    return NextResponse.json({ success: true, analytics });
  } catch (error: unknown) {
    console.error('Error fetching analytics:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
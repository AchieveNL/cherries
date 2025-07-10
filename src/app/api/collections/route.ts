import { NextResponse } from 'next/server';

import { getCollections } from '@/lib/shopify';

export async function GET() {
  try {
    const { collections } = await getCollections({
      sortKey: 'TITLE',
    });

    return NextResponse.json({ collections });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch collections' }, { status: 500 });
  }
}

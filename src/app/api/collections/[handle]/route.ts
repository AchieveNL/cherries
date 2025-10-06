import { NextRequest, NextResponse } from 'next/server';

import { getCollectionWithProducts } from '@/lib/shopify'; // Your existing Shopify function

export async function GET(request: NextRequest, { params }: { params: { handle: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const maxProducts = parseInt(searchParams.get('maxProducts') || '4', 10);

    const { handle } = params;

    if (!handle) {
      return NextResponse.json({ error: 'Collection handle is required' }, { status: 400 });
    }

    // Call your existing Shopify function
    const data = await getCollectionWithProducts(handle, {
      first: maxProducts,
      sortKey: 'COLLECTION_DEFAULT',
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching collection:', error);
    return NextResponse.json({ error: 'Failed to fetch collection' }, { status: 500 });
  }
}

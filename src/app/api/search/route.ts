import { NextRequest, NextResponse } from 'next/server';

import { searchProducts } from '@/lib/shopify'; // Your existing function

export async function POST(request: NextRequest) {
  try {
    const { query, type, first = 10 } = await request.json();

    if (type === 'products') {
      const { products } = await searchProducts({
        query,
        first,
        sortKey: 'RELEVANCE',
      });

      return NextResponse.json({ products });
    }

    return NextResponse.json({ products: [], pages: [] });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}

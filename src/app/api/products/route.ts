import { NextRequest, NextResponse } from 'next/server';

import { getProducts } from '@/lib/shopify';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '8');
    const sortKey = searchParams.get('sortKey') || 'BEST_SELLING';
    const excludeId = searchParams.get('excludeId');

    const { products } = await getProducts({
      first: limit * 2, // Get more to filter if needed
      sortKey: sortKey as any,
      reverse: false,
    });

    // Filter out excluded product if provided
    const filteredProducts = excludeId ? products.filter((product) => product.id !== excludeId) : products;

    return NextResponse.json({
      products: filteredProducts.slice(0, limit),
    });
  } catch (error) {
    console.error('API error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

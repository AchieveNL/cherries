import { NextRequest, NextResponse } from 'next/server';

import { getProductRecommendations } from '@/lib/shopify';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const intent = searchParams.get('intent') || 'RELATED';
    const limit = parseInt(searchParams.get('limit') || '8');

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const recommendations = await getProductRecommendations(productId, intent as 'RELATED' | 'COMPLEMENTARY', limit);

    return NextResponse.json({
      products: recommendations,
    });
  } catch (error) {
    console.error('API error fetching recommendations:', error);
    return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';

import { getProducts } from '@/lib/shopify';

// Force this route to be dynamic
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '3');

    const response = await getProducts({
      first: limit,
      sortKey: 'CREATED_AT',
      reverse: true, // Most recent first
    });

    // Transform the data
    const transformedProducts = response.products.slice(0, limit).map((product, index) => ({
      id: product.id || `product-${index}`,
      title: product.title || product.title?.split(' ')[0]?.toUpperCase() || `PRODUCT ${index + 1}`,
      image: product.featuredImage?.url || product.images?.nodes?.[0]?.url || '/placeholder-image.jpg',
      alt: product.featuredImage?.altText || product.images?.nodes?.[0]?.altText || product.title || 'Product image',
      handle: product.handle || `product-${index}`,
    }));

    return NextResponse.json({
      success: true,
      products: transformedProducts,
    });
  } catch (error: any) {
    console.error('Error fetching latest products:', error);

    // Return fallback data in case of error
    const fallbackProducts = [
      {
        id: '1',
        title: 'PHONE CASE',
        image: '/landingPage/new/new-1.webp',
        alt: 'Fashion model with phone case',
        handle: 'phone-case',
      },
      {
        id: '2',
        title: 'AIRPOD',
        image: '/landingPage/new/new-2.webp',
        alt: 'Fashion model with airpods',
        handle: 'airpod',
      },
      {
        id: '3',
        title: 'SMARTWATCH',
        image: '/landingPage/new/new-3.webp',
        alt: 'Fashion model with smartwatch',
        handle: 'smartwatch',
      },
    ];

    return NextResponse.json(
      {
        success: false,
        error: error.message,
        products: fallbackProducts,
      },
      { status: 200 }
    ); // Return 200 with fallback data
  }
}

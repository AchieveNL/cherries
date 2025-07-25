// hooks/useAnalytics.ts
'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import { trackAddToCart, trackCollectionView, trackPageView, trackProductView, trackSearch } from '@/lib/analytics';

// Create safe types to avoid Shopify type conflicts
interface SafeProduct {
  id?: string;
  title?: string;
  vendor?: string;
  productType?: string;
  handle?: string;
}

interface SafeCollection {
  id?: string;
  title?: string;
  handle?: string;
}

interface SafeVariant {
  id?: string;
  title?: string;
  sku?: string;
  price?: {
    amount?: string;
  };
}

// Hook for page view tracking - FIXED: No useSearchParams
export function usePageViewTracking() {
  const pathname = usePathname();

  useEffect(() => {
    // Determine page type based on pathname
    let pageType: 'home' | 'product' | 'collection' | 'cart' | 'search' | 'page' = 'page';

    if (pathname === '/') {
      pageType = 'home';
    } else if (pathname.startsWith('/products/')) {
      pageType = 'product';
    } else if (pathname.startsWith('/collections/')) {
      pageType = 'collection';
    } else if (pathname === '/cart') {
      pageType = 'cart';
    } else if (pathname === '/search') {
      pageType = 'search';
    }

    // Get search params safely on client side only
    const searchParams =
      typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();

    // Track page view
    trackPageView({
      url: typeof window !== 'undefined' ? window.location.href : '',
      path: pathname,
      search: searchParams.toString(),
      title: typeof document !== 'undefined' ? document.title : '',
      pageType,
      searchString: searchParams.get('q') || undefined,
    });
  }, [pathname]);
}

// Hook for product view tracking with safe types
export function useProductViewTracking(product: SafeProduct | null, selectedVariant?: SafeVariant | null) {
  useEffect(() => {
    if (!product?.id || !selectedVariant?.id) return;

    try {
      trackProductView({
        id: product.id,
        title: product.title || '',
        price: selectedVariant.price?.amount || '0',
        vendor: product.vendor || '',
        productType: product.productType || '',
        variantId: selectedVariant.id,
        variantTitle: selectedVariant.title || '',
        sku: selectedVariant.sku || '',
        quantity: 1,
      });
    } catch (error) {
      console.warn('Failed to track product view:', error);
    }
  }, [product, selectedVariant]);
}

// Hook for collection view tracking with safe types
export function useCollectionViewTracking(collection: SafeCollection | null) {
  useEffect(() => {
    if (!collection?.id) return;

    try {
      trackCollectionView({
        id: collection.id,
        title: collection.title || '',
        handle: collection.handle || '',
      });
    } catch (error) {
      console.warn('Failed to track collection view:', error);
    }
  }, [collection]);
}

// Hook for search tracking
export function useSearchTracking(query: string, resultCount?: number) {
  useEffect(() => {
    if (!query?.trim()) return;

    const timeoutId = setTimeout(() => {
      try {
        trackSearch(query, resultCount);
      } catch (error) {
        console.warn('Failed to track search:', error);
      }
    }, 500); // Debounce search tracking

    return () => clearTimeout(timeoutId);
  }, [query, resultCount]);
}

// Hook for add to cart tracking
export function useAddToCartTracking() {
  const trackAddToCartEvent = (payload: {
    cartId: string;
    product: {
      id: string;
      title: string;
      price: string;
      quantity: number;
      variantId: string;
      variantTitle?: string;
      vendor?: string;
      productType?: string;
      sku?: string;
    };
    totalValue?: number;
  }) => {
    try {
      trackAddToCart(payload);
    } catch (error) {
      console.warn('Failed to track add to cart:', error);
    }
  };

  return { trackAddToCartEvent };
}

// Combined analytics hook for convenience
export function useAnalytics() {
  return {
    trackPageView,
    trackProductView,
    trackCollectionView,
    trackSearch,
    trackAddToCart,
  };
}

// Type-safe wrapper functions for direct calls
export function safeTrackProductView(product: any, variant: any) {
  if (!product?.id || !variant?.id) return;

  try {
    trackProductView({
      id: String(product.id),
      title: String(product.title || ''),
      price: String(variant.price?.amount || '0'),
      vendor: String(product.vendor || ''),
      productType: String(product.productType || ''),
      variantId: String(variant.id),
      variantTitle: String(variant.title || ''),
      sku: String(variant.sku || ''),
      quantity: 1,
    });
  } catch (error) {
    console.warn('Failed to track product view:', error);
  }
}

export function safeTrackCollectionView(collection: any) {
  if (!collection?.id) return;

  try {
    trackCollectionView({
      id: String(collection.id),
      title: String(collection.title || ''),
      handle: String(collection.handle || ''),
    });
  } catch (error) {
    console.warn('Failed to track collection view:', error);
  }
}

export function safeTrackAddToCart(cartId: string, product: any, variant: any, quantity: number = 1) {
  if (!cartId || !product?.id || !variant?.id) return;

  try {
    trackAddToCart({
      cartId,
      product: {
        id: String(product.id),
        title: String(product.title || ''),
        price: String(variant.price?.amount || '0'),
        quantity,
        variantId: String(variant.id),
        variantTitle: String(variant.title || ''),
        vendor: String(product.vendor || ''),
        productType: String(product.productType || ''),
        sku: String(variant.sku || ''),
      },
      totalValue: parseFloat(variant.price?.amount || '0') * quantity,
    });
  } catch (error) {
    console.warn('Failed to track add to cart:', error);
  }
}

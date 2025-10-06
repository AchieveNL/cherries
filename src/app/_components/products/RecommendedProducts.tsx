'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import ProductCard from './ProductCard';

import type { Product } from '@shopify/hydrogen-react/storefront-api-types';
import type { PartialDeep } from 'type-fest';

interface RecommendedProductsProps {
  /** Current product ID for getting related products */
  productId?: string;
  /** Title for the section */
  title?: string;
  /** Number of products to show */
  limit?: number;
  /** Use specific products instead of fetching */
  products?: PartialDeep<Product, { recurseIntoArrays: true }>[];
  /** Loading state override */
  isLoading?: boolean;
  /** Recommendation intent */
  intent?: 'RELATED' | 'COMPLEMENTARY';
  /** Custom CSS classes */
  className?: string;
}

const RecommendedProducts: React.FC<RecommendedProductsProps> = ({
  productId,
  title = 'recommended products',
  limit = 4,
  products: providedProducts,
  isLoading: providedLoading = false,
  intent = 'RELATED',
  className = '',
}) => {
  const [products, setProducts] = useState<PartialDeep<Product, { recurseIntoArrays: true }>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use refs to prevent unnecessary re-renders and stale closures
  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Stable fetch functions with useCallback
  const fetchBestSellingProducts = useCallback(async () => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        limit: (limit * 2).toString(),
        sortKey: 'BEST_SELLING',
        ...(productId && { excludeId: productId }),
      });

      const response = await fetch(`/api/products?${params}`, {
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();

      // Check if component is still mounted and request wasn't aborted
      if (!isMountedRef.current || controller.signal.aborted) {
        return;
      }

      setProducts(data.products.slice(0, limit));
    } catch (err: any) {
      if (!controller.signal.aborted && isMountedRef.current) {
        console.error('Error fetching best-selling products:', err);
        setError('Failed to load products');
      }
    } finally {
      if (!controller.signal.aborted && isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [limit, productId]);

  const fetchRecommendations = useCallback(async () => {
    if (!productId) return;

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setIsLoading(true);
      setError(null);

      const params = new URLSearchParams({
        productId,
        intent,
        limit: limit.toString(),
      });

      const response = await fetch(`/api/products/recommendations?${params}`, {
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }

      const data = await response.json();

      // Check if component is still mounted and request wasn't aborted
      if (!isMountedRef.current || controller.signal.aborted) {
        return;
      }

      if (data.products && data.products.length > 0) {
        setProducts(data.products.slice(0, limit));
        setIsLoading(false);
      } else {
        // Fallback to best-selling products if no recommendations
        await fetchBestSellingProducts();
      }
    } catch (err: any) {
      if (!controller.signal.aborted && isMountedRef.current) {
        console.error('Error fetching product recommendations:', err);
        setError('Failed to load recommendations');
        // Fallback to best-selling products
        await fetchBestSellingProducts();
      }
    }
  }, [productId, intent, limit, fetchBestSellingProducts]);

  // Main effect with proper dependencies
  useEffect(() => {
    // Reset mounted ref
    isMountedRef.current = true;

    // If products are provided, use them instead of fetching
    if (providedProducts) {
      setProducts(providedProducts.slice(0, limit));
      setIsLoading(providedLoading);
      return;
    }

    // If no productId, fetch general best-selling products
    if (!productId) {
      fetchBestSellingProducts();
      return;
    }

    // Fetch product recommendations
    fetchRecommendations();

    // Cleanup function
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [productId, limit, providedProducts, providedLoading, intent, fetchBestSellingProducts, fetchRecommendations]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Memoized loading skeleton to prevent unnecessary re-renders
  const LoadingSkeleton = useCallback(
    () => (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: limit }, (_, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-pulse"
          >
            <div className="aspect-square bg-gray-200"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    ),
    [limit]
  );

  // Error state
  if (error && !isLoading && products.length === 0) {
    return (
      <section className={`py-12 bg-gray-50 ${className}`}>
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center">
            <p className="text-gray-500">Unable to load recommendations at this time.</p>
          </div>
        </div>
      </section>
    );
  }

  // Don't render if no products and not loading
  if (!isLoading && products.length === 0) {
    return null;
  }

  return (
    <section className={`py-12 ${className}`}>
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 font-bungee tracking-wide">{title}</h2>
          <div className="w-[164px] h-[6px] bg-primary mx-auto"></div>
        </div>

        {/* Products Grid or Loading */}
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} viewMode="grid" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default RecommendedProducts;

'use client';

import React, { useEffect, useState } from 'react';

import { getProductRecommendations, getProducts } from '@/lib/shopify'; // Your shopify API functions
import ProductCard from './ProductCard'; // Your existing ProductCard component

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
  title = 'RECOMMENDED',
  limit = 4,
  products: providedProducts,
  isLoading: providedLoading = false,
  intent = 'RELATED',
  className = '',
}) => {
  const [products, setProducts] = useState<PartialDeep<Product, { recurseIntoArrays: true }>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
  }, [productId, limit, providedProducts, providedLoading, intent]);

  const fetchRecommendations = async () => {
    if (!productId) return;

    try {
      setIsLoading(true);
      setError(null);

      // Try to get product recommendations first
      const recommendations = await getProductRecommendations(productId, intent);

      if (recommendations && recommendations.length > 0) {
        setProducts(recommendations.slice(0, limit));
      } else {
        // Fallback to best-selling products if no recommendations
        await fetchBestSellingProducts();
      }
    } catch (err) {
      console.error('Error fetching product recommendations:', err);
      setError('Failed to load recommendations');
      // Fallback to best-selling products
      await fetchBestSellingProducts();
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBestSellingProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { products: bestSelling } = await getProducts({
        first: limit * 2, // Get more to filter out current product
        sortKey: 'BEST_SELLING',
        reverse: false,
      });

      // Filter out current product if productId is provided
      const filteredProducts = productId ? bestSelling.filter((product) => product.id !== productId) : bestSelling;

      setProducts(filteredProducts.slice(0, limit));
    } catch (err) {
      console.error('Error fetching best-selling products:', err);
      setError('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(limit)].map((_, index) => (
        <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden animate-pulse">
          <div className="aspect-square bg-gray-200"></div>
          <div className="p-4">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
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
    <section className={`py-12  ${className}`}>
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2 font-bungee tracking-wide">{title}</h2>
          <div className="w-24 h-1 bg-primary mx-auto"></div>
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

        {/* View All Button - only show if we have products and might have more */}
        {!isLoading && products.length >= limit && (
          <div className="text-center mt-8">
            <a
              href="/products"
              className="bg-black text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors inline-block"
            >
              VIEW ALL PRODUCTS
            </a>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecommendedProducts;

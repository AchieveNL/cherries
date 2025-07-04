'use client';

import { useCallback, useRef, useState } from 'react';

import { ProductCard, ProductFilters, ProductsHeader } from '@/app/_components/products';
import { EmptyState, Pagination } from '@/app/_components/ui';
import { useProductFilters } from '@/hooks/useFilters';
import { ProductsPageProps } from '@/types';
import ProductFilter from './ProductFilter';

export default function ProductsPageComponent({
  products,
  collections,
  currentCollection,
  totalProducts,
  hasNextPage,
  hasPreviousPage,
}: ProductsPageProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { filters, setFilters, filteredProducts, filteredCount } = useProductFilters(products);

  // Use ref to store the latest setFilters function to avoid stale closures
  const setFiltersRef = useRef(setFilters);
  setFiltersRef.current = setFilters;

  // Create truly stable callback that doesn't depend on setFilters directly
  const handleFiltersChange = useCallback((newFilters: any) => {
    setFiltersRef.current(newFilters);
  }, []); // Empty dependency array makes this truly stable

  // Create stable callback for clearing filters
  const handleClearFilters = useCallback(() => {
    setFiltersRef.current({
      search: '',
      category: '',
      priceRange: [0, 1000],
      vendor: '',
      availability: 'all',
      sortBy: 'featured',
      collections: [],
    });
  }, []); // Empty dependency array makes this truly stable

  if (!products || products.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-4 py-8">
          <EmptyState
            title="No products found"
            description="We couldn't find any products to display."
            actionText="Go Home"
            onAction={() => (window.location.href = '/')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="mx-auto px-4 py-8">
        <div className="container mx-auto">
          <ProductsHeader currentCollection={currentCollection} totalProducts={totalProducts} />
        </div>

        {/* Pass all required props to ProductFilter */}
        <ProductFilter
          filters={filters}
          onFiltersChange={handleFiltersChange}
          products={products}
          collections={collections}
          currentCollection={currentCollection}
          totalProducts={totalProducts}
          filteredCount={filteredCount}
        />

        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <ProductFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                products={products}
                collections={collections}
                currentCollection={currentCollection}
              />
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {/* View Mode Controls */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 transition-colors ${
                      viewMode === 'grid' ? 'bg-secondary text-primary' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 transition-colors ${
                      viewMode === 'list' ? 'bg-secondary text-primary' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 10h16M4 14h16M4 18h16"
                      />
                    </svg>
                  </button>
                </div>
                {/* Results info */}
                <div className="text-sm text-gray-600">
                  {filteredCount !== products.length ? (
                    <span>
                      Showing {filteredCount} of {products.length} products
                    </span>
                  ) : (
                    <span>{products.length} products</span>
                  )}
                </div>
              </div>

              {filteredProducts.length === 0 ? (
                <EmptyState
                  title="No products match your filters"
                  description="Try adjusting your search or filter criteria"
                  actionText="Clear all filters"
                  onAction={handleClearFilters}
                />
              ) : (
                <>
                  <div
                    className={`grid gap-6 ${
                      viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'
                    }`}
                  >
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} viewMode={viewMode} />
                    ))}
                  </div>
                  {/* Pagination */}
                  <div className="mt-8">
                    <Pagination hasNextPage={hasNextPage} hasPreviousPage={hasPreviousPage} />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

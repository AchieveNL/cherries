'use client';

import { Suspense, useCallback, useMemo, useState } from 'react';

import { ProductCard, ProductsHeader } from '@/app/_components/products';
import { EmptyState, Pagination } from '@/app/_components/ui';
import { useProductFilters } from '@/hooks/useFilters';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import { FilterState, ProductsPageProps } from '@/types';
import ProductFilter from './ProductFilter';

// Separate component that uses useSearchParams
function ProductsContent({
  products,
  collections,
  currentCollection,
  totalProducts,
  hasNextPage,
  hasPreviousPage,
}: ProductsPageProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Initial filter state - useMemo to prevent recreation on every render
  const initialFilters: FilterState = useMemo(
    () => ({
      search: '',
      category: '',
      priceRange: [0, 1000] as [number, number],
      vendor: '',
      availability: 'all' as const,
      sortBy: 'featured' as const,
      collections: [],
    }),
    []
  );

  // Use URL-synchronized filters
  const { filters, updateFilters } = useUrlFilters(initialFilters);
  const { filteredProducts, filteredCount } = useProductFilters(products);

  // Create stable callback for clearing filters
  const handleClearFilters = useCallback(() => {
    updateFilters(initialFilters);
  }, [updateFilters, initialFilters]);

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

        <ProductFilter
          filters={filters}
          onFiltersChange={updateFilters}
          products={products}
          collections={collections}
          currentCollection={currentCollection}
          totalProducts={totalProducts}
          filteredCount={filteredCount}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Filters Sidebar */}
            {/* Products Grid */}
            <div className="col-span-full">
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
                      viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4' : 'grid-cols-1'
                    }`}
                  >
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} viewMode={viewMode} />
                    ))}
                  </div>
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

// Loading component
function ProductsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-4">
                <div className="h-48 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function ProductsPageComponent(props: ProductsPageProps) {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsContent {...props} />
    </Suspense>
  );
}

'use client';

import { Suspense, useCallback, useMemo, useState } from 'react';

import { ProductCard, ProductsHeader } from '@/app/_components/products';
import { EmptyState, Pagination } from '@/app/_components/ui';
import { useProductFilters } from '@/hooks/useFilters';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import { FilterState } from '@/types';
import Breadcrumbs from '../layout/Breadcrumbs';
import ProductFilter from './ProductFilter';

// Updated interface with currentCursor
interface ProductsPageComponentProps {
  products: any[];
  collections?: any[];
  currentCollection?: any;
  totalProducts: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage?: number;
  totalPages?: number;
  itemsPerPage?: number;
  initialFilters: FilterState;
  useClientFiltering?: boolean;
  hasError?: boolean;
  currentCursor?: string; // Add currentCursor to the interface
  pageInfo?: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string | undefined;
    endCursor?: string | undefined;
  };
}

function ProductsContent({
  products,
  collections,
  currentCollection,
  totalProducts,
  hasNextPage,
  hasPreviousPage,
  currentPage = 1,
  totalPages,
  itemsPerPage = 12,
  initialFilters,
  useClientFiltering = false,
  hasError = false,
  currentCursor, // Add currentCursor parameter
  pageInfo = {
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: undefined,
    endCursor: undefined,
  },
}: ProductsPageComponentProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [clientPage, setClientPage] = useState(1); // For client-side pagination

  // Use URL-synchronized filters
  const { filters, updateFilters } = useUrlFilters(initialFilters);

  // Use client-side filtering hook when needed
  const { filteredProducts, filteredCount } = useProductFilters(products, useClientFiltering ? filters : null);

  // Client-side pagination logic
  const { paginatedProducts, clientTotalPages, clientHasNextPage, clientHasPreviousPage } = useMemo(() => {
    if (!useClientFiltering) {
      return {
        paginatedProducts: products,
        clientTotalPages: totalPages,
        clientHasNextPage: hasNextPage,
        clientHasPreviousPage: hasPreviousPage,
      };
    }

    // Calculate client-side pagination
    const startIndex = (clientPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = filteredProducts.slice(startIndex, endIndex);
    const totalClientPages = Math.ceil(filteredCount / itemsPerPage);

    return {
      paginatedProducts: paginated,
      clientTotalPages: totalClientPages,
      clientHasNextPage: clientPage < totalClientPages,
      clientHasPreviousPage: clientPage > 1,
    };
  }, [
    useClientFiltering,
    filteredProducts,
    filteredCount,
    clientPage,
    itemsPerPage,
    products,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  ]);

  // Determine which products and count to use
  const displayProducts = useClientFiltering ? paginatedProducts : products;
  const displayCount = useClientFiltering ? filteredCount : totalProducts;

  // Reset client page when filters change
  const handleFiltersChange = useCallback(
    (newFilters: FilterState) => {
      updateFilters(newFilters);
      if (useClientFiltering) {
        setClientPage(1); // Reset to first page when filters change
      }
    },
    [updateFilters, useClientFiltering]
  );

  // Handle client-side page changes
  const handleClientPageChange = useCallback((page: number) => {
    setClientPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Create stable callback for clearing filters
  const handleClearFilters = useCallback(() => {
    const clearedFilters: FilterState = {
      search: '',
      category: '',
      priceRange: [0, 1000] as [number, number],
      vendor: '',
      availability: 'all' as const,
      sortBy: 'featured' as const,
      collections: [],
    };
    handleFiltersChange(clearedFilters);
  }, [handleFiltersChange]);

  // Handle error state
  if (hasError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Unable to load products</h1>
            <p className="text-gray-600 mb-6">Please try again later or contact support if the problem persists.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle no products from server (different from filtered empty state)
  if (!products || products.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-4 py-8">
          <ProductsHeader currentCollection={currentCollection} totalProducts={0} />

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
      <Breadcrumbs currentCollection={currentCollection} />
      <div className="mx-auto px-4 py-8">
        <div className="container mx-auto">
          <ProductsHeader currentCollection={currentCollection} totalProducts={totalProducts} />
        </div>

        <ProductFilter
          filters={filters}
          onFiltersChange={handleFiltersChange}
          products={products}
          collections={collections}
          currentCollection={currentCollection}
          totalProducts={totalProducts}
          filteredCount={displayCount}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="col-span-full">
              {/* Results info */}
              <div className="flex justify-between items-center mb-6">
                <div className="text-sm text-gray-600">
                  {useClientFiltering ? (
                    <span>
                      Showing {(clientPage - 1) * itemsPerPage + 1}-{Math.min(clientPage * itemsPerPage, displayCount)}{' '}
                      of <span className="font-medium text-primary">{displayCount}</span> products
                      {displayCount !== totalProducts && ' (filtered)'}
                    </span>
                  ) : (
                    <span>
                      Showing {(currentPage - 1) * itemsPerPage + 1}-
                      {Math.min(currentPage * itemsPerPage, totalProducts)} of {totalProducts} products
                    </span>
                  )}
                </div>

                {useClientFiltering && (
                  <div className="text-xs text-gray-500 flex items-center space-x-2">
                    <span>Client-side filtering active</span>
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  </div>
                )}
              </div>

              {displayProducts.length === 0 ? (
                <EmptyState
                  title="No products match your filters"
                  description="Try adjusting your search or filter criteria to find what you're looking for."
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
                    {displayProducts.map((product) => (
                      <ProductCard key={product.id} product={product} viewMode={viewMode} />
                    ))}
                  </div>

                  {/* Pagination - works for both server and client side */}
                  <div className="mt-8">
                    <Pagination
                      hasNextPage={useClientFiltering ? clientHasNextPage : hasNextPage}
                      hasPreviousPage={useClientFiltering ? clientHasPreviousPage : hasPreviousPage}
                      currentPage={useClientFiltering ? clientPage : currentPage}
                      totalPages={useClientFiltering ? clientTotalPages : totalPages}
                      isClientSide={useClientFiltering}
                      onPageChange={useClientFiltering ? handleClientPageChange : undefined}
                      pageInfo={useClientFiltering ? undefined : pageInfo}
                      currentCursor={useClientFiltering ? undefined : currentCursor}
                    />
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
              <div key={i} className="bg-white  shadow p-4">
                <div className="h-48 bg-gray-200  mb-4"></div>
                <div className="h-4 bg-gray-200  mb-2"></div>
                <div className="h-4 bg-gray-200  w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPageComponent(props: ProductsPageComponentProps) {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsContent {...props} />
    </Suspense>
  );
}

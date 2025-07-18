'use client';

import { Image } from '@shopify/hydrogen-react';
import { ArrowLeft, Filter } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import { ProductCard } from '@/app/_components/products';
import { EmptyState, Pagination } from '@/app/_components/ui';
import { useProductFilters } from '@/hooks/useFilters';
import { useUrlFilters } from '@/hooks/useUrlFilters';
import { FilterState } from '@/types';
import ProductFilter from '../products/ProductFilter';

import type { Collection, Product } from '@shopify/hydrogen-react/storefront-api-types';
import type { PartialDeep } from 'type-fest';

interface CollectionPageProps {
  collection: PartialDeep<Collection, { recurseIntoArrays: true }>;
  products: PartialDeep<Product, { recurseIntoArrays: true }>[];
  collections?: PartialDeep<Collection, { recurseIntoArrays: true }>[];
  totalProducts: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export default function CollectionPage({
  collection,
  products,
  collections,
  totalProducts,
  hasNextPage,
  hasPreviousPage,
}: CollectionPageProps) {
  const router = useRouter();
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
  const { filteredProducts, filteredCount } = useProductFilters(products, filters);

  if (!collection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-4 py-8">
          <EmptyState
            title="Collection not found"
            description="The collection you're looking for doesn't exist or may have been removed."
            actionText="Browse All Collections"
            onAction={() => router.push('/collections')}
          />
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Collection Header */}
          <div className="mb-8">
            <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
              <a href="/" className="hover:text-gray-900 transition-colors">
                Home
              </a>
              <span>/</span>
              <a href="/collections" className="hover:text-gray-900 transition-colors">
                Collections
              </a>
              <span>/</span>
              <span className="text-gray-900 font-medium">{collection.title}</span>
            </nav>
            <h1 className="text-4xl font-bungee font-bold text-gray-900 mb-4">{collection.title}</h1>
          </div>

          <EmptyState
            title="No products in this collection"
            description="This collection is currently empty. Check back soon for new products!"
            actionText="Browse Other Collections"
            onAction={() => router.push('/collections')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Collection Header */}
        <div className="mb-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <a href="/" className="hover:text-gray-900 transition-colors">
              Home
            </a>
            <span>/</span>
            <a href="/collections" className="hover:text-gray-900 transition-colors">
              Collections
            </a>
            <span>/</span>
            <span className="text-gray-900 font-medium">{collection.title}</span>
          </nav>

          {/* Collection Hero */}
          <div className="bg-white  overflow-hidden shadow-sm border border-gray-100 mb-8">
            <div className="relative h-48 md:h-64 lg:h-80">
              {collection.image?.url ? (
                <Image
                  src={collection.image.url}
                  alt={collection.image.altText || collection.title || 'Collection'}
                  width={collection.image.width || 1200}
                  height={collection.image.height || 600}
                  className="w-full h-full object-cover"
                  sizes="100vw"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="text-center">
                    <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bungee font-bold text-gray-600">{collection.title}</h2>
                  </div>
                </div>
              )}

              {/* Overlay Content */}
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end">
                <div className="p-6 md:p-8 text-white w-full">
                  <h1 className="text-3xl font-bungee md:text-4xl lg:text-5xl font-bold mb-2">{collection.title}</h1>
                  <p className="text-lg opacity-90 mb-4 max-w-2xl">
                    {collection.description || `Discover our curated ${collection.title?.toLowerCase()} collection`}
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="bg-white bg-opacity-20 px-3 py-1  backdrop-blur-sm">
                      {totalProducts} {totalProducts === 1 ? 'Product' : 'Products'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Collections */}
          <div className="flex items-center justify-between mb-6">
            <a
              href="/collections"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Collections</span>
            </a>

            <div className="text-sm text-gray-600">
              Showing {totalProducts} {totalProducts === 1 ? 'product' : 'products'}
            </div>
          </div>
        </div>

        {/* Product Filter */}
        <ProductFilter
          filters={filters}
          onFiltersChange={updateFilters}
          products={products}
          collections={collections}
          currentCollection={collection}
          totalProducts={totalProducts}
          filteredCount={filteredCount}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        {/* Products Grid */}
        <div className="col-span-full">
          {filteredProducts.length === 0 ? (
            <EmptyState
              title="No products match your filters"
              description="Try adjusting your search or filter criteria to find what you're looking for."
              actionText="Clear all filters"
              onAction={() => updateFilters(initialFilters)}
            />
          ) : (
            <>
              <div
                className={`grid gap-6 ${
                  viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'
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
  );
}

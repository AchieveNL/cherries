'use client';

import { Image } from '@shopify/hydrogen-react';
import { ArrowLeft, ChevronDown, Filter, Grid, List } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { ProductCard, ProductFilters } from '@/app/_components/products';
import { EmptyState, Pagination } from '@/app/_components/ui';
import { useProductFilters } from '@/hooks/useFilters';

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
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const { filters, setFilters, filteredProducts } = useProductFilters(products);

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'name-asc', label: 'Name: A to Z' },
    { value: 'name-desc', label: 'Name: Z to A' },
    { value: 'best-selling', label: 'Best Selling' },
  ];

  const currentSort = sortOptions.find((option) => option.value === searchParams.get('sort')) || sortOptions[0];

  const handleSortChange = (sortValue: string) => {
    const params = new URLSearchParams(searchParams);
    if (sortValue === 'featured') {
      params.delete('sort');
    } else {
      params.set('sort', sortValue);
    }
    params.delete('page'); // Reset to first page
    router.push(`/collections/${collection.handle}?${params.toString()}`);
  };

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
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-8">
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
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full backdrop-blur-sm">
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ProductFilters
              filters={filters}
              onFiltersChange={setFilters}
              products={products}
              collections={collections}
              currentCollection={collection}
            />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="text-sm text-gray-600">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
              </div>

              <div className="flex items-center space-x-4">
                {/* Sort Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                    className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <span>Sort: {currentSort.label}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {showSortDropdown && (
                    <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-48">
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            handleSortChange(option.value);
                            setShowSortDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                            currentSort.value === option.value ? 'text-primary font-medium' : 'text-gray-700'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                    aria-label="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <EmptyState
                title="No products match your filters"
                description="Try adjusting your search or filter criteria to find what you're looking for."
                actionText="Clear all filters"
                onAction={() =>
                  setFilters({
                    search: '',
                    category: '',
                    priceRange: [0, 100],
                    vendor: '',
                    availability: 'all',
                    sortBy: 'featured',
                  })
                }
              />
            ) : (
              <>
                <div
                  className={`grid gap-6 ${
                    viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'
                  }`}
                >
                  {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                <Pagination hasNextPage={hasNextPage} hasPreviousPage={hasPreviousPage} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

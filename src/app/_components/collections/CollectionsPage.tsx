'use client';

import { Image } from '@shopify/hydrogen-react';
import { ArrowRight, Grid, List, Package, Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';

import { EmptyState, Pagination } from '@/app/_components/ui';

import type { Collection } from '@shopify/hydrogen-react/storefront-api-types';
import type { PartialDeep } from 'type-fest';

interface CollectionsPageProps {
  collections: PartialDeep<Collection, { recurseIntoArrays: true }>[];
  totalCollections: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage?: number;
  totalPages?: number;
  pageInfo?: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor: string | undefined;
    endCursor: string | undefined;
  };
  currentCursor?: string;
}

interface CollectionCardProps {
  collection: PartialDeep<Collection, { recurseIntoArrays: true }>;
  viewMode: 'grid' | 'list';
}

function CollectionCard({ collection, viewMode }: CollectionCardProps) {
  if (viewMode === 'list') {
    return (
      <div className="bg-white  overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group">
        <div className="flex">
          {/* Image */}
          <div className="w-48 h-32 flex-shrink-0 relative overflow-hidden bg-gray-100">
            {collection.image?.url ? (
              <Image
                src={collection.image.url}
                alt={collection.image.altText || collection.title || 'Collection'}
                width={collection.image.width || 300}
                height={collection.image.height || 200}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="200px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-8 h-8 text-gray-300" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                <a href={`/collections/${collection.handle}`}>{collection.title}</a>
              </h3>
              {collection.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{collection.description}</p>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Updated {collection.updatedAt ? new Date(collection.updatedAt).toLocaleDateString() : 'Recently'}
              </span>
              <a
                href={`/collections/${collection.handle}`}
                className="flex items-center space-x-1 text-primary hover:text-primary/80 transition-colors text-sm font-medium"
              >
                <span>View Collection</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {collection.image?.url ? (
          <Image
            src={collection.image.url}
            alt={collection.image.altText || collection.title || 'Collection'}
            width={collection.image.width || 400}
            height={collection.image.height || 300}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-gray-300" />
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-end">
          <div className="p-4 w-full transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <a
              href={`/collections/${collection.handle}`}
              className="w-full bg-white text-gray-900 text-center py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
            >
              <span>View Collection</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
          <a href={`/collections/${collection.handle}`}>{collection.title}</a>
        </h3>

        {collection.description && <p className="text-sm text-gray-600 line-clamp-2 mb-3">{collection.description}</p>}

        <div className="text-xs text-gray-500">
          Updated {collection.updatedAt ? new Date(collection.updatedAt).toLocaleDateString() : 'Recently'}
        </div>
      </div>
    </div>
  );
}

export default function CollectionsPage({
  collections,
  totalCollections,
  hasNextPage,
  hasPreviousPage,
  pageInfo,
  currentPage = 1,
  totalPages = 1,
  currentCursor,
}: CollectionsPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const currentSearch = searchParams.get('search') || '';

  // Client-side filtering for immediate feedback
  const filteredCollections = useMemo(() => {
    if (!currentSearch) return collections;

    return collections.filter(
      (collection) =>
        collection.title?.toLowerCase().includes(currentSearch.toLowerCase()) ||
        collection.description?.toLowerCase().includes(currentSearch.toLowerCase())
    );
  }, [collections, currentSearch]);

  const handleSearchChange = (searchTerm: string) => {
    const params = new URLSearchParams(searchParams);
    if (searchTerm) {
      params.set('search', searchTerm);
    } else {
      params.delete('search');
    }
    params.delete('page'); // Reset to first page on search
    router.push(`/collections?${params.toString()}`);
  };

  if (!collections || collections.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-4 py-8">
          <EmptyState
            title="No collections found"
            description="We couldn't find any collections to display."
            actionText="Go Home"
            onAction={() => router.push('/')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <a href="/" className="hover:text-gray-900 transition-colors">
              Home
            </a>
            <span>/</span>
            <span className="text-gray-900 font-medium">Collections</span>
          </nav>

          {/* Hero Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bungee md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Our Collections
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
              Discover curated collections of products organized by theme, style, and category. Find exactly what
              you&apos;re looking for in our thoughtfully organized selection.
            </p>
            <div className="text-sm text-gray-500">
              {totalCollections} {totalCollections === 1 ? 'Collection' : 'Collections'} Available
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              defaultValue={currentSearch}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search collections..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Results and View Toggle */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {filteredCollections.length} {filteredCollections.length === 1 ? 'collection' : 'collections'}
            </span>

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

        {filteredCollections.length === 0 ? (
          <EmptyState
            title="No collections match your search"
            description="Try adjusting your search term to find collections."
            actionText="Clear search"
            onAction={() => handleSearchChange('')}
          />
        ) : (
          <>
            <div
              className={`grid gap-6 ${
                viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
              }`}
            >
              {filteredCollections.map((collection) => (
                <CollectionCard key={collection.id} collection={collection} viewMode={viewMode} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              hasNextPage={hasNextPage}
              hasPreviousPage={hasPreviousPage}
              currentPage={currentPage}
              totalPages={totalPages}
              pageInfo={pageInfo}
              currentCursor={currentCursor}
            />
          </>
        )}
      </div>
    </div>
  );
}

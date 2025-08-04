'use client';

import { Image } from '@shopify/hydrogen-react';
import { ArrowRight, List, Package, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { EmptyState, Pagination } from '@/app/_components/ui';
import { GridIcon } from '../icons/products/GridIcon';

import type { Collection } from '@shopify/hydrogen-react/storefront-api-types';
import type { PartialDeep } from 'type-fest';

interface CollectionsPageProps {
  collections: PartialDeep<Collection, { recurseIntoArrays: true }>[];
  totalCollections: number;
}

interface CollectionCardProps {
  collection: PartialDeep<Collection, { recurseIntoArrays: true }>;
  viewMode: 'grid' | 'list';
}

function CollectionCard({ collection, viewMode }: CollectionCardProps) {
  if (viewMode === 'list') {
    return (
      <div className="bg-white overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group">
        <div className="flex">
          {/* Image */}
          <div className="w-48 h-36 flex-shrink-0 relative overflow-hidden bg-gray-100">
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
    <div className="bg-white overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group">
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
              className="w-full bg-white text-gray-900 text-center py-2 px-4 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
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

export default function CollectionsPage({ collections, totalCollections }: CollectionsPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 12;

  // Initialize search from URL
  useEffect(() => {
    const urlSearch = searchParams.get('search') || '';
    setSearchTerm(urlSearch);
  }, [searchParams]);

  // Update URL when search changes
  const updateURL = (search: string, page: number = 1) => {
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }
    if (page > 1) {
      params.set('page', page.toString());
    } else {
      params.delete('page');
    }
    router.push(`/collections?${params.toString()}`);
  };

  // Filter collections based on search
  const filteredCollections = useMemo(() => {
    if (!searchTerm) return collections;
    return collections.filter(
      (collection) =>
        collection.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collection.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [collections, searchTerm]);

  // Paginate filtered results
  const paginatedCollections = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredCollections.slice(startIndex, endIndex);
  }, [filteredCollections, currentPage, itemsPerPage]);

  // Calculate pagination info
  const totalPages = Math.ceil(filteredCollections.length / itemsPerPage);
  const hasNextPage = currentPage < totalPages;
  const hasPreviousPage = currentPage > 1;

  // Handle search input
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page
    updateURL(value, 1);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL(searchTerm, page);
  };

  // Initialize page from URL
  useEffect(() => {
    const urlPage = parseInt(searchParams.get('page') || '1');
    setCurrentPage(urlPage);
  }, [searchParams]);

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
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 py-6 max-w-8xl">
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-900 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">Collections</span>
          </nav>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          {/* Breadcrumb */}

          {/* Hero Section */}
          <div className="text-center my-8">
            <h1 className="text-4xl font-bungee md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
              Our Collections
            </h1>

            <div className="w-[164px] h-1 bg-primary mx-auto mb-8"></div>
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 bg-white p-4 shadow-sm border border-gray-100">
          {/* Search */}
          <div className="relative flex-1 max-w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search collections..."
              className="w-full pl-9 pr-4 py-2 border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Results and View Toggle */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {filteredCollections.length} {filteredCollections.length === 1 ? 'collection' : 'collections'}
              {searchTerm && filteredCollections.length !== collections.length && (
                <span className="text-gray-400"> (filtered from {collections.length})</span>
              )}
            </span>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
                aria-label="Grid view"
              >
                <GridIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${
                  viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {filteredCollections.length === 0 && searchTerm ? (
          <EmptyState
            title="No collections match your search"
            description={`No collections found for "${searchTerm}". Try adjusting your search term.`}
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
              {paginatedCollections.map((collection) => (
                <CollectionCard key={collection.id} collection={collection} viewMode={viewMode} />
              ))}
            </div>

            {/* Pagination */}
            {filteredCollections.length > itemsPerPage && (
              <div className="mt-12 flex justify-center">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!hasPreviousPage}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>

                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let pageNumber: number;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`px-3 py-2 text-sm font-medium border ${
                            currentPage === pageNumber
                              ? 'text-primary bg-primary/10 border-primary'
                              : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!hasNextPage}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Page info */}
            {filteredCollections.length > itemsPerPage && (
              <div className="mt-4 text-center text-sm text-gray-500">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredCollections.length)} of {filteredCollections.length}{' '}
                {searchTerm ? 'filtered' : ''} collections
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

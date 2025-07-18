'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface PaginationProps {
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  currentPage?: number;
  totalPages?: number;
  isClientSide?: boolean;
  onPageChange?: (page: number) => void;
  pageInfo?: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string | undefined;
    endCursor?: string | undefined;
  };
  currentCursor?: string;
}

export default function Pagination({
  hasNextPage,
  hasPreviousPage,
  currentPage = 1,
  totalPages,
  isClientSide = false,
  onPageChange,
  pageInfo,
}: PaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Use pageInfo values if available, otherwise fall back to props
  const actualHasNextPage = pageInfo?.hasNextPage ?? hasNextPage;
  const actualHasPreviousPage = pageInfo?.hasPreviousPage ?? hasPreviousPage;

  // Create URL with cursor for server-side pagination
  const createCursorURL = useCallback(
    (cursor: string | null, direction: 'next' | 'prev') => {
      const params = new URLSearchParams(searchParams);

      if (cursor) {
        if (direction === 'next') {
          params.set('after', cursor);
          params.delete('before');
        } else {
          params.set('before', cursor);
          params.delete('after');
        }
      } else {
        params.delete('after');
        params.delete('before');
      }

      // Update page number for display purposes
      const newPage = direction === 'next' ? currentPage + 1 : currentPage - 1;
      params.set('page', newPage.toString());

      return `?${params.toString()}`;
    },
    [searchParams, currentPage]
  );

  // Create URL with page number for client-side pagination
  const createPageURL = useCallback(
    (pageNumber: number) => {
      const params = new URLSearchParams(searchParams);
      params.set('page', pageNumber.toString());
      // Remove cursor params for client-side pagination
      params.delete('after');
      params.delete('before');
      return `?${params.toString()}`;
    },
    [searchParams]
  );

  const handlePageChange = useCallback(
    (page: number) => {
      if (isClientSide && onPageChange) {
        // Client-side pagination - just call the callback
        onPageChange(page);
      } else {
        // Server-side pagination - use URL navigation
        const url = createPageURL(page);
        router.push(url);
      }
    },
    [router, createPageURL, isClientSide, onPageChange]
  );

  const handlePrevious = () => {
    if (actualHasPreviousPage && currentPage > 1) {
      if (isClientSide) {
        handlePageChange(currentPage - 1);
      } else {
        // For server-side pagination with cursor
        const url = createCursorURL(pageInfo?.startCursor || null, 'prev');
        router.push(url);
      }
    }
  };

  const handleNext = () => {
    if (actualHasNextPage) {
      if (isClientSide) {
        handlePageChange(currentPage + 1);
      } else {
        // For server-side pagination with cursor
        const url = createCursorURL(pageInfo?.endCursor || null, 'next');
        router.push(url);
      }
    }
  };

  // Generate page numbers to show (only for client-side or when totalPages is available)
  const getPageNumbers = () => {
    if (!totalPages || totalPages <= 1) return [];

    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, currentPage + 2);

      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages) {
        if (end < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  // Don't render if no pagination needed
  if ((!actualHasNextPage && !actualHasPreviousPage) || (!totalPages && !actualHasNextPage && !actualHasPreviousPage)) {
    return null;
  }

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center space-x-2 mt-12">
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        disabled={!actualHasPreviousPage}
        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Page Numbers (only show for client-side pagination or when totalPages is available) */}
      {pageNumbers.length > 0 && (
        <div className="flex items-center space-x-1">
          {pageNumbers.map((page, index) => (
            <div key={index}>
              {page === '...' ? (
                <span className="px-3 py-2 text-gray-500">...</span>
              ) : (
                <button
                  onClick={() => handlePageChange(page as number)}
                  className={`px-3 py-2 rounded-lg transition-colors ${
                    currentPage === page ? 'bg-primary text-white' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  {page}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Current page indicator for server-side pagination without totalPages */}
      {pageNumbers.length === 0 && (
        <div className="flex items-center space-x-2">
          <span className="px-3 py-2 text-gray-600">Page {currentPage}</span>
          {/* Show cursor info if available (for debugging) */}
          {pageInfo && process.env.NODE_ENV === 'development' && (
            <span className="text-xs text-gray-400">
              (Cursors: {pageInfo.startCursor ? '←' : ''}
              {pageInfo.endCursor ? '→' : ''})
            </span>
          )}
        </div>
      )}

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={!actualHasNextPage}
        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Pagination type indicator */}
      <div className="ml-4 text-xs text-gray-500 hidden lg:block">
        {isClientSide ? 'Client-side pagination' : 'Server-side pagination'}
        {pageInfo && !isClientSide && <span className="ml-2">(Cursor-based)</span>}
      </div>
    </div>
  );
}

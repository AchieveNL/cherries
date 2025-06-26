'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

export default function Pagination({ hasNextPage, hasPreviousPage, currentPage = 1, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-center space-x-4 mt-12">
      <button
        onClick={() => onPageChange?.(currentPage - 1)}
        disabled={!hasPreviousPage}
        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Previous</span>
      </button>

      <span className="px-4 py-2 text-sm text-gray-600">Page {currentPage}</span>

      <button
        onClick={() => onPageChange?.(currentPage + 1)}
        disabled={!hasNextPage}
        className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span>Next</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}

'use client';

import { Grid3X3, List } from 'lucide-react';

import { FilterState } from '@/types';

interface ProductControlsProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  viewMode: 'grid' | 'list';
  setViewMode: React.Dispatch<React.SetStateAction<'grid' | 'list'>>;
  totalProducts: number;
}

export default function ProductControls({
  filters,
  setFilters,
  viewMode,
  setViewMode,
  totalProducts,
}: ProductControlsProps) {
  return (
    <div className="flex items-center justify-between mb-6">
      <p className="text-sm text-gray-600">Showing {totalProducts} products</p>

      <div className="flex items-center space-x-4">
        {/* Sort By */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium text-gray-700">Sort by:</label>
          <select
            value={filters.sortBy}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                sortBy: e.target.value as FilterState['sortBy'],
              }))
            }
            className="border border-secondary rounded-lg px-3 py-1 text-sm ring-2 ring-secondary focus:border-transparent"
          >
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>

        {/* View Mode */}
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 ${viewMode === 'grid' ? 'bg-secondary text-primary' : 'text-gray-600 hover:bg-gray-50'} transition-colors`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 ${viewMode === 'list' ? 'bg-secondary text-primary' : 'text-gray-600 hover:bg-gray-50'} transition-colors`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

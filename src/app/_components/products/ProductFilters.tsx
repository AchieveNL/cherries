/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useMemo, useState } from 'react';

import type { FilterState } from '@/types';
import type { Collection, Product } from '@shopify/hydrogen-react/storefront-api-types';
import type { PartialDeep } from 'type-fest';

// Extended FilterState to include collections if not already defined
interface ExtendedFilterState extends FilterState {
  collections?: string[];
}

interface ProductFiltersProps {
  filters: ExtendedFilterState;
  onFiltersChange: (filters: ExtendedFilterState) => void;
  products: PartialDeep<Product, { recurseIntoArrays: true }>[];
  collections?: PartialDeep<Collection, { recurseIntoArrays: true }>[];
  currentCollection?: PartialDeep<Collection, { recurseIntoArrays: true }>;
}

export default function ProductFilters({
  filters,
  onFiltersChange,
  products,
  collections,
  currentCollection,
}: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Group collections by category/type for better organization
  const groupedCollections = useMemo(() => {
    if (!collections) return {};

    const groups: Record<string, PartialDeep<Collection, { recurseIntoArrays: true }>[]> = {};

    collections.forEach((collection) => {
      if (!collection.title) return;

      // Try to categorize collections based on common patterns
      const title = collection.title.toLowerCase();
      let category = 'OTHERS';

      if (title.includes('phone') || title.includes('case') || title.includes('cover')) {
        category = 'PHONE CASES';
      } else if (title.includes('charger') || title.includes('cable') || title.includes('power')) {
        category = 'CHARGERS';
      } else if (title.includes('bank') || title.includes('battery') || title.includes('portable')) {
        category = 'POWER BANKS';
      } else if (title.includes('accessory') || title.includes('accessories')) {
        category = 'ACCESSORIES';
      } else if (
        title.includes('color') ||
        title.includes('black') ||
        title.includes('white') ||
        title.includes('red') ||
        title.includes('blue') ||
        title.includes('green')
      ) {
        category = 'COLOUR';
      }

      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(collection);
    });

    // Sort collections within each group
    Object.keys(groups).forEach((key) => {
      groups[key].sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    });

    return groups;
  }, [collections]);

  const updateFilters = (updates: Partial<ExtendedFilterState>) => {
    onFiltersChange({ ...filters, ...updates });
  };

  const FilterContent = () => (
    <div className="space-y-8">
      {/* Current Collection Context */}
      {currentCollection && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-800 mb-2">Current Collection</h3>
          <p className="text-sm text-blue-700">{currentCollection.title}</p>
          <a href="/products" className="text-xs text-blue-600 hover:text-blue-800 mt-2 underline inline-block">
            Browse all products
          </a>
        </div>
      )}

      {/* Search */}
      <div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => updateFilters({ search: e.target.value })}
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
      </div>

      {/* Collections grouped by category */}
      {Object.entries(groupedCollections).map(([category, categoryCollections]) => (
        <div key={category}>
          <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">{category}</h3>
          <div className="space-y-2">
            {categoryCollections.map((collection) => (
              <label key={collection.id} className="flex items-center text-sm">
                <input
                  type="checkbox"
                  className="mr-3 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  checked={filters.collections?.includes(collection.id || '') || false}
                  onChange={(e) => {
                    const currentCollections = filters.collections || [];
                    const collectionId = collection.id || '';

                    const newCollections = e.target.checked
                      ? [...currentCollections, collectionId]
                      : currentCollections.filter((id) => id !== collectionId);

                    updateFilters({ collections: newCollections });
                  }}
                />
                <span className="text-gray-700">{collection.title}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      {/* Clear Filters */}
      <button
        onClick={() =>
          onFiltersChange({
            search: '',
            category: '',
            priceRange: [0, 1000] as [number, number],
            vendor: '',
            availability: 'all',
            sortBy: 'featured' as ExtendedFilterState['sortBy'],
            collections: [],
          })
        }
        className="w-full text-sm text-red-600 hover:text-red-700 transition-colors font-medium py-2 border border-red-200 rounded-lg hover:bg-red-50"
      >
        Clear All Filters
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters</span>
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 sticky top-8">
          <FilterContent />
        </div>
      </div>

      {/* Mobile Filter Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button onClick={() => setIsOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>
              <FilterContent />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

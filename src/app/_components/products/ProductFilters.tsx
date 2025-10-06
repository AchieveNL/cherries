/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Search, SlidersHorizontal, X } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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

// Completely independent SearchInput - never re-renders from parent changes
interface SearchInputProps {
  onSearchChange: (value: string) => void;
  placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = React.memo(({ onSearchChange, placeholder = 'Search products...' }) => {
  const [localValue, setLocalValue] = useState('');
  const debounceRef = useRef<NodeJS.Timeout>();
  const onSearchChangeRef = useRef(onSearchChange);

  // Keep ref updated but don't cause re-renders
  onSearchChangeRef.current = onSearchChange;

  // Completely stable handler - no external dependencies
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalValue(value);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      onSearchChangeRef.current(value);
    }, 300);
  }, []); // Completely stable - no dependencies

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        value={localValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-9 pr-4 py-2 border border-solid border-gray-300  focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
        autoComplete="off"
      />
    </div>
  );
});

SearchInput.displayName = 'SearchInput';

export default function ProductFilters({
  filters,
  onFiltersChange,
  products,
  collections,
  currentCollection,
}: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const filtersRef = useRef(filters);

  // Keep filters ref updated
  filtersRef.current = filters;

  // Group collections by category/type for better organization
  const groupedCollections = useMemo(() => {
    if (!collections) return {};

    const groups: Record<string, PartialDeep<Collection, { recurseIntoArrays: true }>[]> = {};

    collections.forEach((collection) => {
      if (!collection.title) return;

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

    Object.keys(groups).forEach((key) => {
      groups[key].sort((a, b) => (a.title || '').localeCompare(b.title || ''));
    });

    return groups;
  }, [collections]);

  // Stable search change handler with no dependencies
  const handleSearchChange = useCallback(
    (value: string) => {
      onFiltersChange({ ...filtersRef.current, search: value });
    },
    [onFiltersChange]
  );

  // Stable collection change handler
  const handleCollectionChange = useCallback(
    (collectionId: string, checked: boolean) => {
      const currentCollections = filtersRef.current.collections || [];
      const newCollections = checked
        ? [...currentCollections, collectionId]
        : currentCollections.filter((id) => id !== collectionId);

      onFiltersChange({ ...filtersRef.current, collections: newCollections });
    },
    [onFiltersChange]
  );

  // Create search input outside of memoized content
  const searchInput = useMemo(
    () => <SearchInput onSearchChange={handleSearchChange} placeholder="Search products..." />,
    [handleSearchChange]
  );

  // Memoize content WITHOUT any filter state dependencies
  const filterContent = useMemo(
    () => (
      <div className="space-y-8">
        {/* Current Collection Context */}
        {currentCollection && (
          <div className="bg-secondary border border-primary rounded-lg p-4">
            <h3 className="font-medium text-primary mb-2">Current Collection</h3>
            <p className="text-sm text-primary">{currentCollection.title}</p>
            <a href="/products" className="text-xs text-primary hover:text-primary/90 mt-2 underline inline-block">
              Browse all products
            </a>
          </div>
        )}

        {/* Search - Completely isolated */}
        <div>{searchInput}</div>

        {/* Collections grouped by category */}
        {Object.entries(groupedCollections).map(([category, categoryCollections]) => (
          <div key={category}>
            <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">{category}</h3>
            <div className="space-y-2">
              {categoryCollections.map((collection) => (
                <label key={collection.id} className="flex items-center text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-3 text-primary border-solid border-gray-300 focus:ring-primary"
                    checked={filters.collections?.includes(collection.id || '') || false}
                    onChange={(e) => handleCollectionChange(collection.id || '', e.target.checked)}
                  />
                  <span className="text-gray-700">{collection.title}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    ),
    [
      currentCollection,
      searchInput,
      groupedCollections,
      filters.collections, // Only collection filters, NOT search
      handleCollectionChange,
    ]
  );

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2 bg-white border rounded-lg px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters</span>
        </button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <div className="bg-white p-6 sticky top-8">{filterContent}</div>
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
              {filterContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

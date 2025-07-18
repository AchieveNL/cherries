/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChevronDown, Grid, List, Search, X } from 'lucide-react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { PartialDeep } from 'type-fest';

import { Collection, FilterState, Product } from '@/types';

// Type guards to ensure data integrity
function isValidProduct(product: any): product is PartialDeep<Product, { recurseIntoArrays: true }> {
  return product && typeof product.id === 'string' && product.id.length > 0;
}

function isValidCollection(collection: any): collection is PartialDeep<Collection, { recurseIntoArrays: true }> {
  return collection && typeof collection.id === 'string' && collection.id.length > 0;
}

interface ProductFilterProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  products: any[]; // Accept any[] and filter internally
  collections?: any[]; // Accept any[] and filter internally
  currentCollection?: PartialDeep<Collection, { recurseIntoArrays: true }>;
  totalProducts?: number;
  filteredCount?: number;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
}

export default function ProductFilter({
  filters,
  onFiltersChange,
  products: rawProducts,
  collections: rawCollections = [],
  currentCollection,
  totalProducts = 0,
  filteredCount = 0,
  viewMode = 'grid',
  onViewModeChange,
}: ProductFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);
  const [searchValue, setSearchValue] = useState(filters.search || '');

  // Filter and validate products
  const products = useMemo(() => {
    return rawProducts.filter(isValidProduct);
  }, [rawProducts]);

  // Filter and validate collections
  const collections = useMemo(() => {
    return rawCollections.filter(isValidCollection);
  }, [rawCollections]);

  // Generate filter options from products - memoized to prevent recalculation
  const filterOptions = useMemo(() => {
    const vendors = Array.from(new Set(products.map((p) => p.vendor).filter(Boolean))).sort();
    const categories = Array.from(new Set(products.map((p) => p.productType).filter(Boolean))).sort();

    // Calculate price range from products
    const prices = products.flatMap(
      (product) =>
        product.variants?.nodes
          ?.map((variant) => parseFloat(variant?.price?.amount || '0'))
          .filter((price) => price > 0) || []
    );
    const maxPrice = prices.length > 0 ? Math.ceil(Math.max(...prices)) : 1000;

    return {
      vendors,
      categories,
      maxPrice,
      collections: collections.map((c) => ({
        id: c.id || '',
        title: c.title || '',
        handle: c.handle || '',
      })),
    };
  }, [products, collections]);

  // Update local filters when props change - use JSON.stringify for deep comparison
  useEffect(() => {
    const filtersString = JSON.stringify(filters);
    const localFiltersString = JSON.stringify(localFilters);

    if (filtersString !== localFiltersString) {
      setLocalFilters(filters);
    }
  }, [filters]); // Removed localFilters from deps to prevent infinite loop

  // Update search value when filters change
  useEffect(() => {
    setSearchValue(filters.search || '');
  }, [filters.search]);

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'priceAsc', label: 'Price: Low to High' },
    { value: 'priceDesc', label: 'Price: High to Low' },
    { value: 'nameAsc', label: 'Name: A to Z' },
    { value: 'nameDesc', label: 'Name: Z to A' },
  ];

  const availabilityOptions = [
    { value: 'all', label: 'All Products' },
    { value: 'inStock', label: 'In Stock Only' },
    { value: 'outOfStock', label: 'Out of Stock' },
  ];

  const handleLocalFilterChange = useCallback((key: keyof FilterState, value: any) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const handleCollectionToggle = useCallback((collectionId: string) => {
    setLocalFilters((prev) => {
      const currentCollections = prev.collections || [];
      const isSelected = currentCollections.includes(collectionId);

      const newCollections = isSelected
        ? currentCollections.filter((id) => id !== collectionId)
        : [...currentCollections, collectionId];

      return {
        ...prev,
        collections: newCollections,
      };
    });
  }, []);

  const applyFilters = useCallback(() => {
    onFiltersChange(localFilters);
    setIsFilterOpen(false);
  }, [localFilters, onFiltersChange]);

  const clearAllFilters = useCallback(() => {
    const clearedFilters: FilterState = {
      search: '',
      category: '',
      priceRange: [0, filterOptions.maxPrice] as [number, number],
      vendor: '',
      availability: 'all' as const,
      sortBy: 'featured' as const,
      collections: [],
    };
    setLocalFilters(clearedFilters);
    setSearchValue('');
    onFiltersChange(clearedFilters);
  }, [filterOptions.maxPrice, onFiltersChange]);

  // Immediate filter changes for certain actions
  const handleQuickFilter = useCallback(
    (key: keyof FilterState, value: any) => {
      const newFilters = { ...filters, [key]: value };
      onFiltersChange(newFilters);
    },
    [filters, onFiltersChange]
  );

  // Handle search functionality
  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value);
  }, []);

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      onFiltersChange({ ...filters, search: searchValue });
    },
    [filters, searchValue, onFiltersChange]
  );

  const handleSearchClear = useCallback(() => {
    setSearchValue('');
    onFiltersChange({ ...filters, search: '' });
  }, [filters, onFiltersChange]);

  const hasActiveFilters = useMemo(() => {
    return (
      filters.search ||
      filters.category ||
      filters.vendor ||
      filters.availability !== 'all' ||
      filters.priceRange[0] > 0 ||
      filters.priceRange[1] < filterOptions.maxPrice ||
      (filters.collections && filters.collections.length > 0)
    );
  }, [filters, filterOptions.maxPrice]);

  const selectedSortLabel = useMemo(() => {
    return sortOptions.find((option) => option.value === filters.sortBy)?.label || 'Featured';
  }, [filters.sortBy]);

  const activeFiltersCount = useMemo(() => {
    return [
      filters.search,
      filters.category,
      filters.vendor,
      filters.availability !== 'all',
      filters.priceRange[0] > 0 || filters.priceRange[1] < filterOptions.maxPrice,
      filters.collections && filters.collections.length > 0,
    ].filter(Boolean).length;
  }, [filters, filterOptions.maxPrice]);

  return (
    <div className="bg-white border-b border-t border-gray-200 shadow-sm my-6">
      {/* Main Filter Bar */}
      <div className="container mx-auto px-4 py-3 md:py-4">
        {/* Mobile Layout - Stacked */}
        <div className="md:hidden space-y-3">
          {/* Top Row - Search */}
          <div className="w-full">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="flex">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchValue}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 border border-solid border-gray-300 focus:ring-1 focus:ring-primary focus:border-primary transition-colors text-gray-900 placeholder-gray-500 border-r-0 text-sm"
                  />
                  {searchValue && (
                    <button
                      type="button"
                      onClick={handleSearchClear}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-3 py-2.5 bg-black text-white hover:bg-primary transition-colors font-medium border border-primary flex items-center justify-center min-w-[50px]"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Bottom Row - Controls */}
          <div className="flex items-center justify-between gap-2">
            {/* Left Side - Filter and Results */}
            <div className="flex items-center space-x-2 flex-1 min-w-0">
              {/* Filter Button */}
              <div className="relative">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="flex items-center space-x-1 text-gray-700 hover:text-gray-900 font-medium px-3 py-2 border border-solid border-gray-300 hover:bg-gray-50 transition-all duration-200 text-sm"
                >
                  <span>Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="bg-primary text-white text-xs px-1.5 py-0.5 min-w-[16px] h-4 flex items-center justify-center rounded-full">
                      {activeFiltersCount}
                    </span>
                  )}
                  <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Mobile Filter Dropdown - Full width */}
                {isFilterOpen && (
                  <div className="fixed inset-x-4 top-20 bg-white border border-gray-200 border-solid shadow-xl z-50 max-h-[calc(100vh-6rem)] overflow-y-auto">
                    {/* Use the same filter content but with mobile-optimized spacing */}
                  </div>
                )}
              </div>

              {/* Results Count - Mobile */}
              <div className="text-xs text-gray-600 min-w-0">
                {filteredCount !== totalProducts ? (
                  <span className="truncate">
                    <span className="text-primary font-medium">{filteredCount}</span> of {totalProducts}
                  </span>
                ) : (
                  <span className="truncate">{totalProducts} products</span>
                )}
              </div>
            </div>

            {/* Right Side - Sort and View */}
            <div className="flex items-center space-x-2">{/* Mobile sort and view controls with smaller sizing */}</div>
          </div>

          {/* Clear Filters - Mobile */}
          {hasActiveFilters && (
            <div className="flex justify-center">
              <button
                onClick={clearAllFilters}
                className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        <div className="hidden md:flex items-center justify-between gap-6">
          {/* Left Side - Results and Filters */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            {/* Filter Button */}
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 font-medium px-4 py-2 border border-solid border-gray-300 hover:bg-gray-50 transition-all duration-200 "
              >
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-primary text-white text-xs px-2 py-0.5 min-w-[20px] h-5 flex items-center justify-center ">
                    {activeFiltersCount}
                  </span>
                )}
                <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Filter Dropdown */}
              {isFilterOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 border-solid shadow-xl z-50 ">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Filter Products</h3>
                      <button
                        onClick={() => setIsFilterOpen(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Quick Filters */}
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-800 mb-3">Quick Filters</h4>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleQuickFilter('availability', 'inStock')}
                          className={`px-3 py-2 text-sm border transition-all border-solid ${
                            filters.availability === 'inStock'
                              ? 'bg-primary/10 border-primary text-primary'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          In Stock
                        </button>
                        <button
                          onClick={() => handleQuickFilter('sortBy', 'priceAsc')}
                          className={`px-3 py-2 text-sm border border-solid transition-all  ${
                            filters.sortBy === 'priceAsc'
                              ? 'bg-primary/10 border-primary text-primary'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          Low Price
                        </button>
                      </div>
                    </div>

                    {/* Collections Filter */}
                    {filterOptions.collections.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-medium text-gray-800 mb-3">
                          {currentCollection ? `Current: ${currentCollection.title}` : 'Collections'}
                        </h4>
                        {currentCollection ? (
                          <div className="bg-primary/10 border border-primary/20  p-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-primary "></div>
                                <span className="text-sm font-medium text-primary">{currentCollection.title}</span>
                              </div>
                              <span className="text-xs text-primary/70">Active Collection</span>
                            </div>
                            {currentCollection.description && (
                              <p className="text-xs text-gray-600 mt-2 line-clamp-2">{currentCollection.description}</p>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-32 overflow-y-auto">
                            {filterOptions.collections.map((collection) => (
                              <label key={collection.id} className="flex items-center space-x-2 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={localFilters.collections?.includes(collection.id) || false}
                                  onChange={() => handleCollectionToggle(collection.id)}
                                  className="w-4 h-4 text-primary border-gray-300 border-solid focus:ring-primary"
                                />
                                <span className="text-sm text-gray-700">{collection.title}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Availability Filter */}
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-800 mb-3">Availability</h4>
                      <select
                        value={localFilters.availability}
                        onChange={(e) => handleLocalFilterChange('availability', e.target.value)}
                        className="w-full p-3 border border-gray-300 border-solid focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                      >
                        {availabilityOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Price Range Filter */}
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-800 mb-3">Price Range</h4>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex-1">
                            <label className="block text-xs text-gray-500 mb-1">Min Price</label>
                            <input
                              type="number"
                              placeholder="0"
                              value={localFilters.priceRange[0]}
                              onChange={(e) => {
                                const value = Math.max(0, parseInt(e.target.value) || 0);
                                handleLocalFilterChange('priceRange', [value, localFilters.priceRange[1]]);
                              }}
                              className="w-full p-2 border border-gray-300 border-solid focus:ring-2 focus:ring-primary focus:border-primary"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs text-gray-500 mb-1">Max Price</label>
                            <input
                              type="number"
                              placeholder={filterOptions.maxPrice.toString()}
                              value={localFilters.priceRange[1]}
                              onChange={(e) => {
                                const value = Math.min(
                                  filterOptions.maxPrice,
                                  parseInt(e.target.value) || filterOptions.maxPrice
                                );
                                handleLocalFilterChange('priceRange', [localFilters.priceRange[0], value]);
                              }}
                              className="w-full p-2 border border-gray-300 border-solid focus:ring-2 focus:ring-primary focus:border-primary"
                            />
                          </div>
                        </div>
                        <div className="px-1">
                          <input
                            type="range"
                            min="0"
                            max={filterOptions.maxPrice}
                            value={localFilters.priceRange[1]}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              handleLocalFilterChange('priceRange', [
                                Math.min(localFilters.priceRange[0], value),
                                value,
                              ]);
                            }}
                            className="w-full h-2 bg-gray-200  accent-primary appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>${localFilters.priceRange[0]}</span>
                            <span>${localFilters.priceRange[1]}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 pt-4 border-t border-solid border-gray-200">
                      <button
                        onClick={clearAllFilters}
                        className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700  hover:bg-gray-200 transition-colors font-medium"
                      >
                        Reset
                      </button>
                      <button
                        onClick={applyFilters}
                        className="flex-1 px-4 py-2.5 bg-primary text-white hover:bg-primary/90 transition-colors font-medium"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Results Count */}
            <div className="text-sm font-medium text-gray-700">
              {filteredCount !== totalProducts ? (
                <span>
                  <span className="text-primary">{filteredCount}</span> of {totalProducts} products
                </span>
              ) : (
                <span>{totalProducts} products</span>
              )}
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Center - Search Bar */}
          <div className="flex-1 max-w-md mx-auto">
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="flex">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchValue}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 border border-solid border-gray-300  focus:ring-1 focus:ring-primary focus:border-primary transition-colors text-gray-900 placeholder-gray-500 border-r-0"
                  />
                  {searchValue && (
                    <button
                      type="button"
                      onClick={handleSearchClear}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-black text-white  hover:bg-primary transition-colors font-medium border border-primary flex items-center justify-center min-w-[60px]"
                >
                  <Search className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Right Side - Sort and View */}
          <div className="flex items-center space-x-3 flex-shrink-0">
            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 font-medium px-4 py-2 border border-gray-300  hover:bg-gray-50 transition-all duration-200"
              >
                <span className="hidden sm:inline">Sort:</span>
                <span>{selectedSortLabel}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Sort Dropdown */}
              {isSortOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-gray-200  shadow-xl z-50">
                  <div className="py-2">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          onFiltersChange({ ...filters, sortBy: option.value as FilterState['sortBy'] });
                          setIsSortOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${
                          filters.sortBy === option.value
                            ? 'bg-gray-50 text-primary font-medium border-r-2 border-primary'
                            : 'text-gray-700'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {/* View Mode Toggle */}
            {onViewModeChange && (
              <div className="flex items-center bg-gray-100  p-1">
                <button
                  onClick={() => onViewModeChange('grid')}
                  className={`p-2  transition-all ${
                    viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onViewModeChange('list')}
                  className={`p-2  transition-all ${
                    viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(isFilterOpen || isSortOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsFilterOpen(false);
            setIsSortOpen(false);
          }}
        />
      )}
    </div>
  );
}

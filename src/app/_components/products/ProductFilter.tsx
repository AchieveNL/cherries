/* eslint-disable @typescript-eslint/no-unused-vars */
import { ChevronDown, Grid, List, X } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import { PartialDeep } from 'type-fest';

import { Collection, FilterState, Product } from '@/types';

// Type guards to ensure data integrity
function isValidProduct(product: any): product is Product {
  return product && typeof product.id === 'string' && product.id.length > 0;
}

function isValidCollection(collection: any): collection is Collection {
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

  // Filter and validate products
  const products = useMemo(() => {
    return rawProducts.filter(isValidProduct);
  }, [rawProducts]);

  // Filter and validate collections
  const collections = useMemo(() => {
    return rawCollections.filter(isValidCollection);
  }, [rawCollections]);

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  // Generate filter options from products
  const filterOptions = useMemo(() => {
    const vendors = Array.from(new Set(products.map((p) => p.vendor).filter(Boolean))).sort();
    const categories = Array.from(new Set(products.map((p) => p.productType).filter(Boolean))).sort();

    // Calculate price range from products
    const prices = products.flatMap(
      (product) =>
        product.variants?.nodes
          ?.map((variant) => parseFloat(variant.price?.amount || '0'))
          .filter((price) => price > 0) || []
    );
    const maxPrice = prices.length > 0 ? Math.ceil(Math.max(...prices)) : 1000;

    return {
      vendors,
      categories,
      maxPrice,
      collections: collections.map((c) => ({ id: c.id, title: c.title || '', handle: c.handle || '' })),
    };
  }, [products, collections]);

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

  const handleLocalFilterChange = (key: keyof FilterState, value: any) => {
    setLocalFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    setIsFilterOpen(false);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      search: '',
      category: '',
      priceRange: [0, filterOptions.maxPrice] as [number, number],
      vendor: '',
      availability: 'all' as const,
      sortBy: 'featured' as const,
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters =
    filters.search ||
    filters.category ||
    filters.vendor ||
    filters.availability !== 'all' ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < filterOptions.maxPrice;

  const selectedSortLabel = sortOptions.find((option) => option.value === filters.sortBy)?.label || 'Featured';
  const activeFiltersCount = [
    filters.search,
    filters.category,
    filters.vendor,
    filters.availability !== 'all',
    filters.priceRange[0] > 0 || filters.priceRange[1] < filterOptions.maxPrice,
  ].filter(Boolean).length;

  return (
    <div className="bg-white  border border-gray-200  shadow-sm  my-6">
      {/* Main Filter Bar */}
      <div className="px-6 container mx-auto py-4">
        {/* Bottom Row - Controls */}
        <div className="flex items-center justify-between">
          {/* Left Side - Results and Filters */}
          <div className="flex items-center space-x-4">
            {/* Filter Button */}
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 font-medium px-4 py-2 border border-gray-300  hover:bg-gray-50 transition-all duration-200"
              >
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="bg-primary text-white text-xs px-2 py-0.5  min-w-[20px] h-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
                <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Filter Dropdown */}
              {isFilterOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-solid border-gray-200  shadow-xl z-50">
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
                          onClick={() => handleLocalFilterChange('availability', 'inStock')}
                          className={`px-3 py-2 text-sm  border border-solid transition-all ${
                            localFilters.availability === 'inStock'
                              ? 'bg-primary/10 border-primary text-primary'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          In Stock
                        </button>
                        <button
                          onClick={() => handleLocalFilterChange('sortBy', 'priceAsc')}
                          className={`px-3 py-2 text-sm  border border-solid transition-all ${
                            localFilters.sortBy === 'priceAsc'
                              ? 'bg-primary/10 border-primary text-primary'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          Low Price
                        </button>
                      </div>
                    </div>

                    {/* Category Filter */}
                    {filterOptions.categories.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-medium text-gray-800 mb-3">Category</h4>
                        <select
                          value={localFilters.category}
                          onChange={(e) => handleLocalFilterChange('category', e.target.value)}
                          className="w-full p-3 border border-solid border-gray-300  focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                        >
                          <option value="">All Categories</option>
                          {filterOptions.categories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Brand Filter */}
                    {filterOptions.vendors.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-medium text-gray-800 mb-3">Brand</h4>
                        <select
                          value={localFilters.vendor}
                          onChange={(e) => handleLocalFilterChange('vendor', e.target.value)}
                          className="w-full p-3 border border-solid border-gray-300  focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                        >
                          <option value="">All Brands</option>
                          {filterOptions.vendors.map((vendor) => (
                            <option key={vendor} value={vendor}>
                              {vendor}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

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
                              className="w-full p-2 border border-solid border-gray-300  focus:ring-2 focus:ring-primary focus:border-primary"
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
                              className="w-full p-2 border border-solid border-gray-300  focus:ring-2 focus:ring-primary focus:border-primary"
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
                            className="w-full h-2 bg-gray-200  appearance-none cursor-pointer slider"
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
                        className="flex-1 px-4 py-2.5 bg-primary text-white  hover:bg-primary/90 transition-colors font-medium"
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
                className="text-sm text-primary hover:text-primary font-medium transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>

          {/* Right Side - Sort and View */}
          <div className="flex items-center space-x-3">
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

            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 font-medium px-4 py-2 border border-solid border-gray-300  hover:bg-gray-50 transition-all duration-200"
              >
                <span className="hidden sm:inline">Sort:</span>
                <span>{selectedSortLabel}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Sort Dropdown */}
              {isSortOpen && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-solid border-gray-200  shadow-xl z-50">
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
                            ? 'bg-white text-primary font-medium border-r-2 border-solid border-primary'
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

import { useCallback, useMemo, useRef, useState } from 'react';

import type { Product } from '@shopify/hydrogen-react/storefront-api-types';
import type { PartialDeep } from 'type-fest';

export interface FilterState {
  search: string;
  category: string;
  priceRange: [number, number];
  vendor: string;
  availability: 'all' | 'inStock' | 'outOfStock';
  sortBy: 'featured' | 'newest' | 'oldest' | 'priceAsc' | 'priceDesc' | 'nameAsc' | 'nameDesc';
  collections?: string[];
}

const defaultFilters: FilterState = {
  search: '',
  category: '',
  priceRange: [0, 1000],
  vendor: '',
  availability: 'all',
  sortBy: 'featured',
  collections: [],
};

export function useProductFilters(products: PartialDeep<Product, { recurseIntoArrays: true }>[] | undefined | null) {
  const [filters, setFiltersState] = useState<FilterState>(defaultFilters);

  // Use ref to store the latest filters to avoid stale closures
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  // Ensure products is always an array
  const safeProducts = useMemo(() => {
    if (!products || !Array.isArray(products)) {
      console.warn('useProductFilters: products is not an array, using empty array');
      return [];
    }
    return products;
  }, [products]);

  // Memoized setFilters function to prevent unnecessary re-renders
  const setFilters = useCallback((newFilters: FilterState | ((prev: FilterState) => FilterState)) => {
    setFiltersState((prevFilters) => {
      const updatedFilters = typeof newFilters === 'function' ? newFilters(prevFilters) : newFilters;

      // Only update if there are actual changes
      const hasChanges = Object.keys(updatedFilters).some((key) => {
        const oldValue = prevFilters[key as keyof FilterState];
        const newValue = updatedFilters[key as keyof FilterState];

        // Handle array comparison for collections and priceRange
        if (Array.isArray(oldValue) && Array.isArray(newValue)) {
          return JSON.stringify(oldValue) !== JSON.stringify(newValue);
        }

        return oldValue !== newValue;
      });

      return hasChanges ? updatedFilters : prevFilters;
    });
  }, []);

  // Memoized filter function for better performance
  const filteredProducts = useMemo(() => {
    // Start with safe products array
    let filtered = [...safeProducts];

    // Apply search filter
    if (filters.search && filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase().trim();
      filtered = filtered.filter((product) => {
        const title = product.title?.toLowerCase() || '';
        const description = product.description?.toLowerCase() || '';
        const vendor = product.vendor?.toLowerCase() || '';
        const tags = product.tags?.join(' ').toLowerCase() || '';
        const productType = product.productType?.toLowerCase() || '';

        return (
          title.includes(searchTerm) ||
          description.includes(searchTerm) ||
          vendor.includes(searchTerm) ||
          tags.includes(searchTerm) ||
          productType.includes(searchTerm)
        );
      });
    }

    // Apply collections filter
    if (filters.collections && filters.collections.length > 0) {
      filtered = filtered.filter((product) => {
        // Check if product belongs to any of the selected collections
        const productCollections = product.collections?.nodes || [];
        return productCollections.some((collection) => filters.collections?.includes(collection?.id || ''));
      });
    }

    // Apply category filter (product type)
    if (filters.category && filters.category.trim()) {
      filtered = filtered.filter((product) => product.productType?.toLowerCase() === filters.category.toLowerCase());
    }

    // Apply vendor filter
    if (filters.vendor && filters.vendor.trim()) {
      filtered = filtered.filter((product) => product.vendor?.toLowerCase() === filters.vendor.toLowerCase());
    }

    // Apply availability filter
    if (filters.availability !== 'all') {
      filtered = filtered.filter((product) => {
        const isAvailable = product.availableForSale;
        return filters.availability === 'inStock' ? isAvailable : !isAvailable;
      });
    }

    // Apply price range filter
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) {
      filtered = filtered.filter((product) => {
        if (!product.variants?.nodes || product.variants.nodes.length === 0) {
          return true; // Include products without variants
        }

        const prices = product.variants.nodes
          .map((variant) => (variant?.price?.amount ? parseFloat(variant.price.amount) : 0))
          .filter((price) => price > 0);

        if (prices.length === 0) return true;

        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);

        return minPrice >= filters.priceRange[0] && maxPrice <= filters.priceRange[1];
      });
    }

    // Apply sorting
    const sortedFiltered = [...filtered];
    sortedFiltered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case 'oldest':
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        case 'priceAsc': {
          const priceA = a.variants?.nodes?.[0]?.price?.amount ? parseFloat(a.variants.nodes[0].price.amount) : 0;
          const priceB = b.variants?.nodes?.[0]?.price?.amount ? parseFloat(b.variants.nodes[0].price.amount) : 0;
          return priceA - priceB;
        }
        case 'priceDesc': {
          const priceA = a.variants?.nodes?.[0]?.price?.amount ? parseFloat(a.variants.nodes[0].price.amount) : 0;
          const priceB = b.variants?.nodes?.[0]?.price?.amount ? parseFloat(b.variants.nodes[0].price.amount) : 0;
          return priceB - priceA;
        }
        case 'nameAsc':
          return (a.title || '').localeCompare(b.title || '');
        case 'nameDesc':
          return (b.title || '').localeCompare(a.title || '');
        case 'featured':
        default:
          return 0; // Keep original order
      }
    });

    return sortedFiltered;
  }, [safeProducts, filters]);

  // Additional helper functions
  const updateFilter = useCallback(
    (key: keyof FilterState, value: any) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [setFilters]
  );

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, [setFilters]);

  return {
    filters,
    setFilters,
    updateFilter,
    resetFilters,
    filteredProducts,
    totalProducts: safeProducts.length,
    filteredCount: filteredProducts.length,
  };
}

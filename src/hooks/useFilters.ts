import { useMemo, useState } from 'react';

import type { Product } from '@shopify/hydrogen-react/storefront-api-types';
import type { PartialDeep } from 'type-fest';

// Define the FilterState interface
interface FilterState {
  search: string;
  category: string;
  priceRange: [number, number];
  vendor: string;
  availability: 'all' | 'inStock' | 'outOfStock';
  sortBy: 'featured' | 'newest' | 'oldest' | 'priceAsc' | 'priceDesc' | 'nameAsc' | 'nameDesc';
  collections?: string[];
}

// Default filter state
const defaultFilters: FilterState = {
  search: '',
  category: '',
  priceRange: [0, 1000],
  vendor: '',
  availability: 'all',
  sortBy: 'featured',
  collections: [],
};

export function useProductFilters(products: PartialDeep<Product, { recurseIntoArrays: true }>[]) {
  // Manage filter state internally
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (product) =>
          product.title?.toLowerCase().includes(searchLower) ||
          product.vendor?.toLowerCase().includes(searchLower) ||
          product.productType?.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter((product) => product.productType === filters.category);
    }

    // Apply vendor filter
    if (filters.vendor) {
      filtered = filtered.filter((product) => product.vendor === filters.vendor);
    }

    // Apply availability filter
    if (filters.availability !== 'all') {
      filtered = filtered.filter((product) => {
        const isAvailable = product.availableForSale;
        return filters.availability === 'inStock' ? isAvailable : !isAvailable;
      });
    }

    // Apply price range filter
    filtered = filtered.filter((product) => {
      const price = parseFloat(product.priceRange?.minVariantPrice?.amount || '0');
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Apply collections filter
    if (filters.collections && filters.collections.length > 0) {
      filtered = filtered.filter((product) => {
        // Check if product belongs to any of the selected collections
        return (
          product.collections?.nodes?.some((collection) => filters.collections?.includes(collection?.id || '')) || false
        );
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case 'oldest':
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        case 'priceAsc':
          return (
            parseFloat(a.priceRange?.minVariantPrice?.amount || '0') -
            parseFloat(b.priceRange?.minVariantPrice?.amount || '0')
          );
        case 'priceDesc':
          return (
            parseFloat(b.priceRange?.minVariantPrice?.amount || '0') -
            parseFloat(a.priceRange?.minVariantPrice?.amount || '0')
          );
        case 'nameAsc':
          return (a.title || '').localeCompare(b.title || '');
        case 'nameDesc':
          return (b.title || '').localeCompare(a.title || '');
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, filters]);

  return {
    filters,
    setFilters,
    filteredProducts,
    filteredCount: filteredProducts.length,
  };
}

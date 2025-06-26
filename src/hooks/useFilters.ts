// src/hooks/useFilters.ts - Fixed version
import { useMemo, useState } from 'react';

import type { Product } from '@shopify/hydrogen-react/storefront-api-types';
import type { PartialDeep } from 'type-fest';

export interface FilterState {
  search: string;
  category: string;
  priceRange: [number, number];
  vendor: string;
  availability: 'all' | 'inStock' | 'outOfStock';
  sortBy: 'featured' | 'newest' | 'oldest' | 'priceAsc' | 'priceDesc' | 'nameAsc' | 'nameDesc';
}

const defaultFilters: FilterState = {
  search: '',
  category: '',
  priceRange: [0, 1000],
  vendor: '',
  availability: 'all',
  sortBy: 'featured',
};

export function useProductFilters(products: PartialDeep<Product, { recurseIntoArrays: true }>[] | undefined | null) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  // Ensure products is always an array
  const safeProducts = useMemo(() => {
    if (!products || !Array.isArray(products)) {
      console.warn('useProductFilters: products is not an array, using empty array');
      return [];
    }
    return products;
  }, [products]);

  const filteredProducts = useMemo(() => {
    // Start with safe products array
    let filtered = [...safeProducts];

    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter((product) => {
        const title = product.title?.toLowerCase() || '';
        const description = product.description?.toLowerCase() || '';
        const vendor = product.vendor?.toLowerCase() || '';
        const tags = product.tags?.join(' ').toLowerCase() || '';

        return (
          title.includes(searchTerm) ||
          description.includes(searchTerm) ||
          vendor.includes(searchTerm) ||
          tags.includes(searchTerm)
        );
      });
    }

    // Apply category filter (product type)
    if (filters.category) {
      filtered = filtered.filter((product) => product.productType?.toLowerCase() === filters.category.toLowerCase());
    }

    // Apply vendor filter
    if (filters.vendor) {
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

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'newest':
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case 'oldest':
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        case 'priceAsc':
          const priceA = a.variants?.nodes?.[0]?.price?.amount ? parseFloat(a.variants.nodes[0].price.amount) : 0;
          const priceB = b.variants?.nodes?.[0]?.price?.amount ? parseFloat(b.variants.nodes[0].price.amount) : 0;
          return priceA - priceB;
        case 'priceDesc':
          const priceA2 = a.variants?.nodes?.[0]?.price?.amount ? parseFloat(a.variants.nodes[0].price.amount) : 0;
          const priceB2 = b.variants?.nodes?.[0]?.price?.amount ? parseFloat(b.variants.nodes[0].price.amount) : 0;
          return priceB2 - priceA2;
        case 'nameAsc':
          return (a.title || '').localeCompare(b.title || '');
        case 'nameDesc':
          return (b.title || '').localeCompare(a.title || '');
        case 'featured':
        default:
          return 0; // Keep original order
      }
    });

    return filtered;
  }, [safeProducts, filters]);

  return {
    filters,
    setFilters,
    filteredProducts,
    totalProducts: safeProducts.length,
    filteredCount: filteredProducts.length,
  };
}

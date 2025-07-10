import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { FilterState } from '@/types';

export function useUrlFilters(initialFilters: FilterState) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  // Parse filters from URL on mount
  useEffect(() => {
    const urlFilters: Partial<FilterState> = {};

    // Parse search parameter
    const search = searchParams.get('search');
    if (search) urlFilters.search = search;

    // Parse category parameter
    const category = searchParams.get('category');
    if (category) urlFilters.category = category;

    // Parse vendor parameter
    const vendor = searchParams.get('vendor');
    if (vendor) urlFilters.vendor = vendor;

    // Parse availability parameter
    const availability = searchParams.get('availability');
    if (availability && ['all', 'inStock', 'outOfStock'].includes(availability)) {
      urlFilters.availability = availability as FilterState['availability'];
    }

    // Parse sort parameter
    const sortBy = searchParams.get('sortBy');
    if (sortBy && ['featured', 'newest', 'oldest', 'priceAsc', 'priceDesc', 'nameAsc', 'nameDesc'].includes(sortBy)) {
      urlFilters.sortBy = sortBy as FilterState['sortBy'];
    }

    // Parse price range
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    if (minPrice || maxPrice) {
      urlFilters.priceRange = [
        minPrice ? parseInt(minPrice) : initialFilters.priceRange[0],
        maxPrice ? parseInt(maxPrice) : initialFilters.priceRange[1],
      ];
    }

    // Parse collections
    const collections = searchParams.get('collections');
    if (collections) {
      urlFilters.collections = collections.split(',');
    }

    // Merge URL filters with initial filters
    setFilters((prev) => ({ ...prev, ...urlFilters }));
  }, [searchParams, initialFilters]);

  // Update URL when filters change
  const updateFilters = useCallback(
    (newFilters: FilterState) => {
      setFilters(newFilters);

      // Create URL search params
      const params = new URLSearchParams();

      // Add non-default values to URL
      if (newFilters.search) params.set('search', newFilters.search);
      if (newFilters.category) params.set('category', newFilters.category);
      if (newFilters.vendor) params.set('vendor', newFilters.vendor);
      if (newFilters.availability !== 'all') params.set('availability', newFilters.availability);
      if (newFilters.sortBy !== 'featured') params.set('sortBy', newFilters.sortBy);

      // Add price range if not default
      const [minPrice, maxPrice] = newFilters.priceRange;
      if (minPrice > 0) params.set('minPrice', minPrice.toString());
      if (maxPrice < 1000) params.set('maxPrice', maxPrice.toString());

      // Add collections if any selected
      if (newFilters.collections && newFilters.collections.length > 0) {
        params.set('collections', newFilters.collections.join(','));
      }

      // Update URL without page refresh
      const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
      router.replace(newUrl, { scroll: false });
    },
    [router]
  );

  return { filters, updateFilters };
}

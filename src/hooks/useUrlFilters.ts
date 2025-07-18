import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { FilterState } from '@/types';

export function useUrlFilters(initialFilters: FilterState) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  // Update local state when initialFilters change (from server)
  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  // Update URL when filters change
  const updateFilters = useCallback(
    (newFilters: FilterState) => {
      setFilters(newFilters);

      // Create URL search params
      const params = new URLSearchParams();

      // Reset pagination when filters change (except for pagination-only changes)
      const currentPage = searchParams.get('page');
      const shouldResetPage = JSON.stringify(newFilters) !== JSON.stringify(filters);

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

      // Keep current page if no filter changes, otherwise reset to page 1
      if (!shouldResetPage && currentPage) {
        params.set('page', currentPage);
      }
      // If shouldResetPage is true, we don't set page parameter (defaults to 1)

      // Update URL without page refresh
      const newUrl = params.toString() ? `?${params.toString()}` : window.location.pathname;
      router.push(newUrl); // Use push instead of replace for proper history
    },
    [router, searchParams, filters]
  );

  return { filters, updateFilters };
}

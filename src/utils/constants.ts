export const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name', label: 'Name: A to Z' },
] as const;

export const AVAILABILITY_OPTIONS = [
  { value: 'all', label: 'All Products' },
  { value: 'inStock', label: 'In Stock' },
  { value: 'outOfStock', label: 'Out of Stock' },
] as const;

export const ITEMS_PER_PAGE = 12;

export const CURRENCY = 'EUR';

export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

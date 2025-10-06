import { Collection, Product } from '@shopify/hydrogen-react/storefront-api-types';
import { PartialDeep } from 'type-fest';

export type { Product, Collection, ProductVariant } from '@shopify/hydrogen-react/storefront-api-types';
export type { PartialDeep } from 'type-fest';

export interface FilterState {
  search: string;
  category: string;
  priceRange: [number, number];
  vendor: string;
  availability: 'all' | 'inStock' | 'outOfStock';
  sortBy: 'featured' | 'newest' | 'oldest' | 'priceAsc' | 'priceDesc' | 'nameAsc' | 'nameDesc';
  collections?: string[]; // Add this line - array of collection IDs for filtering
}

export interface ProductsPageProps {
  products: PartialDeep<Product, { recurseIntoArrays: true }>[];
  collections?: PartialDeep<Collection, { recurseIntoArrays: true }>[];
  currentCollection?: PartialDeep<Collection, { recurseIntoArrays: true }>;
  totalProducts?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

export interface CollectionPageProps {
  collection: PartialDeep<Collection, { recurseIntoArrays: true }>;
  products: PartialDeep<Product, { recurseIntoArrays: true }>[];
  totalProducts?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  allCollections?: PartialDeep<Collection, { recurseIntoArrays: true }>[];
}

// Default filter state with collections included
export const defaultFilterState: FilterState = {
  search: '',
  category: '',
  priceRange: [0, 1000],
  vendor: '',
  availability: 'all',
  sortBy: 'featured',
  collections: [], // Include empty array as default
};

// Type for filter options
export interface FilterOptions {
  vendors: string[];
  categories: string[];
  maxPrice: number;
  collections: {
    id: string;
    title: string;
    handle: string;
  }[];
}

// You might also want to add these utility types for better type safety
export type SortByValue = FilterState['sortBy'];
export type AvailabilityValue = FilterState['availability'];

// Type guard for valid sort values
export function isValidSortBy(value: string): value is SortByValue {
  return ['featured', 'newest', 'oldest', 'priceAsc', 'priceDesc', 'nameAsc', 'nameDesc'].includes(value);
}

// Type guard for valid availability values
export function isValidAvailability(value: string): value is AvailabilityValue {
  return ['all', 'inStock', 'outOfStock'].includes(value);
}

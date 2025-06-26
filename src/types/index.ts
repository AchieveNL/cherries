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

export interface ProductsPageProps {
  products: PartialDeep<Product, { recurseIntoArrays: true }>[];
  collections?: PartialDeep<Collection, { recurseIntoArrays: true }>[];
  currentCollection?: PartialDeep<Collection, { recurseIntoArrays: true }>;
  totalProducts?: number;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

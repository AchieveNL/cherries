import type { Product } from '@shopify/hydrogen-react/storefront-api-types';
import type { PartialDeep } from 'type-fest';

export function getProductPrice(product: PartialDeep<Product, { recurseIntoArrays: true }>): number {
  const firstVariant = product.variants?.nodes?.[0];
  return parseFloat(firstVariant?.price?.amount || '0');
}

export function getProductCompareAtPrice(product: PartialDeep<Product, { recurseIntoArrays: true }>): number | null {
  const firstVariant = product.variants?.nodes?.[0];
  const amount = firstVariant?.compareAtPrice?.amount;
  return amount ? parseFloat(amount) : null;
}

export function isProductOnSale(product: PartialDeep<Product, { recurseIntoArrays: true }>): boolean {
  const price = getProductPrice(product);
  const compareAtPrice = getProductCompareAtPrice(product);
  return compareAtPrice !== null && compareAtPrice > price;
}

export function getDiscountPercentage(product: PartialDeep<Product, { recurseIntoArrays: true }>): number {
  const price = getProductPrice(product);
  const compareAtPrice = getProductCompareAtPrice(product);
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round((1 - price / compareAtPrice) * 100);
}

export function isProductAvailable(product: PartialDeep<Product, { recurseIntoArrays: true }>): boolean {
  return product.variants?.nodes?.some((variant) => variant?.availableForSale) || false;
}

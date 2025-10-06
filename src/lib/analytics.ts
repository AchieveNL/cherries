/* eslint-disable @typescript-eslint/no-unused-vars */
// src/lib/analytics.ts
import {
  AnalyticsEventName,
  AnalyticsPageType,
  getClientBrowserParameters,
  sendShopifyAnalytics,
  ShopifySalesChannel,
} from '@shopify/hydrogen-react';

import type {
  ClientBrowserParameters,
  ShopifyAddToCart,
  ShopifyAddToCartPayload,
  ShopifyAnalytics,
  ShopifyAnalyticsPayload,
  ShopifyAnalyticsProduct,
  ShopifyCookies,
  ShopifyPageView,
  ShopifyPageViewPayload,
} from '@shopify/hydrogen-react';

function formatShopId(shopId: string): string {
  if (shopId.startsWith('gid://shopify/Shop/')) {
    return shopId;
  }
  return `gid://shopify/Shop/${shopId}`;
}

// Configuration
const SHOPIFY_CONFIG = {
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || '',
  shopId: formatShopId(process.env.NEXT_PUBLIC_SHOPIFY_SHOP_ID || ''),
  storefrontId: process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN_FRONT || '',
};

// Get browser parameters for analytics
export function getBrowserParameters(): ClientBrowserParameters {
  return getClientBrowserParameters();
}

// Track page views
export function trackPageView(payload: {
  url?: string;
  path?: string;
  search?: string;
  title?: string;
  pageType?: keyof typeof AnalyticsPageType;
  resourceId?: string;
  collectionHandle?: string;
  searchString?: string;
}): void {
  const pageViewPayload: ShopifyPageViewPayload = {
    ...getBrowserParameters(),
    hasUserConsent: true,
    shopId: SHOPIFY_CONFIG.shopId,
    currency: 'USD' as const,
    storefrontId: SHOPIFY_CONFIG.storefrontId,
    shopifySalesChannel: 'headless' as const,
    pageType: payload.pageType || 'page',
    resourceId: payload.resourceId,
    collectionHandle: payload.collectionHandle,
    searchString: payload.searchString,
    canonicalUrl: payload.url || (typeof window !== 'undefined' ? window.location.href : ''),
  };

  const analyticsEvent: ShopifyPageView = {
    eventName: AnalyticsEventName.PAGE_VIEW,
    payload: pageViewPayload,
  };

  sendShopifyAnalytics(analyticsEvent, SHOPIFY_CONFIG.storeDomain);
}

// Track product page views
export function trackProductView(product: {
  id: string;
  title: string;
  price: string;
  vendor?: string;
  productType?: string;
  variantId?: string;
  variantTitle?: string;
  sku?: string;
  quantity?: number;
}): void {
  const productPayload: ShopifyAnalyticsProduct = {
    productGid: product.id,
    variantGid: product.variantId,
    name: product.title,
    variantName: product.variantTitle,
    brand: product.vendor || '',
    category: product.productType,
    price: product.price,
    sku: product.sku,
    quantity: product.quantity || 1,
  };

  const pageViewPayload: ShopifyPageViewPayload = {
    ...getBrowserParameters(),
    hasUserConsent: true,
    shopId: SHOPIFY_CONFIG.shopId,
    currency: 'USD' as const,
    storefrontId: SHOPIFY_CONFIG.storefrontId,
    shopifySalesChannel: 'headless' as const,
    pageType: 'product',
    resourceId: product.id,
    products: [productPayload],
    totalValue: parseFloat(product.price),
  };

  const analyticsEvent: ShopifyPageView = {
    eventName: AnalyticsEventName.PRODUCT_VIEW,
    payload: pageViewPayload,
  };

  sendShopifyAnalytics(analyticsEvent, SHOPIFY_CONFIG.storeDomain);
}

// Track add to cart events
export function trackAddToCart(payload: {
  cartId: string;
  product: {
    id: string;
    title: string;
    price: string;
    quantity: number;
    variantId: string;
    variantTitle?: string;
    vendor?: string;
    productType?: string;
    sku?: string;
  };
  totalValue?: number;
}): void {
  const productPayload: ShopifyAnalyticsProduct = {
    productGid: payload.product.id,
    variantGid: payload.product.variantId,
    name: payload.product.title,
    variantName: payload.product.variantTitle,
    brand: payload.product.vendor || '',
    category: payload.product.productType,
    price: payload.product.price,
    sku: payload.product.sku,
    quantity: payload.product.quantity,
  };

  const addToCartPayload: ShopifyAddToCartPayload = {
    ...getBrowserParameters(),
    hasUserConsent: true,
    shopId: SHOPIFY_CONFIG.shopId,
    currency: 'USD' as const,
    storefrontId: SHOPIFY_CONFIG.storefrontId,
    shopifySalesChannel: 'headless' as const,
    cartId: payload.cartId,
    products: [productPayload],
    totalValue: payload.totalValue || parseFloat(payload.product.price) * payload.product.quantity,
  };

  const analyticsEvent: ShopifyAddToCart = {
    eventName: AnalyticsEventName.ADD_TO_CART,
    payload: addToCartPayload,
  };

  sendShopifyAnalytics(analyticsEvent, SHOPIFY_CONFIG.storeDomain);
}

// Track collection page views
export function trackCollectionView(collection: { id: string; title: string; handle: string }): void {
  const pageViewPayload: ShopifyPageViewPayload = {
    ...getBrowserParameters(),
    hasUserConsent: true,
    shopId: SHOPIFY_CONFIG.shopId,
    currency: 'USD' as const,
    storefrontId: SHOPIFY_CONFIG.storefrontId,
    shopifySalesChannel: 'headless' as const,
    pageType: 'collection',
    resourceId: collection.id,
    collectionHandle: collection.handle,
    collectionId: collection.id,
  };

  const analyticsEvent: ShopifyPageView = {
    eventName: AnalyticsEventName.COLLECTION_VIEW,
    payload: pageViewPayload,
  };

  sendShopifyAnalytics(analyticsEvent, SHOPIFY_CONFIG.storeDomain);
}

// Track search events
export function trackSearch(query: string, resultCount?: number): void {
  const pageViewPayload: ShopifyPageViewPayload = {
    ...getBrowserParameters(),
    hasUserConsent: true,
    shopId: SHOPIFY_CONFIG.shopId,
    currency: 'USD' as const,
    storefrontId: SHOPIFY_CONFIG.storefrontId,
    shopifySalesChannel: 'headless' as const,
    pageType: 'search',
    searchString: query,
  };

  const analyticsEvent: ShopifyPageView = {
    eventName: AnalyticsEventName.SEARCH_VIEW,
    payload: pageViewPayload,
  };

  sendShopifyAnalytics(analyticsEvent, SHOPIFY_CONFIG.storeDomain);
}

// Export types and constants
export type {
  ClientBrowserParameters,
  ShopifyAddToCart,
  ShopifyAddToCartPayload,
  ShopifyAnalytics,
  ShopifyAnalyticsPayload,
  ShopifyAnalyticsProduct,
  ShopifyCookies,
  ShopifyPageView,
  ShopifyPageViewPayload,
};

export { AnalyticsEventName, AnalyticsPageType, ShopifySalesChannel };

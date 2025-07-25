'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import type { Product } from '@shopify/hydrogen-react/storefront-api-types';
import type { PartialDeep } from 'type-fest';

// Define the wishlist item type
export interface WishlistItem {
  id: string;
  variantId: string;
  handle: string;
  title: string;
  description?: string;
  price?: {
    amount: string;
    currencyCode: string;
  };
  compareAtPrice?: {
    amount: string;
    currencyCode: string;
  };
  image?: {
    url: string;
    altText?: string;
  };
  availableForSale: boolean;
  createdAt: string;
  addedToWishlistAt: string; // When item was added to wishlist
}

interface WishlistContextType {
  items: WishlistItem[];
  addItem: (product: PartialDeep<Product, { recurseIntoArrays: true }>, selectedVariantId?: string) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  itemCount: number;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const WISHLIST_STORAGE_KEY = 'casehub_wishlist';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(WISHLIST_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Validate that items have required fields, especially variantId
        const validItems = Array.isArray(parsed) ? parsed.filter((item) => item.id && item.variantId) : [];
        setItems(validItems);
      }
    } catch (error) {
      console.warn('Failed to load wishlist from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save wishlist to localStorage whenever items change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
      } catch (error) {
        console.warn('Failed to save wishlist to localStorage:', error);
      }
    }
  }, [items, isLoading]);

  // Helper function to convert product to wishlist item
  const convertToWishlistItem = (
    product: PartialDeep<Product, { recurseIntoArrays: true }>,
    selectedVariantId?: string
  ): WishlistItem => {
    // Find the selected variant or use the first available variant
    let targetVariant;

    if (selectedVariantId) {
      // Look for the specific variant ID
      targetVariant = product.variants?.nodes?.find((variant) => variant?.id === selectedVariantId);
    }

    // Fallback to first available variant or just first variant
    if (!targetVariant) {
      targetVariant =
        product.variants?.nodes?.find((variant) => variant?.availableForSale) ||
        product.variants?.nodes?.[0] ||
        (Array.isArray(product.variants) ? product.variants[0] : null);
    }

    // Get first image
    const firstImage = product.images?.nodes?.[0] || (Array.isArray(product.images) ? product.images[0] : null);

    // Ensure we have a variant ID
    if (!targetVariant?.id) {
      throw new Error('Cannot add product to wishlist: No valid variant found');
    }

    return {
      id: product.id || '',
      variantId: targetVariant.id,
      handle: product.handle || '',
      title: product.title || '',
      description: product.description || '',
      price: targetVariant?.price
        ? {
            amount: targetVariant.price.amount || '0',
            currencyCode: targetVariant.price.currencyCode || 'USD',
          }
        : undefined,
      compareAtPrice: targetVariant?.compareAtPrice
        ? {
            amount: targetVariant.compareAtPrice.amount || '0',
            currencyCode: targetVariant.compareAtPrice.currencyCode || 'USD',
          }
        : undefined,
      image: firstImage?.url
        ? {
            url: firstImage.url,
            altText: firstImage.altText || product.title || '',
          }
        : undefined,
      availableForSale: targetVariant?.availableForSale ?? true,
      createdAt: product.createdAt || new Date().toISOString(),
      addedToWishlistAt: new Date().toISOString(),
    };
  };

  const addItem = (product: PartialDeep<Product, { recurseIntoArrays: true }>, selectedVariantId?: string) => {
    if (!product.id) return;

    try {
      setItems((prevItems) => {
        // Check if item already exists (by product ID)
        if (prevItems.some((item) => item.id === product.id)) {
          return prevItems;
        }

        // Add new item
        const newItem = convertToWishlistItem(product, selectedVariantId);
        return [...prevItems, newItem];
      });
    } catch (error) {
      console.error('Failed to add item to wishlist:', error);
      // You might want to show a toast notification here
    }
  };

  const removeItem = (productId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  const isInWishlist = (productId: string) => {
    return items.some((item) => item.id === productId);
  };

  const clearWishlist = () => {
    setItems([]);
  };

  const value: WishlistContextType = {
    items,
    addItem,
    removeItem,
    isInWishlist,
    clearWishlist,
    itemCount: items.length,
    isLoading,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}

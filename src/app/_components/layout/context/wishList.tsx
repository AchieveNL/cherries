'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import type { Product } from '@shopify/hydrogen-react/storefront-api-types';
import type { PartialDeep } from 'type-fest';

// Define the wishlist item type
export interface WishlistItem {
  id: string;
  handle: string;
  title: string;
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
  addItem: (product: PartialDeep<Product, { recurseIntoArrays: true }>) => void;
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
        setItems(Array.isArray(parsed) ? parsed : []);
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
  const convertToWishlistItem = (product: PartialDeep<Product, { recurseIntoArrays: true }>): WishlistItem => {
    // Get first variant for price info
    const firstVariant = product.variants?.nodes?.[0] || (Array.isArray(product.variants) ? product.variants[0] : null);

    // Get first image
    const firstImage = product.images?.nodes?.[0] || (Array.isArray(product.images) ? product.images[0] : null);

    return {
      id: product.id || '',
      handle: product.handle || '',
      title: product.title || '',
      price: firstVariant?.price
        ? {
            amount: firstVariant.price.amount || '0',
            currencyCode: firstVariant.price.currencyCode || 'USD',
          }
        : undefined,
      compareAtPrice: firstVariant?.compareAtPrice
        ? {
            amount: firstVariant.compareAtPrice.amount || '0',
            currencyCode: firstVariant.compareAtPrice.currencyCode || 'USD',
          }
        : undefined,
      image: firstImage?.url
        ? {
            url: firstImage.url,
            altText: firstImage.altText || product.title || '',
          }
        : undefined,
      availableForSale: firstVariant?.availableForSale ?? true,
      createdAt: product.createdAt || new Date().toISOString(),
      addedToWishlistAt: new Date().toISOString(),
    };
  };

  const addItem = (product: PartialDeep<Product, { recurseIntoArrays: true }>) => {
    if (!product.id) return;

    setItems((prevItems) => {
      // Check if item already exists
      if (prevItems.some((item) => item.id === product.id)) {
        return prevItems;
      }

      // Add new item
      const newItem = convertToWishlistItem(product);
      return [...prevItems, newItem];
    });
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

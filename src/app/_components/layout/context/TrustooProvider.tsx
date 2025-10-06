/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { createContext, useCallback, useContext, useEffect, useReducer } from 'react';

import { Review } from '@/lib/review';
import { ClientTrustooAdapter, createClientTrustooAdapter } from '@/lib/trustoo-client';

// Types
interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: Record<number, number>;
  verifiedReviews: number;
}

interface ProductReviewData {
  reviews: Review[];
  stats: ReviewStats | null;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

interface TrustooState {
  products: Record<string, ProductReviewData>;
  client: ClientTrustooAdapter | null;
  clientError: string | null;
  isInitialized: boolean;
  isOnline: boolean;
  globalLoading: boolean;
  globalError: string | null;
}

// Actions
type TrustooAction =
  | { type: 'SET_CLIENT'; payload: ClientTrustooAdapter }
  | { type: 'SET_CLIENT_ERROR'; payload: string }
  | { type: 'SET_INITIALIZED'; payload: boolean }
  | { type: 'SET_ONLINE_STATUS'; payload: boolean }
  | { type: 'SET_GLOBAL_LOADING'; payload: boolean }
  | { type: 'SET_GLOBAL_ERROR'; payload: string | null }
  | { type: 'FETCH_START'; payload: { productId: string } }
  | { type: 'FETCH_SUCCESS'; payload: { productId: string; reviews: Review[]; stats: ReviewStats } }
  | { type: 'FETCH_ERROR'; payload: { productId: string; error: string } }
  | { type: 'CLEAR_CACHE'; payload?: { productId?: string } }
  | { type: 'UPDATE_REVIEW'; payload: { productId: string; review: Review } }
  | { type: 'DELETE_REVIEW'; payload: { productId: string; reviewId: string } }
  | { type: 'ADD_REVIEW'; payload: { productId: string; review: Review } }
  | { type: 'BULK_ADD_REVIEWS'; payload: { productId: string; reviews: Review[] } }
  | { type: 'SET_LOADING'; payload: { productId: string; loading: boolean } }
  | { type: 'SET_ERROR'; payload: { productId: string; error: string | null } }
  | { type: 'UPDATE_STATS'; payload: { productId: string; stats: ReviewStats } }
  | { type: 'RESET_PRODUCT_DATA'; payload: { productId: string } }
  | { type: 'RESET_ALL_DATA' };

// Helper function to calculate stats from reviews
function calculateStatsFromReviews(reviews: Review[]): ReviewStats {
  if (reviews.length === 0) {
    return {
      totalReviews: 0,
      averageRating: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      verifiedReviews: 0,
    };
  }

  const totalReviews = reviews.length;
  const averageRating = reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

  const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach((review) => {
    ratingDistribution[review.rating] = (ratingDistribution[review.rating] || 0) + 1;
  });

  const verifiedReviews = reviews.filter((review) => review.verified === 1).length;

  return {
    totalReviews,
    averageRating,
    ratingDistribution,
    verifiedReviews,
  };
}

// Helper function to merge reviews and remove duplicates
function mergeReviews(existingReviews: Review[], newReviews: Review[]): Review[] {
  const reviewMap = new Map<string, Review>();

  // Add existing reviews
  existingReviews.forEach((review) => {
    reviewMap.set(review.id, review);
  });

  // Add new reviews (will overwrite existing ones with same ID)
  newReviews.forEach((review) => {
    reviewMap.set(review.id, review);
  });

  return Array.from(reviewMap.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

function trustooReducer(state: TrustooState, action: TrustooAction): TrustooState {
  switch (action.type) {
    case 'SET_CLIENT':
      return {
        ...state,
        client: action.payload,
        clientError: null,
        isInitialized: true,
        globalError: null,
      };

    case 'SET_CLIENT_ERROR':
      return {
        ...state,
        client: null,
        clientError: action.payload,
        isInitialized: true,
        globalError: action.payload,
      };

    case 'SET_INITIALIZED':
      return {
        ...state,
        isInitialized: action.payload,
      };

    case 'SET_ONLINE_STATUS':
      return {
        ...state,
        isOnline: action.payload,
      };

    case 'SET_GLOBAL_LOADING':
      return {
        ...state,
        globalLoading: action.payload,
      };

    case 'SET_GLOBAL_ERROR':
      return {
        ...state,
        globalError: action.payload,
      };

    case 'FETCH_START': {
      const { productId } = action.payload;
      const existingProductData = state.products[productId];

      return {
        ...state,
        products: {
          ...state.products,
          [productId]: {
            reviews: existingProductData?.reviews || [],
            stats: existingProductData?.stats || null,
            loading: true,
            error: null,
            lastFetched: existingProductData?.lastFetched || null,
          },
        },
      };
    }

    case 'FETCH_SUCCESS':
      return {
        ...state,
        products: {
          ...state.products,
          [action.payload.productId]: {
            reviews: action.payload.reviews,
            stats: action.payload.stats,
            loading: false,
            error: null,
            lastFetched: Date.now(),
          },
        },
      };

    case 'FETCH_ERROR':
      return {
        ...state,
        products: {
          ...state.products,
          [action.payload.productId]: {
            ...state.products[action.payload.productId],
            loading: false,
            error: action.payload.error,
          },
        },
      };

    case 'CLEAR_CACHE':
      if (action.payload?.productId) {
        const { [action.payload.productId]: _, ...rest } = state.products;
        return {
          ...state,
          products: rest,
        };
      }
      return {
        ...state,
        products: {},
      };

    case 'SET_LOADING':
      return {
        ...state,
        products: {
          ...state.products,
          [action.payload.productId]: {
            ...state.products[action.payload.productId],
            loading: action.payload.loading,
          },
        },
      };

    case 'SET_ERROR':
      return {
        ...state,
        products: {
          ...state.products,
          [action.payload.productId]: {
            ...state.products[action.payload.productId],
            error: action.payload.error,
          },
        },
      };

    case 'ADD_REVIEW':
      const productData = state.products[action.payload.productId];
      if (!productData) {
        // Initialize product data with the new review
        const newReview = action.payload.review;
        return {
          ...state,
          products: {
            ...state.products,
            [action.payload.productId]: {
              reviews: [newReview],
              stats: calculateStatsFromReviews([newReview]),
              loading: false,
              error: null,
              lastFetched: Date.now(),
            },
          },
        };
      }

      // Add review to existing data
      const updatedReviewsAdd = [action.payload.review, ...productData.reviews];
      const uniqueReviewsAdd = mergeReviews(productData.reviews, [action.payload.review]);

      return {
        ...state,
        products: {
          ...state.products,
          [action.payload.productId]: {
            ...productData,
            reviews: uniqueReviewsAdd,
            stats: calculateStatsFromReviews(uniqueReviewsAdd),
            lastFetched: Date.now(),
          },
        },
      };

    case 'BULK_ADD_REVIEWS':
      const productDataBulk = state.products[action.payload.productId];
      const newReviews = action.payload.reviews;

      if (!productDataBulk) {
        // Initialize product data with the new reviews
        return {
          ...state,
          products: {
            ...state.products,
            [action.payload.productId]: {
              reviews: newReviews,
              stats: calculateStatsFromReviews(newReviews),
              loading: false,
              error: null,
              lastFetched: Date.now(),
            },
          },
        };
      }

      // Merge with existing data
      const mergedReviews = mergeReviews(productDataBulk.reviews, newReviews);

      return {
        ...state,
        products: {
          ...state.products,
          [action.payload.productId]: {
            ...productDataBulk,
            reviews: mergedReviews,
            stats: calculateStatsFromReviews(mergedReviews),
            lastFetched: Date.now(),
          },
        },
      };

    case 'UPDATE_REVIEW':
      const productDataUpdate = state.products[action.payload.productId];
      if (!productDataUpdate) return state;

      const updatedReviews = productDataUpdate.reviews.map((review) =>
        review.id === action.payload.review.id ? { ...review, ...action.payload.review } : review
      );

      return {
        ...state,
        products: {
          ...state.products,
          [action.payload.productId]: {
            ...productDataUpdate,
            reviews: updatedReviews,
            stats: calculateStatsFromReviews(updatedReviews),
            lastFetched: Date.now(),
          },
        },
      };

    case 'DELETE_REVIEW':
      const productDataForDelete = state.products[action.payload.productId];
      if (!productDataForDelete) return state;

      const filteredReviews = productDataForDelete.reviews.filter((review) => review.id !== action.payload.reviewId);

      return {
        ...state,
        products: {
          ...state.products,
          [action.payload.productId]: {
            ...productDataForDelete,
            reviews: filteredReviews,
            stats: calculateStatsFromReviews(filteredReviews),
            lastFetched: Date.now(),
          },
        },
      };

    case 'UPDATE_STATS':
      const productDataStats = state.products[action.payload.productId];
      if (!productDataStats) return state;

      return {
        ...state,
        products: {
          ...state.products,
          [action.payload.productId]: {
            ...productDataStats,
            stats: action.payload.stats,
          },
        },
      };

    case 'RESET_PRODUCT_DATA':
      const { [action.payload.productId]: _, ...remainingProducts } = state.products;
      return {
        ...state,
        products: remainingProducts,
      };

    case 'RESET_ALL_DATA':
      return {
        ...state,
        products: {},
        globalError: null,
      };

    default:
      return state;
  }
}

// Context
const TrustooContext = createContext<{
  state: TrustooState;
  dispatch: React.Dispatch<TrustooAction>;
  // Helper methods
  clearProductCache: (productId: string) => void;
  clearAllCache: () => void;
  refreshProduct: (productId: string) => void;
  getProductData: (productId: string) => ProductReviewData;
  isProductLoading: (productId: string) => boolean;
  hasProductError: (productId: string) => boolean;
} | null>(null);

// Provider Props
interface TrustooProviderProps {
  children: React.ReactNode;
  config?: {
    autoRetry?: boolean;
    retryAttempts?: number;
    retryDelay?: number;
    cacheTimeout?: number;
    enableOfflineMode?: boolean;
  };
}

// Initial state
const initialState: TrustooState = {
  products: {},
  client: null,
  clientError: null,
  isInitialized: false,
  isOnline: true,
  globalLoading: false,
  globalError: null,
};

// Provider Component
export function TrustooProvider({ children, config = {} }: TrustooProviderProps) {
  const [state, dispatch] = useReducer(trustooReducer, initialState);

  const {
    autoRetry = true,
    retryAttempts = 3,
    retryDelay = 1000,
    cacheTimeout = 5 * 60 * 1000,
    enableOfflineMode = true,
  } = config;

  // Network status monitoring
  useEffect(() => {
    if (!enableOfflineMode) return;

    const handleOnline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: true });
    const handleOffline = () => dispatch({ type: 'SET_ONLINE_STATUS', payload: false });

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Set initial online status
    dispatch({ type: 'SET_ONLINE_STATUS', payload: navigator.onLine });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [enableOfflineMode]);

  // Initialize client with retry logic
  const initClient = useCallback(
    async (attempt = 1) => {
      try {
        dispatch({ type: 'SET_GLOBAL_LOADING', payload: true });
        console.log(`Initializing Trustoo client adapter... (attempt ${attempt})`);

        // Use client adapter that proxies through our API routes
        const client = createClientTrustooAdapter();

        // Test the client connection
        await client.getReviews({ page_size: 1 });

        dispatch({ type: 'SET_CLIENT', payload: client });
        console.log('Trustoo client adapter initialized successfully');
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to initialize Trustoo client';
        console.error(`Trustoo initialization error (attempt ${attempt}):`, errorMessage);

        if (autoRetry && attempt < retryAttempts) {
          console.log(`Retrying in ${retryDelay}ms...`);
          setTimeout(() => {
            initClient(attempt + 1);
          }, retryDelay * attempt); // Exponential backoff
        } else {
          dispatch({ type: 'SET_CLIENT_ERROR', payload: errorMessage });
        }
      } finally {
        dispatch({ type: 'SET_GLOBAL_LOADING', payload: false });
      }
    },
    [autoRetry, retryAttempts, retryDelay]
  );

  // Initialize on mount
  useEffect(() => {
    initClient();
  }, [initClient]);

  // Helper methods
  const clearProductCache = useCallback((productId: string) => {
    dispatch({ type: 'CLEAR_CACHE', payload: { productId } });
  }, []);

  const clearAllCache = useCallback(() => {
    dispatch({ type: 'CLEAR_CACHE' });
  }, []);

  const refreshProduct = useCallback((productId: string) => {
    dispatch({ type: 'RESET_PRODUCT_DATA', payload: { productId } });
  }, []);

  const getProductData = useCallback(
    (productId: string): ProductReviewData => {
      return (
        state.products[productId] || {
          reviews: [],
          stats: null,
          loading: false,
          error: null,
          lastFetched: null,
        }
      );
    },
    [state.products]
  );

  const isProductLoading = useCallback(
    (productId: string): boolean => {
      return state.products[productId]?.loading || false;
    },
    [state.products]
  );

  const hasProductError = useCallback(
    (productId: string): boolean => {
      return Boolean(state.products[productId]?.error);
    },
    [state.products]
  );

  // Auto-cleanup stale cache
  useEffect(() => {
    const cleanup = setInterval(() => {
      const now = Date.now();
      const staleProducts: string[] = [];

      Object.entries(state.products).forEach(([productId, data]) => {
        if (data.lastFetched && now - data.lastFetched > cacheTimeout * 2) {
          staleProducts.push(productId);
        }
      });

      staleProducts.forEach((productId) => {
        dispatch({ type: 'CLEAR_CACHE', payload: { productId } });
      });
    }, cacheTimeout);

    return () => clearInterval(cleanup);
  }, [state.products, cacheTimeout]);

  // Context value
  const contextValue = {
    state,
    dispatch,
    clearProductCache,
    clearAllCache,
    refreshProduct,
    getProductData,
    isProductLoading,
    hasProductError,
  };

  return <TrustooContext.Provider value={contextValue}>{children}</TrustooContext.Provider>;
}

// Hook to use Trustoo context
export function useTrustooContext() {
  const context = useContext(TrustooContext);
  if (!context) {
    throw new Error('useTrustoo hooks must be used within a TrustooProvider');
  }
  return context;
}

// Hook to check if Trustoo is available
export function useTrustooStatus() {
  const { state } = useTrustooContext();

  return {
    isInitialized: state.isInitialized,
    isAvailable: !!state.client && !state.clientError,
    isOnline: state.isOnline,
    isLoading: state.globalLoading,
    error: state.clientError || state.globalError,
    client: state.client,
    hasError: !!state.clientError || !!state.globalError,
  };
}

// Hook for global operations
export function useTrustooOperations() {
  const { dispatch, clearAllCache, refreshProduct } = useTrustooContext();

  const resetAllData = useCallback(() => {
    dispatch({ type: 'RESET_ALL_DATA' });
  }, [dispatch]);

  const setGlobalError = useCallback(
    (error: string | null) => {
      dispatch({ type: 'SET_GLOBAL_ERROR', payload: error });
    },
    [dispatch]
  );

  const setGlobalLoading = useCallback(
    (loading: boolean) => {
      dispatch({ type: 'SET_GLOBAL_LOADING', payload: loading });
    },
    [dispatch]
  );

  return {
    resetAllData,
    clearAllCache,
    refreshProduct,
    setGlobalError,
    setGlobalLoading,
  };
}

// Hook for cache management
export function useTrustooCache() {
  const { state, clearProductCache, clearAllCache } = useTrustooContext();

  const getCacheInfo = useCallback(() => {
    const products = Object.keys(state.products);
    const totalReviews = Object.values(state.products).reduce((sum, product) => sum + product.reviews.length, 0);
    const cacheSize = JSON.stringify(state.products).length;

    return {
      productCount: products.length,
      totalReviews,
      cacheSize,
      products,
    };
  }, [state.products]);

  const isProductCached = useCallback(
    (productId: string) => {
      return !!state.products[productId]?.lastFetched;
    },
    [state.products]
  );

  const getProductCacheAge = useCallback(
    (productId: string) => {
      const lastFetched = state.products[productId]?.lastFetched;
      if (!lastFetched) return null;
      return Date.now() - lastFetched;
    },
    [state.products]
  );

  return {
    getCacheInfo,
    isProductCached,
    getProductCacheAge,
    clearProductCache,
    clearAllCache,
  };
}

// Export types for external use
export type { TrustooState, TrustooAction, ReviewStats, ProductReviewData };

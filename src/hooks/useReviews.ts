/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useTrustooContext, useTrustooStatus } from '@/app/_components/layout/context/TrustooProvider';
import {
  CreateReviewInterface,
  CreateReviewRequest,
  CreateReviewResponse,
  Review,
  ReviewUtils,
  Source,
} from '@/lib/review';
import { ClientTrustooAdapter } from '@/lib/trustoo-client';

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
}

// Main hook for product reviews
function useProductReviews(
  productId: string,
  options?: {
    autoFetch?: boolean;
    cacheTimeout?: number;
  }
) {
  const { state, dispatch } = useTrustooContext();
  const { autoFetch = true, cacheTimeout = 5 * 60 * 1000 } = options || {};

  const productData: ProductReviewData = state.products[productId] || {
    reviews: [],
    stats: null,
    loading: false,
    error: null,
    lastFetched: null,
  };

  // Check if data is stale
  const isStale = productData.lastFetched ? Date.now() - productData.lastFetched > cacheTimeout : true;

  // Fetch reviews function
  const fetchReviews = useCallback(
    async (forceRefresh = false) => {
      if (!state.client) {
        console.warn('Trustoo client not initialized');
        return;
      }

      if (!forceRefresh && !isStale && productData.reviews && productData.reviews.length > 0) {
        return; // Use cached data
      }

      try {
        dispatch({ type: 'FETCH_START', payload: { productId } });

        // Extract product ID from Shopify GID or use direct ID
        const cleanProductId = productId.includes('gid://') ? productId.split('/').pop() || productId : productId;

        // Fetch reviews and stats in parallel
        const [reviewsResponse, statsData] = await Promise.all([
          state.client.getProductReviews([cleanProductId], {
            page_size: 100,
            sort_by: 'created-descending',
          }),
          state.client.getProductReviewStats(cleanProductId),
        ]);

        dispatch({
          type: 'FETCH_SUCCESS',
          payload: {
            productId,
            reviews: reviewsResponse.data.list || [], // Ensure we always have an array
            stats: statsData,
          },
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to fetch reviews';
        dispatch({
          type: 'FETCH_ERROR',
          payload: { productId, error: errorMessage },
        });
      }
    },
    [state.client, productId, isStale, productData.reviews?.length || 0, dispatch] // Fix: Safe access with fallback
  );

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (autoFetch && state.client && isStale) {
      fetchReviews();
    }
  }, [autoFetch, state.client, isStale, fetchReviews]);

  // Refresh function
  const refresh = useCallback(() => {
    return fetchReviews(true);
  }, [fetchReviews]);

  // Clear cache function
  const clearCache = useCallback(() => {
    dispatch({ type: 'CLEAR_CACHE', payload: { productId } });
  }, [productId, dispatch]);

  return {
    ...productData,
    fetchReviews,
    refresh,
    clearCache,
    isStale,
  };
}

// Hook for review operations (create, update, delete)
function useReviewOperations(productId?: string) {
  const { state, dispatch } = useTrustooContext();
  const { isAvailable, error: clientError } = useTrustooStatus();

  const createReview = useCallback(
    async (reviewData: CreateReviewInterface): Promise<CreateReviewResponse> => {
      if (!state.client) {
        const errorMsg = clientError || 'Trustoo client not initialized. Please check your API credentials.';
        throw new Error(errorMsg);
      }

      try {
        const response = await state.client.createReview(reviewData);

        // If we have a productId and the review is for this product, refresh the cache
        if (productId && reviewData.product_id && reviewData.product_id.toString() === productId) {
          dispatch({ type: 'CLEAR_CACHE', payload: { productId } });
        }

        return response;
      } catch (error) {
        console.error('Failed to create review:', error);
        throw error;
      }
    },
    [state.client, productId, clientError, dispatch]
  );

  const createProductReview = useCallback(
    async (data: CreateReviewInterface): Promise<CreateReviewResponse> => {
      if (!state.client) {
        const errorMsg = clientError || 'Trustoo client not initialized. Please check your API credentials.';
        throw new Error(errorMsg);
      }

      try {
        const response = await state.client.createProductReview(data);

        // Clear cache for this product to force refresh
        if (productId && data.product_id && data.product_id.toString() === productId) {
          dispatch({ type: 'CLEAR_CACHE', payload: { productId } });
        }

        return response;
      } catch (error) {
        console.error('Failed to create product review:', error);
        throw error;
      }
    },
    [state.client, productId, clientError, dispatch]
  );

  // Fixed: Use createReview instead of createStoreReview since it doesn't exist
  const createStoreReview = useCallback(
    async (data: {
      rating: 1 | 2 | 3 | 4 | 5;
      author: string;
      content: string;
      authorEmail?: string;
      authorCountry?: string;
      title?: string;
      isVerified?: boolean;
      isFeatured?: boolean;
      isPublished?: boolean;
      source?: CreateReviewRequest['source'];
    }): Promise<CreateReviewResponse> => {
      if (!state.client) {
        throw new Error('Trustoo client not initialized');
      }

      try {
        // Use createReview for store reviews (without product_id)
        const reviewData: CreateReviewRequest = {
          rating: data.rating,
          author: data.author,
          content: data.content,
          author_email: data.authorEmail,
          author_country: data.authorCountry,
          title: data.title || '',
          commented_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
          is_verified: data.isVerified ? 1 : 0,
          is_featured: data.isFeatured ? 1 : 0,
          is_published: data.isPublished !== false ? 1 : 0,
          is_top: 0,
          source: data.source || Source.StoreFront,
          // Don't include product_id for store reviews
        };

        const response = await state.client.createReview(reviewData);
        return response;
      } catch (error) {
        console.error('Failed to create store review:', error);
        throw error;
      }
    },
    [state.client]
  );

  // Fixed: Simulate createReviewWithReply using createReview + reply logic
  const createReviewWithReply = useCallback(
    async (data: {
      productId?: number;
      rating: 1 | 2 | 3 | 4 | 5;
      author: string;
      content: string;
      replyContent: string;
      authorEmail?: string;
      authorCountry?: string;
      title?: string;
      isVerified?: boolean;
      isFeatured?: boolean;
      isPublished?: boolean;
      source?: CreateReviewRequest['source'];
    }): Promise<CreateReviewResponse> => {
      if (!state.client) {
        throw new Error('Trustoo client not initialized');
      }

      try {
        // First create the review
        const reviewData: CreateReviewRequest = {
          product_id: data.productId,
          rating: data.rating,
          author: data.author,
          content: data.content,
          author_email: data.authorEmail,
          author_country: data.authorCountry,
          title: data.title || '',
          commented_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
          is_verified: data.isVerified ? 1 : 0,
          is_featured: data.isFeatured ? 1 : 0,
          is_published: data.isPublished !== false ? 1 : 0,
          is_top: 0,
          source: data.source || Source.StoreFront,
        };

        const response = await state.client.createReview(reviewData);

        // TODO: Add reply logic here if your API supports it
        // For now, we'll just log that a reply would be added
        console.log(`Reply would be added to review ${response.message}: ${data.replyContent}`);

        // Clear cache if this is for a specific product
        if (productId && data.productId && data.productId.toString() === productId) {
          dispatch({ type: 'CLEAR_CACHE', payload: { productId } });
        }

        return response;
      } catch (error) {
        console.error('Failed to create review with reply:', error);
        throw error;
      }
    },
    [state.client, productId, dispatch]
  );

  const batchCreateReviews = useCallback(
    async (reviews: CreateReviewRequest[]): Promise<CreateReviewResponse[]> => {
      if (!state.client) {
        throw new Error('Trustoo client not initialized');
      }

      try {
        const results = await state.client.batchCreateReviews(reviews);

        // Clear cache for affected products
        const affectedProducts = new Set(
          reviews
            .filter((review) => review.product_id && review.product_id > 0)
            .map((review) => review.product_id!.toString())
        );

        affectedProducts.forEach((prodId) => {
          dispatch({ type: 'CLEAR_CACHE', payload: { productId: prodId } });
        });

        return results;
      } catch (error) {
        console.error('Failed to batch create reviews:', error);
        throw error;
      }
    },
    [state.client, dispatch]
  );

  const deleteReview = useCallback(
    async (reviewId: string) => {
      if (!state.client) {
        throw new Error('Trustoo client not initialized');
      }

      try {
        const numericReviewId = parseInt(reviewId, 10);
        if (isNaN(numericReviewId)) {
          throw new Error('Invalid review ID format');
        }

        await state.client.deleteReview(numericReviewId);

        if (productId) {
          dispatch({
            type: 'DELETE_REVIEW',
            payload: { productId, reviewId },
          });
        }

        return true;
      } catch (error) {
        console.error('Failed to delete review:', error);
        throw error;
      }
    },
    [state.client, productId, dispatch]
  );

  const batchDeleteReviews = useCallback(
    async (reviewIds: string[]) => {
      if (!state.client) {
        throw new Error('Trustoo client not initialized');
      }

      try {
        const numericIds = reviewIds.map((id) => {
          const numericId = parseInt(id, 10);
          if (isNaN(numericId)) {
            throw new Error(`Invalid review ID format: ${id}`);
          }
          return numericId;
        });

        const results = await state.client.batchDeleteReviews(numericIds);

        // Remove successfully deleted reviews from state
        if (productId) {
          reviewIds.forEach((reviewId) => {
            dispatch({
              type: 'DELETE_REVIEW',
              payload: { productId, reviewId },
            });
          });
        }

        return results;
      } catch (error) {
        console.error('Failed to batch delete reviews:', error);
        throw error;
      }
    },
    [state.client, productId, dispatch]
  );

  // Fixed: Remove updateReview since it doesn't exist on ClientTrustooAdapter
  const updateReview = useCallback(
    async (reviewId: string, updateData: Partial<CreateReviewRequest>): Promise<CreateReviewResponse> => {
      // Since updateReview doesn't exist on the client, we'll throw an error
      // or implement it as delete + create if needed
      throw new Error('Update review functionality not available. Consider deleting and recreating the review.');
    },
    []
  );

  return {
    createReview,
    createProductReview,
    createStoreReview,
    createReviewWithReply,
    batchCreateReviews,
    deleteReview,
    batchDeleteReviews,
    updateReview,
  };
}

// Hook for review statistics
function useReviewStats(productId: string) {
  const { stats, loading, error } = useProductReviews(productId);

  const getRatingPercentage = useCallback(
    (rating: number) => {
      if (!stats || stats.totalReviews === 0) return 0;
      return ((stats.ratingDistribution[rating] || 0) / stats.totalReviews) * 100;
    },
    [stats]
  );

  const getPositivePercentage = useCallback(() => {
    if (!stats || stats.totalReviews === 0) return 0;
    const positiveReviews = (stats.ratingDistribution[4] || 0) + (stats.ratingDistribution[5] || 0);
    return (positiveReviews / stats.totalReviews) * 100;
  }, [stats]);

  const getNegativePercentage = useCallback(() => {
    if (!stats || stats.totalReviews === 0) return 0;
    const negativeReviews = (stats.ratingDistribution[1] || 0) + (stats.ratingDistribution[2] || 0);
    return (negativeReviews / stats.totalReviews) * 100;
  }, [stats]);

  const getNeutralPercentage = useCallback(() => {
    if (!stats || stats.totalReviews === 0) return 0;
    const neutralReviews = stats.ratingDistribution[3] || 0;
    return (neutralReviews / stats.totalReviews) * 100;
  }, [stats]);

  const getVerifiedPercentage = useCallback(() => {
    if (!stats || stats.totalReviews === 0) return 0;
    return (stats.verifiedReviews / stats.totalReviews) * 100;
  }, [stats]);

  return {
    stats,
    loading,
    error,
    getRatingPercentage,
    getPositivePercentage,
    getNegativePercentage,
    getNeutralPercentage,
    getVerifiedPercentage,
  };
}

// Hook for filtered and sorted reviews
function useFilteredReviews(
  productId: string,
  filters?: {
    rating?: number;
    ratings?: number[];
    verified?: boolean;
    sortBy?: 'created-ascending' | 'created-descending' | 'rating-ascending' | 'rating-descending';
    limit?: number;
    keyword?: string;
    sources?: string[];
    is_store_review?: number;
    page?: number;
    page_size?: number;
  }
) {
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  // Create a stable version of filters to prevent unnecessary re-fetches
  const stableFilters = useMemo(() => {
    return JSON.stringify(filters);
  }, [filters]);

  const fetchFilteredReviews = useCallback(async () => {
    if (!productId) return;

    setLoading(true);
    setError(null);

    try {
      const parsedFilters = JSON.parse(stableFilters);

      // Build API parameters according to Trustoo API spec
      const params = new URLSearchParams();

      // Add product IDs - clean the productId first
      const cleanProductId = productId.includes('gid://') ? productId.split('/').pop() || productId : productId;

      if (cleanProductId) {
        params.append('product_ids[]', cleanProductId);
      }

      // Add ratings filter
      if (parsedFilters?.rating) {
        params.append('ratings[]', parsedFilters.rating.toString());
      }

      // Add sources filter
      if (parsedFilters?.sources && parsedFilters.sources.length > 0) {
        parsedFilters.sources.forEach((source: string) => {
          params.append('sources[]', source);
        });
      }

      // Add other filters
      if (parsedFilters?.keyword) {
        params.append('keyword', parsedFilters.keyword);
      }

      if (parsedFilters?.sort_by) {
        params.append('sort_by', parsedFilters.sort_by);
      }

      if (parsedFilters?.page_size) {
        params.append('page_size', parsedFilters.page_size.toString());
      }

      if (parsedFilters?.page) {
        params.append('page', parsedFilters.page.toString());
      }

      // IMPORTANT: Don't add is_store_review=0 by default, only if explicitly set to 1
      if (parsedFilters?.is_store_review === 1) {
        params.append('is_store_review', '1');
      }

      console.log('🔍 Fetching reviews with params:', params.toString());
      console.log('🔍 Clean product ID:', cleanProductId);
      console.log('🔍 Parsed filters:', parsedFilters);

      // Make API call
      const response = await fetch(`/api/trustoo/reviews?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // DEBUG: Log the actual API response
      console.log('🔍 API Response:', data);
      console.log('🔍 Reviews data:', data.data);
      console.log('🔍 Reviews list:', data.data?.list);
      console.log('🔍 Total count:', data.data?.total);

      const reviewsList = data.data?.list || [];
      const total = data.data?.total || 0;

      console.log('🔍 Setting reviews:', reviewsList);
      console.log('🔍 Setting total count:', total);

      setFilteredReviews(reviewsList);
      setTotalCount(total);
    } catch (err) {
      console.error('❌ Error fetching filtered reviews:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
      setFilteredReviews([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [productId, stableFilters]);

  // Add debounce to prevent too many API calls
  const debouncedFetch = useMemo(() => {
    const timeoutRef = { current: null as NodeJS.Timeout | null };

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        fetchFilteredReviews();
      }, 300); // 300ms debounce
    };
  }, [fetchFilteredReviews]);

  useEffect(() => {
    debouncedFetch();
  }, [debouncedFetch]);

  return {
    reviews: filteredReviews,
    totalCount,
    filteredCount: filteredReviews.length,
    loading,
    error,
    refresh: fetchFilteredReviews,
  };
}

// Fixed: Removed webhook hooks since the methods don't exist on ClientTrustooAdapter
// If you need webhook functionality, you'll need to add these methods to your ClientTrustooAdapter interface and implementation

// Hook for review validation and form helpers
function useReviewForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<string[]>([]);

  const validateReview = useCallback((data: Partial<CreateReviewRequest>) => {
    const validation = ReviewUtils.validateReviewData(data);
    setErrors(validation.errors);
    return validation.isValid;
  }, []);

  const createReviewTemplate = useCallback((overrides?: Partial<CreateReviewRequest>) => {
    return ReviewUtils.createReviewTemplate(overrides);
  }, []);

  const resetForm = useCallback(() => {
    setIsSubmitting(false);
    setErrors([]);
  }, []);

  return {
    isSubmitting,
    setIsSubmitting,
    errors,
    setErrors,
    validateReview,
    createReviewTemplate,
    clearErrors: () => setErrors([]),
    resetForm,
  };
}

// Hook for review analytics
function useReviewAnalytics(productId: string) {
  const { reviews, stats } = useProductReviews(productId);

  const getReviewTrends = useCallback(() => {
    if (!reviews.length) return [];

    // Group reviews by month
    const monthlyData = reviews.reduce(
      (acc, review) => {
        const date = new Date(review.created_at);
        const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

        if (!acc[monthKey]) {
          acc[monthKey] = {
            month: monthKey,
            count: 0,
            totalRating: 0,
            averageRating: 0,
          };
        }

        acc[monthKey].count++;
        acc[monthKey].totalRating += review.rating;
        acc[monthKey].averageRating = acc[monthKey].totalRating / acc[monthKey].count;

        return acc;
      },
      {} as Record<string, any>
    );

    return Object.values(monthlyData).sort((a: any, b: any) => a.month.localeCompare(b.month));
  }, [reviews]);

  const getTopKeywords = useCallback(() => {
    if (!reviews.length) return [];

    const allText = reviews
      .map((review) => `${review.content} ${review.review_title}`)
      .join(' ')
      .toLowerCase();

    // Simple keyword extraction (you might want to use a more sophisticated method)
    const words = allText.match(/\b\w{4,}\b/g) || [];
    const wordCount = words.reduce(
      (acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([word, count]) => ({ word, count }));
  }, [reviews]);

  const getReviewSentiment = useCallback(() => {
    if (!reviews.length) return { positive: 0, neutral: 0, negative: 0 };

    const sentiment = reviews.reduce(
      (acc, review) => {
        if (review.rating >= 4) acc.positive++;
        else if (review.rating === 3) acc.neutral++;
        else acc.negative++;
        return acc;
      },
      { positive: 0, neutral: 0, negative: 0 }
    );

    return sentiment;
  }, [reviews]);

  return {
    trends: getReviewTrends(),
    keywords: getTopKeywords(),
    sentiment: getReviewSentiment(),
    stats,
  };
}

// Hook for review comparison
function useReviewComparison(productIds: string[]) {
  const reviewsData = productIds.map((id) => useProductReviews(id));

  const comparison = React.useMemo(() => {
    return productIds.map((productId, index) => {
      const data = reviewsData[index];
      return {
        productId,
        stats: data.stats,
        loading: data.loading,
        error: data.error,
        reviewCount: data.reviews.length,
      };
    });
  }, [productIds, reviewsData]);

  const isLoading = comparison.some((item) => item.loading);
  const hasError = comparison.some((item) => item.error);

  return {
    comparison,
    isLoading,
    hasError,
  };
}

// Export all hooks (removed webhook hooks)
export {
  useProductReviews,
  useReviewOperations,
  useReviewStats,
  useFilteredReviews,
  useReviewForm,
  useReviewAnalytics,
  useReviewComparison,
};

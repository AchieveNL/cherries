import {
  CreateReviewInterface,
  CreateReviewRequest,
  CreateReviewResponse,
  DeleteReviewResponse,
  GetReviewsParams,
  Review,
  ReviewsResponse,
} from './review';

/**
 * Client-side Trustoo adapter that uses our API routes as proxy
 * to avoid CORS issues with direct API calls
 */
export class ClientTrustooAdapter {
  private baseUrl: string;

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl;
  }

  /**
   * Make request to our proxy API
   */
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const url = `${this.baseUrl}/api/trustoo${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Trustoo proxy API request failed:', error);
      throw error;
    }
  }

  /**
   * Get reviews with optional filtering and pagination
   */
  async getReviews(params?: GetReviewsParams): Promise<ReviewsResponse> {
    const searchParams = new URLSearchParams();

    if (params) {
      if (params.product_ids) {
        params.product_ids.forEach((id) => searchParams.append('product_ids[]', id));
      }
      if (params.is_store_review !== undefined) {
        searchParams.append('is_store_review', params.is_store_review.toString());
      }
      if (params.keyword) {
        searchParams.append('keyword', params.keyword);
      }
      if (params.ratings) {
        params.ratings.forEach((rating) => searchParams.append('ratings[]', rating));
      }
      if (params.sources) {
        params.sources.forEach((source) => searchParams.append('sources[]', source));
      }
      if (params.sort_by) {
        searchParams.append('sort_by', params.sort_by);
      }
      if (params.page_size) {
        searchParams.append('page_size', params.page_size.toString());
      }
      if (params.page) {
        searchParams.append('page', params.page.toString());
      }
    }

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/reviews?${queryString}` : '/reviews';

    return this.makeRequest<ReviewsResponse>(endpoint);
  }

  /**
   * Get reviews for specific products
   */
  async getProductReviews(
    productIds: string[],
    options?: Omit<GetReviewsParams, 'product_ids'>
  ): Promise<ReviewsResponse> {
    return this.getReviews({
      product_ids: productIds,
      ...options,
    });
  }

  /**
   * Create a new review
   */
  async createReview(reviewData: CreateReviewInterface): Promise<CreateReviewResponse> {
    return this.makeRequest<CreateReviewResponse>('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  /**
   * Create a product review (convenience method)
   */
  async createProductReview(data: CreateReviewInterface): Promise<CreateReviewResponse> {
    return this.createReview(data);
  }

  /**
   * Delete a review by ID
   */
  async deleteReview(reviewId: number): Promise<DeleteReviewResponse> {
    return this.makeRequest<DeleteReviewResponse>(`/reviews?id=${reviewId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Get all reviews for a product with automatic pagination
   */
  async getAllProductReviews(productId: string): Promise<Review[]> {
    const allReviews: Review[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const response = await this.getProductReviews([productId], {
        page,
        page_size: 100, // Max page size
      });

      allReviews.push(...response.data.list);

      hasMore = page < response.data.page.total_page;
      page++;
    }

    return allReviews;
  }

  /**
   * Get review statistics for a product
   */
  async getProductReviewStats(productId: string): Promise<{
    totalReviews: number;
    averageRating: number;
    ratingDistribution: Record<number, number>;
    verifiedReviews: number;
  }> {
    const reviews = await this.getAllProductReviews(productId);

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews : 0;

    const ratingDistribution: Record<number, number> = {};
    for (let i = 1; i <= 5; i++) {
      ratingDistribution[i] = reviews.filter((review) => review.rating === i).length;
    }

    const verifiedReviews = reviews.filter((review) => review.verified === 1).length;

    return {
      totalReviews,
      averageRating,
      ratingDistribution,
      verifiedReviews,
    };
  }

  /**
   * Batch create reviews
   */
  async batchCreateReviews(reviews: CreateReviewRequest[]): Promise<CreateReviewResponse[]> {
    const results: CreateReviewResponse[] = [];

    for (const reviewData of reviews) {
      try {
        const result = await this.createReview(reviewData);
        results.push(result);
      } catch (error) {
        console.error(`Failed to create review for ${reviewData.author}:`, error);
        results.push({
          code: -1,
          message: `Failed to create review: ${error}`,
          request_id: '',
        });
      }
    }

    return results;
  }

  /**
   * Batch delete reviews
   */
  async batchDeleteReviews(reviewIds: number[]): Promise<DeleteReviewResponse[]> {
    const results: DeleteReviewResponse[] = [];

    for (const id of reviewIds) {
      try {
        const result = await this.deleteReview(id);
        results.push(result);
      } catch (error) {
        console.error(`Failed to delete review ${id}:`, error);
        results.push({
          code: -1,
          message: `Failed to delete review ${id}: ${error}`,
          request_id: '',
        });
      }
    }

    return results;
  }
}

// Factory function for easier instantiation
export function createClientTrustooAdapter(): ClientTrustooAdapter {
  return new ClientTrustooAdapter();
}

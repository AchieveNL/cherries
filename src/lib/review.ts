import crypto from 'crypto';

// Types for API responses and requests
export interface TrustooConfig {
  publicToken: string;
  secretKey: string;
  baseUrl?: string;
}

export interface Review {
  id: string;
  rating: number;
  author: string;
  author_email: string;
  author_country: string;
  review_title: string;
  content: string;
  commented_at: string;
  verified: number;
  item_type: string;
  source: string;
  product_id: string;
  product_title: string;
  product_handle: string;
  media: {
    images: string[];
    video: string;
    video_thumbnail: string;
  };
  created_at: string;
  updated_at: string;
}

export interface CreateReviewRequest {
  order_id?: number;
  product_id?: number;
  rating: 1 | 2 | 3 | 4 | 5;
  author: string;
  author_email?: string;
  author_phone?: string;
  author_country?: string;
  title?: string;
  content?: string;
  commented_at: string;
  item_type?: string;
  source: Source;
  tag?: string;
  is_featured: 0 | 1;
  is_verified: 0 | 1;
  is_published: 0 | 1;
  is_top: 0 | 1;
  media?: {
    images?: string[];
    thumbnails?: string[];
    video?: string;
    video_thumbnail?: string;
  };
  reply?: {
    content?: string;
    reply_at?: string;
  };
}
export interface CreateReviewInterface {
  /**
   * Author
   */
  author: string;
  /**
   * Author region
   */
  author_country?: string;
  /**
   * Author email
   */
  author_email?: string;
  /**
   * Author phone
   */
  author_phone?: string;
  /**
   * Review time
   */
  commented_at: string;
  /**
   * Review content
   */
  content?: string;
  /**
   * Is featured: 1-Yes 0-No
   */
  is_featured: number;
  /**
   * Is published: 1-Yes 0-No
   */
  is_published: number;
  /**
   * Is pinned: 1-Yes 0-No
   */
  is_top: number;
  /**
   * Is verified: 1-Yes 0-No
   */
  is_verified: number;
  /**
   * Item type
   */
  item_type?: string;
  /**
   * Media
   */
  media?: Media;
  /**
   * Shopify order ID
   */
  order_id?: number;
  /**
   * Shopify product ID, if product ID is 0, create store review
   */
  product_id?: number;
  /**
   * Rating
   */
  rating: number;
  /**
   * Reply
   */
  reply?: Reply;
  /**
   * Source
   */
  source: Source;
  /**
   * Tag
   */
  tag?: string;
  /**
   * Review title
   */
  title?: string;
  [property: string]: any;
}

/**
 * Media
 */
export interface Media {
  /**
   * Image URLs list
   */
  images?: string[];
  /**
   * Thumbnail URLs list
   */
  thumbnails?: string[];
  /**
   * Video URL
   */
  video?: string;
  /**
   * Video thumbnail URL
   */
  video_thumbnail?: string;
  [property: string]: any;
}

/**
 * Reply
 */
export interface Reply {
  /**
   * Reply content
   */
  content?: string;
  /**
   * Reply time
   */
  reply_at?: string;
  [property: string]: any;
}

/**
 * Source
 */
export enum Source {
  AliExpress = 'AliExpress',
  Amazon = 'Amazon',
  Auto = 'Auto',
  CSVUploaded = 'CSV uploaded',
  EmailRequest = 'Email request',
  QRCode = 'QR Code',
  Shop = 'Shop',
  Shopee = 'Shopee',
  StoreFront = 'Store front',
  StoreLink = 'Store link',
}

export interface CreateReviewResponse {
  code: number;
  message: string;
  request_id: string;
  data?: any;
}

export interface ReviewsResponse {
  code: number;
  message: string;
  requestId: string;
  data: {
    page: {
      page: number;
      page_size: number;
      total_page: number;
      count: number;
    };
    list: Review[];
  };
}

export interface DeleteReviewRequest {
  id: number;
}

export interface DeleteReviewResponse {
  code: number;
  message: string;
  request_id: string;
}

export interface Webhook {
  id: string;
  topic: string;
  url: string;
  created_at: string;
  updated_at: string;
}

export interface WebhooksResponse {
  code: number;
  message: string;
  data: Webhook[];
  request_id: string;
}

export interface CreateWebhookRequest {
  topic: 'review/created' | 'review/updated' | 'review/deleted';
  url: string;
}

export interface UpdateWebhookRequest {
  id: string;
  topic: 'review/created' | 'review/updated' | 'review/deleted';
  url: string;
}

export interface WebhookResponse {
  code: number;
  message: string;
  request_id: string;
  data: Webhook;
}

export interface GetReviewsParams {
  product_ids?: string[];
  is_store_review?: 0 | 1;
  keyword?: string;
  ratings?: string[];
  sources?: string[];
  sort_by?: 'created-ascending' | 'created-descending';
  page_size?: number;
  page?: number;
}

export class TrustooReviewsAPI {
  private config: TrustooConfig;
  private baseUrl: string;

  constructor(config: TrustooConfig) {
    this.config = config;
    this.baseUrl = config.baseUrl || 'https://rapi.trustoo.io';
  }

  /**
   * Generate authentication headers for API requests
   */
  private generateHeaders(): Record<string, string> {
    const timestamp = Math.floor(Date.now() / 1000).toString();

    // Generate signature using HMAC-SHA256
    const signatureData = `${this.config.publicToken}${timestamp}`;
    const signature = crypto.createHmac('sha256', this.config.secretKey).update(signatureData).digest('hex');

    return {
      'Content-Type': 'application/json',
      'Public-Token': this.config.publicToken,
      Sign: signature,
      Timestamp: timestamp,
    };
  }

  /**
   * Make authenticated API request
   */
  private async makeRequest<T>(
    endpoint: string,
    method: 'GET' | 'POST' = 'GET',
    body?: any,
    params?: Record<string, any>
  ): Promise<T> {
    const headers = this.generateHeaders();
    const url = new URL(`${this.baseUrl}${endpoint}`);

    // Add query parameters for GET requests
    if (params && method === 'GET') {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            // Handle array parameters
            value.forEach((item, index) => {
              url.searchParams.append(`${key}[${index}]`, item.toString());
            });
          } else {
            url.searchParams.append(key, value.toString());
          }
        }
      });
    }

    const requestConfig: RequestInit = {
      method,
      headers,
    };

    if (body && method === 'POST') {
      requestConfig.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url.toString(), requestConfig);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Check if API returned an error
      if (data.code !== 0 && data.code !== 2000) {
        throw new Error(`API error: ${data.message || 'Unknown error'}`);
      }

      return data;
    } catch (error) {
      console.error('Trustoo API request failed:', error);
      throw error;
    }
  }

  /**
   * Create a new review
   */
  async createReview(reviewData: CreateReviewRequest): Promise<CreateReviewResponse> {
    return this.makeRequest<CreateReviewResponse>('/api/v1/openapi/create_review', 'POST', reviewData);
  }

  /**
   * Create a product review (convenience method)
   */
  async createProductReview(data: {
    productId: number;
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
    media?: CreateReviewRequest['media'];
  }): Promise<CreateReviewResponse> {
    const reviewData: CreateReviewRequest = {
      product_id: data.productId,
      rating: data.rating,
      author: data.author,
      author_email: data.authorEmail,
      author_country: data.authorCountry,
      title: data.title,
      content: data.content,
      commented_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      source: data.source || Source.Shop,
      is_verified: data.isVerified ? 1 : 0,
      is_featured: data.isFeatured ? 1 : 0,
      is_published: data.isPublished !== false ? 1 : 0, // Default to published
      is_top: 0,
      media: data.media,
    };

    return this.createReview(reviewData);
  }

  /**
   * Create a store review (convenience method)
   */
  async createStoreReview(data: {
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
  }): Promise<CreateReviewResponse> {
    const reviewData: CreateReviewRequest = {
      product_id: 0, // 0 indicates store review
      rating: data.rating,
      author: data.author,
      author_email: data.authorEmail,
      author_country: data.authorCountry,
      title: data.title,
      content: data.content,
      commented_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      source: data.source || Source.Shop,
      is_verified: data.isVerified ? 1 : 0,
      is_featured: data.isFeatured ? 1 : 0,
      is_published: data.isPublished !== false ? 1 : 0, // Default to published
      is_top: 0,
    };

    return this.createReview(reviewData);
  }

  /**
   * Create review with reply (convenience method)
   */
  async createReviewWithReply(data: {
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
  }): Promise<CreateReviewResponse> {
    const reviewData: CreateReviewRequest = {
      product_id: data.productId || 0,
      rating: data.rating,
      author: data.author,
      author_email: data.authorEmail,
      author_country: data.authorCountry,
      title: data.title,
      content: data.content,
      commented_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      source: data.source || Source.Shop,
      is_verified: data.isVerified ? 1 : 0,
      is_featured: data.isFeatured ? 1 : 0,
      is_published: data.isPublished !== false ? 1 : 0,
      is_top: 0,
      reply: {
        content: data.replyContent,
        reply_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      },
    };

    return this.createReview(reviewData);
  }

  /**
   * Get reviews with optional filtering and pagination
   */
  async getReviews(params?: GetReviewsParams): Promise<ReviewsResponse> {
    return this.makeRequest<ReviewsResponse>('/api/v1/openapi/get_reviews', 'GET', undefined, params);
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
   * Get reviews with specific rating
   */
  async getReviewsByRating(rating: number, options?: Omit<GetReviewsParams, 'ratings'>): Promise<ReviewsResponse> {
    return this.getReviews({
      ratings: [rating.toString()],
      ...options,
    });
  }

  /**
   * Search reviews by keyword
   */
  async searchReviews(keyword: string, options?: Omit<GetReviewsParams, 'keyword'>): Promise<ReviewsResponse> {
    return this.getReviews({
      keyword,
      ...options,
    });
  }

  /**
   * Get paginated reviews
   */
  async getReviewsPage(
    page: number,
    pageSize: number = 20,
    options?: Omit<GetReviewsParams, 'page' | 'page_size'>
  ): Promise<ReviewsResponse> {
    return this.getReviews({
      page,
      page_size: pageSize,
      ...options,
    });
  }

  /**
   * Delete a review by ID
   */
  async deleteReview(reviewId: number): Promise<DeleteReviewResponse> {
    return this.makeRequest<DeleteReviewResponse>('/api/v1/openapi/delete_review', 'POST', { id: reviewId });
  }

  /**
   * Get all webhooks for the shop
   */
  async getWebhooks(): Promise<WebhooksResponse> {
    return this.makeRequest<WebhooksResponse>('/api/v1/openapi/get_shop_webhooks');
  }

  /**
   * Create a new webhook
   */
  async createWebhook(webhook: CreateWebhookRequest): Promise<WebhookResponse> {
    return this.makeRequest<WebhookResponse>('/api/v1/openapi/create_shop_webhook', 'POST', webhook);
  }

  /**
   * Update an existing webhook
   */
  async updateWebhook(webhook: UpdateWebhookRequest): Promise<WebhookResponse> {
    return this.makeRequest<WebhookResponse>('/api/v1/open_api/update_shop_webhook', 'POST', webhook);
  }

  /**
   * Delete a webhook
   */
  async deleteWebhook(webhookId: string): Promise<DeleteReviewResponse> {
    return this.makeRequest<DeleteReviewResponse>('/api/v1/openapi/delete_shop_webhook', 'POST', { id: webhookId });
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
}

// Factory function for easier instantiation
export function createTrustooClient(config: TrustooConfig): TrustooReviewsAPI {
  return new TrustooReviewsAPI(config);
}

// Utility functions for working with reviews
export class ReviewUtils {
  /**
   * Calculate average rating from reviews
   */
  static calculateAverageRating(reviews: Review[]): number {
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
  }

  /**
   * Group reviews by rating
   */
  static groupByRating(reviews: Review[]): Record<number, Review[]> {
    return reviews.reduce(
      (groups, review) => {
        const rating = review.rating;
        if (!groups[rating]) {
          groups[rating] = [];
        }
        groups[rating].push(review);
        return groups;
      },
      {} as Record<number, Review[]>
    );
  }

  /**
   * Filter reviews by date range
   */
  static filterByDateRange(reviews: Review[], startDate: Date, endDate: Date): Review[] {
    return reviews.filter((review) => {
      const reviewDate = new Date(review.created_at);
      return reviewDate >= startDate && reviewDate <= endDate;
    });
  }

  /**
   * Filter verified reviews only
   */
  static filterVerified(reviews: Review[]): Review[] {
    return reviews.filter((review) => review.verified === 1);
  }

  /**
   * Sort reviews by different criteria
   */
  static sortReviews(reviews: Review[], sortBy: 'newest' | 'oldest' | 'highest_rating' | 'lowest_rating'): Review[] {
    const sorted = [...reviews];

    switch (sortBy) {
      case 'newest':
        return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      case 'highest_rating':
        return sorted.sort((a, b) => b.rating - a.rating);
      case 'lowest_rating':
        return sorted.sort((a, b) => a.rating - b.rating);
      default:
        return sorted;
    }
  }

  /**
   * Extract review keywords/tags
   */
  static extractKeywords(reviews: Review[]): string[] {
    const text = reviews.map((r) => `${r.content} ${r.review_title}`).join(' ');
    const words = text.toLowerCase().match(/\b\w{3,}\b/g) || [];

    // Count word frequency
    const wordCount = words.reduce(
      (count, word) => {
        count[word] = (count[word] || 0) + 1;
        return count;
      },
      {} as Record<string, number>
    );

    // Return most common words
    return Object.entries(wordCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([word]) => word);
  }

  /**
   * Validate review data before creating
   */
  static validateReviewData(data: Partial<CreateReviewRequest>): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!data.rating || data.rating < 1 || data.rating > 5) {
      errors.push('Rating must be between 1 and 5');
    }

    if (!data.author || data.author.trim().length === 0) {
      errors.push('Author name is required');
    }

    if (data.author && data.author.length > 120) {
      errors.push('Author name must be 120 characters or less');
    }

    if (!data.commented_at) {
      errors.push('Review date is required');
    }

    if (!data.source) {
      errors.push('Review source is required');
    }

    if (data.title && data.title.length > 300) {
      errors.push('Review title must be 300 characters or less');
    }

    if (data.content && data.content.length > 10000) {
      errors.push('Review content must be 10000 characters or less');
    }

    if (data.author_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.author_email)) {
      errors.push('Invalid email format');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Generate review data template
   */
  static createReviewTemplate(overrides?: Partial<CreateReviewRequest>): CreateReviewInterface {
    return {
      rating: 5,
      author: '',
      commented_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      source: Source.Shop,
      is_verified: 0,
      is_featured: 0,
      is_published: 1,
      is_top: 0,
      ...overrides,
    };
  }
}

// Example usage and configuration
export const TRUSTOO_CONFIG_EXAMPLE: TrustooConfig = {
  publicToken: 'your-public-token-here',
  secretKey: 'your-secret-key-here',
  baseUrl: 'https://rapi.trustoo.io', // Updated to match the API spec
};

/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  Filter,
  MessageCircle,
  SortAsc,
  Star,
  ThumbsUp,
  User,
} from 'lucide-react';
import { useState } from 'react';

import type { Product } from '@shopify/hydrogen-react/storefront-api-types';
import type { PartialDeep } from 'type-fest';

interface Review {
  id: string;
  customerName: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  verified: boolean;
  helpful: number;
}

interface ProductReviewsProps {
  product: PartialDeep<Product, { recurseIntoArrays: true }>;
}

// Type for partial metafield from Shopify
type PartialMetafield = PartialDeep<Product, { recurseIntoArrays: true }>['metafields'] extends (infer U)[] | undefined
  ? U
  : never;

// Helper function to safely parse JSON from metafields
function parseReviewsFromMetafields(metafields: PartialMetafield[] | undefined): Review[] {
  if (!metafields || !Array.isArray(metafields)) {
    return [];
  }

  // Type guard to check if a metafield has the required properties for reviews
  const isValidReviewsMetafield = (
    field: PartialMetafield
  ): field is NonNullable<PartialMetafield> & {
    namespace: string;
    key: string;
    value: string;
  } => {
    return (
      field !== null &&
      field !== undefined &&
      typeof field === 'object' &&
      'namespace' in field &&
      'key' in field &&
      'value' in field &&
      field.namespace === 'custom' &&
      field.key === 'reviews' &&
      typeof field.value === 'string'
    );
  };

  const reviewsMetafield = metafields.find(isValidReviewsMetafield);

  if (!reviewsMetafield?.value) {
    return [];
  }

  try {
    const parsed = JSON.parse(reviewsMetafield.value);

    // Validate that parsed data is an array of Review objects
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (item): item is Review =>
          typeof item === 'object' &&
          item !== null &&
          typeof item.id === 'string' &&
          typeof item.customerName === 'string' &&
          typeof item.rating === 'number' &&
          typeof item.title === 'string' &&
          typeof item.content === 'string' &&
          typeof item.date === 'string' &&
          typeof item.verified === 'boolean' &&
          typeof item.helpful === 'number'
      );
    }

    return [];
  } catch (error) {
    console.warn('Failed to parse reviews metafield:', error);
    return [];
  }
}

// Helper function to find a specific metafield
function findMetafield(metafields: PartialMetafield[] | undefined, namespace: string, key: string): string | null {
  if (!metafields || !Array.isArray(metafields)) {
    return null;
  }

  const metafield = metafields.find(
    (
      field
    ): field is NonNullable<PartialMetafield> & {
      namespace: string;
      key: string;
      value: string;
    } =>
      field !== null &&
      field !== undefined &&
      typeof field === 'object' &&
      'namespace' in field &&
      'key' in field &&
      'value' in field &&
      field.namespace === namespace &&
      field.key === key &&
      typeof field.value === 'string'
  );

  return metafield?.value || null;
}

export default function ProductReviews({ product }: ProductReviewsProps) {
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest' | 'helpful'>('newest');
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Extract reviews from Shopify metafields
  const allReviews = parseReviewsFromMetafields(product?.metafields);

  // Get rating and review count from metafields
  const ratingValue = findMetafield(product?.metafields, 'custom', 'rating');
  const reviewCountValue = findMetafield(product?.metafields, 'custom', 'review_count');

  const metafieldRating = ratingValue ? parseFloat(ratingValue) : null;
  const metafieldReviewCount = reviewCountValue ? parseInt(reviewCountValue, 10) : null;

  // Filter and sort reviews
  const filteredReviews = selectedRating ? allReviews.filter((review) => review.rating === selectedRating) : allReviews;

  const sortedReviews = [...filteredReviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case 'oldest':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'highest':
        return b.rating - a.rating;
      case 'lowest':
        return a.rating - b.rating;
      case 'helpful':
        return b.helpful - a.helpful;
      default:
        return 0;
    }
  });

  const displayedReviews = showAllReviews ? sortedReviews : sortedReviews.slice(0, 5);

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-3 h-3',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
    };

    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${sizeClasses[size]} transition-colors ${
          i < Math.floor(rating)
            ? 'fill-primary text-primary'
            : i < rating
              ? 'fill-primary/50 text-primary/50'
              : 'text-text/30'
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 30) return `${diffInDays} days ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  // If no reviews data available from Shopify, show empty state
  if (allReviews.length === 0 && !metafieldRating && !metafieldReviewCount) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="w-8 h-8 text-text/40" />
        </div>
        <h3 className="text-lg font-semibold text-text mb-2">No Reviews Yet</h3>
        <p className="text-text/60 mb-6">Be the first to share your thoughts about this product.</p>
        <button className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors">
          Write a Review
        </button>
      </div>
    );
  }

  // Use metafield data if available, otherwise calculate from review data
  const averageRating =
    metafieldRating ||
    (allReviews.length > 0 ? allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length : 0);
  const totalReviews = metafieldReviewCount || allReviews.length;

  // Only show rating distribution if we have actual review data
  const showDistribution = allReviews.length > 0;
  const ratingDistribution = showDistribution
    ? [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: allReviews.filter((review) => review.rating === star).length,
        percentage: (allReviews.filter((review) => review.rating === star).length / allReviews.length) * 100,
      }))
    : [];

  return (
    <div className="space-y-8">
      {/* Reviews Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <MessageCircle className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bungee font-bold text-text">Customer Reviews</h2>
        </div>
        <button className="bg-primary text-white px-4 py-2 rounded-xl font-medium hover:bg-primary/90 transition-colors text-sm">
          Write Review
        </button>
      </div>

      {/* Review Summary */}
      {averageRating > 0 && (
        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 border border-primary/10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Overall Rating */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start space-x-4 mb-4">
                <div className="text-4xl font-bold text-text">{averageRating.toFixed(1)}</div>
                <div>
                  <div className="flex items-center space-x-1 mb-1">{renderStars(Math.round(averageRating), 'lg')}</div>
                  <p className="text-sm text-text/60">
                    Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>

              {/* Rating Breakdown */}
              <div className="flex items-center justify-center lg:justify-start space-x-6 text-sm">
                <div className="text-center">
                  <div className="font-bold text-text">
                    {Math.round(ratingDistribution.find((r) => r.star === 5)?.percentage || 0)}%
                  </div>
                  <div className="text-text/60">5 Star</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-text">
                    {Math.round(ratingDistribution.find((r) => r.star === 4)?.percentage || 0)}%
                  </div>
                  <div className="text-text/60">4 Star</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-text">
                    {Math.round(
                      (ratingDistribution.find((r) => r.star >= 4)?.percentage || 0) +
                        (ratingDistribution.find((r) => r.star === 5)?.percentage || 0)
                    )}
                    %
                  </div>
                  <div className="text-text/60">Positive</div>
                </div>
              </div>
            </div>

            {/* Rating Distribution */}
            {showDistribution && (
              <div className="space-y-3">
                {ratingDistribution.map(({ star, count, percentage }) => (
                  <button
                    key={star}
                    onClick={() => setSelectedRating(selectedRating === star ? null : star)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all hover:bg-white/50 ${
                      selectedRating === star ? 'bg-white/70 ring-2 ring-primary/20' : 'bg-white/30'
                    }`}
                  >
                    <span className="text-sm text-text/70 w-12 flex items-center space-x-1">
                      <span>{star}</span>
                      <Star className="w-3 h-3 fill-primary text-primary" />
                    </span>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-text/70 w-8 text-right">{count}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Filters and Sorting */}
      {allReviews.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-text/60" />
              <span className="text-sm font-medium text-text">Filter:</span>
            </div>
            {selectedRating && (
              <div className="flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                <span>{selectedRating} Star</span>
                <button onClick={() => setSelectedRating(null)} className="hover:bg-primary/20 rounded-full p-0.5">
                  ×
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <SortAsc className="w-4 h-4 text-text/60" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-text focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
              <option value="helpful">Most Helpful</option>
            </select>
          </div>
        </div>
      )}

      {/* Individual Reviews */}
      {displayedReviews.length > 0 && (
        <div className="space-y-6">
          {displayedReviews.map((review, _index) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-200"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-primary" />
                  </div>

                  {/* Customer Info */}
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-semibold text-text">{review.customerName}</span>
                      {review.verified && (
                        <div className="flex items-center space-x-1 bg-green-50 text-green-700 px-2 py-1 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          <span className="text-xs font-medium">Verified</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">{renderStars(review.rating)}</div>
                      <div className="flex items-center space-x-1 text-text/60 text-sm">
                        <Calendar className="w-3 h-3" />
                        <span>{getRelativeTime(review.date)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <div className="space-y-3">
                <h4 className="font-semibold text-text text-lg">{review.title}</h4>
                <p className="text-text/80 leading-relaxed">{review.content}</p>
              </div>

              {/* Review Actions */}
              <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
                <button className="flex items-center space-x-2 text-text/60 hover:text-primary transition-colors group">
                  <ThumbsUp className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-medium">Helpful ({review.helpful})</span>
                </button>

                <span className="text-text/40 text-sm">{formatDate(review.date)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {allReviews.length > 5 && !showAllReviews && (
        <div className="text-center pt-6">
          <button
            onClick={() => setShowAllReviews(true)}
            className="inline-flex items-center space-x-2 bg-white border-2 border-primary text-primary px-6 py-3 rounded-xl font-medium hover:bg-primary hover:text-white transition-all duration-200 group"
          >
            <span>Show All {allReviews.length} Reviews</span>
            <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      )}

      {/* Review Statistics */}
      {allReviews.length > 0 && (
        <div className="bg-gray-50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-text mb-4">Review Insights</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-text">{allReviews.length}</div>
              <div className="text-sm text-text/60">Total Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-text">{allReviews.filter((r) => r.verified).length}</div>
              <div className="text-sm text-text/60">Verified Purchases</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-text">
                {Math.round((allReviews.filter((r) => r.rating >= 4).length / allReviews.length) * 100)}%
              </div>
              <div className="text-sm text-text/60">Positive Reviews</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-text">
                {Math.round(allReviews.reduce((sum, r) => sum + r.helpful, 0) / allReviews.length)}
              </div>
              <div className="text-sm text-text/60">Avg. Helpful Votes</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

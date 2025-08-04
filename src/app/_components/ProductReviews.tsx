/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  AlertCircle,
  Calendar,
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Loader,
  MessageCircle,
  Plus,
  RefreshCw,
  SortAsc,
  Star,
  ThumbsUp,
  Trash2,
  Upload,
  User,
  X,
} from 'lucide-react';
import React, { useCallback, useMemo, useRef, useState } from 'react';

import {
  useFilteredReviews,
  useProductReviews,
  useReviewForm,
  useReviewOperations,
  useReviewStats,
} from '@/hooks/useReviews';
import { CreateReviewRequest, Source } from '@/lib/review';
import { ReviewStats } from './layout/context/TrustooProvider';
import { Button } from './ui';

import type { Product } from '@shopify/hydrogen-react/storefront-api-types';
import type { PartialDeep } from 'type-fest';

interface ProductReviewsProps {
  product: PartialDeep<Product, { recurseIntoArrays: true }>;
}

// Image Upload Component
function ImageUpload({
  images,
  onImagesChange,
  maxImages = 10,
}: {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}) {
  const [uploading, setUploading] = useState<boolean>(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Upload image to your service
  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || images.length >= maxImages) return;

    setUploading(true);
    const newImages: string[] = [];

    try {
      for (let i = 0; i < files.length && images.length + newImages.length < maxImages; i++) {
        const file = files[i];

        // Validate file type
        if (!file.type.startsWith('image/')) {
          alert(`${file.name} is not an image file`);
          continue;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
          alert(`${file.name} is too large. Maximum size is 5MB`);
          continue;
        }

        const imageUrl = await uploadImage(file);
        newImages.push(imageUrl);
      }

      onImagesChange([...images, ...newImages]);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed  p-6 text-center transition-colors ${
          dragOver ? 'border-primary bg-primary' : 'border-gray-300 hover:border-gray-400'
        } ${images.length >= maxImages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => images.length < maxImages && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
          disabled={images.length >= maxImages}
        />

        {uploading ? (
          <div className="space-y-2">
            <Loader className="w-8 h-8 mx-auto animate-spin text-blue-500" />
            <p className="text-sm text-gray-600">Uploading images...</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Camera className="w-8 h-8 text-gray-400" />
              <Upload className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                {images.length >= maxImages
                  ? `Maximum ${maxImages} images reached`
                  : 'Drop images here or click to upload'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG, GIF up to 5MB each ({images.length}/{maxImages})
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <div key={index} className="relative group aspect-square">
              <img src={image} alt={`Upload ${index + 1}`} className="w-full h-full object-cover  border" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage(index);
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white  w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Review Filters Component
function ReviewFilters({
  filters,
  onFiltersChange,
  stats,
}: {
  filters: any;
  onFiltersChange: (filters: any) => void;
  stats?: any;
}) {
  const updateFilter = (key: string, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      page: 1,
      page_size: 20,
      sort_by: 'created-descending',
    });
  };

  const hasActiveFilters = () => {
    return Object.keys(filters).some(
      (key) =>
        key !== 'page' && key !== 'page_size' && key !== 'sort_by' && filters[key] !== undefined && filters[key] !== ''
    );
  };

  return (
    <div className="bg-white  border p-4 space-y-4">
      <div className="flex items-center space-x-2">
        <Filter className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-900">Filters</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Rating Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Rating</label>
          <select
            value={filters.rating || ''}
            onChange={(e) => updateFilter('rating', e.target.value ? parseInt(e.target.value) : undefined)}
            className="w-full text-sm border border-solid border-gray-200  px-2 py-1.5"
          >
            <option value="">All ratings</option>
            {[5, 4, 3, 2, 1].map((rating) => (
              <option key={rating} value={rating}>
                {rating} star{rating !== 1 ? 's' : ''}
                {stats && ` (${stats.ratingDistribution[rating] || 0})`}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Sort by</label>
          <select
            value={filters.sort_by || 'created-descending'}
            onChange={(e) => updateFilter('sort_by', e.target.value)}
            className="w-full text-sm border border-solid border-gray-200  px-2 py-1.5"
          >
            <option value="created-descending">Newest first</option>
            <option value="created-ascending">Oldest first</option>
          </select>
        </div>

        {/* Page Size */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Per page</label>
          <select
            value={filters.page_size || '20'}
            onChange={(e) => updateFilter('page_size', parseInt(e.target.value))}
            className="w-full text-sm border border-solid border-gray-200  px-2 py-1.5"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>

      {/* Search */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Search reviews</label>
        <input
          type="text"
          placeholder="Search by content, title, or author..."
          value={filters.keyword || ''}
          onChange={(e) => updateFilter('keyword', e.target.value || undefined)}
          className="w-full text-sm border border-gray-200  px-3 py-1.5"
        />
      </div>

      {/* Active Filters */}
      {hasActiveFilters() && (
        <div className="flex flex-wrap gap-2 pt-2 border-t">
          <span className="text-xs text-gray-600">Active filters:</span>
          {filters.rating && (
            <span className="inline-flex items-center px-2 py-1 bg-primary text-white text-xs ">
              {filters.rating} star
              <button onClick={() => updateFilter('rating', undefined)} className="ml-1">
                ×
              </button>
            </span>
          )}

          {filters.keyword && (
            <span className="inline-flex items-center px-2 py-1 bg-primary text-white text-xs ">
              &quot;{filters.keyword}&quot;
              <button onClick={() => updateFilter('keyword', undefined)} className="ml-1">
                ×
              </button>
            </span>
          )}
          <button onClick={clearFilters} className="text-xs text-gray-500 hover:text-gray-700">
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}

// Create Review Modal Component
function CreateReviewModal({
  isOpen,
  onClose,
  productId,
  onReviewCreated,
  productTitle,
}: {
  isOpen: boolean;
  onClose: () => void;
  onReviewCreated: () => void;
  productId: string;
  productTitle?: string;
}) {
  const { createProductReview } = useReviewOperations(productId);
  const { validateReview, createReviewTemplate, errors, clearErrors, isSubmitting, setIsSubmitting } = useReviewForm();

  const [formData, setFormData] = useState(() =>
    createReviewTemplate({
      product_id: productId ? parseInt(productId, 10) : undefined,
      is_published: 1,
      source: Source.Shop,
    })
  );

  const [images, setImages] = useState<string[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleInputChange = (field: keyof CreateReviewRequest, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    clearErrors();
    setSubmitError(null);
  };

  const handleSubmit = async () => {
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      await createProductReview({
        rating: formData.rating,
        author: formData.author,
        commented_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
        source: Source.Shop,
        is_verified: 0,
        is_featured: 0,
        is_published: 1,
        is_top: 0,
        author_country: formData.author_country || '',
        author_phone: '',
        tag: '',
        content: formData.content || '',
        media: {
          images: images,
          thumbnails: [],
          video: '',
          video_thumbnail: '',
        },
        reply: {
          content: '',
          reply_at: '',
        },
        author_email: formData.author_email || '',
        product_id: productId ? parseInt(productId, 10) : undefined,
        title: formData.title || '',
        item_type: formData.item_type || '',
      });

      // Reset form and close modal
      setFormData(
        createReviewTemplate({
          product_id: productId ? parseInt(productId, 10) : undefined,
          is_published: 1,
          source: Source.Shop,
        })
      );
      setImages([]);
      onReviewCreated();
      onClose();
    } catch (error) {
      console.error('Failed to create review:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white  w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Write a Review</h2>
            <button type="button" onClick={onClose} className="p-2 hover:bg-gray-100  transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Product Info */}
          {productTitle && (
            <div className="bg-gray-50  p-4">
              <p className="text-sm text-gray-600">Reviewing:</p>
              <p className="font-medium text-gray-900">{productTitle}</p>
            </div>
          )}

          {/* Errors */}
          {(errors.length > 0 || submitError) && (
            <div className="bg-red-50 border border-solid border-red-200  p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-red-800">Please fix the following:</h4>
                  <ul className="mt-1 text-sm text-red-700 space-y-1">
                    {submitError && <li>• {submitError}</li>}
                    {errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Form */}
          <div className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() => handleInputChange('rating', rating as 1 | 2 | 3 | 4 | 5)}
                    className={`p-1 transition-colors ${
                      formData.rating >= rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
                    }`}
                  >
                    <Star className="w-8 h-8 fill-current" />
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => handleInputChange('author', e.target.value)}
                className="w-full px-4 py-3 border border-solid border-gray-300  focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter your name"
                maxLength={120}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email (optional)</label>
              <input
                type="email"
                value={formData.author_email || ''}
                onChange={(e) => handleInputChange('author_email', e.target.value)}
                className="w-full px-4 py-3 border border-solid border-gray-300  focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Review Title (optional)</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-4 py-3 border border-solid border-gray-300  focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Summary of your experience"
                maxLength={300}
              />
            </div>

            {/* Review Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
              <textarea
                value={formData.content || ''}
                onChange={(e) => handleInputChange('content', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 border border-solid border-gray-300  focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                placeholder="Share your experience with this product..."
                maxLength={1000}
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {(formData.content || '').length}/1000 characters
              </div>
            </div>

            {/* Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Photos (optional) - Up to 10 images
              </label>
              <ImageUpload images={images} onImagesChange={setImages} maxImages={10} />
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country (optional)</label>
              <input
                type="text"
                value={formData.author_country || ''}
                onChange={(e) => handleInputChange('author_country', e.target.value)}
                className="w-full px-4 py-3 border border-solid border-gray-300  focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., United States"
              />
            </div>

            {/* Submit Button */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-solid border-gray-300 text-gray-700  hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !formData.rating || !formData.author.trim()}
                className="flex-1"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
const ReviewSummary = React.memo(function ReviewSummary({
  stats,
  ratingDistribution,
  onRatingFilter,
  activeRating,
}: {
  stats: ReviewStats;
  ratingDistribution: Array<{ star: number; count: number; percentage: number }>;
  onRatingFilter: (rating: number) => void;
  activeRating?: number;
}) {
  const renderStars = useCallback((rating: number, size: 'lg' = 'lg') => {
    const sizeClasses = { lg: 'w-5 h-5' };
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${sizeClasses[size]} transition-colors ${
          i < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : i < rating
              ? 'fill-yellow-400/50 text-yellow-400/50'
              : 'text-gray-300'
        }`}
      />
    ));
  }, []);

  return (
    <div className="bg-white  p-8 border border-solid border-gray-300">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="text-center lg:text-left">
          <div className="flex items-center justify-center lg:justify-start space-x-4 mb-4">
            <div className="text-4xl font-bold text-text">{stats.averageRating.toFixed(1)}</div>
            <div>
              <div className="flex items-center space-x-1 mb-1">{renderStars(Math.round(stats.averageRating))}</div>
              <p className="text-sm text-gray-600">
                Based on {stats.totalReviews} review{stats.totalReviews !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {ratingDistribution.map(({ star, count, percentage }) => (
            <button
              key={star}
              onClick={() => onRatingFilter(activeRating === star ? 0 : star)}
              className={`w-full flex items-center space-x-3 p-3  transition-all hover:bg-white/50 ${
                activeRating === star ? 'bg-white/70 ring-2 ring-primary' : 'bg-white/30'
              }`}
            >
              <span className="text-sm text-gray-700 w-12 flex items-center space-x-1">
                <span>{star}</span>
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              </span>
              <div className="flex-1  bg-gray-200  h-2">
                <div className="bg-primary  h-2 transition-all duration-500" style={{ width: `${percentage}%` }} />
              </div>
              <span className="text-sm text-gray-700 w-8 text-right">{count}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});
const ReviewsList = React.memo(function ReviewsList({
  productId,
  filters,
  onFiltersChange,
}: {
  productId: string;
  filters: any;
  onFiltersChange: (filters: any) => void;
}) {
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const { deleteReview } = useReviewOperations(productId);

  // Only this component will re-render when filters change
  const { reviews, totalCount, loading, error, refresh } = useFilteredReviews(productId, filters);

  const handleDeleteReview = useCallback(
    async (reviewId: string) => {
      try {
        setDeleteLoading(reviewId);
        await deleteReview(reviewId);
        refresh();
      } catch (error) {
        console.error('Failed to delete review:', error);
      } finally {
        setDeleteLoading(null);
      }
    },
    [deleteReview, refresh]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      onFiltersChange((prev: any) => ({ ...prev, page: newPage }));
    },
    [onFiltersChange]
  );

  const totalPages = useMemo(() => {
    return Math.ceil(totalCount / (filters.page_size || 20));
  }, [totalCount, filters.page_size]);

  const renderStars = useCallback((rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 transition-colors ${
          i < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : i < rating
              ? 'fill-yellow-400/50 text-yellow-400/50'
              : 'text-gray-300'
        }`}
      />
    ));
  }, []);

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }, []);

  const getRelativeTime = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 30) return `${diffInDays} days ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  }, []);

  if (loading && filters.page === 1) {
    return (
      <div className="text-center py-12">
        <Loader className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-gray-600 font-medium">Loading reviews...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100  flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-semibold text-primary mb-2">Failed to Load Reviews</h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={refresh}
          className="bg-primary text-white px-6 py-3  font-medium hover:bg-primary transition-colors inline-flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100  flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-primary mb-2">No Reviews Found</h3>
        <p className="text-gray-600 mb-6">Try adjusting your filters or search terms.</p>
        <button
          onClick={() => onFiltersChange({ page: 1, page_size: 20, sort_by: 'created-descending' })}
          className="text-primary hover:underline"
        >
          Clear all filters
        </button>
      </div>
    );
  }

  return (
    <>
      {loading && filters.page > 1 && (
        <div className="text-center py-4">
          <Loader className="w-6 h-6 animate-spin mx-auto text-primary" />
        </div>
      )}

      {/* Individual Reviews */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white  border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-200"
          >
            {/* Review Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4 flex-1">
                <div className="w-12 h-12 bg-primary/10  flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-primary" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-semibold text-text">{review.author}</span>
                    {review.verified === 1 && (
                      <div className="flex items-center space-x-1 bg-green-50 text-green-700 px-2 py-1 ">
                        <CheckCircle2 className="w-3 h-3" />
                        <span className="text-xs font-medium">Verified</span>
                      </div>
                    )}
                    {review.author_country && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 ">{review.author_country}</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">{renderStars(review.rating)}</div>
                    <div className="flex items-center space-x-1 text-gray-600 text-sm">
                      <Calendar className="w-3 h-3" />
                      <span>{getRelativeTime(review.created_at)}</span>
                    </div>
                    {review.source && <span className="text-xs text-gray-400">via {review.source}</span>}
                  </div>
                </div>
              </div>

              {/* <button */}
              {/*   onClick={() => handleDeleteReview(review.id)} */}
              {/*   disabled={deleteLoading === review.id} */}
              {/*   className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50  transition-colors disabled:opacity-50" */}
              {/*   title="Delete review" */}
              {/* > */}
              {/*   {deleteLoading === review.id ? ( */}
              {/*     <Loader className="w-4 h-4 animate-spin" /> */}
              {/*   ) : ( */}
              {/*     <Trash2 className="w-4 h-4" /> */}
              {/*   )} */}
              {/* </button> */}
            </div>

            {/* Review Content */}
            <div className="space-y-3">
              {review.review_title && <h4 className="font-semibold text-primary text-lg">{review.review_title}</h4>}
              <p className="text-gray-700 leading-relaxed">{review.content}</p>
            </div>

            {/* Review Media */}
            {review.media && review.media.images && review.media.images.length > 0 && (
              <div className="mt-4">
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {review.media.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Review image ${index + 1}`}
                      className="w-20 h-20 object-cover  flex-shrink-0 border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => window.open(image, '_blank')}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Review Actions */}
            <div className="flex items-center justify-end pt-4 mt-4 border-t border-gray-100">
              <span className="text-gray-400 text-sm">{formatDate(review.created_at)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => handlePageChange(filters.page - 1)}
            disabled={filters.page <= 1}
            className="px-3 py-2 text-sm border border-gray-300  hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let page: number;
            if (totalPages <= 5) {
              page = i + 1;
            } else if (filters.page <= 3) {
              page = i + 1;
            } else if (filters.page >= totalPages - 2) {
              page = totalPages - 4 + i;
            } else {
              page = filters.page - 2 + i;
            }

            return (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 text-sm border  ${
                  filters.page === page ? 'bg-primary text-white border-primary' : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() => handlePageChange(filters.page + 1)}
            disabled={filters.page >= totalPages}
            className="px-3 py-2 text-sm border border-gray-300  hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center space-x-1"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Results summary */}
      {/* <div className="text-center text-sm text-gray-500"> */}
      {/*   Showing {(filters.page - 1) * filters.page_size + 1} to {Math.min(filters.page * filters.page_size, totalCount)}{' '} */}
      {/*   of {totalCount} reviews */}
      {/* </div> */}
    </>
  );
});

// Main ProductReviews Component

export default function ProductReviews({ product }: ProductReviewsProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [filters, setFilters] = useState(() => ({
    page: 1,
    page_size: 20,
    sort_by: 'created-descending',
    rating: undefined,
  }));

  const productId = useMemo(() => {
    return product?.id?.split('/').pop() || '';
  }, [product?.id]);

  // Use hooks for review data - these won't re-render when filters change
  const { stats, getRatingPercentage, getPositivePercentage } = useReviewStats(productId);

  const handleFiltersChange = useCallback((newFilters: any) => {
    setFilters(newFilters);
  }, []);

  const ratingDistribution = useMemo(() => {
    if (!stats) return [];
    return [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: stats.ratingDistribution[star] || 0,
      percentage: getRatingPercentage(star),
    }));
  }, [stats, getRatingPercentage]);

  // Memoize the modal close handler to prevent unnecessary re-renders
  const handleModalClose = useCallback(() => {
    setShowCreateModal(false);
  }, []);

  // Handle successful review creation
  const handleReviewCreated = useCallback(() => {
    setShowCreateModal(false);
    // Force refresh of the reviews list by updating filters slightly
    setFilters((prev) => ({ ...prev, _refreshTrigger: Date.now() }));
  }, []);

  if (!stats || stats.totalReviews === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100  flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-text mb-2">No Reviews Yet</h3>
        <p className="text-gray-600 mb-6">Be the first to share your thoughts about this product.</p>
        <Button className="mx-auto" onClick={() => setShowCreateModal(true)}>
          <span>Write a Review</span>
        </Button>

        <CreateReviewModal
          isOpen={showCreateModal}
          onClose={handleModalClose}
          onReviewCreated={handleReviewCreated}
          productId={productId}
          productTitle={product?.title}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Reviews Header - Static, won't re-render */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h2 className="text-2xl font-bold text-black">Customer Reviews</h2>
          <span className="text-sm text-gray-500">({stats.totalReviews} reviews)</span>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4" />
          <span>Write Review</span>
        </Button>
      </div>

      {/* Review Summary - Static, won't re-render */}
      {stats.averageRating > 0 && (
        <ReviewSummary
          stats={stats}
          ratingDistribution={ratingDistribution}
          onRatingFilter={(rating) => setFilters((prev: any) => ({ ...prev, rating, page: 1 }))}
          activeRating={filters.rating}
        />
      )}

      {/* Filters - Will re-render but that's expected */}
      <ReviewFilters filters={filters} onFiltersChange={handleFiltersChange} stats={stats} />

      {/* Reviews List - This will be the ONLY component that re-renders on filter changes */}
      <ReviewsList productId={productId} filters={filters} onFiltersChange={setFilters} />

      {/* Create Review Modal */}
      <CreateReviewModal
        isOpen={showCreateModal}
        onClose={handleModalClose}
        onReviewCreated={handleReviewCreated}
        productId={productId}
        productTitle={product?.title}
      />
    </div>
  );
}

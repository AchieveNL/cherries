/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { AddToCartButton, ProductPrice, ProductProvider, useCart, useProduct } from '@shopify/hydrogen-react';
import { AlertCircle, Award, CheckCircle, Heart, MessageCircle, Minus, Plus, Star, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';

import { trackAddToCart, trackProductView } from '@/lib/analytics';
import { ProductContentAnalyzer, ProductDescriptionFormatter } from '@/lib/productDescription';
import Breadcrumb from './Breadcrumb';
import {
  PremiumQualityIconProduct,
  RecycledMaterialIconProduct,
  SafeAndFlexableIconProduct,
  WorldWideShippingIconProduct,
} from './icons/about-us';
import { ArrowButton, CartIcon, CheckIcon, PlusIcon } from './icons/shared';
import { useWishlist } from './layout/context/wishList';
import ProductFAQ from './ProductFAQ';
import ProductGallery from './ProductGallery';
import ProductReviews from './ProductReviews';
import RecommendedProducts from './products/RecommendedProducts';
import ProductVariants from './ProductVariants';

import type {
  Metafield,
  Product,
  ProductVariant as ProductVariantType,
  Image as ShopifyImage,
} from '@shopify/hydrogen-react/storefront-api-types';
import type { PartialDeep } from 'type-fest';

interface ProductDescriptionProps {
  product: PartialDeep<Product, { recurseIntoArrays: true }>;
}

interface ProductPageClientProps {
  product: PartialDeep<Product, { recurseIntoArrays: true }>;
}

// Define types for better type safety
interface OptionWithValues {
  name: string;
  values: string[];
}

interface SelectedOptions {
  [key: string]: string;
}

type ProductMetafield = {
  id?: string;
  __typename?: string;
  createdAt?: string;
  description?: string | null;
  key?: string;
  namespace?: string;
  updatedAt?: string;
  type?: string;
  value?: string;
};

function hasValidMetafieldProps(
  field: any
): field is ProductMetafield & { namespace: string; key: string; value: string } {
  return (
    field && typeof field.namespace === 'string' && typeof field.key === 'string' && typeof field.value === 'string'
  );
}

// Helper function to safely parse metafield value
function safeParseMetafieldValue(metafield: ProductMetafield | null | undefined): string | null {
  if (!metafield || !metafield.value) return null;

  try {
    return typeof metafield.value === 'string' ? metafield.value : null;
  } catch (error) {
    console.warn('Failed to parse metafield:', error);
    return null;
  }
}

// Inner component that uses the useProduct hook
function ProductContent() {
  const { product, selectedVariant, selectedOptions, options, setSelectedOption, isOptionInStock } = useProduct();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { status, lines, totalQuantity, id: cartId } = useCart();

  // Track analytics when product loads
  useEffect(() => {
    if (product && selectedVariant) {
      trackProductView({
        id: product.id || '',
        title: product.title || '',
        price: selectedVariant.price?.amount || '0',
        vendor: product.vendor || '',
        productType: product.productType || '',
        variantId: selectedVariant.id || '',
        variantTitle: selectedVariant.title || '',
        sku: selectedVariant.sku || '',
        quantity: 1,
      });
    }
  }, [product, selectedVariant]);

  // Wishlist integration
  const { addItem, removeItem, isInWishlist } = useWishlist();
  const [wishlistLoading, setWishlistLoading] = useState(false);

  // Check if product is in wishlist
  const isWishlisted = product?.id ? isInWishlist(product.id) : false;

  // Handle wishlist toggle
  const handleWishlistToggle = async () => {
    if (!product?.id) return;

    setWishlistLoading(true);
    try {
      if (isWishlisted) {
        removeItem(product.id);
      } else {
        addItem(product);
      }
    } catch (error) {
      console.error('Failed to update wishlist:', error);
    } finally {
      setWishlistLoading(false);
    }
  };

  // Add this state to track previous line count
  const [previousLineCount, setPreviousLineCount] = useState(0);
  const justClicked = React.useRef(false);
  const [previousTotalQuantity, setPreviousTotalQuantity] = useState(0);

  // Monitor cart changes using total quantity
  React.useEffect(() => {
    console.log('=== Cart Quantity Debug ===');
    console.log('Status:', status);
    console.log('Current total quantity:', totalQuantity);
    console.log('Previous total quantity:', previousTotalQuantity);
    console.log('Is adding to cart:', isAddingToCart);
    console.log('============================');

    // Only initialize quantity when cart first loads AND we're not currently adding to cart
    if (totalQuantity && previousTotalQuantity === 0 && !isAddingToCart) {
      setPreviousTotalQuantity(totalQuantity);
      return;
    }

    // Detect successful addition by quantity increase
    if (status === 'idle' && totalQuantity && totalQuantity > previousTotalQuantity && isAddingToCart) {
      console.log('✅ Item quantity increased - addition successful');

      // Track add to cart event
      if (product && selectedVariant && cartId) {
        trackAddToCart({
          cartId,
          product: {
            id: product.id || '',
            title: product.title || '',
            price: selectedVariant.price?.amount || '0',
            quantity,
            variantId: selectedVariant.id || '',
            variantTitle: selectedVariant.title || '',
            vendor: product.vendor || '',
            productType: product.productType || '',
            sku: selectedVariant.sku || '',
          },
          totalValue: parseFloat(selectedVariant.price?.amount || '0') * quantity,
        });
      }

      setIsAddingToCart(false);
      setShowSuccessMessage(true);
      setPreviousTotalQuantity(totalQuantity);

      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    }

    // Reset loading state if stuck
    if (status === 'idle' && isAddingToCart && totalQuantity === previousTotalQuantity) {
      console.log('🔄 Resetting stuck loading state - no quantity change detected');
      setIsAddingToCart(false);
    }
  }, [status, totalQuantity, previousTotalQuantity, isAddingToCart, product, selectedVariant, cartId, quantity]);

  // Extract data from metafields with proper null checks
  const metafields = product?.metafields || [];

  const ratingMetafield = metafields.find(
    (field) => hasValidMetafieldProps(field) && field.namespace === 'custom' && field.key === 'rating'
  );

  const reviewCountMetafield = metafields.find(
    (field) => hasValidMetafieldProps(field) && field.namespace === 'custom' && field.key === 'review_count'
  );

  const featuresMetafield = metafields.find(
    (field) => hasValidMetafieldProps(field) && field.namespace === 'custom' && field.key === 'features'
  );

  // Safe parsing - only use Shopify data, no fallbacks
  const rating: number | null = (() => {
    const ratingValue = safeParseMetafieldValue(ratingMetafield);
    if (!ratingValue) return null;
    const parsedRating = parseFloat(ratingValue);
    return isNaN(parsedRating) ? null : parsedRating;
  })();

  const reviewCount: number | null = (() => {
    const reviewValue = safeParseMetafieldValue(reviewCountMetafield);
    if (!reviewValue) return null;
    const parsedCount = parseInt(reviewValue, 10);
    return isNaN(parsedCount) ? null : parsedCount;
  })();

  const features: string[] = (() => {
    const featuresValue = safeParseMetafieldValue(featuresMetafield);
    if (!featuresValue) return [];

    try {
      const parsed = JSON.parse(featuresValue);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.warn('Failed to parse features metafield:', error);
      return [];
    }
  })();

  const renderStars = (rating: number | null): JSX.Element[] | null => {
    if (!rating) return null;

    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 transition-colors ${
          i < Math.floor(rating)
            ? 'fill-primary text-primary'
            : i < rating
              ? 'fill-primary/50 text-primary/50'
              : 'text-text/30'
        }`}
      />
    ));
  };

  const handleQuantityChange = (change: number) => {
    setQuantity(Math.max(1, quantity + change));
  };

  // Handle case where product might not be loaded yet
  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin h-12 w-12 border-2 border-primary border-t-transparent mx-auto"></div>
          <p className="text-text/60 font-medium">Loading product...</p>
        </div>
      </div>
    );
  }

  // Transform options to match expected type
  const transformedOptions: OptionWithValues[] =
    options
      ?.map((option) => ({
        name: option?.name || '',
        values: option?.values?.map((value) => value || '').filter(Boolean) || [],
      }))
      .filter((option) => option.name) || [];

  // Transform selectedOptions to match expected type
  const transformedSelectedOptions: SelectedOptions = selectedOptions
    ? Object.fromEntries(Object.entries(selectedOptions).map(([key, value]) => [key, value || '']))
    : {};

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <Breadcrumb product={product} />

      <div className="container mx-auto px-4 py-8 max-w-8xl">
        {/* Main Product Section */}
        <div className="flex flex-col xl:flex-row gap-12 mb-16">
          {/* Product Images */}
          <div className="xl:sticky xl:top-8 xl:self-start xl:w-[556px]">
            <ProductGallery product={product} selectedVariant={selectedVariant} />
          </div>

          {/* Product Info */}
          <div className="space-y-8 flex-1">
            {/* Product Header */}
            <header className="space-y-6">
              <div className="flex space-y-4 justify-between items-start">
                <div className="flex-1">
                  <h1 className="text-3xl xl:text-4xl font-bold font-bungee text-text leading-tight tracking-tight">
                    {product.title}
                  </h1>

                  {/* Rating & Reviews */}
                  {rating && (
                    <div className="flex items-center space-x-4 mt-4">
                      <div className="flex items-center space-x-1">{renderStars(rating)}</div>
                      <span className="text-text/70 font-medium">{rating.toFixed(1)}</span>
                      {reviewCount && (
                        <span className="text-text/50 text-sm">
                          ({reviewCount} review{reviewCount !== 1 ? 's' : ''})
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Wishlist Button */}
                <button
                  onClick={handleWishlistToggle}
                  disabled={wishlistLoading}
                  className="p-3  hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart
                    className={`w-7 h-7 transition-colors ${
                      isWishlisted ? 'fill-primary text-primary' : 'text-primary hover:text-primary'
                    }`}
                  />
                </button>
              </div>

              {/* Price Section */}
              <div className="text-dark relative overflow-hidden">
                <div className="relative">
                  <div className="flex items-baseline space-x-4 mb-3">
                    <ProductPrice
                      data={product}
                      variantId={selectedVariant?.id}
                      className="text-3xl xl:text-4xl font-bold"
                    />
                    {selectedVariant?.compareAtPrice && (
                      <div className="space-y-1">
                        <span className="text-lg text-dark line-through">
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: selectedVariant.compareAtPrice.currencyCode || 'USD',
                          }).format(parseFloat(selectedVariant.compareAtPrice.amount || '0'))}
                        </span>
                        <div className="text-xs text-white bg-primary px-2 py-0.5 font-medium">
                          Save{' '}
                          {Math.round(
                            ((parseFloat(selectedVariant.compareAtPrice.amount || '0') -
                              parseFloat(selectedVariant.price?.amount || '0')) /
                              parseFloat(selectedVariant.compareAtPrice.amount || '0')) *
                              100
                          )}
                          %
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <hr className="border-gray-200 border-2" />
              <ProductVariants
                options={transformedOptions}
                selectedOptions={transformedSelectedOptions}
                selectedVariant={selectedVariant as ProductVariantType | null | undefined}
                onOptionChange={setSelectedOption}
                isOptionInStock={isOptionInStock}
              />
              <div className="flex flex-col items-start justify-between">
                <label className="text-base font-semibold text-text">Quantity</label>
                <div className="flex items-center border-2 border-gray-200">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="p-3 text-text/70 hover:text-text transition-colors disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="px-3 py-3 border-gray-200 border-x-2 font-bold text-xl text-text min-w-[3.5rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-3 text-text/70 hover:text-text transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col items-start justify-between space-y-2 mb-6">
                {/* Add to Cart Button */}
                <AddToCartButton
                  variantId={selectedVariant?.id || ''}
                  quantity={quantity}
                  className="w-2/3 relative group/button bg-primary text-white py-4 px-8 transition-all duration-300 font-bold text-lg disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
                  disabled={!selectedVariant?.availableForSale || isAddingToCart}
                  onClick={() => {
                    console.log('🔵 Add to cart clicked - setting loading state');
                    setIsAddingToCart(true);
                    setShowSuccessMessage(false);
                  }}
                >
                  {selectedVariant?.availableForSale ? (
                    <span className="flex items-center uppercase justify-center space-x-4">
                      {isAddingToCart ? (
                        <>
                          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                          <span>Adding...</span>
                        </>
                      ) : (
                        <>
                          <span>Add {quantity} to Cart</span>

                          <div className="flex items-center">
                            <CartIcon className="" />
                            <PlusIcon className="" />
                          </div>
                        </>
                      )}
                    </span>
                  ) : (
                    'Out of Stock'
                  )}

                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/button:translate-x-full transition-transform duration-700 ease-out"></div>
                </AddToCartButton>

                {/* Success Message */}
                {showSuccessMessage && (
                  <div className="w-2/3 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md flex items-center space-x-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="font-medium">Added to cart!</p>
                      <p className="text-sm text-green-600">
                        {quantity} {quantity === 1 ? 'item' : 'items'} added successfully
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-gray-50 p-4 border border-solid">
                <div className="flex flex-col">
                  <div className="flex items-center border-b border-solid pb-2 border-[#D9D9D9] space-x-4">
                    <WorldWideShippingIconProduct className=" text-primary" />
                    <div className="flex flex-col">
                      <h3 className="text-base text-text font-bold capitalize">worldwide shipping</h3>
                      <p className="text-xs flex items-center gap-2 capitalize text-[#5D5D5D]">
                        <CheckIcon />
                        next day NL & BE
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center border-b border-solid py-2 border-[#D9D9D9] space-x-4">
                    <PremiumQualityIconProduct className="text-primary" />
                    <div className="flex flex-col">
                      <h3 className="text-base text-text font-bold capitalize">premium quality</h3>
                      <p className="text-xs flex items-center gap-2 capitalize text-[#5D5D5D]">
                        <CheckIcon />
                        fast shipping
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center border-b border-solid py-2 border-[#D9D9D9] space-x-4">
                    <SafeAndFlexableIconProduct className="text-primary" />
                    <div className="flex flex-col">
                      <h3 className="text-base text-text font-bold capitalize">secure & flexible payment</h3>

                      <p className="text-xs flex items-center gap-2 capitalize text-[#5D5D5D]">
                        <CheckIcon />
                        iDeal
                        <CheckIcon />
                        Klarna
                        <CheckIcon />
                        Apple Pay & more
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center py-2 space-x-4">
                    <RecycledMaterialIconProduct className=" text-primary" />
                    <div className="flex flex-col">
                      <h3 className="text-base text-text font-bold capitalize">made with care</h3>

                      <p className="text-xs flex items-center gap-2 capitalize text-[#5D5D5D]">
                        <CheckIcon />
                        recycled materials
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            <section className="">
              <div className="space-y-6">
                {/* Product Details Tabs */}
                <div className="mb-16">
                  {/* Tab Navigation */}
                  <div className="flex space-x-8 border-b border-gray-200">
                    {[
                      { id: 'description', label: 'Description', icon: MessageCircle },
                      { id: 'reviews', label: 'Reviews', icon: Star },
                      { id: 'faq', label: 'FAQ', icon: Users },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                          borderBottom: activeTab === tab.id ? '2px solid #830016' : '2px solid transparent',
                        }}
                        className={`pb-3 px-5 text-black text-sm font-medium transition-colors ${
                          activeTab === tab.id ? '' : 'text-gray-500 hover:text-black'
                        }`}
                      >
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <div className="p-4">
                    {activeTab === 'description' && <ProductDescription product={product} />}
                    {activeTab === 'reviews' && <ProductReviews product={product} />}
                    {activeTab === 'faq' && <ProductFAQ product={product} />}
                  </div>
                </div>
              </div>
            </section>

            {/* Key Features */}
            {features.length > 0 && (
              <section className="bg-white border border-gray-100 shadow-sm p-6">
                <h3 className="text-xl font-semibold text-text mb-4 flex items-center space-x-2">
                  <Award className="w-5 h-5 text-primary" />
                  <span>Key Benefits</span>
                </h3>
                <div className="grid gap-3">
                  {features.map((feature: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-4 bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors"
                    >
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-text font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Important Notice */}
            {(product.tags?.includes('requires-note') ||
              metafields.some((field) => field?.key === 'important_notice')) && (
              <section className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-6 shadow-sm">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-amber-800 mb-2">Important Note</h4>
                    <p className="text-amber-700 leading-relaxed">
                      {metafields.find((field) => field?.key === 'important_notice')?.value ||
                        'Please read product details carefully before purchase.'}
                    </p>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* Recommended Products with proper props */}
      <RecommendedProducts productId={product.id} limit={4} intent="RELATED" />
    </div>
  );
}

// Main component with ProductProvider
export default function ProductPageClient({ product }: ProductPageClientProps) {
  const firstAvailableVariant = product.variants?.nodes?.find((variant) => variant?.availableForSale);
  const initialVariantId = firstAvailableVariant?.id || product.variants?.nodes?.[0]?.id || null;

  return (
    <ProductProvider data={product} initialVariantId={initialVariantId}>
      <ProductContent />
    </ProductProvider>
  );
}

// Enhanced Product Description Component
export function ProductDescription({ product }: ProductDescriptionProps) {
  const metafields = product.metafields || [];
  const storyMetafield = metafields.find(
    (field): field is Metafield =>
      field !== null &&
      field !== undefined &&
      'namespace' in field &&
      'key' in field &&
      field.namespace === 'custom' &&
      field.key === 'product_story'
  );

  const storyContent = storyMetafield?.value;

  // Process the description using our library
  const processedContent = ProductDescriptionFormatter.processDescription(product.descriptionHtml);
  const contentAnalysis = ProductContentAnalyzer.analyzeContent(product.descriptionHtml);

  return (
    <div className="space-y-8">
      {/* Enhanced Main Description */}
      <div className="prose prose-lg max-w-none">
        <div className="enhanced-description" dangerouslySetInnerHTML={{ __html: processedContent.html }} />
      </div>

      {/* Extracted Features Section */}
      {processedContent.features.length > 0 && (
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-text mb-4 flex items-center space-x-2">
            <Star className="w-5 h-5 text-primary" />
            <span>Key Features</span>
          </h3>
          <div className="grid gap-3">
            {processedContent.features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 p-3 bg-white/60 rounded-lg border border-white/40 hover:bg-white/80 transition-colors"
              >
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-text font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Specifications Section */}
      {processedContent.specifications.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-text mb-4 flex items-center space-x-2">
            <span>Specifications</span>
          </h3>
          <div className="space-y-3">
            {processedContent.specifications.map((spec, index) => (
              <div
                key={index}
                className="flex justify-between items-start py-3 px-4 bg-white rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
              >
                <span className="font-semibold text-text flex-shrink-0 mr-4">{spec.key}</span>
                <span className="text-text/70 text-right">{spec.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Product Story Section */}
      {storyContent && (
        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-xl font-semibold text-text mb-4 flex items-center space-x-2">
            <span>Our Story</span>
          </h3>
          <div
            className="text-text/70 leading-relaxed prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: storyContent }}
          />
        </div>
      )}
      <style jsx>{`
        .enhanced-description {
          line-height: 1.75;
        }

        .enhanced-description ul {
          list-style: none;
          padding: 0;
        }

        .enhanced-description h3 {
          color: #1f2937;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }

        .enhanced-description p {
          line-height: 1.75;
          margin-bottom: 1.5rem;
        }

        .enhanced-description p:last-child {
          margin-bottom: 0;
        }

        .enhanced-description strong {
          color: #830016;
          font-weight: 600;
        }

        .enhanced-description em {
          color: #6b7280;
          font-style: italic;
        }

        .enhanced-description code {
          background-color: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
          font-family: 'Courier New', monospace;
        }

        .enhanced-description a {
          color: #830016;
          text-decoration: underline;
        }

        .enhanced-description a:hover {
          color: #a0001e;
        }

        .enhanced-description .callout {
          animation: fadeIn 0.3s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

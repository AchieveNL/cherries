/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { AddToCartButton, ProductPrice, ProductProvider, useProduct } from '@shopify/hydrogen-react';
import { AlertCircle, Award, CheckCircle, Heart, MessageCircle, Minus, Plus, Star, Users } from 'lucide-react';
import { useState } from 'react';

import Breadcrumb from './Breadcrumb';
import { ArrowButton } from './icons/shared';
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
  console.log('Product metafields:', product?.metafields);
  console.log('Selected variant metafields:', selectedVariant?.metafields);
  console.log('Product options with full data:', product?.options);
  console.log('Variant selected options:', selectedVariant?.selectedOptions);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

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
          <div className="animate-spin  h-12 w-12 border-2 border-primary border-t-transparent mx-auto"></div>
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
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 py-6 max-w-8xl">
          <Breadcrumb product={product} />
        </div>
      </div>

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
              <div className="flex  space-y-4 justify-between items-center">
                <div>
                  <h1 className="text-3xl xl:text-4xl font-bold font-bungee text-text leading-tight tracking-tight">
                    {product.title}
                  </h1>

                  {/* Rating & Reviews */}
                  {rating && (
                    <div className="flex items-center space-x-4">
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

                <button onClick={() => setIsWishlisted(!isWishlisted)} className="p-2  rounded-full">
                  <Heart className={`w-7 h-7 ${isWishlisted ? 'fill-primary' : 'text-primary'}`} />
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
                        <div className="text-xs bg-primary px-2 py-0.5  font-medium">
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
                  <p className="text-dark text-sm">Free shipping on orders over $50</p>
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
              <hr className="border-gray-200 border-2" />
              <div className="flex flex-col items-start justify-between">
                <label className="text-base font-semibold text-text">Quantity</label>
                <div className="flex items-center   border-2 border-gray-200">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="p-3 text-text/70 hover:text-text   transition-colors disabled:opacity-50"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="px-3 py-3 border-gray-200  border-x-2  font-bold text-xl text-text min-w-[3.5rem] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-3 text-text/70 hover:text-text  transition-colors"
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
                  className="w-2/3 bg-primary  text-white py-4 px-8   transition-all duration-300 font-bold text-lg disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none"
                  disabled={!selectedVariant?.availableForSale}
                >
                  {selectedVariant?.availableForSale ? (
                    <span className="flex items-center justify-center space-x-4">
                      <span>Add {quantity} to Cart</span>
                      <ArrowButton className="" />
                    </span>
                  ) : (
                    'Out of Stock'
                  )}
                </AddToCartButton>
                <span className="self-center text-sm w-2/3">Estimated delivery from June 24th</span>
              </div>
            </header>

            <section className="  ">
              <div className="space-y-6">
                {/* Product Details Tabs */}
                <div className="  mb-16">
                  {/* Tab Navigation */}
                  <div className="flex space-x-8 border-b border-gray-200">
                    {' '}
                    {/* Add this border-b */}
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
                        className={`pb-3 px-5
text-black text-sm font-medium transition-colors ${activeTab === tab.id ? '' : 'text-gray-500 hover:text-black'}`}
                      >
                        <span>{tab.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Tab Content */}
                  <div className="p-8">
                    {activeTab === 'description' && <ProductDescription product={product} />}
                    {activeTab === 'reviews' && <ProductReviews product={product} />}
                    {activeTab === 'faq' && <ProductFAQ product={product} />}
                  </div>
                </div>
              </div>
            </section>

            {/* Key Features */}
            {features.length > 0 && (
              <section className="bg-white  border border-gray-100 shadow-sm p-6">
                <h3 className="text-xl font-semibold text-text mb-4 flex items-center space-x-2">
                  <Award className="w-5 h-5 text-primary" />
                  <span>Key Benefits</span>
                </h3>
                <div className="grid gap-3">
                  {features.map((feature: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-4  bg-primary/5 border border-primary/20 hover:bg-primary/10 transition-colors"
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
              <section className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200  p-6 shadow-sm">
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
      <RecommendedProducts />
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
function ProductDescription({ product }: { product: PartialDeep<Product, { recurseIntoArrays: true }> }) {
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

  return (
    <div className="space-y-8">
      {/* Main Description */}
      <div className="prose prose-lg max-w-none">
        <div className="text-text/80 text-lg leading-relaxed">{product.description}</div>
        {storyContent && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="text-text/70 leading-relaxed" dangerouslySetInnerHTML={{ __html: storyContent }} />
          </div>
        )}
      </div>
    </div>
  );
}

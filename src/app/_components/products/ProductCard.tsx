/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { AddToCartButton, Image, ProductPrice, ProductProvider } from '@shopify/hydrogen-react';
import { Package, ShoppingCart } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import type { Product } from '@shopify/hydrogen-react/storefront-api-types';
import type { PartialDeep } from 'type-fest';

interface ProductCardProps {
  product: PartialDeep<Product, { recurseIntoArrays: true }>;
  viewMode?: 'grid' | 'list';
}

export default function ProductCard({ product, viewMode = 'grid' }: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Safe access to variants - handle both array and connection formats
  const getFirstVariant = () => {
    if (product.variants?.nodes?.length) {
      return product.variants.nodes[0];
    }
    if (Array.isArray(product.variants) && product.variants.length > 0) {
      return product.variants[0];
    }
    return null;
  };

  // Safe access to images - handle both array and connection formats
  const getFirstImage = () => {
    if (product.images?.nodes?.length) {
      return product.images.nodes[0];
    }
    if (Array.isArray(product.images) && product.images.length > 0) {
      return product.images[0];
    }
    return null;
  };

  // Safe access to media - handle both array and connection formats
  const getFirstVideo = () => {
    let mediaNodes = null;

    if (product.media?.nodes?.length) {
      mediaNodes = product.media.nodes;
    } else if (Array.isArray(product.media) && product.media.length > 0) {
      mediaNodes = product.media;
    }

    if (!mediaNodes) return null;

    return mediaNodes.find(
      (media) => media?.mediaContentType === 'VIDEO' || media?.mediaContentType === 'EXTERNAL_VIDEO'
    );
  };

  const firstVariant = getFirstVariant();
  const firstImage = getFirstImage();
  const firstVideo = getFirstVideo();

  // Get video source for Shopify hosted videos
  const getVideoSource = () => {
    if (!firstVideo) return null;

    if (firstVideo.mediaContentType === 'VIDEO' && (firstVideo as any).sources) {
      // For Shopify hosted videos, get the first source
      const sources = (firstVideo as any).sources;
      return sources[0]?.url || null;
    }

    if (firstVideo.mediaContentType === 'EXTERNAL_VIDEO') {
      // For external videos, we'll use the embed URL or origin URL
      return (firstVideo as any).originUrl || (firstVideo as any).embedUrl || null;
    }

    return null;
  };

  const videoSource = getVideoSource();
  const hasVideo = Boolean(firstVideo && videoSource);

  // Handle video play/pause on hover
  useEffect(() => {
    if (videoRef.current) {
      if (isHovered) {
        videoRef.current.play().catch(() => {
          // Silently handle autoplay failures
        });
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0; // Reset to beginning
      }
    }
  }, [isHovered]);

  const isOnSale =
    firstVariant?.compareAtPrice &&
    firstVariant?.price?.amount &&
    parseFloat(firstVariant.compareAtPrice.amount || '0') > parseFloat(firstVariant.price.amount);

  const discountPercentage =
    isOnSale && firstVariant?.compareAtPrice?.amount && firstVariant?.price?.amount
      ? Math.round((1 - parseFloat(firstVariant.price.amount) / parseFloat(firstVariant.compareAtPrice.amount)) * 100)
      : 0;

  if (!product.id) return null;

  // Create a normalized product object for ProductProvider
  // This ensures the data structure is what Hydrogen expects
  const normalizedProduct = {
    ...product,
    // Ensure variants is in the expected connection format
    variants: product.variants?.nodes
      ? product.variants
      : {
          nodes: Array.isArray(product.variants) ? product.variants : firstVariant ? [firstVariant] : [],
        },
    // Ensure images is in the expected connection format
    images: product.images?.nodes
      ? product.images
      : {
          nodes: Array.isArray(product.images) ? product.images : firstImage ? [firstImage] : [],
        },
    // Ensure media is in the expected connection format
    media: product.media?.nodes
      ? product.media
      : {
          nodes: Array.isArray(product.media) ? product.media : firstVideo ? [firstVideo] : [],
        },
  };

  // Prepare ProductProvider props
  const productProviderProps: {
    data: any; // Using any here to avoid type conflicts with normalized structure
    initialVariantId?: string;
  } = {
    data: normalizedProduct,
  };

  // Only add initialVariantId if we have a valid variant ID
  if (firstVariant?.id) {
    productProviderProps.initialVariantId = firstVariant.id;
  }

  // LIST VIEW LAYOUT
  if (viewMode === 'list') {
    return (
      <ProductProvider {...productProviderProps}>
        <div className="bg-white overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group rounded-lg">
          <div className="flex">
            {/* Product Image/Video - Left Side */}
            <div
              className="relative w-48 h-48 flex-shrink-0 overflow-hidden bg-gray-100"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Main Image */}
              {firstImage && firstImage.url ? (
                <Image
                  src={firstImage.url}
                  alt={firstImage.altText || product.title || 'Product Image'}
                  width={firstImage.width || 192}
                  height={firstImage.height || 192}
                  className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-300 ${
                    hasVideo && isHovered ? 'opacity-0' : 'opacity-100'
                  }`}
                  sizes="192px"
                />
              ) : (
                <div
                  className={`w-full h-full flex items-center justify-center transition-opacity duration-300 ${
                    hasVideo && isHovered ? 'opacity-0' : 'opacity-100'
                  }`}
                >
                  <Package className="w-16 h-16 text-gray-300" />
                </div>
              )}

              {/* Video (shown on hover if available) */}
              {hasVideo && videoSource && (
                <div
                  className={`absolute inset-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                >
                  {firstVideo?.mediaContentType === 'VIDEO' ? (
                    <video
                      ref={videoRef}
                      src={videoSource}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <iframe
                      src={`${videoSource}?autoplay=1&mute=1&loop=1&controls=0&modestbranding=1&rel=0`}
                      className="w-full h-full object-cover"
                      allow="autoplay; muted"
                      loading="lazy"
                    />
                  )}
                </div>
              )}

              {/* Sale Badge */}
              {isOnSale && (
                <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-20">
                  -{discountPercentage}%
                </div>
              )}

              {/* Availability Badge */}
              {!firstVariant?.availableForSale && (
                <div className="absolute top-3 right-3 bg-gray-900 text-white text-xs font-medium px-2 py-1 rounded-full z-20">
                  Out of Stock
                </div>
              )}
            </div>

            {/* Product Info - Right Side */}
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div>
                {/* Title */}
                <h3 className="font-semibold font-bungee text-lg text-gray-900 mb-2">
                  <a href={`/products/${product.handle}`} className="hover:text-blue-600 transition-colors">
                    {product.title}
                  </a>
                </h3>

                {/* Description */}
                {product.description && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                )}
              </div>

              <div className="flex items-center justify-between">
                {/* Price */}
                <div className="flex items-center space-x-2">
                  {firstVariant?.price?.amount && (
                    <>
                      <ProductPrice
                        data={normalizedProduct}
                        variantId={firstVariant.id}
                        className="text-xl font-bold text-gray-900"
                      />
                      {isOnSale && firstVariant?.compareAtPrice?.amount && (
                        <ProductPrice
                          data={normalizedProduct}
                          variantId={firstVariant.id}
                          priceType="compareAt"
                          className="text-sm text-gray-500 line-through"
                        />
                      )}
                    </>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  {/* <button */}
                  {/*   onClick={() => setIsWishlisted(!isWishlisted)} */}
                  {/*   className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors" */}
                  {/*   aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'} */}
                  {/* > */}
                  {/*   <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} /> */}
                  {/* </button> */}
                  {/* <a */}
                  {/*   href={`/products/${product.handle}`} */}
                  {/*   className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors" */}
                  {/*   aria-label="View product details" */}
                  {/* > */}
                  {/*   <Eye className="w-4 h-4 text-gray-600" /> */}
                  {/* </a> */}
                  {firstVariant?.id ? (
                    <AddToCartButton
                      variantId={firstVariant.id}
                      quantity={1}
                      disabled={!firstVariant?.availableForSale}
                      className="bg-primary text-white hover:bg-primary/90 py-2 px-4 rounded-lg transition-all duration-200 font-medium disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span className="text-sm">{firstVariant?.availableForSale ? 'Add to Cart' : 'Out of Stock'}</span>
                    </AddToCartButton>
                  ) : (
                    <div className="bg-gray-300 text-gray-500 py-2 px-4 rounded-lg font-medium flex items-center space-x-2 cursor-not-allowed text-sm">
                      <Package className="w-4 h-4" />
                      <span>Unavailable</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </ProductProvider>
    );
  }

  // GRID VIEW LAYOUT (default)
  return (
    <ProductProvider {...productProviderProps}>
      <div className="bg-white overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group rounded-lg">
        {/* Product Image/Video */}
        <div
          className="relative aspect-square overflow-hidden bg-gray-100"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Main Image */}
          {firstImage && firstImage.url ? (
            <Image
              src={firstImage.url}
              alt={firstImage.altText || product.title || 'Product Image'}
              width="317"
              height="394"
              className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-300 ${
                hasVideo && isHovered ? 'opacity-0' : 'opacity-100'
              }`}
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            />
          ) : (
            <div
              className={`w-full h-full flex items-center justify-center transition-opacity duration-300 ${
                hasVideo && isHovered ? 'opacity-0' : 'opacity-100'
              }`}
            >
              <Package className="w-16 h-16 text-gray-300" />
            </div>
          )}

          {/* Video (shown on hover if available) */}
          {hasVideo && videoSource && (
            <div
              className={`absolute inset-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
            >
              {firstVideo?.mediaContentType === 'VIDEO' ? (
                // Shopify hosted video
                <video
                  ref={videoRef}
                  src={videoSource}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              ) : (
                // External video (YouTube/Vimeo) - use iframe
                <iframe
                  src={`${videoSource}?autoplay=1&mute=1&loop=1&controls=0&modestbranding=1&rel=0`}
                  className="w-full h-full object-cover"
                  allow="autoplay; muted"
                  loading="lazy"
                />
              )}
            </div>
          )}

          {/* Sale Badge */}
          {isOnSale && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-20">
              -{discountPercentage}%
            </div>
          )}

          {/* Availability Badge */}
          {!firstVariant?.availableForSale && (
            <div className="absolute top-3 right-3 bg-gray-900 text-white text-xs font-medium px-2 py-1 rounded-full z-20">
              Out of Stock
            </div>
          )}

          {/* Quick Actions - Top Right */}
          <div className="absolute top-3 left-3 opacity-100 transition-opacity duration-200 space-y-2 z-20">
            {/* <button */}
            {/*   onClick={() => setIsWishlisted(!isWishlisted)} */}
            {/*   className="block p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors" */}
            {/*   aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'} */}
            {/* > */}
            {/*   <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} /> */}
            {/* </button> */}
            <div className="block px-4 py-1 bg-primary shadow-md text-white transition-colors">NEW</div>

            {/* <a */}
            {/*   href={`/products/${product.handle}`} */}
            {/*   className="block p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors" */}
            {/*   aria-label="View product details" */}
            {/* > */}
            {/*   <Eye className="w-4 h-4 text-gray-600" /> */}
            {/* </a> */}
          </div>

          {/* Add to Cart Button - Center on Hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <div className=" p-1">
              {firstVariant?.id ? (
                <AddToCartButton
                  variantId={firstVariant.id}
                  quantity={1}
                  disabled={!firstVariant?.availableForSale}
                  className="bg-primary text-white hover:bg-primary/90 py-3 px-6 transition-all duration-200 font-medium disabled:bg-primary disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg transform hover:scale-105"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span className="font-semibold">
                    {firstVariant?.availableForSale ? 'Add to Cart' : 'Out of Stock'}
                  </span>
                </AddToCartButton>
              ) : (
                <div className="bg-gray-300 text-gray-500 py-3 px-6 rounded-lg font-medium flex items-center space-x-2 cursor-not-allowed shadow-lg">
                  <Package className="w-5 h-5" />
                  <span className="font-semibold">Unavailable</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-semibold font-bungee text-gray-900 mb-2 line-clamp-2">
            <a href={`/products/${product.handle}`} className="hover:text-primary transition-colors">
              {product.title}
            </a>
          </h3>

          {/* Price */}
          <div className="flex items-center space-x-2">
            {firstVariant?.price?.amount && (
              <>
                <ProductPrice
                  data={normalizedProduct}
                  variantId={firstVariant.id}
                  className="text-lg font-bold text-gray-900"
                />
                {isOnSale && firstVariant?.compareAtPrice?.amount && (
                  <ProductPrice
                    data={normalizedProduct}
                    variantId={firstVariant.id}
                    priceType="compareAt"
                    className="text-sm text-gray-500 line-through"
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </ProductProvider>
  );
}

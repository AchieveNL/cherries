/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { AddToCartButton, Image, ProductPrice, ProductProvider, useCart } from '@shopify/hydrogen-react';
import { CheckCircle, Heart, Package, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

// Import analytics
import { trackAddToCart } from '@/lib/analytics';
import { CartIcon, PlusIcon } from '../icons/shared';
import { useWishlist } from '../layout/context/wishList';

import type { Product } from '@shopify/hydrogen-react/storefront-api-types';
import type { PartialDeep } from 'type-fest';

interface ProductCardProps {
  product: PartialDeep<Product, { recurseIntoArrays: true }>;
  viewMode?: 'grid' | 'list';
  newProductDays?: number; // How many days to consider a product "new"
}

export default function ProductCard({ product, viewMode = 'grid', newProductDays = 30 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const { status, totalQuantity, id: cartId } = useCart();
  const [previousTotalQuantity, setPreviousTotalQuantity] = useState(0);

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
  const getSecondImage = () => {
    if (product.images?.nodes?.length && product.images.nodes.length > 1) {
      return product.images.nodes[1];
    }
    if (Array.isArray(product.images) && product.images.length > 1) {
      return product.images[1];
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

  // Check if product is new based on createdAt date
  const isNewProduct = () => {
    if (!product.createdAt) return false;

    const createdDate = new Date(product.createdAt);
    const currentDate = new Date();
    const daysDifference = Math.floor((currentDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));

    return daysDifference <= newProductDays;
  };

  const firstVariant = getFirstVariant();
  const firstImage = getFirstImage();
  const firstVideo = getFirstVideo();
  const secondImage = getSecondImage();

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
  const showNewBadge = isNewProduct();

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

  useEffect(() => {
    // Only initialize quantity when cart first loads AND we're not currently adding to cart
    if (totalQuantity !== undefined && previousTotalQuantity === 0 && status === 'idle' && !isAddingToCart) {
      setPreviousTotalQuantity(totalQuantity);
      return;
    }

    // Detect successful addition by quantity increase
    if (status === 'idle' && totalQuantity !== undefined && totalQuantity > previousTotalQuantity && isAddingToCart) {
      console.log('✅ ProductCard: Item added to cart successfully');

      // Track add to cart analytics
      if (product && firstVariant && cartId) {
        trackAddToCart({
          cartId,
          product: {
            id: product.id || '',
            title: product.title || '',
            price: firstVariant.price?.amount || '0',
            quantity: 1, // ProductCard always adds 1 item
            variantId: firstVariant.id || '',
            variantTitle: firstVariant.title || '',
            vendor: product.vendor || '',
            productType: product.productType || '',
            sku: firstVariant.sku || '',
          },
          totalValue: parseFloat(firstVariant.price?.amount || '0'),
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
      setIsAddingToCart(false);
    }
  }, [status, totalQuantity, previousTotalQuantity, isAddingToCart, product, firstVariant, cartId]);

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

  // Product URL for navigation
  const productUrl = `/products/${product.handle}`;

  // Handle Add to Cart click with analytics
  const handleAddToCartClick = () => {
    console.log('🔵 ProductCard: Add to cart clicked - setting loading state');
    setIsAddingToCart(true);
    setShowSuccessMessage(false);
  };

  // LIST VIEW LAYOUT
  if (viewMode === 'list') {
    return (
      <ProductProvider {...productProviderProps}>
        <div className="bg-white overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group ">
          <div className="flex">
            {/* Product Image/Video - Left Side */}
            <Link
              href={productUrl}
              className="relative w-[700px] h-[308px] flex-shrink-0 overflow-hidden bg-gray-100 block"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              aria-label={`View ${product.title} details`}
            >
              {/* Main Image */}
              {firstImage && firstImage.url ? (
                <Image
                  src={firstImage.url}
                  alt={firstImage.altText || product.title || 'Product Image'}
                  width={firstImage.width || 192}
                  height={firstImage.height || 192}
                  className={`w-full h-full scale-105 object-contain  transition-all duration-300 ${
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

              {/* Second Image (shown on hover if available and no video) */}
              {secondImage && secondImage.url && !hasVideo && (
                <div
                  className={`absolute inset-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                >
                  <Image
                    src={secondImage.url}
                    alt={secondImage.altText || product.title || 'Product Image'}
                    width={firstImage.width || 192}
                    height={firstImage.height || 192}
                    className="w-full h-full object-contain group-hover:scale-105 transition-all duration-300"
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                  />
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
                      className="w-full h-full object-contain"
                      allow="autoplay; muted"
                      loading="lazy"
                    />
                  )}
                </div>
              )}

              {/* Badge Container - Top Right */}
              <div className="absolute top-3  right-3 flex flex-col space-y-2 z-40">
                {/* WishListButton  */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleWishlistToggle();
                  }}
                  disabled={wishlistLoading}
                  className="p-3  transition-colors disabled:opacity-50 disabled:cursor-not-allowed pointer-events-auto"
                  aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart
                    className={`w-7 h-7 transition-colors ${
                      isWishlisted ? 'fill-primary text-primary' : 'text-primary hover:text-primary'
                    }`}
                  />
                </button>

                {/* Availability Badge */}
                {!firstVariant?.availableForSale && (
                  <div className="bg-primary text-white text-xs font-medium px-4 py-2">Out of Stock</div>
                )}
              </div>
              {/* Badge Container */}
              <div className="absolute top-3 left-3 flex flex-col space-y-2 z-20">
                {/* NEW Badge */}
                {showNewBadge && <div className="bg-primary text-white text-xs font-bold px-2 py-1">NEW</div>}
              </div>
              <div className="absolute bottom-3 left-3 flex flex-col space-y-2 z-20">
                {/* Sale Badge */}
                {isOnSale && (
                  <div className="bg-primary text-white text-xs font-bold px-2 py-1">Save -{discountPercentage}%</div>
                )}
              </div>
              {/* Availability Badge */}
              {!firstVariant?.availableForSale && (
                <div className="absolute top-3 right-3 bg-gray-900 text-white text-xs font-medium px-2 py-1  z-20">
                  Out of Stock
                </div>
              )}
            </Link>

            {/* Product Info - Right Side */}
            <div className="flex-1 p-6 flex flex-col justify-between">
              <div>
                {/* Title */}
                <h3 className="font-semibold flex justify-between font-bungee text-lg text-gray-900 mb-1">
                  <Link href={productUrl} className="hover:text-primary transition-colors">
                    {product.title}
                  </Link>
                </h3>
                <div className="flex items-center space-x-2">
                  {firstVariant?.price?.amount && (
                    <>
                      <ProductPrice
                        data={normalizedProduct}
                        variantId={firstVariant.id}
                        className="text-xl font-bold text-black"
                      />
                      {isOnSale && firstVariant?.compareAtPrice?.amount && (
                        <ProductPrice
                          data={normalizedProduct}
                          variantId={firstVariant.id}
                          priceType="compareAt"
                          className="text-lg text-primary line-through"
                        />
                      )}
                    </>
                  )}
                </div>

                {/* Description */}
                {product.description && (
                  <p className="text-sm text-gray-600 my-4 line-clamp-2">{product.description}</p>
                )}
              </div>

              <div className="font-semibold flex justify-end font-bungee text-lg text-gray-900 mb-1">
                <div className="flex flex-col gap-2">
                  {firstVariant?.id ? (
                    <AddToCartButton
                      variantId={firstVariant.id}
                      quantity={1}
                      disabled={!firstVariant?.availableForSale || isAddingToCart}
                      onClick={handleAddToCartClick}
                      className="group/button relative"
                    >
                      <div
                        className={`
          flex items-center justify-center space-x-1 h-10 px-6   font-medium
font-roboto
          transition-all duration-200 ease-in-out
          ${
            !firstVariant?.availableForSale
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : isAddingToCart
                ? 'bg-primary/90 text-white cursor-wait'
                : 'bg-primary text-white hover:bg-primary/90 hover:shadow-md active:scale-95'
          }
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        `}
                      >
                        {isAddingToCart ? (
                          <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        ) : !firstVariant?.availableForSale ? (
                          <Package className="w-5 h-5" />
                        ) : showSuccessMessage ? (
                          <CheckCircle className="w-5 h-5 text-secondary animate-in fade-in-0 zoom-in-75 duration-300" />
                        ) : (
                          <>Add To Cart</>
                        )}
                      </div>

                      {/* Shimmer animation overlay */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/button:translate-x-full transition-transform duration-700 ease-out"></div>
                    </AddToCartButton>
                  ) : (
                    <div className="flex items-center justify-center h-8 px-3 rounded-lg bg-gray-100 text-gray-500 border border-gray-200 cursor-not-allowed">
                      <Package className="w-4 h-4" />
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
      <div className="bg-white overflow-hidden transition-all duration-300 group">
        {/* Product Image/Video */}
        <Link
          href={productUrl}
          className="relative aspect-square overflow-hidden bg-gray-100 block"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-label={`View ${product.title} details`}
        >
          {/* Main Image */}
          {firstImage && firstImage.url ? (
            <Image
              src={firstImage.url}
              alt={firstImage.altText || product.title || 'Product Image'}
              width="317"
              height="394"
              className={`w-full h-full object-cover transition-all duration-300 ${
                hasVideo && isHovered
                  ? 'opacity-0'
                  : secondImage && isHovered
                    ? 'opacity-0'
                    : 'opacity-100 group-hover:scale-105'
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

          {/* Second Image (shown on hover if available and no video) */}
          {secondImage && secondImage.url && !hasVideo && (
            <div
              className={`absolute inset-0 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
            >
              <Image
                src={secondImage.url}
                alt={secondImage.altText || product.title || 'Product Image'}
                width="317"
                height="394"
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300"
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              />
            </div>
          )}

          {/* Video (shown on hover if available) - This takes priority over second image */}
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

          {/* Badge Container - Top Right */}
          <div className="absolute top-3  right-3 flex flex-col space-y-2 z-40">
            {/* WishListButton  */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleWishlistToggle();
              }}
              disabled={wishlistLoading}
              className="p-3  transition-colors disabled:opacity-50 disabled:cursor-not-allowed pointer-events-auto"
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart
                className={`w-7 h-7 transition-colors ${
                  isWishlisted ? 'fill-primary text-primary' : 'text-primary hover:text-primary'
                }`}
              />
            </button>

            {/* Availability Badge */}
            {!firstVariant?.availableForSale && (
              <div className="bg-primary text-white text-xs font-medium px-4 py-2">Out of Stock</div>
            )}
          </div>
          {/* Badge Container - Bottom Right */}
          <div className="absolute bottom-3 left-3 flex flex-col space-y-2 z-20">
            {/* Sale Badge */}
            {isOnSale && (
              <div className="bg-primary text-white text-xs font-bold px-4 py-2">Save -{discountPercentage}%</div>
            )}
          </div>

          {/* NEW Badge - Top Left */}
          {showNewBadge && (
            <div className="absolute top-3 left-3 z-20">
              <div className="bg-primary text-white text-xs font-bold px-4 py-2 shadow-md">NEW</div>
            </div>
          )}

          {/* Add to Cart Button - Center on Hover */}
        </Link>

        {/* Product Info */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-semibold flex font-bungee text-gray-900 mb-2 line-clamp-2">
            <Link href={productUrl} className="hover:text-primary transition-colors">
              {product.title}
            </Link>
          </h3>

          {/* Price */}
          <div className="flex items-center justify-between space-x-2">
            {firstVariant?.price?.amount && (
              <>
                <ProductPrice
                  data={normalizedProduct}
                  variantId={firstVariant.id}
                  className="text-lg font-bold text-black"
                />
                {isOnSale && firstVariant?.compareAtPrice?.amount && (
                  <ProductPrice
                    data={normalizedProduct}
                    variantId={firstVariant.id}
                    priceType="compareAt"
                    className="text-lg font-bold text-primary line-through"
                  />
                )}
              </>
            )}

            {/* Action Button Section */}
            <div className="flex flex-col gap-2">
              {firstVariant?.id ? (
                <AddToCartButton
                  variantId={firstVariant.id}
                  quantity={1}
                  disabled={!firstVariant?.availableForSale || isAddingToCart}
                  onClick={handleAddToCartClick}
                  className="group/button relative"
                >
                  <div
                    className={`
          flex items-center justify-center space-x-1 h-8 px-3 rounded-lg font-medium
          transition-all duration-200 ease-in-out
          ${
            !firstVariant?.availableForSale
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : isAddingToCart
                ? 'bg-primary/90 text-white cursor-wait'
                : 'bg-primary text-white  hover:shadow-md active:scale-95'
          }
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
        `}
                  >
                    {isAddingToCart ? (
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : !firstVariant?.availableForSale ? (
                      <Package className="w-5 h-5" />
                    ) : showSuccessMessage ? (
                      <CheckCircle className="w-5 h-5 text-secondary animate-in fade-in-0 zoom-in-75 duration-300" />
                    ) : (
                      <>
                        <CartIcon />
                        <PlusIcon />
                      </>
                    )}
                  </div>

                  {/* Shimmer animation overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/button:translate-x-full transition-transform duration-700 ease-out"></div>
                </AddToCartButton>
              ) : (
                <div className="flex items-center justify-center h-8 px-3 rounded-lg bg-gray-100 text-gray-500 border border-gray-200 cursor-not-allowed">
                  <Package className="w-4 h-4" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProductProvider>
  );
}

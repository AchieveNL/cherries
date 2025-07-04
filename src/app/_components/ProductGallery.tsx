import { Image } from '@shopify/hydrogen-react';
import { ChevronLeft, ChevronRight, Expand, X, ZoomIn } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import type { Product, ProductVariant, Image as ShopifyImage } from '@shopify/hydrogen-react/storefront-api-types';
import type { PartialDeep } from 'type-fest';

interface ProductGalleryProps {
  product: PartialDeep<Product, { recurseIntoArrays: true }>;
  selectedVariant?: PartialDeep<ProductVariant, { recurseIntoArrays: true }> | null;
}

// Fullscreen Modal Component (will be rendered in portal)
function FullscreenModal({
  isOpen,
  onClose,
  currentImage,
  validImages,
  currentImageIndex,
  setCurrentImageIndex,
  product,
}: {
  isOpen: boolean;
  onClose: () => void;
  currentImage: ShopifyImage;
  validImages: ShopifyImage[];
  currentImageIndex: number;
  setCurrentImageIndex: (index: number) => void;
  product: PartialDeep<Product, { recurseIntoArrays: true }>;
}) {
  const goToPrevious = () => {
    setCurrentImageIndex(currentImageIndex === 0 ? validImages.length - 1 : currentImageIndex - 1);
  };

  const goToNext = () => {
    setCurrentImageIndex(currentImageIndex === validImages.length - 1 ? 0 : currentImageIndex + 1);
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center p-8"
      style={{
        zIndex: 2147483647, // Maximum z-index value
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
      }}
    >
      {/* Backdrop Click to Close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} aria-label="Close fullscreen" />

      {/* Main Container - Fixed to center and constrain size */}
      <div
        className="relative flex items-center justify-center"
        style={{ maxWidth: 'calc(100vw - 8rem)', maxHeight: 'calc(100vh - 8rem)' }}
      >
        {/* Close Button - Made much more visible */}
        <button
          onClick={onClose}
          className="absolute -top-16 -right-4 z-20 bg-white text-black hover:bg-gray-100 rounded-full p-3 transition-all duration-200 hover:scale-110 shadow-lg border-2 border-gray-200"
          aria-label="Close fullscreen"
          style={{ zIndex: 999999 }}
        >
          <X className="w-6 h-6 font-bold" strokeWidth={3} />
        </button>

        {/* Image Container - Properly constrained */}
        <div className="relative flex items-center justify-center">
          <Image
            alt={currentImage.altText || product.title || 'Product Image'}
            data={currentImage}
            className="max-h-[80vh] max-w-[80vw] object-contain"
            sizes="80vw"
            style={{
              maxHeight: 'calc(100vh - 12rem)',
              maxWidth: 'calc(100vw - 12rem)',
            }}
          />
        </div>

        {/* Navigation Buttons */}
        {validImages.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute -left-16 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full p-4 text-white transition-all duration-200 hover:scale-110"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute -right-16 top-1/2 -translate-y-1/2 z-10 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full p-4 text-white transition-all duration-200 hover:scale-110"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Counter - Positioned below image */}
        {validImages.length > 1 && (
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 z-10 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full font-medium">
            {currentImageIndex + 1} of {validImages.length}
          </div>
        )}

        {/* Thumbnail Navigation - Positioned below counter */}
        {validImages.length > 1 && (
          <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 z-10 flex space-x-2 max-w-md overflow-x-auto">
            {validImages.map((image, index) => (
              <button
                key={image.id || index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  currentImageIndex === index ? 'border-white shadow-lg' : 'border-white/30 hover:border-white/60'
                }`}
              >
                <Image
                  alt={image.altText || `Thumbnail ${index + 1}`}
                  data={image}
                  className="w-full h-full object-cover"
                  sizes="48px"
                />
              </button>
            ))}
          </div>
        )}

        {/* Keyboard Navigation Hint */}
        <div className="absolute -top-16 -left-4 z-10 bg-white/10 backdrop-blur-sm text-white text-sm px-3 py-2 rounded-full font-medium">
          Press ESC to close
        </div>
      </div>
    </div>,
    document.body // Render directly to body
  );
}

export default function ProductGallery({ product, selectedVariant }: ProductGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Get images from the selected variant or product
  const variantImage = selectedVariant?.image;
  const productImages = product.images?.nodes || [];

  // Prioritize variant image, then product images
  const allImages = variantImage
    ? [variantImage, ...productImages.filter((img) => img?.id !== variantImage.id)]
    : productImages;

  const validImages = allImages.filter((img): img is ShopifyImage => img != null);

  // Handle body scroll and escape key when fullscreen is open
  useEffect(() => {
    if (isFullscreen) {
      // Store original values
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const originalWidth = document.body.style.width;
      const originalHeight = document.body.style.height;

      // Lock body scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.height = '100%';

      // Handle escape key
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeFullscreen();
        }
      };

      document.addEventListener('keydown', handleEscape);

      return () => {
        // Restore original values
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.width = originalWidth;
        document.body.style.height = originalHeight;
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isFullscreen]);

  if (validImages.length === 0) {
    return (
      <div className="aspect-square bg-gray-50 flex items-center justify-center border-2 border-dashed border-gray-200">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-gray-100 mx-auto flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <span className="text-gray-600 text-sm font-medium">No image available</span>
        </div>
      </div>
    );
  }

  const currentImage = validImages[currentImageIndex];

  const goToPrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentImageIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const openFullscreen = () => {
    setIsFullscreen(true);
  };

  const closeFullscreen = () => {
    setIsFullscreen(false);
    setIsZoomed(false);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Main Image Container */}
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 group shadow-lg border border-gray-100">
          {/* Main Image */}
          <div
            className={`relative w-full h-full transition-transform duration-500 ease-out cursor-zoom-in ${
              isZoomed ? 'scale-150' : 'scale-100'
            }`}
            onClick={toggleZoom}
          >
            <Image
              alt={currentImage.altText || product.title || 'Product Image'}
              data={currentImage}
              className="w-full h-full object-cover transition-all duration-300"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
          </div>

          {/* Navigation Controls */}
          {validImages.length > 1 && (
            <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={goToPrevious}
                className="bg-white/90 backdrop-blur-sm hover:bg-white p-3 shadow-xl transition-all duration-200 hover:scale-110 border border-white/50"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5 text-gray-900" />
              </button>
              <button
                onClick={goToNext}
                className="bg-white/90 backdrop-blur-sm hover:bg-white p-3 shadow-xl transition-all duration-200 hover:scale-110 border border-white/50"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5 text-gray-900" />
              </button>
            </div>
          )}

          {/* Top Controls */}
          <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={toggleZoom}
              className="bg-white/90 backdrop-blur-sm hover:bg-white p-2.5 shadow-lg transition-all duration-200 hover:scale-110 border border-white/50"
              aria-label={isZoomed ? 'Zoom out' : 'Zoom in'}
            >
              <ZoomIn className="w-4 h-4 text-gray-900" />
            </button>
            <button
              onClick={openFullscreen}
              className="bg-white/90 backdrop-blur-sm hover:bg-white p-2.5 shadow-lg transition-all duration-200 hover:scale-110 border border-white/50"
              aria-label="View fullscreen"
            >
              <Expand className="w-4 h-4 text-gray-900" />
            </button>
          </div>

          {/* Image Counter */}
          {validImages.length > 1 && (
            <div className="absolute bottom-4 left-4 bg-gray-900/80 backdrop-blur-sm text-white text-sm px-3 py-1.5 font-medium shadow-lg">
              {currentImageIndex + 1} of {validImages.length}
            </div>
          )}

          {/* Zoom Indicator */}
          {isZoomed && (
            <div className="absolute bottom-4 right-4 bg-primary/90 backdrop-blur-sm text-white text-xs px-2 py-1 font-medium shadow-lg">
              Zoomed
            </div>
          )}
        </div>

        {/* Thumbnail Grid */}
        {validImages.length > 1 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-gray-700 text-sm font-medium">Product Images</h3>
              <span className="text-gray-500 text-xs">{validImages.length} photos</span>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {validImages.map((image, index) => (
                <button
                  key={image.id || index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`group relative aspect-square overflow-hidden border-2 transition-all duration-200 ${
                    currentImageIndex === index
                      ? 'border-primary shadow-lg ring-2 ring-primary/20 scale-105'
                      : 'border-gray-200 hover:border-gray-400 hover:shadow-md hover:scale-102'
                  }`}
                >
                  <Image
                    alt={image.altText || `Product image ${index + 1}`}
                    data={image}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
                    sizes="120px"
                  />

                  {/* Active Indicator */}
                  {currentImageIndex === index && (
                    <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                      <div className="w-6 h-6 bg-primary flex items-center justify-center shadow-lg">
                        <div className="w-2 h-2 bg-white"></div>
                      </div>
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200"></div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Image Navigation Dots (for mobile) */}
        {validImages.length > 1 && (
          <div className="flex justify-center space-x-2 md:hidden">
            {validImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 transition-all duration-200 ${
                  currentImageIndex === index ? 'bg-primary scale-125' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal using React Portal */}
      <FullscreenModal
        isOpen={isFullscreen}
        onClose={closeFullscreen}
        currentImage={currentImage}
        validImages={validImages}
        currentImageIndex={currentImageIndex}
        setCurrentImageIndex={setCurrentImageIndex}
        product={product}
      />
    </>
  );
}

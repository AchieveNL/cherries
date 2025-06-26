import { Image } from '@shopify/hydrogen-react';
import { ChevronLeft, ChevronRight, Expand, ZoomIn } from 'lucide-react';
import { useState } from 'react';

import type { Product, ProductVariant, Image as ShopifyImage } from '@shopify/hydrogen-react/storefront-api-types';
import type { PartialDeep } from 'type-fest';

interface ProductGalleryProps {
  product: PartialDeep<Product, { recurseIntoArrays: true }>;
  selectedVariant?: PartialDeep<ProductVariant, { recurseIntoArrays: true }> | null;
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

  if (validImages.length === 0) {
    return (
      <div className="aspect-square bg-gray-50  flex items-center justify-center border-2 border-dashed border-gray-200">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-gray-100  mx-auto flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <span className="text-text/60 text-sm font-medium">No image available</span>
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
        <div className="relative aspect-square  overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 group shadow-lg border border-gray-100">
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
                className="bg-white/90 backdrop-blur-sm hover:bg-white  p-3 shadow-xl transition-all duration-200 hover:scale-110 border border-white/50"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5 text-text" />
              </button>
              <button
                onClick={goToNext}
                className="bg-white/90 backdrop-blur-sm hover:bg-white  p-3 shadow-xl transition-all duration-200 hover:scale-110 border border-white/50"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5 text-text" />
              </button>
            </div>
          )}

          {/* Top Controls */}
          <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={toggleZoom}
              className="bg-white/90 backdrop-blur-sm hover:bg-white  p-2.5 shadow-lg transition-all duration-200 hover:scale-110 border border-white/50"
              aria-label={isZoomed ? 'Zoom out' : 'Zoom in'}
            >
              <ZoomIn className="w-4 h-4 text-text" />
            </button>
            <button
              onClick={openFullscreen}
              className="bg-white/90 backdrop-blur-sm hover:bg-white  p-2.5 shadow-lg transition-all duration-200 hover:scale-110 border border-white/50"
              aria-label="View fullscreen"
            >
              <Expand className="w-4 h-4 text-text" />
            </button>
          </div>

          {/* Image Counter */}
          {validImages.length > 1 && (
            <div className="absolute bottom-4 left-4 bg-text/80 backdrop-blur-sm text-white text-sm px-3 py-1.5  font-medium shadow-lg">
              {currentImageIndex + 1} of {validImages.length}
            </div>
          )}

          {/* Zoom Indicator */}
          {isZoomed && (
            <div className="absolute bottom-4 right-4 bg-primary/90 backdrop-blur-sm text-white text-xs px-2 py-1  font-medium shadow-lg">
              Zoomed
            </div>
          )}
        </div>

        {/* Thumbnail Grid */}
        {validImages.length > 1 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-text/70 text-sm font-medium">Product Images</h3>
              <span className="text-text/50 text-xs">{validImages.length} photos</span>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {validImages.map((image, index) => (
                <button
                  key={image.id || index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`group relative aspect-square  overflow-hidden border-2 transition-all duration-200 ${
                    currentImageIndex === index
                      ? 'border-primary shadow-lg ring-2 ring-primary/20 scale-105'
                      : 'border-gray-200 hover:border-secondary hover:shadow-md hover:scale-102'
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
                      <div className="w-6 h-6 bg-primary  flex items-center justify-center shadow-lg">
                        <div className="w-2 h-2 bg-white "></div>
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
                className={`w-2 h-2  transition-all duration-200 ${
                  currentImageIndex === index ? 'bg-primary scale-125' : 'bg-gray-300 hover:bg-secondary'
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
            {/* Close Button */}
            <button
              onClick={closeFullscreen}
              className="absolute top-4 right-4 z-10 bg-white/10 backdrop-blur-sm hover:bg-white/20  p-3 text-white transition-all duration-200"
              aria-label="Close fullscreen"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Fullscreen Image */}
            <div className="relative max-w-full max-h-full">
              <Image
                alt={currentImage.altText || product.title || 'Product Image'}
                data={currentImage}
                className="max-w-full max-h-full object-contain"
                sizes="100vw"
              />
            </div>

            {/* Fullscreen Navigation */}
            {validImages.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20  p-4 text-white transition-all duration-200"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm hover:bg-white/20  p-4 text-white transition-all duration-200"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Fullscreen Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm text-white px-4 py-2  font-medium">
                  {currentImageIndex + 1} of {validImages.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

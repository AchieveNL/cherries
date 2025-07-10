/* eslint-disable @typescript-eslint/no-unused-vars */
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { getCollectionWithProducts } from '@/lib/shopify';
import { ArrowUp } from '../icons/landingPage/ArrowUp';
import { Button } from '../ui';

import type { Product } from '@shopify/hydrogen-react/storefront-api-types';
import type { PartialDeep } from 'type-fest';

interface LandingPageProps {
  collectionHandle?: string;
  maxProducts?: number;
}

// Skeleton Components
const MainProductSkeleton = () => (
  <div className="relative z-10">
    <div className="animate-pulse">
      {/* Desktop Skeleton */}
      <div className="hidden md:block">
        <div className="w-[400px] h-[600px] bg-gray-200 rounded-lg"></div>
      </div>
      {/* Mobile Skeleton */}
      <div className="block md:hidden">
        <div className="w-[280px] h-[420px] bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  </div>
);

const SideProductsSkeleton = () => (
  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 space-y-4 z-20">
    {/* Up Arrow Skeleton */}
    <div className="mx-7 w-6 h-6 bg-gray-200 rounded animate-pulse"></div>

    {/* Product Options Skeleton */}
    {Array.from({ length: 4 }).map((_, index) => (
      <div key={index} className="p-2 border bg-gray-100 border-gray-300 animate-pulse">
        <div className="w-[60px] h-[80px] bg-gray-200 rounded"></div>
      </div>
    ))}

    {/* Down Arrow Skeleton */}
    <div className="mx-7 w-6 h-6 bg-gray-200 rounded animate-pulse"></div>
  </div>
);

const LandingPage = ({ collectionHandle = 'featured-products', maxProducts = 4 }: LandingPageProps) => {
  const [selectedProduct, setSelectedProduct] = useState<number>(0);
  const [products, setProducts] = useState<PartialDeep<Product, { recurseIntoArrays: true }>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Trigger animations after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Fetch products from collection
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const { products: fetchedProducts } = await getCollectionWithProducts(collectionHandle, {
          first: maxProducts,
          sortKey: 'COLLECTION_DEFAULT',
        });

        // Filter products that have images and are available
        const validProducts = fetchedProducts
          .filter(
            (product: PartialDeep<Product, { recurseIntoArrays: true }>) =>
              product.images?.nodes?.length && product.images.nodes.length > 0 && product.availableForSale
          )
          .slice(0, maxProducts);

        setProducts(validProducts);

        // Set default selected product to the first one
        if (validProducts.length > 0) {
          setSelectedProduct(0);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [collectionHandle, maxProducts]);

  // Reset image loaded state when product changes
  useEffect(() => {
    setImageLoaded(false);
  }, [selectedProduct]);

  // Get product image with fallback
  const getProductImage = (product: PartialDeep<Product, { recurseIntoArrays: true }>, imageIndex: number = 0) => {
    const image = product.images?.nodes?.[imageIndex];
    return image
      ? {
          src: image.url || '',
          alt: image.altText || product.title || 'Product image',
          width: image.width || 400,
          height: image.height || 600,
        }
      : null;
  };

  // Format price
  const formatPrice = (amount: string, currencyCode: string) => {
    const price = parseFloat(amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
    }).format(price);
  };

  const handleArrowClick = (direction: 'up' | 'down') => {
    if (products.length === 0) return;

    let newIndex;
    if (direction === 'up') {
      newIndex = selectedProduct > 0 ? selectedProduct - 1 : products.length - 1;
    } else {
      newIndex = selectedProduct < products.length - 1 ? selectedProduct + 1 : 0;
    }
    setSelectedProduct(newIndex);
  };

  const handleProductSelect = (productIndex: number) => {
    setSelectedProduct(productIndex);
  };

  const selectedProductData = products[selectedProduct];

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-8xl mx-auto">
          {/* Left Content */}
          <div
            className={`space-y-8 transition-all duration-1000 ease-out ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'
            }`}
          >
            <div>
              {/* Dynamic Product Title */}
              <h1
                className={`text-5xl lg:text-7xl font-bungee font-black text-gray-900 leading-tight transition-all duration-1200 ease-out delay-200 ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'
                }`}
              >
                {!loading && selectedProductData ? (
                  <>
                    CHERRIES FRESH
                    <br />
                    COLLECTION
                    <hr className="border-gray-200 border-2 mt-1" />
                    <span className="text-xl lg:text-2xl font-roboto font-normal ">
                      {selectedProductData.title?.split(' ').slice(0, 2).join(' ').toUpperCase()}{' '}
                      {selectedProductData.title?.split(' ').slice(2).join(' ').toUpperCase() || 'COLLECTION'}
                    </span>
                  </>
                ) : (
                  <>
                    CHERRIES FRESH
                    <br />
                    COLLECTION
                  </>
                )}
              </h1>

              {/* Dynamic Product Price and Discount Info */}
              {!loading && selectedProductData ? (
                <div
                  className={`mt-1 max-w-xl transition-all duration-1000 ease-out delay-400 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
                  }`}
                >
                  {/* Price Display */}
                  <div className="mb-2">
                    {selectedProductData.priceRange?.minVariantPrice?.amount && (
                      <div className="flex items-center gap-3">
                        <span className="text-3xl lg:text-4xl font-bold text-gray-900">
                          {formatPrice(
                            selectedProductData.priceRange.minVariantPrice.amount,
                            selectedProductData.priceRange.minVariantPrice.currencyCode || 'USD'
                          )}
                        </span>

                        {/* Show compare at price if there's a discount */}
                        {selectedProductData.compareAtPriceRange?.minVariantPrice?.amount &&
                          selectedProductData.compareAtPriceRange?.minVariantPrice?.amount !== '0.0' && (
                            <span className="text-xl text-gray-500 line-through">
                              {formatPrice(
                                selectedProductData.compareAtPriceRange.minVariantPrice.amount,
                                selectedProductData.compareAtPriceRange.minVariantPrice.currencyCode || 'USD'
                              )}
                            </span>
                          )}
                      </div>
                    )}
                  </div>

                  {/* Product short description if available */}
                  <p className="text-base text-gray-600 line-clamp-2">Free shipping on orders over $50</p>
                </div>
              ) : (
                <p
                  className={`text-lg text-gray-700 mt-6 max-w-xl transition-all duration-1000 ease-out delay-400 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
                  }`}
                >
                  Cherries Was Born From The Desire To Reinvent Tech <br /> Not As Purely Functional
                </p>
              )}

              {/* Product-specific CTA when product is selected */}
              {!loading && selectedProductData && (
                <div
                  className={`mt-4 transition-all duration-1000 ease-out delay-600 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
                  }`}
                >
                  <Link href={`/products/${selectedProductData.handle}`}>
                    <Button showArrow className="mr-4 transition-all duration-300 hover:shadow-lg">
                      View Product
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right Content - Product Display */}
          <div className="relative flex justify-start md:justify-center items-center">
            {/* Loading State */}
            {loading && (
              <>
                <MainProductSkeleton />
                <SideProductsSkeleton />
              </>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-center">
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Products Display */}
            {!loading && !error && products.length > 0 && (
              <>
                {/* Main Product */}
                <div
                  className={`relative z-10 transition-all duration-1200 ease-out delay-600 ${
                    isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  }`}
                >
                  {selectedProductData && getProductImage(selectedProductData) && (
                    <div
                      key={selectedProduct}
                      className={`transition-all duration-500 ease-out ${
                        imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                      }`}
                    >
                      {/* Desktop Image */}
                      <div className="hidden md:block">
                        <Image
                          src={getProductImage(selectedProductData)!.src}
                          alt={getProductImage(selectedProductData)!.alt}
                          width={400}
                          height={600}
                          className="drop-shadow-2xl object-cover rounded-lg transition-transform duration-300 "
                          priority={selectedProduct === 0}
                          onLoad={() => setImageLoaded(true)}
                          onError={(e) => {
                            console.error('Image failed to load:', getProductImage(selectedProductData)!.src);
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>

                      {/* Mobile Image */}
                      <div className="block md:hidden">
                        <Image
                          src={getProductImage(selectedProductData)!.src}
                          alt={getProductImage(selectedProductData)!.alt}
                          width={280}
                          height={420}
                          className="drop-shadow-2xl object-cover rounded-lg transition-transform duration-300 hover:scale-105"
                          priority={selectedProduct === 0}
                          onLoad={() => setImageLoaded(true)}
                          onError={(e) => {
                            console.error('Image failed to load:', getProductImage(selectedProductData)!.src);
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Fallback if no image */}
                  {selectedProductData && !getProductImage(selectedProductData) && (
                    <div className="flex items-center justify-center bg-gray-200 rounded-lg">
                      <div className="hidden md:block w-[400px] h-[600px] flex items-center justify-center">
                        <p className="text-gray-500">No image available</p>
                      </div>
                      <div className="block md:hidden w-[280px] h-[420px] flex items-center justify-center">
                        <p className="text-gray-500">No image available</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Side Product Options */}
                <div
                  className={`absolute right-0 top-1/2 transform -translate-y-1/2 space-y-4 z-20 transition-all duration-1000 ease-out delay-1000 ${
                    isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
                  }`}
                >
                  {/* Up Arrow */}
                  <button
                    className="mx-7 transition-all duration-200 hover:scale-110 hover:-translate-y-1 active:scale-90"
                    onClick={() => handleArrowClick('up')}
                  >
                    <ArrowUp />
                  </button>

                  {/* Product Options */}
                  {products.map((product, index) => {
                    const image = getProductImage(product);
                    return (
                      <div
                        key={product.id}
                        className={`p-2 border cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-x-2 active:scale-95 ${
                          selectedProduct === index
                            ? 'bg-gray-200 border-gray-600 shadow-md'
                            : 'bg-[#F9F9F9] border-gray-400 hover:bg-gray-100 hover:border-gray-500'
                        }`}
                        onClick={() => handleProductSelect(index)}
                        style={{
                          animationDelay: `${1200 + index * 100}ms`,
                          animation: isVisible ? 'slideInRight 0.6s ease-out forwards' : 'none',
                        }}
                      >
                        {image ? (
                          <Image
                            src={image.src}
                            alt={image.alt}
                            width={60}
                            height={80}
                            className="rounded object-cover transition-transform duration-200 hover:scale-110"
                            loading="lazy"
                            onError={(e) => {
                              // Replace with placeholder if image fails
                              (e.target as HTMLImageElement).src =
                                'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA2MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAzNkgyNFYzMkgyOFYzNkgzMlY0MEgyOFY0NEgyNFY0MEgyMFYzNloiIGZpbGw9IiM5Q0EzQUYiLz4KPC9zdmc+';
                            }}
                          />
                        ) : (
                          <div className="w-[60px] h-[80px] bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-xs text-gray-500">No image</span>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Down Arrow */}
                  <button
                    className="rotate-180 mx-7 transition-all duration-200 hover:scale-110 hover:translate-y-1 active:scale-90"
                    onClick={() => handleArrowClick('down')}
                  >
                    <ArrowUp />
                  </button>
                </div>
              </>
            )}

            {/* No Products State */}
            {!loading && !error && products.length === 0 && (
              <div className="text-center">
                <p className="text-gray-600">No products available in this collection.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add keyframe animations */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;

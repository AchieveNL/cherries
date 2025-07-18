/* eslint-disable @typescript-eslint/no-unused-vars */
import { useScroll } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { getProducts } from '@/lib/shopify'; // Adjust the import path as needed
import BitBackground from '../animation/BitBackground';
import { Button } from '../ui';

interface Product {
  id: string;
  title: string;
  image: string;
  alt: string;
  handle: string;
}

// Skeleton component for loading state
const ProductSkeleton = () => (
  <div className="group cursor-pointer">
    <div className="relative overflow-hidden mb-4 w-full h-[437px] bg-gray-200 animate-pulse rounded-lg">
      {/* Image skeleton */}
    </div>
    <div className="h-8 bg-gray-200 animate-pulse rounded mx-auto w-3/4"></div>
  </div>
);

const LatestProducts = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        setLoading(true);
        const response = await getProducts({
          first: 3, // Get 3 latest products
          sortKey: 'CREATED_AT',
          reverse: true, // Most recent first
        });

        // Transform the data to match your component structure
        const transformedProducts: Product[] = response.products.slice(0, 3).map((product, index) => ({
          id: product.id || `product-${index}`,
          title: product.title || product.title?.split(' ')[0]?.toUpperCase() || `PRODUCT ${index + 1}`,
          image: product.featuredImage?.url || product.images?.nodes?.[0]?.url || '/placeholder-image.jpg',
          alt:
            product.featuredImage?.altText || product.images?.nodes?.[0]?.altText || product.title || 'Product image',
          handle: product.handle || `product-${index}`,
        }));

        setProducts(transformedProducts);
      } catch (err: any) {
        console.error('Error fetching latest products:', err);
        setError(err.message);
        // Fallback to static data if API fails
        const fallbackProducts: Product[] = [
          {
            id: '1',
            title: 'PHONE CASE',
            image: '/landingPage/new/new-1.webp',
            alt: 'Fashion model with phone case',
            handle: 'phone-case',
          },
          {
            id: '2',
            title: 'AIRPOD',
            image: '/landingPage/new/new-2.webp',
            alt: 'Fashion model with airpods',
            handle: 'airpod',
          },
          {
            id: '3',
            title: 'SMARTWATCH',
            image: '/landingPage/new/new-3.webp',
            alt: 'Fashion model with smartwatch',
            handle: 'smartwatch',
          },
        ];
        setProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestProducts();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen py-12 overflow-hidden">
      <div className="container mx-auto px-8 relative z-10 mb-60">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h2
            className={`text-6xl lg:text-[74px] font-black text-gray-900 transition-all duration-1000 ${
              isVisible ? 'opacity-100 transform translate-x-0' : 'opacity-0 transform -translate-x-20'
            }`}
          >
            LATEST PRODUCTS
          </h2>
        </div>

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-8">
            <p className="text-primary text-lg">Failed to load products. Showing fallback content.</p>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {loading
            ? // Skeleton Loading State
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className={`transition-all duration-700 ${
                    isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-16'
                  }`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                >
                  <ProductSkeleton />
                </div>
              ))
            : // Loaded Products
              products.map((product, index) => (
                <Link
                  key={product.id}
                  href={`/products/${product.handle}`}
                  className={`group cursor-pointer transition-all duration-700 hover:-translate-y-2 block ${
                    isVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-16'
                  }`}
                  style={{ transitionDelay: `${index * 300}ms` }}
                >
                  {/* Fixed container with consistent dimensions */}
                  <div className="relative overflow-hidden mb-4 w-full h-[460px]">
                    <Image
                      src={product.image}
                      alt={product.alt}
                      fill
                      className="object-cover transition-transform duration-500 "
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      priority={index === 0} // Prioritize first image
                      onError={(e) => {
                        // Fallback image on error
                        e.currentTarget.src = '/placeholder-image.jpg';
                      }}
                    />

                    {/* Overlay for better interaction feedback */}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 " />

                    {/* Optional: Add a subtle "View Product" indicator */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button>View Product</Button>
                    </div>
                  </div>
                  <h3 className="text-[21px] font-bold text-center text-gray-900 group-hover:text-primary transition-colors duration-300">
                    {product.title}
                  </h3>
                </Link>
              ))}
        </div>

        {/* Loading State Text */}
        {loading && (
          <div className={`text-center py-4 transition-opacity duration-500 ${loading ? 'opacity-100' : 'opacity-0'}`}>
            <p className="text-gray-600 text-lg">Loading latest products...</p>
          </div>
        )}
      </div>

      {/* Hero frame image */}
      <div className="absolute bottom-0 left-0 w-full z-0">
        <BitBackground scrollYProgress={scrollYProgress} />
      </div>
    </section>
  );
};

export default LatestProducts;

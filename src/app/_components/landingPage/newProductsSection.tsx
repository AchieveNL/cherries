/* eslint-disable @typescript-eslint/no-unused-vars */
import { useScroll } from 'framer-motion';
import Lottie from 'lottie-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import pixel from '../../../../public/animation/pixel.json';
import BitBackground from '../animation/BitBackground';
import { Button } from '../ui';

interface Product {
  id: string;
  title: string;
  image: string;
  alt: string;
  handle: string;
}

interface ApiResponse {
  success: boolean;
  products: Product[];
  error?: string;
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
function useInView(threshold = 0.1) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold,
        rootMargin: '0px 0px -100px 0px', // Trigger when element is 100px from bottom of viewport
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
}

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
          setIsVisible(entry.isIntersecting);
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const lottieRef1 = useRef<any>(null);
  const lottieRef2 = useRef<any>(null);

  // Handle Lottie animation based on visibility
  useEffect(() => {
    if (lottieRef1.current) {
      if (isVisible) {
        console.log('Element is in view, playing animation');
        lottieRef1.current.play();
      } else {
        console.log('Element is out of view, stopping animation');
        lottieRef1.current.stop();
      }
    }

    if (lottieRef2.current) {
      if (isVisible) {
        console.log('Element is in view, playing animation');
        lottieRef2.current.play();
      } else {
        console.log('Element is out of view, stopping animation');
        lottieRef2.current.stop();
      }
    }
  }, [isVisible]);

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/products/latest?limit=3');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ApiResponse = await response.json();

        if (data.success) {
          setProducts(data.products);
        } else {
          // API returned fallback data due to an error
          setError(data.error || 'Failed to fetch products');
          setProducts(data.products); // Still use the fallback products
        }
      } catch (err: any) {
        console.error('Error fetching latest products:', err);
        setError(err.message);

        // Client-side fallback as last resort
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
      <div className="container mx-auto px-8 relative z-10 mb-16">
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
            <p className="text-primary text-lg">
              {products.length > 0
                ? 'Using cached content due to API issues.'
                : 'Failed to load products. Please try again later.'}
            </p>
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
      <div className="relative w-full overflow-hidden">
        <div className="w-full">
          <Lottie
            lottieRef={lottieRef1}
            animationData={pixel}
            loop={false}
            autoplay={false} // Set to false, we'll control it manually
            className="w-[1000px] md:w-auto  h-auto" // Ensure responsive sizing
          />
        </div>
        <div className="w-full  rotate-180 -mt-px">
          <Lottie
            lottieRef={lottieRef2}
            animationData={pixel}
            loop={false}
            autoplay={false} // Set to false, we'll control it manually
            className="w-[1000px] md:w-auto  h-auto" // Ensure responsive sizing
          />
        </div>
      </div>
    </section>
  );
};

export default LatestProducts;

/* eslint-disable @typescript-eslint/no-unused-vars */
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { getCollections } from '@/lib/shopify'; // Adjust the import path as needed
import { Button } from '../ui';

// Skeleton component for loading categories
const CategorySkeleton = () => (
  <div className="h-8 md:h-16 bg-gray-200 animate-pulse  mx-auto w-48 md:w-64 mb-2 md:mb-4"></div>
);

// Image skeleton component
const ImageSkeleton = ({ className, width, height }: { className: string; width: string; height: string }) => (
  <div className={className} style={{ width, height }}>
    <div className="w-full h-full bg-gray-200 animate-pulse rounded-lg shadow-lg"></div>
  </div>
);

interface Category {
  id: string;
  title: string;
  handle: string;
}

const CategoriesSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLDivElement>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState({
    section: false,
    title: false,
    categories: false,
    button: false,
    images: false,
  });

  const images = [
    {
      id: 1,
      src: '/landingPage/categories/img-1.webp',
      alt: 'Model 1',
      className: 'absolute top-[10vh] left-[5%] md:top-[15vh] md:left-[8%] z-[1]',
      width: 298,
      height: 307,
      mobileWidth: 150,
      mobileHeight: 154,
    },
    {
      id: 2,
      src: '/landingPage/categories/img-2.webp',
      alt: 'Model 2',
      className: 'absolute top-[20vh] right-[5%] md:top-[5vh] md:right-[8%] z-[1]',
      width: 314,
      height: 406,
      mobileWidth: 160,
      mobileHeight: 206,
    },
    {
      id: 3,
      src: '/landingPage/categories/img-3.webp',
      alt: 'Model 3',
      className: 'absolute bottom-[25vh] left-[8%]  md:bottom-[3vh] md:left-[15%] z-[1]',
      width: 279,
      height: 313,
      mobileWidth: 140,
      mobileHeight: 157,
    },
    {
      id: 4,
      src: '/landingPage/categories/img-4.webp',
      alt: 'Model 4',
      className: 'absolute bottom-[10vh] right-[8%]  md:bottom-[0vh] md:right-[12%] z-[1]',
      width: 285,
      height: 388,
      mobileWidth: 145,
      mobileHeight: 196,
    },
  ];

  // Intersection Observer setup
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observers = new Map();

    const createObserver = (ref: React.RefObject<HTMLElement>, key: string, delay = 0) => {
      if (!ref.current) return;

      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible((prev) => ({ ...prev, [key]: true }));
          }, delay);
        }
      }, observerOptions);

      observer.observe(ref.current);
      observers.set(key, observer);
    };

    // Create observers with staggered delays
    createObserver(sectionRef, 'section', 0);
    createObserver(titleRef, 'title', 200);
    createObserver(categoriesRef, 'categories', 400);
    createObserver(buttonRef, 'button', 600);
    createObserver(imagesRef, 'images', 300);

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await getCollections({
          first: 6, // Get first 6 collections
          sortKey: 'TITLE',
          reverse: false,
        });

        // Transform collections to categories
        const transformedCategories: Category[] = response.collections.slice(0, 6).map((collection) => ({
          id: collection.id || '',
          title: collection.title?.toUpperCase() || 'CATEGORY',
          handle: collection.handle || '',
        }));

        setCategories(transformedCategories);
      } catch (err: any) {
        console.error('Error fetching categories:', err);
        setError(err.message);

        // Fallback to static categories
        const fallbackCategories: Category[] = [
          { id: '1', title: 'PHONE CHARGER', handle: 'phone-charger' },
          { id: '2', title: 'SMARTWATCH', handle: 'smartwatch' },
          { id: '3', title: 'PHONE CASE', handle: 'phone-case' },
          { id: '4', title: 'POWER BANK', handle: 'power-bank' },
          { id: '5', title: 'FLASH DRIVE', handle: 'flash-drive' },
          { id: '6', title: 'CORDS', handle: 'cords' },
        ];
        setCategories(fallbackCategories);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(selectedImageIndex === index ? null : index);
  };

  return (
    <section ref={sectionRef} className="md:min-h-screen relative overflow-hidden py-8">
      {/* Fixed Background Images - Desktop only */}
      <div className="hidden sm:block">
        {loading
          ? // Image skeletons with fixed positioning
            images.map((image, index) => (
              <ImageSkeleton
                key={`img-skeleton-${image.id}`}
                className={image.className}
                width={`clamp(${image.mobileWidth}px, 8vw + ${image.mobileWidth}px, ${image.width}px)`}
                height={`clamp(${image.mobileHeight}px, 8vw + ${image.mobileHeight}px, ${image.height}px)`}
              />
            ))
          : // Fixed positioned images
            images.map((image, index) => (
              <div
                key={image.id}
                className={`${image.className} transition-all duration-700 ease-out`}
                style={{
                  width: `clamp(${image.mobileWidth}px, 8vw + ${image.mobileWidth}px, ${image.width}px)`,
                  height: `clamp(${image.mobileHeight}px, 8vw + ${image.mobileHeight}px, ${image.height}px)`,
                  transitionDelay: `${index * 200}ms`,
                }}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover shadow-lg transition-transform duration-300"
                  sizes="(max-width: 768px) 160px, (max-width: 1200px) 250px, 300px"
                />
              </div>
            ))}
      </div>

      <div className="container mx-auto px-4 md:px-8">
        <div className="relative max-w-8xl mx-auto">
          {/* Center Content */}
          <div className="text-center relative z-10">
            {/* Mobile Stacked Images - In content flow */}
            <div className="sm:hidden flex flex-col items-center justify-center py-12">
              {/* Mobile Images Stack */}
              <div className="relative mb-8 flex items-center justify-center">
                <div className="relative flex items-center justify-center">
                  {/* Stack of images - Centered container */}
                  <div className="relative w-64 h-64 flex items-center justify-center">
                    {images.map((image, index) => (
                      <div
                        key={`mobile-stack-${image.id}`}
                        className={`absolute w-64 h-64  cursor-pointer transition-all duration-500 ease-out ${
                          selectedImageIndex === index ? 'z-30 scale-110 shadow-2xl' : 'hover:scale-105'
                        } ${
                          isVisible.section
                            ? 'opacity-100 transform translate-y-0'
                            : 'opacity-0 transform translate-y-4'
                        }`}
                        style={{
                          transform:
                            selectedImageIndex === index
                              ? `translate(-50%, -50%) translateY(-${index * 8}px) scale(1.1)`
                              : selectedImageIndex !== null && selectedImageIndex !== index
                                ? `translate(-50%, -50%) translateY(-${index * 12}px) scale(0.95)`
                                : `translate(-50%, -50%) translateY(-${index * 24}px)`,
                          zIndex: selectedImageIndex === index ? 30 : 20 - index,
                          transitionDelay: `${index * 100}ms`,
                          left: '50%',
                          top: '50%',
                        }}
                        onClick={() => handleImageClick(index)}
                      >
                        {loading ? (
                          <div className="w-full h-full bg-gray-200 animate-pulse "></div>
                        ) : (
                          <Image
                            src={image.src}
                            alt={image.alt}
                            width={192}
                            height={192}
                            className="object-cover w-full h-full "
                            unoptimized
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop spacing */}
            <div className="hidden sm:block md:py-32 py-72"></div>

            {/* Title */}
            <div
              ref={titleRef}
              className={`transition-all duration-1000 ease-out ${
                isVisible.title ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-8'
              }`}
            >
              <p className="text-sm md:text-[34px] text-text mb-4 md:mb-6">Explore Our Categories</p>
            </div>

            {/* Categories */}
            <div
              ref={categoriesRef}
              className={`space-y-2 md:space-y-8 mb-6 md:mb-8 transition-all duration-1000 ease-out ${
                isVisible.categories ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-12'
              }`}
            >
              {loading
                ? // Skeleton loading state
                  Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={`skeleton-${index}`}
                      className="transition-all duration-500"
                      style={{ transitionDelay: `${index * 100}ms` }}
                    >
                      <CategorySkeleton />
                    </div>
                  ))
                : // Loaded categories
                  categories.map((category, index) => (
                    <Link key={category.id} href={`/collections/${category.handle}`} className="block">
                      <h2
                        className={`text-xl sm:text-2xl md:text-4xl lg:text-[56px] text-text font-medium leading-tight cursor-pointer transition-all duration-500 hover:text-primary  ${
                          isVisible.categories
                            ? 'opacity-100 transform translate-x-0'
                            : 'opacity-0 transform translate-x-4'
                        }`}
                        style={{ transitionDelay: `${index * 150}ms` }}
                      >
                        {category.title}
                      </h2>
                    </Link>
                  ))}
            </div>

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-4 mb-4">
                <p className="text-orange-600 text-sm">Failed to load categories. Showing default content.</p>
              </div>
            )}

            {/* Button */}
            <div
              ref={buttonRef}
              className={`transition-all duration-1000 ease-out ${
                isVisible.button
                  ? 'opacity-100 transform translate-y-0 scale-100'
                  : 'opacity-0 transform translate-y-8 scale-95'
              }`}
            >
              <Link href="/products" className="inline-block">
                <Button
                  showArrow
                  className="px-6 py-3 md:px-8 md:py-3 font-medium mx-auto transition-all duration-300  hover:shadow-lg"
                >
                  Shop Now
                </Button>
              </Link>
            </div>

            {/* Loading indicator */}
            {loading && (
              <div className="text-center py-4">
                <p className="text-gray-600 text-sm">Loading categories...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;

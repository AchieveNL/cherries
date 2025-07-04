/* eslint-disable @typescript-eslint/no-unused-vars */
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '../ui';

const CategoriesSection = () => {
  const categories = ['PHONE CHARGER', 'SMARTWATCH', 'PHONE CASE', 'POWER BANK', 'FLASH DRIVE', 'CORDS'];

  const images = [
    {
      id: 1,
      src: '/landingPage/categories/img-1.webp',
      alt: 'Model 1',
      className: 'absolute top-16 left-4 md:top-24 md:left-12',
      width: 298,
      height: 307,
      mobileWidth: 150,
      mobileHeight: 154,
    },
    {
      id: 2,
      src: '/landingPage/categories/img-2.webp',
      alt: 'Model 2',
      className: 'absolute top-32 right-4 md:top-52 md:right-12',
      width: 314,
      height: 406,
      mobileWidth: 160,
      mobileHeight: 206,
    },
    {
      id: 3,
      src: '/landingPage/categories/img-3.webp',
      alt: 'Model 3',
      className: 'absolute bottom-40 left-6 md:bottom-40 md:left-40',
      width: 279,
      height: 313,
      mobileWidth: 140,
      mobileHeight: 157,
    },
    {
      id: 4,
      src: '/landingPage/categories/img-4.webp',
      alt: 'Model 4',
      className: 'absolute bottom-8 right-8 md:bottom-0 md:right-32',
      width: 285,
      height: 388,
      mobileWidth: 145,
      mobileHeight: 196,
    },
  ];

  return (
    <section className="min-h-screen relative overflow-hidden py-8">
      <div className="container mx-auto px-4 md:px-8">
        <div className="relative max-w-8xl mx-auto">
          {/* Center Content */}
          <div className="text-center py-32 md:py-72 relative z-10">
            <p className="text-sm md:text-[34px] text-text mb-4 md:mb-6">Explore Our Categories</p>

            <div className="space-y-2 md:space-y-4 mb-6 md:mb-8">
              {categories.map((category) => (
                <h2
                  key={category}
                  className="text-xl sm:text-2xl md:text-4xl lg:text-[56px]  text-text font-medium leading-tight cursor-pointer transition-colors duration-300"
                >
                  {category}
                </h2>
              ))}
            </div>

            <Link href="/products" className="inline-block">
              <Button
                showArrow
                className="px-6 py-3 md:px-8 md:py-3 font-medium mx-auto transition-all duration-300 hover:scale-105"
              >
                Shop Now
              </Button>
            </Link>
          </div>

          {/* Floating Images - Hidden on very small screens, scaled on mobile */}
          <div className="hidden sm:block">
            {images.map((image) => (
              <div
                key={image.id}
                className={image.className}
                style={{
                  width: `clamp(${image.mobileWidth}px, 8vw + ${image.mobileWidth}px, ${image.width}px)`,
                  height: `clamp(${image.mobileHeight}px, 8vw + ${image.mobileHeight}px, ${image.height}px)`,
                }}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover  shadow-lg hover:scale-110 transition-transform duration-300"
                  sizes="(max-width: 768px) 160px, (max-width: 1200px) 250px, 300px"
                />
              </div>
            ))}
          </div>

          {/* Mobile-only simplified images grid */}
          <div className="sm:hidden absolute inset-0 z-0 opacity-30">
            <div className="grid grid-cols-2 gap-4 p-4 h-full">
              {images.slice(0, 4).map((image, index) => (
                <div
                  key={`mobile-${image.id}`}
                  className={`relative  overflow-hidden ${
                    index === 0 ? 'mt-8' : index === 1 ? 'mt-16' : index === 2 ? 'mb-8' : 'mb-16'
                  }`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={120}
                    height={120}
                    className="object-cover w-full h-full"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;

/* eslint-disable @typescript-eslint/no-unused-vars */
import { motion } from 'framer-motion';
import Image from 'next/image';

import { Button } from '../ui';

const CategoriesSection = () => {
  const categories = ['PHONE CHARGER', 'SMARTWATCH', 'PHONE CASE', 'POWER BANK', 'FLASH DRIVE', 'CORDS'];

  const images = [
    {
      id: 1,
      src: '/landingPage/categories/img-1.png',
      alt: 'Model 1',
      className: 'absolute top-24 left-12',
      width: 298,
      height: 307,
    },
    {
      id: 2,
      src: '/landingPage/categories/img-2.png',
      alt: 'Model 2',
      className: 'absolute top-52 right-12',
      width: 314,
      height: 406,
    },
    {
      id: 3,
      src: '/landingPage/categories/img-3.png',
      alt: 'Model 3',
      className: 'absolute bottom-72 left-24',
      width: 279,
      height: 313,
    },
    {
      id: 4,
      src: '/landingPage/categories/img-4.png',
      alt: 'Model 4',
      className: 'absolute bottom-12 right-52',
      width: 285,
      height: 388,
    },
  ];

  return (
    <section className="min-h-screen  relative overflow-hidden">
      <div className="container mx-auto px-8">
        <div className="relative max-w-8xl mx-auto">
          {/* Center Content */}
          <div className="text-center py-72 relative z-10">
            <motion.p
              className="text-lg text-gray-600 mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Explore Our Categories
            </motion.p>
            <div className="space-y-4 mb-8">
              {categories.map((category, index) => (
                <h2
                  key={category}
                  className="text-4xl md:text-[56px] font-black text-gray-900 leading-tight cursor-pointer transition-colors duration-300"
                >
                  {category}
                </h2>
              ))}
            </div>
            <Button showArrow className=" px-8 py-3 font-medium mx-auto transition-colors duration-300">
              Shop Now
            </Button>
          </div>

          {/* Floating Images */}
          {images.map((image, _index) => (
            <div
              key={image.id}
              className={image.className}
              style={{
                width: image.width,
                height: image.height,
              }}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                unoptimized
                height={image.height}
                className="object-cover  w-full h-full"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;

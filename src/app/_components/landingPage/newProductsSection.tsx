/* eslint-disable @typescript-eslint/no-unused-vars */
import { motion } from 'framer-motion';
import Image from 'next/image';

import { ArrowNew } from '../icons/landingPage/ArrowNew';

const NewestProduct = () => {
  const products = [
    {
      id: 1,
      title: 'PHONE CASE',
      image: '/landingPage/new/new-1.png',
      alt: 'Fashion model with phone case',
    },
    {
      id: 2,
      title: 'AIRPOD',
      image: '/landingPage/new/new-2.png',
      alt: 'Fashion model with airpods',
    },
    {
      id: 3,
      title: 'SMARTWATCH',
      image: '/landingPage/new/new-3.png',
      alt: 'Fashion model with smartwatch',
    },
  ];

  return (
    <section className="relative min-h-screen py-12 overflow-hidden">
      <div className="container mx-auto px-8 relative z-10">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-6xl lg:text-[74px] font-black text-gray-900">NEWEST PRODUCT</h2>
          <motion.div
            className="text-4xl cursor-pointer"
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <ArrowNew />
          </motion.div>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {products.map((product, index) => (
            <div key={product.id} className="group cursor-pointer">
              {/* Fixed container with consistent dimensions */}
              <div className="relative overflow-hidden mb-4 w-full h-[437px] bg-gray-100">
                <Image
                  src={product.image}
                  alt={product.alt}
                  unoptimized
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <h3 className="text-[32px] font-bold text-center text-gray-900">{product.title}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Hero frame image */}
      <div className="absolute bottom-0 left-0 w-full z-0">
        <Image
          src="/hero-frame-red.png"
          alt="Hero Frame"
          width={1578}
          height={492}
          className="w-full h-auto max-h-[120px] sm:max-h-[200px] lg:max-h-none object-cover object-top"
        />
      </div>
    </section>
  );
};

export default NewestProduct;

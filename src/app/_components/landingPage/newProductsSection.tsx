/* eslint-disable @typescript-eslint/no-unused-vars */
import { motion, useScroll } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

import BitBackground from '../animation/BitBackground';
import { ArrowNew } from '../icons/landingPage/ArrowNew';

const NewestProduct = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const products = [
    {
      id: 1,
      title: 'PHONE CASE',
      image: '/landingPage/new/new-1.webp',
      alt: 'Fashion model with phone case',
    },
    {
      id: 2,
      title: 'AIRPOD',
      image: '/landingPage/new/new-2.webp',
      alt: 'Fashion model with airpods',
    },
    {
      id: 3,
      title: 'SMARTWATCH',
      image: '/landingPage/new/new-3.webp',
      alt: 'Fashion model with smartwatch',
    },
  ];

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 80 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.2, ease: 'easeOut' },
  };

  const fadeInLeft = {
    initial: { opacity: 0, x: -80 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 1.8, ease: 'easeOut' },
  };

  const fadeInRight = {
    initial: { opacity: 0, x: 80 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 1.8, ease: 'easeOut' },
  };

  const scaleIn = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 1.6, ease: 'easeOut' },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const staggerItem = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.5, ease: 'easeOut' },
  };

  const productImageVariant = {
    initial: { opacity: 0, scale: 0.9, y: 40 },
    animate: { opacity: 1, scale: 1, y: 0 },
    transition: { duration: 1.4, ease: 'easeOut' },
  };

  const productTitleVariant = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.2, ease: 'easeOut', delay: 0.2 },
  };

  return (
    <section ref={containerRef} className="relative min-h-screen py-12 overflow-hidden">
      <div className="container mx-auto px-8 relative z-10 mb-60">
        {/* Header */}
        <motion.div
          className="flex justify-between items-center mb-12"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2 className="text-6xl lg:text-[74px] font-black text-gray-900" variants={fadeInLeft}>
            NEWEST PRODUCT
          </motion.h2>
          <motion.div
            className="text-4xl cursor-pointer"
            variants={fadeInRight}
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <ArrowNew />
          </motion.div>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-8 mb-16"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
        >
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              className="group cursor-pointer"
              variants={staggerItem}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Fixed container with consistent dimensions */}
              <motion.div
                className="relative overflow-hidden mb-4 w-full h-[437px] bg-gray-100"
                variants={productImageVariant}
              >
                <Image
                  src={product.image}
                  alt={product.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </motion.div>
              <motion.h3 className="text-[32px] font-bold text-center text-gray-900" variants={productTitleVariant}>
                {product.title}
              </motion.h3>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Hero frame image */}
      <div className="absolute bottom-0 left-0 w-full z-0">
        <BitBackground scrollYProgress={scrollYProgress} />
      </div>
    </section>
  );
};

export default NewestProduct;

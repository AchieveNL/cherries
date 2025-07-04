/* eslint-disable @typescript-eslint/no-unused-vars */
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { ArrowUp } from '../icons/landingPage/ArrowUp';
import { Button } from '../ui';

const LandingPage = () => {
  const [selectedPhone, setSelectedPhone] = useState(2); // Default to phone-1.png (id: 2)

  const phoneImages = [
    { id: 1, src: '/landingPage/collections/phone-3.webp', alt: 'Brown Phone Case' },
    { id: 4, src: '/landingPage/collections/phone-4.webp', alt: 'Brown Phone Case' },
    { id: 2, src: '/landingPage/collections/phone-1.webp', alt: 'Pink Phone Case' },
    { id: 3, src: '/landingPage/collections/phone-2.webp', alt: 'Brown Phone Case Alt' },
  ];

  const handleArrowClick = (direction: 'up' | 'down') => {
    const currentIndex = phoneImages.findIndex((phone) => phone.id === selectedPhone);
    let newIndex;

    if (direction === 'up') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : phoneImages.length - 1;
    } else {
      newIndex = currentIndex < phoneImages.length - 1 ? currentIndex + 1 : 0;
    }

    setSelectedPhone(phoneImages[newIndex].id);
  };

  const handlePhoneSelect = (phoneId: any) => {
    setSelectedPhone(phoneId);
  };

  const selectedPhoneData = phoneImages.find((phone) => phone.id === selectedPhone);

  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.2, ease: 'easeOut' },
  };

  const fadeInLeft = {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 1.8, ease: 'easeOut' },
  };

  const fadeInRight = {
    initial: { opacity: 0, x: 60 },
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
        staggerChildren: 0.2,
      },
    },
  };

  const staggerItem = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 1.5, ease: 'easeOut' },
  };

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-8xl mx-auto">
          {/* Left Content */}
          <motion.div
            className="space-y-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div>
              <motion.h1
                className="text-5xl lg:text-7xl font-bungee font-black text-gray-900 leading-tight"
                variants={fadeInLeft}
              >
                CHERRIES FRESH
                <br />
                COLLECTION
              </motion.h1>

              <motion.p className="text-lg text-gray-700 mt-6 max-w-xl" variants={fadeInUp} transition={{ delay: 0.4 }}>
                Cherries Was Born From The Desire To Reinvent Tech <br /> Not As Purely Functional
              </motion.p>

              <motion.div className="mt-8" variants={fadeInUp} transition={{ delay: 0.8 }}>
                <Link href="/products">
                  <Button showArrow className="">
                    Shop Now
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Content - Phone Display */}
          <motion.div
            className="relative flex justify-center items-center"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* Main Phone */}
            <motion.div className="relative z-10" variants={scaleIn} transition={{ delay: 0.6 }}>
              <motion.div
                key={selectedPhone} // This ensures animation triggers on phone change
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={selectedPhoneData?.src || '/landingPage/collections/phone-1.png'}
                  alt={selectedPhoneData?.alt || 'Cherry Pattern Phone Case'}
                  width={400}
                  height={600}
                  className="drop-shadow-2xl"
                />
              </motion.div>
            </motion.div>

            {/* Side Phone Options */}
            <motion.div
              className="absolute right-0 top-1/2 transform -translate-y-1/2 space-y-4 z-20"
              variants={staggerContainer}
              transition={{ delay: 1.0 }}
            >
              {/* Up Arrow */}
              <motion.button
                className="mx-7"
                onClick={() => handleArrowClick('up')}
                variants={staggerItem}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.9 }}
              >
                <ArrowUp />
              </motion.button>

              {/* Phone Options */}
              {phoneImages.map((phone, index) => (
                <motion.div
                  key={phone.id}
                  className={`p-2 border cursor-pointer ${
                    selectedPhone === phone.id ? 'bg-gray-200 border-gray-600' : 'bg-[#F9F9F9] border-gray-400'
                  }`}
                  variants={staggerItem}
                  whileHover={{ scale: 1.05, x: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePhoneSelect(phone.id)}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <Image src={phone.src} alt={phone.alt} width={60} height={80} className="rounded" />
                </motion.div>
              ))}

              {/* Down Arrow */}
              <motion.button
                className="rotate-180 mx-7 "
                onClick={() => handleArrowClick('down')}
                variants={staggerItem}
                whileHover={{ scale: 1.1, y: 2 }}
                whileTap={{ scale: 0.9 }}
              >
                <ArrowUp className="rotate-180 " />
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

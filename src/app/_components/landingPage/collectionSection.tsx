/* eslint-disable @typescript-eslint/no-unused-vars */
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

import { ArrowUp } from '../icons/landingPage/ArrowUp';
import { Button } from '../ui';

const LandingPage = () => {
  const [selectedPhone, setSelectedPhone] = useState(2); // Default to phone-1.png (id: 2)

  const phoneImages = [
    { id: 1, src: '/landingPage/collections/phone-2.png', alt: 'Brown Phone Case' },
    { id: 2, src: '/landingPage/collections/phone-1.png', alt: 'Pink Phone Case' },
    { id: 3, src: '/landingPage/collections/phone-2.png', alt: 'Brown Phone Case Alt' },
  ];

  const handlePhoneSelect = (phoneId: any) => {
    setSelectedPhone(phoneId);
  };

  const selectedPhoneData = phoneImages.find((phone) => phone.id === selectedPhone);

  return (
    <div className="min-h-screen ">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-8xl mx-auto">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl lg:text-7xl font-bungee font-black text-gray-900 leading-tight">
                CHERRIES FRESH
                <br />
                COLLECTION
              </h1>
              <p className="text-lg text-gray-700 mt-6 max-w-xl">
                Cherries Was Born From The Desire To Reinvent Tech <br /> Not As Purely Functional
              </p>
              <div className="mt-8">
                <Button showArrow className="">
                  Shop Now
                </Button>
              </div>
            </div>
          </div>
          {/* Right Content - Phone Display */}
          <div className="relative flex justify-center items-center">
            {/* Main Phone */}
            <div className="relative z-10">
              <Image
                src={selectedPhoneData?.src || '/landingPage/collections/phone-1.png'}
                alt={selectedPhoneData?.alt || 'Cherry Pattern Phone Case'}
                width={400}
                height={600}
                className="drop-shadow-2xl"
              />
            </div>
            {/* Side Phone Options */}
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 space-y-4 z-20">
              {/* Up Arrow */}
              <button className="mx-7">
                <ArrowUp />
              </button>
              {/* Phone Options */}
              {phoneImages.map((phone, index) => (
                <motion.div
                  key={phone.id}
                  className={`p-2 border cursor-pointer ${
                    selectedPhone === phone.id ? 'bg-gray-200 border-gray-600' : 'bg-[#F9F9F9] border-gray-400'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePhoneSelect(phone.id)}
                >
                  <Image src={phone.src} alt={phone.alt} width={60} height={80} className="rounded" />
                </motion.div>
              ))}
              {/* Down Arrow */}
              <button className="rotate-180 mx-7">
                <ArrowUp />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

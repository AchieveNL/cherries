import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '../ui';

const WhyUsSection = () => {
  const [activeTab, setActiveTab] = useState('OUR STORY');

  const tabs = [
    {
      id: 'OUR STORY',
      label: 'OUR STORY',
      content: {
        text1:
          'Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua. Ut Enim Ad Minim Veniam, Quis Nostrud Exercitation Ullamco Laboris Nisi Ut Aliquip Ex Ea Commodo Consequat. Duis Aute Irure Dolor In Reprehenderit.',
        text2:
          'Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et Dolore Magna Aliqua. Ut Enim Ad Minim Veniam, Quis Nostrud Exercitation Ullamco Laboris Nisi Ut Aliquip Ex Ea Commodo Consequat. Duis Aute Irure Dolor In Reprehenderit.',
      },
    },
    {
      id: 'MISSION',
      label: 'MISSION',
      content: {
        text1:
          'Our mission is to provide exceptional quality products that inspire confidence and style. We believe in creating meaningful connections with our customers through authentic experiences.',
        text2:
          'We are committed to sustainable practices and ethical sourcing, ensuring that every product we offer meets the highest standards of quality and responsibility.',
      },
    },
    {
      id: 'VISION',
      label: 'VISION',
      content: {
        text1:
          'We envision a world where fashion is accessible, sustainable, and empowering for everyone. Our vision drives us to continuously innovate and lead in our industry.',
        text2:
          'Through our dedication to excellence and customer satisfaction, we aim to become the premier destination for quality fashion and lifestyle products.',
      },
    },
  ];

  const currentContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div className="bg-white py-16 lg:py-24">
      <div className="max-w-8xl container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            {/* Title */}
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">WHY US</h2>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    activeTab === tab.id ? 'bg-primary text-white' : 'bg-red-200 text-primary hover:bg-red-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="space-y-6">
              <p className="text-text text-base font-medium leading-relaxed">{currentContent?.text1}</p>

              <p className="text-text text-base font-medium leading-relaxed">{currentContent?.text2}</p>
            </div>

            {/* Shop Now Button */}
            <div className="pt-4">
              <Link href="/products">
                <Button className="text-white px-6 py-3" showArrow>
                  Shop Now
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative w-full h-[708] lg:h-[648px]">
              <Image src="/about/why-us.webp" alt="Fashion Model" fill className="object-cover " priority />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhyUsSection;

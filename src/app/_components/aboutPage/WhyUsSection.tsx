import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { Button } from '../ui';

const WhyUsSection = () => {
  const [activeTab, setActiveTab] = useState('MISSION');

  const tabs = [
    {
      id: 'MISSION',
      label: 'MISSION',
      content: {
        text1:
          'A world full of disposable products, Cherries chooses meaning. We believe tech accessories should be more than just functional — they should awaken your senses, enhance your style, and tell a story. A subtle scent that evokes memories. A design that stands out without shouting. And quality that lasts for years. Cherries is building an international lifestyle brand where luxury, sustainability, and identity come together.',
      },
    },
    {
      id: 'VISION',
      label: 'VISION',
      content: {
        text1:
          'We create tech accessories for those who expect more. Phone cases with scent, powerful power banks, premium chargers — every detail is carefully considered. Our products are made to last, with attention to the environment and a sharp sense of style. Cherries is for people who choose quality, character, and a touch of individuality.',
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
            <h2 className="text-4xl lg:text-5xl font-bold font-bungee text-gray-900 tracking-tight">WHY US</h2>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <Button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                    activeTab === tab.id ? 'bg-primary text-white' : 'bg-red-200 text-primary hover:bg-red-300'
                  }`}
                >
                  {tab.label}
                </Button>
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
                <Button className="text-white px-12 py-3" showArrow>
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

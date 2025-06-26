import Image from 'next/image';

import { Button } from '../ui';
import AnnouncementBanner from './AnnouncementBanner';

const HeroSection = () => {
  const images = [
    { id: 1, src: '/landingPage/Hero/hero-1.png', alt: 'Image 1', width: 290.31, height: 494 },
    { id: 2, src: '/landingPage/Hero/hero-2.png', alt: 'Image 2', width: 240.77, height: 409.7 },
    { id: 3, src: '/landingPage/Hero/hero-3.png', alt: 'Image 3', width: 186.18, height: 316.81 },
    { id: 4, src: '/landingPage/Hero/hero-4.png', alt: 'Image 4', width: 240.77, height: 409.7 },
    { id: 5, src: '/landingPage/Hero/hero-5.png', alt: 'Image 5', width: 290.31, height: 494 },
  ];

  return (
    <>
      <div className="py-16 ">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl  md:text-[74px] font-bungee font-bold text-gray-900 mb-12 tracking-tight">
            CHERRIES FRESH COLLECTION
          </h1>
          <Button className="mx-auto  w-[187px] h-[52px] text-[21px]" showArrow>
            Shop Now
          </Button>
        </div>

        {/* Images Section */}
        <div className="flex justify-center items-end gap-6 flex-wrap px-4 max-w-8xl mx-auto">
          {images.map((image) => (
            <div key={image.id} className="flex-shrink-0">
              <Image src={image.src} alt={image.alt} width={image.width} height={image.height} className=" " />
            </div>
          ))}
        </div>
      </div>
      <AnnouncementBanner />
    </>
  );
};

export default HeroSection;

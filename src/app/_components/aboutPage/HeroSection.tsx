import Image from 'next/image';
import Link from 'next/link';

import AnnouncementBanner from '../animation/AnnouncementBanner';
import { Button } from '../ui';

const HeroSection = () => {
  return (
    <>
      <div className="py-16 ">
        {/* Grid Layout - Image Left, Content Right */}
        <div className="grid container grid-cols-1 lg:grid-cols-2 gap-8 items-center mx-auto max-w-8xl  px-4">
          {/* Left Side - Image */}
          <div className="relative">
            <Image
              src="/about/hero.webp"
              alt="Fashion Model"
              width={500}
              height={708}
              className="object-cover "
              priority
            />
          </div>

          {/* Right Side - About Us Content */}
          <div className="space-y-6">
            <h2 className="text-4xl font-bungee lg:text-[73px]  text-text tracking-tight">ABOUT US</h2>

            <p className="text-text text-2xl leading-relaxed">
              Cherries is a bold and playful tech accessory brand specializing in  phone cases and chargers that combine
              eye-catching design with everyday performance. Inspired by retro aesthetics and pixel art, cherries brings
              a nostalgic yet modern touch to mobile essentials. Our products are made for trendsetters who want
              protection, power, and personality in one. We believe tech accessories should be more than just
              functional—they should reflect your unique style. With quality materials, fun design, and reliable
              charging power, cherries stands out in a market full of plain, forgettable accessories. Whether you’re
              gaming, working, or scrolling through life, cherries keeps you powered up and looking fresh
            </p>

            <Link href="/products">
              <Button className=" mt-8 px-4  text-[21px]" showArrow>
                Shop Now
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <AnnouncementBanner />
    </>
  );
};

export default HeroSection;

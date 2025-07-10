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
              Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore Et
              Dolore Magna Aliqua. Ut Enim Ad Minim Veniam, Quis Nostrud Exercitation Ullamco Laboris Nisi Ut Aliquip Ex
              Ea Commodo Consequat. Duis Aute Irure Dolor In Reprehenderit.
            </p>

            <Link href="/about">
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

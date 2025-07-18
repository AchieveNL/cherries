import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import AnnouncementBanner from '../animation/AnnouncementBanner';
import { Button } from '../ui';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [dragEnd, setDragEnd] = useState(0);

  // Use ref to track if user recently interacted
  const lastInteractionRef = useRef(0);
  const INTERACTION_PAUSE_DURATION = 5000; // 5 seconds pause after interaction

  // Desktop images - for grid display
  const desktopImages = [
    { id: 1, src: '/landingPage/Hero/desktop/hero-1.png', alt: 'Desktop Image 1', width: 290.31, height: 494 },
    { id: 2, src: '/landingPage/Hero/desktop/hero-2.png', alt: 'Desktop Image 2', width: 240.77, height: 409.7 },
    { id: 3, src: '/landingPage/Hero/desktop/hero-3.png', alt: 'Desktop Image 3', width: 186.18, height: 316.81 },
    { id: 4, src: '/landingPage/Hero/desktop/hero-4.png', alt: 'Desktop Image 4', width: 240.77, height: 409.7 },
    { id: 5, src: '/landingPage/Hero/desktop/hero-5.png', alt: 'Desktop Image 5', width: 290.31, height: 494 },
  ];

  // Mobile images - for slider (can be different aspect ratios, crops, etc.)
  const mobileImages = [
    { id: 1, src: '/landingPage/Hero/mobile/hero-mobile-1.png', alt: 'Mobile Image 1', width: 350, height: 400 },
    { id: 2, src: '/landingPage/Hero/mobile/hero-mobile-2.png', alt: 'Mobile Image 2', width: 350, height: 400 },
    { id: 3, src: '/landingPage/Hero/mobile/hero-mobile-3.png', alt: 'Mobile Image 3', width: 350, height: 400 },
    { id: 4, src: '/landingPage/Hero/mobile/hero-mobile-4.png', alt: 'Mobile Image 4', width: 350, height: 400 },
    { id: 5, src: '/landingPage/Hero/mobile/hero-mobile-5.png', alt: 'Mobile Image 5', width: 350, height: 400 },
  ];

  // Continuous auto-play functionality with smart pausing
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastInteraction = now - lastInteractionRef.current;

      // Only auto-advance if enough time has passed since last interaction
      if (timeSinceLastInteraction >= INTERACTION_PAUSE_DURATION) {
        setCurrentSlide((prev) => (prev + 1) % mobileImages.length);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [mobileImages.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    // Record interaction time but don't stop auto-play permanently
    lastInteractionRef.current = Date.now();
  };

  // Touch and mouse drag handlers
  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    // Record interaction time
    lastInteractionRef.current = Date.now();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragStart(clientX);
  };

  const handleDragMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setDragEnd(clientX);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const dragDistance = dragStart - dragEnd;
    const threshold = 50; // Minimum distance to trigger slide change

    if (Math.abs(dragDistance) > threshold) {
      if (dragDistance > 0) {
        // Dragged left - go to next slide
        setCurrentSlide((prev) => (prev + 1) % mobileImages.length);
      } else {
        // Dragged right - go to previous slide
        setCurrentSlide((prev) => (prev - 1 + mobileImages.length) % mobileImages.length);
      }
    }

    setDragStart(0);
    setDragEnd(0);
  };

  // Pause auto-play when user hovers over mobile slider (optional UX improvement)
  const handleMouseEnter = () => {
    lastInteractionRef.current = Date.now();
  };

  const handleMouseLeave = () => {
    // Reset interaction time when mouse leaves to resume auto-play sooner
    lastInteractionRef.current = Date.now() - INTERACTION_PAUSE_DURATION + 2000; // Resume in 2 seconds
  };

  return (
    <>
      <div className="py-16">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-[74px] font-bungee font-bold text-gray-900 mb-12 tracking-tight">
            CHERRIES FRESH COLLECTION
          </h1>
          <Link href="/products">
            <Button className="mx-auto w-[187px] h-[52px] text-[21px]" showArrow>
              Shop Now
            </Button>
          </Link>
        </div>

        {/* Desktop Images Grid */}
        <div className="hidden md:flex justify-center items-center gap-6 flex-wrap px-4 max-w-8xl mx-auto">
          {desktopImages.map((image) => (
            <div key={image.id} className="flex-shrink-0">
              <Image src={image.src} alt={image.alt} width={image.width} height={image.height} className="" />
            </div>
          ))}
        </div>

        {/* Mobile Slider */}
        <div className="md:hidden relative px-4" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <div
            className="relative overflow-hidden rounded-lg cursor-grab active:cursor-grabbing"
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
          >
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {mobileImages.map((image) => (
                <div key={image.id} className="w-full flex-shrink-0 flex justify-center">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    className="max-w-full h-auto pointer-events-none"
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {mobileImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentSlide ? 'bg-primary scale-110' : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
      <AnnouncementBanner />
    </>
  );
};

export default HeroSection;

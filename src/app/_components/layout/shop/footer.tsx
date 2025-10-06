'use client';

import Lottie from 'lottie-react';
/* eslint-disable react/jsx-no-undef */
/* eslint-disable jsx-a11y/anchor-is-valid */
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { siteConfig } from '@/config/site'; // Import the site configuration
import pixel from '../../../../../public/animation/pixel.json';
import { SnapChatIcon } from '../../icons/footer/SnapChatIcon';

// Types for collections
interface FooterCollectionItem {
  name: string;
  href: string;
}

// Custom Twitter/X and TikTok icons as simple SVGs since they're not in lucide-react
// const TwitterIcon = ({ className }: { className: string }) => (
//   <svg className={className} viewBox="0 0 24 24" fill="currentColor">
//     <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
//   </svg>
// );

const TikTokIcon = ({ className }: { className: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

const InstagramIcon = ({ className }: { className: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

// Fixed Hook to observe when element comes into view
function useInView(threshold = 0.1) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      {
        threshold,
        rootMargin: '0px 0px -100px 0px', // Trigger when element is 100px from bottom of viewport
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
}

// Hook to fetch collections for footer
function useFooterCollections() {
  const [collections, setCollections] = useState<FooterCollectionItem[]>([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/collections')
      .then((res) => res.json())
      .then((data) => {
        const dropdownItems = data.collections
          .filter((c: any) => c.handle && c.title)
          .map((c: any) => ({
            name: c.title,
            href: `/collections/${c.handle}`,
          }));
        dropdownItems.push({
          name: 'All Collections',
          href: '/collections',
        });
        setCollections(dropdownItems);
        setError(false);
      })
      .catch((err) => {
        setError(true);
        console.log('Error Collection Fetch Footer :', err);
        // Fallback to static data
        setCollections([
          { name: 'iPhone Cases', href: '/collections/iphone' },
          { name: 'Samsung Cases', href: '/collections/samsung' },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  return { collections, loading, error };
}

// Loading skeleton component for shop links
function ShopLinksLoading() {
  return (
    <ul className="space-y-4">
      {[1, 2, 3].map((index) => (
        <li key={index}>
          <div className="h-6 bg-gray-200 rounded animate-pulse w-24"></div>
        </li>
      ))}
    </ul>
  );
}

export function Footer() {
  const { collections, loading, error } = useFooterCollections();
  const { ref: animationRef, isInView } = useInView(0.1); // Trigger when 10% of element is visible
  const lottieRef = useRef<any>(null);

  // Handle Lottie animation based on visibility
  useEffect(() => {
    if (lottieRef.current) {
      if (isInView) {
        console.log('Element is in view, playing animation');
        lottieRef.current.play();
      } else {
        console.log('Element is out of view, stopping animation');
        lottieRef.current.stop();
      }
    }
  }, [isInView]);

  return (
    <footer className="relative py-16 pb-0" ref={animationRef}>
      <div className="container relative z-10 mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12 mb-16">
          {/* Logo and Social Links */}
          <div className="space-y-6 col-span-1 lg:col-span-1">
            <div className="flex items-center space-x-2">
              {/* Cherries Logo - using colored squares to represent the pixelated cherries */}
              <div className="flex items-center space-x-1">
                <Image src="/logo.svg" width={248} height={248} alt="Cherries Logo" />
              </div>
            </div>
            {/* Social Media Icons - Using site config social links */}
            <div className="flex items-center space-x-4">
              {siteConfig.social.instagram && (
                <a
                  href={siteConfig.social.instagram}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Instagram"
                >
                  <InstagramIcon className="w-4 h-4 text-primary" />
                </a>
              )}
              {/* {siteConfig.social.twitter && ( */}
              {/*   <a */}
              {/*     href={siteConfig.social.twitter} */}
              {/*     className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors" */}
              {/*     target="_blank" */}
              {/*     rel="noopener noreferrer" */}
              {/*     aria-label="Follow us on Twitter/X" */}
              {/*   > */}
              {/*     <TwitterIcon className="w-4 h-4 text-primary" /> */}
              {/*   </a> */}
              {/* )} */}
              {siteConfig.social.tiktok && (
                <a
                  href={siteConfig.social.tiktok}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on TikTok"
                >
                  <TikTokIcon className="w-4 h-4 text-primary" />
                </a>
              )}
              {/* {siteConfig.social.facebook && ( */}
              {/*   <a */}
              {/*     href={siteConfig.social.facebook} */}
              {/*     className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors" */}
              {/*     target="_blank" */}
              {/*     rel="noopener noreferrer" */}
              {/*     aria-label="Follow us on Facebook" */}
              {/*   > */}
              {/*     <Facebook className="w-4 h-4 text-primary" /> */}
              {/*   </a> */}
              {/* )} */}
              {siteConfig.social.snapchat && (
                <a
                  href={siteConfig.social.snapchat}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Snapchat"
                >
                  <SnapChatIcon className=" text-primary" />
                </a>
              )}
            </div>
          </div>
          <div></div>

          {/* Dynamic Shop Links */}
          <div className="col-span-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Shop</h3>
            {loading ? (
              <ShopLinksLoading />
            ) : error ? (
              <ul className="space-y-4">
                <li>
                  <a href="/collections" className="text-gray-600 hover:text-gray-900 transition-colors text-lg">
                    All Collections
                  </a>
                </li>
                <li>
                  <a href="/products" className="text-gray-600 hover:text-gray-900 transition-colors text-lg">
                    All Products
                  </a>
                </li>
              </ul>
            ) : (
              <ul className="space-y-4">
                {collections.map((collection) => (
                  <li key={collection.name}>
                    <a href={collection.href} className="text-gray-600 hover:text-gray-900 transition-colors text-lg">
                      {collection.name}
                    </a>
                  </li>
                ))}
                {/* Always include "All Products" link */}
                <li>
                  <a href="/products" className="text-gray-600 hover:text-gray-900 transition-colors text-lg">
                    All Products
                  </a>
                </li>
              </ul>
            )}
          </div>

          {/* Terms Links */}
          <div className="col-span-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Terms</h3>
            <ul className="space-y-4">
              <li>
                <a href="/terms" className="text-gray-600 hover:text-gray-900 transition-colors text-lg">
                  General Terms
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors text-lg">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/returns" className="text-gray-600 hover:text-gray-900 transition-colors text-lg">
                  Return Policy
                </a>
              </li>
              <li>
                <a href="/warranty" className="text-gray-600 hover:text-gray-900 transition-colors text-lg">
                  Warranty Policy
                </a>
              </li>
              <li>
                <a href="/cookies" className="text-gray-600 hover:text-gray-900 transition-colors text-lg">
                  Cookies
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Service Links */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Customer Service</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-gray-900 transition-colors text-lg">
                  About Us
                </Link>
              </li>

              <li>
                <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors text-lg">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-gray-900 transition-colors text-lg">
                  FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="/account?tab=orders"
                  className="text-gray-600 hover:text-gray-900 transition-colors text-lg"
                >
                  Orders
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Hero frame image positioned at the very bottom - Mobile Responsive */}
      <div className="relative w-full overflow-hidden">
        {/* Lottie Animation Container */}

        <div className="w-full ">
          <Lottie
            lottieRef={lottieRef}
            animationData={pixel}
            loop={false}
            autoplay={false} // Set to false, we'll control it manually
            className="w-[1000px] md:w-auto  h-auto" // Ensure responsive sizing
          />
        </div>

        {/* Bottom Footer - positioned over the animation background */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4 md:translate-y-32 translate-y-20">
            <div className="flex flex-col md:flex-row justify-between items-center md:items-end space-y-1 md:space-y-0 text-center md:text-left">
              <p className="text-white text-xs md:text-lg">© 2025 Cherries All rights reserved</p>
              <p className="text-white text-xs md:text-lg">
                Developed by{' '}
                <a
                  className="group relative inline-flex items-center gap-2 hover:text-secondary transition-colors duration-300"
                  href="https://www.achieve.nl/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="relative">
                    Achieve.nl
                    {/* Animated underline */}
                  </span>
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

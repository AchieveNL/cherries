'use client';

/* eslint-disable react/jsx-no-undef */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Facebook, Youtube } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Types for collections
interface FooterCollectionItem {
  name: string;
  href: string;
}

// Custom Twitter/X and TikTok icons as simple SVGs since they're not in lucide-react
const TwitterIcon = ({ className }: { className: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const TikTokIcon = ({ className }: { className: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

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

  return (
    <footer className="relative py-16 px-4 pb-0">
      <div className="container relative z-10 mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Logo and Social Links */}
          <div className="space-y-6 ">
            <div className="flex items-center space-x-2">
              {/* Cherries Logo - using colored squares to represent the pixelated cherries */}
              <div className="flex items-center space-x-1">
                <Image src="/logo.svg" width={248} height={248} alt="CaseHub Logo" />
              </div>
            </div>
            {/* Social Media Icons */}
            <div className="flex ml-12 items-center space-x-4">
              <a href="#" className="p-2 bg-gray-100 rounded-full ">
                <TwitterIcon className="w-4 h-4  text-primary" />
              </a>
              <a href="#" className="p-2 bg-gray-100 rounded-full ">
                <TikTokIcon className="w-4 h-4  text-primary" />
              </a>
              <a href="#" className="p-2 bg-gray-100 rounded-full ">
                <Facebook className="w-4 h-4 text-primary" />
              </a>
              <a href="#" className="p-2 bg-gray-100 rounded-full  ">
                <Youtube className="w-4 h-4 text-primary" />
              </a>
            </div>
          </div>

          <div className="ml-8"></div>

          {/* Dynamic Shop Links */}
          <div className="ml-8">
            <h3 className="text-xl font-bungee font-semibold text-gray-900 mb-6">Shop</h3>
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
          <div>
            <h3 className="text-xl font-bungee font-semibold text-gray-900 mb-6">Terms</h3>
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
          <div>
            <h3 className="text-xl font-bungee font-semibold text-gray-900 mb-6">Customer Service</h3>
            <ul className="space-y-4">
              <li>
                <a href="/about" className="text-gray-600 hover:text-gray-900 transition-colors text-lg">
                  About Us
                </a>
              </li>
              <li>
                <a href="/faq" className="text-gray-600 hover:text-gray-900 transition-colors text-lg">
                  FAQ
                </a>
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

      {/* Hero frame image positioned at the very bottom */}
      <div className="relative w-full">
        <Image
          src="/bg-red-footer.webp"
          alt="Hero Frame"
          width={1767}
          height={551}
          className="w-full h-auto object-cover"
        />

        {/* Bottom Footer - positioned over the red background */}
        <div className="absolute inset-0 flex items-center">
          <div className="container font-bungee mx-auto px-4 translate-y-32">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 ">
              <p className="text-white text-lg">© 2025 Cherries All rights reserved</p>
              <p className="text-white text-lg">
                Developed by{' '}
                <a
                  className="group relative inline-flex items-center gap-2 hover:text-secondary transition-colors duration-300"
                  href="https://www.achieve.nl/"
                  target="_blank"
                >
                  <span className="relative">
                    Achieve.nl
                    {/* Animated underline */}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-secondary transition-all duration-300 group-hover:w-full"></span>
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

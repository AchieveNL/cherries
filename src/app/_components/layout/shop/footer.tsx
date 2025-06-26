/* eslint-disable react/jsx-no-undef */
/* eslint-disable jsx-a11y/anchor-is-valid */
import { Facebook, Youtube } from 'lucide-react';
import Image from 'next/image';

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

export function Footer() {
  return (
    <footer className="relative py-16 px-4">
      <div className="container relative z-10  mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-64">
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
          {/* Shop Links */}

          <div className="ml-8">
            <h3 className="text-xl font-bungee font-semibold text-gray-900 mb-6">Shop</h3>
            <ul className=" space-y-4">
              <li>
                <a href="/phone-cases" className="text-gray-600 hover:text-gray-900 transition-colors text-lg">
                  Phone Cases
                </a>
              </li>
              <li>
                <a href="/power-banks" className="text-gray-600 hover:text-gray-900 transition-colors text-lg">
                  Power Banks
                </a>
              </li>
              <li>
                <a href="/chargers" className="text-gray-600 hover:text-gray-900 transition-colors text-lg">
                  Chargers
                </a>
              </li>
            </ul>
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
                <a href="/orders" className="text-gray-600 hover:text-gray-900 transition-colors text-lg">
                  Orders
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className=" text-white  pt-8">
          <div className="flex  flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className=" text-lg">© 2025 Cherries All rights reserved</p>
            <p className=" text-lg">
              Developed by{' '}
              <a className="hover:text-primary" href="https://www.achieve.nl/" target="__blank">
                Achieve.nl
              </a>
            </p>
          </div>
        </div>
      </div>
      {/* Hero frame image */}
      <div className="absolute bottom-0 left-0 w-full z-0">
        <Image
          src="/bg-red-footer.png"
          alt="Hero Frame"
          width={1767}
          height={551}
          className="w-full h-auto max-h-[120px] sm:max-h-[200px] lg:max-h-none object-cover object-top"
        />
      </div>
    </footer>
  );
}

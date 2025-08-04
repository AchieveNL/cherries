import Image from 'next/image';

import type { Collection } from '@shopify/hydrogen-react/storefront-api-types';
import type { PartialDeep } from 'type-fest';

interface ProductsHeaderProps {
  currentCollection?: PartialDeep<Collection, { recurseIntoArrays: true }>;
  totalProducts?: number;
}

export default function ProductsHeader({ currentCollection }: ProductsHeaderProps) {
  return (
    <div className="mb-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden shadow-2xl mb-8">
        {/* Main content container */}
        <div className="relative min-h-[400px] md:min-h-[413px]  flex">
          {/* Left side - Model image */}
          <div className="w-1/2 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20"></div>
            <Image
              src="/products/products-hero.png"
              width={699}
              height={413}
              className="w-full h-full object-cover object-center"
              sizes="50vw"
              alt="Fashion model with futuristic sunglasses and gold jewelry"
            />
          </div>

          {/* Right side - Typography and content */}
          <div className="w-1/2 bg-black text-white flex flex-col justify-center px-8 md:px-12 lg:px-16 py-8">
            {/* Small label */}
            <div className="mb-4 text-center">
              <span className="text-white  text-sm  uppercase">OUR PRODUCTS</span>
            </div>

            {/* Main heading */}
            <h1 className="text-xl text-center font-bungee md:text-4xl lg:text-5xl xl:text-6xl font-black leading-tight mb-6">
              <span className="block text-white">DESIGNED TO</span>
              <span className="block text-white">PROTECT.</span>
              <span className="block text-white">INSPIRED BY</span>
              <span className="block text-white">NATURE</span>
            </h1>

            {/* Collection info */}
            <div className="space-y-2 mb-6">
              {currentCollection?.title && (
                <h2 className="text-xl font-semibold text-white">{currentCollection.title}</h2>
              )}
              {currentCollection?.description && (
                <p className="text-gray-300 text-sm leading-relaxed max-w-md">{currentCollection.description}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

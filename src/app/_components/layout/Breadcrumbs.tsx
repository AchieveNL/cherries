import Link from 'next/link';

import type { Collection } from '@shopify/hydrogen-react/storefront-api-types';
import type { PartialDeep } from 'type-fest';

interface BreadcrumbsProps {
  currentCollection?: PartialDeep<Collection, { recurseIntoArrays: true }>;
}

export default function Breadcrumbs({ currentCollection }: BreadcrumbsProps) {
  return (
    <div className="bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 py-6 max-w-8xl">
        <nav className="flex items-center space-x-2 text-sm text-gray-500">
          <Link href="/" className="flex items-center hover:text-gray-700 transition-colors">
            Home
          </Link>
          <span>/</span>
          <a href="/products" className="hover:text-primary transition-colors">
            Products
          </a>
          {currentCollection && (
            <>
              <span>/</span>
              <span className="text-gray-900">{currentCollection.title}</span>
            </>
          )}
        </nav>
      </div>
    </div>
  );
}

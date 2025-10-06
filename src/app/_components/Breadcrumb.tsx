import Link from 'next/link';

import type { Product } from '@shopify/hydrogen-react/storefront-api-types';
import type { PartialDeep } from 'type-fest';

interface BreadcrumbProps {
  product: PartialDeep<Product, { recurseIntoArrays: true }>;
}

export default function Breadcrumb({ product }: BreadcrumbProps) {
  const productType = product.productType;
  const collections = product.collections?.nodes;
  const primaryCollection = collections?.[0];

  return (
    <div className="bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 py-6 max-w-8xl">
        <nav className="flex items-center space-x-2 text-sm text-gray-500">
          <Link href="/" className="flex items-center hover:text-gray-700 transition-colors">
            <span>HOME</span>
          </Link>

          <span>/</span>

          {primaryCollection ? (
            <>
              <Link href={`/collections/${primaryCollection.handle}`} className="hover:text-gray-700 transition-colors">
                {primaryCollection.title}
              </Link>
              <span>/</span>
            </>
          ) : productType ? (
            <>
              <span className="hover:text-gray-700 transition-colors">{productType}</span>
              <span>/</span>
            </>
          ) : null}

          <span className="text-gray-900 font-medium">{product.title}</span>
        </nav>
      </div>
    </div>
  );
}

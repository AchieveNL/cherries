import type { Collection } from '@shopify/hydrogen-react/storefront-api-types';
import type { PartialDeep } from 'type-fest';

interface BreadcrumbsProps {
  currentCollection?: PartialDeep<Collection, { recurseIntoArrays: true }>;
}

export default function Breadcrumbs({ currentCollection }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center space-x-2 text-sm text-text mb-4">
      <a href="/" className="hover:text-primary transition-colors">
        Home
      </a>
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
  );
}

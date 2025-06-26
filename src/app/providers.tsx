'use client';

import { CartProvider, ShopifyProvider } from '@shopify/hydrogen-react';
import { ReactNode } from 'react';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ShopifyProvider
      storeDomain={process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!}
      storefrontToken={process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!}
      storefrontApiVersion="2025-04"
      countryIsoCode="US"
      languageIsoCode="NL"
    >
      <CartProvider>{children}</CartProvider>
    </ShopifyProvider>
  );
}

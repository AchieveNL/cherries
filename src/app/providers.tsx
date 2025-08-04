'use client';

import { CartProvider, ShopifyProvider } from '@shopify/hydrogen-react';
import { ReactNode } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { AnalyticsProvider } from './_components/layout/context/AnalyticsProvider';
import { TrustooProvider } from './_components/layout/context/TrustooProvider';
import { WishlistProvider } from './_components/layout/context/wishList';

interface ProvidersProps {
  children: ReactNode;
}

function CartProviderWithAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();

  const customerAccessToken = isAuthenticated ? localStorage.getItem('shopify_customer_token') : undefined;

  return (
    <CartProvider
      // Key forces CartProvider to re-mount when auth state changes
      key={isAuthenticated ? 'authenticated' : 'anonymous'}
      customerAccessToken={customerAccessToken}
      onCreateComplete={() => {
        console.log('Cart created with customer token:', !!customerAccessToken);
      }}
      onBuyerIdentityUpdateComplete={() => {
        console.log('Buyer identity updated');
      }}
    >
      {children}
    </CartProvider>
  );
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ShopifyProvider
      storeDomain={process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!}
      storefrontToken={process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!}
      storefrontApiVersion="2025-04"
      countryIsoCode="US"
      languageIsoCode="EN"
    >
      <AnalyticsProvider>
        <TrustooProvider>
          <CartProviderWithAuth>
            <WishlistProvider>{children}</WishlistProvider>
          </CartProviderWithAuth>
        </TrustooProvider>
      </AnalyticsProvider>
    </ShopifyProvider>
  );
}

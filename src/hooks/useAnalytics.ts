/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { trackAddToCart, trackCollectionView, trackPageView, trackProductView, trackSearch } from '@/lib/analytics';

export function useAnalytics() {
  const router = useRouter();

  // Track page views automatically
  useEffect(() => {
    const handleRouteChange = () => {
      trackPageView({
        url: window.location.href,
        path: window.location.pathname,
        search: window.location.search,
        title: document.title,
      });
    };

    // Track initial page load
    handleRouteChange();
  }, []);

  return {
    trackPageView,
    trackProductView,
    trackAddToCart,
    trackCollectionView,
    trackSearch,
  };
}

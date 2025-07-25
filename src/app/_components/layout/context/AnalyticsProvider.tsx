'use client';

import React, { createContext, ReactNode, Suspense, useContext } from 'react';

import { usePageViewTracking } from '@/hooks/useAnalytics';

interface AnalyticsContextType {
  trackEvent: (eventName: string, eventData?: any) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export function useAnalyticsContext() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalyticsContext must be used within an AnalyticsProvider');
  }
  return context;
}

interface AnalyticsProviderProps {
  children: ReactNode;
}

// Separate component that uses the hook
function AnalyticsTracker() {
  usePageViewTracking();
  return null;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const trackEvent = (eventName: string, eventData?: any) => {
    console.log('Custom event tracked:', eventName, eventData);
    // You can add custom event tracking logic here
  };

  return (
    <AnalyticsContext.Provider value={{ trackEvent }}>
      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>
      {children}
    </AnalyticsContext.Provider>
  );
}

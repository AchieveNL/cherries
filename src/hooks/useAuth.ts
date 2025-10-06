'use client';

import { useCallback, useEffect, useState } from 'react';

import {
  clearTokens,
  getStoredTokens,
  initiateLogin,
  isAuthenticated,
  logout as performLogout,
} from '@/lib/auth-utils';
import { getCustomerProfile } from '@/lib/customer-api';

import type { AuthHookReturn, CustomerProfile } from '@/types/auth';

/**
 * Custom hook for authentication state management
 * Provides auth status, user data, and auth actions
 */
export function useAuth(): AuthHookReturn {
  // Authentication state
  const [isAuthenticatedState, setIsAuthenticatedState] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);

  /**
   * Check authentication status and load user data
   */
  const checkAuthStatus = useCallback(async () => {
    setIsLoading(true);

    try {
      const authenticated = isAuthenticated();
      setIsAuthenticatedState(authenticated);

      if (authenticated) {
        // User is authenticated, fetch their profile
        const profile = await getCustomerProfile();
        setCustomer(profile);
      } else {
        // User is not authenticated, clear any cached data
        setCustomer(null);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      // On error, assume not authenticated
      setIsAuthenticatedState(false);
      setCustomer(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Initialize auth state on mount
   */
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  /**
   * Listen for storage changes (login/logout in other tabs)
   */
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'shopify_customer_token') {
        // Token changed in another tab, refresh auth state
        checkAuthStatus();
      }
    };

    // Only add listener in browser environment
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, [checkAuthStatus]);

  /**
   * Login function - initiates OAuth flow
   */
  const login = useCallback(async (email?: string) => {
    try {
      await initiateLogin(email);
      // Note: This will redirect to Shopify, so code after this won't execute
    } catch (error) {
      console.error('Login initiation failed:', error);
      throw new Error('Failed to start login process');
    }
  }, []);

  /**
   * Logout function - clears tokens and redirects
   */
  const logout = useCallback(async () => {
    try {
      setIsLoading(true);

      // Clear local state immediately
      setIsAuthenticatedState(false);
      setCustomer(null);

      // Perform logout (clears tokens and optionally redirects)
      await performLogout();
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if Shopify logout fails, we've cleared local state
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Refresh token function - attempts to refresh expired tokens
   */
  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const tokens = getStoredTokens();
      if (!tokens?.refreshToken) {
        return false;
      }

      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: tokens.refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();

      if (data.success && data.token) {
        // Import storeTokens dynamically to avoid circular dependencies
        const { storeTokens } = await import('@/lib/auth-utils');
        storeTokens(data.token);

        // Refresh auth state
        await checkAuthStatus();
        return true;
      }

      return false;
    } catch (error) {
      console.error('Token refresh error:', error);

      // If refresh fails, clear invalid tokens
      clearTokens();
      setIsAuthenticatedState(false);
      setCustomer(null);

      return false;
    }
  }, [checkAuthStatus]);

  /**
   * Force refresh user data
   */
  const refreshUserData = useCallback(async () => {
    if (!isAuthenticatedState) return;

    try {
      const profile = await getCustomerProfile();
      setCustomer(profile);
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  }, [isAuthenticatedState]);

  /**
   * Check if token is about to expire and refresh if needed
   */
  useEffect(() => {
    if (!isAuthenticatedState) return;

    const checkTokenExpiry = async () => {
      const tokens = getStoredTokens();
      if (!tokens) return;

      // Check if token expires in the next 5 minutes
      const expirationTime = new Date(tokens.expiresAt).getTime();
      const now = Date.now();
      const fiveMinutes = 5 * 60 * 1000;

      if (expirationTime - now < fiveMinutes) {
        console.log('Token expiring soon, attempting refresh...');
        const refreshed = await refreshToken();

        if (!refreshed) {
          console.log('Token refresh failed, user will need to re-authenticate');
        }
      }
    };

    // Check token expiry every minute
    const interval = setInterval(checkTokenExpiry, 60 * 1000);

    return () => clearInterval(interval);
  }, [isAuthenticatedState, refreshToken]);

  return {
    isAuthenticated: isAuthenticatedState,
    isLoading,
    customer,
    login,
    logout,
    refreshToken,
    // Additional utility methods
    refreshUserData,
    checkAuthStatus,
  };
}

/**
 * Hook for accessing authentication context
 * Throws error if used outside of auth context
 */
export function useRequireAuth(): Omit<AuthHookReturn, 'login'> {
  const auth = useAuth();

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
    }
  }, [auth.isLoading, auth.isAuthenticated]);

  if (!auth.isLoading && !auth.isAuthenticated) {
    throw new Error('Authentication required');
  }

  return auth;
}

/**
 * Hook for components that need to handle auth state changes
 * Provides loading states for better UX
 */
export function useAuthWithLoading() {
  const auth = useAuth();
  const [actionLoading, setActionLoading] = useState(false);

  const loginWithLoading = useCallback(
    async (email?: string) => {
      setActionLoading(true);
      try {
        await auth.login(email);
      } catch (error) {
        setActionLoading(false);
        throw error;
      }
      // Note: Login redirects, so setActionLoading(false) won't be reached
    },
    [auth.login]
  );

  const logoutWithLoading = useCallback(async () => {
    setActionLoading(true);
    try {
      await auth.logout();
    } catch (error) {
      setActionLoading(false);
      throw error;
    }
    // Note: Logout may redirect, so setActionLoading(false) might not be reached
  }, [auth.logout]);

  const refreshWithLoading = useCallback(async () => {
    setActionLoading(true);
    try {
      const result = await auth.refreshToken();
      return result;
    } finally {
      setActionLoading(false);
    }
  }, [auth.refreshToken]);

  return {
    ...auth,
    actionLoading,
    login: loginWithLoading,
    logout: logoutWithLoading,
    refreshToken: refreshWithLoading,
  };
}

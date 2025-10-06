import type { CustomerToken } from '@/types/auth';

// Storage keys for localStorage
const TOKEN_STORAGE_KEY = 'shopify_customer_token';
const REFRESH_TOKEN_KEY = 'shopify_refresh_token';
const ID_TOKEN_KEY = 'shopify_id_token';
const TOKEN_EXPIRY_KEY = 'shopify_token_expires_at';

/**
 * Store authentication tokens in localStorage
 * This persists the user's session across browser refreshes
 */
export function storeTokens(token: CustomerToken): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token.accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, token.refreshToken);
    localStorage.setItem(TOKEN_EXPIRY_KEY, token.expiresAt);

    // Store ID token if provided
    if (token.idToken) {
      localStorage.setItem(ID_TOKEN_KEY, token.idToken);
    }

    console.log('Tokens stored successfully:', {
      accessToken: token.accessToken.substring(0, 20) + '...',
      refreshToken: token.refreshToken.substring(0, 20) + '...',
      expiresAt: token.expiresAt,
      hasIdToken: !!token.idToken,
    });
  } catch (error) {
    console.error('Failed to store tokens:', error);
  }
}

/**
 * Retrieve stored tokens from localStorage
 * Returns null if no valid tokens found
 */
export function getStoredTokens(): CustomerToken | null {
  if (typeof window === 'undefined') return null;

  try {
    const accessToken = localStorage.getItem(TOKEN_STORAGE_KEY);
    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const expiresAt = localStorage.getItem(TOKEN_EXPIRY_KEY);
    const idToken = localStorage.getItem(ID_TOKEN_KEY);

    console.log('Retrieved tokens from storage:', {
      hasAccessToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      hasExpiresAt: !!expiresAt,
      hasIdToken: !!idToken,
      expiresAt: expiresAt,
    });

    if (!accessToken || !refreshToken || !expiresAt) {
      console.log('Missing required tokens');
      return null;
    }

    return {
      accessToken,
      refreshToken,
      expiresAt,
      idToken: idToken || undefined,
      expiresIn: Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000),
    };
  } catch (error) {
    console.error('Failed to retrieve tokens:', error);
    return null;
  }
}

/**
 * Clear all stored tokens from localStorage
 * Used during logout or when tokens are invalid
 */
export function clearTokens(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(ID_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    console.log('All tokens cleared from storage');
  } catch (error) {
    console.error('Failed to clear tokens:', error);
  }
}

/**
 * Check if user is currently authenticated
 * Validates token existence and expiration
 */
export function isAuthenticated(): boolean {
  const tokens = getStoredTokens();
  if (!tokens) {
    console.log('No tokens found, user not authenticated');
    return false;
  }

  // Check if token is expired (with 5 minute buffer)
  const expirationTime = new Date(tokens.expiresAt).getTime();
  const now = Date.now();
  const buffer = 5 * 60 * 1000; // 5 minutes

  const isValid = expirationTime > now + buffer;
  console.log('Token validation:', {
    expirationTime: new Date(expirationTime),
    now: new Date(now),
    bufferMinutes: 5,
    isValid,
  });

  return isValid;
}

/**
 * Get a valid access token, refreshing if necessary
 * Returns null if unable to get/refresh token
 */
export async function getValidAccessToken(): Promise<string | null> {
  console.log('Getting valid access token...');

  const tokens = getStoredTokens();
  if (!tokens) {
    console.log('No tokens available');
    return null;
  }

  // Check if current token is still valid (with 5 minute buffer)
  const expirationTime = new Date(tokens.expiresAt).getTime();
  const now = Date.now();
  const buffer = 5 * 60 * 1000; // 5 minutes

  if (expirationTime > now + buffer) {
    // Token is still valid
    console.log('Access token is still valid');
    return tokens.accessToken;
  }

  console.log('Access token expired or expiring soon, attempting refresh...');

  // Token is expired or about to expire, try to refresh
  try {
    const refreshedTokens = await refreshAccessToken(tokens.refreshToken);
    if (refreshedTokens) {
      console.log('Token refreshed successfully');
      storeTokens(refreshedTokens);
      return refreshedTokens.accessToken;
    }
  } catch (error) {
    console.error('Failed to refresh token:', error);
  }

  // Refresh failed, clear invalid tokens
  console.log('Token refresh failed, clearing tokens');
  clearTokens();
  return null;
}

/**
 * Refresh access token using refresh token
 * Makes API call to exchange refresh token for new access token
 */
async function refreshAccessToken(refreshToken: string): Promise<CustomerToken | null> {
  try {
    console.log('Attempting to refresh access token...');

    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken }),
    });

    console.log('Refresh token response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Refresh token response error:', errorText);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Refresh token response data:', data);

    if (data.success && data.token) {
      return data.token;
    }

    throw new Error(data.message || 'Token refresh failed');
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
}

/**
 * Initiate OAuth login flow
 * Generates PKCE parameters and redirects to Shopify
 */
export async function initiateLogin(email?: string): Promise<void> {
  try {
    console.log('Initiating login flow...');

    const { generatePKCEParams, storePKCEParams, generateAuthUrl, generateNonce } = await import('./pkce');

    // Generate PKCE parameters for security
    const pkceParams = await generatePKCEParams();
    const nonce = generateNonce();

    console.log('Generated PKCE params and nonce');

    // Store parameters temporarily for OAuth callback
    storePKCEParams(pkceParams);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('oauth_nonce', nonce);
    }

    // Generate OAuth URL and redirect
    const authUrl = generateAuthUrl(pkceParams.codeChallenge, pkceParams.state, nonce, email);
    console.log('Redirecting to auth URL:', authUrl);
    window.location.href = authUrl;
  } catch (error) {
    console.error('Failed to initiate login:', error);
    throw new Error('Failed to start authentication process');
  }
}

/**
 * Complete logout process
 * Clears local tokens and optionally redirects to Shopify logout
 */
export async function logout(): Promise<void> {
  console.log('Logging out...');

  // Clear local tokens
  clearTokens();

  // Always redirect to home page
  console.log('Redirecting to home page');
  window.location.href = '/';
}

/**
 * Decode JWT token payload (without verification)
 * Used to extract information from ID tokens
 */
export function decodeJWTPayload(token: string): any {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format');
    }

    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

/**
 * Validate OAuth state parameter for CSRF protection
 * Compares received state with stored state
 */
export function validateState(receivedState: string): boolean {
  if (typeof window === 'undefined') return false;

  const storedState = sessionStorage.getItem('oauth_state');
  console.log('Validating state:', { received: receivedState, stored: storedState });
  return storedState === receivedState;
}

/**
 * Generate a secure random string for various auth purposes
 */
export function generateSecureRandomString(length: number = 32): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randomBytes = new Uint8Array(length);
  crypto.getRandomValues(randomBytes);

  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters[randomBytes[i] % characters.length];
  }

  return result;
}

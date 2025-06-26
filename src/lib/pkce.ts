import type { PKCEParams } from '@/types/auth';

/**
 * Convert byte array to base64url encoding
 * Base64url is URL-safe base64 (replaces +/= with -_)
 */
function base64UrlEncode(bytes: Uint8Array): string {
  const string = String.fromCharCode(...Array.from(bytes));
  const base64 = btoa(string);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

/**
 * Generate a cryptographically secure code verifier for PKCE
 * This is a random string that will be hashed to create the code challenge
 */
export function generateCodeVerifier(): string {
  // Create a random array of 32 bytes
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);

  // Convert to base64url encoding (URL-safe base64)
  return base64UrlEncode(array);
}

/**
 * Generate code challenge from verifier using SHA256
 * This is what gets sent in the authorization request
 */
export async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  // Hash the code verifier using SHA-256
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);

  // Convert hash to base64url
  return base64UrlEncode(new Uint8Array(digest));
}

/**
 * Generate a random state parameter for CSRF protection
 * This prevents cross-site request forgery attacks
 */
export function generateState(): string {
  const timestamp = Date.now().toString();
  const randomBytes = new Uint8Array(16);
  crypto.getRandomValues(randomBytes);
  const randomString = base64UrlEncode(randomBytes);

  return `${timestamp}-${randomString}`;
}

/**
 * Generate a random nonce for replay attack protection
 * This prevents the same authentication response from being reused
 */
export function generateNonce(length: number = 16): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const randomBytes = new Uint8Array(length);
  crypto.getRandomValues(randomBytes);

  let nonce = '';
  for (let i = 0; i < length; i++) {
    nonce += characters[randomBytes[i] % characters.length];
  }

  return nonce;
}

/**
 * Generate all PKCE parameters at once
 * Convenience function that creates verifier, challenge, and state
 */
export async function generatePKCEParams(): Promise<PKCEParams> {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  const state = generateState();

  return {
    codeVerifier,
    codeChallenge,
    state,
  };
}

/**
 * Store PKCE parameters temporarily in sessionStorage
 * These are needed for the OAuth callback
 */
export function storePKCEParams(params: PKCEParams): void {
  if (typeof window === 'undefined') return;

  sessionStorage.setItem('oauth_code_verifier', params.codeVerifier);
  sessionStorage.setItem('oauth_state', params.state);
}

/**
 * Retrieve PKCE parameters from sessionStorage
 * Used in the OAuth callback to complete the flow
 */
export function getPKCEParams(): { codeVerifier: string; state: string } | null {
  if (typeof window === 'undefined') return null;

  const codeVerifier = sessionStorage.getItem('oauth_code_verifier');
  const state = sessionStorage.getItem('oauth_state');

  if (!codeVerifier || !state) return null;

  return { codeVerifier, state };
}

/**
 * Clear PKCE parameters from sessionStorage
 * Called after successful authentication or on error
 */
export function clearPKCEParams(): void {
  if (typeof window === 'undefined') return;

  sessionStorage.removeItem('oauth_code_verifier');
  sessionStorage.removeItem('oauth_state');
}

/**
 * Generate the complete Shopify OAuth authorization URL
 * This is where users get redirected to log in
 */
export function generateAuthUrl(codeChallenge: string, state: string, nonce: string, email?: string): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const shopId = process.env.NEXT_PUBLIC_SHOPIFY_SHOP_ID;
  const clientId = process.env.NEXT_PUBLIC_SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID;
  console.log('shopId', shopId);
  console.log('clientId', clientId);
  console.log('appUrl', appUrl);

  if (!shopId || !clientId || !appUrl) {
    throw new Error('Missing required environment variables for OAuth');
  }

  const baseUrl = `https://shopify.com/authentication/${shopId}/oauth/authorize`;
  const redirectUri = `${appUrl}/auth/callback`;
  console.log('base url ', baseUrl);
  console.log('redirect url ', redirectUri);

  const params = new URLSearchParams({
    scope: 'openid email customer-account-api:full',
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    state: state,
    nonce: nonce,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });

  // Add email hint if provided for better UX
  if (email) {
    params.append('login_hint', email);
  }

  return `${baseUrl}?${params.toString()}`;
}

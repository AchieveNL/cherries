'use client';

import { AlertCircle, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';

import { storeTokens, validateState } from '@/lib/auth-utils';
import { clearPKCEParams, getPKCEParams } from '@/lib/pkce';

type CallbackStatus = 'loading' | 'success' | 'error';

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<CallbackStatus>('loading');
  const [message, setMessage] = useState('Processing authentication...');
  const [progress, setProgress] = useState(0);
  const [debugInfo, setDebugInfo] = useState<string>('');

  // Prevent duplicate execution
  const hasProcessed = useRef(false);
  const isProcessing = useRef(false);

  useEffect(() => {
    // Prevent duplicate calls
    if (hasProcessed.current || isProcessing.current) {
      return;
    }

    isProcessing.current = true;
    handleAuthCallback();
  }, [searchParams]);

  const handleAuthCallback = async () => {
    try {
      // Mark as processed immediately
      hasProcessed.current = true;

      // Update progress
      setProgress(20);
      setMessage('Validating authorization...');

      // Extract parameters from URL
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      console.log('OAuth callback parameters:', {
        hasCode: !!code,
        codeLength: code?.length,
        hasState: !!state,
        stateValue: state,
        error,
        errorDescription,
        fullUrl: window.location.href,
      });

      setDebugInfo(`Code: ${code ? 'Present' : 'Missing'}, State: ${state ? 'Present' : 'Missing'}`);

      // Handle OAuth errors
      if (error) {
        let errorMessage = 'Authentication failed';

        switch (error) {
          case 'access_denied':
            errorMessage = 'You denied access to the application';
            break;
          case 'invalid_request':
            errorMessage = 'Invalid authentication request';
            break;
          case 'unauthorized_client':
            errorMessage = 'Application is not authorized';
            break;
          case 'unsupported_response_type':
            errorMessage = 'Authentication method not supported';
            break;
          case 'invalid_scope':
            errorMessage = 'Invalid permissions requested';
            break;
          case 'server_error':
            errorMessage = 'Shopify server error occurred';
            break;
          case 'temporarily_unavailable':
            errorMessage = 'Authentication service temporarily unavailable';
            break;
          default:
            if (errorDescription) {
              errorMessage = errorDescription;
            }
        }

        throw new Error(errorMessage);
      }

      // Validate required parameters
      if (!code || !state) {
        throw new Error('Missing required authentication parameters');
      }

      setProgress(40);
      setMessage('Verifying security parameters...');

      // Retrieve stored PKCE parameters
      const pkceParams = getPKCEParams();
      console.log('Retrieved PKCE params:', {
        hasParams: !!pkceParams,
        hasCodeVerifier: !!pkceParams?.codeVerifier,
        codeVerifierLength: pkceParams?.codeVerifier?.length,
        hasState: !!pkceParams?.state,
        storedState: pkceParams?.state,
        receivedState: state,
      });

      if (!pkceParams) {
        throw new Error('Authentication session expired. Please try logging in again.');
      }

      // Validate state parameter (CSRF protection)
      const stateValid = validateState(state);
      console.log('State validation:', {
        valid: stateValid,
        received: state,
        stored: sessionStorage.getItem('oauth_state'),
      });

      if (!stateValid) {
        throw new Error('Invalid authentication state. Possible security issue detected.');
      }

      setProgress(60);
      setMessage('Exchanging authorization code...');

      // Get stored nonce
      const nonce = sessionStorage.getItem('oauth_nonce');
      console.log('Retrieved nonce:', { hasNonce: !!nonce, nonce });

      // Prepare request payload
      const tokenRequestPayload = {
        code,
        codeVerifier: pkceParams.codeVerifier,
        state,
        nonce,
      };

      console.log('Token request payload:', {
        hasCode: !!tokenRequestPayload.code,
        codeLength: tokenRequestPayload.code?.length,
        hasCodeVerifier: !!tokenRequestPayload.codeVerifier,
        codeVerifierLength: tokenRequestPayload.codeVerifier?.length,
        hasState: !!tokenRequestPayload.state,
        hasNonce: !!tokenRequestPayload.nonce,
      });

      // Exchange authorization code for tokens
      console.log('Making token exchange request to: /api/auth/customer/token');

      const tokenResponse = await fetch('/api/auth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tokenRequestPayload),
      });

      console.log('Token exchange response:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        ok: tokenResponse.ok,
        headers: Object.fromEntries(tokenResponse.headers.entries()),
      });

      // Get response text first for better error debugging
      const responseText = await tokenResponse.text();
      console.log('Raw response text:', responseText);

      let tokenData;
      try {
        tokenData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        throw new Error(
          `Invalid response format. Status: ${tokenResponse.status}, Response: ${responseText.substring(0, 200)}`
        );
      }

      console.log('Parsed token data:', {
        success: tokenData.success,
        hasToken: !!tokenData.token,
        message: tokenData.message,
        fullResponse: tokenData,
      });

      if (!tokenResponse.ok) {
        console.error('Token exchange failed:', tokenData);

        // Provide more specific error messages based on status code
        let errorMessage = tokenData.message || `Token exchange failed (${tokenResponse.status})`;

        if (tokenResponse.status === 400) {
          errorMessage = `Bad Request: ${tokenData.message || 'Invalid authorization code or parameters'}`;
        } else if (tokenResponse.status === 401) {
          errorMessage = `Unauthorized: ${tokenData.message || 'Invalid client credentials'}`;
        } else if (tokenResponse.status === 403) {
          errorMessage = `Forbidden: ${tokenData.message || 'Access denied - check your configuration'}`;
        } else if (tokenResponse.status === 500) {
          errorMessage = `Server Error: ${tokenData.message || 'Internal server error during token exchange'}`;
        }

        setDebugInfo(`Status: ${tokenResponse.status}, Error: ${tokenData.message || 'Unknown'}`);
        throw new Error(errorMessage);
      }

      if (!tokenData.success || !tokenData.token) {
        throw new Error(tokenData.message || 'Invalid token response');
      }

      console.log('Token structure:', {
        hasAccessToken: !!tokenData.token.accessToken,
        accessTokenLength: tokenData.token.accessToken?.length,
        hasRefreshToken: !!tokenData.token.refreshToken,
        hasIdToken: !!tokenData.token.idToken,
        expiresAt: tokenData.token.expiresAt,
        expiresIn: tokenData.token.expiresIn,
      });

      setProgress(80);
      setMessage('Storing authentication tokens...');

      // Store tokens securely
      storeTokens(tokenData.token);
      console.log('Tokens stored successfully');

      // Verify tokens were stored
      const storedAccessToken = localStorage.getItem('shopify_customer_token');
      const storedRefreshToken = localStorage.getItem('shopify_refresh_token');
      const storedExpiresAt = localStorage.getItem('shopify_token_expires_at');

      console.log('Verification of stored tokens:', {
        hasAccessToken: !!storedAccessToken,
        accessTokenLength: storedAccessToken?.length,
        hasRefreshToken: !!storedRefreshToken,
        hasExpiresAt: !!storedExpiresAt,
        expiresAt: storedExpiresAt,
      });

      setProgress(100);
      setMessage('Authentication successful! Redirecting...');
      setStatus('success');

      // Clean up temporary data
      clearPKCEParams();
      if (nonce) {
        sessionStorage.removeItem('oauth_nonce');
      }

      // Get redirect destination
      const redirectTo = sessionStorage.getItem('auth_redirect') || '/account';
      sessionStorage.removeItem('auth_redirect');

      console.log('Redirecting to:', redirectTo);

      // Redirect after a short delay to show success message
      setTimeout(() => {
        router.push(redirectTo);
      }, 1500);
    } catch (error) {
      console.error('Authentication callback error:', error);

      setStatus('error');
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      setMessage(errorMessage);
      setDebugInfo(`Error: ${errorMessage}`);

      // Clean up on error
      clearPKCEParams();
      sessionStorage.removeItem('oauth_nonce');
      sessionStorage.removeItem('auth_redirect');
    } finally {
      isProcessing.current = false;
    }
  };

  const handleRetry = () => {
    // Reset state for retry
    hasProcessed.current = false;
    isProcessing.current = false;
    router.push('/login');
  };

  const handleGoHome = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Status Icon */}
        <div className="mx-auto h-16 w-16 rounded-full flex items-center justify-center">
          {status === 'loading' && <Loader2 className="h-8 w-8 text-primary animate-spin" />}
          {status === 'success' && <CheckCircle className="h-8 w-8 text-primary" />}
          {status === 'error' && <AlertCircle className="h-8 w-8 text-primary" />}
        </div>

        {/* Status Messages */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {status === 'loading' && 'Authenticating...'}
            {status === 'success' && 'Welcome Back!'}
            {status === 'error' && 'Authentication Failed'}
          </h2>

          <p className="text-gray-600 mb-6">{message}</p>

          {/* Debug Info (only show in development or when there's an error) */}
          {(process.env.NODE_ENV === 'development' || status === 'error') && debugInfo && (
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 mb-4">
              <p className="text-xs text-gray-700 font-mono break-all">{debugInfo}</p>
            </div>
          )}

          {/* Progress Bar (only show during loading) */}
          {status === 'loading' && (
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        {/* Success Actions */}
        {status === 'success' && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-700">
                You have been successfully authenticated. You&apos;ll be redirected to your account shortly.
              </p>
            </div>

            <button
              onClick={() => router.push('/account')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors"
            >
              Go to Account
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        )}

        {/* Error Actions */}
        {status === 'error' && (
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-700">
                {message.includes('denied')
                  ? 'You can try logging in again or return to the store.'
                  : 'Please try logging in again. If the problem persists, contact support.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleRetry}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>

              <button
                onClick={handleGoHome}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Back to Store
              </button>
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="text-xs text-gray-500">
          {status === 'loading' && <p>Please wait while we complete your authentication...</p>}
          {status === 'error' && <p>If you continue to experience issues, please contact our support team.</p>}
        </div>
      </div>
    </div>
  );
}

// Loading fallback component
function AuthCallbackFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
      <div className="flex items-center space-x-3">
        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        <span className="text-gray-600">Processing authentication...</span>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<AuthCallbackFallback />}>
      <AuthCallbackContent />
    </Suspense>
  );
}

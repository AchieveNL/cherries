/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-no-undef */
'use client';

import { AlertCircle, ArrowRight, Loader2, User } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

import { Button } from '@/app/_components/ui';
import { useAuth } from '@/hooks/useAuth';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading, login } = useAuth();

  const [email, setEmail] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for error parameters from OAuth callback
  useEffect(() => {
    const errorParam = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (errorParam) {
      let errorMessage = 'Authentication failed. Please try again.';

      switch (errorParam) {
        case 'access_denied':
          errorMessage = 'Access was denied. Please try again.';
          break;
        case 'invalid_request':
          errorMessage = 'Invalid request. Please try again.';
          break;
        case 'unauthorized_client':
          errorMessage = 'Application not authorized. Please contact support.';
          break;
        case 'unsupported_response_type':
          errorMessage = 'Configuration error. Please contact support.';
          break;
        case 'invalid_scope':
          errorMessage = 'Invalid permissions requested. Please contact support.';
          break;
        case 'server_error':
          errorMessage = 'Server error occurred. Please try again later.';
          break;
        case 'temporarily_unavailable':
          errorMessage = 'Service temporarily unavailable. Please try again later.';
          break;
        default:
          if (errorDescription) {
            errorMessage = errorDescription;
          }
      }

      setError(errorMessage);
    }
  }, [searchParams]);

  // Redirect if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const redirectTo = searchParams.get('redirect') || '/account';
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, router, searchParams]);

  const handleLogin = async () => {
    if (loginLoading) return;

    setError(null);
    setLoginLoading(true);

    try {
      await login(email || undefined);
      // Note: login() will redirect to Shopify, so this won't be reached
    } catch (error) {
      console.error('Login failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to start login process');
      setLoginLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !loginLoading) {
      handleLogin();
    }
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-gray-600">Checking authentication...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bungee font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to access your account and orders</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className=" p-4 bg-red-50 border border-solid border-red-200">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <div className="space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address (Optional)
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="appearance-none  relative block w-full px-3 py-3 pl-10 border border-solid border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                placeholder="your-email@example.com"
                disabled={loginLoading}
              />
              <User className="h-5 w-5 text-gray-400 absolute left-3 top-3.5" />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Enter your email for a personalized login experience, or leave blank to continue.
            </p>
          </div>

          {/* Login Button */}
          <Button
            onClick={handleLogin}
            disabled={loginLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-solid border-transparent text-sm font-medium  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loginLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Sign in with Shopify
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </div>

        {/* Info Section */}
        <div className="bg-white border border-solid border-secondary   p-4">
          <div className="text-sm">
            <p className="text-text font-medium mb-1">Secure Authentication</p>
            <p className="text-text">
              You&apos;ll be redirected to Shopify&apos;s secure login page to authenticate with your existing account.
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="text-center space-y-2">
          <button
            onClick={() => router.push('/products')}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back to store
          </button>

          <div className="text-xs text-gray-500">
            <p>
              Don&apos;t have a Shopify account?{' '}
              <span className="text-primary">You can create one during the login process.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading fallback component
function LoginPageFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
      <div className="flex items-center space-x-3">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <span className="text-gray-600">Loading login page...</span>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginContent />
    </Suspense>
  );
}

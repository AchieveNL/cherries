/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';

import type { CustomerToken } from '@/types/auth';

// Environment variables
const SHOP_ID = process.env.NEXT_PUBLIC_SHOPIFY_SHOP_ID;
const CLIENT_ID = process.env.NEXT_PUBLIC_SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID;

interface RefreshTokenRequest {
  refreshToken: string;
}

interface RefreshTokenResponse {
  success: boolean;
  token?: CustomerToken;
  message?: string;
}

/**
 * POST /api/auth/refresh
 * Refresh expired access tokens using refresh token
 */
export async function POST(request: NextRequest): Promise<NextResponse<RefreshTokenResponse>> {
  try {
    const body: RefreshTokenRequest = await request.json();
    const { refreshToken } = body;

    // Validate required parameters
    if (!refreshToken) {
      return NextResponse.json({ success: false, message: 'Refresh token is required' }, { status: 400 });
    }

    // Validate environment configuration
    if (!SHOP_ID || !CLIENT_ID) {
      console.error('Missing required environment variables:', { SHOP_ID: !!SHOP_ID, CLIENT_ID: !!CLIENT_ID });
      return NextResponse.json({ success: false, message: 'Server configuration error' }, { status: 500 });
    }

    // Construct Shopify token endpoint
    const tokenEndpoint = `https://shopify.com/authentication/${SHOP_ID}/oauth/token`;

    // Prepare refresh token request
    const refreshRequestBody = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: CLIENT_ID,
      refresh_token: refreshToken,
    });

    // Request new tokens from Shopify
    const tokenResponse = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
        // Required headers for Shopify Customer Account API
        Origin: process.env.NEXT_PUBLIC_APP_URL!,
        'User-Agent': 'NextJS-CustomerAccount/1.0',
      },
      body: refreshRequestBody,
    });

    // Handle refresh token errors
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token refresh failed:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        error: errorText,
      });

      let errorMessage = 'Failed to refresh token';

      // Provide specific error messages based on status
      switch (tokenResponse.status) {
        case 400:
          errorMessage = 'Invalid or expired refresh token';
          break;
        case 401:
          errorMessage = 'Invalid client credentials';
          break;
        case 403:
          errorMessage = 'Access forbidden - check your app configuration';
          break;
        case 404:
          errorMessage = 'Invalid shop ID or endpoint not found';
          break;
        default:
          errorMessage = `Token refresh failed with status ${tokenResponse.status}`;
      }

      return NextResponse.json(
        { success: false, message: errorMessage },
        { status: tokenResponse.status === 400 ? 401 : tokenResponse.status } // Convert 400 to 401 for client handling
      );
    }

    // Parse successful refresh response
    const tokenData = await tokenResponse.json();

    // Validate refresh response structure
    if (!tokenData.access_token || !tokenData.refresh_token) {
      console.error('Invalid refresh token response structure:', tokenData);
      return NextResponse.json({ success: false, message: 'Invalid token response from Shopify' }, { status: 500 });
    }

    // Create standardized token object
    const customerToken: CustomerToken = {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      // Note: ID token is typically not returned in refresh responses
      expiresAt: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
      expiresIn: tokenData.expires_in,
    };

    // Log successful token refresh (without sensitive data)
    console.log('Token refresh successful:', {
      hasAccessToken: !!customerToken.accessToken,
      hasRefreshToken: !!customerToken.refreshToken,
      expiresIn: customerToken.expiresIn,
      refreshedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      token: customerToken,
    });
  } catch (error) {
    console.error('Token refresh error:', error);

    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

/**
 * Utility function to validate refresh token response from Shopify
 */
function _validateRefreshTokenResponse(tokenData: any): boolean {
  const requiredFields = ['access_token', 'refresh_token', 'expires_in'];

  for (const field of requiredFields) {
    if (!tokenData[field]) {
      console.error(`Missing required field in refresh token response: ${field}`);
      return false;
    }
  }

  // Validate expires_in is a positive number
  if (typeof tokenData.expires_in !== 'number' || tokenData.expires_in <= 0) {
    console.error('Invalid expires_in value in refresh response:', tokenData.expires_in);
    return false;
  }

  return true;
}

/**
 * Handle preflight requests for CORS
 */
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

/**
 * GET method not allowed - refresh tokens should only be used via POST
 */
export async function GET() {
  return NextResponse.json(
    { success: false, message: 'Method not allowed. Use POST to refresh tokens.' },
    { status: 405 }
  );
}

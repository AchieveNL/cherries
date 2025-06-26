import { NextRequest, NextResponse } from 'next/server';

import type { CustomerToken, TokenExchangeRequest, TokenExchangeResponse } from '@/types/auth';

// Environment variables
const SHOP_ID = process.env.NEXT_PUBLIC_SHOPIFY_SHOP_ID;
const CLIENT_ID = process.env.NEXT_PUBLIC_SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID;

// In-memory cache to prevent duplicate token exchanges
const processedCodes = new Set<string>();

/**
 * POST /api/auth/token
 * Exchange OAuth authorization code for access tokens
 */
export async function POST(request: NextRequest): Promise<NextResponse<TokenExchangeResponse>> {
  console.log('=== Token Exchange Request Started ===');

  try {
    const body: TokenExchangeRequest = await request.json();
    const { code, codeVerifier, state, nonce } = body;

    console.log('Request received:', {
      hasCode: !!code,
      codeLength: code?.length,
      hasCodeVerifier: !!codeVerifier,
      codeVerifierLength: codeVerifier?.length,
      hasState: !!state,
      hasNonce: !!nonce,
    });

    // Validate required parameters
    if (!code) {
      console.error('Missing authorization code');
      return NextResponse.json({ success: false, message: 'Authorization code is required' }, { status: 400 });
    }

    if (!codeVerifier) {
      console.error('Missing code verifier');
      return NextResponse.json({ success: false, message: 'Code verifier is required' }, { status: 400 });
    }

    // Check if code has already been processed (prevent duplicate requests)
    if (processedCodes.has(code)) {
      console.warn('Duplicate token exchange attempt detected for code:', code.substring(0, 10) + '...');
      return NextResponse.json(
        { success: false, message: 'Authorization code has already been used' },
        { status: 400 }
      );
    }

    // Mark code as being processed
    processedCodes.add(code);

    // Clean up old codes (keep only last 100 to prevent memory leak)
    if (processedCodes.size > 100) {
      const codesArray = Array.from(processedCodes);
      processedCodes.clear();
      codesArray.slice(-50).forEach((c) => processedCodes.add(c));
    }

    // Validate environment configuration
    if (!SHOP_ID || !CLIENT_ID) {
      console.error('Missing required environment variables:', { SHOP_ID: !!SHOP_ID, CLIENT_ID: !!CLIENT_ID });
      return NextResponse.json({ success: false, message: 'Server configuration error' }, { status: 500 });
    }

    console.log('Environment config:', {
      shopId: SHOP_ID,
      clientNEXT_PUBLIC_SHOPIFY_SHOP_IDIdPrefix: CLIENT_ID?.substring(0, 10),
      appUrl: process.env.NEXT_PUBLIC_APP_URL,
    });

    // Construct Shopify token endpoint
    const tokenEndpoint = `https://shopify.com/authentication/${SHOP_ID}/oauth/token`;

    // CORRECTED: Use the callback page URL, not API endpoint
    const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`;

    console.log('Token exchange config:', {
      tokenEndpoint,
      redirectUri,
    });

    // Prepare token exchange request
    const tokenRequestBody = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: CLIENT_ID,
      code: code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier, // PKCE parameter
    });

    console.log('Token request prepared:', {
      grant_type: 'authorization_code',
      client_id: CLIENT_ID?.substring(0, 10) + '...',
      codePrefix: code.substring(0, 10) + '...',
      redirect_uri: redirectUri,
      code_verifier: codeVerifier.substring(0, 10) + '...',
    });

    console.log('Attempting token exchange for code:', code.substring(0, 10) + '...');

    // Exchange authorization code for tokens
    const tokenResponse = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
        // Required headers for Shopify Customer Account API
        Origin: process.env.NEXT_PUBLIC_APP_URL!,
        'User-Agent': 'NextJS-CustomerAccount/1.0',
      },
      body: tokenRequestBody,
    });

    console.log('Shopify token response:', {
      status: tokenResponse.status,
      statusText: tokenResponse.statusText,
      ok: tokenResponse.ok,
    });

    // Get response text for better error handling
    const responseText = await tokenResponse.text();
    console.log('Raw Shopify response:', responseText);

    // Handle token exchange errors
    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        error: responseText,
      });

      // Remove code from processed set on failure so it can be retried if needed
      processedCodes.delete(code);

      let errorMessage = 'Failed to exchange authorization code';

      // Provide specific error messages based on status
      switch (tokenResponse.status) {
        case 400:
          errorMessage = 'Invalid authorization code or request parameters';
          if (responseText.includes('invalid_grant')) {
            errorMessage = 'Authorization code has expired or is invalid';
          } else if (responseText.includes('invalid_client')) {
            errorMessage = 'Invalid client configuration';
          } else if (responseText.includes('redirect_uri_mismatch')) {
            errorMessage = 'Redirect URI mismatch - check your app settings';
          }
          break;
        case 401:
          errorMessage = 'Invalid client credentials';
          break;
        case 403:
          errorMessage = 'Access forbidden - check your app configuration and JavaScript origins';
          break;
        case 404:
          errorMessage = 'Invalid shop ID or endpoint not found';
          break;
        default:
          errorMessage = `Token exchange failed with status ${tokenResponse.status}`;
      }

      return NextResponse.json(
        {
          success: false,
          message: errorMessage,
          details: process.env.NODE_ENV === 'development' ? responseText : undefined,
        },
        { status: tokenResponse.status }
      );
    }

    // Parse successful token response
    let tokenData;
    try {
      tokenData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse token response:', parseError);
      processedCodes.delete(code);
      return NextResponse.json({ success: false, message: 'Invalid response format from Shopify' }, { status: 500 });
    }

    console.log('Parsed token data:', {
      hasAccessToken: !!tokenData.access_token,
      accessTokenLength: tokenData.access_token?.length,
      hasRefreshToken: !!tokenData.refresh_token,
      hasIdToken: !!tokenData.id_token,
      expiresIn: tokenData.expires_in,
    });

    // Validate token response structure
    if (!validateTokenResponse(tokenData)) {
      // Remove code from processed set on validation failure
      processedCodes.delete(code);
      return NextResponse.json({ success: false, message: 'Invalid token response from Shopify' }, { status: 500 });
    }

    // Verify nonce if provided (optional security check)
    if (nonce && tokenData.id_token) {
      try {
        const idTokenNonce = await getNonceFromIdToken(tokenData.id_token);
        console.log('Nonce verification:', {
          provided: nonce,
          fromToken: idTokenNonce,
          match: idTokenNonce === nonce,
        });

        if (idTokenNonce !== nonce) {
          console.error('Nonce mismatch detected');
          processedCodes.delete(code);
          return NextResponse.json(
            { success: false, message: 'Invalid authentication response - nonce mismatch' },
            { status: 400 }
          );
        }
      } catch (error) {
        console.warn('Failed to verify nonce (continuing anyway):', error);
        // Continue without nonce verification in case of parsing issues
      }
    }

    // Create standardized token object
    const customerToken: CustomerToken = {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      idToken: tokenData.id_token, // Optional - used for logout
      expiresAt: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
      expiresIn: tokenData.expires_in,
    };

    // Log successful token exchange (without sensitive data)
    console.log('Token exchange successful:', {
      codePrefix: code.substring(0, 10) + '...',
      hasAccessToken: !!customerToken.accessToken,
      hasRefreshToken: !!customerToken.refreshToken,
      hasIdToken: !!customerToken.idToken,
      expiresIn: customerToken.expiresIn,
      expiresAt: customerToken.expiresAt,
    });

    console.log('=== Token Exchange Completed Successfully ===');

    return NextResponse.json({
      success: true,
      token: customerToken,
    });
  } catch (error) {
    console.error('Token exchange error:', error);

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
 * Utility function to validate token response from Shopify
 */
function validateTokenResponse(tokenData: any): boolean {
  const requiredFields = ['access_token', 'refresh_token', 'expires_in'];

  for (const field of requiredFields) {
    if (!tokenData[field]) {
      console.error(`Missing required field in token response: ${field}`);
      return false;
    }
  }

  // Validate expires_in is a positive number
  if (typeof tokenData.expires_in !== 'number' || tokenData.expires_in <= 0) {
    console.error('Invalid expires_in value:', tokenData.expires_in);
    return false;
  }

  return true;
}

/**
 * Helper function to decode JWT and extract nonce
 */
function decodeJwt(token: string) {
  const [header, payload, signature] = token.split('.');

  if (!header || !payload) {
    throw new Error('Invalid JWT format');
  }

  const decodedHeader = JSON.parse(Buffer.from(header, 'base64url').toString());
  const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString());

  return {
    header: decodedHeader,
    payload: decodedPayload,
    signature,
  };
}

async function getNonceFromIdToken(idToken: string): Promise<string> {
  const decoded = decodeJwt(idToken);
  return decoded.payload.nonce;
}

/**
 * Handle preflight requests for CORS
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': process.env.NEXT_PUBLIC_APP_URL || '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

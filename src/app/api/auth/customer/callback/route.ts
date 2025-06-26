import { NextRequest, NextResponse } from 'next/server';

// Environment variables
const SHOP_ID = process.env.NEXT_PUBLIC_SHOPIFY_SHOP_ID;
const CLIENT_ID = process.env.NEXT_PUBLIC_SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID;

export async function POST(request: NextRequest) {
  try {
    const { code, codeVerifier, nonce } = await request.json();

    if (!code) {
      return NextResponse.json({ success: false, message: 'Authorization code is required' }, { status: 400 });
    }

    if (!codeVerifier) {
      return NextResponse.json({ success: false, message: 'Code verifier is required' }, { status: 400 });
    }

    if (!SHOP_ID || !CLIENT_ID) {
      console.error('Missing required environment variables');
      return NextResponse.json({ success: false, message: 'Server configuration error' }, { status: 500 });
    }

    // Correct Shopify Customer Account API token endpoint
    const tokenEndpoint = `https://shopify.com/authentication/${SHOP_ID}/oauth/token`;

    // Exchange authorization code for access token
    const tokenResponse = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
        // Important: Include origin header for public clients
        Origin: process.env.NEXT_PUBLIC_APP_URL!,
        'User-Agent': 'YourApp/1.0', // Required header
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: CLIENT_ID!,
        code: code,
        redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/customer/callback`,
        // PKCE parameter for public client
        code_verifier: codeVerifier,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('Token exchange failed:', {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        error: errorText,
      });

      let errorMessage = 'Failed to exchange authorization code';

      if (tokenResponse.status === 400) {
        errorMessage = 'Invalid authorization code or expired request';
      } else if (tokenResponse.status === 401) {
        errorMessage = 'Invalid client credentials';
      } else if (tokenResponse.status === 403) {
        errorMessage = 'Access forbidden - check your configuration';
      }

      return NextResponse.json({ success: false, message: errorMessage }, { status: 400 });
    }

    const tokenData = await tokenResponse.json();

    // Verify nonce if provided
    if (nonce && tokenData.id_token) {
      try {
        const idTokenNonce = await getNonceFromIdToken(tokenData.id_token);
        if (idTokenNonce !== nonce) {
          console.error('Nonce mismatch');
          return NextResponse.json({ success: false, message: 'Invalid authentication response' }, { status: 400 });
        }
      } catch (error) {
        console.error('Failed to verify nonce:', error);
        // Continue without nonce verification in case of parsing issues
      }
    }

    // Return the token data to be stored on the client
    return NextResponse.json({
      success: true,
      token: {
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        idToken: tokenData.id_token,
        expiresAt: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
        expiresIn: tokenData.expires_in,
      },
    });
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to decode JWT and extract nonce
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

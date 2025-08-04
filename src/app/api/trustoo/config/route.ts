// app/api/trustoo/config/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get credentials from server environment variables
    const publicToken = process.env.NEXT_PUBLIC_TRUSTOO_PUBLIC_TOKEN;
    const secretKey = process.env.TRUSTOO_SECRET_KEY;
    const baseUrl = process.env.TRUSTOO_BASE_URL || 'https://rapi.trustoo.io';

    // Check if credentials are available
    if (!publicToken || !secretKey) {
      console.error('Trustoo credentials missing:', {
        hasPublicToken: !!publicToken,
        hasSecretKey: !!secretKey,
      });

      return NextResponse.json(
        {
          error: 'Trustoo credentials not configured',
          details: {
            publicToken: !publicToken ? 'NEXT_PUBLIC_TRUSTOO_PUBLIC_TOKEN is missing' : 'present',
            secretKey: !secretKey ? 'TRUSTOO_SECRET_KEY is missing' : 'present',
          },
        },
        { status: 500 }
      );
    }

    // Return the configuration
    return NextResponse.json({
      publicToken,
      secretKey,
      baseUrl,
    });
  } catch (error) {
    console.error('Error in /api/trustoo/config:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const publicToken = process.env.NEXT_PUBLIC_TRUSTOO_PUBLIC_TOKEN;
    const secretKey = process.env.TRUSTOO_SECRET_KEY;
    const baseUrl = process.env.TRUSTOO_BASE_URL;

    return NextResponse.json({
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        hasPublicToken: !!publicToken,
        hasSecretKey: !!secretKey,
        publicTokenPrefix: publicToken ? publicToken.substring(0, 3) + '...' : 'missing',
        secretKeyPrefix: secretKey ? secretKey.substring(0, 3) + '...' : 'missing',
        publicTokenLength: publicToken?.length || 0,
        secretKeyLength: secretKey?.length || 0,
        baseUrl: baseUrl || 'default: https://rapi.trustoo.io',
        allEnvKeys: Object.keys(process.env).filter((key) => key.includes('TRUSTOO') || key.includes('trustoo')),
      },
      instructions: {
        message: 'Check your .env.local file',
        requiredVariables: [
          'NEXT_PUBLIC_TRUSTOO_PUBLIC_TOKEN=pk_your_token_here',
          'TRUSTOO_SECRET_KEY=sk_your_secret_here',
        ],
        notes: [
          'Make sure to restart your dev server after adding environment variables',
          'The .env.local file should be in your project root',
          'Tokens should start with pk_ and sk_ respectively',
        ],
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to read environment variables',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

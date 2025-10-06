// app/api/trustoo/test/route.ts
import crypto from 'crypto';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const publicToken = process.env.NEXT_PUBLIC_TRUSTOO_PUBLIC_TOKEN;
    const secretKey = process.env.TRUSTOO_SECRET_KEY;
    const baseUrl = process.env.TRUSTOO_BASE_URL || 'https://rapi.trustoo.io';

    console.log('Testing Trustoo API authentication...');
    console.log('Environment check:', {
      hasPublicToken: !!publicToken,
      hasSecretKey: !!secretKey,
      publicTokenLength: publicToken?.length || 0,
      secretKeyLength: secretKey?.length || 0,
      baseUrl,
    });

    if (!publicToken || !secretKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing credentials',
          details: {
            publicToken: !publicToken ? 'NEXT_PUBLIC_TRUSTOO_PUBLIC_TOKEN is missing' : 'present',
            secretKey: !secretKey ? 'TRUSTOO_SECRET_KEY is missing' : 'present',
          },
        },
        { status: 500 }
      );
    }

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const testResults = [];

    // Test Method 1: Standard publicToken + timestamp
    try {
      const signatureData1 = `${publicToken}${timestamp}`;
      const signature1 = crypto.createHmac('sha256', secretKey).update(signatureData1).digest('hex');

      const headers1 = {
        'Content-Type': 'application/json',
        'Public-Token': publicToken,
        Sign: signature1,
        Timestamp: timestamp,
      };

      const response1 = await fetch(`${baseUrl}/api/v1/openapi/get_reviews?page_size=1&page=1`, {
        method: 'GET',
        headers: headers1,
      });

      const result1 = await response1.text();
      let parsedResult1;
      try {
        parsedResult1 = JSON.parse(result1);
      } catch {
        parsedResult1 = { rawResponse: result1 };
      }

      testResults.push({
        method: 'Standard: publicToken + timestamp',
        signatureData: `${publicToken.substring(0, 5)}...${timestamp}`,
        signature: signature1.substring(0, 20) + '...',
        status: response1.status,
        success: response1.ok,
        response: parsedResult1,
      });
    } catch (error) {
      testResults.push({
        method: 'Standard: publicToken + timestamp',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    // Test Method 2: Just timestamp
    try {
      const signatureData2 = timestamp;
      const signature2 = crypto.createHmac('sha256', secretKey).update(signatureData2).digest('hex');

      const headers2 = {
        'Content-Type': 'application/json',
        'Public-Token': publicToken,
        Sign: signature2,
        Timestamp: timestamp,
      };

      const response2 = await fetch(`${baseUrl}/api/v1/openapi/get_reviews?page_size=1&page=1`, {
        method: 'GET',
        headers: headers2,
      });

      const result2 = await response2.text();
      let parsedResult2;
      try {
        parsedResult2 = JSON.parse(result2);
      } catch {
        parsedResult2 = { rawResponse: result2 };
      }

      testResults.push({
        method: 'Alternative: timestamp only',
        signatureData: timestamp,
        signature: signature2.substring(0, 20) + '...',
        status: response2.status,
        success: response2.ok,
        response: parsedResult2,
      });
    } catch (error) {
      testResults.push({
        method: 'Alternative: timestamp only',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    // Test Method 3: Try with different header names (some APIs use different headers)
    try {
      const signatureData3 = `${publicToken}${timestamp}`;
      const signature3 = crypto.createHmac('sha256', secretKey).update(signatureData3).digest('hex');

      const headers3 = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${publicToken}`,
        'X-Signature': signature3,
        'X-Timestamp': timestamp,
      };

      const response3 = await fetch(`${baseUrl}/api/v1/openapi/get_reviews?page_size=1&page=1`, {
        method: 'GET',
        headers: headers3,
      });

      const result3 = await response3.text();
      let parsedResult3;
      try {
        parsedResult3 = JSON.parse(result3);
      } catch {
        parsedResult3 = { rawResponse: result3 };
      }

      testResults.push({
        method: 'Alternative headers: Authorization Bearer',
        signatureData: `${publicToken.substring(0, 5)}...${timestamp}`,
        signature: signature3.substring(0, 20) + '...',
        status: response3.status,
        success: response3.ok,
        response: parsedResult3,
      });
    } catch (error) {
      testResults.push({
        method: 'Alternative headers: Authorization Bearer',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    // Test Method 4: Try with secretKey as the publicToken (in case tokens are swapped)
    try {
      const signatureData4 = `${secretKey}${timestamp}`;
      const signature4 = crypto.createHmac('sha256', publicToken).update(signatureData4).digest('hex');

      const headers4 = {
        'Content-Type': 'application/json',
        'Public-Token': secretKey,
        Sign: signature4,
        Timestamp: timestamp,
      };

      const response4 = await fetch(`${baseUrl}/api/v1/openapi/get_reviews?page_size=1&page=1`, {
        method: 'GET',
        headers: headers4,
      });

      const result4 = await response4.text();
      let parsedResult4;
      try {
        parsedResult4 = JSON.parse(result4);
      } catch {
        parsedResult4 = { rawResponse: result4 };
      }

      testResults.push({
        method: 'Swapped tokens test',
        signatureData: `${secretKey.substring(0, 5)}...${timestamp}`,
        signature: signature4.substring(0, 20) + '...',
        status: response4.status,
        success: response4.ok,
        response: parsedResult4,
      });
    } catch (error) {
      testResults.push({
        method: 'Swapped tokens test',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }

    return NextResponse.json({
      success: testResults.some((result) => result.success),
      message: 'Trustoo API authentication tests completed',
      testResults,
      recommendations: [
        'Check which test method returned success: true',
        'Verify your tokens are in the correct format',
        'Contact Trustoo support if all methods fail',
        'Check Trustoo documentation for the exact authentication method',
      ],
      authInfo: {
        publicToken: publicToken.substring(0, 10) + '...',
        secretKey: secretKey.substring(0, 10) + '...',
        timestampUsed: timestamp,
        baseUrl,
      },
    });
  } catch (error) {
    console.error('Error testing Trustoo API:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Test failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

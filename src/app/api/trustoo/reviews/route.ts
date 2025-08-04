/* eslint-disable @typescript-eslint/no-use-before-define */
import crypto from 'crypto';
import { NextResponse } from 'next/server';

// Get Trustoo client configuration
function getTrustooConfig() {
  const publicToken = process.env.NEXT_PUBLIC_TRUSTOO_PUBLIC_TOKEN;
  const privateToken = process.env.TRUSTOO_PRIVATE_TOKEN;
  const baseUrl = process.env.TRUSTOO_BASE_URL || 'https://rapi.trustoo.io';

  if (!publicToken || !privateToken) {
    throw new Error('Trustoo credentials not configured');
  }

  return { publicToken, privateToken, baseUrl };
}

// COMPLETELY CLEAN signature generation - test with ALL fields
function generateSignature(params: any, privateToken: string) {
  console.log('🔍 CLEAN Signature generation - NO URL encoding');
  console.log('Input params:', JSON.stringify(params, null, 2));

  const cleanData = {} as any;

  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const value = params[key];

      // Skip ONLY null and undefined, but INCLUDE empty strings
      if (value === null || value === undefined) {
        console.log(`⏭️  Skipping null/undefined value for key: ${key}`);
        continue;
      }

      // Handle objects and arrays
      if (typeof value === 'object' && value !== null) {
        // Check if object/array is effectively empty
        if (Array.isArray(value) && value.length === 0) {
          console.log(`⏭️  Skipping empty array for key: ${key}`);
          continue;
        }

        // For objects, check if all values are empty
        if (!Array.isArray(value)) {
          const hasNonEmptyValues = Object.values(value).some(
            (v) => v !== null && v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0)
          );

          if (!hasNonEmptyValues) {
            console.log(`⏭️  Skipping object with all empty values for key: ${key}`);
            continue;
          }
        }

        const jsonString = JSON.stringify(value);
        cleanData[key] = jsonString;
        console.log(`📦 Object ${key}: "${jsonString}"`);
      } else {
        // INCLUDE ALL VALUES including empty strings
        const stringValue = value !== null && value !== undefined ? String(value) : '';
        cleanData[key] = stringValue;
        if (stringValue === '') {
          console.log(`📝 Empty field ${key}: "" (INCLUDED)`);
        } else {
          console.log(`📝 Primitive ${key}: "${stringValue}"`);
        }
      }
    }
  }

  console.log('🔧 Clean data object (should have NO URL encoding):');
  console.log(JSON.stringify(cleanData, null, 2));

  // Sort keys alphabetically
  const keys = Object.keys(cleanData).sort();
  console.log('🔤 Sorted keys:', keys);

  // Create parameter string
  let resultStr = '';
  for (const key of keys) {
    const value = cleanData[key];
    const safeValue = value !== null && value !== undefined ? String(value) : '';
    resultStr += `${key}=${safeValue}&`;
  }
  resultStr = resultStr.slice(0, -1);

  console.log('🔗 Parameter string (check for URL encoding):');
  console.log(`"${resultStr}"`);

  // Generate signature
  const signatureData = resultStr + privateToken;
  const signature = crypto.createHash('sha256').update(signatureData).digest('hex');

  console.log('✅ FINAL signature:', signature);

  return signature;
}

// Flatten parameters for GET requests
function flattenParamsForGet(obj: any, prefix = '') {
  const flattened = {} as any;

  for (const key in obj) {
    if (obj.hasOwnProperty(key) && obj[key] !== null && obj[key] !== undefined) {
      const value = obj[key];
      const newKey = prefix ? `${prefix}[${key}]` : key;

      if (value === '') {
        continue;
      }

      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          if (item !== '' && item !== null && item !== undefined) {
            const arrayKey = `${newKey}[${index}]`;
            flattened[arrayKey] = String(item);
          }
        });
      } else if (typeof value === 'object' && value !== null) {
        Object.assign(flattened, flattenParamsForGet(value, newKey));
      } else {
        flattened[newKey] = String(value);
      }
    }
  }

  return flattened;
}

// Extract query parameters from URL
function extractQueryParams(url: string) {
  const params = {} as any;
  const urlObj = new URL(url);

  for (const entry of Array.from(urlObj.searchParams.entries())) {
    const [key, value] = entry;
    if (key.includes('[') && key.includes(']')) {
      const baseKey = key.substring(0, key.indexOf('['));
      const index = key.substring(key.indexOf('[') + 1, key.indexOf(']'));

      if (!params[baseKey]) {
        params[baseKey] = [];
      }
      params[baseKey][parseInt(index)] = value;
    } else {
      params[key] = value;
    }
  }

  return params;
}

// Generate auth headers - DIFFERENT approach for POST
function generateAuthHeaders(publicToken: string, privateToken: string, requestData = {}, isGetRequest = false) {
  const timestamp = Math.floor(Date.now() / 1000).toString();

  let signatureData = '';

  if (isGetRequest) {
    const flattenedData = flattenParamsForGet(requestData);
    const allParams = {
      ...flattenedData,
      timestamp: timestamp,
    };
    console.log('🎯 GET signature: Using individual fields approach');
    console.log('📊 Request data being used for signature:', JSON.stringify(allParams, null, 2));
    signatureData = generateSignature(allParams, privateToken);
  } else {
    // FOR POST: Try using ONLY timestamp for signature calculation
    console.log('🔄 POST signature: Using ONLY timestamp approach (like some APIs)');
    const timestampOnly = { timestamp: timestamp };
    console.log('📊 Request data being used for signature:', JSON.stringify(timestampOnly, null, 2));
    signatureData = generateSignature(timestampOnly, privateToken);
  }

  const headers = {
    'Content-Type': 'application/json',
    'Public-token': publicToken,
    sign: signatureData,
    timestamp: timestamp,
    'User-Agent': 'Trustoo-API-Client/1.0.0',
  };

  console.log('📋 Final headers being sent:', {
    'Content-Type': headers['Content-Type'],
    'Public-token': publicToken.substring(0, 15) + '...',
    sign: signatureData,
    timestamp: timestamp,
    'User-Agent': headers['User-Agent'],
  });

  return headers;
}

// Sleep function for retry delays
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Enhanced fetch with retry logic
async function fetchWithRetry(url: string, options: any, maxRetries = 3) {
  let lastError: Error | undefined;
  lastError = undefined;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    console.log(`🔄 Attempt ${attempt}/${maxRetries} to reach ${url}`);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log(`✅ Request successful on attempt ${attempt}`);
      return response;
    } catch (error) {
      lastError = error as Error;
      console.log(`❌ Attempt ${attempt} failed:`, error instanceof Error ? error.message : String(error));

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.log(`   → Request timeout on attempt ${attempt}`);
        } else if (error.message.includes('ETIMEDOUT')) {
          console.log(`   → Network timeout on attempt ${attempt}`);
        } else if (error.message.includes('ENOTFOUND')) {
          console.log(`   → DNS resolution failed on attempt ${attempt}`);
          break;
        } else if (error.message.includes('ECONNREFUSED')) {
          console.log(`   → Connection refused on attempt ${attempt}`);
        }
      }

      if (attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
        console.log(`   ⏱️  Waiting ${delay}ms before retry...`);
        await sleep(delay);
      }
    }
  }

  throw new Error(
    `Failed to connect after ${maxRetries} attempts. Last error: ${lastError ? lastError.message : undefined}`
  );
}

// Test connectivity
async function testTrustooConnectivity() {
  const { baseUrl } = getTrustooConfig();

  console.log(`🔍 Testing connectivity to ${baseUrl}...`);

  try {
    const response = await fetchWithRetry(
      baseUrl,
      {
        method: 'HEAD',
      },
      2
    );

    console.log(`✅ Connectivity test successful. Status: ${response.status}`);
    return true;
  } catch (error) {
    console.error('🚨 Connectivity test failed:', error);
    return false;
  }
}

// Main API request function
async function makeTrustooRequest(endpoint: string, options = {} as any) {
  const { publicToken, privateToken, baseUrl } = getTrustooConfig();
  const fullUrl = `${baseUrl}${endpoint}`;
  const isGetRequest = (options.method || 'GET') !== 'POST';

  let requestData = {} as any;

  if (isGetRequest && endpoint.includes('?')) {
    requestData = extractQueryParams(fullUrl);
  }

  if (!isGetRequest && options.body) {
    try {
      const bodyData = JSON.parse(options.body);
      console.log('📝 POST body data:', bodyData);
      requestData = bodyData;
    } catch (e) {
      console.warn('Could not parse request body:', e);
    }
  }

  const headers = generateAuthHeaders(publicToken, privateToken, requestData, isGetRequest);

  console.log('🚀 Making Trustoo API request:', {
    url: fullUrl,
    method: options.method || 'GET',
    isGetRequest,
  });

  const response = await fetchWithRetry(
    fullUrl,
    {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    },
    3
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Trustoo API HTTP error:', {
      status: response.status,
      statusText: response.statusText,
      body: errorText,
      url: fullUrl,
    });
    throw new Error(`Trustoo API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();

  if (data.code !== undefined && data.code !== 0 && data.code !== 2000) {
    console.error('❌ Trustoo API business logic error:', data);

    if (data.code === 16) {
      throw new Error(
        `Authentication failed. Please check your Trustoo API credentials and signature calculation. Error: ${data.message}`
      );
    }

    throw new Error(`API error (${data.code}): ${data.message || 'Unknown error'}`);
  }

  console.log('✅ Trustoo API request successful');
  return data;
}

// GET /api/trustoo/reviews
export async function GET(request: any) {
  try {
    const isConnected = await testTrustooConnectivity();
    if (!isConnected) {
      return NextResponse.json(
        {
          error: 'Cannot connect to Trustoo API. Please check network connectivity.',
          troubleshooting: 'Check the server logs for detailed network diagnostics.',
        },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const trustooParams = new URLSearchParams();

    // Handle array parameters
    const productIds = searchParams.getAll('product_ids[]');
    if (productIds.length > 0) {
      productIds.forEach((id, index) => {
        trustooParams.append(`product_ids[${index}]`, id);
      });
    }

    const ratings = searchParams.getAll('ratings[]');
    if (ratings.length > 0) {
      ratings.forEach((rating, index) => {
        trustooParams.append(`ratings[${index}]`, rating);
      });
    }

    const sources = searchParams.getAll('sources[]');
    if (sources.length > 0) {
      sources.forEach((source, index) => {
        trustooParams.append(`sources[${index}]`, source);
      });
    }

    // Handle single parameters
    const singleParams = ['is_store_review', 'keyword', 'sort_by', 'page_size', 'page'];
    singleParams.forEach((param) => {
      const value = searchParams.get(param);
      if (value) {
        trustooParams.append(param, value);
      }
    });

    const queryString = trustooParams.toString();
    const endpoint = `/api/v1/openapi/get_reviews${queryString ? `?${queryString}` : ''}`;
    console.log('📍 Trustoo API endpoint:', endpoint);

    const response = await makeTrustooRequest(endpoint);
    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ Error in /api/trustoo/reviews GET:', error);

    let errorMessage = 'Internal server error';
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes('Failed to connect after')) {
        errorMessage = 'Unable to connect to Trustoo API after multiple attempts.';
        statusCode = 503;
      } else if (error.message.includes('Network connectivity issue')) {
        errorMessage = error.message;
        statusCode = 503;
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}

// POST /api/trustoo/reviews
export async function POST(request: any) {
  try {
    const body = await request.json();

    console.log('📝 Creating review with data:', {
      productId: body.product_id,
      author: body.author,
      rating: body.rating,
      hasContent: !!body.content,
    });

    const response = await makeTrustooRequest('/api/v1/openapi/create_review', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    console.log('✅ Review created successfully');
    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ Error in /api/trustoo/reviews POST:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/trustoo/reviews
export async function DELETE(request: any) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
    }

    console.log('🗑️ Deleting review with ID:', id);

    const response = await makeTrustooRequest('/api/v1/openapi/delete_review', {
      method: 'POST',
      body: JSON.stringify({ id: parseInt(id, 10) }),
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error('❌ Error in /api/trustoo/reviews DELETE:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

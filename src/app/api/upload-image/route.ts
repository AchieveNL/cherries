import { NextRequest, NextResponse } from 'next/server';

// Try edge runtime if nodejs doesn't work
export const runtime = 'edge';
// Force dynamic rendering - prevents static optimization
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  console.log('=== POST function called ===');
  console.log('Environment check:', {
    SHOPIFY_STORE_DOMAIN: !!process.env.SHOPIFY_STORE_DOMAIN,
    SHOPIFY_ACCESS_TOKEN: !!process.env.SHOPIFY_ACCESS_TOKEN,
    NODE_ENV: process.env.NODE_ENV,
  });

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large. Maximum size is 5MB' }, { status: 400 });
    }

    // Ensure file is not empty
    if (file.size === 0) {
      return NextResponse.json({ error: 'File is empty' }, { status: 400 });
    }

    console.log('File details:', {
      name: file.name,
      type: file.type,
      size: file.size,
    });

    // Step 1: Create a staged upload
    const shopifyUrl = `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/graphql.json`;
    console.log('About to make staged upload request to:', shopifyUrl);
    console.log('Environment variables check:', {
      SHOPIFY_STORE_DOMAIN: process.env.SHOPIFY_STORE_DOMAIN,
      SHOPIFY_ACCESS_TOKEN: process.env.SHOPIFY_ACCESS_TOKEN ? 'Present' : 'Missing',
      NODE_ENV: process.env.NODE_ENV,
    });

    const requestBody = JSON.stringify({
      query: `
        mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
          stagedUploadsCreate(input: $input) {
            stagedTargets {
              url
              resourceUrl
              parameters {
                name
                value
              }
            }
            userErrors {
              field
              message
            }
          }
        }
      `,
      variables: {
        input: [
          {
            resource: 'FILE',
            filename: file.name,
            mimeType: file.type,
            fileSize: file.size.toString(),
          },
        ],
      },
    });

    console.log('Request body length:', requestBody.length);

    const stagedUploadResponse = await fetch(shopifyUrl, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN!,
        'Content-Type': 'application/json',
      },
      body: requestBody,
    });

    if (!stagedUploadResponse.ok) {
      const errorText = await stagedUploadResponse.text();
      console.error('Staged upload request failed:', stagedUploadResponse.status, errorText);
      console.error('Response headers:', Object.fromEntries(stagedUploadResponse.headers.entries()));

      // Log more details for debugging
      console.error('Request details:', {
        url: shopifyUrl,
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN ? 'Present' : 'Missing',
          'Content-Type': 'application/json',
        },
      });

      throw new Error(`Staged upload request failed: ${stagedUploadResponse.status} - ${errorText}`);
    }

    const stagedData = await stagedUploadResponse.json();
    console.log('Staged upload response:', JSON.stringify(stagedData, null, 2));

    if (stagedData.data?.stagedUploadsCreate?.userErrors?.length > 0) {
      throw new Error(stagedData.data.stagedUploadsCreate.userErrors[0].message);
    }

    if (!stagedData.data?.stagedUploadsCreate?.stagedTargets?.length) {
      throw new Error('No staged targets returned from Shopify');
    }

    const target = stagedData.data.stagedUploadsCreate.stagedTargets[0];
    console.log('Upload target:', target);

    if (!target.url || !target.parameters) {
      throw new Error('Invalid staged target response');
    }

    // Step 2: Upload the file to the staged URL
    // For Google Cloud Storage, we need to use PUT with the file as body
    // and set the content-type header from the parameters
    const contentType = target.parameters.find((p: any) => p.name === 'content_type')?.value || file.type;

    console.log('Uploading to URL:', target.url);
    console.log(
      'Upload parameters:',
      target.parameters.map((p: any) => `${p.name}: ${p.value}`)
    );
    console.log('Using content type:', contentType);

    const uploadResponse = await fetch(target.url, {
      method: 'PUT',
      headers: {
        'Content-Type': contentType,
      },
      body: file,
    });

    console.log('Upload response status:', uploadResponse.status);
    console.log('Upload response headers:', Object.fromEntries(uploadResponse.headers.entries()));

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error('Upload failed with status:', uploadResponse.status);
      console.error('Upload error response:', errorText);
      throw new Error(`Failed to upload file to staged URL: ${uploadResponse.status} - ${errorText}`);
    }

    console.log('Upload successful, status:', uploadResponse.status);

    // Step 3: Create the file in Shopify
    const createFileResponse = await fetch(
      `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/graphql.json`,
      {
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation fileCreate($files: [FileCreateInput!]!) {
              fileCreate(files: $files) {
                files {
                  id
                  alt
                  createdAt
                  fileStatus
                  preview {
                    image {
                      url
                    }
                  }
                }
                userErrors {
                  field
                  message
                }
              }
            }
          `,
          variables: {
            files: [
              {
                alt: 'Review image',
                originalSource: target.resourceUrl,
              },
            ],
          },
        }),
      }
    );

    if (!createFileResponse.ok) {
      const errorText = await createFileResponse.text();
      console.error('File creation request failed:', createFileResponse.status, errorText);
      throw new Error(`File creation request failed: ${createFileResponse.status}`);
    }

    const fileData = await createFileResponse.json();
    console.log('File creation response:', JSON.stringify(fileData, null, 2));

    if (fileData.data?.fileCreate?.userErrors?.length > 0) {
      throw new Error(fileData.data.fileCreate.userErrors[0].message);
    }

    if (!fileData.data?.fileCreate?.files?.length) {
      throw new Error('No files returned from file creation');
    }

    const createdFile = fileData.data.fileCreate.files[0];
    console.log('File created successfully:', createdFile.id);

    // Check file status and handle preview URL
    let imageUrl = createdFile.preview?.image?.url;

    // If preview is not ready yet, use resourceUrl as fallback or wait
    if (!imageUrl && createdFile.fileStatus === 'UPLOADED') {
      console.log('Preview not ready yet, using resourceUrl as fallback');
      imageUrl = target.resourceUrl;
    }

    // If file is still processing, we might want to wait a bit
    if (createdFile.fileStatus !== 'UPLOADED') {
      console.warn('File not fully processed yet, status:', createdFile.fileStatus);
    }

    return NextResponse.json({
      url: imageUrl || target.resourceUrl, // Use resourceUrl as ultimate fallback
      filename: file.name,
      shopifyFileId: createdFile.id,
      fileStatus: createdFile.fileStatus,
      previewReady: !!createdFile.preview?.image?.url,
    });
  } catch (error) {
    console.error('Shopify upload error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to upload to Shopify',
      },
      { status: 500 }
    );
  }
}

// Optional: Add a separate endpoint to check file status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get('fileId');

    if (!fileId) {
      return NextResponse.json({ error: 'File ID required' }, { status: 400 });
    }

    const response = await fetch(`https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/graphql.json`, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN!,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
            query getFile($id: ID!) {
              node(id: $id) {
                ... on MediaImage {
                  id
                  alt
                  fileStatus
                  preview {
                    image {
                      url
                    }
                  }
                }
              }
            }
          `,
        variables: {
          id: fileId,
        },
      }),
    });

    const data = await response.json();
    const file = data.data?.node;

    if (!file) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: file.id,
      url: file.preview?.image?.url,
      fileStatus: file.fileStatus,
      previewReady: !!file.preview?.image?.url,
    });
  } catch (error) {
    console.error('File status check error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to check file status',
      },
      { status: 500 }
    );
  }
}

import { createStorefrontClient } from '@shopify/hydrogen-react';

import type {
  Collection,
  CollectionConnection,
  Product,
  ProductConnection,
} from '@shopify/hydrogen-react/storefront-api-types';
import type { PartialDeep } from 'type-fest';

// Create Shopify client
export const client = createStorefrontClient({
  storeDomain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN!,
  storefrontApiVersion: '2025-04',
  privateStorefrontToken: process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
  contentType: 'json',
});

// Helper function for making requests
async function shopifyRequest<T>(query: string, variables: Record<string, any> = {}): Promise<T | null> {
  try {
    const response = await fetch(client.getStorefrontApiUrl(), {
      body: JSON.stringify({
        query,
        variables,
      }),
      headers: client.getPrivateTokenHeaders(),
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const json = await response.json();

    if (json.errors) {
      console.error('GraphQL errors:', json.errors);
      return null;
    }

    return json.data;
  } catch (error) {
    console.error('Shopify API error:', error);
    return null;
  }
}

// Helper function to normalize PageInfo
function normalizePageInfo(pageInfo: any) {
  return {
    hasNextPage: pageInfo?.hasNextPage || false,
    hasPreviousPage: pageInfo?.hasPreviousPage || false,
    startCursor: pageInfo?.startCursor || undefined,
    endCursor: pageInfo?.endCursor || undefined,
  };
}

// ===========================
// PRODUCT QUERIES
// ===========================

const PRODUCT_QUERY = `#graphql
  query Product($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      vendor
      productType
      tags
      availableForSale
      totalInventory
      createdAt
      updatedAt
      publishedAt
      onlineStoreUrl

      # Featured image
      featuredImage {
        id
        url
        altText
        width
        height
      }

      # All images
      images(first: 20) {
        nodes {
          id
          url
          altText
          width
          height
        }
      }

      # Complete media including videos
      media(first: 20) {
        nodes {
          ... on ExternalVideo {
            id
            mediaContentType
            alt
            embedUrl
            host
            originUrl
            previewImage {
              id
              url
              altText
              width
              height
            }
          }
          ... on Video {
            id
            mediaContentType
            alt
            previewImage {
              id
              url
              altText
              width
              height
            }
            sources {
              url
              mimeType
              format
              height
              width
            }
          }
          ... on MediaImage {
            id
            mediaContentType
            alt
            image {
              id
              url
              altText
              width
              height
            }
          }
          ... on Model3d {
            id
            mediaContentType
            alt
            previewImage {
              id
              url
              altText
              width
              height
            }
            sources {
              url
              mimeType
              format
              filesize
            }
          }
        }
      }

      options {
        id
        name
        values
      }
      variants(first: 100) {
        nodes {
          id
          title
          sku
          availableForSale
          quantityAvailable
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
          image {
            id
            url
            altText
            width
            height
          }
        }
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      seo {
        title
        description
      }
      metafields(identifiers: [
        {namespace: "custom", key: "rating"}
        {namespace: "custom", key: "review_count"}
        {namespace: "custom", key: "features"}
        {namespace: "custom", key: "preparation"}
        {namespace: "custom", key: "allergens"}
        {namespace: "custom", key: "important_notice"}
        {namespace: "custom", key: "shipping_info"}
        {namespace: "custom", key: "return_policy"}
        {namespace: "custom", key: "video_url"}
        {namespace: "custom", key: "size_guide"}
      ]) {
        id
        namespace
        key
        value
        type
      }
      collections(first: 5) {
        nodes {
          id
          title
          handle
        }
      }
    }
  }
`;

const PRODUCTS_QUERY = `#graphql
  query Products($first: Int!, $sortKey: ProductSortKeys!, $reverse: Boolean!, $query: String) {
    products(first: $first, sortKey: $sortKey, reverse: $reverse, query: $query) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      nodes {
        id
        title
        handle
        description
        descriptionHtml
        vendor
        productType
        tags
        availableForSale
        createdAt
        updatedAt
        publishedAt
        onlineStoreUrl

        # Featured image
        featuredImage {
          id
          url
          altText
          width
          height
        }

        # All images
        images(first: 10) {
          nodes {
            id
            url
            altText
            width
            height
          }
        }

        # Media including videos
        media(first: 15) {
          nodes {
            ... on ExternalVideo {
              id
              mediaContentType
              alt
              embedUrl
              host
              originUrl
              previewImage {
                id
                url
                altText
                width
                height
              }
            }
            ... on Video {
              id
              mediaContentType
              alt
              previewImage {
                id
                url
                altText
                width
                height
              }
              sources {
                url
                mimeType
                format
                height
                width
              }
            }
            ... on MediaImage {
              id
              mediaContentType
              alt
              image {
                id
                url
                altText
                width
                height
              }
            }
            ... on Model3d {
              id
              mediaContentType
              alt
              previewImage {
                id
                url
                altText
                width
                height
              }
              sources {
                url
                mimeType
                format
                filesize
              }
            }
          }
        }

        # Variants
        variants(first: 25) {
          nodes {
            id
            title
            availableForSale
            quantityAvailable
            currentlyNotInStock
            price {
              amount
              currencyCode
            }
            compareAtPrice {
              amount
              currencyCode
            }
            selectedOptions {
              name
              value
            }
            image {
              id
              url
              altText
              width
              height
            }
            sku
            barcode
            requiresShipping
            taxable
            weight
            weightUnit
            unitPrice {
              amount
              currencyCode
            }
            unitPriceMeasurement {
              measuredType
              quantityUnit
              quantityValue
              referenceUnit
              referenceValue
            }

            # Quantity rules and pricing
            quantityRule {
              minimum
              maximum
              increment
            }

            # Store availability
            storeAvailability(first: 5) {
              nodes {
                available
                quantityAvailable
                pickUpTime
                location {
                  id
                  name
                  address {
                    address1
                    city
                    country
                    provinceCode
                    zip
                  }
                }
              }
            }
          }
        }

        # Price ranges
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        compareAtPriceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }

        # Product options
        options {
          id
          name
          values
        }

        # Collections
        collections(first: 5) {
          nodes {
            id
            title
            handle
          }
        }

        # SEO
        seo {
          title
          description
        }

        # Custom metafields
        metafields(identifiers: [
          {namespace: "custom", key: "rating"}
          {namespace: "custom", key: "review_count"}
          {namespace: "custom", key: "features"}
          {namespace: "custom", key: "care_instructions"}
          {namespace: "custom", key: "video_url"}
          {namespace: "custom", key: "size_guide"}
          {namespace: "custom", key: "material"}
          {namespace: "custom", key: "sustainability"}
          {namespace: "custom", key: "shipping_info"}
        ]) {
          id
          namespace
          key
          value
          type
        }

        # Total inventory
        totalInventory

        # Gift card indicator
        isGiftCard

        # Requires selling plan
        requiresSellingPlan
      }
    }
  }
`;

const PRODUCT_RECOMMENDATIONS_QUERY = `#graphql
  query ProductRecommendations($productId: ID!, $intent: ProductRecommendationIntent!) {
    productRecommendations(productId: $productId, intent: $intent) {
      id
      title
      handle
      description
      vendor
      productType
      tags
      availableForSale
      createdAt
      updatedAt
      onlineStoreUrl

      # Featured image (fallback if images array is empty)
      featuredImage {
        id
        url
        altText
        width
        height
      }

      # Multiple images for variety
      images(first: 3) {
        nodes {
          id
          url
          altText
          width
          height
        }
      }

      # Get multiple variants for better pricing info
      variants(first: 3) {
        nodes {
          id
          title
          availableForSale
          quantityAvailable
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
          image {
            id
            url
            altText
            width
            height
          }
        }
      }

      # Price ranges for better pricing display
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }

      compareAtPriceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }

      # SEO data
      seo {
        title
        description
      }

      # Collections for categorization
      collections(first: 3) {
        nodes {
          id
          title
          handle
        }
      }

      # Custom metafields for ratings, etc.
      metafields(identifiers: [
        {namespace: "custom", key: "rating"}
        {namespace: "custom", key: "review_count"}
        {namespace: "custom", key: "features"}
      ]) {
        id
        namespace
        key
        value
        type
      }
    }
  }
`;

// ===========================
// COLLECTION QUERIES (FIXED)
// ===========================

const COLLECTIONS_QUERY = `#graphql
  query Collections($first: Int!, $sortKey: CollectionSortKeys, $reverse: Boolean, $query: String) {
    collections(first: $first, sortKey: $sortKey, reverse: $reverse, query: $query) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      nodes {
        id
        title
        handle
        description
        descriptionHtml
        updatedAt
        image {
          id
          url
          altText
          width
          height
        }
        seo {
          title
          description
        }
        onlineStoreUrl
      }
    }
  }
`;

const COLLECTION_QUERY = `#graphql
  query Collection($handle: String!) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      updatedAt
      image {
        id
        url
        altText
        width
        height
      }
      seo {
        title
        description
      }
      onlineStoreUrl
    }
  }
`;

const COLLECTION_WITH_PRODUCTS_QUERY = `#graphql
  query CollectionWithProducts(
    $handle: String!,
    $first: Int!,
    $sortKey: ProductCollectionSortKeys,
    $reverse: Boolean,
    $filters: [ProductFilter!]
  ) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      descriptionHtml
      updatedAt
      image {
        id
        url
        altText
        width
        height
      }
      seo {
        title
        description
      }
      onlineStoreUrl
      products(first: $first, sortKey: $sortKey, reverse: $reverse, filters: $filters) {
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
        nodes {
          id
          title
          handle
          description
          vendor
          productType
          tags
          availableForSale
          createdAt
          updatedAt
          onlineStoreUrl

          # Images
          images(first: 10) {
            nodes {
              id
              url
              altText
              width
              height
            }
          }

          # Media (including videos)
          media(first: 10) {
            nodes {
              ... on ExternalVideo {
                id
                mediaContentType
                alt
                embedUrl
                host
                originUrl
                previewImage {
                  id
                  url
                  altText
                  width
                  height
                }
              }
              ... on Video {
                id
                mediaContentType
                alt
                previewImage {
                  id
                  url
                  altText
                  width
                  height
                }
                sources {
                  url
                  mimeType
                  format
                  height
                  width
                }
              }
              ... on MediaImage {
                id
                mediaContentType
                alt
                image {
                  id
                  url
                  altText
                  width
                  height
                }
              }
              ... on Model3d {
                id
                mediaContentType
                alt
                previewImage {
                  id
                  url
                  altText
                  width
                  height
                }
                sources {
                  url
                  mimeType
                  format
                  filesize
                }
              }
            }
          }

          variants(first: 10) {
            nodes {
              id
              title
              availableForSale
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
              selectedOptions {
                name
                value
              }
              image {
                id
                url
                altText
                width
                height
              }
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          compareAtPriceRange {
            minVariantPrice {
              amount
              currencyCode
            }
            maxVariantPrice {
              amount
              currencyCode
            }
          }
          metafields(identifiers: [
            {namespace: "custom", key: "rating"}
            {namespace: "custom", key: "review_count"}
          ]) {
            namespace
            key
            value
          }
        }
      }
    }
  }
`;

// ===========================
// PRODUCT FUNCTIONS
// ===========================

export async function getProduct(handle: string): Promise<PartialDeep<Product, { recurseIntoArrays: true }> | null> {
  const data = await shopifyRequest<{ product: Product }>(PRODUCT_QUERY, { handle });
  return data?.product || null;
}

export async function getProducts({
  first = 20,
  sortKey = 'CREATED_AT',
  reverse = true,
  query = '',
}: {
  first?: number;
  sortKey?:
    | 'BEST_SELLING'
    | 'CREATED_AT'
    | 'ID'
    | 'PRICE'
    | 'PRODUCT_TYPE'
    | 'RELEVANCE'
    | 'TITLE'
    | 'UPDATED_AT'
    | 'VENDOR';
  reverse?: boolean;
  query?: string;
} = {}): Promise<{
  products: PartialDeep<Product, { recurseIntoArrays: true }>[];
  totalCount?: number;
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
}> {
  const data = await shopifyRequest<{ products: ProductConnection }>(PRODUCTS_QUERY, {
    first,
    sortKey,
    reverse,
    query,
  });

  return {
    products: data?.products.nodes || [],
    totalCount: data?.products.nodes?.length || 0,
    pageInfo: normalizePageInfo(data?.products.pageInfo),
  };
}

export async function getProductRecommendations(
  productId: string,
  intent: 'RELATED' | 'COMPLEMENTARY' = 'RELATED',
  limit: number = 8
): Promise<PartialDeep<Product, { recurseIntoArrays: true }>[]> {
  // Input validation
  if (!productId || typeof productId !== 'string') {
    console.warn('getProductRecommendations: Invalid productId provided');
    return [];
  }

  // Validate intent
  if (!['RELATED', 'COMPLEMENTARY'].includes(intent)) {
    console.warn('getProductRecommendations: Invalid intent provided, defaulting to RELATED');
    intent = 'RELATED';
  }

  try {
    const data = await shopifyRequest<{ productRecommendations: Product[] }>(PRODUCT_RECOMMENDATIONS_QUERY, {
      productId,
      intent,
    });

    const recommendations = data?.productRecommendations || [];

    // Log for debugging (remove in production)
    console.log(`Found ${recommendations.length} recommendations for product ${productId} with intent ${intent}`);

    // Filter out any null/undefined products and limit results
    const validRecommendations = recommendations
      .filter((product): product is Product => product !== null && product !== undefined)
      .slice(0, limit);

    return validRecommendations;
  } catch (error) {
    console.error('Error fetching product recommendations:', error);
    return [];
  }
}

// ===========================
// COLLECTION FUNCTIONS (FIXED)
// ===========================

export async function getCollections({
  first = 20,
  sortKey = 'TITLE',
  reverse = false,
  query = '',
}: {
  first?: number;
  sortKey?: 'TITLE' | 'ID' | 'UPDATED_AT' | 'RELEVANCE';
  reverse?: boolean;
  query?: string;
} = {}): Promise<{
  collections: PartialDeep<Collection, { recurseIntoArrays: true }>[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
  totalCount: number;
}> {
  const data = await shopifyRequest<{ collections: CollectionConnection }>(COLLECTIONS_QUERY, {
    first,
    sortKey,
    reverse,
    query,
  });

  return {
    collections: data?.collections.nodes || [],
    pageInfo: normalizePageInfo(data?.collections.pageInfo),
    totalCount: data?.collections.nodes?.length || 0, // Fixed: calculate from nodes length
  };
}

export async function getCollection(
  handle: string
): Promise<PartialDeep<Collection, { recurseIntoArrays: true }> | null> {
  const data = await shopifyRequest<{ collection: Collection }>(COLLECTION_QUERY, { handle });
  return data?.collection || null;
}

export async function getCollectionWithProducts(
  handle: string,
  {
    first = 20,
    sortKey = 'COLLECTION_DEFAULT',
    reverse = false,
    filters = [],
  }: {
    first?: number;
    sortKey?: 'COLLECTION_DEFAULT' | 'BEST_SELLING' | 'CREATED' | 'ID' | 'MANUAL' | 'PRICE' | 'TITLE';
    reverse?: boolean;
    filters?: Array<{
      available?: boolean;
      price?: { min?: number; max?: number };
      productType?: string;
      productVendor?: string;
      tag?: string;
    }>;
  } = {}
): Promise<{
  collection: PartialDeep<Collection, { recurseIntoArrays: true }> | null;
  products: PartialDeep<Product, { recurseIntoArrays: true }>[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
}> {
  const data = await shopifyRequest<{
    collection: Collection & { products: ProductConnection };
  }>(COLLECTION_WITH_PRODUCTS_QUERY, {
    handle,
    first,
    sortKey,
    reverse,
    filters,
  });

  if (!data?.collection) {
    return {
      collection: null,
      products: [],
      pageInfo: normalizePageInfo(null),
    };
  }

  return {
    collection: data.collection,
    products: data.collection.products.nodes,
    pageInfo: normalizePageInfo(data.collection.products.pageInfo),
  };
}

// ===========================
// SEARCH FUNCTIONS
// ===========================

const SEARCH_QUERY = `#graphql
  query Search(
    $query: String!,
    $first: Int!,
    $sortKey: SearchSortKeys!,
    $reverse: Boolean!,
    $productFilters: [ProductFilter!]
  ) {
    search(
      query: $query,
      first: $first,
      sortKey: $sortKey,
      reverse: $reverse,
      productFilters: $productFilters,
      types: [PRODUCT]
    ) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
      productFilters {
        id
        label
        type
        values {
          id
          label
          count
          input
        }
      }
      nodes {
        ... on Product {
          id
          title
          handle
          description
          vendor
          productType
          tags
          availableForSale
          images(first: 1) {
            nodes {
              id
              url
              altText
              width
              height
            }
          }
          variants(first: 1) {
            nodes {
              id
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export async function searchProducts({
  query,
  first = 20,
  sortKey = 'RELEVANCE',
  reverse = false,
  productFilters = [],
}: {
  query: string;
  first?: number;
  sortKey?: 'RELEVANCE' | 'PRICE';
  reverse?: boolean;
  productFilters?: Array<{
    available?: boolean;
    price?: { min?: number; max?: number };
    productType?: string;
    productVendor?: string;
    tag?: string;
  }>;
}): Promise<{
  products: PartialDeep<Product, { recurseIntoArrays: true }>[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
  };
  totalCount: number;
  filters: any[];
}> {
  const data = await shopifyRequest<{
    search: {
      nodes: Product[];
      pageInfo: any;
      totalCount: number;
      productFilters: any[];
    };
  }>(SEARCH_QUERY, {
    query,
    first,
    sortKey,
    reverse,
    productFilters,
  });

  return {
    products: data?.search.nodes || [],
    pageInfo: normalizePageInfo(data?.search.pageInfo),
    totalCount: data?.search.totalCount || 0,
    filters: data?.search.productFilters || [],
  };
}

// ===========================
// UTILITY FUNCTIONS
// ===========================

// Get product types for filtering
export async function getProductTypes(): Promise<string[]> {
  const PRODUCT_TYPES_QUERY = `#graphql
    query ProductTypes($first: Int!) {
      productTypes(first: $first) {
        nodes
      }
    }
  `;

  const data = await shopifyRequest<{ productTypes: { nodes: string[] } }>(PRODUCT_TYPES_QUERY, { first: 100 });

  return data?.productTypes.nodes || [];
}

// Get product vendors for filtering
export async function getProductVendors(): Promise<string[]> {
  const { products } = await getProducts({ first: 250 });
  const vendors = products.map((p) => p.vendor).filter(Boolean) as string[];
  const uniqueVendors = Array.from(new Set(vendors));
  return uniqueVendors.sort();
}

// Get product tags for filtering
export async function getProductTags(): Promise<string[]> {
  const { products } = await getProducts({ first: 250 });
  const tags = products.flatMap((p) => p.tags || []).filter(Boolean) as string[];
  const uniqueTags = Array.from(new Set(tags));
  return uniqueTags.sort();
}

// ===========================
// UTILITY FUNCTIONS FOR MEDIA
// ===========================

export function getProductVideos(product: PartialDeep<Product, { recurseIntoArrays: true }>) {
  if (!product.media?.nodes) return [];

  return product.media.nodes.filter(
    (media) => media?.mediaContentType === 'VIDEO' || media?.mediaContentType === 'EXTERNAL_VIDEO'
  );
}

export function getProductImages(product: PartialDeep<Product, { recurseIntoArrays: true }>) {
  const images = [];

  // Add images from images field
  if (product.images?.nodes) {
    images.push(...product.images.nodes);
  }

  // Add images from media field
  if (product.media?.nodes) {
    const mediaImages = product.media.nodes
      .filter((media) => media?.mediaContentType === 'IMAGE')
      .map((media) => (media as any)?.image)
      .filter(Boolean);
    images.push(...mediaImages);
  }

  return images;
}

export function getProduct3DModels(product: PartialDeep<Product, { recurseIntoArrays: true }>) {
  if (!product.media?.nodes) return [];

  return product.media.nodes.filter((media) => media?.mediaContentType === 'MODEL_3D');
}

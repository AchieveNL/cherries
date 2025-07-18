import ProductsPageComponent from '@/app/_components/products/ProductsPage';
import { getCollections, getProducts } from '@/lib/shopify';
import { FilterState } from '@/types';

export const metadata = {
  title: 'Products',
  description: 'Browse our wide range of products',
};

interface ProductsPageProps {
  searchParams: {
    page?: string;
    search?: string;
    sortBy?: string;
    category?: string;
    vendor?: string;
    availability?: string;
    minPrice?: string;
    maxPrice?: string;
    collections?: string;
    after?: string; // Cursor for next page
    before?: string; // Cursor for previous page
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  try {
    // Parse pagination parameters
    const currentPage = parseInt(searchParams.page || '1', 10);
    const itemsPerPage = 5;

    // Parse and construct filter state from URL parameters
    const filters: FilterState = {
      search: searchParams.search || '',
      category: searchParams.category || '',
      vendor: searchParams.vendor || '',
      availability: (searchParams.availability as FilterState['availability']) || 'all',
      sortBy: (searchParams.sortBy as FilterState['sortBy']) || 'featured',
      priceRange: [parseInt(searchParams.minPrice || '0', 10), parseInt(searchParams.maxPrice || '1000', 10)] as [
        number,
        number,
      ],
      collections: searchParams.collections ? searchParams.collections.split(',').filter(Boolean) : [],
    };

    // Determine if we need client-side filtering
    const hasComplexFilters =
      !!filters.category ||
      !!filters.vendor ||
      filters.availability !== 'all' ||
      filters.priceRange[0] > 0 ||
      filters.priceRange[1] < 1000 ||
      (filters.collections && filters.collections.length > 0);

    // Build Shopify query parameters
    const sortKey = mapSortToShopify(filters.sortBy);
    const shopifyQuery = buildBasicShopifyQuery(filters);

    const isReverse = filters.sortBy === 'oldest' || filters.sortBy === 'priceDesc' || filters.sortBy === 'nameDesc';

    // Build fetch parameters with proper cursor handling
    let fetchParams;
    if (hasComplexFilters) {
      // For complex filters, fetch more products for client-side filtering
      fetchParams = {
        first: 100,
        sortKey,
        query: shopifyQuery,
        reverse: isReverse,
      };
    } else {
      // For server-side pagination, use cursor-based pagination
      fetchParams = {
        first: itemsPerPage,
        ...(searchParams.after && { after: searchParams.after }),
        ...(searchParams.before && { before: searchParams.before }),
        sortKey,
        query: shopifyQuery,
        reverse: isReverse,
      };
    }

    // Fetch products and collections
    const [productsData, collectionsData] = await Promise.all([
      getProducts(fetchParams),
      getCollections({ first: 10 }),
    ]);

    // Extract page info
    const pageInfo = productsData.pageInfo || {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: undefined,
      endCursor: undefined,
    };

    // Calculate total pages for client-side filtering
    const totalPages = hasComplexFilters ? 0 : Math.ceil((productsData.totalCount || 0) / itemsPerPage);

    return (
      <ProductsPageComponent
        products={productsData.products || []}
        totalProducts={productsData.totalCount || 0}
        collections={collectionsData.collections || []}
        hasNextPage={pageInfo.hasNextPage}
        hasPreviousPage={pageInfo.hasPreviousPage}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        initialFilters={filters}
        useClientFiltering={hasComplexFilters}
        pageInfo={pageInfo}
        currentCursor={searchParams.after || searchParams.before}
      />
    );
  } catch (error) {
    console.error('Error fetching products or collections:', error);

    // Fallback filters
    const fallbackFilters: FilterState = {
      search: searchParams.search || '',
      category: searchParams.category || '',
      vendor: searchParams.vendor || '',
      availability: (searchParams.availability as FilterState['availability']) || 'all',
      sortBy: (searchParams.sortBy as FilterState['sortBy']) || 'featured',
      priceRange: [parseInt(searchParams.minPrice || '0', 10), parseInt(searchParams.maxPrice || '1000', 10)] as [
        number,
        number,
      ],
      collections: searchParams.collections ? searchParams.collections.split(',').filter(Boolean) : [],
    };

    return (
      <ProductsPageComponent
        products={[]}
        totalProducts={0}
        collections={[]}
        hasNextPage={false}
        hasPreviousPage={false}
        currentPage={1}
        totalPages={0}
        itemsPerPage={12}
        initialFilters={fallbackFilters}
        useClientFiltering={false}
        hasError={true}
        pageInfo={{ hasNextPage: false, hasPreviousPage: false, startCursor: undefined, endCursor: undefined }}
      />
    );
  }
}

// Build basic Shopify query (only search, not complex filters)
function buildBasicShopifyQuery(filters: FilterState): string {
  const queryParts = [];

  if (filters.search) {
    queryParts.push(`title:*${filters.search}* OR vendor:*${filters.search}* OR product_type:*${filters.search}*`);
  }

  return queryParts.join(' AND ');
}

// Helper function to map filter sortBy to Shopify sort keys
function mapSortToShopify(
  sortBy: FilterState['sortBy']
): 'TITLE' | 'ID' | 'UPDATED_AT' | 'RELEVANCE' | 'PRICE' | 'BEST_SELLING' | 'CREATED_AT' | 'PRODUCT_TYPE' | 'VENDOR' {
  const sortMap: Record<
    FilterState['sortBy'],
    'TITLE' | 'ID' | 'UPDATED_AT' | 'RELEVANCE' | 'PRICE' | 'BEST_SELLING' | 'CREATED_AT' | 'PRODUCT_TYPE' | 'VENDOR'
  > = {
    featured: 'RELEVANCE',
    newest: 'CREATED_AT',
    oldest: 'CREATED_AT',
    priceAsc: 'PRICE',
    priceDesc: 'PRICE',
    nameAsc: 'TITLE',
    nameDesc: 'TITLE',
  };

  return sortMap[sortBy] || 'RELEVANCE';
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import CollectionsPage from '@/app/_components/collections/CollectionsPage';
import { getCollections } from '@/lib/shopify';

export const metadata = {
  title: 'Collections',
  description: 'Browse our curated collections of products',
};

interface SearchParams {
  page?: string;
  sort?: string;
  search?: string;
  after?: string; // Add cursor parameters
  before?: string;
}

export default async function Collections({ searchParams }: { searchParams: SearchParams }) {
  const currentPage = Number(searchParams?.page) || 1;
  const itemsPerPage = 12;
  const sortKey = searchParams?.sort === 'updated' ? 'UPDATED_AT' : 'TITLE';
  const search = searchParams?.search || '';

  try {
    // Build fetch parameters with cursor support
    const fetchParams: {
      sortKey: 'TITLE' | 'ID' | 'UPDATED_AT' | 'RELEVANCE';
      reverse: boolean;
      query: string;
      first?: number;
      last?: number;
      after?: string;
      before?: string;
    } = {
      sortKey: (searchParams?.sort === 'updated' ? 'UPDATED_AT' : 'TITLE') as 'TITLE' | 'UPDATED_AT',
      reverse: sortKey === 'UPDATED_AT',
      query: search,
      ...(searchParams.after && { after: searchParams.after }),
      ...(searchParams.before && { before: searchParams.before }),
    };

    // Use proper cursor logic
    if (searchParams.before) {
      fetchParams.last = itemsPerPage;
    } else {
      fetchParams.first = itemsPerPage;
    }

    const { collections, pageInfo, totalCount } = await getCollections(fetchParams);

    // Calculate total pages (note: this is approximate since Shopify doesn't provide exact totals)
    const totalPages = Math.ceil(totalCount / itemsPerPage);

    return (
      <CollectionsPage
        collections={collections}
        totalCollections={totalCount}
        hasNextPage={pageInfo.hasNextPage}
        hasPreviousPage={pageInfo.hasPreviousPage}
        currentPage={currentPage}
        totalPages={totalPages}
        pageInfo={pageInfo}
        currentCursor={searchParams.after || searchParams.before}
      />
    );
  } catch (error) {
    console.error('Error fetching collections:', error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Unable to load collections</h1>
            <p className="text-gray-600">Please try again later or contact support if the problem persists.</p>
          </div>
        </div>
      </div>
    );
  }
}

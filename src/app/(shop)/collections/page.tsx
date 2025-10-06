import CollectionsPage from '@/app/_components/collections/CollectionsPage';
import { getCollections } from '@/lib/shopify';

/* eslint-disable @typescript-eslint/no-unused-vars */
export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Collections',
  description: 'Browse our curated collections of products',
};

export default async function Collections() {
  try {
    // Load ALL collections on the server - no search/pagination parameters
    const { collections, totalCount } = await getCollections({
      sortKey: 'TITLE',
      reverse: false,
      query: '', // Empty query to get all collections
      first: 250, // Increase to get all collections or adjust based on your needs
    });

    return <CollectionsPage collections={collections} totalCollections={totalCount} />;
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

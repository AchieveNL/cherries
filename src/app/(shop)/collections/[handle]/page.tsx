/* eslint-disable @typescript-eslint/no-unused-vars */
import { notFound } from 'next/navigation';

import CollectionPage from '@/app/_components/collections/CollectionPage';
import { getCollections, getCollectionWithProducts } from '@/lib/shopify';

interface CollectionPageProps {
  params: { handle: string };
  searchParams: {
    page?: string;
    sort?: string;
    filters?: string;
  };
}

export async function generateMetadata({ params }: { params: { handle: string } }) {
  const collection = await getCollectionWithProducts(params.handle);

  if (!collection.collection) {
    return {
      title: 'Collection Not Found',
    };
  }

  return {
    title: collection.collection.title,
    description: collection.collection.description || `Shop ${collection.collection.title} collection`,
    openGraph: {
      title: collection.collection.title,
      description: collection.collection.description || `Shop ${collection.collection.title} collection`,
      images: collection.collection.image?.url ? [collection.collection.image.url] : [],
    },
  };
}

export default async function Collection({ params, searchParams }: CollectionPageProps) {
  const _page = Number(searchParams?.page) || 1;
  const itemsPerPage = 24;

  // Map URL sort params to Shopify sort keys
  const sortKeyMap = {
    newest: 'CREATED',
    oldest: 'CREATED',
    'price-asc': 'PRICE',
    'price-desc': 'PRICE',
    'name-asc': 'TITLE',
    'name-desc': 'TITLE',
    'best-selling': 'BEST_SELLING',
  };

  const sortParam = searchParams?.sort || 'featured';
  const sortKey = sortKeyMap[sortParam as keyof typeof sortKeyMap] || 'COLLECTION_DEFAULT';
  const reverse = ['oldest', 'price-desc', 'name-desc'].includes(sortParam);

  try {
    // Fetch collection with products
    const { collection, products, pageInfo } = await getCollectionWithProducts(params.handle, {
      first: itemsPerPage,
      sortKey: sortKey as any,
      reverse,
    });

    if (!collection) {
      notFound();
    }

    // Fetch all collections for sidebar
    const { collections } = await getCollections({
      first: 50,
      sortKey: 'TITLE',
    });

    return (
      <CollectionPage
        collection={collection}
        products={products}
        collections={collections}
        totalProducts={products.length}
        hasNextPage={pageInfo.hasNextPage}
        hasPreviousPage={pageInfo.hasPreviousPage}
      />
    );
  } catch (error) {
    console.error('Error fetching collection:', error);
    notFound();
  }
}

// Generate static paths for popular collections (optional)
export async function generateStaticParams() {
  try {
    const { collections } = await getCollections({
      first: 10, // Generate static pages for first 10 collections
      sortKey: 'TITLE',
    });

    return collections.map((collection) => ({
      handle: collection.handle,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

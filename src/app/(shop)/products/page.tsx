import ProductsPageComponent from '@/app/_components/products/ProductsPage';
import { getCollections, getProducts } from '@/lib/shopify';

export const metadata = {
  title: 'Products',
  description: 'Browse our wide range of products',
};

export default async function ProductsPage() {
  try {
    const [productsData, collectionsData] = await Promise.all([
      getProducts({ first: 20, sortKey: 'CREATED_AT' }),
      getCollections({ first: 10 }),
    ]);

    return (
      <ProductsPageComponent
        products={productsData.products}
        totalProducts={productsData.totalCount}
        collections={collectionsData.collections}
        hasNextPage={productsData.pageInfo.hasNextPage}
        hasPreviousPage={productsData.pageInfo.hasPreviousPage}
      />
    );
  } catch (error) {
    console.error('Error fetching products or collections:', error);
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

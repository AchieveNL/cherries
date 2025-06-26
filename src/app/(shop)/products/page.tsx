import ProductsPageComponent from '@/app/_components/products/ProductsPage';
import { getCollections, getProducts } from '@/lib/shopify';

export default async function ProductsPage() {
  const [productsData, collectionsData] = await Promise.all([
    getProducts({ first: 20, sortKey: 'BEST_SELLING' }),
    getCollections({ first: 10 }),
  ]);

  console.log('Products Data:', productsData);

  return (
    <ProductsPageComponent
      products={productsData.products}
      totalProducts={productsData.totalCount}
      collections={collectionsData.collections}
      hasNextPage={productsData.pageInfo.hasNextPage}
      hasPreviousPage={productsData.pageInfo.hasPreviousPage}
    />
  );
}

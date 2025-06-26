import { notFound } from 'next/navigation';

import ProductPageClient from '@/app/_components/ProductPageClient';
import { getProduct } from '@/lib/shopify';

interface PageProps {
  params: {
    handle: string;
  };
}

export async function generateMetadata({ params }: PageProps) {
  const product = await getProduct(params.handle);

  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: product.seo?.title || product.title,
    description: product.seo?.description || product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.images?.nodes?.map((image: any) => ({
        url: image.url,
        width: image.width,
        height: image.height,
        alt: image.altText || product.title,
      })),
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const product = await getProduct(params.handle);

  if (!product) {
    notFound();
  }

  return <ProductPageClient product={product} />;
}

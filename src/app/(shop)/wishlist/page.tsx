import { Metadata } from 'next';

import WishlistPage from '@/app/_components/wishList/wishListPage';

export const metadata: Metadata = {
  title: 'My Wishlist | CaseHub',
  description: 'View and manage your saved products',
};

export default function Wishlist() {
  return <WishlistPage />;
}

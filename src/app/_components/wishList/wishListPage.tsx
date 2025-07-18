'use client';

import { ArrowRight, Grid, Heart, List, ShoppingCart, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { useWishlist } from '../layout/context/wishList';
import { ProductCard } from '../products';

export default function WishlistPage() {
  const { items, clearWishlist, isLoading } = useWishlist();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin h-12 w-12 border-2 border-primary border-t-transparent mx-auto rounded-full"></div>
          <p className="text-gray-600 font-medium">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  const handleClearWishlist = () => {
    clearWishlist();
    setShowClearConfirm(false);
  };

  // Convert wishlist items back to product format for ProductCard
  const convertWishlistItemToProduct = (item: any) => {
    return {
      id: item.id,
      handle: item.handle,
      title: item.title,
      description: '', // Wishlist items don't store description
      createdAt: item.createdAt,
      variants: {
        nodes: [
          {
            id: `${item.id}-variant`, // Generate a variant ID
            price: item.price,
            compareAtPrice: item.compareAtPrice,
            availableForSale: item.availableForSale,
            selectedOptions: [],
          },
        ],
      },
      images: item.image
        ? {
            nodes: [item.image],
          }
        : { nodes: [] },
      media: { nodes: [] },
      tags: [],
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold font-bungee text-gray-900 flex items-center space-x-3">
                <Heart className="w-8 h-8 text-primary" />
                <span>My Wishlist</span>
              </h1>
              <p className="text-gray-600 mt-2">
                {items.length === 0
                  ? 'Your wishlist is empty'
                  : `${items.length} item${items.length !== 1 ? 's' : ''} saved for later`}
              </p>
            </div>

            {items.length > 0 && (
              <div className="flex items-center space-x-4">
                {/* View Mode Toggle */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'grid' ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-colors ${
                      viewMode === 'list' ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                    aria-label="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear All</span>
                </button>

                <Link
                  href="/products"
                  className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center space-x-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Continue Shopping</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {items.length === 0 ? (
          // Empty State
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
              <p className="text-gray-600 mb-8">Start browsing our products and add items you love to your wishlist.</p>
              <Link
                href="/products"
                className="bg-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors inline-flex items-center space-x-2"
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Start Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          // Wishlist Items using ProductCard
          <div
            className={`
            ${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}
          `}
          >
            {items.map((item) => {
              const product = convertWishlistItemToProduct(item);
              return (
                <div key={item.id} className="relative">
                  <ProductCard product={product} viewMode={viewMode} />

                  {/* Wishlist-specific overlay with added date */}
                  <div className="absolute top-2 right-2 bg-white rounded-lg shadow-md p-2 text-xs text-gray-500 opacity-0 hover:opacity-100 transition-opacity">
                    Added {new Date(item.addedToWishlistAt).toLocaleDateString()}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <Trash2 className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Clear Wishlist</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to remove all items from your wishlist? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearWishlist}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

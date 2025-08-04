'use client';

import { useCart } from '@shopify/hydrogen-react';
import { ArrowRight, Heart, List, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { GridIcon } from '../icons/products/GridIcon';
import { CartIcon, RectangleIcon, TrashIcon } from '../icons/shared';
import { useWishlist } from '../layout/context/wishList';
import { ProductCard } from '../products';
import { Button } from '../ui';

export default function WishlistPage() {
  const { items, clearWishlist, isLoading } = useWishlist();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isAddingAllToCart, setIsAddingAllToCart] = useState(false);
  const [addAllSuccessMessage, setAddAllSuccessMessage] = useState('');

  // Get cart functions from Hydrogen
  const { linesAdd, status } = useCart();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-gray-600 font-medium">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  const handleClearWishlist = () => {
    clearWishlist();
    setShowClearConfirm(false);
  };

  // Function to add all wishlist items to cart
  const handleAddAllToCart = async () => {
    if (!items.length) return;

    setIsAddingAllToCart(true);
    setAddAllSuccessMessage('');

    try {
      // Prepare cart lines for all wishlist items
      const cartLines = items
        .filter((item) => item.availableForSale && item.variantId) // Only add available items with valid variant IDs
        .map((item) => ({
          merchandiseId: item.variantId, // Use the stored variant ID
          quantity: 1,
        }));

      if (cartLines.length === 0) {
        const availableItemsWithoutVariants = items.filter((item) => item.availableForSale && !item.variantId).length;
        if (availableItemsWithoutVariants > 0) {
          setAddAllSuccessMessage(
            'Some items cannot be added due to missing variant information. Please try adding them individually.'
          );
        } else {
          setAddAllSuccessMessage('No available items to add to cart');
        }
        setIsAddingAllToCart(false);
        return;
      }

      // Add all items to cart using Hydrogen's linesAdd
      await linesAdd(cartLines);

      // Show success message
      const availableCount = cartLines.length;
      const unavailableCount = items.length - availableCount;

      let message = `${availableCount} item${availableCount !== 1 ? 's' : ''} added to cart!`;
      if (unavailableCount > 0) {
        message += ` (${unavailableCount} unavailable item${unavailableCount !== 1 ? 's' : ''} skipped)`;
      }

      setAddAllSuccessMessage(message);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setAddAllSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Failed to add items to cart:', error);
      setAddAllSuccessMessage('Failed to add items to cart. Please try again.');

      setTimeout(() => {
        setAddAllSuccessMessage('');
      }, 3000);
    } finally {
      setIsAddingAllToCart(false);
    }
  };

  // Convert wishlist items back to product format for ProductCard
  const convertWishlistItemToProduct = (item: any) => {
    return {
      id: item.id,
      handle: item.handle,
      title: item.title,
      description: item.description,
      createdAt: item.createdAt,
      variants: {
        nodes: [
          {
            id: item.variantId, // Use the stored variant ID
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

  // Count available items with valid variant IDs
  const availableItemsCount = items.filter((item) => item.availableForSale && item.variantId).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-8 max-w-8xl">
          <div className="flex md:flex-row flex-col space-y-4 md:space-y-0 items-center justify-between">
            <div className="flex items-center  space-x-4">
              <h1 className="text-base uppercase font-bold font-bungee text-gray-900 flex items-center space-x-3">
                <span className="">My Wish list</span>
              </h1>
              <RectangleIcon />
              <p className="text-black text-base uppercase">
                {items.length === 0
                  ? 'Your wishlist is empty'
                  : `${items.length} item${items.length !== 1 ? 's' : ''} saved for later`}
              </p>
            </div>

            {items.length > 0 && (
              <div className="flex items-center space-x-4">
                {/* View Mode Toggle */}
                <div className="flex items-center bg-gray-100 p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 transition-colors ${
                      viewMode === 'grid' ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                    aria-label="Grid view"
                  >
                    <GridIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 transition-colors ${
                      viewMode === 'list' ? 'bg-white text-primary shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                    aria-label="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => setShowClearConfirm(true)}
                  className="flex items-center space-x-2 text-black hover:text-primary transition-colors"
                >
                  <TrashIcon />
                  <span>Clear All</span>
                </button>

                <Link href="/products">
                  <Button
                    variant="black"
                    className="px-6 py-3 font-semibold transition-colors flex items-center space-x-2"
                  >
                    <CartIcon />
                    <span>Continue Shopping</span>
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-8xl">
        {items.length === 0 ? (
          // Empty State
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <Heart className="w-24 h-24 text-gray-300 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your wishlist is empty</h2>
              <p className="text-gray-600 mb-8">Start browsing our products and add items you love to your wishlist.</p>
              <Link
                href="/products"
                className="bg-primary text-white px-8 py-4 font-semibold hover:bg-primary/90 transition-colors inline-flex items-center space-x-2"
              >
                <CartIcon className="w-5 h-5" />
                <span>Start Shopping</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Bar */}
            {availableItemsCount < items.length && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-amber-800 text-sm">
                  <span className="font-medium">{items.length - availableItemsCount}</span> item
                  {items.length - availableItemsCount !== 1 ? 's are' : ' is'} currently out of stock and cannot be
                  added to cart.
                </p>
              </div>
            )}

            {/* Wishlist Items using ProductCard */}
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
                    <div className="absolute top-2 right-2 bg-white shadow-md p-2 text-xs text-gray-500 opacity-0 hover:opacity-100 transition-opacity">
                      Added {new Date(item.addedToWishlistAt).toLocaleDateString()}
                    </div>

                    {/* Out of stock overlay */}
                    {!item.availableForSale && (
                      <div className="absolute inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center rounded-lg">
                        <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                          Out of Stock
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            {/* Success Message for Add All */}
            {addAllSuccessMessage && (
              <div className="bg-green-50 border-l-4 border-green-400 p-4 mx-4 mt-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CartIcon className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-700 font-medium">{addAllSuccessMessage}</p>
                  </div>
                </div>
              </div>
            )}

            {items.length > 0 && (
              <>
                {/* Add All to Cart Button */}
                {availableItemsCount > 0 && (
                  <Button
                    className="mx-auto"
                    onClick={handleAddAllToCart}
                    disabled={isAddingAllToCart || status === 'creating'}
                  >
                    {isAddingAllToCart ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>Adding All...</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Add All to Cart ({availableItemsCount})</span>
                      </>
                    )}
                  </Button>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <Trash2 className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Clear Wishlist</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to remove all items from your wishlist? This action cannot be undone.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearWishlist}
                  className="flex-1 px-4 py-2 bg-primary text-white hover:bg-primary/90 transition-colors"
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

/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-use-before-define */
'use client';

import {
  CartCheckoutButton,
  CartCost,
  CartLineProvider,
  CartLineQuantity,
  CartLineQuantityAdjustButton,
  useCart,
  useCartLine,
} from '@shopify/hydrogen-react';
import { Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useState } from 'react';

import { CartIcon } from '../icons/shared';
import { useWishlist } from '../layout/context/wishList';
import Button from '../ui/Button';

function CartPageContent() {
  const { lines, status } = useCart();

  if (status === 'uninitialized' || status === 'updating') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!lines || lines.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <CartIcon className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8 text-lg">Looks like you haven&apos;t added any items yet</p>

            <Link href="/products">
              <Button className="mx-auto">Start Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-8xl container mx-auto px-4 py-8">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-wide">MY CART({lines.length})</h1>
          <a href="/products">
            <Button variant="black" showArrow className="flex items-center space-x-2">
              <CartIcon className="" />
              Continue Shopping
            </Button>
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-8 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-6 border-r border-b pb-2 pr-8 border-gray-200">
            <div className="space-y-6">
              {lines.map((line) => {
                if (!line || !line.id) return null;

                return (
                  <CartLineProvider key={line.id} line={line}>
                    <CartLineItemCompact />
                  </CartLineProvider>
                );
              })}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2 ">
            <CartSummary />
          </div>
        </div>
      </div>
    </div>
  );
}

// Compact Cart Line Item Component
function CartLineItemCompact() {
  const { merchandise, quantity, id } = useCartLine();
  const { linesRemove } = useCart();
  const { addItem, removeItem, isInWishlist } = useWishlist();
  const [isRemoving, setIsRemoving] = useState(false);
  const [isAddingToWishlist, setIsAddingToWishlist] = useState(false);

  // Define variables first
  if (!merchandise || !id) return null;

  const safeQuantity = quantity ?? 0;
  const priceAmount = merchandise.price?.amount ? Number(merchandise.price.amount) : 0;
  const currencyCode = merchandise.price?.currencyCode || 'USD';
  const productId = merchandise.product?.id;
  const isInWishlistAlready = productId ? isInWishlist(productId) : false;

  // Move useCallback after variable definitions
  const handleRemove = useCallback(async () => {
    if (isRemoving || !id) return;

    setIsRemoving(true);
    try {
      await linesRemove([id]);
    } catch (error) {
      console.error('Failed to remove cart line:', error);
      setIsRemoving(false);
    }
  }, [id, linesRemove, isRemoving]);

  const handleToggleWishlist = useCallback(async () => {
    if (isAddingToWishlist || !merchandise || !merchandise.product) return;

    setIsAddingToWishlist(true);
    try {
      const productId = merchandise.product.id;

      if (isInWishlistAlready) {
        // Remove from wishlist
        removeItem(productId!);
      } else {
        // Add to wishlist
        const productForWishlist = {
          id: merchandise.product.id,
          handle: merchandise.product.handle,
          title: merchandise.product.title,
          description: merchandise.product.description,
          createdAt: merchandise.product.createdAt,
          variants: {
            nodes: [
              {
                id: merchandise.id,
                price: merchandise.price,
                compareAtPrice: merchandise.compareAtPrice,
                availableForSale: merchandise.availableForSale,
                selectedOptions: merchandise.selectedOptions,
                title: merchandise.title,
              },
            ],
          },
          images: merchandise.image
            ? {
                nodes: [merchandise.image],
              }
            : { nodes: [] },
        };

        // Add to wishlist with the specific variant ID
        addItem(productForWishlist, merchandise.id);
      }
    } catch (error) {
      console.error('Failed to toggle wishlist:', error);
    } finally {
      setIsAddingToWishlist(false);
    }
  }, [merchandise, addItem, removeItem, isAddingToWishlist, isInWishlistAlready]);

  const getVariantAttributes = (): Array<{ name: string; value: string }> => {
    const attributes: Array<{ name: string; value: string }> = [];

    // If merchandise has selectedOptions, use those
    if (merchandise.selectedOptions && merchandise.selectedOptions.length > 0) {
      merchandise.selectedOptions.forEach((option) => {
        if (option && option.name && option.value) {
          attributes.push({
            name: option.name,
            value: option.value,
          });
        }
      });
    }

    // Fallback: Check if merchandise has variant title that we can parse
    // This is useful if selectedOptions aren't available
    if (attributes.length === 0 && merchandise.title) {
      // You might need to adjust this parsing logic based on your variant title format
      // For example, if variant titles are like "Color: Brown / Material: Rubber"
      const titleParts = merchandise.title.split(' / ');
      titleParts.forEach((part) => {
        const [name, value] = part.split(': ');
        if (name && value) {
          attributes.push({ name: name.trim(), value: value.trim() });
        }
      });
    }

    return attributes;
  };

  const variantAttributes = getVariantAttributes();

  // Format currency properly
  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  return (
    <div className={` pt-6 ${isRemoving ? 'opacity-50' : ''}`}>
      <div className="flex items-start space-x-6">
        {/* Product Image */}
        <div className="flex-shrink-0 w-[312px] h-[295px] bg-gray-100 rounded">
          {merchandise.image && merchandise.image.url && (
            <Image
              alt={merchandise.image.altText || merchandise.title || 'Product Image'}
              src={merchandise.image.url}
              width={312}
              height={295}
              className="w-full h-full object-cover rounded"
            />
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <div className="flex mb-4 flex-col">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold font-bungee text-gray-900 text-lg uppercase tracking-wide">
                  {merchandise.product?.title}
                </h3>

                {/* Wishlist button next to title */}
                <button
                  onClick={handleToggleWishlist}
                  disabled={isAddingToWishlist}
                  className={`p-2 rounded-full transition-colors ${
                    isInWishlistAlready ? 'text-primary hover:text-primary' : 'text-gray-400 hover:text-primary'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                  title={isInWishlistAlready ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                  <Heart className={`w-7 h-7 ${isInWishlistAlready ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Product attributes */}
              <div className="space-y-1 text-sm">
                {variantAttributes.length > 0 ? (
                  variantAttributes.map((attribute, index) => (
                    <div key={index} className="flex justify-between">
                      <span className="text-gray-600">{attribute.name}</span>
                      <span className="text-gray-900">{attribute.value}</span>
                    </div>
                  ))
                ) : (
                  // Fallback display if no variant attributes are found
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">SKU</span>
                      <span className="text-gray-900">{merchandise.sku || 'N/A'}</span>
                    </div>
                    {merchandise.title && merchandise.title !== merchandise.product?.title && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Variant</span>
                        <span className="text-gray-900">{merchandise.title}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <hr className="border-gray-200 border-2 my-6" />

          {/* Quantity and Remove */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2 uppercase tracking-wide">QUANTITY</p>
              <div className="flex items-center border border-gray-300">
                <CartLineQuantityAdjustButton
                  adjust="decrease"
                  className="px-3 py-1 hover:bg-gray-50 transition-colors text-lg"
                  aria-label="Decrease quantity"
                >
                  −
                </CartLineQuantityAdjustButton>

                <CartLineQuantity className="px-4 py-1 font-medium text-gray-900 min-w-[3rem] text-center border-l border-r border-gray-300" />

                <CartLineQuantityAdjustButton
                  adjust="increase"
                  className="px-3 py-1 hover:bg-gray-50 transition-colors text-lg"
                  aria-label="Increase quantity"
                >
                  +
                </CartLineQuantityAdjustButton>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 mb-4">
                {formatPrice(priceAmount * safeQuantity, currencyCode)}
              </div>
            </div>
          </div>

          <hr className="border-gray-200 border-2 my-6" />

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={handleRemove}
              disabled={isRemoving}
              className="bg-red-800 text-white px-6 py-2 text-sm font-medium hover:bg-red-900 transition-colors uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Remove item from cart"
            >
              {isRemoving ? 'Removing...' : 'Remove'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Cart Summary Component
function CartSummary() {
  return (
    <div className="bg-white pt-6 ">
      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-text">
          <span>Subtotal</span>
          <CartCost amountType="subtotal" />
        </div>

        <div className="flex justify-between text-text">
          <span>Delivery</span>
          <CartCost amountType="duty" />
        </div>

        <div className="flex justify-between text-text">
          <span>Incl. 21% VAT</span>
          <CartCost amountType="tax" />
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between text-xl font-bold text-gray-900">
            <span>Total</span>
            <CartCost amountType="total" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <CartCheckoutButton className="w-full">
          <Button className="w-full" showArrow>
            Checkout
          </Button>
        </CartCheckoutButton>

        <div className="text-center">
          <div className="inline-flex border-solid border-gray-200 border px-2 items-center space-x-2 text-sm">
            <span>Pay With</span>
            <Image src="/cart/visa.png" width={56} height={33} alt="Visa Logo" />
            <Image src="/cart/mastercard.png" width={48} height={37} alt="MasterCard Logo" />
            <Image src="/cart/deal.png" width={40} height={35} alt="Deal Logo" />
            <Image src="/cart/paypal.png" width={101.28} height={39} alt="PayPal Logo" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Cart Page Export
export function CartPage() {
  return (
    <>
      <CartPageContent />
    </>
  );
}

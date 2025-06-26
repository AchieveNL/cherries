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
import { ArrowRight, Minus, Plus, Shield, ShoppingCart, Truck, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

function CartPageContent() {
  const { lines, status } = useCart();

  if (status === 'uninitialized' || status === 'updating') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!lines || lines.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <ShoppingCart className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <h1 className="text-3xl font-bungee font-bold text-gray-900 mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8 text-lg">Looks like you haven&apos;t added any items yet</p>
            <a
              href="/products"
              className="inline-flex items-center space-x-2 bg-primary text-white px-8 py-4 rounded-xl  transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span>Start Shopping</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bungee font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600 text-lg">
            {lines.length} item{lines.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {lines.map((line) => {
              // Type guard to ensure line is defined
              if (!line || !line.id) return null;

              return (
                <CartLineProvider key={line.id} line={line}>
                  <CartLineItemFull />
                </CartLineProvider>
              );
            })}

            {/* Continue Shopping */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <a
                href="/products"
                className="inline-flex items-center space-x-2 text-primary  font-medium transition-colors text-lg"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
                <span>Continue Shopping</span>
              </a>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <CartSummary />
          </div>
        </div>
      </div>
    </div>
  );
}

// Full Cart Line Item Component
function CartLineItemFull() {
  const { merchandise, quantity } = useCartLine();
  console.log('CartLineItemFull', merchandise, quantity);
  const [isRemoving, setIsRemoving] = useState(false);

  if (!merchandise) return null;

  // Safely get the quantity with fallback
  const safeQuantity = quantity ?? 0;
  const priceAmount = merchandise.price?.amount ? Number(merchandise.price.amount) : 0;

  return (
    <div
      className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 transition-all duration-300 ${isRemoving ? 'opacity-50 scale-95' : ''}`}
    >
      <div className="flex items-start space-x-6">
        {/* Product Image */}
        <div className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-gray-100">
          {merchandise.image && merchandise.image.url && (
            <Image
              alt={merchandise.image.altText || merchandise.title || 'Product Image'}
              src={merchandise.image.url}
              width={merchandise.image.width || 96}
              height={merchandise.image.height || 96}
              className="w-full h-full object-cover"
              sizes="96px"
            />
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900 text-xl leading-tight">{merchandise.product?.title}</h3>
              <p className="text-gray-600 mt-1">
                {merchandise.title !== merchandise.product?.title && merchandise.title}
              </p>
            </div>

            <button
              onClick={() => setIsRemoving(true)}
              className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
              aria-label="Remove item from cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Price and Quantity */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Price</p>
                <p className="text-xl font-bold text-primary">${priceAmount.toFixed(2)}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Quantity</p>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <CartLineQuantityAdjustButton
                    adjust="decrease"
                    className="p-2 hover:bg-gray-50 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </CartLineQuantityAdjustButton>

                  <CartLineQuantity className="px-4 py-2 font-medium text-gray-900 min-w-[3rem] text-center" />

                  <CartLineQuantityAdjustButton
                    adjust="increase"
                    className="p-2 hover:bg-gray-50 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </CartLineQuantityAdjustButton>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Total</p>
              <p className="text-2xl font-bold text-gray-900">${(priceAmount * safeQuantity).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Cart Summary Component
function CartSummary() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-8">
      <h3 className="font-semibold text-gray-900 mb-6 text-xl">Order Summary</h3>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <CartCost amountType="subtotal" />
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span className="text-primary font-medium">FREE</span>
        </div>

        <div className="flex justify-between text-gray-600">
          <span>Tax</span>
          <CartCost amountType="tax" />
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between text-xl font-bold text-gray-900">
            <span>Total</span>
            <CartCost amountType="total" />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <CartCheckoutButton className="w-full bg-primary text-white py-4 px-6 rounded-xl  transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2">
          <span>Proceed to Checkout</span>
          <ArrowRight className="w-5 h-5" />
        </CartCheckoutButton>

        <div className="flex items-center justify-center text-sm text-gray-600">
          <Shield className="w-4 h-4 mr-2 text-primary" />
          <span>Secure checkout with SSL encryption</span>
        </div>

        <div className="flex items-center justify-center text-sm text-primary p-3 rounded-lg">
          <Truck className="w-4 h-4 mr-2" />
        </div>
      </div>
    </div>
  );
}

// Main Cart Page Export (No provider needed - uses your layout providers)
export function CartPage() {
  return (
    <>
      <CartPageContent />
    </>
  );
}

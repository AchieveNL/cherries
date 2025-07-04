/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-use-before-define */
'use client';

import {
  CartCost,
  CartLineProvider,
  CartLineQuantity,
  CartLineQuantityAdjustButton,
  Image,
  useCart,
  useCartLine,
} from '@shopify/hydrogen-react';
import { ArrowRight, ChevronDown, Heart, Menu, Minus, Package, Plus, ShoppingCart, X } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { AccountIcon, LanguageIcon, MarketplaceIcon, SearchIcon, ShoppingIcon } from '@/app/_components/icons/header';
import { Button } from '../../ui';
import { useWishlist } from '../context/wishList';
import HeaderSearch from '../search';

interface CollectionItem {
  name: string;
  href: string;
}

// Custom hook to safely use cart data
function useSafeCart() {
  try {
    const cartData = useCart();

    // More detailed logging for debugging
    console.log('Cart data received:', {
      status: cartData.status,
      linesCount: cartData.lines?.length || 0,
      totalQuantity: cartData.totalQuantity,
      lines: cartData.lines,
      cost: cartData.cost,
    });

    // Ensure we have valid cart data with proper defaults
    return {
      ...cartData,
      lines: Array.isArray(cartData.lines) ? cartData.lines : [],
      status: cartData.status || 'idle',
      totalQuantity: cartData.totalQuantity || 0,
      cost: cartData.cost || {
        totalAmount: { amount: '0.00', currencyCode: 'USD' },
        subtotalAmount: { amount: '0.00', currencyCode: 'USD' },
      },
      linesAdd: cartData.linesAdd || (() => Promise.resolve()),
      linesRemove: cartData.linesRemove || (() => Promise.resolve()),
      linesUpdate: cartData.linesUpdate || (() => Promise.resolve()),
      noteUpdate: cartData.noteUpdate || (() => Promise.resolve()),
      buyerIdentityUpdate: cartData.buyerIdentityUpdate || (() => Promise.resolve()),
      cartAttributesUpdate: cartData.cartAttributesUpdate || (() => Promise.resolve()),
      discountCodesUpdate: cartData.discountCodesUpdate || (() => Promise.resolve()),
      cartCreate: cartData.cartCreate || (() => Promise.resolve()),
    };
  } catch (error) {
    console.warn('useCart hook failed - CartProvider may not be available:', error);
    return {
      lines: [],
      status: 'idle' as const,
      totalQuantity: 0,
      cost: {
        totalAmount: { amount: '0.00', currencyCode: 'USD' },
        subtotalAmount: { amount: '0.00', currencyCode: 'USD' },
      },
      linesAdd: () => Promise.resolve(),
      linesRemove: () => Promise.resolve(),
      linesUpdate: () => Promise.resolve(),
      noteUpdate: () => Promise.resolve(),
      buyerIdentityUpdate: () => Promise.resolve(),
      cartAttributesUpdate: () => Promise.resolve(),
      discountCodesUpdate: () => Promise.resolve(),
      cartCreate: () => Promise.resolve(),
    };
  }
}

function useCollections() {
  const [collections, setCollections] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/collections')
      .then((res) => res.json())
      .then((data) => {
        const dropdownItems = data.collections
          .filter((c: any) => c.handle && c.title)
          .map((c: any) => ({
            name: c.title,
            href: `/collections/${c.handle}`,
          }));
        dropdownItems.push(
          {
            name: 'All Collections',
            href: '/collections',
          },
          {
            name: 'All Products',
            href: '/products',
          }
        );
        setCollections(dropdownItems);
      })
      .catch((err) => {
        // Fallback to static data
        setCollections([
          { name: 'iPhone Cases', href: '/collections/iphone' },
          { name: 'Samsung Cases', href: '/collections/samsung' },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  return { collections, loading };
}

// Hook to track scroll position for shadow effect
function useScrollShadow() {
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setHasScrolled(scrollTop > 10);
    };

    // Add event listener
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Check initial scroll position
    handleScroll();

    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return hasScrolled;
}

// Header Component
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Use scroll shadow hook
  const hasScrolled = useScrollShadow();

  // Use the safe cart hook
  const cart = useSafeCart();
  const { lines, status, totalQuantity } = cart;
  const { collections: dynamicCollections, loading: collectionsLoading } = useCollections();

  // Use wishlist hook
  const { itemCount: wishlistCount } = useWishlist();

  // Calculate cart item count with better error handling
  const cartItemCount = useMemo(() => {
    console.log('Calculating cart item count from:', { lines, totalQuantity });

    // First try to use totalQuantity if available
    if (typeof totalQuantity === 'number' && totalQuantity >= 0) {
      return totalQuantity;
    }

    // Fallback to manual calculation
    if (Array.isArray(lines) && lines.length > 0) {
      const count = lines.reduce((total, line) => {
        const quantity = line?.quantity || 0;
        return total + quantity;
      }, 0);
      console.log('Manual cart count calculation:', count);
      return count;
    }

    return 0;
  }, [lines, totalQuantity]);

  // Memoize navigation items to prevent recreation on every render
  const navItems = useMemo(
    () => [
      {
        name: 'SHOP',
        href: '/products',
        icon: MarketplaceIcon,
        hasDropdown: true,
        dropdownItems: dynamicCollections,
        loading: collectionsLoading,
      },
      {
        name: 'LANGUAGES',
        icon: LanguageIcon,
        hasDropdown: true,
        dropdownItems: [
          { name: 'English', href: '/en' },
          { name: 'Spanish', href: '/es' },
        ],
        loading: false,
      },
    ],
    [dynamicCollections, collectionsLoading]
  );

  // Use useCallback to prevent function recreation on every render
  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleSearchToggle = useCallback(() => {
    setIsSearchOpen((prev) => !prev);
  }, []);

  const handleCartToggle = useCallback(() => {
    console.log('Cart toggle clicked. Current count:', cartItemCount);
    setIsCartOpen((prev) => !prev);
  }, [cartItemCount]);

  const handleCartClose = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  const handleSearchClose = useCallback(() => {
    setIsSearchOpen(false);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 font-bungee border bg-white transition-shadow duration-300 ${
          hasScrolled ? 'shadow-lg' : 'shadow-none'
        }`}
      >
        <div className="container mx-auto px-4">
          {/* Main header */}
          <div className="flex items-center justify-between py-6">
            {/* Left Side - Shop Navigation */}
            <div className="flex items-center">
              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 hover:bg-gray-100  transition-colors mr-2"
                onClick={handleMenuToggle}
                aria-label="Toggle mobile menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Desktop Shop Navigation */}
              <nav className="hidden  lg:flex items-center">
                {navItems.map((item) => (
                  <div key={item.name} className="relative group">
                    <a
                      href={item.href}
                      className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors font-medium py-2 px-3"
                    >
                      <item.icon className="w-7 h-7" />
                      <span>{item.name}</span>
                      {item.hasDropdown && (
                        <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
                      )}
                    </a>
                    {item.hasDropdown && item.dropdownItems && (
                      <div className="absolute top-full left-0 mt-2 w-56 bg-white  shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <div className="p-3">
                          {item.dropdownItems.map((dropdownItem) => (
                            <a
                              key={dropdownItem.name}
                              href={dropdownItem.href}
                              className="block px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-purple-50 hover:text-red-600  transition-all duration-200"
                            >
                              {dropdownItem.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </nav>

              {/* Mobile Shop Link */}
              <div className="lg:hidden">
                <a
                  href="/products"
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors font-medium py-2"
                >
                  <Package className="w-4 h-4" />
                  <span>Shop</span>
                </a>
              </div>
            </div>

            {/* Center - Logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <a href="/" className="flex items-center space-x-3">
                <Image src="/logo.svg" alt="CaseHub Logo" className="w-10 h-10" />
              </a>
            </div>

            {/* Right Side - Search, Account, Wishlist, Cart */}
            <div className="flex items-center space-x-3">
              {/* Search */}
              <HeaderSearch />
              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="p-2 hover:bg-gray-100  transition-colors relative group"
                aria-label={`Wishlist with ${wishlistCount} items`}
              >
                <Heart className="w-7 h-7 mx-2  transition-colors" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs  w-5 h-5 flex items-center justify-center font-medium">
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                  </span>
                )}
              </Link>
              {/* Account */}
              <Link href="/account" className="p-2  hover:bg-gray-100  transition-colors group" aria-label="Account">
                <AccountIcon className="w-7 h-7 ml-2    transition-colors" />
              </Link>

              {/* Cart */}
              <button
                className="p-2 hover:bg-gray-100  transition-colors relative group"
                onClick={handleCartToggle}
                aria-label={`Shopping cart with ${cartItemCount} items`}
              >
                <ShoppingIcon className="w-7 h-7  mx-2  transition-colors" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs  w-5 h-5 flex items-center justify-center font-medium ">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
                {/* Debug indicator - remove in production */}
                {process.env.NODE_ENV === 'development' && (
                  <span className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-[10px]  w-4 h-4 flex items-center justify-center">
                    {status === 'updating' ? 'U' : status === 'idle' ? 'I' : '?'}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden pb-4 border-t border-gray-100 mt-4 pt-4">
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <div key={item.name}>
                    <a
                      href={item.href}
                      className="flex items-center justify-between px-3 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-purple-50 hover:text-red-600  transition-all duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      {item.hasDropdown && <ChevronDown className="w-4 h-4" />}
                    </a>
                    {item.hasDropdown && item.dropdownItems && (
                      <div className="ml-8 mt-2 space-y-1">
                        {item.dropdownItems.map((dropdownItem) => (
                          <a
                            key={dropdownItem.name}
                            href={dropdownItem.href}
                            className="block px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50  transition-colors"
                          >
                            {dropdownItem.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Mobile Wishlist Link */}
                <div className="border-t border-gray-100 pt-4 mt-4">
                  <Link
                    href="/wishlist"
                    className="flex items-center justify-between px-3 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-red-50 hover:to-purple-50 hover:text-red-600  transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <Heart className="w-5 h-5" />
                      <span className="font-medium">Wishlist</span>
                    </div>
                    {wishlistCount > 0 && (
                      <span className="bg-red-500 text-white text-xs  w-5 h-5 flex items-center justify-center font-medium">
                        {wishlistCount > 99 ? '99+' : wishlistCount}
                      </span>
                    )}
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Cart Slide-out */}
      <CartSlideout isOpen={isCartOpen} onClose={handleCartClose} />
    </>
  );
}

// Cart Line Item Component for slideout
function CartLineItemMini() {
  const line = useCartLine();
  const { merchandise, quantity, id } = line;
  const { linesRemove } = useSafeCart();

  console.log('CartLineItemMini - line data:', { merchandise, quantity, id });
  const [isRemoving, setIsRemoving] = useState(false);

  if (!merchandise || !id) {
    console.warn('CartLineItemMini: Missing merchandise or id');
    return null;
  }

  // Safely get the price amount
  const priceAmount = merchandise.price?.amount ? Number(merchandise.price.amount) : 0;
  const productTitle = merchandise.product?.title || merchandise.title || 'Unknown Product';
  const variantTitle = merchandise.title !== merchandise.product?.title ? merchandise.title : '';

  const handleRemove = useCallback(async () => {
    if (isRemoving) return;

    setIsRemoving(true);
    try {
      console.log('Removing cart line:', id);
      await linesRemove([id]);
    } catch (error) {
      console.error('Failed to remove cart line:', error);
      setIsRemoving(false);
    }
  }, [id, linesRemove, isRemoving]);

  return (
    <div
      className={`flex items-center space-x-3 p-4  transition-all duration-300 border border-gray-100 ${
        isRemoving ? 'opacity-50 scale-95' : 'hover:shadow-md hover:border-gray-200'
      }`}
    >
      {/* Product Image */}
      <div className="flex-shrink-0 w-16 h-16  overflow-hidden bg-gray-200 shadow-sm">
        {merchandise.image?.url ? (
          <Image
            alt={merchandise.image.altText || productTitle}
            src={merchandise.image.url}
            width={64}
            height={64}
            className="w-full h-full object-cover"
            sizes="64px"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <Package className="w-6 h-6 text-gray-400" />
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 text-sm leading-tight truncate">{productTitle}</h4>
        {variantTitle && <p className="text-xs text-gray-600 mt-1 truncate">{variantTitle}</p>}

        {/* Quantity and Price */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border border-gray-300  overflow-hidden shadow-sm">
            <CartLineQuantityAdjustButton
              adjust="decrease"
              className="p-2 hover:bg-red-50 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </CartLineQuantityAdjustButton>

            <CartLineQuantity className="px-3 py-2 text-sm font-semibold text-gray-900 min-w-[2.5rem] text-center bg-white" />

            <CartLineQuantityAdjustButton
              adjust="increase"
              className="p-2 hover:bg-green-50 hover:text-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </CartLineQuantityAdjustButton>
          </div>

          <span className="font-bold text-primary text-sm">${priceAmount.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={handleRemove}
        disabled={isRemoving}
        className="p-2 hover:bg-red-50 hover:text-primary  transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Remove item from cart"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// Cart Slideout Component
function CartSlideout({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { lines, status, cost } = useSafeCart();

  console.log('CartSlideout render:', {
    isOpen,
    linesCount: lines?.length,
    status,
    cost: cost?.subtotalAmount || cost?.totalAmount,
  });

  const validLines = useMemo(() => {
    if (!Array.isArray(lines)) return [];
    return lines.filter((line) => line && line.id && line.merchandise);
  }, [lines]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Slideout Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-bold text-gray-900">Shopping Cart ({validLines.length})</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100  transition-colors shadow-sm"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex flex-col h-full bg-white">
          {status === 'updating' || status === 'creating' ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center space-y-3">
                <div className="animate-spin  h-8 w-8 border-b-2 border-red-600"></div>
                <p className="text-sm text-gray-600">Updating cart...</p>
              </div>
            </div>
          ) : validLines.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-600 text-center mb-6">Find the perfect case for your phone</p>
              <Link
                href="/products"
                onClick={onClose}
                className="bg-primary text-white px-6 py-3   transition-all duration-200 font-semibold shadow-lg"
              >
                Shop Now
              </Link>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {validLines.map((line) => {
                  // Additional safety check
                  if (!line?.id) return null;

                  return (
                    <CartLineProvider key={line.id} line={line as any}>
                      <CartLineItemMini />
                    </CartLineProvider>
                  );
                })}
              </div>

              {/* Cart Footer */}
              <div className="border-t border-gray-200 p-4 pb-20 space-y-4 bg-white">
                {/* Subtotal */}
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>Subtotal:</span>
                  <div className="text-primary">
                    <CartCost amountType="subtotal" />
                  </div>
                </div>

                {/* Checkout Button */}
                <Button
                  className="w-full bg-primary text-white py-4 px-4  transition-all duration-200 font-bold flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
                  onClick={() => (window.location.href = '/cart')}
                >
                  <span>Secure Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>

                {/* Add safe area for mobile devices */}
                <div className="h-4 sm:h-0"></div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

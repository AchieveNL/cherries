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

import { AccountIcon, LanguageIcon, Logo, MarketplaceIcon, ShoppingIcon } from '@/app/_components/icons/header';
import { Button } from '../../ui';
import { useWishlist } from '../context/wishList';
import HeaderSearch from '../search';

interface CollectionItem {
  name: string;
  href: string;
}

interface StaticPage {
  name: string;
  href: string;
}

interface Language {
  code: string;
  name: string;
  flag: string;
}

declare global {
  interface Window {
    google?: {
      translate?: any;
    };
    googleTranslateElementInit?: () => void;
    translateState?: {
      isInitialized: boolean;
      currentLang: string;
      initAttempts: number;
    };
  }
}

// Static pages array
const staticPages: StaticPage[] = [
  { name: 'ABOUT US', href: '/about' },
  { name: 'FAQs', href: '/faq' },
];

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
];

// Enhanced Google Translate Hook with better error handling and state management
function useGoogleTranslate() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentLang, setCurrentLang] = useState('en');
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debug function to check Google Translate state
  const debugTranslateState = useCallback(() => {
    console.log('=== Google Translate Debug Info ===');
    console.log('Window.google:', !!window.google);
    console.log('Window.google.translate:', !!window.google?.translate);
    console.log('Translate element:', document.getElementById('google_translate_element'));
    console.log('Select element:', document.querySelector('.goog-te-combo'));
    console.log('Current language:', currentLang);
    console.log('Is loaded:', isLoaded);
    console.log('Is translating:', isTranslating);
    console.log('Error:', error);

    // Check translate state
    if (window.translateState) {
      console.log('Global translate state:', window.translateState);
    }

    // Check storage
    console.log('localStorage googtrans:', localStorage.getItem('googtrans'));
    console.log('URL hash:', window.location.hash);
    console.log('================================');
  }, [currentLang, isLoaded, isTranslating, error]);

  // Get initial language from storage
  const getInitialLanguage = useCallback(() => {
    try {
      // Check URL hash first
      const hash = window.location.hash;
      if (hash.includes('googtrans')) {
        const match = hash.match(/#googtrans\(en\|(.+?)\)/);
        if (match && match[1]) {
          console.log('Found language in hash:', match[1]);
          return match[1];
        }
      }

      // Check localStorage
      const stored = localStorage.getItem('googtrans');
      if (stored) {
        const match = stored.match(/\/en\/(.+)/);
        if (match && match[1]) {
          console.log('Found language in localStorage:', match[1]);
          return match[1];
        }
      }

      console.log('No stored language found, defaulting to English');
      return 'en';
    } catch (error) {
      console.warn('Error getting initial language:', error);
      return 'en';
    }
  }, []);

  // Initialize Google Translate with exponential backoff
  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 50;
    let timeoutId: NodeJS.Timeout;

    const checkGoogleTranslate = () => {
      console.log(`Checking Google Translate... attempt ${retryCount + 1}`);

      if (window.google && window.google.translate) {
        console.log('✅ Google Translate is available!');
        setIsLoaded(true);
        setError(null);

        // Set initial language after a short delay
        setTimeout(() => {
          const initialLang = getInitialLanguage();
          setCurrentLang(initialLang);
          console.log('Initial language set to:', initialLang);

          // Debug state
          debugTranslateState();
        }, 100);

        return;
      }

      retryCount++;
      if (retryCount >= maxRetries) {
        const errorMsg = `Google Translate failed to load after ${maxRetries} attempts`;
        setError(errorMsg);
        console.error(errorMsg);
        return;
      }

      // Exponential backoff: start with 100ms, max 2000ms
      const delay = Math.min(100 * Math.pow(1.2, retryCount), 2000);
      console.log(`⏳ Retrying in ${delay}ms...`);
      timeoutId = setTimeout(checkGoogleTranslate, delay);
    };

    // Also listen for the custom event
    const handleTranslateReady = () => {
      console.log('🎉 Received googleTranslateReady event');
      if (window.google && window.google.translate) {
        setIsLoaded(true);
        setError(null);

        setTimeout(() => {
          const initialLang = getInitialLanguage();
          setCurrentLang(initialLang);
          debugTranslateState();
        }, 100);
      }
    };

    window.addEventListener('googleTranslateReady', handleTranslateReady);
    checkGoogleTranslate();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener('googleTranslateReady', handleTranslateReady);
    };
  }, [getInitialLanguage, debugTranslateState]);

  // Find and interact with Google Translate widget
  const findGoogleTranslateSelect = useCallback(() => {
    const selectors = [
      '.goog-te-combo',
      'select.goog-te-combo',
      '#google_translate_element select',
      '[id*="google_translate"] select',
    ];

    for (const selector of selectors) {
      const element = document.querySelector(selector) as HTMLSelectElement;
      if (element) {
        return element;
      }
    }
    return null;
  }, []);

  // Change language function
  const changeLanguage = useCallback(
    (langCode: string) => {
      if (!isLoaded || isTranslating) {
        console.log('Cannot change language: isLoaded=', isLoaded, 'isTranslating=', isTranslating);
        return;
      }

      console.log('Changing language to:', langCode);
      setIsTranslating(true);
      setCurrentLang(langCode);

      try {
        if (langCode === 'en') {
          // Aggressive reset approach for English

          // Clear all translation-related storage
          localStorage.removeItem('googtrans');
          sessionStorage.removeItem('googtrans');

          // Clear cookies if any
          document.cookie.split(';').forEach((c) => {
            const eqPos = c.indexOf('=');
            const name = eqPos > -1 ? c.substr(0, eqPos) : c;
            if (name.trim().includes('googtrans')) {
              document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
            }
          });

          // Remove any Google Translate elements from DOM
          const gtElements = document.querySelectorAll(
            '[id*="google_translate"], .goog-te-combo, .skiptranslate, [class*="goog-te"]'
          );
          gtElements.forEach((el) => {
            if (el.id !== 'google_translate_element') {
              el.remove();
            }
          });

          // Reset URL completely
          window.location.href = window.location.pathname + window.location.search;
        } else {
          // Set new language
          const googtransValue = `/en/${langCode}`;
          localStorage.setItem('googtrans', googtransValue);

          const hash = `#googtrans(en|${langCode})`;
          window.history.replaceState(null, '', window.location.pathname + window.location.search + hash);

          const selectElement = findGoogleTranslateSelect();
          if (selectElement) {
            selectElement.value = langCode;
            selectElement.dispatchEvent(new Event('change', { bubbles: true }));

            setTimeout(() => {
              setIsTranslating(false);
            }, 1500);
          } else {
            setTimeout(() => {
              window.location.reload();
            }, 100);
          }
        }
      } catch (error) {
        console.error('Error changing language:', error);
        setError('Failed to change language');
        setIsTranslating(false);
      }
    },
    [isLoaded, isTranslating, findGoogleTranslateSelect]
  );

  // Monitor Google Translate widget changes
  useEffect(() => {
    if (!isLoaded) return;

    let observer: MutationObserver;
    let intervalId: NodeJS.Timeout;

    const startMonitoring = () => {
      // Check for changes every 500ms
      intervalId = setInterval(() => {
        const selectElement = findGoogleTranslateSelect();
        if (selectElement && selectElement.value !== currentLang) {
          console.log('Detected language change from widget:', selectElement.value);
          setCurrentLang(selectElement.value);
        }
      }, 500);

      // Also use mutation observer for immediate detection
      const translateElement = document.getElementById('google_translate_element');
      if (translateElement) {
        observer = new MutationObserver(() => {
          const selectElement = findGoogleTranslateSelect();
          if (selectElement && selectElement.value !== currentLang) {
            console.log('Mutation detected language change:', selectElement.value);
            setCurrentLang(selectElement.value);
          }
        });

        observer.observe(translateElement, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['value'],
        });
      }
    };

    // Start monitoring after a delay to ensure DOM is ready
    const timeoutId = setTimeout(startMonitoring, 1000);

    return () => {
      if (observer) observer.disconnect();
      if (intervalId) clearInterval(intervalId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isLoaded, currentLang, findGoogleTranslateSelect]);

  return {
    isLoaded,
    currentLang,
    changeLanguage,
    isTranslating,
    error,
  };
}

// Updated Language Switcher Component
export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  const { isLoaded, currentLang, changeLanguage, isTranslating, error } = useGoogleTranslate();

  const handleLanguageChange = useCallback(
    (langCode: string) => {
      if (!isLoaded || isTranslating) return;

      console.log('🔄 Language switcher triggering change to:', langCode);
      changeLanguage(langCode);
      setIsOpen(false);
    },
    [isLoaded, isTranslating, changeLanguage]
  );

  // Debug function
  const handleDebug = useCallback(() => {
    console.log('=== Manual Debug Trigger ===');
    console.log('Component state:', { isLoaded, currentLang, isTranslating, error });
    console.log('Google Translate available:', !!window.google?.translate);
    console.log('Select element:', document.querySelector('.goog-te-combo'));
    console.log('Translate element:', document.getElementById('google_translate_element'));
    console.log('Storage:', localStorage.getItem('googtrans'));
    console.log('Hash:', window.location.hash);

    // Try to manually trigger a translation
    const select = document.querySelector('.goog-te-combo') as HTMLSelectElement;
    if (select) {
      console.log('Select element found, current value:', select.value);
      console.log(
        'Available options:',
        Array.from(select.options).map((opt) => opt.value)
      );
    }

    setShowDebug(!showDebug);
  }, [isLoaded, currentLang, isTranslating, error, showDebug]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.language-switcher')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isOpen]);

  const currentLanguage = languages.find((lang) => lang.code === currentLang) || languages[0];

  // Loading state
  if (!isLoaded) {
    return (
      <div className="flex items-center space-x-2 text-gray-400">
        <LanguageIcon />
        <span className="text-sm">Loading...</span>
        <div className="w-3 h-3 border border-gray-300 border-t-gray-600 rounded-full animate-spin" />
        {/* Debug button in loading state */}
        <button
          onClick={handleDebug}
          className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200"
          title="Debug translation"
        >
          DEBUG
        </button>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center space-x-2 text-red-500">
        <LanguageIcon />
        <span className="text-sm">Translation Error</span>
        <button
          onClick={handleDebug}
          className="text-xs px-2 py-1 bg-red-100 rounded hover:bg-red-200"
          title="Debug translation error"
        >
          DEBUG
        </button>
      </div>
    );
  }

  return (
    <div className="relative language-switcher">
      <div className="flex items-center space-x-1">
        <button
          className={`flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors font-medium py-2 text-sm ${
            isTranslating ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={() => !isTranslating && setIsOpen(!isOpen)}
          disabled={isTranslating}
          aria-label="Change language"
        >
          <LanguageIcon />
          <span className="hidden sm:inline">{currentLanguage.flag}</span>
          <span className="hidden md:inline">{currentLanguage.name}</span>
          <span className="md:hidden">{currentLanguage.code.toUpperCase()}</span>
          <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          {isTranslating && (
            <div className="w-3 h-3 border border-gray-300 border-t-primary rounded-full animate-spin" />
          )}
        </button>

        {/* Debug button - only show in development */}
        {process.env.NODE_ENV === 'development' && (
          <button
            onClick={handleDebug}
            className="text-xs px-1 py-1 bg-gray-100 rounded hover:bg-gray-200 text-gray-600"
            title="Debug translation"
          >
            🐛
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white shadow-xl border border-gray-100 rounded-lg z-50 max-h-64 overflow-y-auto">
          <div className="p-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                disabled={isTranslating}
                className={`w-full flex items-center space-x-3 px-3 py-2 text-sm hover:bg-gray-50 hover:text-primary transition-all duration-200 rounded ${
                  currentLang === lang.code ? 'bg-blue-50 text-primary' : 'text-gray-700'
                } ${isTranslating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="text-base">{lang.flag}</span>
                <span className="flex-1 text-left">{lang.name}</span>
                {currentLang === lang.code && <span className="w-2 h-2 bg-primary rounded-full"></span>}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Debug info panel */}
      {showDebug && process.env.NODE_ENV === 'development' && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-black text-white text-xs p-2 rounded shadow-xl z-50">
          <div>Loaded: {isLoaded ? '✅' : '❌'}</div>
          <div>Current: {currentLang}</div>
          <div>Translating: {isTranslating ? '⏳' : '✅'}</div>
          <div>Error: {error || 'None'}</div>
          <div>Google API: {window.google?.translate ? '✅' : '❌'}</div>
          <div>Widget: {document.querySelector('.goog-te-combo') ? '✅' : '❌'}</div>
        </div>
      )}
    </div>
  );
}

// Custom hook to safely use cart data
function useSafeCart() {
  try {
    const cartData = useCart();

    console.log('Cart data received:', {
      status: cartData.status,
      linesCount: cartData.lines?.length || 0,
      totalQuantity: cartData.totalQuantity,
      lines: cartData.lines,
      cost: cartData.cost,
    });

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

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return hasScrolled;
}

// Header Component
export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const hasScrolled = useScrollShadow();
  const cart = useSafeCart();
  const { lines, status, totalQuantity } = cart;
  const { collections: dynamicCollections, loading: collectionsLoading } = useCollections();
  const { itemCount: wishlistCount } = useWishlist();

  const cartItemCount = useMemo(() => {
    if (typeof totalQuantity === 'number' && totalQuantity >= 0) {
      return totalQuantity;
    }

    if (Array.isArray(lines) && lines.length > 0) {
      const count = lines.reduce((total, line) => {
        const quantity = line?.quantity || 0;
        return total + quantity;
      }, 0);
      return count;
    }

    return 0;
  }, [lines, totalQuantity]);

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
    ],
    [dynamicCollections, collectionsLoading]
  );

  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleCartToggle = useCallback(() => {
    setIsCartOpen((prev) => !prev);
  }, []);

  const handleCartClose = useCallback(() => {
    setIsCartOpen(false);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[999] font-roboto border bg-white transition-shadow duration-300 ${
          hasScrolled ? 'shadow-lg' : 'shadow-none'
        }`}
      >
        <div className="container mx-auto px-4">
          {/* Mobile Top Bar - Languages and Static Pages */}
          <div className="lg:hidden flex items-center justify-between md:py-3 border-b border-gray-100">
            <LanguageSwitcher />

            <div className="flex items-center space-x-4">
              {staticPages.map((page) => (
                <Link
                  key={page.name}
                  href={page.href}
                  className="text-black hover:text-primary transition-colors font-medium"
                >
                  {page.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Main header */}
          <div className="flex items-center justify-between py-6">
            {/* Left Side - Shop Navigation */}
            <div className="flex items-center">
              <button
                className="lg:hidden p-2 hover:bg-gray-100 group transition-colors mr-2"
                onClick={handleMenuToggle}
                aria-label="Toggle mobile menu"
              >
                <Menu className="w-6 h-6 group-hover:text-primary" />
              </button>

              <nav className="hidden lg:flex items-center">
                {navItems.map((item) => (
                  <div key={item.name} className="relative group">
                    <a
                      href={item.href}
                      className="flex items-center space-x-2 text-gray-700 hover:text-primary transition-colors font-medium py-2 px-3"
                    >
                      <item.icon className="w-7 h-7" />
                      <span>{item.name}</span>
                      {item.hasDropdown && (
                        <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
                      )}
                    </a>
                    {item.hasDropdown && item.dropdownItems && (
                      <div className="absolute top-full left-0 mt-2 w-56 bg-white shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        <div className="p-3">
                          {item.dropdownItems.map((dropdownItem) => (
                            <a
                              key={dropdownItem.name}
                              href={dropdownItem.href}
                              className="block px-4 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:text-primary transition-all duration-200"
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

              <div className="hidden lg:flex items-center mr-4">
                <LanguageSwitcher />
              </div>
            </div>

            {/* Center - Logo */}
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <a href="/" className="flex items-center space-x-3">
                <Logo className="md:w-full md:h-10 h-8 w-full" />
              </a>
            </div>

            {/* Right Side - Language, Static Pages, Search, Account, Wishlist, Cart */}
            <div className="flex items-center space-x-1">
              <div className="hidden lg:flex items-center space-x-4 mr-4">
                {staticPages.map((page) => (
                  <Link
                    key={page.name}
                    href={page.href}
                    className="text-black hover:text-primary transition-colors font-medium "
                  >
                    {page.name}
                  </Link>
                ))}
              </div>

              <HeaderSearch />

              <Link
                href="/wishlist"
                className="p-2 0 md:block hidden transition-colors relative group"
                aria-label={`Wishlist with ${wishlistCount} items`}
              >
                <Heart className="w-6 h-6 hover:text-primary hover:fill-primary  transition-colors" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-4 h-4 flex items-center justify-center font-medium">
                    {wishlistCount > 99 ? '99+' : wishlistCount}
                  </span>
                )}
              </Link>

              <Link href="/account" className="p-2  md:block hidden transition-colors group" aria-label="Account">
                <AccountIcon className="w-6 h-6 hover:text-primary transition-colors" />
              </Link>

              <button
                className="p-2  transition-colors relative group"
                onClick={handleCartToggle}
                aria-label={`Shopping cart with ${cartItemCount} items`}
              >
                <ShoppingIcon className="w-6 h-6 hover:text-primary  transition-colors" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs w-4 h-4 flex items-center justify-center font-medium">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
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
                      className="flex items-center justify-between px-3 py-3 text-gray-700 hover:text-primary transition-all duration-200"
                    >
                      <div className="flex items-center space-x-3">
                        <item.icon />
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
                            className="block px-3 py-2 text-sm text-gray-600 hover:text-primary hover:bg-red-50 transition-colors"
                          >
                            {dropdownItem.name}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                <div className="border-t border-gray-100 pt-4 mt-4">
                  <Link
                    href="/wishlist"
                    className="flex items-center justify-between px-3 py-3 text-gray-700 hover:bg-gradient-to-r hover:text-primary transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <Heart className="w-5 h-5" />
                      <span className="font-medium">Wishlist</span>
                    </div>
                    {wishlistCount > 0 && (
                      <span className="bg-primary text-white text-xs w-5 h-5 flex items-center justify-center font-medium">
                        {wishlistCount > 99 ? '99+' : wishlistCount}
                      </span>
                    )}
                  </Link>
                </div>

                <div className="border-t border-gray-100 pt-4 mt-4">
                  <Link
                    href="/account"
                    className="flex items-center justify-between px-3 py-3 text-gray-700 hover:bg-gradient-to-r hover:text-primary transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <AccountIcon className="transition-colors" />
                      <span className="font-medium">Account</span>
                    </div>
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <CartSlideout isOpen={isCartOpen} onClose={handleCartClose} />
    </>
  );
}

// Cart Line Item Component for slideout
function CartLineItemMini() {
  const line = useCartLine();
  const { merchandise, quantity, id } = line;
  const { linesRemove } = useSafeCart();
  const [isRemoving, setIsRemoving] = useState(false);

  if (!merchandise || !id) {
    return null;
  }

  const priceAmount = merchandise.price?.amount ? Number(merchandise.price.amount) : 0;
  const productTitle = merchandise.product?.title || merchandise.title || 'Unknown Product';
  const variantTitle = merchandise.title !== merchandise.product?.title ? merchandise.title : '';

  const handleRemove = useCallback(async () => {
    if (isRemoving) return;

    setIsRemoving(true);
    try {
      await linesRemove([id]);
    } catch (error) {
      console.error('Failed to remove cart line:', error);
      setIsRemoving(false);
    }
  }, [id, linesRemove, isRemoving]);

  return (
    <div
      className={`flex items-center space-x-3 p-4 transition-all duration-300 border border-gray-100 ${
        isRemoving ? 'opacity-50 scale-95' : 'hover:shadow-md hover:border-gray-200'
      }`}
    >
      <div className="flex-shrink-0 w-16 h-16 overflow-hidden bg-gray-200 shadow-sm">
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

      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 text-sm leading-tight truncate">{productTitle}</h4>
        {variantTitle && <p className="text-xs text-gray-600 mt-1 truncate">{variantTitle}</p>}

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center border border-gray-300 overflow-hidden shadow-sm">
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
        className="p-2 hover:bg-red-50 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[999] transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <h2 className="text-lg font-bold text-gray-900">Shopping Cart ({validLines.length})</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 transition-colors shadow-sm"
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
                <p className="text-sm text-gray-600">Updating cart...</p>
              </div>
            </div>
          ) : validLines.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-600 text-center mb-6">Find the perfect case for your phone</p>
              <Link href="/products">
                <Button className=" px-6 py-3">Shop Now</Button>
              </Link>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {validLines.map((line) => {
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
                  className="w-full bg-primary text-white py-4 px-4 transition-all duration-200 font-bold flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
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

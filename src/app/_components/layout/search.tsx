import { ArrowRight, FileText, Loader2, Package, X } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

import { SearchIcon } from '../icons/header';

// Types for search results
interface SearchProduct {
  id: string;
  title: string;
  handle: string;
  vendor?: string;
  images?: {
    nodes: Array<{
      url: string;
      altText: string;
    }>;
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
}

interface SearchPage {
  id: string;
  title: string;
  handle: string;
  url: string;
}

interface SearchCollection {
  id: string;
  title: string;
  handle: string;
  url: string;
  description?: string;
}

interface SearchResults {
  products: SearchProduct[];
  pages: SearchPage[];
  collections: SearchCollection[];
  isLoading: boolean;
}

// Search hook
function useSimpleSearch() {
  const [results, setResults] = useState<SearchResults>({
    products: [],
    pages: [],
    collections: [],
    isLoading: false,
  });

  // Get collections data
  const [collections, setCollections] = useState<SearchCollection[]>([]);

  useEffect(() => {
    // Fetch collections on component mount
    fetch('/api/collections')
      .then((res) => res.json())
      .then((data) => {
        const collectionItems =
          data.collections
            ?.filter((c: any) => c.handle && c.title)
            .map((c: any) => ({
              id: c.id,
              title: c.title,
              handle: c.handle,
              url: `/collections/${c.handle}`,
              description: c.description,
            })) || [];

        // Add static collection pages
        collectionItems.push(
          {
            id: 'all-collections',
            title: 'All Collections',
            handle: 'all-collections',
            url: '/collections',
            description: 'Browse all product collections',
          },
          {
            id: 'all-products',
            title: 'All Products',
            handle: 'all-products',
            url: '/products',
            description: 'Browse all products',
          }
        );

        setCollections(collectionItems);
      })
      .catch((err) => {
        console.error('Failed to fetch collections:', err);
        // Fallback collections
        setCollections([
          { id: 'iphone', title: 'iPhone Cases', handle: 'iphone', url: '/collections/iphone' },
          { id: 'samsung', title: 'Samsung Cases', handle: 'samsung', url: '/collections/samsung' },
          { id: 'all-collections', title: 'All Collections', handle: 'all-collections', url: '/collections' },
          { id: 'all-products', title: 'All Products', handle: 'all-products', url: '/products' },
        ]);
      });
  }, []);

  const searchProducts = useCallback(async (query: string): Promise<SearchProduct[]> => {
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          type: 'products',
          first: 10,
        }),
      });

      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      return data.products || [];
    } catch (error) {
      console.error('Product search error:', error);
      return [];
    }
  }, []);

  const searchPages = useCallback(async (query: string): Promise<SearchPage[]> => {
    try {
      // Import the pages search function
      const { searchStaticPages } = await import('../../../lib/pages');
      return searchStaticPages(query);
    } catch (error) {
      console.error('Page search error:', error);
      return [];
    }
  }, []);

  const searchCollections = useCallback(
    (query: string): SearchCollection[] => {
      if (!query.trim()) return [];

      const searchTerm = query.toLowerCase();
      return collections.filter(
        (collection) =>
          collection.title.toLowerCase().includes(searchTerm) ||
          collection.description?.toLowerCase().includes(searchTerm)
      );
    },
    [collections]
  );

  const performSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setResults({ products: [], pages: [], collections: [], isLoading: false });
        return;
      }

      setResults((prev) => ({ ...prev, isLoading: true }));

      try {
        const [products, pages, searchedCollections] = await Promise.all([
          searchProducts(query),
          searchPages(query),
          Promise.resolve(searchCollections(query)),
        ]);

        setResults({
          products,
          pages,
          collections: searchedCollections,
          isLoading: false,
        });
      } catch (error) {
        console.error('Search error:', error);
        setResults({ products: [], pages: [], collections: [], isLoading: false });
      }
    },
    [searchProducts, searchPages, searchCollections]
  );

  return { results, performSearch };
}

// Simple Search Modal Component
function SimpleSearchModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const { results, performSearch } = useSimpleSearch();

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, performSearch]);

  // Handle escape key and body scroll
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const totalResults = results.products.length + results.pages.length + results.collections.length;

  return (
    <div className="fixed font-roboto inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="flex justify-center items-start pt-20 px-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-96 overflow-hidden">
          {/* Search Header */}
          <div className="flex items-center p-4 border-b border-gray-200">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products and pages..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                autoFocus
              />
              {results.isLoading && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 animate-spin text-gray-400" />
              )}
            </div>
            <button onClick={onClose} className="ml-3 p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Results */}
          <div className="overflow-y-auto max-h-80">
            {results.isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Searching...</p>
                </div>
              </div>
            ) : totalResults === 0 && query.trim() ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <SearchIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
                  <p className="text-gray-600">Try searching for something else</p>
                </div>
              </div>
            ) : totalResults === 0 && !query.trim() ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <SearchIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Start typing to search</h3>
                  <p className="text-gray-600">Search for products and pages</p>
                </div>
              </div>
            ) : (
              <div className="p-4">
                {/* Collections Section */}
                {results.collections.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center">
                      Collections ({results.collections.length})
                    </h3>
                    <div className="space-y-2">
                      {results.collections.map((collection) => (
                        <a
                          key={collection.id}
                          href={collection.url}
                          onClick={onClose}
                          className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                        >
                          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Package className="w-4 h-4 text-purple-600" />
                          </div>

                          <div className="ml-3 flex-1">
                            <h4 className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                              {collection.title}
                            </h4>
                            {collection.description && (
                              <p className="text-sm text-gray-500 truncate">{collection.description}</p>
                            )}
                          </div>

                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Products Section */}
                {results.products.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold  text-gray-500 uppercase tracking-wide mb-3 flex items-center">
                      Products ({results.products.length})
                    </h3>
                    <div className="space-y-2">
                      {results.products.map((product) => (
                        <a
                          key={product.id}
                          href={`/products/${product.handle}`}
                          onClick={onClose}
                          className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                        >
                          {/* Product Image */}
                          <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            {product.images?.nodes?.[0]?.url ? (
                              <img
                                src={product.images.nodes[0].url}
                                alt={product.images.nodes[0].altText || product.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>

                          {/* Product Info */}
                          <div className="ml-3 flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 truncate group-hover:text-primary transition-colors">
                              {product.title}
                            </h4>
                            <div className="flex items-center space-x-2 mt-1">
                              {product.vendor && <span className="text-sm text-gray-500">{product.vendor}</span>}
                              <span className="text-sm font-medium text-green-600">
                                ${product.priceRange.minVariantPrice.amount}
                              </span>
                            </div>
                          </div>

                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pages Section */}
                {results.pages.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center">
                      Pages ({results.pages.length})
                    </h3>
                    <div className="space-y-2">
                      {results.pages.map((page) => (
                        <a
                          key={page.id}
                          href={page.url}
                          onClick={onClose}
                          className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                        >
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText className="w-4 h-4 text-primary" />
                          </div>

                          <div className="ml-3 flex-1">
                            <h4 className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                              {page.title}
                            </h4>
                            <p className="text-sm text-gray-500">{page.url}</p>
                          </div>

                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Updated Header Search Component
function HeaderSearch() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsSearchOpen(true)}
        className="flex items-center space-x-2  p-2 hover:bg-gray-100 transition-colors"
        aria-label="Open search"
      >
        <SearchIcon className="w-6 h-6" />
        <span className="hidden sm:inline text-gray-700 font-medium">Search</span>
      </button>

      <SimpleSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}

export default HeaderSearch;

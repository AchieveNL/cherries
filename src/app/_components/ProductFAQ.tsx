import { CheckCircle, ChevronDown, ChevronUp, HelpCircle, MessageSquare, Search, Users } from 'lucide-react';
import { useState } from 'react';

import type { Product } from '@shopify/hydrogen-react/storefront-api-types';
import type { PartialDeep } from 'type-fest';

interface FAQ {
  question: string;
  answer: string;
  category?: string;
  helpful?: number;
  views?: number;
}

interface ProductFAQProps {
  product: PartialDeep<Product, { recurseIntoArrays: true }>;
}

// Type for partial metafield from Shopify - using the actual structure we receive
type PartialMetafield = PartialDeep<Product, { recurseIntoArrays: true }>['metafields'] extends (infer U)[] | undefined
  ? U
  : never;

// Helper function to safely parse FAQ data from metafields
function parseFAQsFromMetafields(metafields: PartialMetafield[] | undefined): FAQ[] {
  if (!metafields || !Array.isArray(metafields)) {
    return [];
  }

  // Type guard to check if a metafield has the required properties
  const isValidFAQMetafield = (
    field: PartialMetafield
  ): field is NonNullable<PartialMetafield> & {
    namespace: string;
    key: string;
    value: string;
  } => {
    return (
      field !== null &&
      field !== undefined &&
      typeof field === 'object' &&
      'namespace' in field &&
      'key' in field &&
      'value' in field &&
      field.namespace === 'custom' &&
      field.key === 'faqs' &&
      typeof field.value === 'string'
    );
  };

  const faqMetafield = metafields?.find(isValidFAQMetafield);

  if (!faqMetafield?.value) {
    return [];
  }

  try {
    const parsed = JSON.parse(faqMetafield.value);

    // Validate that parsed data is an array of FAQ objects
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (item): item is FAQ =>
          typeof item === 'object' &&
          item !== null &&
          typeof item.question === 'string' &&
          typeof item.answer === 'string'
      );
    }

    return [];
  } catch (error) {
    console.warn('Failed to parse FAQ metafield:', error);
    return [];
  }
}

export default function ProductFAQ({ product }: ProductFAQProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Extract FAQs from Shopify metafields with proper type handling
  const allFaqs = parseFAQsFromMetafields(product?.metafields);

  // Filter FAQs based on search and category
  const filteredFaqs = allFaqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = Array.from(new Set(allFaqs.map((faq) => faq.category).filter(Boolean)));

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  const toggleAll = () => {
    if (openItems.size === filteredFaqs.length) {
      setOpenItems(new Set());
    } else {
      setOpenItems(new Set(filteredFaqs.map((_, index) => index)));
    }
  };

  // Don't render if no FAQs available from Shopify
  if (!allFaqs || allFaqs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <HelpCircle className="w-8 h-8 text-text/40" />
        </div>
        <h3 className="text-lg font-semibold text-text mb-2">No FAQs Available</h3>
        <p className="text-text/60 mb-6">We&lsquo;re working on adding frequently asked questions for this product.</p>
        <button className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors">
          Ask a Question
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* FAQ Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <HelpCircle className="w-6 h-6 text-primary" />
          <h2 className="text-2xl font-bold text-text">Frequently Asked Questions</h2>
        </div>
        <div className="flex items-center space-x-2 text-text/60 text-sm">
          <MessageSquare className="w-4 h-4" />
          <span>
            {allFaqs.length} question{allFaqs.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text/40" />
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none transition-colors bg-gray-50 focus:bg-white"
            />
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-text/70">Category:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    !selectedCategory ? 'bg-primary text-white' : 'bg-gray-100 text-text/70 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category!)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-text/70 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Expand/Collapse All */}
          {filteredFaqs.length > 0 && (
            <button
              onClick={toggleAll}
              className="flex items-center space-x-2 px-4 py-2 border-2 border-secondary text-secondary rounded-xl hover:bg-secondary hover:text-white transition-all font-medium text-sm"
            >
              {openItems.size === filteredFaqs.length ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  <span>Collapse All</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  <span>Expand All</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* FAQ Results */}
      {searchTerm && (
        <div className="flex items-center space-x-2 text-text/60 text-sm">
          <span>
            Found {filteredFaqs.length} result{filteredFaqs.length !== 1 ? 's' : ''}
          </span>
          {searchTerm && <span>for &quot;{searchTerm}&ldquo;</span>}
        </div>
      )}

      {/* FAQ List */}
      {filteredFaqs.length > 0 ? (
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openItems.has(index);
            return (
              <div
                key={index}
                className={`bg-white border-2 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md ${
                  isOpen ? 'border-primary/30 ring-2 ring-primary/10' : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50/50 transition-all group"
                >
                  <div className="flex-1 pr-4">
                    <div className="flex items-start space-x-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                          isOpen ? 'bg-primary text-white' : 'bg-primary/10 text-primary group-hover:bg-primary/20'
                        }`}
                      >
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="font-semibold text-text text-lg leading-tight group-hover:text-primary transition-colors">
                          {faq.question}
                        </h3>
                        {faq.category && (
                          <span className="inline-block bg-secondary/10 text-secondary px-2 py-1 rounded-full text-xs font-medium">
                            {faq.category}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`p-2 rounded-full transition-all duration-200 ${
                      isOpen ? 'bg-primary/10 rotate-180' : 'bg-gray-100 group-hover:bg-gray-200'
                    }`}
                  >
                    <ChevronDown className={`w-5 h-5 transition-colors ${isOpen ? 'text-primary' : 'text-text/60'}`} />
                  </div>
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-6">
                    <div className="pl-11">
                      <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-100">
                        <p className="text-text/80 leading-relaxed mb-4">{faq.answer}</p>

                        {/* FAQ Metadata */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <div className="flex items-center space-x-4 text-text/50 text-xs">
                            {faq.helpful && (
                              <div className="flex items-center space-x-1">
                                <CheckCircle className="w-3 h-3" />
                                <span>{faq.helpful} found helpful</span>
                              </div>
                            )}
                            {faq.views && (
                              <div className="flex items-center space-x-1">
                                <Users className="w-3 h-3" />
                                <span>{faq.views} views</span>
                              </div>
                            )}
                          </div>
                          <button className="flex items-center space-x-1 text-primary hover:text-primary/80 transition-colors text-xs font-medium">
                            <span>Was this helpful?</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-text/40" />
          </div>
          <h3 className="text-lg font-semibold text-text mb-2">No Results Found</h3>
          <p className="text-text/60 mb-4">
            Try adjusting your search terms or{' '}
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory(null);
              }}
              className="text-primary hover:underline font-medium"
            >
              clear filters
            </button>
          </p>
        </div>
      )}

      {/* FAQ Footer */}
      <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-6 border border-primary/10">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-text mb-2">Still have questions?</h3>
          <p className="text-text/70 mb-4">
            Can&apos;t find what you&apos;re looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="bg-primary text-white px-6 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors">
              Contact Support
            </button>
            <button className="border-2 border-secondary text-secondary px-6 py-3 rounded-xl font-medium hover:bg-secondary hover:text-white transition-colors">
              Ask a Question
            </button>
          </div>
        </div>
      </div>

      {/* FAQ Statistics */}
      {allFaqs.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <div className="text-2xl font-bold text-text">{allFaqs.length}</div>
            <div className="text-sm text-text/60">Total Questions</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <div className="text-2xl font-bold text-text">{categories.length || 1}</div>
            <div className="text-sm text-text/60">Categories</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <div className="text-2xl font-bold text-text">
              {Math.round((openItems.size / filteredFaqs.length) * 100) || 0}%
            </div>
            <div className="text-sm text-text/60">Currently Open</div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <div className="text-2xl font-bold text-text">
              {allFaqs.reduce((sum, faq) => sum + (faq.helpful || 0), 0)}
            </div>
            <div className="text-sm text-text/60">Helpful Votes</div>
          </div>
        </div>
      )}
    </div>
  );
}

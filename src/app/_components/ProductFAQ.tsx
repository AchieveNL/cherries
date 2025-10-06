import { ChevronDown, MessageSquare } from 'lucide-react';
import { useState } from 'react';

import { Button } from './ui';

import type { Product } from '@shopify/hydrogen-react/storefront-api-types';
import type { PartialDeep } from 'type-fest';

interface FAQ {
  question: string;
  answer: string;
}

interface ProductFAQProps {
  product: PartialDeep<Product, { recurseIntoArrays: true }>;
}

// Type for partial metafield from Shopify
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

    // Validate that parsed data is an array of FAQ objects matching our schema
    if (Array.isArray(parsed)) {
      return parsed.filter(
        (item): item is FAQ =>
          typeof item === 'object' &&
          item !== null &&
          typeof item.question === 'string' &&
          item.question.length > 0 &&
          typeof item.answer === 'string' &&
          item.answer.length > 0
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

  // Extract FAQs from Shopify metafields with proper type handling
  const allFaqs = parseFAQsFromMetafields(product?.metafields);

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index);
    } else {
      newOpenItems.add(index);
    }
    setOpenItems(newOpenItems);
  };

  // Don't render if no FAQs available from Shopify
  if (!allFaqs || allFaqs.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-text mb-2">No FAQs Available</h3>
        <p className="text-text/60 mb-6">We&apos;re working on adding frequently asked questions for this product.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* FAQ Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h2 className="text-2xl font-bold text-text">Frequently Asked Questions</h2>
        </div>
        <div className="flex items-center space-x-2 text-text/60 text-sm">
          <MessageSquare className="w-4 h-4" />
          <span>
            {allFaqs.length} question{allFaqs.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* FAQ List */}
      {allFaqs.length > 0 ? (
        <div className="space-y-4">
          {allFaqs.map((faq, index) => {
            const isOpen = openItems.has(index);
            return (
              <div
                key={index}
                className={`bg-white border-2  overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md ${
                  isOpen ? 'border-primary/30 ring-2 ring-primary/10' : 'border-gray-100 hover:border-gray-200'
                }`}
              >
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-gray-50/50 transition-all group"
                >
                  <div className="flex-1 pr-4">
                    <div className="flex items-start space-x-3">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-text text-lg leading-tight group-hover:text-primary transition-colors">
                          {faq.question}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`p-2  transition-all duration-200 ${
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
                    <div className="">
                      <div className="bg-gradient-to-br from-gray-50 to-white  p-4 border border-gray-100">
                        <p className="text-text/80 leading-relaxed">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-white  border border-gray-100">
          <h3 className="text-lg font-semibold text-text mb-2">No Results Found</h3>
        </div>
      )}

      {/* FAQ Footer */}
      <div className="bg-gradient-to-br from-primary/5 to-secondary/5  p-6 border border-primary/10">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-text mb-2">Still have questions?</h3>
          <p className="text-text/70 mb-4">
            Can&apos;t find what you&apos;re looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button>Contact Support</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

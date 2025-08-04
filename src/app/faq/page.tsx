/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { ChevronDown, Mail, MessageCircle, Package, Phone, RefreshCw, Search, Shield, Truck } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import ContactInformations from '../_components/faqPage/contactInformations';
import SubscribeSection from '../_components/landingPage/SubscribeSection';
import { Button } from '../_components/ui';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface FAQCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
}

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const faqItems: FAQItem[] = [
    // Orders & Payment
    {
      id: '1',
      question: 'How do I place an order?',
      answer:
        'You can place an order by browsing our products, selecting your preferred case, choosing the right size for your phone, and clicking "Add to Cart". Then proceed to checkout to complete your purchase.',
      category: 'orders',
    },
    {
      id: '2',
      question: 'What payment methods do you accept?',
      answer:
        'We accept all major credit cards (Visa, Mastercard, American Express), PayPal, Apple Pay, Google Pay, and Shop Pay for a secure checkout experience.',
      category: 'orders',
    },
    {
      id: '3',
      question: 'Can I modify or cancel my order?',
      answer:
        'Orders can be modified or cancelled within 1 hour of placement. After this time, your order enters our fulfillment process. Please contact our support team immediately if you need to make changes.',
      category: 'orders',
    },
    {
      id: '4',
      question: 'Do you offer discounts for bulk orders?',
      answer:
        'Yes! We offer special pricing for bulk orders of 10+ cases. Please contact our sales team for custom pricing and volume discounts.',
      category: 'orders',
    },

    // Shipping & Delivery
    {
      id: '5',
      question: 'How long does shipping take?',
      answer:
        'Standard shipping takes 3-7 business days within the US. International shipping typically takes 7-14 business days. Express shipping (1-3 days) is available for an additional fee.',
      category: 'shipping',
    },
    {
      id: '6',
      question: 'Do you ship internationally?',
      answer:
        'Yes, we ship to over 50 countries worldwide. Shipping costs and delivery times vary by location. International customers are responsible for any customs duties or taxes.',
      category: 'shipping',
    },
    {
      id: '7',
      question: 'How can I track my order?',
      answer:
        "Once your order ships, you'll receive a tracking number via email. You can also track your order in real-time by logging into your account and viewing your order history.",
      category: 'shipping',
    },
    {
      id: '8',
      question: 'What if my package is lost or damaged?',
      answer:
        "If your package is lost or arrives damaged, please contact us immediately. We'll work with the shipping carrier to resolve the issue and ensure you receive a replacement at no extra cost.",
      category: 'shipping',
    },

    // Returns & Exchanges
    {
      id: '9',
      question: 'What is your return policy?',
      answer:
        'We offer a 30-day return policy for all unused items in original packaging. Returns are free for US customers, and we provide a prepaid return label.',
      category: 'returns',
    },
    {
      id: '10',
      question: 'How do I return or exchange an item?',
      answer:
        'To return an item, log into your account, go to "Order History", and select "Return Item". You can also contact our support team who will guide you through the process.',
      category: 'returns',
    },
    {
      id: '11',
      question: 'Can I exchange for a different phone model?',
      answer:
        'Yes, you can exchange for a different phone model as long as the item is unused and within our 30-day return window. You may need to pay the price difference if applicable.',
      category: 'returns',
    },
    {
      id: '12',
      question: 'How long do refunds take?',
      answer:
        'Refunds are processed within 3-5 business days after we receive your returned item. The refund will appear on your original payment method within 5-10 business days.',
      category: 'returns',
    },

    // Product Info
    {
      id: '13',
      question: 'What materials are your cases made from?',
      answer:
        'Our cases are made from premium materials including TPU, polycarbonate, and genuine leather. All materials are carefully selected for durability, protection, and style.',
      category: 'products',
    },
    {
      id: '14',
      question: 'Do your cases support wireless charging?',
      answer:
        "Yes, all our cases are designed to be compatible with wireless charging. You won't need to remove the case to charge your phone wirelessly.",
      category: 'products',
    },
    {
      id: '15',
      question: 'How do I know which case fits my phone?',
      answer:
        "Each product page clearly lists compatible phone models. You can also use our phone model selector tool or contact our support team if you're unsure about compatibility.",
      category: 'products',
    },
    {
      id: '16',
      question: 'Do you offer screen protectors?',
      answer:
        "Currently, we specialize in premium phone cases. However, we're constantly expanding our product line and may offer screen protectors in the future.",
      category: 'products',
    },
    {
      id: '17',
      question: 'Are your cases drop-tested?',
      answer:
        'Yes, all our cases undergo rigorous drop testing to ensure they meet military-grade protection standards. We test from various heights and angles to guarantee maximum protection.',
      category: 'products',
    },
    {
      id: '18',
      question: 'Can I customize my case?',
      answer:
        'We offer limited customization options for certain case models. Please check the product page or contact our team to inquire about custom designs or personalization.',
      category: 'products',
    },
  ];

  // Filter FAQs based on search term and category
  const filteredFAQs = faqItems.filter((item) => {
    const matchesSearch =
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-6xl mx-auto">
            <h1 className="text-5xl md:text-6xl  max-w-4xl mx-auto font-bungee font-bold text-text mb-6 tracking-wide">
              frequently asked questions
            </h1>
            <div className="w-[164px] h-1 bg-primary mx-auto mb-8"></div>
            <p className="text-xl max-w-4xl mx-auto capitalize text-gray-600 leading-relaxed mb-12">
              Below are the most frequently asked questions we’ve answered. If you&lsquo;re not satisfied, feel free to
              send us an email.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-6xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for answers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-solid border-gray-200  focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Items */}
      <section className="py-20">
        <div className="container mx-auto max-w-6xl">
          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No questions found</h3>
              <p className="text-gray-600">Try adjusting your search terms or browse different categories.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    className="w-full text-left p-6  bg-white  transition-colors duration-200"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold text-gray-900 pr-4">{item.question}</h3>
                      <ChevronDown
                        className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 ${
                          openItems.has(item.id) ? 'rotate-180' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {openItems.has(item.id) && (
                    <div className="px-6 pb-6">
                      <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <ContactInformations />
      {/* Subscribe  Section */}
      <SubscribeSection />
    </div>
  );
}

export interface StaticPage {
  id: string;
  title: string;
  handle: string;
  url: string;
  description?: string;
  keywords?: string[];
}
export interface Collection {
  id: string;
  title: string;
  handle: string;
  url: string;
  description?: string;
}

export const STATIC_PAGES: StaticPage[] = [
  {
    id: 'about',
    title: 'About Us',
    handle: 'about',
    url: '/about',
    description: 'Learn about our company and mission',
    keywords: ['about', 'company', 'story', 'mission'],
  },
  {
    id: 'contact',
    title: 'Contact Us',
    handle: 'contact',
    url: '/contact',
    description: 'Get in touch with our support team',
    keywords: ['contact', 'support', 'help', 'email'],
  },
  {
    id: 'shipping',
    title: 'Shipping Information',
    handle: 'shipping',
    url: '/shipping',
    description: 'Shipping rates and delivery information',
    keywords: ['shipping', 'delivery', 'rates', 'timeline'],
  },
  {
    id: 'returns',
    title: 'Returns & Exchanges',
    handle: 'returns',
    url: '/returns',
    description: 'Return policy and exchange process',
    keywords: ['returns', 'exchanges', 'policy', 'refund'],
  },
  {
    id: 'faq',
    title: 'Frequently Asked Questions',
    handle: 'faq',
    url: '/faq',
    description: 'Common questions and answers',
    keywords: ['faq', 'questions', 'help', 'answers'],
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    handle: 'privacy',
    url: '/pages/privacy',
    description: 'How we protect your privacy',
    keywords: ['privacy', 'policy', 'data', 'protection'],
  },
  {
    id: 'terms',
    title: 'Terms of Service',
    handle: 'terms',
    url: '/pages/terms',
    description: 'Terms and conditions of use',
    keywords: ['terms', 'conditions', 'service', 'legal'],
  },
];

// Helper functions
export function searchStaticPages(query: string): StaticPage[] {
  if (!query.trim()) return [];

  const searchTerm = query.toLowerCase();

  return STATIC_PAGES.filter(
    (page) =>
      page.title.toLowerCase().includes(searchTerm) ||
      page.description?.toLowerCase().includes(searchTerm) ||
      page.keywords?.some((keyword) => keyword.includes(searchTerm))
  );
}

export function getPageByHandle(handle: string): StaticPage | undefined {
  return STATIC_PAGES.find((page) => page.handle === handle);
}

export function getAllPageUrls(): string[] {
  return STATIC_PAGES.map((page) => page.url);
}
export function searchCollections(collections: Collection[], query: string): Collection[] {
  if (!query.trim()) return [];

  const searchTerm = query.toLowerCase();

  return collections.filter(
    (collection) =>
      collection.title.toLowerCase().includes(searchTerm) || collection.description?.toLowerCase().includes(searchTerm)
  );
}

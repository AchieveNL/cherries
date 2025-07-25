export const siteConfig = {
  name: 'Cherries',
  description:
    'Bold and playful tech accessory brand specializing in phone cases and chargers with retro aesthetics and pixel art design.',
  url: 'https://cherries.com',
  ogImage: 'https://cherries.com/og-image.jpg',

  // Social Media Links
  social: {
    instagram: 'https://instagram.com/cherries_tech',
    twitter: 'https://twitter.com/CherriesTech',
    facebook: 'https://facebook.com/CherriesTech',
    tiktok: 'https://tiktok.com/@cherries_tech',
    youtube: 'https://youtube.com/@CherriesTech',
  },

  // Social Media Handles (without @)
  handles: {
    instagram: 'cherries_tech',
    twitter: 'CherriesTech',
    facebook: 'CherriesTech',
    tiktok: 'cherries_tech',
    youtube: 'CherriesTech',
  },

  // Contact Information
  contact: {
    email: 'hello@cherries.com',
    support: 'support@cherries.com',
    business: 'business@cherries.com',
  },

  // Business Information
  business: {
    locality: 'Your City',
    region: 'Your State',
    country: 'Your Country',
    phone: '+1 (555) 123-4567',
  },

  // SEO Configuration
  seo: {
    keywords: [
      'phone cases',
      'phone chargers',
      'tech accessories',
      'retro phone cases',
      'pixel art accessories',
      'gaming phone cases',
      'stylish chargers',
      'mobile accessories',
      'trendy tech gear',
      'nostalgic design',
      'bold phone protection',
      'unique mobile accessories',
    ],
    authors: [{ name: 'Cherries Tech' }],
    creator: 'Cherries',
    publisher: 'Cherries',
    category: 'Technology',
    classification: 'E-commerce',
  },

  // Brand Colors
  theme: {
    primary: '#ff6b6b',
    secondary: '#4ecdc4',
    accent: '#45b7d1',
  },

  // Verification Codes (replace with actual codes)
  verification: {
    google: 'your-google-site-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
    bing: 'your-bing-verification-code',
  },

  // Supported Languages
  languages: {
    'en-US': 'https://cherries.com',
    'es-ES': 'https://cherries.com/es',
    'fr-FR': 'https://cherries.com/fr',
    'de-DE': 'https://cherries.com/de',
    'it-IT': 'https://cherries.com/it',
    'pt-PT': 'https://cherries.com/pt',
  },
} as const;

export type SiteConfig = typeof siteConfig;

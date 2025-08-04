export const siteConfig = {
  name: 'Cherries',
  description:
    'Bold and playful tech accessory brand specializing in phone cases and chargers with retro aesthetics and pixel art design.',
  url: 'https://cherries.com',
  ogImage: 'https://cherries.com/og-image.jpg',

  // Social Media Links
  social: {
    instagram: 'https://www.instagram.com/cherriesofficialcom/',
    twitter: 'https://twitter.com/CherriesTech',
    facebook: 'https://facebook.com/CherriesTech',
    tiktok: 'https://www.tiktok.com/@cherriesofficial.com',
    snapchat: 'https://snapchat.com/t/uHFjxXIp',
  },

  // Social Media Handles (without @)
  handles: {
    instagram: 'cherries_tech',
    facebook: 'CherriesTech',
    tiktok: 'cherries_tech',
    youtube: 'CherriesTech',
  },

  // Contact Information
  contact: {
    email: 'info@cherriesofficial.com',
    support: 'info@cherriesofficial.com',
    business: 'info@cherries.com',
  },

  // Business Information
  business: {
    locality: 'Rotterdam',
    region: 'Zuid Holland',
    country: 'Netherlands',
    phone: '+31 10 3072618',
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
    primary: '#830016',
    secondary: '#EFE8DD', // Yellow
    accent: '#EF4444', // Red
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

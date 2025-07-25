import { Metadata } from 'next';

import './globals.css';

import { Bungee, Poppins, Roboto } from 'next/font/google';
import Script from 'next/script';

import { siteConfig } from '../config/site';
import CustomCursor from './_components/animation/CustomCursor';
import { Footer } from './_components/layout/shop/footer';
import { Header } from './_components/layout/shop/header';
import Providers from './providers';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
});
const bungee = Bungee({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-bungee',
});
const roboto = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
  variable: '--font-roboto',
});

export const metadata: Metadata = {
  title: 'Cherries - Bold Tech Accessories | Phone Cases & Chargers with Retro Style',
  description: siteConfig.description,
  keywords: siteConfig.seo.keywords,
  authors: siteConfig.seo.authors,
  creator: siteConfig.seo.creator,
  publisher: siteConfig.seo.publisher,
  category: siteConfig.seo.category,
  classification: siteConfig.seo.classification,
  viewport: 'width=device-width, initial-scale=1',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteConfig.url,
    languages: siteConfig.languages,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: 'Cherries - Bold Tech Accessories with Retro Style',
    description:
      'Premium phone cases and chargers that combine eye-catching retro design with reliable performance. Tech accessories for trendsetters who want protection, power, and personality.',
    images: [
      {
        url: `${siteConfig.url}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: 'Cherries retro-style phone cases and chargers collection',
      },
      {
        url: `${siteConfig.url}/og-image-square.jpg`,
        width: 1200,
        height: 1200,
        alt: 'Cherries pixel art inspired tech accessories',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: `@${siteConfig.handles.twitter}`,
    creator: `@${siteConfig.handles.twitter}`,
    title: 'Cherries - Bold Tech Accessories with Retro Style',
    description:
      'Premium phone cases and chargers inspired by retro aesthetics and pixel art. Tech accessories that combine protection, power, and personality.',
    images: {
      url: `${siteConfig.url}/twitter-image.jpg`,
      alt: 'Cherries retro-style phone cases and chargers',
    },
  },
  verification: {
    google: siteConfig.verification.google,
    yandex: siteConfig.verification.yandex,
    yahoo: siteConfig.verification.yahoo,
    other: {
      bing: [siteConfig.verification.bing],
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    shortcut: '/favicon-16x16.png',
    apple: [
      { url: '/apple-touch-icon.png' },
      { url: '/apple-touch-icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: siteConfig.theme.primary,
      },
    ],
  },
  manifest: '/manifest.json',
  applicationName: siteConfig.name,
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(siteConfig.url),
  other: {
    'theme-color': siteConfig.theme.primary,
    'color-scheme': 'light dark',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': siteConfig.name,
    'msapplication-TileColor': siteConfig.theme.primary,
    'msapplication-config': '/browserconfig.xml',
    // Rich snippets for products
    'product:brand': siteConfig.name,
    'product:availability': 'in stock',
    'product:condition': 'new',
    'product:price:currency': 'USD',
    // Business info
    'business:contact_data:locality': siteConfig.business.locality,
    'business:contact_data:region': siteConfig.business.region,
    'business:contact_data:country_name': siteConfig.business.country,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google Translate Meta Tags */}
        <meta name="google-translate-customization" content="YOUR_CUSTOMIZATION_ID" />

        {/* Additional SEO Meta Tags */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://translate.google.com" />

        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: siteConfig.name,
              url: siteConfig.url,
              logo: `${siteConfig.url}/logo.png`,
              description: siteConfig.description,
              sameAs: [
                siteConfig.social.instagram,
                siteConfig.social.twitter,
                siteConfig.social.facebook,
                siteConfig.social.tiktok,
                siteConfig.social.youtube,
              ],
              contactPoint: {
                '@type': 'ContactPoint',
                contactType: 'customer service',
                email: siteConfig.contact.email,
              },
            }),
          }}
        />

        {/* Structured Data for WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: siteConfig.name,
              url: siteConfig.url,
              description: 'Premium tech accessories with retro style - phone cases and chargers for trendsetters',
              potentialAction: {
                '@type': 'SearchAction',
                target: `${siteConfig.url}/search?q={search_term_string}`,
                'query-input': 'required name=search_term_string',
              },
            }),
          }}
        />
      </head>
      <body className={`${poppins.variable} ${bungee.variable} ${roboto.variable} ${poppins.className}`}>
        {/* Google Translate Script - Load early but non-blocking */}
        <Script
          id="google-translate-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              function googleTranslateElementInit() {
                if (typeof google !== 'undefined' && google.translate) {
                  new google.translate.TranslateElement({
                    pageLanguage: 'en',
                    includedLanguages: 'en,es,fr,de,it,pt,ru,ja,ko,zh-CN,ar,hi,nl,sv,da,no,fi,pl,cs,hu,ro,bg,hr,sk,sl,et,lv,lt,mt',
                    layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                    autoDisplay: false,
                    multilanguagePage: true
                  }, 'google_translate_element');
                }
              }
              // Make function globally available
              window.googleTranslateElementInit = googleTranslateElementInit;
            `,
          }}
        />
        {/* Google Translate API Script */}
        <Script
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
        <Providers>
          {/* Hidden Google Translate Element */}
          <div id="google_translate_element" style={{ display: 'none' }}></div>
          <Header />
          <div className="pt-32 md:pt-24 font-roboto">{children}</div>
          {/* Only show custom cursor on desktop */}
          <div className="hidden md:block">
            <CustomCursor />
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

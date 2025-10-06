/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.gravatar.com',
        pathname: '/**',
      },
    ],
  },
  async headers() {
    return [
      {
        // Apply CSP to all routes
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self' https://js.hcaptcha.com https://fonts.shopifycdn.com https://newassets.hcaptcha.com https://cdn.shopify.com",
              "connect-src 'self' https://shopify.com https://*.shopify.com https://cherriesofficial.myshopify.com https://shopify.com/*/account/customer/api/* https://forms.shopifyapps.com https://otlp-http-production.shopifysvc.com https://notify.bugsnag.com https://www.googletagmanager.com https://translate.googleapis.com https://translate-pa.googleapis.com https://www.gstatic.com",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.shopify.com https://js.hcaptcha.com https://www.googletagmanager.com https://translate.google.com https://translate.googleapis.com https://translate-pa.googleapis.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.shopifycdn.com https://www.gstatic.com",
              "font-src 'self' https://fonts.gstatic.com https://fonts.shopifycdn.com",
              "img-src 'self' data: https: blob:",
              "frame-src 'self' https://js.hcaptcha.com https://newassets.hcaptcha.com https://www.googletagmanager.com",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

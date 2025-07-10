import { Metadata } from 'next';

import './globals.css';

import { Bungee, Poppins, Roboto } from 'next/font/google';

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
  title: `TypeScript starter for Next.js by João Pedro Schmitz`,
  description: `TypeScript starter for Next.js that includes all you need to build amazing apps`,
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${bungee.variable} ${roboto.variable} ${poppins.className}`}>
        <Providers>
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

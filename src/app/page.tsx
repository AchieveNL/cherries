'use client';

import * as React from 'react';

import CategoriesSection from './_components/landingPage/CategoriesSection';
import CollectionSection from './_components/landingPage/collectionSection';
import HeroSection from './_components/landingPage/HeroSection';
import NewestProductSection from './_components/landingPage/newProductsSection';
import SubscribeSection from './_components/landingPage/SubscribeSection';

export default function Home() {
  return (
    <main className="bg-white">
      <HeroSection />
      <CollectionSection collectionHandle="phone-cases" maxProducts={4} />
      <NewestProductSection />
      <CategoriesSection />
      <SubscribeSection />
    </main>
  );
}

'use client';

import HeroSection from '../_components/aboutPage/HeroSection';
import StatsSection from '../_components/aboutPage/StatsSection';
import WhyUsSection from '../_components/aboutPage/WhyUsSection';
import SubscribeSection from '../_components/landingPage/SubscribeSection';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Why US Section */}
      <WhyUsSection />

      {/* Stats Section */}
      <StatsSection />
      {/* Subscribe  Section */}
      <SubscribeSection />
    </div>
  );
}

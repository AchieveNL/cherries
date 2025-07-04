'use client';

import { Award, CheckCircle, Heart, Shield, Star, Target, Users } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

interface Stat {
  number: string;
  label: string;
  icon: React.ReactNode;
}

interface Value {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<'story' | 'mission' | 'values'>('story');

  const stats: Stat[] = [
    {
      number: '50K+',
      label: 'Happy Customers',
      icon: <Users className="w-8 h-8 text-primary" />,
    },
    {
      number: '100K+',
      label: 'Cases Sold',
      icon: <Shield className="w-8 h-8 text-primary" />,
    },
    {
      number: '4.9/5',
      label: 'Customer Rating',
      icon: <Star className="w-8 h-8 text-primary" />,
    },
    {
      number: '24/7',
      label: 'Customer Support',
      icon: <Heart className="w-8 h-8 text-primary" />,
    },
  ];

  const values: Value[] = [
    {
      title: 'Quality First',
      description: 'We never compromise on quality. Every case is tested for durability and style.',
      icon: <Award className="w-12 h-12 text-primary" />,
    },
    {
      title: 'Customer Focus',
      description: 'Your satisfaction is our priority. We listen, adapt, and deliver what you need.',
      icon: <Heart className="w-12 h-12 text-primary" />,
    },
    {
      title: 'Innovation',
      description: 'Constantly evolving with the latest designs and protection technology.',
      icon: <Target className="w-12 h-12 text-primary" />,
    },
    {
      title: 'Sustainability',
      description: 'Committed to eco-friendly materials and sustainable business practices.',
      icon: <CheckCircle className="w-12 h-12 text-primary" />,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bungee font-bold text-gray-900 mb-6 tracking-wide">ABOUT US</h1>
            <div className="w-32 h-1 bg-primary mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 leading-relaxed mb-12">
              We&lsquo;re passionate about protecting what matters most to you. Since 2020, we&lsquo;ve been crafting
              premium phone cases that combine style, durability, and innovation.
            </p>

            {/* Hero Image */}
            <div className="relative w-full h-96 rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1280&h=400&fit=crop&crop=center"
                alt="CaseHub Team"
                fill
                className="object-cover"
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary ">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center text-white">
                <div className="flex justify-center mb-4">
                  <div className="p-3 bg-white/20 rounded-full">{stat.icon}</div>
                </div>
                <div className="text-4xl text-primary md:text-5xl font-bungee font-bold mb-2">{stat.number}</div>
                <div className="text-primary/90 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story/Mission/Values Tabs */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bungee font-bold text-gray-900 mb-4 tracking-wide">OUR JOURNEY</h2>
            <div className="w-24 h-1 bg-primary mx-auto"></div>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className="bg-secondary rounded-full p-2 inline-flex">
              {[
                { key: 'story', label: 'Our Story' },
                { key: 'mission', label: 'Mission' },
                { key: 'values', label: 'Values' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-8 py-3 rounded-full font-medium transition-all duration-300 ${
                    activeTab === tab.key ? 'bg-primary text-white shadow-lg' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl mx-auto">
            {activeTab === 'story' && (
              <div className="text-center space-y-8">
                <p className="text-lg text-gray-600 leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                  officia deserunt mollit anim id est laborum.
                </p>
                <div className="grid md:grid-cols-2 gap-8 mt-12">
                  <div className="relative h-64 rounded-xl overflow-hidden">
                    <Image src="/about/story-1.jpg" alt="Our beginnings" fill className="object-cover" />
                  </div>
                  <div className="relative h-64 rounded-xl overflow-hidden">
                    <Image src="/about/story-2.jpg" alt="Our growth" fill className="object-cover" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'mission' && (
              <div className="text-center space-y-8">
                <h3 className="text-3xl font-bold text-gray-900 mb-6">Protecting What Matters Most</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Our mission is simple: create phone cases that don&lsquo;t make you choose between style and
                  protection. We believe your phone case should be an extension of your personality while keeping your
                  device safe from life&rsquo;s unexpected moments.
                </p>
                <div className="grid md:grid-cols-3 gap-8 mt-12">
                  <div className="text-center">
                    <Shield className="w-16 h-16 text-primary mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Protection</h4>
                    <p className="text-gray-600">Military-grade drop protection without the bulk</p>
                  </div>
                  <div className="text-center">
                    <Award className="w-16 h-16 text-primary mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Style</h4>
                    <p className="text-gray-600">Designs that complement your unique style</p>
                  </div>
                  <div className="text-center">
                    <Heart className="w-16 h-16 text-primary mx-auto mb-4" />
                    <h4 className="text-xl font-bold text-gray-900 mb-2">Care</h4>
                    <p className="text-gray-600">Customer service that goes above and beyond</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'values' && (
              <div className="grid md:grid-cols-2 gap-8">
                {values.map((value, index) => (
                  <div
                    key={index}
                    className="bg-secondary rounded-2xl p-8 text-center hover:shadow-lg transition-shadow duration-300"
                  >
                    <div className="flex justify-center mb-6">{value.icon}</div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

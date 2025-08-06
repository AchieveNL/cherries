import {
  LimitedIcon,
  PersonelServiceIcon,
  PremiumQualityIcon,
  RealLifeContentIcon,
  RecycledMaterialIcon,
  SafeAndFlexableIcon,
  UnboxIcon,
  UniqueTechIcon,
  WorldWideShippingIcon,
} from '../icons/about-us';

const StatsSection = () => {
  const stats = [
    {
      icon: WorldWideShippingIcon,
      label: 'WORLDWIDE SHIPPING',
      info: 'Next day NL & BE',
      primary: 'yes',
      description:
        "We ship worldwide. Order before 5:00 PM from the Netherlands or Belgium? You'll have your Cherries the next day.",
    },
    {
      icon: UniqueTechIcon,
      label: 'FRAGRANT TECH ACCESSORIES',
      description:
        'The only place where you find luxury phone cases and tech accessories that are not only beautiful but also smell subtly wonderful. Style and sensory experience in one.',
    },
    {
      icon: RecycledMaterialIcon,
      label: 'MADE WITH CARE',
      info: 'Recycled Materials',
      description:
        'Our collection includes cases made from recycled coffee beans among other materials. Sustainable, stylish and unique.',
    },
    {
      icon: LimitedIcon,
      label: 'LIMITED EDITION DROPS',
      description:
        'Exclusive collections in small batches. No mass production – you have something that almost nobody else has.',
    },
    {
      icon: PremiumQualityIcon,
      label: 'PREMIUM QUALITY',
      info: 'Fast Shipping',
      description: 'Our products are top quality and shipped directly from our own stock, safe and fast.',
    },
    {
      icon: SafeAndFlexableIcon,
      label: 'SECURE & FLEXIBLE PAYMENT',
      description: 'Pay with iDeal, Klarna, Apple Pay, credit card and more. Always fast, always secure.',
    },
    {
      icon: PersonelServiceIcon,
      label: 'PERSONAL SERVICE',
      description: "App or email us - we don't give standard answers, but real help from people with a sense of style.",
    },
    {
      icon: UnboxIcon,
      label: 'UNBOXING EXPERIENCE',
      description: 'Our shipping boxes are beautiful enough to keep. Every package feels like a gift.',
    },
    {
      icon: RealLifeContentIcon,
      label: 'REAL-LIFE CONTENT & INSPIRATION',
      description:
        'Check how others wear it via our Instagram – every product page is linked to real content from our community.',
    },
  ];

  return (
    <div className="bg-white pt-4 sm:pt-8 lg:pt-12 xl-pt-18 pb-8 sm:pb-12 lg:pb-14 xl:pb-20">
      <div className="max-w-8xl container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-4 sm:gap-6 lg:gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="p-4 sm:p-6 lg:p-8 w-full max-w-[450px] mx-auto h-auto min-h-[280px] sm:min-h-[300px] lg:h-[332px] rounded-2xl flex flex-col "
              style={
                stat.primary
                  ? {
                      boxShadow: '8px 8px 15px 0px #83001626, -8px -8px 15px 0px #83001626',
                    }
                  : {
                      boxShadow: '8px 8px 15px 0px #0000000D, -8px -8px 15px 0px #0000000D',
                    }
              }
            >
              {/* Icon and Info */}
              <div className="flex justify-start items-center mb-6 sm:mb-8 lg:mb-12">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <stat.icon className="scale-[2] text-white" />
                </div>
                {stat.info && (
                  <div
                    className="text-[10px] sm:text-[11px] lg:text-[12px] ml-2 sm:ml-3 font-bold p-1.5 sm:p-2 text-text rounded"
                    style={{
                      boxShadow: '2px 2px 15px 0px #8300161F, -2px -2px 15px 0px #5D5D5D1F',
                    }}
                  >
                    {stat.info}
                  </div>
                )}
              </div>
              {/* Label */}
              <div className="text-lg sm:text-xl lg:text-[24px] font-bold text-text uppercase tracking-wide leading-tight mb-3 sm:mb-4">
                {stat.label}
              </div>
              {/* Description */}
              <div className="font-medium text-[11px] sm:text-[12px] text-text leading-relaxed">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsSection;

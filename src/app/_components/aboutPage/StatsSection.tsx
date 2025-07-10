import { Clock, Phone, Shield, Star } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    {
      icon: Star,
      number: '55+',
      label: 'CUSTOM PRODUCTS',
    },
    {
      icon: Phone,
      number: '10K+',
      label: 'MONTHLY CUSTOMERS',
    },
    {
      icon: Shield,
      number: '99.%',
      label: 'SECURE PAYMENTS',
    },
    {
      icon: Clock,
      number: '24/7',
      label: 'CUSTOMER SERVICE',
    },
  ];

  return (
    <div className="bg-white py-16 lg:py-20">
      <div className="max-w-8xl container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              {/* Icon */}
              <div className="flex justify-center mb-12">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Number */}
              <div className="text-3xl lg:text-[64px] font-bold text-text mb-2">{stat.number}</div>

              {/* Label */}
              <div className="text-base font-medium text-text uppercase tracking-wide">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsSection;

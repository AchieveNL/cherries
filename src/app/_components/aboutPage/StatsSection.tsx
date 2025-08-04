import { CallIcon, PackageIcon, PeopleIcon, SecurityLockIcon } from '../icons/about-us';

const StatsSection = () => {
  const stats = [
    {
      icon: PackageIcon,
      label: 'CUSTOM PRODUCTS',
      info: '55+ Products',
      primary: 'yes',
      description:
        'Cherries is building an international lifestyle brand where luxury, sustainability, and identity come together.',
    },
    {
      icon: PeopleIcon,
      label: '10K+ MONTHLY USERS',
      description:
        'Cherries is building an international lifestyle brand where luxury, sustainability, and identity come together.',
    },
    {
      icon: SecurityLockIcon,
      label: '99.9% SECURE PAYMENTS',
      description:
        'Cherries is building an international lifestyle brand where luxury, sustainability, and identity come together.',
    },
    {
      icon: CallIcon,
      label: '24/7 CUSTOMER SERVICE',
      description:
        'Cherries is building an international lifestyle brand where luxury, sustainability, and identity come together.',
    },
  ];

  return (
    <div className="bg-white pt-4 sm:pt-8 lg:pt-12 xl-pt-18 pb-8 sm:pb-12 lg:pb-14 xl:pb-20">
      <div className="max-w-8xl container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 xl:gap-12">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="p-4 sm:p-6 lg:p-8 w-full max-w-[332px] mx-auto h-auto min-h-[280px] sm:min-h-[300px] lg:h-[332px] rounded-2xl flex flex-col "
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
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
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
              <div className="font-medium text-[11px] sm:text-[12px] text-text leading-relaxed">
                {stat.description ||
                  'Cherries is building an international lifestyle brand where luxury, sustainability, and identity come together.'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsSection;

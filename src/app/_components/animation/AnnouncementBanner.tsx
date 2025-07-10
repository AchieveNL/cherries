import { motion } from 'framer-motion';

import { StarAnnouncementBanner } from '../icons/landingPage/StarAnnouncementBanner';

const AnnouncementBanner = () => {
  const text = 'UP TO 50% OFF ONLY UNTIL THE END OF THIS MONTH';

  return (
    <div className="bg-black text-white py-3 overflow-hidden relative">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{
          x: [0, -100 + '%'],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: 20,
            ease: 'linear',
          },
        }}
      >
        {/* Repeat the text multiple times for seamless loop */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center">
            <span className="text-[26px] font-medium px-8">{text}</span>
            <StarAnnouncementBanner className="" />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default AnnouncementBanner;

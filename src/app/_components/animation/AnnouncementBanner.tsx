import { useEffect, useState } from 'react';

import { StarAnnouncementBanner } from '../icons/landingPage/StarAnnouncementBanner';

const AnnouncementBanner = () => {
  const [isPaused, setIsPaused] = useState(false);
  const text = 'UP TO 50% OFF ONLY UNTIL THE END OF THIS MONTH';

  // Add CSS keyframes to document head
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes scroll-banner {
        0% {
          transform: translateX(0);
        }
        100% {
          transform: translateX(-100%);
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div
      className="bg-black text-white py-3 overflow-hidden relative cursor-pointer"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="flex whitespace-nowrap"
        style={{
          animation: 'scroll-banner 20s linear infinite',
          animationPlayState: isPaused ? 'paused' : 'running',
        }}
      >
        {/* Repeat the text multiple times for seamless loop */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center">
            <span className="text-[26px] font-medium px-8 transition-colors duration-200 hover:text-gray-300">
              {text}
            </span>
            <StarAnnouncementBanner className="transition-transform duration-200 hover:scale-110" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementBanner;

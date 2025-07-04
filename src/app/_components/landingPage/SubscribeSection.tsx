import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

import { Button } from '../ui';

const SubscribeSection = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      console.log('Subscribed:', email);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <section className="py-6 sm:py-8 md:py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="bg-white overflow-hidden  shadow-sm">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left Content */}
            <div className="p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 flex flex-col justify-center order-2 lg:order-1">
              <motion.h2
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[80px] 2xl:text-[116px] font-black text-gray-900 leading-[0.9] mb-4 sm:mb-6 md:mb-8"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                SUBSCRIBE
                <br />
                NOW
              </motion.h2>

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 ring-1 ring-primary border-0 focus:ring-2 focus:ring-primary focus:outline-none text-sm sm:text-base md:text-lg lg:text-xl xl:text-[24px] text-gray-900 placeholder-gray-500 w-full transition-all duration-200"
                    required
                  />
                  <Button
                    className="ring-1 ring-primary hover:ring-2 focus:ring-2 text-sm sm:text-base md:text-lg lg:text-xl xl:text-[24px] w-full sm:w-auto whitespace-nowrap px-4 sm:px-6 py-2.5 sm:py-3 transition-all duration-200"
                    type="submit"
                    disabled={isSubscribed}
                  >
                    {isSubscribed ? 'Subscribed!' : 'Subscribe'}
                  </Button>
                </div>
                {isSubscribed && (
                  <motion.p
                    className="text-green-600 text-xs sm:text-sm md:text-base font-medium"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    Thank you for subscribing!
                  </motion.p>
                )}
              </form>
            </div>

            {/* Right Image */}
            <div className="relative overflow-hidden order-1 lg:order-2 min-h-[250px] sm:min-h-[300px] md:min-h-[400px] lg:min-h-[500px] xl:min-h-[679px]">
              <div className="absolute inset-0 flex items-center justify-center lg:justify-end">
                <div className="relative w-full h-full max-w-[280px] sm:max-w-[320px] md:max-w-[400px] lg:max-w-[450px] xl:max-w-[522px]">
                  <Image
                    src="/landingPage/subscribe/subscribe-img.webp"
                    alt="Fashion model with gold accessories"
                    fill
                    className="object-cover object-center  lg:object-right"
                    sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, (max-width: 1024px) 400px, (max-width: 1280px) 450px, 522px"
                    priority
                  />
                </div>
              </div>

              {/* Optional: Gradient overlay for better text readability on mobile if needed */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent lg:hidden pointer-events-none"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubscribeSection;

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
      // Handle subscription logic here
      console.log('Subscribed:', email);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <section className=" py-16">
      <div className="container mx-auto px-8">
        <div className="bg-white   overflow-hidden h-[679px]">
          <div className="grid lg:grid-cols-2">
            {/* Left Content */}
            <div className="p-12 lg:p-16 flex flex-col h-[679px] justify-center">
              <motion.h2
                className="text-5xl lg:text-[116px] font-black text-gray-900 leading-tight mb-8"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                SUBSCRIBE
                <br />
                NOW
              </motion.h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-3 ring text-[28px]   ring-primary text-gray-900 placeholder-gray-500"
                    required
                  />
                  <Button className="ring ring-primary  text-[28px]" type="submit" disabled={isSubscribed}>
                    {isSubscribed ? 'Subscribed!' : 'Subscribe'}
                  </Button>
                </div>

                {isSubscribed && (
                  <motion.p
                    className="text-green-600 text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    Thank you for subscribing!
                  </motion.p>
                )}
              </form>
            </div>

            {/* Right Image */}
            <div className="relative overflow-hidden justify-self-end">
              <Image
                src="/landingPage/subscribe/subscribe-img.png"
                alt="Fashion model with gold accessories"
                width={522}
                height={679}
                unoptimized
                className=""
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubscribeSection;

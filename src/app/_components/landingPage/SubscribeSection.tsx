import { motion } from 'framer-motion';
import { useState } from 'react';

import Button from '../ui/Button';

const SubscribeSection = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({
    type: null,
    message: '',
  });

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setStatus({
        type: 'error',
        message: 'Please enter a valid email address',
      });
      return;
    }

    setIsLoading(true);
    setStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (result.success) {
        setStatus({
          type: 'success',
          message: result.message || 'Successfully subscribed!',
        });
        setEmail(''); // Clear the input
      } else {
        setStatus({
          type: 'error',
          message: result.error || 'An error occurred',
        });
      }
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'An error occurred. Please try again.',
      });
      console.error('Newsletter signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-6 sm:py-8 md:py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="bg-white overflow-hidden shadow-sm">
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

              <div className="space-y-3 sm:space-y-4">
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-0">
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                    className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 ring-1 ring-primary border-0 focus:ring-2 focus:ring-primary focus:outline-none text-sm sm:text-base md:text-lg lg:text-xl xl:text-[24px] text-gray-900 placeholder-gray-500 w-full transition-all duration-200 disabled:opacity-50"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                  />
                  <Button
                    className="ring-1 ring-primary hover:ring-2 focus:ring-2 text-sm sm:text-base md:text-lg lg:text-xl xl:text-[24px] w-full sm:w-auto whitespace-nowrap px-4 sm:px-6 py-2.5 sm:py-3 transition-all duration-200"
                    onClick={() => handleSubmit({} as React.MouseEvent<HTMLButtonElement>)}
                  >
                    {isLoading ? 'Subscribing...' : 'Subscribe'}
                  </Button>
                </div>

                {/* Status message */}
                {status.type && (
                  <motion.div
                    className={`p-3  flex items-center text-sm ${
                      status.type === 'success'
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {status.type === 'success' && (
                      <svg className="mr-2 w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    <span>{status.message}</span>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Right Image */}
            <div className="relative overflow-hidden order-1 lg:order-2 min-h-[350px] sm:min-h-[300px] md:min-h-[400px] lg:min-h-[500px] xl:min-h-[679px]">
              <div className="absolute inset-0 flex items-center justify-center lg:justify-end">
                <div className="relative w-full h-full max-w-[310px] sm:max-w-[320px] md:max-w-[400px] lg:max-w-[450px] xl:max-w-[522px]">
                  <img
                    src="/landingPage/subscribe/subscribe-img.webp"
                    alt="Fashion model with gold accessories"
                    className="w-full h-full object-cover object-center lg:object-right"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubscribeSection;

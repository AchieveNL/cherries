'use client';

import { motion } from 'framer-motion';

const SubscribeSection = () => {
  return (
    <section className="py-6 sm:py-8 md:py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6 md:px-8">
        <div className="bg-white overflow-hidden shadow-sm">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left Content */}
            <div className="p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16 flex flex-col justify-center order-2 lg:order-1">
              <motion.h2
                className="text-2xl break-all sm:text-3xl md:text-4xl lg:text-5xl xl:text-[80px] 2xl:text-[106px] font-black text-gray-900 leading-[0.9] mb-4 sm:mb-6 md:mb-8"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                SUBSCRIBE NOW
              </motion.h2>

              <div
                data-form-root="true"
                data-forms-id="forms-root-587671"
                data-forms-text-color="#202020"
                data-forms-button-background-color="#830016"
                data-forms-button-label-color="#FFFFFF"
                data-forms-links-color="#1878B9"
                data-forms-errors-color="#E02229"
                data-forms-text-alignment="center"
                data-forms-alignment="left"
                data-forms-padding-top="5"
                data-forms-padding-right="0"
                data-forms-padding-bottom="0"
                data-forms-padding-left="0"
              ></div>
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

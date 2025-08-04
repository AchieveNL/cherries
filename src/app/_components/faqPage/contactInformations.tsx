import { Mail, Phone } from 'lucide-react';

import { siteConfig } from '@/config/site';

const ContactInformation = () => {
  return (
    <section className="pb-96  md:py-20 font-roboto">
      <div className="container mx-auto px-4 max-w-8xl text-center">
        <h2 className="text-2xl md:text-[73px] mb-4 md:mb-12 font-bungee font-bold text-black tracking-wide">
          STILL HAVE QUESTIONS?
        </h2>
        <p className="text-xl md:text-2xl   text-[#161616] mb-12 leading-relaxed">
          Our customer support team is here to help you with any questions not covered in our FAQ.
        </p>
        <div className="grid h-[448px] md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white py-24 p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Mail className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Email Support</h3>
            <p className="text-[#5D5D5D] font-semibold mb-4">Get detailed answers via email</p>
            <a
              href={`mailto:${siteConfig.contact.support}`}
              className="text-primary font-medium mt-8 hover:underline transition-all duration-200 hover:text-primary/80"
            >
              {siteConfig.contact.support}
            </a>
            <p className="text-sm text-gray-500 mt-2">Response within 24 hours</p>
          </div>
          <div className="bg-white py-24 p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Phone className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Phone Support</h3>
            <p className="text-[#5D5D5D] font-semibold mb-4">Speak directly with our team</p>
            <a
              href={`tel:${siteConfig.business.phone}`}
              className="text-primary font-medium mt-8 hover:underline transition-all duration-200 hover:text-primary/80"
            >
              {siteConfig.business.phone}
            </a>
            <p className="text-sm text-gray-500 mt-2">Mon-Fri 9AM-6PM EST</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInformation;

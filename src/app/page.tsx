import Image from 'next/image';
import * as React from 'react';
import { SVGProps } from 'react';

interface SVGRProps {
  title?: string;
  titleId?: string;
}

const EmailIcon = ({ title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" aria-labelledby={titleId} {...props}>
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill="#171717"
      d="m20.75 10.093-7.427 4.57a3 3 0 0 1-1.365.438l-.208.007a3 3 0 0 1-1.573-.446L2.75 10.094v7.656a1.5 1.5 0 0 0 1.5 1.5h15a1.5 1.5 0 0 0 1.5-1.5v-7.657Zm0-2.843a1.5 1.5 0 0 0-1.5-1.5h-15a1.5 1.5 0 0 0-1.5 1.5v.244l.012.19a1.5 1.5 0 0 0 .7 1.087l7.5 4.614.184.096a1.5 1.5 0 0 0 .604.127l.207-.014c.205-.029.403-.099.58-.208l7.5-4.615.155-.11a1.502 1.502 0 0 0 .546-.977l.012-.19V7.25Zm1.5 10.5a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3V7.25a3 3 0 0 1 3-3h15a3 3 0 0 1 3 3v10.5Z"
    />
  </svg>
);

const ArrowIcon = ({ title, titleId, ...props }: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={18} height={14} fill="none" aria-labelledby={titleId} {...props}>
    {title ? <title id={titleId}>{title}</title> : null}
    <path
      fill="#F8FAFC"
      fillRule="evenodd"
      d="M9.808.308a.625.625 0 0 1 .884 0l6.25 6.25a.625.625 0 0 1 0 .884l-6.25 6.25a.626.626 0 1 1-.884-.884l5.184-5.183H1.5a.625.625 0 0 1 0-1.25h13.492L9.808 1.192a.625.625 0 0 1 0-.884Z"
      clipRule="evenodd"
    />
  </svg>
);

export default function Home() {
  return (
    <main className="relative bg-[#830016] min-h-screen">
      {/* Header */}
      <header className="flex bg-white min-h-[80px] lg:min-h-[101px] flex-col items-center justify-center py-4 px-4">
        <Image
          src="/logo.svg"
          alt="Logo"
          width={300}
          height={69}
          className="w-auto h-[40px] sm:h-[50px] lg:h-[69px] max-w-[280px]"
        />
      </header>

      {/* Main Section  */}
      <section className=" pt-40 sm:pt-36 bg-[url('/hero-bg.png')]  pb-20 sm:pb-24 lg:pb-32 min-h-[calc(100vh-80px)] lg:min-h-[calc(100vh-101px)] px-4">
        <div className="text-center max-w-6xl mx-auto">
          {/*  heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 lg:mb-8 leading-tight">
            Coming soon!
          </h1>

          {/*  paragraph */}
          <p className="text-base sm:text-lg lg:text-xl mx-auto max-w-[895px] text-white mb-8 sm:mb-12 lg:mb-16 px-4 leading-relaxed">
            Meld je aan voor onze nieuwsbrief en ontvang 10% korting op je eerste bestelling. Blijf op de hoogte van
            nieuwe producten en speciale aanbiedingen.🔥
          </p>
        </div>

        {/* Email signup form */}
        <div className="w-full relative z-10 max-w-[848px] mx-auto px-4">
          <div className="rounded-[20px] sm:rounded-[24px] bg-[#EFE8DD] p-4 sm:p-6">
            {/* Header text  */}
            <h4 className="text-[#171717] text-[14px] sm:text-[16px] font-semibold flex items-center mb-3 sm:mb-4">
              <EmailIcon className="mr-2 w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" />
              <span className="leading-tight">Meld je aan en ontvang direct 10% korting!</span>
            </h4>

            {/* Separator line */}
            <div className="w-full h-[1px] bg-[#676767] mb-3 sm:mb-4"></div>

            {/* Input with arrow button */}
            <div className="relative">
              <input
                type="email"
                placeholder="Vul je email adres in"
                className="w-full h-[44px] sm:h-[48px] bg-white rounded-full px-4 sm:px-6 pr-14 sm:pr-16 outline-none text-[#4F4F4F] text-[14px] sm:text-[16px] font-normal border border-[#E0E0E0] focus:border-[#BDBDBD] transition-colors placeholder:text-[#000000]"
              />
              <button className="absolute right-1  top-1/2 transform -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-[#830016] rounded-full flex items-center justify-center hover:bg-[#661012] active:bg-[#4a000c] transition-colors">
                <ArrowIcon className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Hero frame image */}
      <div className="absolute bottom-0 left-0 w-full z-0">
        <Image
          src="/hero-frame.png"
          alt="Hero Frame"
          width={1920}
          height={413}
          className="w-full h-auto max-h-[120px] sm:max-h-[200px] lg:max-h-none object-cover object-top"
        />
      </div>
    </main>
  );
}

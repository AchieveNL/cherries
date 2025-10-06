'use client';

import React, { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface AuroraBackgroundProps extends React.HTMLProps<HTMLDivElement> {
  children: ReactNode;
  showRadialGradient?: boolean;
}

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}: AuroraBackgroundProps) => {
  return (
    <main>
      <div
        className={cn(
          'transition-bg relative flex h-[100vh] flex-col items-center justify-center bg-zinc-50 text-slate-950 ',
          className
        )}
        {...props}
      >
        <div
          className="absolute inset-0 overflow-hidden"
          style={
            {
              '--aurora':
                'repeating-linear-gradient(100deg,#195B91_10%,#4A90E2_15%,#87CEEB_20%,#B0E0E6_25%,#195B91_30%)',
              '--white-gradient':
                'repeating-linear-gradient(100deg,#fff_0%,#fff_7%,transparent_10%,transparent_12%,#fff_16%)',
              '--custom-blue': '#195B91',
              '--custom-blue-light': '#4A90E2',
              '--custom-blue-sky': '#87CEEB',
              '--custom-blue-powder': '#B0E0E6',
              '--black': '#000',
              '--white': '#fff',
              '--transparent': 'transparent',
            } as React.CSSProperties
          }
        >
          <div
            //   I'm sorry but this is what peak developer performance looks like // trigger warning
            className={cn(
              `after:animate-aurora pointer-events-none absolute -inset-[10px] [background-image:var(--white-gradient),var(--aurora)] [background-size:300%,_200%] [background-position:50%_50%,50%_50%] opacity-50 blur-[10px] filter will-change-transform [--aurora:repeating-linear-gradient(100deg,var(--custom-blue)_10%,var(--custom-blue-light)_15%,var(--custom-blue-sky)_20%,var(--custom-blue-powder)_25%,var(--custom-blue)_30%)]  [--white-gradient:repeating-linear-gradient(100deg,var(--white)_0%,var(--white)_7%,var(--transparent)_10%,var(--transparent)_12%,var(--white)_16%)] after:absolute after:inset-0 after:[background-image:var(--white-gradient),var(--aurora)] after:[background-size:200%,_100%] after:[background-attachment:fixed] after:mix-blend-multiply after:content-[""]`,
              showRadialGradient && `[mask-image:radial-gradient(ellipse_at_100%_0%,black_10%,var(--transparent)_70%)]`
            )}
          ></div>
        </div>
        {children}
      </div>
    </main>
  );
};

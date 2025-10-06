import * as React from 'react';
import { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <path
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 18a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4 2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z"
    />
    <path stroke="currentColor" strokeWidth={2} d="M12 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
  </svg>
);
export { SvgComponent as AccountIcon };

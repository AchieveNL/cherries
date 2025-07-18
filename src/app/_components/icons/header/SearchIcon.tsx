import * as React from 'react';
import { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={19} height={19} fill="none" {...props}>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m18 18-4.303-4.303m0 0a7.44 7.44 0 0 0-2.413-12.13 7.438 7.438 0 1 0 2.413 12.13Z"
    />
  </svg>
);
export { SvgComponent as SearchIcon };

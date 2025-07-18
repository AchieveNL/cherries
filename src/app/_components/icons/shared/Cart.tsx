import * as React from 'react';
import { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="none" {...props}>
    <path
      stroke="#fff"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3.333 7.5h13.334l-.696 7.65a1.667 1.667 0 0 1-1.66 1.517H5.689A1.667 1.667 0 0 1 4.03 15.15L3.333 7.5Z"
    />
    <path stroke="#fff" strokeLinecap="round" strokeWidth={2} d="M6.667 9.167v-2.5a3.333 3.333 0 0 1 6.666 0v2.5" />
  </svg>
);
export { SvgComponent as CartIcon };

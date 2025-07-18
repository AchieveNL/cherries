import * as React from 'react';
import { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <path
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M4 9h16l-.835 9.181A2 2 0 0 1 17.174 20H6.826a2 2 0 0 1-1.991-1.819L4 9Z"
    />
    <path stroke="currentColor" strokeLinecap="round" strokeWidth={1.5} d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
);
export { SvgComponent as ShoppingIcon };

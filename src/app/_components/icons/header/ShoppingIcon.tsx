import * as React from 'react';
import { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={21} fill="none" {...props}>
    <path
      fill="#000"
      d="M7.875 21a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5ZM20.125 21a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5ZM7.425 13.125h14.293l2.1-10.5H5.572L5.11 0H0v1.75h3.641l2.625 14.875h15.609v-1.75H7.734l-.309-1.75Z"
    />
  </svg>
);
export { SvgComponent as ShoppingIcon };

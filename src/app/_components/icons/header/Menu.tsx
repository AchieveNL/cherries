import * as React from 'react';
import { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={21} height={21} fill="none" {...props}>
    <path
      fill="currentColor"
      d="M13.096 3.904A6.5 6.5 0 1 0 3.82 13.01a6.5 6.5 0 0 0 9.276-9.107ZM2.49 2.49a8.5 8.5 0 0 1 12.686 11.272l5.345 5.345-1.414 1.414-5.345-5.345A8.5 8.5 0 0 1 2.49 2.49Z"
    />
  </svg>
);
export { SvgComponent as Menu };

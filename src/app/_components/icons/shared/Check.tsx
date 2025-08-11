import * as React from 'react';
import { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={13} height={9} fill="none" {...props}>
    <path
      stroke="#830016"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M11.334 1.166 4.667 7.833 1.334 4.499"
    />
  </svg>
);
export { SvgComponent as CheckIcon };

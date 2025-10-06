import * as React from 'react';
import { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={12} height={12} fill="none" {...props}>
    <path
      fill="#fff"
      d="M6 1.75a.75.75 0 0 1 .75.75v2.75H9.5a.75.75 0 1 1 0 1.5H6.75V9.5a.75.75 0 1 1-1.5 0V6.75H2.5a.75.75 0 0 1 0-1.5h2.75V2.5A.75.75 0 0 1 6 1.75Z"
    />
  </svg>
);
export { SvgComponent as PlusIcon };

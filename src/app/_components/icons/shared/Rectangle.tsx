import * as React from 'react';
import { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={2} height={16} fill="none" {...props}>
    <path fill="#D9D9D9" d="M0 0h2v16H0z" />
  </svg>
);
export { SvgComponent as RectangleIcon };

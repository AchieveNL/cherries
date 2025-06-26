import * as React from 'react';
import { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={26} height={17} fill="none" {...props}>
    <path
      stroke="#fff"
      d="M17.333 0c0 .901.794 2.246 1.598 3.376 1.034 1.457 2.269 2.728 3.685 3.698C23.677 7.802 24.964 8.5 26 8.5m0 0c-1.036 0-2.324.698-3.384 1.426-1.416.971-2.651 2.242-3.685 3.697-.804 1.13-1.598 2.478-1.598 3.377M26 8.5H0"
    />
  </svg>
);
export { SvgComponent as ArrowButton };

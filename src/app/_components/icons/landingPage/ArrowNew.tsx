import * as React from 'react';
import { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={47} height={37} fill="none" {...props}>
    <path
      stroke="#4D4D4D"
      strokeWidth={4}
      d="M22.076 2.027c.93 1.374 3.676 2.507 6.215 3.298 3.27 1.026 6.693 1.536 10.115 1.377 2.565-.12 5.485-.544 7.255-1.742m0 0c-1.77 1.198-3.25 3.753-4.312 6.09-1.417 3.118-2.216 6.486-2.48 9.9-.207 2.653-.173 5.627.755 6.997M45.66 4.96 1.227 35.042"
    />
  </svg>
);
export { SvgComponent as ArrowNew };

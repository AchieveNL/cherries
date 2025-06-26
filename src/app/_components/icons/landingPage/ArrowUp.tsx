import * as React from 'react';
import { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={17} height={28} fill="none" {...props}>
    <path
      stroke="#830016"
      d="M.875 9.08c.842 0 2.1-.831 3.156-1.674 1.362-1.082 2.55-2.376 3.457-3.86.68-1.112 1.333-2.46 1.333-3.546m0 0c0 1.085.652 2.435 1.332 3.546.908 1.484 2.097 2.778 3.457 3.86 1.056.843 2.316 1.675 3.156 1.675M8.821 0v27.242"
    />
  </svg>
);
export { SvgComponent as ArrowUp };

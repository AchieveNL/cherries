import * as React from 'react';
import { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.5 22.52c3.42 0 6.474-1.554 8.5-3.994-.752-4.013-4.268-7.052-8.5-7.052s-7.748 3.04-8.5 7.052a11.021 11.021 0 0 0 8.5 3.994ZM9.5 9.1a4.05 4.05 0 1 0 0-8.1 4.05 4.05 0 0 0 0 8.1Z"
    />
  </svg>
);
export { SvgComponent as AccountIcon };

import * as React from 'react';
import { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" {...props}>
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M11.998 2C8.99 2 7.04 4.019 4.734 4.755c-.938.3-1.407.449-1.597.66-.19.21-.245.519-.356 1.135-1.19 6.596 1.41 12.694 7.61 15.068.665.255.998.382 1.61.382.612 0 .946-.128 1.612-.383 6.199-2.373 8.796-8.471 7.606-15.067-.111-.616-.167-.925-.357-1.136-.19-.211-.658-.36-1.596-.659C16.959 4.019 15.006 2 11.998 2Z"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10.25 9.959c0-.06.008-.406.01-.84 0-.398-.034-.78.156-1.13.71-1.414 2.75-1.27 3.254.17.087.237.093.612.09.96-.003.443.006.84.006.84m-3.429.421c-1.08 0-1.62.78-1.74 1.26-.12.48-.12 2.22-.048 2.94.24.9.84 1.272 1.428 1.392.54.048 2.82.03 3.48.03.96.018 1.68-.342 1.98-1.422.06-.36.12-2.34-.03-2.94-.318-.96-1.11-1.26-1.71-1.26h-3.36Z"
    />
  </svg>
);
export { SvgComponent as SecurityLockIcon };

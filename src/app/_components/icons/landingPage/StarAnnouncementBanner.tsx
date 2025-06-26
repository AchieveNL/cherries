import * as React from 'react';
import { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={25} height={25} fill="none" {...props}>
    <path
      fill="#fff"
      fillRule="evenodd"
      d="M14.17 1.17c-.568-1.56-2.772-1.56-3.34 0L8.253 8.252 1.17 10.83c-1.559.568-1.559 2.772 0 3.34l7.084 2.577 2.577 7.084c.568 1.559 2.772 1.559 3.34 0l2.577-7.084 7.084-2.577c1.559-.568 1.559-2.772 0-3.34l-7.084-2.577L14.17 1.17Z"
      clipRule="evenodd"
    />
  </svg>
);
export { SvgComponent as StarAnnouncementBanner };

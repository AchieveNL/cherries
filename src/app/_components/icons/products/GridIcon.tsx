import * as React from 'react';
import { SVGProps } from 'react';

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none" {...props}>
    <path
      fill="currentColor"
      d="M5.819 4.362h4.362V0H5.82v4.362ZM11.637 0v4.362H16V0h-4.363ZM0 4.362h4.362V0H0v4.362Zm5.819 5.82h4.362V5.818H5.82v4.362Zm5.818 0H16V5.818h-4.363v4.362ZM0 10.181h4.362V5.818H0v4.362ZM5.819 16h4.362v-4.363H5.82V16Zm5.818 0H16v-4.363h-4.363V16ZM0 16h4.362v-4.363H0V16Z"
    />
  </svg>
);
export { SvgComponent as GridIcon };

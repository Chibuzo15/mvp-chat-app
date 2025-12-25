import * as React from "react"
import { SVGProps } from "react"

const FilterIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 14 15"
    fill="none"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.3}
      d="M.65.65h12v1.629a1.5 1.5 0 0 1-.44 1.06L8.9 6.65v5.25l-4.5 1.5V7.025L1.04 3.329A1.5 1.5 0 0 1 .65 2.32V.65Z"
    />
  </svg>
)

export default FilterIcon


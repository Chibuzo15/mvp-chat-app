import * as React from "react"
import { SVGProps } from "react"

const PhoneIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 16 16"
    fill="none"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3.333 2.667H6L7.333 6 5.667 7A7.333 7.333 0 0 0 9 10.333l1-1.666L13.333 10v2.667A1.333 1.333 0 0 1 12 14 10.666 10.666 0 0 1 2 4a1.333 1.333 0 0 1 1.333-1.333Z"
    />
  </svg>
)

export default PhoneIcon


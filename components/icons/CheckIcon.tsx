import * as React from "react"
import { SVGProps } from "react"

const CheckIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 13 7"
    fill="none"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.167}
      d="M.583 3.5 3.5 6.417M6.417 3.5 9.333.583"
    />
  </svg>
)

export default CheckIcon


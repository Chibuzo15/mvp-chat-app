import * as React from "react"
import { SVGProps } from "react"

const BellIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M6 11.333V12a2 2 0 0 0 4 0v-.667m-3.333-8a1.333 1.333 0 0 1 2.666 0 4.667 4.667 0 0 1 2.667 4v2a2.668 2.668 0 0 0 1.333 2H2.667a2.666 2.666 0 0 0 1.333-2v-2a4.667 4.667 0 0 1 2.667-4Z"
    />
  </svg>
)

export default BellIcon


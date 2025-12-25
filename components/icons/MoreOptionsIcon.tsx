import * as React from "react"
import { SVGProps } from "react"

const MoreOptionsIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 13 3"
    fill="none"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M.75 1.417a.667.667 0 1 0 1.333 0 .667.667 0 0 0-1.333 0ZM5.417 1.417a.667.667 0 1 0 1.333 0 .667.667 0 0 0-1.333 0ZM10.083 1.417a.667.667 0 1 0 1.334 0 .667.667 0 0 0-1.334 0Z"
    />
  </svg>
)

export default MoreOptionsIcon


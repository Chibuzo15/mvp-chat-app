import * as React from "react"
import { SVGProps } from "react"

const MuteIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 13 12"
    fill="none"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.333}
      d="M9.333 4.623 12 7.289m0-2.666L9.333 7.289m-6.666.667H1.333a.667.667 0 0 1-.666-.667V4.623a.667.667 0 0 1 .666-.667h1.334L5 .956a.533.533 0 0 1 1 .333v9.334a.533.533 0 0 1-1 .333l-2.333-3Z"
    />
  </svg>
)

export default MuteIcon


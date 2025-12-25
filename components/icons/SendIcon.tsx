import * as React from "react"
import { SVGProps } from "react"

const SendIcon = (props: SVGProps<SVGSVGElement>) => (
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
      strokeWidth={1.3}
      d="M6.667 9.333 14 2M6.667 9.333 9 14a.367.367 0 0 0 .667 0L14 2M6.667 9.333 2 7a.367.367 0 0 1 0-.667L14 2"
    />
  </svg>
)

export default SendIcon


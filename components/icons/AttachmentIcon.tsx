import * as React from "react"
import { SVGProps } from "react"

const AttachmentIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 15 13"
    fill="none"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.3}
      d="M7.279 3.125 3.487 6.917a1.237 1.237 0 0 0 1.75 1.75L9.03 4.875a2.475 2.475 0 0 0-3.5-3.5L1.737 5.167a3.712 3.712 0 0 0 5.25 5.25l3.792-3.792"
    />
  </svg>
)

export default AttachmentIcon


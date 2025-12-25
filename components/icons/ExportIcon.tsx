import * as React from "react"
import { SVGProps } from "react"

const ExportIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 12 13"
    fill="none"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.333}
      d="M.667 9.333v1.334A1.333 1.333 0 0 0 2 12h8a1.334 1.334 0 0 0 1.333-1.333V9.333M2.667 4 6 .667m0 0L9.333 4M6 .667v8"
    />
  </svg>
)

export default ExportIcon


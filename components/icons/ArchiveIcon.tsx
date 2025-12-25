import * as React from "react"
import { SVGProps } from "react"

const ArchiveIcon = (props: SVGProps<SVGSVGElement>) => (
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
      strokeWidth={1.333}
      d="M12.667 5.333a1.333 1.333 0 0 0 0-2.666H3.333a1.333 1.333 0 0 0 0 2.666m9.334 0H3.333m9.334 0V12a1.333 1.333 0 0 1-1.334 1.333H4.667A1.333 1.333 0 0 1 3.333 12V5.333M6.667 8h2.666"
    />
  </svg>
)

export default ArchiveIcon


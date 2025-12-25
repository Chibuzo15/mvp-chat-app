import * as React from "react"
import { SVGProps } from "react"

const PenIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 14 13"
    fill="none"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.3}
      d="m7.775 2.021 3 3M9.65 10.646h3m-1.5-1.5v3m-7.5 0 7.875-7.875a2.12 2.12 0 1 0-3-3L.65 9.146v3h3Z"
    />
  </svg>
)

export default PenIcon


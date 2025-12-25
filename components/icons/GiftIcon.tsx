import * as React from "react"
import { SVGProps } from "react"

const GiftIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10 5v10m-5-5h10M3.333 10H2.5a1.667 1.667 0 0 1-1.667-1.667V6.667A1.667 1.667 0 0 1 2.5 5h2.5m11.667 5h.833a1.667 1.667 0 0 0 1.667-1.667V6.667A1.667 1.667 0 0 0 17.5 5h-2.5M5 5h10M5 5a2.5 2.5 0 0 1 5-2.5M5 5a2.5 2.5 0 0 0 5 2.5m5-2.5a2.5 2.5 0 0 1-5-2.5m5 2.5a2.5 2.5 0 0 0-5 2.5M5 10v5.833A1.667 1.667 0 0 0 6.667 17.5h6.666A1.667 1.667 0 0 0 15 15.833V10"
    />
  </svg>
)

export default GiftIcon


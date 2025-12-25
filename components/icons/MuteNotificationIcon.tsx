import * as React from "react"
import { SVGProps } from "react"

const MuteNotificationIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 14 14"
    fill="none"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.333}
      d="M2.779 11.233a2.666 2.666 0 0 1 2.554-1.9H8a2.667 2.667 0 0 1 2.556 1.904m-9.89-4.57a6 6 0 1 0 12 0 6 6 0 0 0-12 0Zm4-1.334a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z"
    />
  </svg>
)

export default MuteNotificationIcon


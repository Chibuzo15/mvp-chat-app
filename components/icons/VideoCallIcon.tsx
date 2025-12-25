import * as React from "react"
import { SVGProps } from "react"

const VideoCallIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="m10 6.667 3.035-1.518a.667.667 0 0 1 .965.596v4.51a.667.667 0 0 1-.965.596L10 9.333V6.667ZM2 5.333A1.333 1.333 0 0 1 3.333 4h5.334A1.333 1.333 0 0 1 10 5.333v5.334A1.333 1.333 0 0 1 8.667 12H3.333A1.334 1.334 0 0 1 2 10.667V5.333Z"
    />
  </svg>
)

export default VideoCallIcon


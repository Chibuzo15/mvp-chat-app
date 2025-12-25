import * as React from "react"
import { SVGProps } from "react"

const MicrophoneIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 10 13"
    fill="none"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.3}
      d="M.65 5.317A4.083 4.083 0 0 0 4.733 9.4m0 0a4.083 4.083 0 0 0 4.084-4.083M4.733 9.4v2.333m-2.333 0h4.667M2.983 2.4a1.75 1.75 0 0 1 3.5 0v2.917a1.75 1.75 0 0 1-3.5 0V2.4Z"
    />
  </svg>
)

export default MicrophoneIcon


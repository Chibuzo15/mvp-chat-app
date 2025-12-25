import * as React from "react"
import { SVGProps } from "react"

const BackIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 4 8"
    fill="none"
    {...props}
  >
    <path
      fill="#09090B"
      fillRule="evenodd"
      d="M3.479 7.557a.5.5 0 0 0 .078-.703L1.14 3.834 3.557.811a.5.5 0 1 0-.78-.624L.11 3.52a.5.5 0 0 0 0 .625l2.666 3.333a.5.5 0 0 0 .703.078Z"
      clipRule="evenodd"
    />
  </svg>
)

export default BackIcon


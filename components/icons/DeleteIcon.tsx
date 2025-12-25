import * as React from "react"
import { SVGProps } from "react"

const DeleteIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 12 14"
    fill="none"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.333}
      d="M.667 3.333h10.666M4.667 6v4m2.666-4v4m-6-6.667.667 8a1.333 1.333 0 0 0 1.333 1.334h5.334A1.333 1.333 0 0 0 10 11.333l.667-8M4 3.333v-2a.667.667 0 0 1 .667-.666h2.666A.667.667 0 0 1 8 1.333v2"
    />
  </svg>
)

export default DeleteIcon


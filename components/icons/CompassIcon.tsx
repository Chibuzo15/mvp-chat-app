import * as React from "react"
import { SVGProps } from "react"

const CompassIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 16 16"
    fill="none"
    {...props}
  >
    <path
      fill="currentColor"
      d="M8.125 0a8.125 8.125 0 1 0 8.125 8.125A8.133 8.133 0 0 0 8.125 0Zm0 15A6.875 6.875 0 1 1 15 8.125 6.883 6.883 0 0 1 8.125 15Zm3.47-11.184-5 2.5a.629.629 0 0 0-.28.28l-2.5 5a.625.625 0 0 0 .84.838l5-2.5a.629.629 0 0 0 .28-.28l2.5-5a.625.625 0 0 0-.84-.838Zm-2.689 5.09-3.133 1.571 1.57-3.133 3.137-1.568-1.574 3.13Z"
    />
  </svg>
)

export default CompassIcon


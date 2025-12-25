import * as React from "react"
import { SVGProps } from "react"

const MessageIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 20 18"
    fill="none"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.875}
      d="m2.5 16.667 1.083-3.25c-.936-1.385-1.275-3.025-.953-4.615.322-1.59 1.283-3.022 2.703-4.03 1.42-1.008 3.205-1.523 5.02-1.45 1.816.074 3.54.731 4.851 1.85 1.312 1.119 2.122 2.623 2.28 4.232.157 1.61-.348 3.215-1.422 4.519-1.075 1.303-2.645 2.215-4.419 2.566a8.33 8.33 0 0 1-5.226-.656l-3.917.834Z"
    />
  </svg>
)

export default MessageIcon


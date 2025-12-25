import * as React from "react"
import { SVGProps } from "react"

const MessageMenuIcon = (props: SVGProps<SVGSVGElement>) => (
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
      strokeWidth={1.333}
      d="m.667 11.348.866-2.6c-1.549-2.292-.95-5.249 1.4-6.917C5.284.164 8.66.301 10.83 2.151c2.17 1.852 2.463 4.844.686 7.001C9.74 11.31 6.44 11.962 3.8 10.681l-3.133.667Z"
    />
  </svg>
)

export default MessageMenuIcon


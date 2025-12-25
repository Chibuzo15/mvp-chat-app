import * as React from "react"
import { SVGProps } from "react"

const ChatIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M8.127 0A8.125 8.125 0 0 0 .953 11.944l-.886 2.66a1.25 1.25 0 0 0 1.58 1.581l2.661-.887A8.125 8.125 0 1 0 8.127 0Zm0 15a6.865 6.865 0 0 1-3.442-.923.625.625 0 0 0-.511-.052L1.252 15l.974-2.922a.625.625 0 0 0-.052-.51A6.875 6.875 0 1 1 8.127 15Z"
    />
  </svg>
)

export default ChatIcon


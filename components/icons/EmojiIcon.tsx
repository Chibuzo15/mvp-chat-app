import * as React from "react"
import { SVGProps } from "react"

const EmojiIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 12 12"
    fill="none"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.3}
      d="M4.15 4.15h.006m3.494 0h.006M.65 5.9a5.25 5.25 0 1 0 10.5 0 5.25 5.25 0 0 0-10.5 0Zm2.917.583a2.333 2.333 0 1 0 4.666 0H3.567Z"
    />
  </svg>
)

export default EmojiIcon


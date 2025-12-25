import * as React from "react"
import { SVGProps } from "react"

const SearchIcon = (props: SVGProps<SVGSVGElement>) => (
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
      strokeWidth={1.2}
      d="m12.6 12.6-4-4m-8-3.333a4.667 4.667 0 1 0 9.333 0 4.667 4.667 0 0 0-9.333 0Z"
    />
  </svg>
)

export default SearchIcon


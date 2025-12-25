import * as React from "react"
import { SVGProps } from "react"

const SunIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 20 20"
    fill="none"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10 3.333V1.667m0 16.666v1.666M16.667 10h1.666M1.667 10H3.333m12.728-5.595 1.179-1.179m-14.14 14.14-1.179-1.179m14.14 0-1.179 1.179M4.393 4.405 3.214 3.226m0 13.548 1.179-1.179M10 15a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"
    />
  </svg>
)

export default SunIcon


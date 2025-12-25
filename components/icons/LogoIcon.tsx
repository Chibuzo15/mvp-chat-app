import * as React from "react"
import { SVGProps } from "react"
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 20 22"
    fill="none"
    {...props}
  >
    <path
      fill="#fff"
      fillRule="evenodd"
      d="M0 8.25v8.8h2.75a2.2 2.2 0 0 1 2.2 2.2V22h6.6l8.25-8.25v-8.8h-2.75a2.2 2.2 0 0 1-2.2-2.2V0h-6.6L0 8.25Zm9.35 8.25H5.5v-6.05l4.95-4.95h3.85v6.05L9.35 16.5Z"
      clipRule="evenodd"
    />
  </svg>
)
export default SvgComponent

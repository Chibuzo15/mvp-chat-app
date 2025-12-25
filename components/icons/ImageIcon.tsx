import * as React from "react"
import { SVGProps } from "react"

const ImageIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M13.75 0h-10A1.25 1.25 0 0 0 2.5 1.25V2.5H1.25A1.25 1.25 0 0 0 0 3.75v10A1.25 1.25 0 0 0 1.25 15h10a1.25 1.25 0 0 0 1.25-1.25V12.5h1.25A1.25 1.25 0 0 0 15 11.25v-10A1.25 1.25 0 0 0 13.75 0Zm-10 1.25h10v5.42l-1.305-1.304a1.25 1.25 0 0 0-1.767 0L4.795 11.25H3.75v-10Zm7.5 12.5h-10v-10H2.5v7.5a1.25 1.25 0 0 0 1.25 1.25h7.5v1.25Zm2.5-2.5H6.562l5-5 2.188 2.188v2.812Zm-6.875-5a1.875 1.875 0 1 0 0-3.75 1.875 1.875 0 0 0 0 3.75Zm0-2.5a.625.625 0 1 1 0 1.25.625.625 0 0 1 0-1.25Z"
    />
  </svg>
)

export default ImageIcon


import * as React from "react"
import { SVGProps } from "react"

const HomeIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M15 7.5V15a.625.625 0 0 1-.625.624H10A.625.625 0 0 1 9.375 15v-4.062a.312.312 0 0 0-.313-.313H5.938a.312.312 0 0 0-.313.313v4.062a.625.625 0 0 1-.625.625H.625A.625.625 0 0 1 0 15V7.5c0-.331.132-.649.366-.883l6.25-6.25a1.25 1.25 0 0 1 1.768 0l6.25 6.25c.234.234.366.552.366.883Z"
    />
  </svg>
)

export default HomeIcon


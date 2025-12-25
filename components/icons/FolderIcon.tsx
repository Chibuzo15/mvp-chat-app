import * as React from "react"
import { SVGProps } from "react"

const FolderIcon = (props: SVGProps<SVGSVGElement>) => (
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
      d="M15 2.5H8.384L6.25.366A1.239 1.239 0 0 0 5.366 0H1.25A1.25 1.25 0 0 0 0 1.25v11.298a1.203 1.203 0 0 0 1.202 1.202h13.867a1.182 1.182 0 0 0 1.181-1.18V3.75A1.25 1.25 0 0 0 15 2.5ZM1.25 1.25h4.116l1.25 1.25H1.25V1.25ZM15 12.5H1.25V3.75H15v8.75Z"
    />
  </svg>
)

export default FolderIcon


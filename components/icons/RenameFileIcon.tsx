import * as React from "react"
import { SVGProps } from "react"

const RenameFileIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 13 13"
    fill="none"
    {...props}
  >
    <path
      stroke="#28303F"
      strokeLinecap="round"
      d="M.5 12.5h12M7.69 2.041s0 1.09 1.09 2.18 2.179 1.09 2.179 1.09m-7.58 5.181 2.29-.327c.33-.047.635-.2.871-.436l5.509-5.508a1.541 1.541 0 0 0 0-2.18l-1.09-1.09a1.541 1.541 0 0 0-2.18 0L3.271 6.46a1.541 1.541 0 0 0-.436.872L2.508 9.62a.77.77 0 0 0 .872.872Z"
    />
  </svg>
)

export default RenameFileIcon


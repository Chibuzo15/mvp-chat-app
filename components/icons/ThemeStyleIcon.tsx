import * as React from "react"
import { SVGProps } from "react"

const ThemeStyleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 16 16"
    fill="none"
    {...props}
  >
    <g clipPath="url(#a)">
      <path
        stroke="#28303F"
        strokeLinecap="round"
        d="M8 1.333V2m0 12v.667m4.714-11.381-.471.471m-8.485 8.486-.472.471M14.666 8H14M2 8h-.667m11.381 4.714-.471-.471M3.758 3.757l-.472-.471M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h16v16H0z" />
      </clipPath>
    </defs>
  </svg>
)

export default ThemeStyleIcon


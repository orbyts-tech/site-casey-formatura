import type { SVGProps } from "react";

export function HangerIcon({ strokeWidth = 1.3, ...svgProps }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...svgProps}
    >
      <path d="M10 6.5a2 2 0 1 1 3.2 1.6c-.8.6-1.2 1.2-1.2 2.4" />
      <path d="M12 10.5 3.3 16.7a1 1 0 0 0 .6 1.8h16.2a1 1 0 0 0 .6-1.8L12 10.5" />
    </svg>
  );
}

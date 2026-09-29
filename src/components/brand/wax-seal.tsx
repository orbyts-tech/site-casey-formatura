import { useId } from "react";

interface WaxSealProps {
  readonly monogram: string;
  readonly className?: string;
}

const SEAL_EDGE_POINTS = 90;

function buildIrregularSealEdgePath(): string {
  const points = Array.from({ length: SEAL_EDGE_POINTS }, (_, index) => {
    const angle = (index / SEAL_EDGE_POINTS) * Math.PI * 2;
    const radius = 46 + 1.7 * Math.sin(angle * 7) + 1.1 * Math.sin(angle * 13 + 1.3);
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    return `${x.toFixed(2)} ${y.toFixed(2)}`;
  });

  return `M${points.join(" L")} Z`;
}

const SEAL_EDGE_PATH = buildIrregularSealEdgePath();

export function WaxSeal({ monogram, className = "" }: WaxSealProps) {
  const svgSafeId = useId().replace(/[^a-zA-Z0-9-]/g, "");
  const waxGradientId = `wax-${svgSafeId}`;
  const innerGradientId = `wax-inner-${svgSafeId}`;

  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={`drop-shadow-[0_6px_10px_rgba(21,51,38,0.35)] ${className}`}>
      <defs>
        <radialGradient id={waxGradientId} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor="#3f6b57" />
          <stop offset="55%" stopColor="#1f4636" />
          <stop offset="100%" stopColor="#10281d" />
        </radialGradient>
        <radialGradient id={innerGradientId} cx="60%" cy="65%" r="70%">
          <stop offset="0%" stopColor="#2b5543" />
          <stop offset="100%" stopColor="#173a2b" />
        </radialGradient>
      </defs>

      <path d={SEAL_EDGE_PATH} fill={`url(#${waxGradientId})`} />
      <circle cx="50" cy="50" r="34" fill={`url(#${innerGradientId})`} />
      <circle cx="50" cy="50" r="34" fill="none" stroke="#6f927f" strokeOpacity="0.55" strokeWidth="1.2" />
      <circle cx="50" cy="50" r="30.5" fill="none" stroke="#0d2218" strokeOpacity="0.45" strokeWidth="0.8" />

      <g stroke="#9bb5a6" strokeOpacity="0.7" strokeWidth="0.9" fill="none" strokeLinecap="round">
        <path d="M60 70 C 64 62, 66 56, 66 48" />
        <path d="M64 60 C 68 59, 70 56, 70 53 C 67 54, 65 56, 64 60 Z" fill="#9bb5a6" fillOpacity="0.25" />
        <path d="M65.5 52 C 69 50, 70 47, 69.5 44 C 67 45.5, 65.5 48, 65.5 52 Z" fill="#9bb5a6" fillOpacity="0.25" />
      </g>

      <text
        x="48.5"
        y="51.5"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="36"
        fill="#0d2218"
        fillOpacity="0.55"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {monogram}
      </text>
      <text
        x="47.5"
        y="50"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="36"
        fill="#c7d8cd"
        fillOpacity="0.9"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {monogram}
      </text>
    </svg>
  );
}

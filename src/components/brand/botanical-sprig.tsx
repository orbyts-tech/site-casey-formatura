interface BotanicalSprigProps {
  readonly className?: string;
}

interface LeafPlacement {
  readonly x: number;
  readonly y: number;
  readonly rotation: number;
  readonly scale: number;
}

const LEAF_PATH = "M0 0 C 8 -9, 22 -10, 32 0 C 22 8, 8 8, 0 0 Z";

const LEAF_PLACEMENTS: readonly LeafPlacement[] = [
  { x: 55, y: 150, rotation: -35, scale: 1.05 },
  { x: 56, y: 140, rotation: 215, scale: 1 },
  { x: 58, y: 118, rotation: -40, scale: 0.95 },
  { x: 60, y: 107, rotation: 220, scale: 0.95 },
  { x: 64, y: 88, rotation: -45, scale: 0.9 },
  { x: 65, y: 76, rotation: 225, scale: 0.85 },
  { x: 68, y: 56, rotation: -50, scale: 0.8 },
  { x: 69, y: 46, rotation: 230, scale: 0.75 },
  { x: 71, y: 29, rotation: -62, scale: 0.65 },
  { x: 71, y: 22, rotation: 242, scale: 0.6 },
  { x: 72, y: 10, rotation: -88, scale: 0.55 },
];

export function BotanicalSprig({ className = "" }: BotanicalSprigProps) {
  return (
    <svg
      viewBox="0 0 120 180"
      fill="none"
      aria-hidden="true"
      className={`pointer-events-none text-leaf ${className}`}
    >
      <path
        d="M56 178 C 50 132, 70 82, 72 8"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      {LEAF_PLACEMENTS.map(({ x, y, rotation, scale }) => (
        <g key={`${x}-${y}`} transform={`translate(${x} ${y}) rotate(${rotation}) scale(${scale})`}>
          <path d={LEAF_PATH} fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="0.9" />
          <path d="M1 0 L 27 0" stroke="currentColor" strokeWidth="0.6" strokeLinecap="round" />
        </g>
      ))}
      <circle cx="40" cy="96" r="2.2" fill="currentColor" fillOpacity="0.45" />
      <circle cx="86" cy="64" r="1.8" fill="currentColor" fillOpacity="0.45" />
    </svg>
  );
}

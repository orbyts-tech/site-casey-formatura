import { Heart } from "lucide-react";

interface SignatureProps {
  readonly name: string;
  readonly className?: string;
}

export function Signature({ name, className = "text-5xl sm:text-6xl" }: SignatureProps) {
  return (
    <span className={`inline-flex items-start gap-1 font-script leading-tight text-forest ${className}`}>
      {name}
      <Heart className="mt-2 size-4 shrink-0 text-forest" strokeWidth={1.2} />
    </span>
  );
}

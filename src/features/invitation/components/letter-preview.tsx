import { BotanicalSprig } from "@/components/brand/botanical-sprig";

interface LetterPreviewProps {
  readonly monogram: string;
  readonly greetingLine: string;
}

export function LetterPreview({ monogram, greetingLine }: LetterPreviewProps) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-[3px] bg-paper p-2 shadow-[0_-6px_18px_-10px_rgba(21,51,38,0.35)]">
      <div className="relative flex h-full flex-col items-center rounded-[2px] border border-gold-soft/80 pt-[7%] text-center">
        <BotanicalSprig className="absolute left-2 top-2 w-[11%] -rotate-12 opacity-80" />
        <span className="font-serif text-[clamp(1.6rem,5vw,2.4rem)] leading-none text-forest">{monogram}</span>
        <span className="mt-2 h-px w-10 bg-gold-soft" />
        <p className="mt-3 font-serif text-[clamp(1rem,3.2vw,1.5rem)] italic text-forest">
          {greetingLine},
        </p>
        <p className="mt-1 text-[clamp(0.55rem,1.6vw,0.7rem)] uppercase tracking-[0.3em] text-gold">
          um convite especial
        </p>
      </div>
    </div>
  );
}

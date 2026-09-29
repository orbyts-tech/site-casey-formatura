import type { LucideIcon } from "lucide-react";
import { AdminSurface } from "./admin-surface";

type StatTone = "forest" | "gold" | "sage";

interface StatCardProps {
  readonly label: string;
  readonly value: string;
  readonly hint?: string;
  readonly icon: LucideIcon;
  readonly tone?: StatTone;
}

const ICON_TONE_CLASSES: Record<StatTone, string> = {
  forest: "bg-forest text-paper",
  gold: "bg-gold-soft/45 text-forest",
  sage: "bg-sage text-forest",
};

export function StatCard({ label, value, hint, icon: Icon, tone = "sage" }: StatCardProps) {
  return (
    <AdminSurface as="article" className="flex items-start gap-4 p-5">
      <span className={`flex size-11 shrink-0 items-center justify-center rounded-full ${ICON_TONE_CLASSES[tone]}`}>
        <Icon className="size-5" strokeWidth={1.4} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-[0.68rem] uppercase tracking-[0.24em] text-ink-soft">{label}</p>
        <p className="mt-1.5 font-serif text-[1.7rem] leading-none text-forest tabular-nums">{value}</p>
        {hint && <p className="mt-2 text-xs leading-relaxed text-ink-soft">{hint}</p>}
      </div>
    </AdminSurface>
  );
}

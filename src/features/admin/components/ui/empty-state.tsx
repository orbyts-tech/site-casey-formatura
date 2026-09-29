import type { ReactNode } from "react";
import { BotanicalSprig } from "@/components/brand/botanical-sprig";

interface EmptyStateProps {
  readonly title: string;
  readonly description: string;
  readonly action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center px-6 py-12 text-center">
      <BotanicalSprig className="w-12 -rotate-12 opacity-70" />
      <p className="mt-4 font-serif text-xl text-forest">{title}</p>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-soft">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

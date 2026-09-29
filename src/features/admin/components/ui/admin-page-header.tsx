import type { ReactNode } from "react";

interface AdminPageHeaderProps {
  readonly eyebrow: string;
  readonly title: string;
  readonly highlightedTitle?: string;
  readonly description?: string;
  readonly actions?: ReactNode;
}

export function AdminPageHeader({ eyebrow, title, highlightedTitle, description, actions }: AdminPageHeaderProps) {
  return (
    <header className="flex flex-col gap-5 border-b border-gold-soft/50 pb-6 sm:flex-row sm:items-end sm:justify-between lg:pb-8">
      <div className="max-w-2xl">
        <p className="text-[0.68rem] uppercase tracking-[0.32em] text-gold">{eyebrow}</p>
        <h1 className="mt-3 font-serif text-3xl leading-tight text-forest sm:text-4xl lg:text-[2.6rem]">
          {title} {highlightedTitle && <em className="font-normal italic text-gold">{highlightedTitle}</em>}
        </h1>
        {description && <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>}
    </header>
  );
}

import { PAGE_CONTAINER_CLASSES } from "./page-container";

export function SiteFooter() {
  return (
    <footer className={`relative ${PAGE_CONTAINER_CLASSES}`}>
      <p className="border-t border-gold-soft/50 py-6 text-center font-serif text-sm italic text-ink-soft lg:py-8 lg:text-base">
        Feito para celebrar com você.
      </p>
    </footer>
  );
}

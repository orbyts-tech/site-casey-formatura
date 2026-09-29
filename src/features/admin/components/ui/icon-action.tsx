import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type IconActionTone = "default" | "danger";

interface IconActionStyleProps {
  readonly label: string;
  readonly tone?: IconActionTone;
  readonly children: ReactNode;
}

const BASE_CLASSES =
  "inline-flex size-9 shrink-0 items-center justify-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest disabled:pointer-events-none disabled:opacity-50";

const TONE_CLASSES: Record<IconActionTone, string> = {
  default: "border-gold-soft/70 bg-paper text-forest hover:border-gold hover:bg-sage/40",
  danger: "border-gold-soft/70 bg-paper text-ink-soft hover:border-red-300 hover:bg-red-50 hover:text-red-700",
};

type IconActionButtonProps = IconActionStyleProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

export function IconActionButton({ label, tone = "default", children, className = "", ...buttonAttributes }: IconActionButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={`${BASE_CLASSES} ${TONE_CLASSES[tone]} ${className}`}
      {...buttonAttributes}
    >
      {children}
    </button>
  );
}

type IconActionLinkProps = IconActionStyleProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children">;

export function IconActionLink({ label, tone = "default", children, className = "", ...anchorAttributes }: IconActionLinkProps) {
  return (
    <a aria-label={label} title={label} className={`${BASE_CLASSES} ${TONE_CLASSES[tone]} ${className}`} {...anchorAttributes}>
      {children}
    </a>
  );
}

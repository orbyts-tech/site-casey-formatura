import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "danger";
type ButtonSize = "md" | "sm";

interface ButtonStyleProps {
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly leadingIcon?: ReactNode;
  readonly trailingIcon?: ReactNode;
}

const BASE_CLASSES =
  "group inline-flex items-center justify-center gap-2.5 whitespace-nowrap rounded-md font-serif transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forest disabled:pointer-events-none disabled:opacity-60";

const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: "px-4 py-3.5 text-[0.95rem] sm:px-5",
  sm: "px-4 py-2 text-sm",
};

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-forest text-paper shadow-[0_10px_24px_-12px_rgba(21,51,38,0.7)] hover:-translate-y-0.5 hover:bg-forest-deep hover:shadow-[0_16px_30px_-14px_rgba(21,51,38,0.8)]",
  secondary:
    "border border-gold-soft bg-paper/60 text-forest hover:-translate-y-0.5 hover:border-gold hover:bg-paper",
  danger: "bg-red-800 text-paper shadow-[0_10px_24px_-12px_rgba(127,29,29,0.6)] hover:bg-red-900",
};

export function getButtonClassName({ variant = "primary", size = "md" }: ButtonStyleProps, className = ""): string {
  return `${BASE_CLASSES} ${SIZE_CLASSES[size]} ${VARIANT_CLASSES[variant]} ${className}`;
}

function ButtonContent({ leadingIcon, trailingIcon, children }: ButtonStyleProps & { readonly children: ReactNode }) {
  return (
    <>
      {leadingIcon}
      {children}
      {trailingIcon && (
        <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
          {trailingIcon}
        </span>
      )}
    </>
  );
}

type ButtonProps = ButtonStyleProps & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant,
  size,
  leadingIcon,
  trailingIcon,
  className,
  children,
  type = "button",
  ...buttonAttributes
}: ButtonProps) {
  return (
    <button type={type} className={getButtonClassName({ variant, size }, className)} {...buttonAttributes}>
      <ButtonContent leadingIcon={leadingIcon} trailingIcon={trailingIcon}>
        {children}
      </ButtonContent>
    </button>
  );
}

type ButtonLinkProps = ButtonStyleProps & ComponentProps<typeof Link>;

export function ButtonLink({ variant, size, leadingIcon, trailingIcon, className, children, ...linkProps }: ButtonLinkProps) {
  return (
    <Link className={getButtonClassName({ variant, size }, className)} {...linkProps}>
      <ButtonContent leadingIcon={leadingIcon} trailingIcon={trailingIcon}>
        {children}
      </ButtonContent>
    </Link>
  );
}

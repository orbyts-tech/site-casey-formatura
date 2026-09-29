import type { ElementType, ReactNode } from "react";

interface AdminSurfaceProps {
  readonly as?: ElementType;
  readonly className?: string;
  readonly children: ReactNode;
}

export const ADMIN_SURFACE_CLASSES =
  "rounded-lg border border-gold-soft/60 bg-paper/85 shadow-[0_24px_50px_-36px_rgba(21,51,38,0.45)] backdrop-blur-[2px]";

export function AdminSurface({ as: Component = "section", className = "", children }: AdminSurfaceProps) {
  return <Component className={`${ADMIN_SURFACE_CLASSES} ${className}`}>{children}</Component>;
}

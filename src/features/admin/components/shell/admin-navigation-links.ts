import { Gift, HandCoins, LayoutDashboard, Mail, type LucideIcon } from "lucide-react";
import { ADMIN_ROUTES, type AdminRoute } from "@/lib/routes";

export interface AdminNavigationLink {
  readonly href: AdminRoute;
  readonly label: string;
  readonly shortLabel: string;
  readonly icon: LucideIcon;
}

export const ADMIN_NAVIGATION_LINKS: readonly AdminNavigationLink[] = [
  { href: ADMIN_ROUTES.overview, label: "Visão geral", shortLabel: "Início", icon: LayoutDashboard },
  { href: ADMIN_ROUTES.invitations, label: "Convites", shortLabel: "Convites", icon: Mail },
  { href: ADMIN_ROUTES.gifts, label: "Lista de presentes", shortLabel: "Presentes", icon: Gift },
  { href: ADMIN_ROUTES.contributions, label: "Presentes recebidos", shortLabel: "Recebidos", icon: HandCoins },
];

export function isAdminLinkActive(href: AdminRoute, pathname: string): boolean {
  if (href === ADMIN_ROUTES.overview) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

import { ROUTES, type AppRoute } from "@/lib/routes";

export interface NavigationLink {
  readonly label: string;
  readonly href: AppRoute;
}

export const NAVIGATION_LINKS: readonly NavigationLink[] = [
  { label: "A jornada", href: ROUTES.journey },
  { label: "Seu convite", href: ROUTES.invitation },
  { label: "Save the Date", href: ROUTES.saveTheDate },
  { label: "Presentes", href: ROUTES.gifts },
];

export const ROUTES = {
  home: "/",
  journey: "/jornada",
  invitation: "/convite",
  saveTheDate: "/save-the-date",
  saveTheDateCalendarFile: "/save-the-date/evento.ics",
  gifts: "/presentes",
  giftsCheckout: "/presentes/pagamento",
} as const;

export const ADMIN_ROUTES = {
  overview: "/admin",
  signIn: "/admin/entrar",
  invitations: "/admin/convites",
  gifts: "/admin/presentes",
  contributions: "/admin/recebidos",
} as const;

export type AdminRoute = (typeof ADMIN_ROUTES)[keyof typeof ADMIN_ROUTES];

export const guestInvitationLinkPath = (token: string): string => `/c/${token}`;

export const JOURNEY_GALLERY_ANCHOR = "a-jornada-ate-aqui";

export const PRESENCE_CONFIRMED_QUERY = { key: "presenca", value: "confirmada" } as const;
export const DATE_SAVED_QUERY = { key: "data", value: "salva" } as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];

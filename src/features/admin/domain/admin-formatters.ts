const ADMIN_TIME_ZONE = "America/Sao_Paulo";

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: ADMIN_TIME_ZONE,
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: ADMIN_TIME_ZONE,
});

export function formatAdminDateTime(isoDateTime: string): string {
  return dateTimeFormatter.format(new Date(isoDateTime)).replace(".", "");
}

export function formatAdminDate(isoDateTime: string): string {
  return dateFormatter.format(new Date(isoDateTime)).replace(".", "");
}

export function pluralize(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

export function normalizeForSearch(text: string): string {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim();
}

import type { GraduationEvent } from "@/features/graduation/domain/graduation";

const MS_PER_DAY = 86_400_000;

function toCompactDate(isoDate: string): string {
  return isoDate.replaceAll("-", "");
}

function getNextDayIsoDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day) + MS_PER_DAY).toISOString().slice(0, 10);
}

function toIcsTimestamp(date: Date): string {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

const ICS_MAX_LINE_OCTETS = 75;

function foldIcsLine(line: string): string {
  const encoder = new TextEncoder();
  const foldedSegments: string[] = [];
  let currentSegment = "";

  for (const character of line) {
    const segmentLimit = foldedSegments.length === 0 ? ICS_MAX_LINE_OCTETS : ICS_MAX_LINE_OCTETS - 1;
    if (encoder.encode(currentSegment + character).length > segmentLimit) {
      foldedSegments.push(currentSegment);
      currentSegment = character;
    } else {
      currentSegment += character;
    }
  }

  return [...foldedSegments, currentSegment].join("\r\n ");
}

function escapeIcsText(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

export function buildGoogleCalendarUrl(event: GraduationEvent): string {
  const calendarParams = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${toCompactDate(event.isoDate)}/${toCompactDate(getNextDayIsoDate(event.isoDate))}`,
    details: event.description,
  });
  if (event.details.location) calendarParams.set("location", event.details.location);

  return `https://calendar.google.com/calendar/render?${calendarParams.toString()}`;
}

interface IcsCalendarOptions {
  readonly uid: string;
  readonly generatedAt: Date;
}

export function buildIcsCalendar(event: GraduationEvent, { uid, generatedAt }: IcsCalendarOptions): string {
  const locationLine = event.details.location ? [`LOCATION:${escapeIcsText(event.details.location)}`] : [];

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Casey Formatura//Save the Date//PT-BR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${toIcsTimestamp(generatedAt)}`,
    `DTSTART;VALUE=DATE:${toCompactDate(event.isoDate)}`,
    `DTEND;VALUE=DATE:${toCompactDate(getNextDayIsoDate(event.isoDate))}`,
    `SUMMARY:${escapeIcsText(event.title)}`,
    `DESCRIPTION:${escapeIcsText(event.description)}`,
    ...locationLine,
    "BEGIN:VALARM",
    "TRIGGER:-P7D",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeIcsText(`Falta uma semana: ${event.title}`)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .map(foldIcsLine)
    .join("\r\n");
}

export function calculateDaysUntil(isoDate: string, today: Date): number {
  const [year, month, day] = isoDate.split("-").map(Number);
  const eventDay = Date.UTC(year, month - 1, day);
  const currentDay = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());

  return Math.round((eventDay - currentDay) / MS_PER_DAY);
}

export function formatCountdownLabel(daysUntilEvent: number): string {
  if (daysUntilEvent > 1) return `${daysUntilEvent} dias para celebrar`;
  if (daysUntilEvent === 1) return "Falta só 1 dia para celebrar";
  if (daysUntilEvent === 0) return "É hoje! Vamos celebrar";

  return "Obrigada por celebrar comigo";
}

import { graduationEvent } from "@/features/graduation/data/graduation";
import { buildIcsCalendar } from "@/features/save-the-date/domain/calendar-event";

export const dynamic = "force-static";

export function GET() {
  const calendarFile = buildIcsCalendar(graduationEvent, {
    uid: `formatura-casey-${graduationEvent.isoDate}@casey-formatura`,
    generatedAt: new Date(),
  });

  return new Response(calendarFile, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'inline; filename="formatura-casey.ics"',
    },
  });
}

export interface Graduate {
  readonly name: string;
  readonly course: string;
  readonly graduationYear: number;
  readonly photoUrl: string;
  readonly gownPhotoUrl: string;
  readonly giftsWelcomePhotoUrl: string;
  readonly celebrationPhotoUrl: string;
}

export interface GraduationEventDetails {
  readonly time: string | null;
  readonly location: string | null;
  readonly dressCode: string | null;
}

export interface GraduationEvent {
  readonly title: string;
  readonly description: string;
  readonly isoDate: string;
  readonly dateLabel: string;
  readonly scheduleNote: string;
  readonly details: GraduationEventDetails;
}

export interface EventDateParts {
  readonly day: string;
  readonly monthName: string;
  readonly year: string;
}

export function getEventDateParts(isoDate: string): EventDateParts {
  const [year, month, day] = isoDate.split("-").map(Number);
  const eventDate = new Date(Date.UTC(year, month - 1, day));
  const monthName = new Intl.DateTimeFormat("pt-BR", { month: "long", timeZone: "UTC" }).format(eventDate);

  return { day: String(day).padStart(2, "0"), monthName, year: String(year) };
}

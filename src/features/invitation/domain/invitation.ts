import type { Graduate, GraduationEvent } from "@/features/graduation/domain/graduation";

export interface Guest {
  readonly id: string;
  readonly fullName: string;
}

export interface Invitation {
  readonly id: string;
  readonly greetingLine: string;
  readonly guests: readonly Guest[];
  readonly graduate: Graduate;
  readonly event: GraduationEvent;
}

export type InvitationPhase = "sealed" | "unsealing" | "letterRising" | "revealed";

export type RsvpStatus = "pending" | "confirmed" | "deferred";

export function formatGuestList(guests: readonly Guest[]): string {
  const names = guests.map((guest) => guest.fullName);
  if (names.length <= 1) return names.join("");

  return `${names.slice(0, -1).join(", ")} e ${names.at(-1)}`;
}

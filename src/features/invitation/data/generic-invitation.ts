import { graduate, graduationEvent } from "@/features/graduation/data/graduation";
import type { Invitation } from "../domain/invitation";

export const genericInvitation: Invitation = {
  id: "convite-geral",
  greetingLine: "Para você",
  guests: [],
  graduate,
  event: graduationEvent,
};

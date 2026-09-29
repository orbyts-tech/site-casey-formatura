import type { Transition } from "motion/react";
import { ELEGANT_EASE } from "@/lib/motion";

export const INVITATION_LAYOUT_ID = "invitation-letter";

export const LETTER_TO_CARD_TRANSITION: Transition = {
  layout: { duration: 1.15, ease: ELEGANT_EASE },
};

import type { Metadata } from "next";
import { JourneyScreen } from "@/features/journey/components/journey-screen";

export const metadata: Metadata = {
  title: "A jornada • Casey • Formatura em Psicologia 2027",
  description: "Acompanhe cada capítulo até a formatura da Casey em Psicologia.",
};

export default function JourneyPage() {
  return <JourneyScreen />;
}

import type { Metadata } from "next";
import { BotanicalBackdrop } from "@/components/brand/botanical-backdrop";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { graduate, graduationEvent } from "@/features/graduation/data/graduation";
import { TourStepTracker } from "@/features/journey/components/tour-step-tracker";
import { SaveTheDatePhotoBackdrop } from "@/features/save-the-date/components/save-the-date-photo-backdrop";
import { SaveTheDateView } from "@/features/save-the-date/components/save-the-date-view";
import { PRESENCE_CONFIRMED_QUERY, ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Save the Date • Casey • Formatura em Psicologia 2027",
  description: "Reserve na sua agenda a formatura da Casey em Psicologia: 23 de janeiro de 2027.",
};

export default async function SaveTheDatePage({ searchParams }: PageProps<"/save-the-date">) {
  const query = await searchParams;
  const hasJustConfirmedPresence = query[PRESENCE_CONFIRMED_QUERY.key] === PRESENCE_CONFIRMED_QUERY.value;

  return (
    <main className="relative flex min-h-svh flex-col overflow-x-hidden">
      <SaveTheDatePhotoBackdrop photoUrl={graduate.celebrationPhotoUrl} />
      <BotanicalBackdrop />
      <TourStepTracker step="saveTheDateVisited" />
      <SiteHeader
        graduateName={graduate.name}
        course={graduate.course}
        graduationYear={graduate.graduationYear}
        activeRoute={ROUTES.saveTheDate}
      />
      <SaveTheDateView
        graduate={graduate}
        event={graduationEvent}
        hasJustConfirmedPresence={hasJustConfirmedPresence}
      />
      <SiteFooter />
    </main>
  );
}

import type { Metadata } from "next";
import { BotanicalBackdrop } from "@/components/brand/botanical-backdrop";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { graduate } from "@/features/graduation/data/graduation";
import { GiftsView } from "@/features/gifts/components/gifts-view";
import { GiftsWelcomeModal } from "@/features/gifts/components/gifts-welcome-modal";
import { getGiftCatalogRepository } from "@/features/gifts/infrastructure/gift-catalog-repository-factory";
import { GiftCatalogProvider } from "@/features/gifts/state/gift-catalog-context";
import { TourStepTracker } from "@/features/journey/components/tour-step-tracker";
import { DATE_SAVED_QUERY, ROUTES } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Presentes • Casey • Formatura em Psicologia 2027",
  description: "Presentes simbólicos para celebrar a formatura da Casey em Psicologia.",
};

export default async function GiftsPage({ searchParams }: PageProps<"/presentes">) {
  const query = await searchParams;
  const hasJustSavedDate = query[DATE_SAVED_QUERY.key] === DATE_SAVED_QUERY.value;
  const gifts = await getGiftCatalogRepository().listActive();

  return (
    <main className="relative flex min-h-svh flex-col overflow-x-clip">
      <BotanicalBackdrop />
      <TourStepTracker step="giftsVisited" />
      <SiteHeader
        graduateName={graduate.name}
        course={graduate.course}
        graduationYear={graduate.graduationYear}
        activeRoute={ROUTES.gifts}
      />
      <GiftCatalogProvider gifts={gifts}>
        <GiftsView graduateName={graduate.name} hasJustSavedDate={hasJustSavedDate} />
      </GiftCatalogProvider>
      <SiteFooter />
      <GiftsWelcomeModal graduateName={graduate.name} graduatePhotoUrl={graduate.giftsWelcomePhotoUrl} />
    </main>
  );
}

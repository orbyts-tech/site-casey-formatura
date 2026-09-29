import { BotanicalBackdrop } from "@/components/brand/botanical-backdrop";
import { Signature } from "@/components/brand/signature";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { FadeIn } from "@/components/motion/fade-in";
import { graduate, graduationEvent } from "@/features/graduation/data/graduation";
import { ROUTES } from "@/lib/routes";
import { journeyPhotos } from "../data/journey-photos";
import { CelebrationDateBar } from "./celebration-date-bar";
import { JourneyHero } from "./journey-hero";
import { JourneyPhotoCarousel } from "./journey-photo-carousel";
import { JourneyShortcuts } from "./journey-shortcuts";
import { TourStepTracker } from "./tour-step-tracker";

export function JourneyScreen() {
  return (
    <main className="relative flex min-h-svh flex-col overflow-x-clip">
      <BotanicalBackdrop />
      <TourStepTracker step="journeyVisited" />
      <SiteHeader
        graduateName={graduate.name}
        course={graduate.course}
        graduationYear={graduate.graduationYear}
        activeRoute={ROUTES.journey}
      />

      <div className="relative flex-1 px-5 pb-16 pt-8 sm:px-8 lg:pb-24 lg:pt-12">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 lg:gap-16 2xl:max-w-7xl">
          <JourneyHero graduate={graduate} />

          <FadeIn delay={0.3}>
            <CelebrationDateBar eventIsoDate={graduationEvent.isoDate} eventDateLabel={graduationEvent.dateLabel} />
          </FadeIn>

          <JourneyPhotoCarousel photos={journeyPhotos} />

          <FadeIn shouldWaitForViewport>
            <JourneyShortcuts />
          </FadeIn>

          <FadeIn shouldWaitForViewport className="flex flex-col items-center text-center">
            <p className="font-serif text-lg italic text-forest sm:text-xl">
              Obrigada por fazer parte dessa história.
            </p>
            <Signature name={graduate.name} className="mt-1 text-5xl sm:text-6xl" />
          </FadeIn>
        </div>
      </div>

      <SiteFooter />
    </main>
  );
}

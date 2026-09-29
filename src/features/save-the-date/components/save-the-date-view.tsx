import { Check, MessageCircle } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { AccordionItem } from "@/components/ui/accordion-item";
import type { Graduate, GraduationEvent } from "@/features/graduation/domain/graduation";
import { ROUTES } from "@/lib/routes";
import { buildGoogleCalendarUrl } from "../domain/calendar-event";
import { CalendarActions } from "./calendar-actions";
import { DaysUntilBadge } from "./days-until-badge";
import { EventDetails } from "./event-details";
import { SaveTheDateCard } from "./save-the-date-card";

interface SaveTheDateViewProps {
  readonly graduate: Graduate;
  readonly event: GraduationEvent;
  readonly hasJustConfirmedPresence: boolean;
}

export function SaveTheDateView({ graduate, event, hasJustConfirmedPresence }: SaveTheDateViewProps) {
  return (
    <div className="relative flex-1 px-5 pb-16 pt-8 sm:px-8 lg:pb-24 lg:pt-12">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center 2xl:max-w-4xl">
        {hasJustConfirmedPresence && (
          <FadeIn offsetY={-10} className="mb-8">
            <p className="inline-flex items-center gap-2.5 rounded-full border border-gold-soft/70 bg-paper px-5 py-2 text-sm text-forest shadow-[0_8px_20px_-14px_rgba(21,51,38,0.5)]">
              <span className="flex size-5 items-center justify-center rounded-full bg-forest text-paper">
                <Check className="size-3" strokeWidth={2} />
              </span>
              Presença confirmada! Agora é só guardar a data.
            </p>
          </FadeIn>
        )}

        <FadeIn className="text-center">
          <p className="text-[0.7rem] uppercase tracking-[0.4em] text-gold lg:text-xs 2xl:text-sm">
            Um dia para guardar no coração
          </p>
          <h1 className="mt-3 font-serif text-5xl text-forest sm:text-6xl lg:text-7xl 2xl:text-8xl">
            Save <em className="font-normal">the Date</em>
          </h1>
          <p className="mt-3 text-sm text-ink-soft sm:text-base lg:text-lg">
            Reserve um espaço na sua agenda para essa conquista.
          </p>
        </FadeIn>

        <FadeIn delay={0.2} offsetY={30} className="mt-6 w-full max-w-xl sm:max-w-2xl lg:mt-8 2xl:max-w-3xl">
          <SaveTheDateCard graduate={graduate} event={event} />
        </FadeIn>

        <FadeIn delay={0.45} className="mt-2">
          <DaysUntilBadge isoDate={event.isoDate} />
        </FadeIn>

        <FadeIn shouldWaitForViewport className="mt-14 w-full lg:mt-20">
          <EventDetails details={event.details} />
        </FadeIn>

        <span className="mt-12 h-px w-full bg-gold-soft/60 lg:mt-16" />

        <FadeIn shouldWaitForViewport className="relative z-20 mt-12 w-full lg:mt-16">
          <CalendarActions
            googleCalendarUrl={buildGoogleCalendarUrl(event)}
            calendarFileUrl={ROUTES.saveTheDateCalendarFile}
            downloadFileName={`save-the-date-${graduate.name.toLowerCase()}.png`}
          />
        </FadeIn>

        <FadeIn shouldWaitForViewport className="mt-14 w-full max-w-2xl lg:mt-20">
          <AccordionItem
            question="E se os detalhes do evento mudarem?"
            icon={<MessageCircle className="size-5 shrink-0 text-gold" strokeWidth={1.3} />}
          >
            Fique tranquilo! Assim que horário, local e traje forem definidos, as informações serão
            atualizadas aqui e você será avisado. Se já salvou a data na agenda, é só ajustar o evento
            com os novos detalhes.
          </AccordionItem>
        </FadeIn>
      </div>
    </div>
  );
}

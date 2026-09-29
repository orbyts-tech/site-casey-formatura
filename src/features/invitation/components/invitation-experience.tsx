"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { BotanicalBackdrop } from "@/components/brand/botanical-backdrop";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ELEGANT_EASE } from "@/lib/motion";
import { useRecordTourStep } from "@/features/journey/hooks/use-tour-progress";
import { ROUTES } from "@/lib/routes";
import type { Invitation } from "../domain/invitation";
import { useInvitationFlow } from "../hooks/use-invitation-flow";
import { usePresenceConfirmationRedirect } from "../hooks/use-presence-confirmation-redirect";
import { useRsvpResponse } from "../hooks/use-rsvp-response";
import { Envelope } from "./envelope";
import { InvitationCard } from "./invitation-card";

interface InvitationExperienceProps {
  readonly invitation: Invitation;
}

export function InvitationExperience({ invitation }: InvitationExperienceProps) {
  const { phase, isSealed, isRevealed, areRsvpActionsVisible, openEnvelope } = useInvitationFlow();
  const { status: rsvpStatus, confirmPresence, deferConfirmation } = useRsvpResponse();
  usePresenceConfirmationRedirect(rsvpStatus, areRsvpActionsVisible);
  useRecordTourStep("invitationOpened", isRevealed);
  const { graduate } = invitation;
  const isEnvelopeOpening = !isSealed && !isRevealed;

  return (
    <main className="relative flex min-h-svh flex-col overflow-x-hidden">
      <BotanicalBackdrop />
      <SiteHeader
        graduateName={graduate.name}
        course={graduate.course}
        graduationYear={graduate.graduationYear}
        activeRoute={ROUTES.invitation}
      />

      <LayoutGroup>
        <section
          className={`relative flex w-full flex-1 flex-col items-center px-4 ${
            isRevealed ? "pb-20 pt-10 lg:pb-28 lg:pt-14" : "justify-center py-10"
          }`}
        >
          <motion.p
            layout="position"
            transition={{ layout: { duration: 1.15, ease: ELEGANT_EASE } }}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: isEnvelopeOpening ? 0 : 1, y: 0 }}
            className="mb-12 text-[0.7rem] uppercase tracking-[0.4em] text-gold lg:text-xs 2xl:mb-14 2xl:text-sm"
          >
            Um convite feito para você
          </motion.p>

          <Envelope
            phase={phase}
            monogram={graduate.name.charAt(0)}
            greetingLine={invitation.greetingLine}
            onOpen={openEnvelope}
            className={`isolate ${isRevealed ? "absolute inset-x-0 top-[22rem] mx-auto lg:top-[25rem] 2xl:top-[28rem]" : "relative"}`}
          />

          {!isRevealed && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={isSealed ? { opacity: [0.45, 1, 0.45] } : { opacity: 0 }}
              transition={isSealed ? { duration: 2.6, repeat: Infinity, ease: "easeInOut" } : { duration: 0.4 }}
              className="mt-16 font-serif text-lg italic text-ink-soft lg:text-xl"
            >
              Toque no envelope para abrir
            </motion.p>
          )}

          {isRevealed && (
            <InvitationCard
              invitation={invitation}
              areRsvpActionsVisible={areRsvpActionsVisible}
              rsvpStatus={rsvpStatus}
              onConfirmPresence={confirmPresence}
              onDeferConfirmation={deferConfirmation}
              className="z-20"
            />
          )}
        </section>
      </LayoutGroup>

      <AnimatePresence>
        {isRevealed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }}>
            <SiteFooter />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

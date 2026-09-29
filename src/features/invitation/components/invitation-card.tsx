"use client";

import Image from "next/image";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { Heart, Users } from "lucide-react";
import { formatGuestList, type Invitation, type RsvpStatus } from "../domain/invitation";
import { BotanicalSprig } from "@/components/brand/botanical-sprig";
import { WaxSeal } from "@/components/brand/wax-seal";
import { ELEGANT_EASE } from "@/lib/motion";
import { INVITATION_LAYOUT_ID, LETTER_TO_CARD_TRANSITION } from "./motion-tokens";
import { RsvpPanel } from "./rsvp-panel";

interface InvitationCardProps {
  readonly invitation: Invitation;
  readonly areRsvpActionsVisible: boolean;
  readonly rsvpStatus: RsvpStatus;
  readonly onConfirmPresence: () => void;
  readonly onDeferConfirmation: () => void;
  readonly className?: string;
}

const CONTENT_VARIANTS: Variants = {
  hidden: {},
  visible: { transition: { delayChildren: 0.9, staggerChildren: 0.16 } },
};

const ITEM_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: ELEGANT_EASE } },
};

export function InvitationCard({
  invitation,
  areRsvpActionsVisible,
  rsvpStatus,
  onConfirmPresence,
  onDeferConfirmation,
  className = "",
}: InvitationCardProps) {
  const { graduate, event, greetingLine, guests } = invitation;
  const monogram = graduate.name.charAt(0);

  return (
    <motion.article
      layoutId={INVITATION_LAYOUT_ID}
      transition={LETTER_TO_CARD_TRANSITION}
      className={`relative w-[min(84vw,560px)] rounded-[3px] lg:w-[600px] 2xl:w-[660px] bg-paper p-2.5 shadow-[0_40px_80px_-30px_rgba(21,51,38,0.45),0_2px_6px_rgba(21,51,38,0.06)] ${className}`}
    >
      <motion.div
        variants={CONTENT_VARIANTS}
        initial="hidden"
        animate="visible"
        className="relative rounded-[2px] border border-gold-soft/80 px-5 pb-8 pt-20 sm:px-8 2xl:px-11 2xl:pb-10 2xl:pt-24"
      >
        <BotanicalSprig className="absolute left-3 top-0 w-12 -rotate-[50deg] opacity-90 sm:w-14" />

        <div className="grid items-start gap-6 sm:grid-cols-[1fr_auto]">
          <motion.div variants={ITEM_VARIANTS} className="text-center sm:text-left">
            <p className="font-serif text-xl italic text-forest sm:text-2xl">{greetingLine},</p>
            <h1 className="mt-3 font-serif text-[1.7rem] leading-[1.15] text-forest sm:text-[2.1rem] 2xl:text-[2.45rem]">
              Algumas conquistas ficam mais bonitas quando compartilhadas.
            </h1>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-soft 2xl:text-base">
              Depois de tantos passos, chegou a hora de celebrar. Quero você comigo neste capítulo tão especial.
            </p>
          </motion.div>

          <motion.figure variants={ITEM_VARIANTS} className="order-first flex flex-col items-center sm:order-none">
            <div className="rounded-t-full border border-gold-soft p-1.5">
              <div className="relative h-44 w-32 overflow-hidden rounded-t-full sm:h-48 sm:w-36 2xl:h-56 2xl:w-40">
                <Image
                  src={graduate.photoUrl}
                  alt={`Foto de ${graduate.name}`}
                  fill
                  sizes="(min-width: 1536px) 160px, 144px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
            <figcaption className="mt-3 max-w-36 text-center font-serif text-sm italic leading-snug text-ink-soft">
              Grandes histórias sempre têm pessoas especiais ao lado.
            </figcaption>
            <span className="mt-3 h-px w-8 bg-gold-soft" />
          </motion.figure>
        </div>

        <motion.div variants={ITEM_VARIANTS} className="mt-8 flex flex-col items-center text-center">
          <span className="h-px w-10 bg-gold-soft" />
          <p className="mt-6 font-serif text-base text-forest sm:text-xl 2xl:text-2xl">
            Minha formatura em {graduate.course}
          </p>
          <time dateTime={event.isoDate} className="mt-1 font-serif text-[1.65rem] text-forest sm:text-4xl 2xl:text-[2.6rem]">
            {event.dateLabel}
          </time>
          <p className="mt-2 text-sm text-ink-soft">{event.scheduleNote}</p>
        </motion.div>

        <motion.div variants={ITEM_VARIANTS} className="relative mt-8 flex flex-col items-center">
          <BotanicalSprig className="absolute -right-3 -top-6 w-14 rotate-[62deg] opacity-80 sm:-right-6 sm:w-20" />
          <p className="font-serif text-lg italic text-forest">Com carinho,</p>
          <p className="flex items-start gap-1 font-script text-6xl leading-tight text-forest">
            {graduate.name}
            <Heart className="mt-2 size-4 text-forest" strokeWidth={1.2} />
          </p>
        </motion.div>

        {guests.length > 0 && (
          <motion.div
            variants={ITEM_VARIANTS}
            className="-mx-5 mt-6 flex items-center justify-center gap-2.5 bg-sage/60 px-4 py-3 text-center text-sm text-ink sm:-mx-8 2xl:-mx-11 2xl:py-4"
          >
            <Users className="size-4 shrink-0 text-forest" strokeWidth={1.4} />
            <span>
              Este convite inclui <em className="font-serif text-base">{formatGuestList(guests)}</em>.
            </span>
          </motion.div>
        )}

        <AnimatePresence>
          {areRsvpActionsVisible && (
            <RsvpPanel
              status={rsvpStatus}
              onConfirmPresence={onConfirmPresence}
              onDeferConfirmation={onDeferConfirmation}
            />
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.4, rotate: -30 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ delay: 0.75, type: "spring", stiffness: 220, damping: 16 }}
        className="absolute -top-9 left-1/2 -ml-9 size-18"
      >
        <WaxSeal monogram={monogram} className="h-full w-full" />
      </motion.div>
    </motion.article>
  );
}

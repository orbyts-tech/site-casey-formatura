"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, CalendarClock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { RsvpStatus } from "../domain/invitation";
import { ELEGANT_EASE } from "@/lib/motion";

interface RsvpPanelProps {
  readonly status: RsvpStatus;
  readonly onConfirmPresence: () => void;
  readonly onDeferConfirmation: () => void;
}

const FEEDBACK_BY_STATUS: Record<Exclude<RsvpStatus, "pending">, { title: string; message: string }> = {
  confirmed: {
    title: "Presença confirmada!",
    message: "Que alegria ter você comigo! Levando você para salvar a data…",
  },
  deferred: {
    title: "Tudo bem!",
    message: "Você pode voltar a este convite e confirmar sua presença quando quiser.",
  },
};

export function RsvpPanel({ status, onConfirmPresence, onDeferConfirmation }: RsvpPanelProps) {
  return (
    <motion.section
      aria-live="polite"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      transition={{ duration: 0.9, ease: ELEGANT_EASE }}
      className="overflow-hidden"
    >
      <div className="pt-8 text-center">
        <span className="mx-auto block h-px w-full bg-gold-soft/70" />
        <h2 className="mt-8 font-serif text-[1.55rem] text-forest sm:text-3xl">Você vem celebrar comigo?</h2>

        <AnimatePresence mode="wait">
          {status === "pending" ? (
            <motion.div
              key="actions"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.6, delay: 0.25, ease: ELEGANT_EASE }}
            >
              <p className="mt-2 text-sm text-ink-soft">Sua resposta me ajuda a preparar tudo com carinho.</p>
              <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                <Button onClick={onConfirmPresence} trailingIcon={<ArrowUpRight className="size-4" strokeWidth={1.5} />}>
                  Confirmar Presença
                </Button>
                <Button
                  variant="secondary"
                  onClick={onDeferConfirmation}
                  trailingIcon={<CalendarClock className="size-4" strokeWidth={1.5} />}
                >
                  Confirmar presença depois
                </Button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={status}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: ELEGANT_EASE }}
              className="mt-6 flex flex-col items-center"
            >
              <span className="flex size-11 items-center justify-center rounded-full bg-forest text-paper">
                <Check className="size-5" strokeWidth={1.5} />
              </span>
              <p className="mt-4 font-serif text-2xl text-forest">{FEEDBACK_BY_STATUS[status].title}</p>
              <p className="mt-1 max-w-xs text-sm text-ink-soft">{FEEDBACK_BY_STATUS[status].message}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}

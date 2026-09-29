"use client";

import { AnimatePresence, motion } from "motion/react";
import { CalendarCheck, Download, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ELEGANT_EASE } from "@/lib/motion";
import { useContinueToGiftsAfterSave } from "../hooks/use-continue-to-gifts-after-save";
import { useElementImageDownload } from "../hooks/use-element-image-download";
import { CalendarMenu } from "./calendar-menu";
import { SAVE_THE_DATE_CARD_ID } from "./save-the-date-card";

interface CalendarActionsProps {
  readonly googleCalendarUrl: string;
  readonly calendarFileUrl: string;
  readonly downloadFileName: string;
}

export function CalendarActions({ googleCalendarUrl, calendarFileUrl, downloadFileName }: CalendarActionsProps) {
  const { status, downloadImage } = useElementImageDownload({
    elementId: SAVE_THE_DATE_CARD_ID,
    fileName: downloadFileName,
    backgroundColor: "#f7f4ee",
  });
  const isPreparingImage = status === "preparing";
  const { isDateSaved, markDateAsSaved } = useContinueToGiftsAfterSave();

  return (
    <section aria-labelledby="calendar-actions-title" className="w-full text-center">
      <h2 id="calendar-actions-title" className="font-serif text-3xl text-forest sm:text-4xl 2xl:text-5xl">
        Leve essa data com você
      </h2>
      <p className="mt-2 text-sm text-ink-soft sm:text-base">Escolha onde deseja salvar.</p>

      <div className="mx-auto mt-7 flex max-w-md flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:items-start sm:justify-center">
        <CalendarMenu
          googleCalendarUrl={googleCalendarUrl}
          calendarFileUrl={calendarFileUrl}
          onCalendarChosen={markDateAsSaved}
        />
        <Button
          variant="secondary"
          onClick={downloadImage}
          disabled={isPreparingImage}
          leadingIcon={
            isPreparingImage ? (
              <LoaderCircle className="size-5 animate-spin" strokeWidth={1.3} />
            ) : (
              <Download className="size-5" strokeWidth={1.3} />
            )
          }
          className="sm:min-w-56"
        >
          {isPreparingImage ? "Preparando imagem…" : "Baixar Save the Date"}
        </Button>
      </div>

      <div aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          {isDateSaved ? (
            <motion.p
              key="date-saved"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: ELEGANT_EASE }}
              className="mx-auto mt-5 inline-flex items-center gap-2.5 rounded-full bg-sage/70 px-5 py-2 font-serif text-base text-forest"
            >
              <CalendarCheck className="size-4" strokeWidth={1.4} />
              Data salva! Levando você aos presentes…
            </motion.p>
          ) : (
            <motion.p key="calendar-note" exit={{ opacity: 0 }} className="mt-4 text-xs text-ink-soft sm:text-sm">
              {status === "failed"
                ? "Não conseguimos gerar a imagem agora. Tente novamente em instantes."
                : "Por enquanto, a data é salva como evento de dia inteiro."}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

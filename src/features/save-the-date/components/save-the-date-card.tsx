import { Heart } from "lucide-react";
import { BotanicalSprig } from "@/components/brand/botanical-sprig";
import { WaxSeal } from "@/components/brand/wax-seal";
import { getEventDateParts, type Graduate, type GraduationEvent } from "@/features/graduation/domain/graduation";

export const SAVE_THE_DATE_CARD_ID = "save-the-date-card";

interface SaveTheDateCardProps {
  readonly graduate: Graduate;
  readonly event: GraduationEvent;
}

export function SaveTheDateCard({ graduate, event }: SaveTheDateCardProps) {
  const { day, monthName, year } = getEventDateParts(event.isoDate);
  const monogram = graduate.name.charAt(0);

  return (
    <div id={SAVE_THE_DATE_CARD_ID} className="relative w-full px-2 pb-6 pt-9 sm:px-4 lg:pt-11">
      <div className="bg-paper p-2 shadow-[0_30px_60px_-28px_rgba(21,51,38,0.45),0_2px_6px_rgba(21,51,38,0.06)] sm:p-2.5">
        <div className="border border-gold-soft/80 p-1.5">
          <div className="relative flex flex-col items-center overflow-hidden border border-gold-soft/60 px-6 pb-8 pt-12 text-center sm:pb-9 sm:pt-12 2xl:pb-10 2xl:pt-14">
            <span className="relative flex items-end">
              <BotanicalSprig className="absolute -left-4 bottom-0 w-5 -rotate-[25deg] sm:w-6" />
              <span className="font-serif text-3xl leading-none text-forest sm:text-4xl">{monogram}</span>
            </span>

            <span className="mt-3 font-serif text-[6rem] leading-[0.95] text-forest sm:text-[8rem] 2xl:text-[9rem]">
              {day}
            </span>
            <span className="mt-2 font-serif text-lg uppercase tracking-[0.45em] text-forest sm:text-xl">
              {monthName}
            </span>
            <span className="mt-1 font-serif text-base tracking-[0.4em] text-forest sm:text-lg">{year}</span>

            <span className="my-5 h-px w-14 bg-gold" />

            <span className="font-serif text-[1.3rem] text-forest sm:text-[1.75rem] 2xl:text-[2rem]">
              Formatura em {graduate.course}
            </span>
            <span className="mt-1 flex items-start gap-1 font-script text-5xl leading-tight text-forest sm:text-6xl">
              {graduate.name}
              <Heart className="mt-2 size-4 text-forest" strokeWidth={1.2} />
            </span>

            <BotanicalSprig className="absolute -bottom-3 left-0 w-16 rotate-[35deg] opacity-80 sm:left-4 sm:w-28" />
            <BotanicalSprig className="absolute -bottom-3 right-0 w-16 -rotate-[35deg] -scale-x-100 opacity-80 sm:right-4 sm:w-28" />
          </div>
        </div>
      </div>

      <div className="absolute left-1/2 top-0 size-18 -translate-x-1/2 sm:size-20 lg:size-22">
        <WaxSeal monogram={monogram} className="h-full w-full" />
      </div>
    </div>
  );
}

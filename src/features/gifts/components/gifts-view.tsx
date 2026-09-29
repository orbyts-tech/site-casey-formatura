import { ArrowRight, CalendarCheck, Gift as GiftIcon, HelpCircle, QrCode } from "lucide-react";
import { BotanicalSprig } from "@/components/brand/botanical-sprig";
import { Signature } from "@/components/brand/signature";
import { WaxSeal } from "@/components/brand/wax-seal";
import { FadeIn } from "@/components/motion/fade-in";
import { AccordionItem } from "@/components/ui/accordion-item";
import { ButtonLink } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { BagLink } from "./bag-link";
import { CartSummaryBar } from "./cart-summary-bar";
import { GiftCatalog } from "./gift-catalog";

interface GiftsViewProps {
  readonly graduateName: string;
  readonly hasJustSavedDate: boolean;
}

export function GiftsView({ graduateName, hasJustSavedDate }: GiftsViewProps) {
  return (
    <div className="relative flex-1 px-5 pb-16 pt-6 sm:px-8 lg:pb-24 lg:pt-10">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center 2xl:max-w-6xl">
        <div className="flex w-full flex-col-reverse items-center gap-4 sm:flex-row sm:justify-between">
          {hasJustSavedDate ? (
            <FadeIn offsetY={-10}>
              <p className="inline-flex items-center gap-2.5 rounded-full border border-gold-soft/70 bg-paper px-4 py-2 text-sm text-forest shadow-[0_8px_20px_-14px_rgba(21,51,38,0.5)]">
                <CalendarCheck className="size-4 shrink-0" strokeWidth={1.4} />
                Data salva na sua agenda! Obrigada.
              </p>
            </FadeIn>
          ) : (
            <span aria-hidden="true" />
          )}
          <BagLink />
        </div>

        <FadeIn className="relative mt-6 w-full text-center lg:mt-4">
          <p className="text-[0.7rem] uppercase tracking-[0.4em] text-gold lg:text-xs 2xl:text-sm">
            Carinho para um novo capítulo
          </p>
          <h1 className="mt-3 font-serif text-[2.4rem] leading-[1.1] text-forest sm:text-5xl lg:text-6xl 2xl:text-7xl">
            Presentes que viram
            <br />
            <em>novos começos.</em>
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm text-ink-soft sm:text-base lg:text-lg">
            Sua presença já é um presente. Se quiser, deixe um carinho para essa nova fase.
          </p>
          <span className="mx-auto mt-6 block h-px w-12 bg-gold" />

          <div aria-hidden="true" className="absolute right-0 top-6 hidden lg:block">
            <BotanicalSprig className="absolute -left-12 -top-10 w-20 -rotate-[60deg]" />
            <WaxSeal monogram={graduateName.charAt(0)} className="relative size-24 2xl:size-28" />
          </div>
        </FadeIn>

        <FadeIn delay={0.15} className="mt-8 w-full lg:mt-10">
          <div className="flex flex-col gap-1 bg-sage/60 px-4 py-3 text-sm text-ink sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="flex items-center gap-2.5 font-serif text-base text-forest">
              <GiftIcon className="size-5 shrink-0" strokeWidth={1.3} />
              Presentes simbólicos: o valor é destinado à {graduateName}.
            </p>
            <p className="pl-7 text-xs text-ink-soft sm:pl-0">Pagamento via Pix</p>
          </div>
        </FadeIn>

        <FadeIn delay={0.25} className="mt-6 w-full">
          <GiftCatalog />
        </FadeIn>

        <CartSummaryBar />

        <FadeIn shouldWaitForViewport className="mt-8 w-full">
          <div className="flex flex-col gap-3 border-y border-gold-soft/60 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-start gap-3">
              <QrCode className="mt-0.5 size-5 shrink-0 text-gold" strokeWidth={1.3} />
              <span>
                <span className="block font-serif text-base text-forest">Pix com QR Code ou copia e cola</span>
                <span className="block text-xs text-ink-soft sm:text-sm">
                  O valor vai direto para a conta da {graduateName}, sem intermediários.
                </span>
              </span>
            </p>
            <p className="pl-8 text-xs text-ink-soft sm:max-w-56 sm:pl-0 sm:text-right">
              O valor total é conferido na etapa de pagamento.
            </p>
          </div>
        </FadeIn>

        <FadeIn shouldWaitForViewport className="mt-12 w-full max-w-2xl lg:mt-16">
          <AccordionItem
            question="Como funcionam os presentes?"
            icon={<HelpCircle className="size-5 shrink-0 text-gold" strokeWidth={1.3} />}
          >
            Os presentes são simbólicos: você escolhe um ou mais itens, informa seu nome e, se quiser, deixa
            uma mensagem. Em seguida, geramos um Pix com o valor exato para a {graduateName}. Nenhum produto é
            enviado — o carinho vira apoio para essa nova fase.
          </AccordionItem>
        </FadeIn>

        <FadeIn shouldWaitForViewport className="mt-12 flex flex-col items-center text-center lg:mt-16">
          <p className="font-serif text-lg italic text-forest sm:text-xl">
            Obrigada por fazer parte do meu próximo capítulo.
          </p>
          <Signature name={graduateName} className="mt-2 text-5xl sm:text-6xl" />
        </FadeIn>

        <FadeIn shouldWaitForViewport className="mt-10 flex w-full flex-col items-center gap-4 text-center">
          <p className="text-[0.7rem] uppercase tracking-[0.4em] text-gold lg:text-xs">Próximo capítulo</p>
          <ButtonLink
            href={ROUTES.journey}
            variant="secondary"
            trailingIcon={<ArrowRight className="size-4" strokeWidth={1.5} />}
            className="w-full sm:w-auto sm:min-w-64"
          >
            Acompanhar a jornada
          </ButtonLink>
        </FadeIn>
      </div>
    </div>
  );
}

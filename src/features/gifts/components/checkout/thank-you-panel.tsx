import { Check } from "lucide-react";
import { Signature } from "@/components/brand/signature";
import { ButtonLink } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";

interface ThankYouPanelProps {
  readonly giverName: string;
  readonly graduateName: string;
  readonly paymentReportWarning: string | null;
}

export function ThankYouPanel({ giverName, graduateName, paymentReportWarning }: ThankYouPanelProps) {
  return (
    <div className="flex flex-col items-center py-6 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-forest text-paper">
        <Check className="size-7" strokeWidth={1.4} />
      </span>
      <h2 className="mt-6 font-serif text-3xl text-forest sm:text-4xl">Muito obrigada, {giverName}!</h2>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-soft sm:text-base">
        Seu carinho chegou. Assim que o Pix cair, a {graduateName} vai receber seu presente e sua mensagem com
        todo o amor do mundo.
      </p>
      {paymentReportWarning && <p className="mt-3 max-w-md text-xs text-ink-soft">{paymentReportWarning}</p>}

      <p className="mt-8 font-serif text-lg italic text-forest">Com carinho,</p>
      <Signature name={graduateName} className="text-5xl sm:text-6xl" />

      <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <ButtonLink href={ROUTES.gifts} variant="secondary">
          Voltar aos presentes
        </ButtonLink>
        <ButtonLink href={ROUTES.journey}>Acompanhar a jornada</ButtonLink>
      </div>
    </div>
  );
}

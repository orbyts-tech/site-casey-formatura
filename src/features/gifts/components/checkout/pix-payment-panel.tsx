"use client";

import Image from "next/image";
import { ArrowLeft, Check, Copy, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import type { PixCheckout } from "../../actions/gift-contribution-actions";
import { formatCentsAsBrl } from "../../domain/money";

interface PixPaymentPanelProps {
  readonly pixCheckout: PixCheckout;
  readonly isConfirming: boolean;
  readonly onConfirmPixSent: () => void;
  readonly onReturnToDetails: () => void;
}

const PAYMENT_STEPS = [
  "Abra o app do seu banco e escolha pagar com Pix.",
  "Escaneie o QR Code ou cole o código copia e cola.",
  "Confira o valor e o nome da recebedora antes de confirmar.",
] as const;

export function PixPaymentPanel({ pixCheckout, isConfirming, onConfirmPixSent, onReturnToDetails }: PixPaymentPanelProps) {
  const { copyStatus, copyText } = useCopyToClipboard();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="font-serif text-2xl text-forest sm:text-3xl">Pague com Pix</h2>
        <p className="mt-1 text-sm text-ink-soft">O valor já está preenchido no código.</p>
      </div>

      <div className="flex flex-col items-center gap-5 bg-paper p-2 shadow-[0_24px_50px_-30px_rgba(21,51,38,0.45)] sm:flex-row sm:items-center">
        <div className="border border-gold-soft/70 p-3">
          <Image
            src={pixCheckout.qrCodeDataUrl}
            alt={`QR Code Pix de ${formatCentsAsBrl(pixCheckout.totalInCents)}`}
            width={224}
            height={224}
            unoptimized
            className="size-52 sm:size-56"
          />
        </div>
        <div className="flex flex-col items-center gap-1 pb-4 text-center sm:items-start sm:pb-0 sm:pr-4 sm:text-left">
          <p className="text-xs uppercase tracking-[0.2em] text-ink-soft">Valor</p>
          <p className="font-serif text-4xl text-forest">{formatCentsAsBrl(pixCheckout.totalInCents)}</p>
          <p className="mt-2 text-sm text-ink-soft">
            Para: <span className="font-serif text-base text-forest">{pixCheckout.receiverName}</span>
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="pix-copy-paste" className="font-serif text-base text-forest">
          Pix copia e cola
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id="pix-copy-paste"
            readOnly
            value={pixCheckout.pixPayload}
            onFocus={(focusEvent) => focusEvent.currentTarget.select()}
            className="min-w-0 flex-1 truncate rounded-md border border-gold-soft bg-paper px-4 py-3 font-mono text-xs text-ink-soft focus:border-forest focus:outline-none"
          />
          <Button
            variant="secondary"
            onClick={() => copyText(pixCheckout.pixPayload)}
            leadingIcon={
              copyStatus === "copied" ? (
                <Check className="size-4" strokeWidth={1.6} />
              ) : (
                <Copy className="size-4" strokeWidth={1.4} />
              )
            }
            className="sm:min-w-44"
          >
            {copyStatus === "copied" ? "Código copiado!" : "Copiar código"}
          </Button>
        </div>
        {copyStatus === "failed" && (
          <p className="text-sm text-red-700">Não foi possível copiar. Selecione o código e copie manualmente.</p>
        )}
      </div>

      <ol className="flex flex-col gap-3 border-y border-gold-soft/60 py-5">
        {PAYMENT_STEPS.map((paymentStep, index) => (
          <li key={paymentStep} className="flex items-start gap-3 text-sm text-ink">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-sage font-serif text-sm text-forest">
              {index + 1}
            </span>
            {paymentStep}
          </li>
        ))}
      </ol>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onReturnToDetails}
          disabled={isConfirming}
          className="inline-flex items-center justify-center gap-2 font-serif text-sm text-ink-soft underline-offset-4 hover:text-forest hover:underline"
        >
          <ArrowLeft className="size-4" strokeWidth={1.4} />
          Voltar e editar
        </button>
        <Button
          onClick={onConfirmPixSent}
          disabled={isConfirming}
          leadingIcon={isConfirming ? <LoaderCircle className="size-5 animate-spin" strokeWidth={1.3} /> : undefined}
          className="sm:min-w-56"
        >
          {isConfirming ? "Registrando…" : "Já fiz o Pix"}
        </Button>
      </div>
    </div>
  );
}

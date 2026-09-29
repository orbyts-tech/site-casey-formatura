"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { useHasHydrated } from "@/hooks/use-has-hydrated";
import { ELEGANT_EASE } from "@/lib/motion";
import { ROUTES } from "@/lib/routes";
import { formatCentsAsBrl } from "../../domain/money";
import { useGiftCheckout, type CheckoutStep } from "../../hooks/use-gift-checkout";
import { CheckoutOrderSummary } from "./checkout-order-summary";
import { GiverDetailsForm } from "./giver-details-form";
import { PixPaymentPanel } from "./pix-payment-panel";
import { ThankYouPanel } from "./thank-you-panel";

interface CheckoutViewProps {
  readonly graduateName: string;
  readonly suggestedGiverName: string;
}

const STEP_LABELS: readonly { name: CheckoutStep["name"]; label: string }[] = [
  { name: "details", label: "Seus dados" },
  { name: "pix", label: "Pix" },
  { name: "thanks", label: "Obrigada" },
];

function CheckoutProgress({ currentStepName }: { readonly currentStepName: CheckoutStep["name"] }) {
  const currentStepIndex = STEP_LABELS.findIndex((stepLabel) => stepLabel.name === currentStepName);

  return (
    <ol aria-label="Etapas do pagamento" className="flex items-center justify-center gap-2 sm:gap-3">
      {STEP_LABELS.map((stepLabel, index) => {
        const isReached = index <= currentStepIndex;
        return (
          <li key={stepLabel.name} className="flex items-center gap-2 sm:gap-3">
            <span
              aria-current={index === currentStepIndex ? "step" : undefined}
              className={`flex items-center gap-2 font-serif text-sm ${isReached ? "text-forest" : "text-ink-soft/60"}`}
            >
              <span
                className={`flex size-6 items-center justify-center rounded-full text-xs ${
                  isReached ? "bg-forest text-paper" : "border border-gold-soft text-ink-soft"
                }`}
              >
                {index + 1}
              </span>
              {stepLabel.label}
            </span>
            {index < STEP_LABELS.length - 1 && <span className="h-px w-6 bg-gold-soft sm:w-10" />}
          </li>
        );
      })}
    </ol>
  );
}

function EmptyBag() {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <ShoppingBag className="size-10 text-gold" strokeWidth={1} />
      <h2 className="mt-4 font-serif text-2xl text-forest">Sua sacola está vazia</h2>
      <p className="mt-2 text-sm text-ink-soft">Escolha um presente simbólico para continuar.</p>
      <ButtonLink href={ROUTES.gifts} className="mt-8">
        Escolher presentes
      </ButtonLink>
    </div>
  );
}

export function CheckoutView({ graduateName, suggestedGiverName }: CheckoutViewProps) {
  const hasHydrated = useHasHydrated();
  const {
    step,
    pricedCart,
    errorMessage,
    fieldErrors,
    isPending,
    setQuantity,
    submitGiverDetails,
    confirmPixSent,
    returnToDetails,
  } = useGiftCheckout();

  const isCartEmpty = pricedCart.lines.length === 0;
  const shouldShowSummary = step.name !== "thanks" && !isCartEmpty;

  if (!hasHydrated) {
    return <div className="mx-auto h-96 w-full max-w-5xl animate-pulse rounded-md bg-sage/30" aria-hidden="true" />;
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="flex flex-col items-center gap-6 text-center">
        <Link
          href={ROUTES.gifts}
          className="inline-flex items-center gap-2 self-start font-serif text-sm text-ink-soft hover:text-forest"
        >
          <ArrowLeft className="size-4" strokeWidth={1.4} />
          Presentes
        </Link>
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.4em] text-gold lg:text-xs">Finalizar presente</p>
          <h1 className="mt-2 font-serif text-4xl text-forest sm:text-5xl">
            Um carinho <em>para a {graduateName}</em>
          </h1>
        </div>
        {!isCartEmpty || step.name === "thanks" ? <CheckoutProgress currentStepName={step.name} /> : null}
      </div>

      <div
        className={`mt-10 grid gap-8 lg:gap-12 ${shouldShowSummary ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]" : ""}`}
      >
        {shouldShowSummary && (
          <div className={step.name === "pix" ? "order-2" : "lg:order-2"}>
            <div className="lg:sticky lg:top-8">
              <CheckoutOrderSummary
                pricedCart={pricedCart}
                isEditable={step.name === "details" && !isPending}
                onQuantityChange={setQuantity}
              />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={isCartEmpty && step.name === "details" ? "empty" : step.name}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5, ease: ELEGANT_EASE }}
            className="lg:order-1"
          >
            {step.name === "details" &&
              (isCartEmpty ? (
                <EmptyBag />
              ) : (
                <GiverDetailsForm
                  graduateName={graduateName}
                  initialGiverName={suggestedGiverName}
                  totalLabel={formatCentsAsBrl(pricedCart.totalInCents)}
                  isSubmitting={isPending}
                  errorMessage={errorMessage}
                  fieldErrors={fieldErrors}
                  onSubmit={submitGiverDetails}
                />
              ))}
            {step.name === "pix" && (
              <PixPaymentPanel
                pixCheckout={step.pixCheckout}
                isConfirming={isPending}
                onConfirmPixSent={confirmPixSent}
                onReturnToDetails={returnToDetails}
              />
            )}
            {step.name === "thanks" && (
              <ThankYouPanel
                giverName={step.giverName}
                graduateName={graduateName}
                paymentReportWarning={step.paymentReportWarning}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

"use client";

import { useCallback, useState, useTransition } from "react";
import {
  createGiftContributionAction,
  reportGiftPaymentAction,
  type PixCheckout,
} from "../actions/gift-contribution-actions";
import type { PricedCart } from "../domain/cart";
import { useGiftCart } from "./use-gift-cart";

export interface GiverDetails {
  readonly giverName: string;
  readonly message: string;
}

export type CheckoutStep =
  | { readonly name: "details" }
  | { readonly name: "pix"; readonly pixCheckout: PixCheckout; readonly giverName: string; readonly lockedCart: PricedCart }
  | { readonly name: "thanks"; readonly giverName: string; readonly paymentReportWarning: string | null };

type FieldErrors = Readonly<Partial<Record<string, string>>>;

function scrollToTop(): void {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export function useGiftCheckout() {
  const { lines, pricedCart, setQuantity, clearCart } = useGiftCart();
  const [step, setStep] = useState<CheckoutStep>({ name: "details" });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isPending, startTransition] = useTransition();

  const submitGiverDetails = useCallback(
    (giverDetails: GiverDetails) => {
      startTransition(async () => {
        setErrorMessage(null);
        setFieldErrors({});

        const result = await createGiftContributionAction({ ...giverDetails, lines });
        if (!result.isSuccess) {
          setErrorMessage(result.errorMessage);
          setFieldErrors(result.fieldErrors ?? {});
          return;
        }

        setStep({
          name: "pix",
          pixCheckout: result.data,
          giverName: giverDetails.giverName.trim(),
          lockedCart: pricedCart,
        });
        scrollToTop();
      });
    },
    [lines, pricedCart],
  );

  const confirmPixSent = useCallback(() => {
    if (step.name !== "pix") return;

    startTransition(async () => {
      const result = await reportGiftPaymentAction(step.pixCheckout.contributionId);
      clearCart();
      setStep({
        name: "thanks",
        giverName: step.giverName,
        paymentReportWarning: result.isSuccess ? null : result.errorMessage,
      });
      scrollToTop();
    });
  }, [clearCart, step]);

  const returnToDetails = useCallback(() => {
    setStep({ name: "details" });
    scrollToTop();
  }, []);

  return {
    step,
    pricedCart: step.name === "pix" ? step.lockedCart : pricedCart,
    errorMessage,
    fieldErrors,
    isPending,
    setQuantity,
    submitGiverDetails,
    confirmPixSent,
    returnToDetails,
  };
}

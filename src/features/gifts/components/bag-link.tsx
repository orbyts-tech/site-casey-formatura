"use client";

import { ShoppingBag } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { useGiftCart } from "../hooks/use-gift-cart";

export function BagLink() {
  const { pricedCart } = useGiftCart();

  return (
    <ButtonLink
      href={ROUTES.giftsCheckout}
      variant="secondary"
      size="sm"
      leadingIcon={<ShoppingBag className="size-4" strokeWidth={1.4} />}
      aria-label={`Minha sacola, ${pricedCart.itemCount} ${pricedCart.itemCount === 1 ? "presente" : "presentes"}`}
    >
      Minha sacola ({pricedCart.itemCount})
    </ButtonLink>
  );
}

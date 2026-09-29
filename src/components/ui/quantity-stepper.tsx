import { Minus, Plus } from "lucide-react";

interface QuantityStepperProps {
  readonly quantity: number;
  readonly maxQuantity: number;
  readonly itemLabel: string;
  readonly onQuantityChange: (nextQuantity: number) => void;
  readonly isDisabled?: boolean;
}

const STEP_BUTTON_CLASSES =
  "flex size-8 items-center justify-center rounded-md text-ink-soft transition-colors hover:bg-sage/60 hover:text-forest focus-visible:outline-2 focus-visible:outline-forest disabled:pointer-events-none disabled:opacity-40";

export function QuantityStepper({
  quantity,
  maxQuantity,
  itemLabel,
  onQuantityChange,
  isDisabled = false,
}: QuantityStepperProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-md border border-gold-soft/70 bg-paper p-0.5">
      <button
        type="button"
        onClick={() => onQuantityChange(quantity - 1)}
        disabled={isDisabled}
        aria-label={quantity === 1 ? `Remover ${itemLabel}` : `Diminuir quantidade de ${itemLabel}`}
        className={STEP_BUTTON_CLASSES}
      >
        <Minus className="size-3.5" strokeWidth={1.5} />
      </button>
      <span className="min-w-6 text-center font-serif text-base text-forest" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => onQuantityChange(quantity + 1)}
        disabled={isDisabled || quantity >= maxQuantity}
        aria-label={`Aumentar quantidade de ${itemLabel}`}
        className={STEP_BUTTON_CLASSES}
      >
        <Plus className="size-3.5" strokeWidth={1.5} />
      </button>
    </div>
  );
}

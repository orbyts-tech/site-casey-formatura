"use client";

import { useId } from "react";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

interface ConfirmDialogProps {
  readonly isOpen: boolean;
  readonly title: string;
  readonly description: string;
  readonly confirmLabel: string;
  readonly isConfirming: boolean;
  readonly errorMessage: string | null;
  readonly onConfirm: () => void;
  readonly onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel,
  isConfirming,
  errorMessage,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const titleId = useId();
  const descriptionId = useId();

  return (
    <Modal isOpen={isOpen} onClose={onCancel} titleId={titleId} descriptionId={descriptionId}>
      <div className="px-5 pb-5 pt-8 sm:px-7 sm:pb-7">
        <p className="text-[0.68rem] uppercase tracking-[0.32em] text-gold">Tem certeza?</p>
        <h2 id={titleId} className="mt-2 pr-8 font-serif text-2xl text-forest">
          {title}
        </h2>
        <p id={descriptionId} className="mt-3 text-[0.95rem] leading-relaxed text-ink-soft">
          {description}
        </p>
        {errorMessage && (
          <p role="alert" className="mt-4 text-sm text-red-700">
            {errorMessage}
          </p>
        )}
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" size="sm" onClick={onCancel} disabled={isConfirming}>
            Cancelar
          </Button>
          <Button
            size="sm"
            variant="danger"
            onClick={onConfirm}
            disabled={isConfirming}
            leadingIcon={isConfirming ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : undefined}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

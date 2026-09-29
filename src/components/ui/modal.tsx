"use client";

import { useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { useDismissableLayer } from "@/hooks/use-dismissable-layer";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { useHasHydrated } from "@/hooks/use-has-hydrated";
import { ELEGANT_EASE } from "@/lib/motion";

interface ModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly titleId: string;
  readonly descriptionId?: string;
  readonly closeLabel?: string;
  readonly children: ReactNode;
}

export function Modal({ isOpen, onClose, titleId, descriptionId, closeLabel = "Fechar", children }: ModalProps) {
  const hasHydrated = useHasHydrated();
  const panelRef = useRef<HTMLDivElement>(null);

  useDismissableLayer(panelRef, isOpen, onClose);
  useFocusTrap(panelRef, isOpen);
  useBodyScrollLock(isOpen);

  if (!hasHydrated) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: ELEGANT_EASE }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-forest-deep/45 p-4 backdrop-blur-[3px] sm:p-6"
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            tabIndex={-1}
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.6, ease: ELEGANT_EASE }}
            className="relative max-h-[calc(100svh-2rem)] w-full max-w-md overflow-y-auto bg-paper p-2 shadow-[0_40px_80px_-30px_rgba(21,51,38,0.6)] focus:outline-none sm:max-w-lg"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label={closeLabel}
              className="absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-sage/60 hover:text-forest focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold"
            >
              <X className="size-5" strokeWidth={1.3} />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

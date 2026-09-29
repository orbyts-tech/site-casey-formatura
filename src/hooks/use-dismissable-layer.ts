"use client";

import { useEffect, type RefObject } from "react";

export function useDismissableLayer(
  layerRef: RefObject<HTMLElement | null>,
  isOpen: boolean,
  onDismiss: () => void,
): void {
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (pointerEvent: PointerEvent) => {
      const isInsideLayer = layerRef.current?.contains(pointerEvent.target as Node) ?? false;
      if (!isInsideLayer) onDismiss();
    };
    const handleKeyDown = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === "Escape") onDismiss();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, layerRef, onDismiss]);
}

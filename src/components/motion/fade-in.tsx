"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { ELEGANT_EASE } from "@/lib/motion";

interface FadeInProps {
  readonly children: ReactNode;
  readonly delay?: number;
  readonly offsetY?: number;
  readonly shouldWaitForViewport?: boolean;
  readonly className?: string;
}

export function FadeIn({ children, delay = 0, offsetY = 18, shouldWaitForViewport = false, className }: FadeInProps) {
  const hiddenState = { opacity: 0, y: offsetY };
  const visibleState = { opacity: 1, y: 0 };

  return (
    <motion.div
      initial={hiddenState}
      animate={shouldWaitForViewport ? undefined : visibleState}
      whileInView={shouldWaitForViewport ? visibleState : undefined}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.9, delay, ease: ELEGANT_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

"use client";

import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { ELEGANT_EASE } from "@/lib/motion";

interface AccordionItemProps {
  readonly question: string;
  readonly icon?: ReactNode;
  readonly children: ReactNode;
}

export function AccordionItem({ question, icon, children }: AccordionItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const panelId = useId();

  return (
    <div className="border-y border-gold-soft/70">
      <button
        type="button"
        aria-expanded={isExpanded}
        aria-controls={panelId}
        onClick={() => setIsExpanded((isCurrentlyExpanded) => !isCurrentlyExpanded)}
        className="flex w-full items-center gap-3 px-2 py-5 text-left font-serif text-lg text-forest transition-colors hover:text-forest-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest sm:px-4 sm:text-xl"
      >
        {icon}
        <span className="flex-1">{question}</span>
        <Plus
          className={`size-5 shrink-0 text-gold transition-transform duration-300 ${isExpanded ? "rotate-45" : ""}`}
          strokeWidth={1.3}
        />
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id={panelId}
            role="region"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: ELEGANT_EASE }}
            className="overflow-hidden"
          >
            <div className="px-2 pb-5 text-sm leading-relaxed text-ink-soft sm:px-4 sm:pl-12 sm:text-base">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

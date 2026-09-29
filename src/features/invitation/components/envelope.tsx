"use client";

import { motion } from "motion/react";
import type { InvitationPhase } from "../domain/invitation";
import { LetterPreview } from "./letter-preview";
import { WaxSeal } from "@/components/brand/wax-seal";
import { ELEGANT_EASE, FOLD_EASE } from "@/lib/motion";
import { INVITATION_LAYOUT_ID, LETTER_TO_CARD_TRANSITION } from "./motion-tokens";

interface EnvelopeProps {
  readonly phase: InvitationPhase;
  readonly monogram: string;
  readonly greetingLine: string;
  readonly onOpen: () => void;
  readonly className?: string;
}

const LINER_PATTERN =
  "repeating-linear-gradient(135deg, rgba(255,255,255,0.22) 0 1.5px, transparent 1.5px 11px), linear-gradient(180deg, #e9eee2, #dfe6d7)";

const SEAL_HALVES = [
  { side: "left", clipPath: "inset(-30% 49% -30% -30%)", exitX: -38, exitRotate: -28 },
  { side: "right", clipPath: "inset(-30% -30% -30% 50%)", exitX: 38, exitRotate: 28 },
] as const;

export function Envelope({ phase, monogram, greetingLine, onOpen, className = "" }: EnvelopeProps) {
  const isSealed = phase === "sealed";
  const isFlapOpen = !isSealed;
  const isFlapBehindLetter = phase === "letterRising" || phase === "revealed";
  const isLetterOut = phase === "letterRising";
  const isRevealed = phase === "revealed";

  return (
    <motion.div
      layout
      transition={{ layout: { duration: 1.15, ease: ELEGANT_EASE } }}
      className={`aspect-[8/5] w-[min(94vw,680px)] lg:w-[min(64vw,780px,calc((100svh-20rem)*1.6))] 2xl:w-[min(56vw,900px,calc((100svh-22rem)*1.6))] ${className}`}
    >
      <motion.div
        className="relative h-full w-full"
        initial={{ opacity: 0, y: 40, scale: 0.94 }}
        animate={
          isSealed
            ? { opacity: 1, y: [0, -10, 0], rotate: [-0.8, 0.8, -0.8], scale: 1 }
            : { opacity: 1, y: 0, rotate: 0, scale: 1 }
        }
        transition={
          isSealed
            ? {
                opacity: { duration: 0.9, ease: ELEGANT_EASE },
                scale: { duration: 0.9, ease: ELEGANT_EASE },
                y: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 7, repeat: Infinity, ease: "easeInOut" },
              }
            : { duration: 0.6, ease: ELEGANT_EASE }
        }
        whileHover={isSealed ? { scale: 1.025 } : undefined}
        whileTap={isSealed ? { scale: 0.985 } : undefined}
      >
        <div className="absolute -bottom-10 left-[10%] right-[10%] h-10 rounded-[50%] bg-forest-deep/25 blur-2xl" />

        <div
          className="absolute inset-0 rounded-md shadow-[0_30px_60px_-25px_rgba(21,51,38,0.45)]"
          style={{ background: LINER_PATTERN }}
        />

        <div
          className="absolute inset-x-0 top-0 h-[56%] drop-shadow-[0_4px_4px_rgba(21,51,38,0.12)]"
          style={{ perspective: 1400, zIndex: isFlapBehindLetter ? 10 : 40 }}
        >
          <motion.div
            className="relative h-full w-full"
            style={{ transformStyle: "preserve-3d", transformOrigin: "50% 0%" }}
            initial={false}
            animate={{ rotateX: isFlapOpen ? 180 : 0 }}
            transition={{ duration: 0.95, delay: isFlapOpen ? 0.3 : 0, ease: FOLD_EASE }}
          >
            <div
              className="absolute inset-0 rounded-t-md"
              style={{
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                background: "linear-gradient(180deg, #d6dfcc 0%, #cbd5c0 100%)",
                backfaceVisibility: "hidden",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                clipPath: "polygon(50% 0, 0 100%, 100% 100%)",
                background: LINER_PATTERN,
                transform: "rotateX(180deg)",
                backfaceVisibility: "hidden",
              }}
            />
          </motion.div>
        </div>

        {!isRevealed && (
          <motion.div
            layout
            layoutId={INVITATION_LAYOUT_ID}
            transition={LETTER_TO_CARD_TRANSITION}
            className={`absolute inset-x-[5%] z-20 ${isLetterOut ? "-top-[50%] bottom-[60%]" : "top-[5%] bottom-[5%]"}`}
          >
            <LetterPreview monogram={monogram} greetingLine={greetingLine} />
          </motion.div>
        )}

        <EnvelopePocket />

        <div className="pointer-events-none absolute left-1/2 top-[56%] z-50 aspect-square w-[17%] -translate-x-1/2 -translate-y-1/2">
          {SEAL_HALVES.map(({ side, clipPath, exitX, exitRotate }) => (
            <motion.div
              key={side}
              className="absolute inset-0"
              style={{ clipPath }}
              initial={false}
              animate={
                isSealed
                  ? { x: 0, y: 0, rotate: 0, opacity: 1 }
                  : { x: exitX, y: 26, rotate: exitRotate, opacity: 0 }
              }
              transition={{ duration: 0.7, ease: ELEGANT_EASE }}
            >
              <WaxSeal monogram={monogram} className="h-full w-full" />
            </motion.div>
          ))}
        </div>

        {isSealed && (
          <button
            type="button"
            onClick={onOpen}
            aria-label="Abrir o convite"
            className="absolute inset-0 z-[60] cursor-pointer rounded-md focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-forest"
          />
        )}
      </motion.div>
    </motion.div>
  );
}

function EnvelopePocket() {
  return (
    <svg
      viewBox="0 0 600 375"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-30 h-full w-full"
    >
      <defs>
        <linearGradient id="envelope-side-left" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#dfe6d8" />
          <stop offset="100%" stopColor="#e8ede2" />
        </linearGradient>
        <linearGradient id="envelope-side-right" x1="1" y1="0" x2="0" y2="0">
          <stop offset="0%" stopColor="#dbe3d3" />
          <stop offset="100%" stopColor="#e6ebdf" />
        </linearGradient>
        <linearGradient id="envelope-bottom" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#dde4d5" />
          <stop offset="100%" stopColor="#eef2e9" />
        </linearGradient>
        <clipPath id="envelope-rounded">
          <rect width="600" height="375" rx="6" />
        </clipPath>
      </defs>

      <g clipPath="url(#envelope-rounded)">
        <polygon points="0,0 0,375 296,202" fill="url(#envelope-side-left)" />
        <polygon points="600,0 600,375 304,202" fill="url(#envelope-side-right)" />
        <polygon points="0,375 600,375 300,172" fill="url(#envelope-bottom)" />
        <path d="M0 375 L300 172 L600 375" fill="none" stroke="#b9c4ad" strokeOpacity="0.55" strokeWidth="1.2" />
        <path d="M0 0 L296 202 M600 0 L304 202" fill="none" stroke="#c3cdb8" strokeOpacity="0.45" strokeWidth="1" />
      </g>
    </svg>
  );
}

"use client";

import Image from "next/image";
import { BotanicalSprig } from "@/components/brand/botanical-sprig";
import { Signature } from "@/components/brand/signature";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { useGiftsWelcomeModal } from "../hooks/use-gifts-welcome-modal";

interface GiftsWelcomeModalProps {
  readonly graduateName: string;
  readonly graduatePhotoUrl: string;
}

const TITLE_ID = "gifts-welcome-title";
const DESCRIPTION_ID = "gifts-welcome-description";

export function GiftsWelcomeModal({ graduateName, graduatePhotoUrl }: GiftsWelcomeModalProps) {
  const { isOpen, closeWelcome } = useGiftsWelcomeModal();

  return (
    <Modal isOpen={isOpen} onClose={closeWelcome} titleId={TITLE_ID} descriptionId={DESCRIPTION_ID}>
      <div className="relative overflow-hidden border border-gold-soft/70 px-6 pb-8 pt-10 text-center sm:px-10 sm:pb-10 sm:pt-12">
        <BotanicalSprig className="pointer-events-none absolute -left-6 -top-4 w-24 -rotate-[25deg] opacity-80 sm:w-28" />
        <BotanicalSprig className="pointer-events-none absolute -bottom-6 -right-6 w-24 rotate-[155deg] opacity-80 sm:w-28" />

        <figure className="relative mx-auto w-fit rounded-t-full border border-gold-soft p-1.5">
          <div className="relative h-40 w-28 overflow-hidden rounded-t-full sm:h-48 sm:w-36">
            <Image src={graduatePhotoUrl} alt={`Foto de ${graduateName}`} fill sizes="144px" className="object-cover" />
          </div>
        </figure>

        <p className="relative mt-6 text-[0.7rem] uppercase tracking-[0.4em] text-gold">Antes de tudo</p>
        <h2 id={TITLE_ID} className="relative mt-3 font-serif text-3xl leading-tight text-forest sm:text-4xl">
          O maior presente
          <br />
          <em>é você lá.</em>
        </h2>
        <span className="mx-auto mt-5 block h-px w-12 bg-gold" />

        <div id={DESCRIPTION_ID} className="relative mt-5 space-y-3 text-sm leading-relaxed text-ink-soft sm:text-base">
          <p>Ter você comigo nesta data, celebrando essa conquista, é o que mais importa para mim.</p>
          <p>
            Os presentes são <strong className="font-medium text-forest">totalmente opcionais</strong> — só um
            jeitinho a mais de carinho, para quem quiser.
          </p>
        </div>

        <p className="relative mt-6 font-serif text-base italic text-forest">Com carinho,</p>
        <Signature name={graduateName} className="relative text-5xl" />

        <Button onClick={closeWelcome} className="relative mt-8 w-full">
          Entendi, ver os presentes
        </Button>
      </div>
    </Modal>
  );
}

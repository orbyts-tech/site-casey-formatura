"use client";

import { useState, type FormEvent } from "react";
import { LoaderCircle, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextArea, TextInput } from "@/components/ui/text-field";
import type { GiverDetails } from "../../hooks/use-gift-checkout";

interface GiverDetailsFormProps {
  readonly graduateName: string;
  readonly initialGiverName: string;
  readonly totalLabel: string;
  readonly isSubmitting: boolean;
  readonly errorMessage: string | null;
  readonly fieldErrors: Readonly<Partial<Record<string, string>>>;
  readonly onSubmit: (giverDetails: GiverDetails) => void;
}

const MAX_MESSAGE_LENGTH = 500;

export function GiverDetailsForm({
  graduateName,
  initialGiverName,
  totalLabel,
  isSubmitting,
  errorMessage,
  fieldErrors,
  onSubmit,
}: GiverDetailsFormProps) {
  const [giverName, setGiverName] = useState(initialGiverName);
  const [message, setMessage] = useState("");

  const handleSubmit = (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault();
    onSubmit({ giverName, message });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div>
        <h2 className="font-serif text-2xl text-forest sm:text-3xl">Quem está presenteando?</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Assim a {graduateName} sabe de quem veio esse carinho.
        </p>
      </div>

      <TextInput
        id="giver-name"
        label="Seu nome"
        placeholder="Ex.: Ana e Bruno Souza"
        autoComplete="name"
        maxLength={80}
        required
        value={giverName}
        onChange={(changeEvent) => setGiverName(changeEvent.target.value)}
        errorMessage={fieldErrors.giverName}
      />

      <TextArea
        id="giver-message"
        label={`Mensagem para a ${graduateName} (opcional)`}
        placeholder="Escreva algumas palavras de carinho…"
        maxLength={MAX_MESSAGE_LENGTH}
        value={message}
        onChange={(changeEvent) => setMessage(changeEvent.target.value)}
        hint={`${message.length}/${MAX_MESSAGE_LENGTH} caracteres`}
        errorMessage={fieldErrors.message}
      />

      {errorMessage && (
        <p role="alert" className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {errorMessage}
        </p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        leadingIcon={
          isSubmitting ? (
            <LoaderCircle className="size-5 animate-spin" strokeWidth={1.3} />
          ) : (
            <QrCode className="size-5" strokeWidth={1.3} />
          )
        }
        className="w-full"
      >
        {isSubmitting ? "Gerando seu Pix…" : `Gerar Pix de ${totalLabel}`}
      </Button>
      <p className="-mt-2 text-center text-xs text-ink-soft">
        Você verá um QR Code e o código Pix copia e cola com o valor exato.
      </p>
    </form>
  );
}

"use client";

import { LoaderCircle, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextArea, TextInput } from "@/components/ui/text-field";
import {
  formatGreetingLine,
  GREETING_PREFIXES,
  MAX_GUESTS_PER_INVITATION,
} from "@/features/invitation/domain/invitation-record";
import { buildInvitationLink } from "../../domain/invitation-share";
import { useCreateInvitationForm, type CreatedInvitationSummary } from "../../hooks/use-create-invitation-form";
import { AdminSurface } from "../ui/admin-surface";
import { InvitationShareButtons } from "./invitation-share-actions";

interface InvitationCreatePanelProps {
  readonly siteOrigin: string;
  readonly graduateName: string;
}

interface CreatedInvitationCardProps {
  readonly createdInvitation: CreatedInvitationSummary;
  readonly siteOrigin: string;
  readonly graduateName: string;
  readonly onCreateAnother: () => void;
}

function CreatedInvitationCard({ createdInvitation, siteOrigin, graduateName, onCreateAnother }: CreatedInvitationCardProps) {
  const greetingLine = formatGreetingLine(createdInvitation.greetingPrefix, createdInvitation.greetingName);
  const invitationLink = buildInvitationLink(siteOrigin, createdInvitation.token);

  return (
    <div className="flex flex-col gap-5" aria-live="polite">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-full bg-forest text-paper">
          <Sparkles className="size-5" strokeWidth={1.4} aria-hidden="true" />
        </span>
        <div>
          <p className="text-[0.68rem] uppercase tracking-[0.28em] text-gold">Convite pronto</p>
          <p className="font-serif text-xl text-forest">{greetingLine}</p>
        </div>
      </div>

      <div>
        <label htmlFor="created-invitation-link" className="font-serif text-base text-forest">
          Link exclusivo
        </label>
        <input
          id="created-invitation-link"
          readOnly
          value={invitationLink}
          onFocus={(event) => event.currentTarget.select()}
          className="mt-1.5 w-full rounded-md border border-gold-soft bg-ivory px-4 py-3 font-mono text-sm text-ink focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/15"
        />
        <p className="mt-1.5 text-xs text-ink-soft">Quem abrir este link verá o convite com o nome personalizado.</p>
      </div>

      <InvitationShareButtons greetingLine={greetingLine} invitationLink={invitationLink} graduateName={graduateName} />

      <button
        type="button"
        onClick={onCreateAnother}
        className="inline-flex items-center justify-center gap-2 self-center text-sm text-ink-soft underline-offset-4 transition-colors hover:text-forest hover:underline"
      >
        <Plus className="size-4" aria-hidden="true" />
        Criar outro convite
      </button>
    </div>
  );
}

export function InvitationCreatePanel({ siteOrigin, graduateName }: InvitationCreatePanelProps) {
  const {
    greetingPrefix,
    setGreetingPrefix,
    greetingName,
    setGreetingName,
    guestNamesText,
    setGuestNamesText,
    guestNames,
    fieldErrors,
    errorMessage,
    isCreating,
    createdInvitation,
    submitInvitation,
    startAnotherInvitation,
  } = useCreateInvitationForm();

  const previewName = greetingName.trim() || "Nome da pessoa";

  return (
    <AdminSurface className="p-5 sm:p-6">
      {createdInvitation ? (
        <CreatedInvitationCard
          createdInvitation={createdInvitation}
          siteOrigin={siteOrigin}
          graduateName={graduateName}
          onCreateAnother={startAnotherInvitation}
        />
      ) : (
        <form onSubmit={submitInvitation} className="flex flex-col gap-5" noValidate>
          <div>
            <p className="text-[0.68rem] uppercase tracking-[0.28em] text-gold">Novo convite</p>
            <h2 className="mt-1 font-serif text-2xl text-forest">Para quem é?</h2>
          </div>

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-1.5 font-serif text-base text-forest">Saudação</legend>
            <div className="flex flex-wrap gap-2">
              {GREETING_PREFIXES.map((prefix) => {
                const isSelected = prefix === greetingPrefix;
                return (
                  <label
                    key={prefix}
                    className={`cursor-pointer rounded-full border px-3.5 py-1.5 text-sm transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-forest ${
                      isSelected ? "border-forest bg-forest text-paper" : "border-gold-soft/70 bg-paper text-ink hover:border-gold"
                    }`}
                  >
                    <input
                      type="radio"
                      name="greetingPrefix"
                      value={prefix}
                      checked={isSelected}
                      onChange={() => setGreetingPrefix(prefix)}
                      className="sr-only"
                    />
                    {prefix}
                  </label>
                );
              })}
            </div>
          </fieldset>

          <TextInput
            id="invitation-greeting-name"
            label="Nome no convite"
            placeholder="Ex.: Ana, Tia Marta, Família Souza"
            value={greetingName}
            onChange={(event) => setGreetingName(event.target.value)}
            maxLength={80}
            errorMessage={fieldErrors.greetingName}
            required
          />

          <TextArea
            id="invitation-guest-names"
            label="Convidados (opcional)"
            placeholder={"Um nome por linha\nEx.: Ana Souza\nPedro Souza"}
            value={guestNamesText}
            onChange={(event) => setGuestNamesText(event.target.value)}
            hint={`${guestNames.length}/${MAX_GUESTS_PER_INVITATION} • aparecem no convite e ajudam a contar as presenças.`}
            errorMessage={fieldErrors.guestNames}
            rows={3}
          />

          <div className="rounded-md border border-dashed border-gold-soft bg-ivory/70 px-4 py-4 text-center">
            <p className="text-[0.62rem] uppercase tracking-[0.3em] text-ink-soft">Prévia</p>
            <p className="mt-1 font-script text-3xl text-forest">{formatGreetingLine(greetingPrefix, previewName)},</p>
          </div>

          {errorMessage && (
            <p role="alert" className="text-sm text-red-700">
              {errorMessage}
            </p>
          )}

          <Button
            type="submit"
            disabled={isCreating}
            leadingIcon={isCreating ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Plus className="size-4" aria-hidden="true" />}
          >
            {isCreating ? "Gerando link..." : "Gerar link do convite"}
          </Button>
        </form>
      )}
    </AdminSurface>
  );
}

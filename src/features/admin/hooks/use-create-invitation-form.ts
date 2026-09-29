"use client";

import { useState, type FormEvent } from "react";
import type { GreetingPrefix } from "@/features/invitation/domain/invitation-record";
import type { FieldErrors } from "@/lib/action-result";
import { createInvitationAction, type CreatedInvitation } from "../actions/invitation-admin-actions";
import { useAdminMutation } from "./use-admin-mutation";

export interface CreatedInvitationSummary extends CreatedInvitation {
  readonly greetingPrefix: GreetingPrefix;
  readonly greetingName: string;
}

const splitGuestNames = (guestNamesText: string): string[] =>
  guestNamesText
    .split(/\r?\n/)
    .map((guestName) => guestName.trim())
    .filter((guestName) => guestName.length > 0);

export function useCreateInvitationForm() {
  const [greetingPrefix, setGreetingPrefix] = useState<GreetingPrefix>("Querida");
  const [greetingName, setGreetingName] = useState("");
  const [guestNamesText, setGuestNamesText] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [createdInvitation, setCreatedInvitation] = useState<CreatedInvitationSummary | null>(null);
  const { isPending: isCreating, errorMessage, run: runCreateInvitation } = useAdminMutation(createInvitationAction);

  const guestNames = splitGuestNames(guestNamesText);

  const submitInvitation = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedGreetingName = greetingName.trim();
    const result = await runCreateInvitation({ greetingPrefix, greetingName: trimmedGreetingName, guestNames });

    if (!result.isSuccess) {
      setFieldErrors(result.fieldErrors ?? {});
      return;
    }

    setFieldErrors({});
    setCreatedInvitation({ ...result.data, greetingPrefix, greetingName: trimmedGreetingName });
    setGreetingName("");
    setGuestNamesText("");
  };

  const startAnotherInvitation = () => setCreatedInvitation(null);

  return {
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
  };
}

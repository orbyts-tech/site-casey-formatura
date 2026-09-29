"use client";

import { useActionState } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/text-field";
import { signInAdminAction, type AdminSignInFormState } from "../../actions/admin-auth-actions";

const INITIAL_SIGN_IN_STATE: AdminSignInFormState = { errorMessage: null, email: "" };

export function AdminSignInForm() {
  const [formState, submitSignIn, isSigningIn] = useActionState(signInAdminAction, INITIAL_SIGN_IN_STATE);

  return (
    <form action={submitSignIn} className="flex flex-col gap-5" noValidate>
      <TextInput
        id="admin-email"
        name="email"
        type="email"
        label="E-mail"
        autoComplete="email"
        inputMode="email"
        defaultValue={formState.email}
        required
      />
      <TextInput
        id="admin-password"
        name="password"
        type="password"
        label="Senha"
        autoComplete="current-password"
        required
      />

      <p role="alert" aria-live="polite" className="min-h-5 text-sm text-red-700">
        {formState.errorMessage}
      </p>

      <Button
        type="submit"
        disabled={isSigningIn}
        className="w-full"
        trailingIcon={
          isSigningIn ? (
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden="true" />
          )
        }
      >
        {isSigningIn ? "Entrando..." : "Entrar no painel"}
      </Button>
    </form>
  );
}

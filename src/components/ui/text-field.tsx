import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

interface FieldShellProps {
  readonly id: string;
  readonly label: string;
  readonly hint?: string;
  readonly errorMessage?: string;
  readonly children: ReactNode;
}

const CONTROL_CLASSES =
  "w-full rounded-md border bg-paper px-4 py-3 text-base text-ink placeholder:text-ink-soft/60 transition-colors focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/15";

function FieldShell({ id, label, hint, errorMessage, children }: FieldShellProps) {
  return (
    <div className="flex flex-col gap-1.5 text-left">
      <label htmlFor={id} className="font-serif text-base text-forest">
        {label}
      </label>
      {children}
      {errorMessage ? (
        <p id={`${id}-error`} className="text-sm text-red-700">
          {errorMessage}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="text-xs text-ink-soft">
            {hint}
          </p>
        )
      )}
    </div>
  );
}

type TextInputProps = Omit<FieldShellProps, "children"> & InputHTMLAttributes<HTMLInputElement>;

export function TextInput({ id, label, hint, errorMessage, className = "", ...inputAttributes }: TextInputProps) {
  return (
    <FieldShell id={id} label={label} hint={hint} errorMessage={errorMessage}>
      <input
        id={id}
        aria-invalid={Boolean(errorMessage)}
        aria-describedby={errorMessage ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={`${CONTROL_CLASSES} ${errorMessage ? "border-red-400" : "border-gold-soft"} ${className}`}
        {...inputAttributes}
      />
    </FieldShell>
  );
}

type TextAreaProps = Omit<FieldShellProps, "children"> & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextArea({ id, label, hint, errorMessage, className = "", ...textareaAttributes }: TextAreaProps) {
  return (
    <FieldShell id={id} label={label} hint={hint} errorMessage={errorMessage}>
      <textarea
        id={id}
        aria-invalid={Boolean(errorMessage)}
        aria-describedby={errorMessage ? `${id}-error` : hint ? `${id}-hint` : undefined}
        className={`${CONTROL_CLASSES} min-h-28 resize-y ${errorMessage ? "border-red-400" : "border-gold-soft"} ${className}`}
        {...textareaAttributes}
      />
    </FieldShell>
  );
}

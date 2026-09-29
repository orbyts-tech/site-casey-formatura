import { z } from "zod";

const CONTROL_CHARACTERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F]/g;
// Zero-width and bidirectional override characters can disguise text (e.g. reversed names or hidden content).
const INVISIBLE_FORMATTING_CHARACTERS = /[\u00AD\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u2069\uFEFF]/g;
const RAW_LENGTH_SAFETY_FACTOR = 4;

interface PlainTextOptions {
  readonly allowLineBreaks?: boolean;
}

export function sanitizePlainText(text: string, { allowLineBreaks = false }: PlainTextOptions = {}): string {
  const withoutHiddenCharacters = text
    .normalize("NFC")
    .replace(/\r\n?/g, "\n")
    .replace(INVISIBLE_FORMATTING_CHARACTERS, "")
    .replace(/\t/g, " ");

  const withNormalizedBreaks = allowLineBreaks
    ? withoutHiddenCharacters
        .split("\n")
        .map((line) => line.replace(CONTROL_CHARACTERS, "").replace(/ {2,}/g, " ").trim())
        .join("\n")
        .replace(/\n{3,}/g, "\n\n")
    : withoutHiddenCharacters.replace(/\n/g, " ").replace(CONTROL_CHARACTERS, "").replace(/ {2,}/g, " ");

  return withNormalizedBreaks.trim();
}

interface PlainTextSchemaOptions extends PlainTextOptions {
  readonly minLength: number;
  readonly maxLength: number;
  readonly minLengthMessage?: string;
  readonly maxLengthMessage: string;
}

export function plainTextSchema({
  minLength,
  maxLength,
  minLengthMessage,
  maxLengthMessage,
  allowLineBreaks,
}: PlainTextSchemaOptions) {
  return z
    .string()
    .max(maxLength * RAW_LENGTH_SAFETY_FACTOR, maxLengthMessage)
    .transform((text) => sanitizePlainText(text, { allowLineBreaks }))
    .pipe(z.string().min(minLength, minLengthMessage).max(maxLength, maxLengthMessage));
}

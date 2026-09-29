export interface StaticPixPayloadInput {
  readonly pixKey: string;
  readonly receiverName: string;
  readonly receiverCity: string;
  readonly amountInCents: number;
  readonly transactionId: string;
  readonly description?: string;
}

const PIX_GUI = "br.gov.bcb.pix";
const MAX_FIELD_LENGTH = 99;
const MAX_RECEIVER_NAME_LENGTH = 25;
const MAX_RECEIVER_CITY_LENGTH = 15;
const MAX_TRANSACTION_ID_LENGTH = 25;

function toBrCodeSafeText(text: string, maxLength: number): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9 .,@+\-_]/g, "")
    .trim()
    .slice(0, maxLength);
}

function formatField(fieldId: string, value: string): string {
  if (value.length > MAX_FIELD_LENGTH) {
    throw new Error(`Campo Pix ${fieldId} excede ${MAX_FIELD_LENGTH} caracteres.`);
  }
  return `${fieldId}${value.length.toString().padStart(2, "0")}${value}`;
}

export function calculateCrc16Ccitt(payload: string): string {
  let crc = 0xffff;
  for (const byte of new TextEncoder().encode(payload)) {
    crc ^= byte << 8;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

// Follows the BR Code (EMV® QRCPS-MPM) layout defined by the Banco Central for static Pix charges.
export function buildStaticPixPayload(input: StaticPixPayloadInput): string {
  if (!Number.isInteger(input.amountInCents) || input.amountInCents <= 0) {
    throw new Error("O valor do Pix deve ser um número inteiro de centavos maior que zero.");
  }

  const transactionId =
    input.transactionId.replace(/[^a-zA-Z0-9]/g, "").slice(0, MAX_TRANSACTION_ID_LENGTH) || "***";
  const description = input.description ? toBrCodeSafeText(input.description, 40) : "";

  const merchantAccountInformation = [
    formatField("00", PIX_GUI),
    formatField("01", input.pixKey.trim()),
    description ? formatField("02", description) : "",
  ].join("");

  const payloadWithoutCrc = [
    formatField("00", "01"),
    formatField("26", merchantAccountInformation),
    formatField("52", "0000"),
    formatField("53", "986"),
    formatField("54", (input.amountInCents / 100).toFixed(2)),
    formatField("58", "BR"),
    formatField("59", toBrCodeSafeText(input.receiverName, MAX_RECEIVER_NAME_LENGTH)),
    formatField("60", toBrCodeSafeText(input.receiverCity, MAX_RECEIVER_CITY_LENGTH)),
    formatField("62", formatField("05", transactionId)),
    "6304",
  ].join("");

  return `${payloadWithoutCrc}${calculateCrc16Ccitt(payloadWithoutCrc)}`;
}

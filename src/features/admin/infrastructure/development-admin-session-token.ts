import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";

export const DEVELOPMENT_ADMIN_COOKIE = "casey_admin_dev";
export const DEVELOPMENT_ADMIN_SESSION_SECONDS = 60 * 60 * 12;

const sessionPayloadSchema = z.object({
  email: z.email(),
  expiresAt: z.number().int().positive(),
});

const signPayload = (encodedPayload: string, secret: string): string =>
  createHmac("sha256", secret).update(encodedPayload).digest("base64url");

export function areSecretsEqual(candidate: string, expected: string): boolean {
  const candidateDigest = createHash("sha256").update(candidate).digest();
  const expectedDigest = createHash("sha256").update(expected).digest();
  return timingSafeEqual(candidateDigest, expectedDigest);
}

export function createDevelopmentAdminSessionToken(email: string, secret: string, nowInMs = Date.now()): string {
  const payload = { email, expiresAt: nowInMs + DEVELOPMENT_ADMIN_SESSION_SECONDS * 1000 };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${encodedPayload}.${signPayload(encodedPayload, secret)}`;
}

export function readDevelopmentAdminSessionEmail(
  token: string | undefined,
  secret: string,
  nowInMs = Date.now(),
): string | null {
  if (!token) return null;

  const [encodedPayload, signature, ...unexpectedParts] = token.split(".");
  if (!encodedPayload || !signature || unexpectedParts.length > 0) return null;
  if (!areSecretsEqual(signature, signPayload(encodedPayload, secret))) return null;

  try {
    const decodedPayload: unknown = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8"));
    const parsedPayload = sessionPayloadSchema.safeParse(decodedPayload);
    if (!parsedPayload.success || parsedPayload.data.expiresAt <= nowInMs) return null;
    return parsedPayload.data.email;
  } catch {
    return null;
  }
}

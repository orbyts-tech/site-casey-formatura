import "server-only";
import { z } from "zod";
import { ServerConfigurationError } from "@/infrastructure/server-config";
import type { PixReceiver } from "../domain/gift-contribution";

const pixReceiverEnvSchema = z.object({
  PIX_KEY: z.string().trim().min(1, "PIX_KEY não configurada").max(77),
  PIX_RECEIVER_NAME: z.string().trim().min(1, "PIX_RECEIVER_NAME não configurado"),
  PIX_RECEIVER_CITY: z.string().trim().min(1, "PIX_RECEIVER_CITY não configurada"),
});

export function getPixReceiver(): PixReceiver {
  const parsedEnv = pixReceiverEnvSchema.safeParse(process.env);
  if (!parsedEnv.success) {
    throw new ServerConfigurationError(parsedEnv.error.issues.map((issue) => issue.message).join(", "));
  }

  return {
    pixKey: parsedEnv.data.PIX_KEY,
    receiverName: parsedEnv.data.PIX_RECEIVER_NAME,
    receiverCity: parsedEnv.data.PIX_RECEIVER_CITY,
  };
}

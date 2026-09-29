import "server-only";
import { headers } from "next/headers";

const UNKNOWN_CLIENT_IP = "unknown";

export async function getClientIp(): Promise<string> {
  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();
  const clientIp = requestHeaders.get("x-real-ip")?.trim() || forwardedFor;
  return clientIp && clientIp.length <= 64 ? clientIp : UNKNOWN_CLIENT_IP;
}

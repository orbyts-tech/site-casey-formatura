import "server-only";
import { headers } from "next/headers";
import { getConfiguredSiteUrl } from "@/infrastructure/server-config";

const HOST_PATTERN = /^[a-z0-9.-]+(:\d{1,5})?$/i;

export async function resolveSiteOrigin(): Promise<string> {
  const configuredSiteUrl = getConfiguredSiteUrl();
  if (configuredSiteUrl) return configuredSiteUrl;

  const requestHeaders = await headers();
  const requestHost = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const host = HOST_PATTERN.test(requestHost) ? requestHost : "localhost:3000";
  const isLocalHost = host.startsWith("localhost") || host.startsWith("127.0.0.1");
  const protocol = requestHeaders.get("x-forwarded-proto") === "http" || isLocalHost ? "http" : "https";

  return `${protocol}://${host}`;
}

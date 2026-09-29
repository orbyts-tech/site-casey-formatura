import "server-only";
import { createHmac } from "node:crypto";
import { z } from "zod";
import { resolveDataBackend } from "../data-backend";
import { getRateLimitSecret } from "../server-config";
import { getSupabaseServiceClient } from "../supabase/service-client";

export interface RateLimitPolicy {
  readonly name: string;
  readonly maxHits: number;
  readonly windowSeconds: number;
}

export const RATE_LIMIT_POLICIES = {
  giftContribution: { name: "gift-contribution", maxHits: 8, windowSeconds: 10 * 60 },
  giftPaymentReport: { name: "gift-payment-report", maxHits: 20, windowSeconds: 10 * 60 },
  rsvpAnswer: { name: "rsvp-answer", maxHits: 20, windowSeconds: 10 * 60 },
  adminSignInByIp: { name: "admin-sign-in-ip", maxHits: 5, windowSeconds: 15 * 60 },
  adminSignInByEmail: { name: "admin-sign-in-email", maxHits: 8, windowSeconds: 15 * 60 },
} as const satisfies Record<string, RateLimitPolicy>;

export const RATE_LIMITED_MESSAGE = "Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.";

interface RateLimitStore {
  consume(bucketKey: string, policy: RateLimitPolicy): Promise<boolean>;
}

interface MemoryBucket {
  readonly hitCount: number;
  readonly windowStartedAtMs: number;
}

const MAX_MEMORY_BUCKETS = 5_000;

class MemoryRateLimitStore implements RateLimitStore {
  private readonly buckets = new Map<string, MemoryBucket>();

  async consume(bucketKey: string, policy: RateLimitPolicy): Promise<boolean> {
    const nowMs = Date.now();
    const windowMs = policy.windowSeconds * 1000;
    const currentBucket = this.buckets.get(bucketKey);
    const isWindowExpired = !currentBucket || nowMs - currentBucket.windowStartedAtMs >= windowMs;
    const nextBucket: MemoryBucket = isWindowExpired
      ? { hitCount: 1, windowStartedAtMs: nowMs }
      : { hitCount: currentBucket.hitCount + 1, windowStartedAtMs: currentBucket.windowStartedAtMs };

    if (this.buckets.size >= MAX_MEMORY_BUCKETS && !currentBucket) this.pruneExpired(nowMs, windowMs);
    this.buckets.set(bucketKey, nextBucket);
    return nextBucket.hitCount <= policy.maxHits;
  }

  private pruneExpired(nowMs: number, windowMs: number): void {
    for (const [bucketKey, bucket] of this.buckets) {
      if (nowMs - bucket.windowStartedAtMs >= windowMs) this.buckets.delete(bucketKey);
    }
    if (this.buckets.size >= MAX_MEMORY_BUCKETS) this.buckets.clear();
  }
}

class SupabaseRateLimitStore implements RateLimitStore {
  constructor(private readonly fallbackStore: RateLimitStore) {}

  async consume(bucketKey: string, policy: RateLimitPolicy): Promise<boolean> {
    const { data, error } = await getSupabaseServiceClient().rpc("consume_rate_limit", {
      p_bucket_key: bucketKey,
      p_max_hits: policy.maxHits,
      p_window_seconds: policy.windowSeconds,
    });

    const parsedResult = z.boolean().safeParse(data);
    if (error || !parsedResult.success) {
      console.error("[seguranca] Limite de tentativas indisponível no banco; usando memória", error);
      return this.fallbackStore.consume(bucketKey, policy);
    }
    return parsedResult.data;
  }
}

const memoryStore = new MemoryRateLimitStore();

function getRateLimitStore(): RateLimitStore {
  return resolveDataBackend() === "supabase" ? new SupabaseRateLimitStore(memoryStore) : memoryStore;
}

function buildBucketKey(policy: RateLimitPolicy, identifier: string): string {
  const hashedIdentifier = createHmac("sha256", getRateLimitSecret()).update(identifier).digest("base64url");
  return `${policy.name}:${hashedIdentifier}`;
}

export async function isWithinRateLimit(policy: RateLimitPolicy, identifier: string): Promise<boolean> {
  return getRateLimitStore().consume(buildBucketKey(policy, identifier), policy);
}

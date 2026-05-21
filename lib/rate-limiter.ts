import crypto from "crypto";

const store = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60_000;
const MAX_ATTEMPTS = 5;
const CLEANUP_INTERVAL_MS = 300_000;

let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}

function fingerprint(key: string): string {
  return crypto.createHash("sha256").update(key).digest("hex");
}

export function checkRateLimit(key: string): { allowed: boolean; remaining: number } {
  const now = Date.now();

  if (now - lastCleanup > CLEANUP_INTERVAL_MS) {
    cleanup();
    lastCleanup = now;
  }

  const hashed = fingerprint(key);
  const entry = store.get(hashed);

  if (!entry || now > entry.resetAt) {
    store.set(hashed, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_ATTEMPTS - 1 };
  }

  if (entry.count >= MAX_ATTEMPTS) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: MAX_ATTEMPTS - entry.count };
}

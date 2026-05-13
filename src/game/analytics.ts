import { hasCaptainPass } from "./monetization";
import type { ChapterId, PlayerState, Rarity } from "./types";

export type AnalyticsEventName =
  | "tutorial_started"
  | "first_catch"
  | "first_rare_catch"
  | "first_companion_equipped"
  | "first_trade_buy"
  | "first_trade_profit"
  | "captain_pass_viewed"
  | "parent_gate_viewed"
  | "purchase_started"
  | "purchase_completed"
  | "purchase_cancelled"
  | "restore_completed"
  | "day_1_return";

export type AnalyticsPayload = Partial<{
  areaId: string;
  chapterId: ChapterId;
  fishId: string;
  hasCaptainPass: boolean;
  level: number;
  mode: string;
  outcome: string;
  portId: string;
  productId: string;
  rarity: Rarity;
  scene: string;
  slotCount: number;
  value: number;
}>;

export type AnalyticsEvent = {
  id: string;
  name: AnalyticsEventName;
  createdAt: string;
  payload: AnalyticsPayload;
};

const ANALYTICS_QUEUE_KEY = "banjjakbada-analytics-v1";
const ANALYTICS_ONCE_KEY = "banjjakbada-analytics-once-v1";
const ANALYTICS_FIRST_SEEN_KEY = "banjjakbada-analytics-first-seen";
const ANALYTICS_DAY_ONE_KEY = "banjjakbada-analytics-day-one-sent";
const MAX_QUEUE_SIZE = 250;
const forbiddenKeys = new Set([
  "aaid",
  "advertisingId",
  "androidId",
  "deviceId",
  "email",
  "imei",
  "location",
  "phone",
  "token",
]);
const memoryStorage = new Map<string, string>();

export function trackEvent(name: AnalyticsEventName, state?: PlayerState, payload: AnalyticsPayload = {}): AnalyticsEvent {
  const event: AnalyticsEvent = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    name,
    createdAt: new Date().toISOString(),
    payload: sanitizeAnalyticsPayload({
      level: state?.level,
      hasCaptainPass: state ? hasCaptainPass(state) : undefined,
      ...payload,
    }),
  };
  const queue = [...readAnalyticsQueue(), event].slice(-MAX_QUEUE_SIZE);
  writeItem(ANALYTICS_QUEUE_KEY, JSON.stringify(queue));
  return event;
}

export function trackEventOnce(key: string, name: AnalyticsEventName, state?: PlayerState, payload: AnalyticsPayload = {}): AnalyticsEvent | undefined {
  const seen = readStringSet(ANALYTICS_ONCE_KEY);
  if (seen.has(key)) {
    return undefined;
  }

  seen.add(key);
  writeItem(ANALYTICS_ONCE_KEY, JSON.stringify([...seen]));
  return trackEvent(name, state, payload);
}

export function trackDayOneReturn(state: PlayerState): void {
  const firstSeen = readItem(ANALYTICS_FIRST_SEEN_KEY);
  const now = Date.now();
  if (!firstSeen) {
    writeItem(ANALYTICS_FIRST_SEEN_KEY, String(now));
    return;
  }
  if (readItem(ANALYTICS_DAY_ONE_KEY)) {
    return;
  }
  const firstSeenAt = Number(firstSeen);
  if (Number.isFinite(firstSeenAt) && now - firstSeenAt >= 24 * 60 * 60 * 1000) {
    trackEvent("day_1_return", state, { scene: "Harbor" });
    writeItem(ANALYTICS_DAY_ONE_KEY, "true");
  }
}

export function readAnalyticsQueue(): AnalyticsEvent[] {
  const raw = readItem(ANALYTICS_QUEUE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as AnalyticsEvent[];
    return Array.isArray(parsed) ? parsed.filter((event) => event && typeof event.name === "string") : [];
  } catch {
    return [];
  }
}

export function clearAnalyticsQueue(): void {
  writeItem(ANALYTICS_QUEUE_KEY, JSON.stringify([]));
}

export function analyticsPayloadContainsForbiddenFields(payload: Record<string, unknown>): boolean {
  return Object.keys(payload).some((key) => forbiddenKeys.has(key));
}

export function sanitizeAnalyticsPayload(payload: Record<string, unknown>): AnalyticsPayload {
  const safe: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (forbiddenKeys.has(key) || value === undefined || value === null) {
      continue;
    }
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      safe[key] = value;
    }
  }
  return safe as AnalyticsPayload;
}

function readStringSet(key: string): Set<string> {
  const raw = readItem(key);
  if (!raw) {
    return new Set();
  }
  try {
    const parsed = JSON.parse(raw) as string[];
    return new Set(Array.isArray(parsed) ? parsed.filter((value): value is string => typeof value === "string") : []);
  } catch {
    return new Set();
  }
}

function readItem(key: string): string | null {
  try {
    if (typeof localStorage !== "undefined") {
      return localStorage.getItem(key);
    }
  } catch {
    // Analytics must never block gameplay.
  }
  return memoryStorage.get(key) ?? null;
}

function writeItem(key: string, value: string): void {
  memoryStorage.set(key, value);
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(key, value);
    }
  } catch {
    // The memory queue keeps the current session measurable even if storage is blocked.
  }
}

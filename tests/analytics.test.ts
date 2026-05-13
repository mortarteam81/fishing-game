import { afterEach, describe, expect, it } from "vitest";
import {
  analyticsPayloadContainsForbiddenFields,
  clearAnalyticsQueue,
  readAnalyticsQueue,
  sanitizeAnalyticsPayload,
  trackEvent,
  trackEventOnce,
} from "../src/game/analytics";
import { createInitialState } from "../src/game/storage";

function installLocalStorage() {
  const store = new Map<string, string>();
  Object.defineProperty(globalThis, "localStorage", {
    configurable: true,
    value: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => store.set(key, value),
      removeItem: (key: string) => store.delete(key),
      clear: () => store.clear(),
    },
  });
}

describe("anonymous analytics", () => {
  afterEach(() => {
    clearAnalyticsQueue();
    Reflect.deleteProperty(globalThis, "localStorage");
  });

  it("stores only allowed anonymous gameplay payload fields", () => {
    installLocalStorage();
    const payload = sanitizeAnalyticsPayload({
      scene: "CaptainPass",
      level: 9,
      productId: "captain_pass_full",
      email: "child@example.com",
      imei: "not-allowed",
      nested: { unsafe: true },
    });

    expect(payload).toEqual({
      scene: "CaptainPass",
      level: 9,
      productId: "captain_pass_full",
    });
    expect(analyticsPayloadContainsForbiddenFields(payload)).toBe(false);
  });

  it("queues events and de-duplicates once-only events", () => {
    installLocalStorage();
    const state = { ...createInitialState(), level: 11 };

    trackEvent("captain_pass_viewed", state, { scene: "CaptainPass" });
    trackEventOnce("first_trade_buy", "first_trade_buy", state, { portId: "sunrise-port" });
    trackEventOnce("first_trade_buy", "first_trade_buy", state, { portId: "sunrise-port" });

    const queue = readAnalyticsQueue();
    expect(queue).toHaveLength(2);
    expect(queue[0].payload).toMatchObject({ level: 11, hasCaptainPass: false });
    expect(queue[1].name).toBe("first_trade_buy");
  });
});

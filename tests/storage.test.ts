import { afterEach, describe, expect, it } from "vitest";
import { createInitialState, getSaveSlots, loadGame, loadGameFromSlot, saveGame, saveGameToSlot } from "../src/game/storage";

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

function installDocumentCookie() {
  const cookieJar = new Map<string, string>();
  Object.defineProperty(globalThis, "document", {
    configurable: true,
    value: {
      get cookie() {
        return Array.from(cookieJar.entries())
          .map(([key, value]) => `${key}=${value}`)
          .join("; ");
      },
      set cookie(value: string) {
        const [cookiePair, ...attributes] = value.split(";");
        const [key, rawValue = ""] = cookiePair.split("=");
        if (attributes.some((attribute) => attribute.trim().toLowerCase() === "max-age=0")) {
          cookieJar.delete(key.trim());
          return;
        }
        cookieJar.set(key.trim(), rawValue);
      },
    },
  });
}

function setLegacyCookieBackup(key: string, value: unknown) {
  const encoded = encodeURIComponent(encodePayload(JSON.stringify(value)));
  document.cookie = `${key}-backup-0=${encoded}; Path=/; SameSite=Lax`;
}

function encodePayload(value: string): string {
  const bytes = new TextEncoder().encode(value);
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
  return btoa(binary);
}

describe("save slots", () => {
  afterEach(() => {
    Reflect.deleteProperty(globalThis, "localStorage");
    Reflect.deleteProperty(globalThis, "document");
  });

  it("saves and loads a named captain profile", () => {
    installLocalStorage();
    const state = {
      ...createInitialState(),
      level: 8,
      shells: 432,
      captain: {
        ...createInitialState().captain,
        name: "하린",
        presetId: "coral-ranger",
      },
    };

    saveGameToSlot(2, state);

    const slots = getSaveSlots();
    expect(slots[1]).toMatchObject({
      slotId: 2,
      empty: false,
      captainName: "하린",
      level: 8,
      shells: 432,
    });
    expect(loadGameFromSlot(2)?.captain.presetId).toBe("coral-ranger");
  });

  it("does not let an older slot overwrite higher current progress", () => {
    installLocalStorage();
    const current = {
      ...createInitialState(),
      level: 30,
      xp: 12,
      shells: 2200,
      collection: { "sunny-minnow": 20 },
    };
    const oldSlot = {
      ...createInitialState(),
      level: 7,
      shells: 600,
      collection: { "sunny-minnow": 4 },
    };

    saveGame(current);
    saveGameToSlot(1, oldSlot);

    const loaded = loadGameFromSlot(1);
    expect(loaded?.level).toBe(30);
    expect(loaded?.shells).toBe(2200);
  });

  it("migrates a higher legacy cookie backup before clearing it", () => {
    installLocalStorage();
    installDocumentCookie();

    const current = {
      ...createInitialState(),
      level: 7,
      shells: 600,
      collection: { "sunny-minnow": 4 },
    };
    const legacy = {
      ...createInitialState(),
      saveVersion: 3,
      level: 30,
      shells: 2200,
      collection: { "sunny-minnow": 30 },
    };

    saveGame(current);
    setLegacyCookieBackup("banjjakbada-save-v1", legacy);

    const loaded = loadGame();

    expect(loaded.level).toBe(30);
    expect(loaded.shells).toBe(2200);
    expect(JSON.parse(localStorage.getItem("banjjakbada-save-v1") ?? "{}").level).toBe(30);
    expect(document.cookie).not.toContain("banjjakbada-save-v1-backup-0");
  });

  it("unlocks level-gated late areas when an older level 51 save is normalized", () => {
    installLocalStorage();
    saveGame({
      ...createInitialState(),
      level: 51,
      unlockedAreaIds: ["sunny-beach"],
    });

    const loaded = loadGame();

    expect(loaded.unlockedAreaIds).toContain("starlit-offshore");
    expect(loaded.unlockedAreaIds).not.toContain("glass-trench");
  });

  it("hydrates research fields from an older numeric collection save", () => {
    installLocalStorage();
    localStorage.setItem(
      "banjjakbada-save-v1",
      JSON.stringify({
        ...createInitialState(),
        saveVersion: 3,
        collection: { "sunny-minnow": 4 },
      }),
    );

    const loaded = loadGame();

    expect(loaded.saveVersion).toBe(6);
    expect(loaded.collection["sunny-minnow"]).toBe(4);
    expect(typeof loaded.collection["sunny-minnow"]).toBe("number");
    expect(loaded.researchProgress["sunny-minnow"].catches).toBe(4);
    expect(loaded.researchProgress["sunny-minnow"].points).toBeGreaterThan(0);
    expect(loaded.variantCollection).toEqual({});
    expect(loaded.companions).toContain("rainbow-whale");
    expect(loaded.companions).toContain("sunny-minnow");
    expect(loaded.equippedCompanionIds).toEqual(["rainbow-whale"]);
    expect(loaded.affinity["rainbow-whale"]).toBeGreaterThan(0);
    expect(loaded.affinity["sunny-minnow"]).toBeGreaterThan(0);
    expect(loaded.discoveredAreaIds).toEqual([]);
  });

  it("round-trips variants through main save and save slots", () => {
    installLocalStorage();
    const state = {
      ...createInitialState(),
      collection: { "sunny-minnow": 3 },
      researchProgress: { "sunny-minnow": { catches: 3, points: 12, bestQuality: "great" as const } },
      variantCollection: { "sunny-minnow": { gleaming: 1, aurora: 1 } },
    };

    saveGame(state);
    const loaded = loadGame();

    expect(loaded.collection["sunny-minnow"]).toBe(3);
    expect(typeof loaded.collection["sunny-minnow"]).toBe("number");
    expect(loaded.variantCollection["sunny-minnow"].gleaming).toBe(1);
    expect(loaded.variantCollection["sunny-minnow"].aurora).toBe(1);

    saveGameToSlot(1, state);
    const slots = getSaveSlots();
    expect(slots[0].collectionCount).toBe(1);
    expect(loadGameFromSlot(1)?.variantCollection["sunny-minnow"].aurora).toBe(1);
  });
});

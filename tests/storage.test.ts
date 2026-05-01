import { afterEach, describe, expect, it } from "vitest";
import { createInitialState, getSaveSlots, loadGameFromSlot, saveGameToSlot } from "../src/game/storage";

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

describe("save slots", () => {
  afterEach(() => {
    Reflect.deleteProperty(globalThis, "localStorage");
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
});

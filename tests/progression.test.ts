import { describe, expect, it } from "vitest";
import { buyItem, claimQuest, recordCatch, refreshQuestCompletion } from "../src/game/progression";
import { createInitialState } from "../src/game/storage";

describe("progression", () => {
  it("records catches into collection and rewards shells", () => {
    const state = recordCatch(createInitialState(), "sunny-minnow", 10, 10);

    expect(state.collection["sunny-minnow"]).toBe(1);
    expect(state.shells).toBe(45);
  });

  it("unlocks the first quest reward after any catch", () => {
    const caught = recordCatch(createInitialState(), "sunny-minnow", 10, 10);
    const refreshed = refreshQuestCompletion(caught);
    const claimed = claimQuest(refreshed, "first-friend");

    expect(refreshed.questProgress["first-friend"].completed).toBe(true);
    expect(claimed.questProgress["first-friend"].claimed).toBe(true);
    expect(claimed.shells).toBeGreaterThan(refreshed.shells);
  });

  it("buys and equips rods when enough shells are available", () => {
    const state = { ...createInitialState(), shells: 100 };
    const next = buyItem(state, "sparkle-rod");

    expect(next.ownedItemIds).toContain("sparkle-rod");
    expect(next.equippedRodId).toBe("sparkle-rod");
    expect(next.shells).toBe(30);
  });
});

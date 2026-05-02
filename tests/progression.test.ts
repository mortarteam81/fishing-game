import { describe, expect, it } from "vitest";
import {
  applyStoryChoice,
  buyItem,
  claimQuest,
  canDiscoverArea,
  discoverArea,
  getAvailableStoryChoices,
  getBoatSpeed,
  getEquippedGearBuild,
  getLureSpeed,
  getMutationChance,
  getRareBoost,
  getVisibleQuests,
  recordCatch,
  refreshQuestCompletion,
  stepProgress,
  unlockAreasForLevel,
} from "../src/game/progression";
import { getArea } from "../src/game/content";
import { createInitialState } from "../src/game/storage";

describe("progression", () => {
  it("records catches into collection and rewards shells", () => {
    const state = recordCatch(createInitialState(), "sunny-minnow", 10, 10);

    expect(state.collection["sunny-minnow"]).toBe(1);
    expect(state.shells).toBe(45);
    expect(state.researchProgress["sunny-minnow"].catches).toBe(1);
    expect(state.researchProgress["sunny-minnow"].points).toBeGreaterThan(0);
  });

  it("records catch mutations without changing the numeric collection model", () => {
    const state = recordCatch(createInitialState(), "sunny-minnow", 10, 10, {
      areaId: "sunny-beach",
      mutationId: "gleaming",
      quality: "sparkle",
    });

    expect(state.collection["sunny-minnow"]).toBe(1);
    expect(typeof state.collection["sunny-minnow"]).toBe("number");
    expect(state.variantCollection["sunny-minnow"].gleaming).toBe(1);
    expect(state.researchProgress["sunny-minnow"].bestQuality).toBe("sparkle");
    expect(state.researchProgress["sunny-minnow"].lastAreaId).toBe("sunny-beach");
  });

  it("keeps variant-only records out of basic collection quest counts", () => {
    const state = {
      ...createInitialState(),
      variantCollection: { "sunny-minnow": { gleaming: 1 } },
    };

    expect(stepProgress(state, { kind: "collectUnique", count: 1 })).toBe(0);
    expect(stepProgress(state, { kind: "collectVariants", count: 1 })).toBe(1);
  });

  it("keeps hidden routes out of automatic level unlocks until discovered", () => {
    const leveled = unlockAreasForLevel({ ...createInitialState(), level: 60 });

    expect(leveled.unlockedAreaIds).not.toContain("fog-whale-route");

    const hiddenArea = getArea("fog-whale-route");
    expect(hiddenArea).toBeTruthy();
    expect(canDiscoverArea(leveled, hiddenArea!)).toBe(true);

    const discovered = discoverArea(leveled, "fog-whale-route");
    expect(discovered.discoveredAreaIds).toContain("fog-whale-route");
    expect(discovered.unlockedAreaIds).toContain("fog-whale-route");
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

  it("opens one branching route after the first quest is claimed", () => {
    const caught = recordCatch(createInitialState(), "sunny-minnow", 10, 10);
    const refreshed = refreshQuestCompletion(caught);
    const claimed = claimQuest(refreshed, "first-friend");

    expect(getAvailableStoryChoices(claimed)).toHaveLength(1);
    expect(getVisibleQuests(claimed).map((quest) => quest.id)).not.toContain("coral-nursery");

    const routed = applyStoryChoice(claimed, "first-voyage-route", "coral-route");

    expect(routed.storyFlags["route-coral"]).toBe(true);
    expect(routed.choiceHistory["first-voyage-route"]).toBe("coral-route");
    expect(routed.ownedItemIds).toContain("coral-pennant");
    expect(routed.equippedBoatCosmeticId).toBe("coral-pennant");
    expect(getVisibleQuests(routed).map((quest) => quest.id)).toContain("coral-nursery");
    expect(getVisibleQuests(routed).map((quest) => quest.id)).not.toContain("shipwright-ledger");
  });

  it("buys and equips boat cosmetics", () => {
    const state = { ...createInitialState(), shells: 100 };
    const next = buyItem(state, "star-flag");

    expect(next.ownedItemIds).toContain("star-flag");
    expect(next.equippedBoatCosmeticId).toBe("star-flag");
    expect(next.shells).toBe(40);
  });

  it("buys and equips stronger boats with gameplay effects", () => {
    const state = { ...createInitialState(), shells: 600 };
    const next = buyItem(state, "aurora-cutter");

    expect(next.ownedItemIds).toContain("aurora-cutter");
    expect(next.equippedBoatId).toBe("aurora-cutter");
    expect(getBoatSpeed(next)).toBeGreaterThan(0);
    expect(getLureSpeed(next)).toBeGreaterThan(0);
    expect(getMutationChance(next)).toBeGreaterThan(0);
  });

  it("creates role-based build synergy from equipped gear", () => {
    const state = {
      ...createInitialState(),
      equippedRodId: "aurora-crown-rod",
      equippedBoatId: "aurora-regalia",
      equippedBaitId: "aurora-pearl-bait",
      equippedBoatCosmeticId: "aurora-crown-flag",
      ownedItemIds: [
        ...createInitialState().ownedItemIds,
        "aurora-crown-rod",
        "aurora-regalia",
        "aurora-pearl-bait",
        "aurora-crown-flag",
      ],
    };

    const build = getEquippedGearBuild(state);

    expect(build.primaryRole).toBe("mutationHunter");
    expect(build.synergyLevel).toBeGreaterThan(0);
    expect(getMutationChance(state)).toBeGreaterThan(0.15);
    expect(getRareBoost(state)).toBeGreaterThan(0.2);
  });
});

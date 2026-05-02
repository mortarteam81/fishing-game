import { describe, expect, it } from "vitest";
import { areas, fish, items, quests, storyChoices } from "../src/game/content";
import { weatherDefinitions } from "../src/game/weather";

describe("content data", () => {
  it("keeps catchable sea creatures wired to valid areas", () => {
    const fishIds = new Set(fish.map((entry) => entry.id));
    const areaIds = new Set(areas.map((entry) => entry.id));

    expect(fish).toHaveLength(129);
    expect(areas).toHaveLength(21);
    expect(fishIds.size).toBe(fish.length);

    for (const area of areas) {
      expect(area.fishIds.length).toBeGreaterThan(0);
      if (area.hidden) {
        expect(area.route?.discoveryLevel).toBeGreaterThan(0);
        expect(area.route?.discoveryHint).toBeTruthy();
        expect(area.route?.revealText).toBeTruthy();
      }
      for (const weatherId of area.weatherPool ?? []) {
        expect(weatherDefinitions[weatherId]).toBeTruthy();
      }
      for (const fishId of area.fishIds) {
        expect(fishIds.has(fishId)).toBe(true);
      }
    }

    for (const entry of fish) {
      expect(entry.family).toBeTruthy();
      expect(entry.habitatTags.length).toBeGreaterThan(0);
      expect(entry.behaviorTags.length).toBeGreaterThan(0);
      expect(entry.areaIds.length).toBeGreaterThan(0);
      for (const areaId of entry.areaIds) {
        expect(areaIds.has(areaId)).toBe(true);
        expect(areas.find((area) => area.id === areaId)?.fishIds).toContain(entry.id);
      }
    }
  });

  it("keeps quests, choices, and rewards wired to valid content", () => {
    const fishIds = new Set(fish.map((entry) => entry.id));
    const areaIds = new Set(areas.map((entry) => entry.id));
    const itemIds = new Set(items.map((entry) => entry.id));
    const questIds = new Set(quests.map((entry) => entry.id));

    expect(itemIds.size).toBe(items.length);
    expect(items.filter((item) => item.kind === "rod")).toHaveLength(45);
    expect(items.filter((item) => item.kind === "boat")).toHaveLength(39);
    expect(items.filter((item) => item.kind === "bait")).toHaveLength(42);
    expect(items.filter((item) => item.kind === "boatCosmetic")).toHaveLength(43);
    expect(quests).toHaveLength(10);
    expect(questIds.size).toBe(quests.length);

    for (const quest of quests) {
      if (quest.rewards.itemId) {
        expect(itemIds.has(quest.rewards.itemId)).toBe(true);
      }

      for (const requirement of quest.requirements ?? []) {
        if (requirement.kind === "questClaimed") {
          expect(questIds.has(requirement.questId)).toBe(true);
        }
      }

      for (const areaId of quest.effects?.unlockAreaIds ?? []) {
        expect(areaIds.has(areaId)).toBe(true);
      }

      for (const step of quest.steps) {
        if (step.kind === "catchFish") {
          expect(fishIds.has(step.fishId)).toBe(true);
        }
        if (step.kind === "ownItem") {
          expect(itemIds.has(step.itemId)).toBe(true);
        }
        if (step.kind === "unlockArea") {
          expect(areaIds.has(step.areaId)).toBe(true);
        }
        if (step.kind === "researchRank") {
          expect(fishIds.has(step.fishId)).toBe(true);
          expect(step.rank).toBeGreaterThan(0);
        }
      }
    }

    for (const choice of storyChoices) {
      for (const requirement of choice.requirements) {
        if (requirement.kind === "questClaimed") {
          expect(questIds.has(requirement.questId)).toBe(true);
        }
      }
      for (const option of choice.options) {
        if (option.rewards?.itemId) {
          expect(itemIds.has(option.rewards.itemId)).toBe(true);
        }
      }
    }
  });
});

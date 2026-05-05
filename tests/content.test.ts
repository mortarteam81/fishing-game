import { describe, expect, it } from "vitest";
import { areas, fish, items, quests, storyChoices } from "../src/game/content";
import { ports, tradeGoods, tradeQuests } from "../src/game/commerceContent";
import { gearRoleMeta } from "../src/game/gearRoles";
import { portVisuals } from "../src/game/portVisuals";
import { voyageEvents } from "../src/game/voyageEvents";
import { weatherDefinitions } from "../src/game/weather";

const outerMythicChapterId = "outer-mythic-frontier";
const outerMythicAreaIds = [
  "starfrost-maelstrom",
  "crimson-current-wall",
  "glass-crown-depths",
  "polar-aurora-dome",
  "first-sparkle-sea",
] as const;

describe("content data", () => {
  it("keeps catchable sea creatures wired to valid areas", () => {
    const fishIds = new Set(fish.map((entry) => entry.id));
    const areaIds = new Set(areas.map((entry) => entry.id));
    const eventIds = new Set(voyageEvents.map((event) => event.id));
    const portIds = new Set(ports.map((port) => port.id));
    const tradeGoodIds = new Set(tradeGoods.map((good) => good.id));

    expect(fish).toHaveLength(229);
    expect(areas).toHaveLength(36);
    expect(fishIds.size).toBe(fish.length);
    expect(areas.filter((area) => area.chapterId && area.chapterId !== outerMythicChapterId)).toHaveLength(10);
    expect(fish.filter((entry) => entry.chapterId && entry.chapterId !== outerMythicChapterId)).toHaveLength(50);
    expect(areas.filter((area) => area.chapterId === outerMythicChapterId)).toHaveLength(5);
    expect(fish.filter((entry) => entry.chapterId === outerMythicChapterId)).toHaveLength(50);

    for (const area of areas) {
      expect(area.fishIds.length).toBeGreaterThan(0);
      if (area.hidden) {
        expect(area.route?.discoveryLevel).toBeGreaterThan(0);
        expect(area.route?.discoveryHint).toBeTruthy();
        expect(area.route?.revealText).toBeTruthy();
      }
      for (const requirement of area.route?.requirements ?? []) {
        if (requirement.kind === "voyageEventCleared") {
          expect(eventIds.has(requirement.eventId)).toBe(true);
        }
        if (requirement.kind === "areaDiscovered") {
          expect(areaIds.has(requirement.areaId)).toBe(true);
        }
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

  it("adds a high-level outer mythic frontier with rare low-weight catches", () => {
    const outerAreas = areas.filter((area) => outerMythicAreaIds.includes(area.id as (typeof outerMythicAreaIds)[number]));
    const outerFish = fish.filter((entry) => entry.chapterId === outerMythicChapterId);
    const outerAreaIdSet = new Set(outerMythicAreaIds);
    const rarityCounts = outerFish.reduce<Record<string, number>>((counts, entry) => {
      counts[entry.rarity] = (counts[entry.rarity] ?? 0) + 1;
      return counts;
    }, {});

    expect(outerAreas.map((area) => area.requiredLevel)).toEqual([182, 194, 206, 218, 232]);
    expect(outerAreas.every((area) => area.hidden && area.route?.discoveryLevel === area.requiredLevel)).toBe(true);
    expect(outerAreas.every((area) => area.fishIds.length === 10)).toBe(true);
    expect(outerFish).toHaveLength(50);
    expect(rarityCounts).toMatchObject({ mythic: 20, legendary: 20, ancient: 10 });

    for (const entry of outerFish) {
      expect(entry.areaIds).toHaveLength(1);
      expect(outerAreaIdSet.has(entry.areaIds[0] as (typeof outerMythicAreaIds)[number])).toBe(true);
      expect(entry.spawnWeight).toBeGreaterThanOrEqual(1);
      expect(entry.spawnWeight).toBeLessThanOrEqual(entry.rarity === "mythic" ? 4 : entry.rarity === "legendary" ? 2 : 1);
      expect(["mythic", "legendary", "ancient"]).toContain(entry.rarity);
      expect(entry.habitatTags).toEqual(expect.arrayContaining(["legend"]));
      expect(entry.chapterId).toBe(outerMythicChapterId);
    }
  });

  it("keeps quests, choices, and rewards wired to valid content", () => {
    const fishIds = new Set(fish.map((entry) => entry.id));
    const areaIds = new Set(areas.map((entry) => entry.id));
    const itemIds = new Set(items.map((entry) => entry.id));
    const questIds = new Set(quests.map((entry) => entry.id));
    const eventIds = new Set(voyageEvents.map((event) => event.id));
    const portIds = new Set(ports.map((port) => port.id));
    const tradeGoodIds = new Set(tradeGoods.map((good) => good.id));

    expect(itemIds.size).toBe(items.length);
    expect(items.filter((item) => item.kind === "rod")).toHaveLength(75);
    expect(items.filter((item) => item.kind === "boat")).toHaveLength(69);
    expect(items.filter((item) => item.kind === "bait")).toHaveLength(72);
    expect(items.filter((item) => item.kind === "boatCosmetic")).toHaveLength(73);
    expect(items.filter((item) => item.chapterId && item.kind === "rod")).toHaveLength(30);
    expect(items.filter((item) => item.chapterId && item.kind === "boat")).toHaveLength(30);
    expect(items.filter((item) => item.chapterId && item.kind === "bait")).toHaveLength(30);
    expect(items.filter((item) => item.chapterId && item.kind === "boatCosmetic")).toHaveLength(30);
    for (const item of items) {
      expect(item.roleTags?.length).toBeGreaterThan(0);
      for (const role of item.roleTags ?? []) {
        expect(gearRoleMeta[role]).toBeTruthy();
      }
      if (item.chapterId) {
        expect(item.effect).toBeTruthy();
        expect(item.setId).toBeTruthy();
      }
    }
    expect(ports).toHaveLength(10);
    expect(tradeGoods).toHaveLength(60);
    expect(tradeQuests).toHaveLength(24);
    expect(portIds.size).toBe(ports.length);
    expect(tradeGoodIds.size).toBe(tradeGoods.length);
    expect(quests).toHaveLength(39);
    expect(questIds.size).toBe(quests.length);

    for (const port of ports) {
      expect(portVisuals[port.id]).toBeTruthy();
      expect(port.specialtyGoodIds.length).toBeGreaterThan(0);
      expect(port.connectedAreaIds.length).toBeGreaterThan(0);
      for (const goodId of [...port.specialtyGoodIds, ...port.demandGoodIds]) {
        expect(tradeGoodIds.has(goodId)).toBe(true);
      }
      for (const areaId of port.connectedAreaIds) {
        expect(areaIds.has(areaId)).toBe(true);
      }
    }

    expect(new Set(Object.values(portVisuals).map((visual) => visual.interiorTextureKey)).size).toBe(ports.length);
    expect(new Set(Object.values(portVisuals).map((visual) => visual.markerTextureKey)).size).toBe(ports.length);

    for (const good of tradeGoods) {
      expect(portIds.has(good.originPortId)).toBe(true);
      expect(good.basePrice).toBeGreaterThan(0);
      expect(good.volume).toBeGreaterThan(0);
      for (const portId of good.demandPortIds) {
        expect(portIds.has(portId)).toBe(true);
      }
    }

    for (const quest of quests) {
      if (quest.rewards.itemId) {
        expect(itemIds.has(quest.rewards.itemId)).toBe(true);
      }

      for (const requirement of quest.requirements ?? []) {
        if (requirement.kind === "questClaimed") {
          expect(questIds.has(requirement.questId)).toBe(true);
        }
        if (requirement.kind === "companionAffinity") {
          expect(fishIds.has(requirement.fishId)).toBe(true);
        }
        if (requirement.kind === "ownedItem") {
          expect(itemIds.has(requirement.itemId)).toBe(true);
        }
        if (requirement.kind === "areaDiscovered") {
          expect(areaIds.has(requirement.areaId)).toBe(true);
        }
        if (requirement.kind === "voyageEventCleared") {
          expect(eventIds.has(requirement.eventId)).toBe(true);
        }
        if (requirement.kind === "equippedGearRole") {
          expect(gearRoleMeta[requirement.role]).toBeTruthy();
        }
        if (requirement.kind === "portVisited" || requirement.kind === "portReputationAtLeast") {
          expect(portIds.has(requirement.portId)).toBe(true);
        }
        if (requirement.kind === "completeTradeRoute") {
          expect(portIds.has(requirement.fromPortId)).toBe(true);
          expect(portIds.has(requirement.toPortId)).toBe(true);
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
        if (step.kind === "clearVoyageEvent") {
          expect(eventIds.has(step.eventId)).toBe(true);
        }
        if (step.kind === "raiseCompanionAffinity") {
          expect(fishIds.has(step.fishId)).toBe(true);
        }
        if (step.kind === "discoverArea") {
          expect(areaIds.has(step.areaId)).toBe(true);
        }
        if (step.kind === "portVisited" || step.kind === "portReputationAtLeast") {
          expect(portIds.has(step.portId)).toBe(true);
        }
        if (step.kind === "deliverTradeGood" || step.kind === "sellTradeGood") {
          expect(tradeGoodIds.has(step.goodId)).toBe(true);
          expect(portIds.has(step.portId)).toBe(true);
        }
        if (step.kind === "completeTradeRoute") {
          expect(portIds.has(step.fromPortId)).toBe(true);
          expect(portIds.has(step.toPortId)).toBe(true);
        }
      }
    }

    for (const choice of storyChoices) {
      for (const requirement of choice.requirements) {
        if (requirement.kind === "questClaimed") {
          expect(questIds.has(requirement.questId)).toBe(true);
        }
        if (requirement.kind === "voyageEventCleared") {
          expect(eventIds.has(requirement.eventId)).toBe(true);
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

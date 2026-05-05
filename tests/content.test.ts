import { describe, expect, it } from "vitest";
import { areas, fish, items, quests, storyChoices } from "../src/game/content";
import { ports, tradeGoods, tradeQuests } from "../src/game/commerceContent";
import { gearRoleMeta } from "../src/game/gearRoles";
import { voyageEvents } from "../src/game/voyageEvents";
import { weatherDefinitions } from "../src/game/weather";

describe("content data", () => {
  it("keeps catchable sea creatures wired to valid areas", () => {
    const fishIds = new Set(fish.map((entry) => entry.id));
    const areaIds = new Set(areas.map((entry) => entry.id));
    const eventIds = new Set(voyageEvents.map((event) => event.id));
    const portIds = new Set(ports.map((port) => port.id));
    const tradeGoodIds = new Set(tradeGoods.map((good) => good.id));

    expect(fish).toHaveLength(179);
    expect(areas).toHaveLength(31);
    expect(fishIds.size).toBe(fish.length);
    expect(areas.filter((area) => area.chapterId)).toHaveLength(10);
    expect(fish.filter((entry) => entry.chapterId)).toHaveLength(50);

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
      expect(port.specialtyGoodIds.length).toBeGreaterThan(0);
      expect(port.connectedAreaIds.length).toBeGreaterThan(0);
      for (const goodId of [...port.specialtyGoodIds, ...port.demandGoodIds]) {
        expect(tradeGoodIds.has(goodId)).toBe(true);
      }
      for (const areaId of port.connectedAreaIds) {
        expect(areaIds.has(areaId)).toBe(true);
      }
    }

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

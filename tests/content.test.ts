import { describe, expect, it } from "vitest";
import { areas, fish } from "../src/game/content";

describe("content data", () => {
  it("keeps catchable sea creatures wired to valid areas", () => {
    const fishIds = new Set(fish.map((entry) => entry.id));
    const areaIds = new Set(areas.map((entry) => entry.id));

    expect(fish).toHaveLength(19);
    expect(fishIds.size).toBe(fish.length);

    for (const area of areas) {
      expect(area.fishIds.length).toBeGreaterThan(0);
      for (const fishId of area.fishIds) {
        expect(fishIds.has(fishId)).toBe(true);
      }
    }

    for (const entry of fish) {
      expect(entry.areaIds.length).toBeGreaterThan(0);
      for (const areaId of entry.areaIds) {
        expect(areaIds.has(areaId)).toBe(true);
        expect(areas.find((area) => area.id === areaId)?.fishIds).toContain(entry.id);
      }
    }
  });
});

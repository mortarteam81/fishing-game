import { describe, expect, it } from "vitest";
import { startFishing, resolveTiming } from "../src/game/fishing";
import { getFish } from "../src/game/content";
import { createInitialState } from "../src/game/storage";
import type { FishingAttempt } from "../src/game/types";

describe("fishing loop", () => {
  it("creates a fishing attempt for the selected area", () => {
    const attempt = startFishing("sunny-beach", createInitialState(), () => 0.1);

    expect(attempt.areaId).toBe("sunny-beach");
    expect(attempt.fish.areaIds).toContain("sunny-beach");
    expect(attempt.targetWidth).toBeGreaterThan(0);
  });

  it("rewards a successful center timing", () => {
    const state = createInitialState();
    const attempt = startFishing("sunny-beach", state, () => 0.1);
    const result = resolveTiming(attempt, attempt.targetCenter, state, () => 1);

    expect(result.success).toBe(true);
    expect(result.quality).toBe("sparkle");
    expect(result.shells).toBeGreaterThan(0);
    expect(result.xp).toBeGreaterThan(0);
  });

  it("gives consolation reward when timing misses", () => {
    const state = createInitialState();
    const attempt = startFishing("sunny-beach", state, () => 0.1);
    const result = resolveTiming(attempt, 0, state);

    expect(result.success).toBe(false);
    expect(result.shells).toBeGreaterThan(0);
    expect(result.consolation).toBeTruthy();
  });

  it("can roll a valuable catch mutation on a strong catch", () => {
    const state = { ...createInitialState(), storyFlags: { "coral-guardian": true } };
    const attempt = startFishing("sunny-beach", state, () => 0.1);
    const rolls = [0, 0.95];
    const result = resolveTiming(attempt, attempt.targetCenter, state, () => rolls.shift() ?? 1);

    expect(result.success).toBe(true);
    expect(result.mutation?.id).toBe("aurora");
    expect(result.shells).toBeGreaterThan(attempt.fish.baseShells);
  });

  it("pays out a larger reward for the new ancient rarity tier", () => {
    const state = createInitialState();
    const ancientFriend = getFish("aurora-crown-mythic-nudibranch");
    expect(ancientFriend?.rarity).toBe("ancient");

    const attempt: FishingAttempt = {
      areaId: "aurora-crown",
      fish: ancientFriend!,
      biteDelayMs: 500,
      targetCenter: 0.5,
      targetWidth: 0.3,
    };
    const result = resolveTiming(attempt, attempt.targetCenter, state, () => 1);

    expect(result.success).toBe(true);
    expect(result.shells).toBeGreaterThan(ancientFriend!.baseShells * 2);
  });
});

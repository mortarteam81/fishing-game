import { areas, fish } from "./content";
import { getRareBoost, getRodEase } from "./progression";
import type { CatchQuality, CatchResult, FishDefinition, FishingAttempt, PlayerState } from "./types";

const rarityMultiplier: Record<FishDefinition["rarity"], number> = {
  common: 1,
  uncommon: 1.15,
  rare: 1.35,
  special: 1.7,
};

export function startFishing(areaId: string, state: PlayerState, random = Math.random): FishingAttempt {
  const area = areas.find((entry) => entry.id === areaId) ?? areas[0];
  const rareBoost = getRareBoost(state);
  const candidates = fish.filter((entry) => area.fishIds.includes(entry.id));
  const weighted = candidates.map((entry) => {
    const boost =
      entry.rarity === "rare" || entry.rarity === "special" ? 1 + rareBoost : 1;
    return {
      fish: entry,
      weight: entry.spawnWeight * boost,
    };
  });
  const total = weighted.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = random() * total;
  const chosen = weighted.find((entry) => {
    roll -= entry.weight;
    return roll <= 0;
  })?.fish ?? weighted[0].fish;

  return {
    areaId,
    fish: chosen,
    biteDelayMs: 750 + Math.floor(random() * 900),
    targetCenter: 0.5,
    targetWidth: Math.min(0.48, 0.24 + getRodEase(state)),
  };
}

export function resolveTiming(
  attempt: FishingAttempt,
  inputScore: number,
  state: PlayerState,
): CatchResult {
  const clamped = Math.max(0, Math.min(1, inputScore));
  const distance = Math.abs(clamped - attempt.targetCenter);
  const width = attempt.targetWidth;
  const success = distance <= width / 2;

  if (!success) {
    return {
      success: false,
      quality: "miss",
      shells: 4,
      xp: 4,
      message: "조금 아쉬워요. 그래도 반짝 조개를 찾았어요!",
      consolation: "해초 스티커",
    };
  }

  const quality = qualityFromDistance(distance, width);
  const multiplier = quality === "sparkle" ? 1.7 : quality === "great" ? 1.35 : 1;
  const rarity = rarityMultiplier[attempt.fish.rarity];

  return {
    success: true,
    quality,
    fish: attempt.fish,
    shells: Math.round(attempt.fish.baseShells * multiplier * rarity),
    xp: Math.round(attempt.fish.xp * multiplier),
    message:
      quality === "sparkle"
        ? "반짝 타이밍! 특별한 만남이에요!"
        : quality === "great"
          ? "아주 좋아요! 바다 친구가 활짝 웃어요."
          : "좋아요! 새 친구를 만났어요.",
  };
}

function qualityFromDistance(distance: number, width: number): CatchQuality {
  const ratio = distance / (width / 2);
  if (ratio <= 0.22) {
    return "sparkle";
  }
  if (ratio <= 0.55) {
    return "great";
  }
  return "nice";
}

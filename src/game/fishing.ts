import { areas, fish } from "./content";
import { getLureSpeed, getMutationChance, getRareBoost, getRodEase } from "./progression";
import type {
  CatchMutation,
  CatchQuality,
  CatchResult,
  FishDefinition,
  FishingAttempt,
  PlayerState,
} from "./types";

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
    biteDelayMs: Math.max(360, Math.round((750 + Math.floor(random() * 900)) * (1 - getLureSpeed(state)))),
    targetCenter: 0.5,
    targetWidth: Math.min(0.54, 0.24 + getRodEase(state)),
  };
}

export function resolveTiming(
  attempt: FishingAttempt,
  inputScore: number,
  state: PlayerState,
  random = Math.random,
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
  const mutation = rollMutation(quality, attempt.fish, state, random);
  const mutationValue = mutation?.valueMultiplier ?? 1;
  const mutationXp = mutation?.xpMultiplier ?? 1;

  return {
    success: true,
    quality,
    fish: attempt.fish,
    mutation,
    shells: Math.round(attempt.fish.baseShells * multiplier * rarity * mutationValue),
    xp: Math.round(attempt.fish.xp * multiplier * mutationXp),
    message:
      mutation
        ? mutation.message
        : quality === "sparkle"
        ? "반짝 타이밍! 특별한 만남이에요!"
        : quality === "great"
          ? "아주 좋아요! 바다 친구가 활짝 웃어요."
          : "좋아요! 새 친구를 만났어요.",
  };
}

function rollMutation(
  quality: CatchQuality,
  fish: FishDefinition,
  state: PlayerState,
  random: () => number,
): CatchMutation | undefined {
  const qualityChance = quality === "sparkle" ? 0.24 : quality === "great" ? 0.13 : 0.06;
  const rarityChance = fish.rarity === "special" ? 0.08 : fish.rarity === "rare" ? 0.04 : 0;
  const branchChance = state.storyFlags["coral-guardian"] ? 0.04 : 0;
  const gearChance = getMutationChance(state);
  const chance = Math.min(0.56, qualityChance + rarityChance + getRareBoost(state) * 0.16 + branchChance + gearChance);

  if (random() > chance) {
    return undefined;
  }

  const roll = random();
  if (roll > 0.88 || (state.storyFlags["coral-guardian"] && roll > 0.76)) {
    return {
      id: "aurora",
      label: "오로라 변이",
      valueMultiplier: 2.4,
      xpMultiplier: 1.55,
      message: "오로라 빛이 번졌어요! 아주 값진 만남이에요.",
      tint: 0xb9c3ff,
    };
  }

  if (roll > 0.48) {
    return {
      id: "tidekissed",
      label: "물결입맞춤 변이",
      valueMultiplier: 1.75,
      xpMultiplier: 1.25,
      message: "물결입맞춤 무늬가 보여요! 도감에 남길 만한 순간이에요.",
      tint: 0x74d7cf,
    };
  }

  return {
    id: "gleaming",
    label: "윤슬 변이",
    valueMultiplier: 1.45,
    xpMultiplier: 1.15,
    message: "윤슬 변이를 만났어요! 햇빛처럼 반짝이는 친구예요.",
    tint: 0xf6cf62,
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

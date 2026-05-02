import { fish, getFish } from "./content";
import type { CatchQuality, FishDefinition, PlayerState } from "./types";

export const STARTER_COMPANION_ID = "rainbow-whale";
export const MAX_EQUIPPED_COMPANIONS = 3;
export const MAX_AFFINITY = 260;

const fishIds = new Set(fish.map((entry) => entry.id));

export type CompanionProfile = {
  fish: FishDefinition;
  affinity: number;
  mood: string;
  effectLabel: string;
};

export type CompanionAssist = {
  catchEase: number;
  lureSpeed: number;
  reelPower: number;
  rareBoost: number;
  mutationChance: number;
  affinityBoost: number;
};

export function normalizeCompanions(
  stored: readonly string[] | undefined,
  collection: Record<string, number>,
): string[] {
  return uniqueValidFishIds([
    STARTER_COMPANION_ID,
    ...(stored ?? []),
    ...Object.entries(collection)
      .filter(([, count]) => count > 0)
      .map(([fishId]) => fishId),
  ]);
}

export function normalizeEquippedCompanions(
  stored: readonly string[] | undefined,
  companions: readonly string[],
): string[] {
  const companionSet = new Set(companions);
  const equipped = uniqueValidFishIds(stored ?? []).filter((fishId) => companionSet.has(fishId));
  const fallback = companionSet.has(STARTER_COMPANION_ID) ? [STARTER_COMPANION_ID] : companions.slice(0, 1);
  return (equipped.length > 0 ? equipped : fallback).slice(0, MAX_EQUIPPED_COMPANIONS);
}

export function normalizeAffinity(
  stored: Record<string, number> | undefined,
  collection: Record<string, number>,
  companions: readonly string[],
): Record<string, number> {
  const normalized: Record<string, number> = {};
  for (const fishId of companions) {
    const countAffinity = Math.min(MAX_AFFINITY, Math.max(0, Math.floor(collection[fishId] ?? 0)) * 5);
    const starterAffinity = fishId === STARTER_COMPANION_ID ? 34 : 0;
    normalized[fishId] = clampAffinity(Math.max(stored?.[fishId] ?? 0, countAffinity, starterAffinity));
  }
  return normalized;
}

export function equipCompanion(state: PlayerState, fishId: string): PlayerState {
  if (!state.companions.includes(fishId) || !getFish(fishId)) {
    return state;
  }

  return {
    ...state,
    equippedCompanionIds: [fishId, ...state.equippedCompanionIds.filter((id) => id !== fishId)].slice(
      0,
      MAX_EQUIPPED_COMPANIONS,
    ),
    affinity: {
      ...state.affinity,
      [fishId]: clampAffinity(Math.max(state.affinity[fishId] ?? 0, fishId === STARTER_COMPANION_ID ? 34 : 1)),
    },
  };
}

export function applyCatchCompanionProgress(
  state: PlayerState,
  fishId: string,
  quality: CatchQuality | undefined,
): PlayerState {
  if (!getFish(fishId)) {
    return state;
  }

  const companions = state.companions.includes(fishId)
    ? state.companions
    : [...state.companions, fishId];
  const affinity = { ...state.affinity };
  const catchGain = quality === "sparkle" ? 16 : quality === "great" ? 12 : quality === "nice" ? 9 : 7;
  affinity[fishId] = clampAffinity((affinity[fishId] ?? 0) + catchGain);

  for (const companionId of state.equippedCompanionIds) {
    if (!companions.includes(companionId)) {
      continue;
    }
    affinity[companionId] = clampAffinity((affinity[companionId] ?? 0) + (companionId === fishId ? 3 : 4));
  }

  return {
    ...state,
    companions,
    equippedCompanionIds: normalizeEquippedCompanions(state.equippedCompanionIds, companions),
    affinity,
  };
}

export function rewardEquippedCompanionAffinity(state: PlayerState, gain: number): PlayerState {
  if (state.equippedCompanionIds.length === 0 || gain <= 0) {
    return state;
  }

  const affinity = { ...state.affinity };
  for (const companionId of state.equippedCompanionIds) {
    affinity[companionId] = clampAffinity((affinity[companionId] ?? 0) + gain);
  }
  return { ...state, affinity };
}

export function getEquippedCompanionProfiles(state: PlayerState): CompanionProfile[] {
  return state.equippedCompanionIds
    .map((fishId) => getFish(fishId))
    .filter((entry): entry is FishDefinition => Boolean(entry))
    .map((entry) => ({
      fish: entry,
      affinity: state.affinity[entry.id] ?? 0,
      mood: companionMoodLabel(state.affinity[entry.id] ?? 0),
      effectLabel: companionEffectLabel(entry),
    }));
}

export function getCompanionAssist(state: PlayerState): CompanionAssist {
  return getEquippedCompanionProfiles(state).reduce<CompanionAssist>(
    (assist, profile) => {
      const tier = companionAffinityTier(profile.affinity);
      const rarityScale = profile.fish.rarity === "legendary" || profile.fish.rarity === "ancient" ? 1.12 : 1;
      const glowBonus = profile.fish.behaviorTags.includes("glowing") ? 0.0025 * tier : 0;
      const steadyBonus = profile.fish.behaviorTags.includes("steady") ? 0.004 * tier : 0;

      assist.catchEase += 0.006 * tier + steadyBonus;
      assist.lureSpeed += profile.fish.behaviorTags.includes("swift") ? 0.006 * tier : 0.003 * tier;
      assist.reelPower += profile.fish.size === "giant" || profile.fish.size === "large" ? 0.008 * tier : 0.004 * tier;
      assist.rareBoost += (profile.fish.rarity === "legendary" || profile.fish.rarity === "mythic" ? 0.008 : 0.004) * tier * rarityScale;
      assist.mutationChance += glowBonus + (profile.fish.habitatTags.includes("aurora") ? 0.003 * tier : 0);
      assist.affinityBoost += 0.006 * tier;
      return assist;
    },
    {
      catchEase: 0,
      lureSpeed: 0,
      reelPower: 0,
      rareBoost: 0,
      mutationChance: 0,
      affinityBoost: 0,
    },
  );
}

export function getCompanionFishAffinityBoost(state: PlayerState, targetFish: FishDefinition): number {
  return getEquippedCompanionProfiles(state).reduce((boost, profile) => {
    const tier = companionAffinityTier(profile.affinity);
    const sameFamily = profile.fish.family === targetFish.family ? 0.012 * tier : 0;
    const sharedHabitat = profile.fish.habitatTags.some((tag) => targetFish.habitatTags.includes(tag))
      ? 0.009 * tier
      : 0;
    const sameBehavior = profile.fish.behaviorTags.some((tag) => targetFish.behaviorTags.includes(tag))
      ? 0.006 * tier
      : 0;
    return boost + sameFamily + sharedHabitat + sameBehavior;
  }, 0);
}

export function companionMoodLabel(affinity: number): string {
  if (affinity >= 190) return "영혼의 동료";
  if (affinity >= 130) return "단짝";
  if (affinity >= 75) return "믿음직한 친구";
  if (affinity >= 30) return "친한 친구";
  return "새 친구";
}

export function companionAffinityTier(affinity: number): number {
  if (affinity >= 190) return 5;
  if (affinity >= 130) return 4;
  if (affinity >= 75) return 3;
  if (affinity >= 30) return 2;
  return 1;
}

export function companionEffectLabel(fish: FishDefinition): string {
  if (fish.family === "whale") return "희귀한 만남을 부르는 노래";
  if (fish.behaviorTags.includes("swift")) return "입질을 빠르게 알아챔";
  if (fish.behaviorTags.includes("glowing")) return "변이 징조를 밝혀줌";
  if (fish.size === "large" || fish.size === "giant") return "릴링을 든든하게 보조";
  if (fish.habitatTags.includes("trench")) return "심해 친구를 이끌어줌";
  return "낚시 감각을 살짝 높임";
}

function uniqueValidFishIds(ids: readonly string[]): string[] {
  return Array.from(new Set(ids.filter((fishId) => fishIds.has(fishId))));
}

function clampAffinity(value: number): number {
  return Math.max(0, Math.min(MAX_AFFINITY, Math.floor(value)));
}

import type {
  CatchMutationId,
  CatchQuality,
  CatchResearchResult,
  DexResearchRecord,
  FishDefinition,
  PlayerState,
  VariantCollection,
} from "./types";

export const researchRankMeta = [
  { rank: 0, label: "미기록", short: "미기록", threshold: 0, color: 0x8ea4b0 },
  { rank: 1, label: "발견", short: "연구 I", threshold: 1, color: 0x46bcc8 },
  { rank: 2, label: "관찰", short: "연구 II", threshold: 6, color: 0x4c9fd6 },
  { rank: 3, label: "심화", short: "연구 III", threshold: 16, color: 0x8f75e8 },
  { rank: 4, label: "완료", short: "연구 IV", threshold: 34, color: 0xf0ad3d },
] as const;

export const mutationMeta: Record<CatchMutationId, { label: string; short: string; tint: number }> = {
  gleaming: { label: "윤슬 변이", short: "윤슬", tint: 0xf6cf62 },
  tidekissed: { label: "물결입맞춤 변이", short: "물결", tint: 0x74d7cf },
  aurora: { label: "오로라 변이", short: "오로라", tint: 0xb9c3ff },
};

const maxResearchPoints = researchRankMeta[researchRankMeta.length - 1].threshold;

const qualityPoints: Record<CatchQuality, number> = {
  miss: 0,
  nice: 1,
  great: 3,
  sparkle: 5,
};

const rarityPoints: Record<FishDefinition["rarity"], number> = {
  common: 0,
  uncommon: 0,
  rare: 1,
  epic: 2,
  mythic: 3,
  legendary: 4,
  ancient: 5,
};

export function seedResearchRecord(catches: number): DexResearchRecord {
  const safeCatches = Math.max(0, Math.floor(catches));
  return {
    catches: safeCatches,
    points: safeCatches > 0 ? Math.min(16, Math.max(1, safeCatches * 2)) : 0,
  };
}

export function researchPointsForCatch(
  fish: FishDefinition,
  quality: CatchQuality,
  mutationId?: CatchMutationId,
): number {
  return (
    2 +
    qualityPoints[quality] +
    rarityPoints[fish.rarity] +
    (fish.size === "large" ? 1 : fish.size === "giant" ? 2 : 0) +
    (mutationId ? 6 : 0)
  );
}

export function getResearchRank(points = 0): number {
  return researchRankMeta.reduce(
    (rank, meta) => (points >= meta.threshold ? meta.rank : rank),
    0,
  );
}

export function getResearchMeta(points = 0) {
  return researchRankMeta[getResearchRank(points)];
}

export function getNextResearchTarget(points = 0): number | undefined {
  return researchRankMeta.find((meta) => meta.threshold > points)?.threshold;
}

export function getResearchCompletionRatio(points = 0): number {
  return Math.max(0, Math.min(1, points / maxResearchPoints));
}

export function previewResearchCatch(
  state: PlayerState,
  fish: FishDefinition,
  quality: CatchQuality,
  mutationId?: CatchMutationId,
): CatchResearchResult {
  const current = state.researchProgress[fish.id] ?? seedResearchRecord(state.collection[fish.id] ?? 0);
  const points = researchPointsForCatch(fish, quality, mutationId);
  const nextPoints = current.points + points;
  return {
    points,
    rankBefore: getResearchRank(current.points),
    rankAfter: getResearchRank(nextPoints),
    rankLabel: getResearchMeta(nextPoints).label,
  };
}

export function countCollectedVariants(variantCollection: Record<string, VariantCollection>): number {
  return Object.values(variantCollection).reduce(
    (total, variants) => total + Object.values(variants).filter((count) => (count ?? 0) > 0).length,
    0,
  );
}

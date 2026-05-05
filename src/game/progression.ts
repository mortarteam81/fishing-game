import { areas, fish, getFish, getItem, getStoryChoice, items, quests, storyChoices } from "./content";
import { addPortReputation, deliveredGoodKey, getPort, getTradeGood, routeKey } from "./commerce";
import {
  applyCatchCompanionProgress,
  equipCompanion as equipCompanionState,
  getCompanionAssist,
  getCompanionFishAffinityBoost,
  rewardEquippedCompanionAffinity,
} from "./companions";
import { getGearBuildProfile } from "./gearRoles";
import {
  countCollectedVariants,
  getResearchRank,
  previewResearchCatch,
  seedResearchRecord,
} from "./research";
import { getVoyageEvent, voyageEventCleared } from "./voyageEvents";
import type {
  AreaDefinition,
  CatchMutationId,
  CatchQuality,
  FishDefinition,
  GearBuildProfile,
  PlayerState,
  QuestDefinition,
  QuestStep,
  StoryChoiceDefinition,
  StoryCondition,
  StoryEffect,
  StoryRewards,
  VoyageEventId,
} from "./types";

type RecordCatchDetails = {
  areaId?: string;
  mutationId?: CatchMutationId;
  quality?: CatchQuality;
};

export const xpForLevel = (level: number) => 45 + (level - 1) * 35;

export function addXp(state: PlayerState, xp: number): PlayerState {
  let next: PlayerState = { ...state, xp: state.xp + xp };

  while (next.xp >= xpForLevel(next.level)) {
    next = {
      ...next,
      xp: next.xp - xpForLevel(next.level),
      level: next.level + 1,
    };
  }

  return unlockAreasForLevel(next);
}

export function unlockAreasForLevel(state: PlayerState): PlayerState {
  const earned = areas
    .filter((area) => !area.hidden && area.requiredLevel <= state.level)
    .map((area) => area.id);

  return {
    ...state,
    unlockedAreaIds: Array.from(new Set([...state.unlockedAreaIds, ...earned])),
  };
}

export function isAreaDiscovered(state: PlayerState, area: AreaDefinition): boolean {
  return !area.hidden || state.discoveredAreaIds.includes(area.id);
}

export function canDiscoverArea(state: PlayerState, area: AreaDefinition): boolean {
  if (!area.hidden || state.discoveredAreaIds.includes(area.id)) {
    return false;
  }

  const route = area.route;
  if (!route) {
    return false;
  }
  const discoveryLevel = Math.max(1, route.discoveryLevel - (getEquippedGearBuild(state).primaryRole === "navigator" ? 2 : 0));
  return state.level >= discoveryLevel && requirementsMet(state, route.requirements);
}

export function requiredVoyageEventForArea(area: AreaDefinition): VoyageEventId | undefined {
  return area.route?.requirements?.find((condition) => condition.kind === "voyageEventCleared")?.eventId;
}

export function canAttemptVoyageEventForArea(state: PlayerState, area: AreaDefinition): boolean {
  if (!area.hidden || state.discoveredAreaIds.includes(area.id) || !area.route) {
    return false;
  }
  const requiredEventId = requiredVoyageEventForArea(area);
  if (!requiredEventId || voyageEventCleared(state, requiredEventId)) {
    return false;
  }
  const discoveryLevel = Math.max(1, area.route.discoveryLevel - (getEquippedGearBuild(state).primaryRole === "navigator" ? 2 : 0));
  const otherRequirements = (area.route.requirements ?? []).filter((condition) => condition.kind !== "voyageEventCleared");
  return state.level >= discoveryLevel && requirementsMet(state, otherRequirements);
}

export function discoverArea(state: PlayerState, areaId: string): PlayerState {
  const area = areas.find((entry) => entry.id === areaId);
  if (!area || !canDiscoverArea(state, area)) {
    return state;
  }

  return {
    ...state,
    discoveredAreaIds: Array.from(new Set([...state.discoveredAreaIds, area.id])),
    unlockedAreaIds:
      state.level >= area.requiredLevel
        ? Array.from(new Set([...state.unlockedAreaIds, area.id]))
        : state.unlockedAreaIds,
  };
}

export function recordCatch(
  state: PlayerState,
  fishId: string,
  shells: number,
  xp: number,
  details: RecordCatchDetails = {},
): PlayerState {
  const collection = {
    ...state.collection,
    [fishId]: (state.collection[fishId] ?? 0) + 1,
  };

  const fishDefinition = getFish(fishId);
  const currentResearch = state.researchProgress[fishId] ?? seedResearchRecord(state.collection[fishId] ?? 0);
  const researchPreview =
    fishDefinition && details.quality
      ? previewResearchCatch(state, fishDefinition, details.quality, details.mutationId)
      : undefined;
  const nextResearch =
    fishDefinition && researchPreview
      ? {
          ...currentResearch,
          catches: currentResearch.catches + 1,
          points: currentResearch.points + researchPreview.points,
          bestQuality: bestCatchQuality(currentResearch.bestQuality, details.quality),
          lastAreaId: details.areaId ?? currentResearch.lastAreaId,
          completedAt:
            researchPreview.rankAfter >= 4 && researchPreview.rankBefore < 4
              ? new Date().toISOString()
              : currentResearch.completedAt,
        }
      : {
          ...currentResearch,
          catches: currentResearch.catches + 1,
          points: currentResearch.points + 2,
          lastAreaId: details.areaId ?? currentResearch.lastAreaId,
        };

  const variantCollection =
    details.mutationId
      ? {
          ...state.variantCollection,
          [fishId]: {
            ...(state.variantCollection[fishId] ?? {}),
            [details.mutationId]: (state.variantCollection[fishId]?.[details.mutationId] ?? 0) + 1,
          },
        }
      : state.variantCollection;

  const progressed = addXp(
    {
      ...state,
      shells: state.shells + shells,
      collection,
      researchProgress: {
        ...state.researchProgress,
        [fishId]: nextResearch,
      },
      variantCollection,
    },
    xp,
  );

  return applyCatchCompanionProgress(progressed, fishId, details.quality);
}

export function recordConsolation(state: PlayerState, shells: number, xp: number): PlayerState {
  return rewardEquippedCompanionAffinity(addXp({ ...state, shells: state.shells + shells }, xp), 1);
}

export function canBuyItem(state: PlayerState, itemId: string): boolean {
  const item = getItem(itemId);
  return Boolean(item && !state.ownedItemIds.includes(itemId) && state.shells >= item.shellCost);
}

export function buyItem(state: PlayerState, itemId: string): PlayerState {
  const item = getItem(itemId);
  if (!item || state.ownedItemIds.includes(itemId) || state.shells < item.shellCost) {
    return state;
  }

  const ownedItemIds = [...state.ownedItemIds, item.id];
  return {
    ...state,
    shells: state.shells - item.shellCost,
    ownedItemIds,
    equippedRodId: item.kind === "rod" ? item.id : state.equippedRodId,
    equippedBaitId: item.kind === "bait" ? item.id : state.equippedBaitId,
    equippedBoatId: item.kind === "boat" ? item.id : state.equippedBoatId,
    equippedBoatCosmeticId: item.kind === "boatCosmetic" ? item.id : state.equippedBoatCosmeticId,
    unlockedAreaIds: item.effect?.areaUnlock
      ? Array.from(new Set([...state.unlockedAreaIds, item.effect.areaUnlock]))
      : state.unlockedAreaIds,
  };
}

export function equipItem(state: PlayerState, itemId: string): PlayerState {
  const item = getItem(itemId);
  if (!item || !state.ownedItemIds.includes(itemId)) {
    return state;
  }

  if (item.kind === "rod") {
    return { ...state, equippedRodId: itemId };
  }

  if (item.kind === "bait") {
    return { ...state, equippedBaitId: itemId };
  }

  if (item.kind === "boat") {
    return { ...state, equippedBoatId: itemId };
  }

  if (item.kind === "boatCosmetic") {
    return { ...state, equippedBoatCosmeticId: itemId };
  }

  return state;
}

export function equipCompanion(state: PlayerState, fishId: string): PlayerState {
  return equipCompanionState(state, fishId);
}

export function getRodEase(state: PlayerState): number {
  return (
    (getItem(state.equippedRodId)?.effect?.catchEase ?? 0) +
    (getItem(state.equippedBoatId)?.effect?.catchEase ?? 0) +
    (getEquippedGearBuild(state).effect.catchEase ?? 0) +
    getCompanionAssist(state).catchEase
  );
}

export function getRareBoost(state: PlayerState): number {
  return (
    (state.equippedBaitId ? (getItem(state.equippedBaitId)?.effect?.rareBoost ?? 0) : 0) +
    (getItem(state.equippedRodId)?.effect?.rareBoost ?? 0) +
    (getItem(state.equippedBoatId)?.effect?.rareBoost ?? 0) +
    (state.equippedBoatCosmeticId ? (getItem(state.equippedBoatCosmeticId)?.effect?.rareBoost ?? 0) : 0) +
    (getEquippedGearBuild(state).effect.rareBoost ?? 0) +
    getCompanionAssist(state).rareBoost
  );
}

export function getLureSpeed(state: PlayerState): number {
  return (
    (getItem(state.equippedRodId)?.effect?.lureSpeed ?? 0) +
    (state.equippedBaitId ? (getItem(state.equippedBaitId)?.effect?.lureSpeed ?? 0) : 0) +
    (getItem(state.equippedBoatId)?.effect?.lureSpeed ?? 0) +
    (getEquippedGearBuild(state).effect.lureSpeed ?? 0) +
    getCompanionAssist(state).lureSpeed
  );
}

export function getReelPower(state: PlayerState): number {
  return (
    (getItem(state.equippedRodId)?.effect?.reelPower ?? 0) +
    (getItem(state.equippedBoatId)?.effect?.reelPower ?? 0) +
    (getEquippedGearBuild(state).effect.reelPower ?? 0) +
    getCompanionAssist(state).reelPower
  );
}

export function getMutationChance(state: PlayerState): number {
  return (
    (getItem(state.equippedRodId)?.effect?.mutationChance ?? 0) +
    (state.equippedBaitId ? (getItem(state.equippedBaitId)?.effect?.mutationChance ?? 0) : 0) +
    (getItem(state.equippedBoatId)?.effect?.mutationChance ?? 0) +
    (state.equippedBoatCosmeticId ? (getItem(state.equippedBoatCosmeticId)?.effect?.mutationChance ?? 0) : 0) +
    (getEquippedGearBuild(state).effect.mutationChance ?? 0) +
    getCompanionAssist(state).mutationChance
  );
}

export function getBoatSpeed(state: PlayerState): number {
  return (
    (getItem(state.equippedBoatId)?.effect?.boatSpeed ?? 0) +
    (state.equippedBoatCosmeticId ? (getItem(state.equippedBoatCosmeticId)?.effect?.boatSpeed ?? 0) : 0) +
    (getEquippedGearBuild(state).effect.boatSpeed ?? 0)
  );
}

export function getEquippedGearBuild(state: PlayerState): GearBuildProfile {
  return getGearBuildProfile([
    getItem(state.equippedRodId),
    state.equippedBaitId ? getItem(state.equippedBaitId) : undefined,
    getItem(state.equippedBoatId),
    state.equippedBoatCosmeticId ? getItem(state.equippedBoatCosmeticId) : undefined,
  ]);
}

export function getFishAffinityBoost(state: PlayerState, fish: FishDefinition): number {
  return [
    getItem(state.equippedRodId),
    state.equippedBaitId ? getItem(state.equippedBaitId) : undefined,
    getItem(state.equippedBoatId),
    state.equippedBoatCosmeticId ? getItem(state.equippedBoatCosmeticId) : undefined,
  ].reduce((boost, item) => {
    const effect = item?.effect;
    if (!effect) {
      return boost;
    }

    return (
      boost +
      (effect.familyBoost === fish.family ? 0.2 : 0) +
      (effect.habitatBoost && fish.habitatTags.includes(effect.habitatBoost) ? 0.18 : 0) +
      (effect.rarityBoosts?.[fish.rarity] ?? 0)
    );
  }, (getEquippedGearBuild(state).effect.affinityBoost ?? 0) + getCompanionAssist(state).affinityBoost + getCompanionFishAffinityBoost(state, fish));
}

export function stepProgress(state: PlayerState, step: QuestStep): number {
  switch (step.kind) {
    case "catchFish":
      return Math.min(state.collection[step.fishId] ?? 0, step.count);
    case "catchAny":
      return Math.min(
        Object.values(state.collection).reduce((total, count) => total + count, 0),
        step.count,
      );
    case "collectUnique":
      return Math.min(
        Object.values(state.collection).filter((count) => count > 0).length,
        step.count,
      );
    case "reachLevel":
      return Math.min(state.level, step.level);
    case "ownItem":
      return state.ownedItemIds.includes(step.itemId) ? 1 : 0;
    case "unlockArea":
      return state.unlockedAreaIds.includes(step.areaId) ? 1 : 0;
    case "researchRank":
      return Math.min(getResearchRank(state.researchProgress[step.fishId]?.points ?? 0), step.rank);
    case "completeResearch":
      return Math.min(
        Object.values(state.researchProgress).filter((record) => getResearchRank(record.points) >= 4).length,
        step.count,
      );
    case "collectVariants":
      return Math.min(countCollectedVariants(state.variantCollection), step.count);
    case "clearVoyageEvent":
      return voyageEventCleared(state, step.eventId) ? 1 : 0;
    case "raiseCompanionAffinity":
      return Math.min(state.affinity[step.fishId] ?? 0, step.affinity);
    case "discoverArea":
      return state.discoveredAreaIds.includes(step.areaId) || state.unlockedAreaIds.includes(step.areaId) ? 1 : 0;
    case "portVisited":
      return state.visitedPortIds.includes(step.portId) ? 1 : 0;
    case "portReputationAtLeast":
      return Math.min(state.portReputation[step.portId] ?? 0, step.reputation);
    case "tradeProfitAtLeast":
      return Math.min(state.tradeLedger.totalProfit, step.profit);
    case "deliverTradeGood":
    case "sellTradeGood":
      return Math.min(state.tradeLedger.deliveredGoods[deliveredGoodKey(step.goodId, step.portId)] ?? 0, step.quantity);
    case "completeTradeRoute":
      return Math.min(state.tradeRouteHistory[routeKey(step.fromPortId, step.toPortId)]?.completed ?? 0, step.count);
  }
}

export function stepTarget(step: QuestStep): number {
  switch (step.kind) {
    case "catchFish":
    case "catchAny":
    case "collectUnique":
      return step.count;
    case "reachLevel":
      return step.level;
    case "ownItem":
    case "unlockArea":
    case "clearVoyageEvent":
    case "discoverArea":
    case "portVisited":
      return 1;
    case "researchRank":
      return step.rank;
    case "completeResearch":
    case "collectVariants":
      return step.count;
    case "raiseCompanionAffinity":
      return step.affinity;
    case "portReputationAtLeast":
      return step.reputation;
    case "tradeProfitAtLeast":
      return step.profit;
    case "deliverTradeGood":
    case "sellTradeGood":
      return step.quantity;
    case "completeTradeRoute":
      return step.count;
  }
}

export function stepLabel(step: QuestStep): string {
  switch (step.kind) {
    case "catchFish":
      return `${getFish(step.fishId)?.name ?? "바다 친구"} ${step.count}번 만나기`;
    case "catchAny":
      return `바다 친구 ${step.count}번 만나기`;
    case "collectUnique":
      return `서로 다른 친구 ${step.count}종 기록하기`;
    case "reachLevel":
      return `레벨 ${step.level} 되기`;
    case "ownItem":
      return `${getItem(step.itemId)?.name ?? "아이템"} 갖기`;
    case "unlockArea":
      return `${areas.find((area) => area.id === step.areaId)?.name ?? "새 낚시터"} 열기`;
    case "researchRank":
      return `${getFish(step.fishId)?.name ?? "바다 친구"} 연구 ${step.rank}단계`;
    case "completeResearch":
      return `연구 완료 ${step.count}종 달성`;
    case "collectVariants":
      return `변이 카드 ${step.count}장 기록`;
    case "clearVoyageEvent":
      return `${getVoyageEvent(step.eventId)?.label ?? "위험 항로"} 클리어`;
    case "raiseCompanionAffinity":
      return `${getFish(step.fishId)?.name ?? "동료"} 친밀도 ${step.affinity}`;
    case "discoverArea":
      return `${areas.find((area) => area.id === step.areaId)?.name ?? "새 해역"} 발견`;
    case "portVisited":
      return `${getPort(step.portId)?.name ?? "항구"} 방문`;
    case "portReputationAtLeast":
      return `${getPort(step.portId)?.name ?? "항구"} 평판 ${step.reputation}`;
    case "tradeProfitAtLeast":
      return `교역 순이익 ${step.profit} 달성`;
    case "deliverTradeGood":
    case "sellTradeGood":
      return `${getTradeGood(step.goodId)?.name ?? "교역품"} ${step.quantity}개 납품`;
    case "completeTradeRoute":
      return `${getPort(step.fromPortId)?.name ?? "출발항"} → ${getPort(step.toPortId)?.name ?? "도착항"} ${step.count}회`;
  }
}

export function isQuestComplete(state: PlayerState, quest: QuestDefinition): boolean {
  return quest.steps.every((step) => stepProgress(state, step) >= stepTarget(step));
}

export function conditionMet(state: PlayerState, condition: StoryCondition): boolean {
  switch (condition.kind) {
    case "questClaimed":
      return state.questProgress[condition.questId]?.claimed === true;
    case "storyFlag":
      return (state.storyFlags[condition.flag] ?? false) === (condition.value ?? true);
    case "notStoryFlag":
      return !state.storyFlags[condition.flag];
    case "researchRank":
      return getResearchRank(state.researchProgress[condition.fishId]?.points ?? 0) >= condition.rank;
    case "collectedVariants":
      return countCollectedVariants(state.variantCollection) >= condition.count;
    case "levelAtLeast":
      return state.level >= condition.level;
    case "collectionCount": {
      const entries = condition.family
        ? fish.filter((entry) => entry.family === condition.family && (state.collection[entry.id] ?? 0) > 0)
        : Object.entries(state.collection).filter(([, count]) => count > 0);
      return entries.length >= condition.count;
    }
    case "companionAffinity":
      return (state.affinity[condition.fishId] ?? 0) >= condition.affinity;
    case "equippedGearRole": {
      const build = getEquippedGearBuild(state);
      return build.primaryRole === condition.role && build.synergyLevel >= (condition.synergyLevel ?? 0);
    }
    case "ownedItem":
      return state.ownedItemIds.includes(condition.itemId);
    case "areaDiscovered":
      return state.discoveredAreaIds.includes(condition.areaId) || state.unlockedAreaIds.includes(condition.areaId);
    case "voyageEventCleared":
      return voyageEventCleared(state, condition.eventId);
    case "portVisited":
      return state.visitedPortIds.includes(condition.portId);
    case "portReputationAtLeast":
      return (state.portReputation[condition.portId] ?? 0) >= condition.reputation;
    case "tradeProfitAtLeast":
      return state.tradeLedger.totalProfit >= condition.profit;
    case "completeTradeRoute":
      return (state.tradeRouteHistory[routeKey(condition.fromPortId, condition.toPortId)]?.completed ?? 0) >= condition.count;
  }
}

export function requirementsMet(state: PlayerState, requirements: StoryCondition[] = []): boolean {
  return requirements.every((condition) => conditionMet(state, condition));
}

export function getVisibleQuests(state: PlayerState): QuestDefinition[] {
  return quests.filter((quest) => requirementsMet(state, quest.requirements));
}

export function getAvailableStoryChoices(state: PlayerState): StoryChoiceDefinition[] {
  return storyChoices.filter(
    (choice) => !state.choiceHistory[choice.id] && requirementsMet(state, choice.requirements),
  );
}

export function refreshQuestCompletion(state: PlayerState): PlayerState {
  const questProgress = { ...state.questProgress };

  for (const quest of getVisibleQuests(state)) {
    const current = questProgress[quest.id] ?? { completed: false, claimed: false };
    questProgress[quest.id] = {
      ...current,
      completed: current.completed || isQuestComplete(state, quest),
    };
  }

  return { ...state, questProgress };
}

export function claimQuest(state: PlayerState, questId: string): PlayerState {
  const quest = quests.find((entry) => entry.id === questId);
  const progress = state.questProgress[questId];
  if (!quest || !requirementsMet(state, quest.requirements) || !progress?.completed || progress.claimed) {
    return state;
  }

  let next: PlayerState = {
    ...state,
    shells: state.shells + (quest.rewards.shells ?? 0),
    questProgress: {
      ...state.questProgress,
      [questId]: { completed: true, claimed: true },
    },
  };

  next = grantStoryRewards(next, quest.rewards);
  next = grantPortReputationRewards(next, quest.rewards);
  next = applyStoryEffect(next, quest.effects);
  next = markChapterProgress(next, quest.chapterId, quest.id.includes("final") || quest.id.includes("crown-castle") ? 400 : 140);

  return addXp(next, quest.rewards.xp ?? 0);
}

export function recordVoyageEventResult(
  state: PlayerState,
  eventId: VoyageEventId,
  success: boolean,
): PlayerState {
  const event = getVoyageEvent(eventId);
  const current = state.voyageEventHistory[eventId] ?? { attempts: 0, successes: 0 };
  const reward = event?.reward ?? { shells: 120, xp: 40, affinity: 2 };
  const history = {
    ...state.voyageEventHistory,
    [eventId]: {
      attempts: current.attempts + 1,
      successes: current.successes + (success ? 1 : 0),
      lastOutcome: success ? "success" as const : "fail" as const,
    },
  };
  const withReward = rewardEquippedCompanionAffinity(
    {
      ...state,
      shells: state.shells + Math.round(reward.shells * (success ? 1 : 0.32)),
      voyageEventHistory: history,
    },
    success ? reward.affinity : Math.max(1, Math.floor(reward.affinity / 2)),
  );
  const progressed = markChapterProgress(withReward, state.activeChapterId, success ? 90 : 25);
  return addXp(progressed, Math.round(reward.xp * (success ? 1 : 0.38)));
}

export function applyStoryChoice(
  state: PlayerState,
  choiceId: string,
  optionId: string,
): PlayerState {
  const choice = getStoryChoice(choiceId);
  if (!choice || state.choiceHistory[choiceId] || !requirementsMet(state, choice.requirements)) {
    return state;
  }

  const option = choice.options.find((entry) => entry.id === optionId);
  if (!option) {
    return state;
  }

  let next: PlayerState = {
    ...state,
    shells: state.shells + (option.rewards?.shells ?? 0),
    choiceHistory: {
      ...state.choiceHistory,
      [choiceId]: option.id,
    },
    storyFlags: {
      ...state.storyFlags,
      ...Object.fromEntries(option.setFlags.map((flag) => [flag, true])),
    },
  };

  next = grantStoryRewards(next, option.rewards);
  next = grantPortReputationRewards(next, option.rewards);
  next = addXp(next, option.rewards?.xp ?? 0);
  return refreshQuestCompletion(next);
}

export function choiceOptionLabel(choice: StoryChoiceDefinition, optionId?: string): string {
  return choice.options.find((option) => option.id === optionId)?.label ?? "아직 정하지 않았어요";
}

export function nextQuestHint(state: PlayerState): string {
  const choice = getAvailableStoryChoices(state)[0];
  if (choice) {
    return choice.helper;
  }

  const quest = getVisibleQuests(state).find((entry) => !state.questProgress[entry.id]?.claimed);
  if (!quest) {
    return "오늘도 바다 친구들을 천천히 만나봐요.";
  }

  const done = isQuestComplete(state, quest);
  return done ? `${quest.title} 보상을 받을 수 있어요!` : quest.helper;
}

function grantStoryRewards(state: PlayerState, rewards?: StoryRewards): PlayerState {
  if (!rewards?.itemId) {
    return state;
  }

  const rewardItem = items.find((item) => item.id === rewards.itemId);
  if (!rewardItem || state.ownedItemIds.includes(rewardItem.id)) {
    return state;
  }

  return {
    ...state,
    ownedItemIds: [...state.ownedItemIds, rewardItem.id],
    equippedBoatId:
      rewardItem.kind === "boat" ? rewardItem.id : state.equippedBoatId,
    equippedBoatCosmeticId:
      rewardItem.kind === "boatCosmetic" ? rewardItem.id : state.equippedBoatCosmeticId,
  };
}

function grantPortReputationRewards(state: PlayerState, rewards?: StoryRewards): PlayerState {
  return (rewards?.portReputation ?? []).reduce(
    (next, reward) => addPortReputation(next, reward.portId, reward.amount),
    state,
  );
}

function applyStoryEffect(state: PlayerState, effect?: StoryEffect): PlayerState {
  if (!effect) {
    return state;
  }

  return {
    ...state,
    storyFlags: {
      ...state.storyFlags,
      ...Object.fromEntries((effect.setFlags ?? []).map((flag) => [flag, true])),
    },
    unlockedAreaIds: Array.from(new Set([...state.unlockedAreaIds, ...(effect.unlockAreaIds ?? [])])),
  };
}

function markChapterProgress(state: PlayerState, chapterId: PlayerState["activeChapterId"], score: number): PlayerState {
  if (!chapterId) {
    return state;
  }

  const current = state.chapterProgress[chapterId] ?? { started: false, completed: false, score: 0 };
  const nextScore = current.score + score;
  return {
    ...state,
    activeChapterId: chapterId,
    chapterProgress: {
      ...state.chapterProgress,
      [chapterId]: {
        started: true,
        completed: current.completed || nextScore >= 400,
        score: nextScore,
      },
    },
  };
}

function bestCatchQuality(current: CatchQuality | undefined, next: CatchQuality | undefined): CatchQuality | undefined {
  if (!next) {
    return current;
  }
  if (!current) {
    return next;
  }

  const rank: Record<CatchQuality, number> = {
    miss: 0,
    nice: 1,
    great: 2,
    sparkle: 3,
  };
  return rank[next] > rank[current] ? next : current;
}

export { fish };

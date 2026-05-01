import { areas, fish, getFish, getItem, getStoryChoice, items, quests, storyChoices } from "./content";
import type {
  PlayerState,
  QuestDefinition,
  QuestStep,
  StoryChoiceDefinition,
  StoryCondition,
  StoryEffect,
  StoryRewards,
} from "./types";

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
    .filter((area) => area.requiredLevel <= state.level)
    .map((area) => area.id);

  return {
    ...state,
    unlockedAreaIds: Array.from(new Set([...state.unlockedAreaIds, ...earned])),
  };
}

export function recordCatch(
  state: PlayerState,
  fishId: string,
  shells: number,
  xp: number,
): PlayerState {
  const collection = {
    ...state.collection,
    [fishId]: (state.collection[fishId] ?? 0) + 1,
  };
  return addXp(
    {
      ...state,
      shells: state.shells + shells,
      collection,
    },
    xp,
  );
}

export function recordConsolation(state: PlayerState, shells: number, xp: number): PlayerState {
  return addXp({ ...state, shells: state.shells + shells }, xp);
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

export function getRodEase(state: PlayerState): number {
  return (getItem(state.equippedRodId)?.effect?.catchEase ?? 0) + (getItem(state.equippedBoatId)?.effect?.catchEase ?? 0);
}

export function getRareBoost(state: PlayerState): number {
  return (
    (state.equippedBaitId ? (getItem(state.equippedBaitId)?.effect?.rareBoost ?? 0) : 0) +
    (getItem(state.equippedRodId)?.effect?.rareBoost ?? 0) +
    (getItem(state.equippedBoatId)?.effect?.rareBoost ?? 0)
  );
}

export function getLureSpeed(state: PlayerState): number {
  return (getItem(state.equippedRodId)?.effect?.lureSpeed ?? 0) + (getItem(state.equippedBoatId)?.effect?.lureSpeed ?? 0);
}

export function getReelPower(state: PlayerState): number {
  return getItem(state.equippedRodId)?.effect?.reelPower ?? 0;
}

export function getMutationChance(state: PlayerState): number {
  return (getItem(state.equippedRodId)?.effect?.mutationChance ?? 0) + (getItem(state.equippedBoatId)?.effect?.mutationChance ?? 0);
}

export function getBoatSpeed(state: PlayerState): number {
  return getItem(state.equippedBoatId)?.effect?.boatSpeed ?? 0;
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
      return 1;
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
  next = applyStoryEffect(next, quest.effects);

  return addXp(next, quest.rewards.xp ?? 0);
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

export { fish };

import { getAvailableStoryChoices } from "./progression";
import type { PlayerState } from "./types";

export type StarterJourneyPrompt = {
  title: string;
  helper: string;
  ctaLabel: string;
  scene: "Fishing" | "Quest" | "Exchange" | "Harbor";
  data?: Record<string, unknown>;
  step: number;
  totalSteps: number;
};

const TOTAL_STEPS = 6;

export function getStarterJourney(state: PlayerState): StarterJourneyPrompt | undefined {
  const totalCatches = Object.values(state.collection).reduce((sum, count) => sum + Math.max(0, count), 0);
  const uniqueCount = Object.values(state.collection).filter((count) => count > 0).length;
  const firstFriend = state.questProgress["first-friend"];
  const tinyCollector = state.questProgress["tiny-collector"];
  const betterRod = state.questProgress["better-rod"];
  const pierTrip = state.questProgress["pier-trip"];

  if (pierTrip?.claimed && state.unlockedAreaIds.includes("little-pier") && state.level > 6) {
    return undefined;
  }

  if (!firstFriend?.completed && totalCatches < 1) {
    return {
      title: "첫 친구 만나기",
      helper: "햇살 해변에서 첫 바다 친구를 만나면 선장 수첩이 열려요.",
      ctaLabel: "바로 낚시",
      scene: "Fishing",
      data: { areaId: "sunny-beach" },
      step: 1,
      totalSteps: TOTAL_STEPS,
    };
  }

  if (firstFriend?.completed && !firstFriend.claimed) {
    return {
      title: "첫 보상 받기",
      helper: "첫 만남 보상을 받으면 조개와 경험치가 모이고 다음 항로가 열려요.",
      ctaLabel: "보상 받기",
      scene: "Quest",
      step: 2,
      totalSteps: TOTAL_STEPS,
    };
  }

  if (firstFriend?.claimed && getAvailableStoryChoices(state).length > 0) {
    return {
      title: "첫 항로 정하기",
      helper: "항구 재건과 산호초 탐험 중 마음에 드는 항로를 골라 선장 이야기를 시작해요.",
      ctaLabel: "항구에서 선택",
      scene: "Harbor",
      step: 3,
      totalSteps: TOTAL_STEPS,
    };
  }

  if (!tinyCollector?.claimed && uniqueCount < 3) {
    return {
      title: "도감 3종 채우기",
      helper: `서로 다른 바다 친구를 ${Math.max(0, 3 - uniqueCount)}종 더 만나면 도감 보상이 기다려요.`,
      ctaLabel: "친구 찾기",
      scene: "Fishing",
      data: { areaId: "sunny-beach" },
      step: 4,
      totalSteps: TOTAL_STEPS,
    };
  }

  if (tinyCollector?.completed && !tinyCollector.claimed) {
    return {
      title: "도감 보상 받기",
      helper: "새 친구들을 기록했어요. 부탁 목록에서 도감 보상을 챙겨요.",
      ctaLabel: "보상 받기",
      scene: "Quest",
      step: 4,
      totalSteps: TOTAL_STEPS,
    };
  }

  if (!state.ownedItemIds.includes("sparkle-rod")) {
    return {
      title: "반짝 낚싯대 준비",
      helper: "첫 장비를 바꾸면 릴 감기가 안정되고 더 좋은 친구를 만날 준비가 돼요.",
      ctaLabel: "교환소 가기",
      scene: "Exchange",
      data: { category: "rod", chapterFilter: "base", roleFilter: "all" },
      step: 5,
      totalSteps: TOTAL_STEPS,
    };
  }

  if (betterRod?.completed && !betterRod.claimed) {
    return {
      title: "장비 보상 받기",
      helper: "새 낚싯대 준비가 끝났어요. 부탁 목록에서 추가 보상을 받아요.",
      ctaLabel: "보상 받기",
      scene: "Quest",
      step: 5,
      totalSteps: TOTAL_STEPS,
    };
  }

  if (!state.unlockedAreaIds.includes("little-pier")) {
    return {
      title: "작은 방파제 열기",
      helper: "조금만 더 낚시하면 다음 낚시터가 열려요. 새 배경과 친구들이 기다려요.",
      ctaLabel: "한 번 더 낚시",
      scene: "Fishing",
      data: { areaId: "sunny-beach" },
      step: 6,
      totalSteps: TOTAL_STEPS,
    };
  }

  if (pierTrip?.completed && !pierTrip.claimed) {
    return {
      title: "새 낚시터 보상",
      helper: "작은 방파제를 발견했어요. 보상을 받고 새 낚시터로 떠나요.",
      ctaLabel: "보상 받기",
      scene: "Quest",
      step: 6,
      totalSteps: TOTAL_STEPS,
    };
  }

  if (state.level <= 6) {
    return {
      title: "작은 방파제 출항",
      helper: "이제 항구 너머의 새 물결을 확인해요. 방파제 친구들은 움직임이 조금 달라요.",
      ctaLabel: "방파제 낚시",
      scene: "Fishing",
      data: { areaId: "little-pier" },
      step: 6,
      totalSteps: TOTAL_STEPS,
    };
  }

  return undefined;
}

export function isStarterJourneyActive(state: PlayerState): boolean {
  return Boolean(getStarterJourney(state));
}

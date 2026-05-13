import {
  addPortReputation,
  deliveredGoodKey,
  getPort,
  getTradeGood,
  isPortUnlocked,
  routeKey,
} from "./commerce";
import { getVoyageEvent } from "./voyageEvents";
import type {
  PlayerState,
  RouteContractDefinition,
  RouteContractProgress,
  RouteContractStage,
  RouteMilestones,
  StoryCondition,
  StoryEffect,
  StoryRewards,
  VoyageEventId,
} from "./types";

export const routeContracts: RouteContractDefinition[] = [
  {
    id: "route-contract-sunrise-coral-1",
    title: "햇살 도시락 산호 배송",
    chapterId: "blue-route-trade",
    fromPortId: "sunrise-port",
    toPortId: "coralworks-port",
    requiredLevel: 18,
    requiredGoodId: "sunrise-port-food",
    requiredQuantity: 1,
    recommendedRole: "navigator",
    rewards: { shells: 640, xp: 90, portReputation: [{ portId: "coralworks-port", amount: 8 }] },
    effects: { setFlags: ["route-contracts-started"] },
    milestoneId: "route-milestone-sunrise-coral-1",
    intro: "산호 장인들이 밝은 도시락을 기다리고 있어요.",
    successText: "따뜻한 도시락이 산호공방의 점심 종을 밝혔어요.",
  },
  {
    id: "route-contract-sunrise-mist-2",
    title: "햇살 선박재 안개 항로",
    chapterId: "blue-route-trade",
    fromPortId: "sunrise-port",
    toPortId: "mistfjord-port",
    requiredLevel: 32,
    requiredGoodId: "sunrise-port-shipPart",
    requiredQuantity: 1,
    recommendedRole: "navigator",
    requiredEventId: "ghost-lighthouse",
    rewards: { shells: 820, xp: 120, portReputation: [{ portId: "mistfjord-port", amount: 9 }] },
    milestoneId: "route-milestone-sunrise-mist-2",
    intro: "안개 속 표지선 수리에 쓸 가벼운 선박재가 필요해요.",
    successText: "표지선의 등불이 다시 반짝이며 안개길을 알려줬어요.",
  },
  {
    id: "route-contract-coral-mist-3",
    title: "산호 공예품 안개 전시",
    chapterId: "blue-route-trade",
    fromPortId: "coralworks-port",
    toPortId: "mistfjord-port",
    requiredLevel: 34,
    requiredGoodId: "coralworks-port-craft",
    requiredQuantity: 1,
    recommendedRole: "naturalist",
    bonusEventId: "mischievous-pirate-crab-swarm",
    rewards: { shells: 900, xp: 132, portReputation: [{ portId: "mistfjord-port", amount: 10 }] },
    milestoneId: "route-milestone-coral-mist-3",
    intro: "안개협만의 작은 전시장에 산호 장식품을 보내요.",
    successText: "전시장 창가에 산호빛이 은은하게 피어났어요.",
  },
  {
    id: "route-contract-mist-kelp-4",
    title: "안개 연구상자 해초 기록",
    chapterId: "blue-route-trade",
    fromPortId: "mistfjord-port",
    toPortId: "kelpmarket-port",
    requiredLevel: 44,
    requiredGoodId: "mistfjord-port-research",
    requiredQuantity: 1,
    recommendedRole: "naturalist",
    requiredEventId: "drifting-crate",
    rewards: { shells: 1040, xp: 150, portReputation: [{ portId: "kelpmarket-port", amount: 10 }] },
    milestoneId: "route-milestone-mist-kelp-4",
    intro: "해초시장 연구자들이 안개 수로의 표본 상자를 부탁했어요.",
    successText: "해초 잎 사이에 새 관찰 기록이 차곡차곡 꽂혔어요.",
  },
  {
    id: "route-contract-kelp-basalt-5",
    title: "해초 도시락 조선소 응원",
    chapterId: "blue-route-trade",
    fromPortId: "kelpmarket-port",
    toPortId: "basalt-shipyard",
    requiredLevel: 58,
    requiredGoodId: "kelpmarket-port-food",
    requiredQuantity: 2,
    recommendedRole: "stormbreaker",
    rewards: { shells: 1260, xp: 176, portReputation: [{ portId: "basalt-shipyard", amount: 11 }] },
    milestoneId: "route-milestone-kelp-basalt-5",
    intro: "현무암 조선공들이 든든한 해초 도시락을 기다려요.",
    successText: "조선소 망치 소리가 더 경쾌하게 울렸어요.",
  },
  {
    id: "route-contract-basalt-pearl-6",
    title: "현무암 선박재 진주 보강",
    chapterId: "blue-route-trade",
    fromPortId: "basalt-shipyard",
    toPortId: "pearlbay-port",
    requiredLevel: 72,
    requiredGoodId: "basalt-shipyard-shipPart",
    requiredQuantity: 1,
    recommendedRole: "stormbreaker",
    requiredEventId: "storm-spout",
    rewards: { shells: 1480, xp: 204, portReputation: [{ portId: "pearlbay-port", amount: 12 }] },
    milestoneId: "route-milestone-basalt-pearl-6",
    intro: "진주만의 축제 배를 안전하게 보강할 단단한 재료예요.",
    successText: "축제 배가 반짝이는 돛을 달고 항구를 한 바퀴 돌았어요.",
  },
  {
    id: "route-contract-pearl-storm-7",
    title: "진주 축제상자 폭풍 격려",
    chapterId: "blue-route-trade",
    fromPortId: "pearlbay-port",
    toPortId: "stormcompass-port",
    requiredLevel: 86,
    requiredGoodId: "pearlbay-port-festival",
    requiredQuantity: 1,
    recommendedRole: "stormbreaker",
    requiredEventId: "black-reef-vortex",
    rewards: { shells: 1720, xp: 236, portReputation: [{ portId: "stormcompass-port", amount: 13 }] },
    milestoneId: "route-milestone-pearl-storm-7",
    intro: "폭풍나침항의 선원들이 진주 축제 선물을 기다려요.",
    successText: "거친 항구에 작은 축제 깃발들이 펄럭였어요.",
  },
  {
    id: "route-contract-storm-aurora-8",
    title: "폭풍 선박재 극광 수리",
    chapterId: "blue-route-trade",
    fromPortId: "stormcompass-port",
    toPortId: "aurora-tradepost",
    requiredLevel: 100,
    requiredGoodId: "stormcompass-port-shipPart",
    requiredQuantity: 1,
    recommendedRole: "stormbreaker",
    bonusEventId: "starlight-backflow",
    rewards: { shells: 1940, xp: 270, portReputation: [{ portId: "aurora-tradepost", amount: 14 }] },
    milestoneId: "route-milestone-storm-aurora-8",
    intro: "극광교역항의 관측 갑판을 고칠 폭풍용 선박재예요.",
    successText: "관측 갑판 위로 오로라가 넓게 펼쳐졌어요.",
  },
  {
    id: "route-contract-coral-kelp-9",
    title: "산호 연구상자 해초 교실",
    chapterId: "blue-route-trade",
    fromPortId: "coralworks-port",
    toPortId: "kelpmarket-port",
    requiredLevel: 50,
    requiredGoodId: "coralworks-port-research",
    requiredQuantity: 2,
    recommendedRole: "naturalist",
    rewards: { shells: 1380, xp: 192, portReputation: [{ portId: "kelpmarket-port", amount: 12 }] },
    milestoneId: "route-milestone-coral-kelp-9",
    intro: "해초 교실에 산호 표본과 안전한 관찰 도구를 전해요.",
    successText: "아이들이 산호와 해초가 함께 사는 법을 배웠어요.",
  },
  {
    id: "route-contract-mist-basalt-10",
    title: "안개 지도함 조선 항로",
    chapterId: "blue-route-trade",
    fromPortId: "mistfjord-port",
    toPortId: "basalt-shipyard",
    requiredLevel: 62,
    requiredGoodId: "mistfjord-port-relic",
    requiredQuantity: 1,
    recommendedRole: "navigator",
    requiredEventId: "ghost-lighthouse",
    rewards: { shells: 1600, xp: 218, portReputation: [{ portId: "basalt-shipyard", amount: 13 }] },
    milestoneId: "route-milestone-mist-basalt-10",
    intro: "오래된 안개 지도함을 조선소 항로 기록실에 맡겨요.",
    successText: "새 항로판에 안개길 표시가 또렷하게 새겨졌어요.",
  },
  {
    id: "route-contract-kelp-pearl-11",
    title: "해초 향료 진주 축제",
    chapterId: "blue-route-trade",
    fromPortId: "kelpmarket-port",
    toPortId: "pearlbay-port",
    requiredLevel: 76,
    requiredGoodId: "kelpmarket-port-festival",
    requiredQuantity: 1,
    recommendedRole: "mutationHunter",
    bonusEventId: "reef-maze",
    rewards: { shells: 1780, xp: 244, portReputation: [{ portId: "pearlbay-port", amount: 14 }] },
    milestoneId: "route-milestone-kelp-pearl-11",
    intro: "진주 축제 부스에 향긋한 해초 축제상자를 보내요.",
    successText: "축제 거리마다 싱그러운 바다 향이 퍼졌어요.",
  },
  {
    id: "route-contract-basalt-storm-12",
    title: "현무암 닻 폭풍 훈련",
    chapterId: "blue-route-trade",
    fromPortId: "basalt-shipyard",
    toPortId: "stormcompass-port",
    requiredLevel: 90,
    requiredGoodId: "basalt-shipyard-relic",
    requiredQuantity: 1,
    recommendedRole: "stormbreaker",
    requiredEventId: "black-reef-vortex",
    rewards: { shells: 2060, xp: 286, portReputation: [{ portId: "stormcompass-port", amount: 15 }] },
    milestoneId: "route-milestone-basalt-storm-12",
    intro: "폭풍 훈련용 닻 장식을 안전하게 옮기는 의뢰예요.",
    successText: "훈련선들이 더 안정적으로 파도를 넘었어요.",
  },
  {
    id: "route-contract-pearl-aurora-13",
    title: "진주 공예품 극광 무대",
    chapterId: "blue-route-trade",
    fromPortId: "pearlbay-port",
    toPortId: "aurora-tradepost",
    requiredLevel: 104,
    requiredGoodId: "pearlbay-port-craft",
    requiredQuantity: 2,
    recommendedRole: "mutationHunter",
    rewards: { shells: 2280, xp: 314, portReputation: [{ portId: "aurora-tradepost", amount: 16 }] },
    milestoneId: "route-milestone-pearl-aurora-13",
    intro: "극광 무대 장식에 쓸 진주 공예품을 전달해요.",
    successText: "무대 위 진주 장식이 오로라 색으로 물들었어요.",
  },
  {
    id: "route-contract-aurora-starwhale-14",
    title: "극광 연구상자 별고래 관측",
    chapterId: "starwhale-expedition",
    fromPortId: "aurora-tradepost",
    toPortId: "starwhale-observatory",
    requiredLevel: 118,
    requiredGoodId: "aurora-tradepost-research",
    requiredQuantity: 1,
    recommendedRole: "mythSeeker",
    requiredEventId: "starlight-backflow",
    requirements: [{ kind: "storyFlag", flag: "ancient-witness" }],
    rewards: { shells: 2540, xp: 350, portReputation: [{ portId: "starwhale-observatory", amount: 16 }] },
    milestoneId: "route-milestone-aurora-starwhale-14",
    intro: "별고래 관측항에 오로라 빛 연구장비가 필요해요.",
    successText: "관측 렌즈가 별고래의 숨결을 부드럽게 비췄어요.",
  },
  {
    id: "route-contract-sunrise-pearl-15",
    title: "햇살 축제상자 진주 손님맞이",
    chapterId: "blue-route-trade",
    fromPortId: "sunrise-port",
    toPortId: "pearlbay-port",
    requiredLevel: 78,
    requiredGoodId: "sunrise-port-festival",
    requiredQuantity: 2,
    recommendedRole: "navigator",
    bonusEventId: "pirate-crab",
    rewards: { shells: 1880, xp: 260, portReputation: [{ portId: "pearlbay-port", amount: 14 }] },
    milestoneId: "route-milestone-sunrise-pearl-15",
    intro: "진주만 손님맞이에 햇살항의 밝은 축제상자를 실어요.",
    successText: "손님맞이 광장에 노란 리본이 활짝 펼쳐졌어요.",
  },
  {
    id: "route-contract-coral-storm-16",
    title: "산호 선박재 폭풍 보급",
    chapterId: "blue-route-trade",
    fromPortId: "coralworks-port",
    toPortId: "stormcompass-port",
    requiredLevel: 92,
    requiredGoodId: "coralworks-port-shipPart",
    requiredQuantity: 2,
    recommendedRole: "stormbreaker",
    requiredEventId: "storm-spout",
    rewards: { shells: 2160, xp: 302, portReputation: [{ portId: "stormcompass-port", amount: 15 }] },
    milestoneId: "route-milestone-coral-storm-16",
    intro: "폭풍 항해 연습선에 탄성 좋은 산호 선박재를 보내요.",
    successText: "연습선의 난간이 튼튼하게 반짝였어요.",
  },
  {
    id: "route-contract-mist-aurora-17",
    title: "안개 공예품 극광 기념관",
    chapterId: "blue-route-trade",
    fromPortId: "mistfjord-port",
    toPortId: "aurora-tradepost",
    requiredLevel: 108,
    requiredGoodId: "mistfjord-port-craft",
    requiredQuantity: 2,
    recommendedRole: "navigator",
    rewards: { shells: 2420, xp: 336, portReputation: [{ portId: "aurora-tradepost", amount: 16 }] },
    milestoneId: "route-milestone-mist-aurora-17",
    intro: "극광 기념관에 안개무늬 공예품을 전시하려 해요.",
    successText: "기념관 벽면에 부드러운 안개무늬가 걸렸어요.",
  },
  {
    id: "route-contract-kelp-starwhale-18",
    title: "해초 연구상자 별고래 먹이밭",
    chapterId: "starwhale-expedition",
    fromPortId: "kelpmarket-port",
    toPortId: "starwhale-observatory",
    requiredLevel: 122,
    requiredGoodId: "kelpmarket-port-research",
    requiredQuantity: 2,
    recommendedRole: "naturalist",
    requiredEventId: "drifting-crate",
    requirements: [{ kind: "storyFlag", flag: "ancient-witness" }],
    rewards: { shells: 2680, xp: 372, portReputation: [{ portId: "starwhale-observatory", amount: 17 }] },
    milestoneId: "route-milestone-kelp-starwhale-18",
    intro: "별고래 먹이밭을 살피는 연구팀에 해초 자료를 전달해요.",
    successText: "먹이밭 지도에 초록 표시가 빼곡히 채워졌어요.",
  },
  {
    id: "route-contract-basalt-deepcrown-19",
    title: "현무암 선박재 심해 정비",
    chapterId: "crown-route-restoration",
    fromPortId: "basalt-shipyard",
    toPortId: "deepcrown-port",
    requiredLevel: 150,
    requiredGoodId: "basalt-shipyard-shipPart",
    requiredQuantity: 2,
    recommendedRole: "deepExplorer",
    requiredEventId: "deep-sea-bell",
    requirements: [{ kind: "questClaimed", questId: "deep-crown-gate" }],
    rewards: { shells: 3100, xp: 430, portReputation: [{ portId: "deepcrown-port", amount: 18 }] },
    milestoneId: "route-milestone-basalt-deepcrown-19",
    intro: "심해왕관항 정비창에 단단한 현무암 선박재를 보내요.",
    successText: "심해 정비창의 오래된 문이 조용히 다시 열렸어요.",
  },
  {
    id: "route-contract-pearl-starwhale-20",
    title: "진주 축제상자 별고래 환영식",
    chapterId: "starwhale-expedition",
    fromPortId: "pearlbay-port",
    toPortId: "starwhale-observatory",
    requiredLevel: 124,
    requiredGoodId: "pearlbay-port-festival",
    requiredQuantity: 2,
    recommendedRole: "mythSeeker",
    bonusEventId: "starlight-backflow",
    requirements: [{ kind: "storyFlag", flag: "ancient-witness" }],
    rewards: { shells: 2760, xp: 386, portReputation: [{ portId: "starwhale-observatory", amount: 17 }] },
    milestoneId: "route-milestone-pearl-starwhale-20",
    intro: "별고래 관측항의 환영식에 진주 장식을 실어 가요.",
    successText: "환영식 조명이 별빛처럼 잔잔히 흔들렸어요.",
  },
  {
    id: "route-contract-storm-deepcrown-21",
    title: "폭풍 선박재 왕관 항로",
    chapterId: "crown-route-restoration",
    fromPortId: "stormcompass-port",
    toPortId: "deepcrown-port",
    requiredLevel: 154,
    requiredGoodId: "stormcompass-port-shipPart",
    requiredQuantity: 2,
    recommendedRole: "stormbreaker",
    requiredEventId: "black-reef-vortex",
    requirements: [{ kind: "questClaimed", questId: "deep-crown-gate" }],
    rewards: { shells: 3280, xp: 456, portReputation: [{ portId: "deepcrown-port", amount: 19 }] },
    milestoneId: "route-milestone-storm-deepcrown-21",
    intro: "왕관해의 안전 표식을 세울 폭풍용 선박재예요.",
    successText: "심해 항로 표식이 파도 속에서도 반듯하게 섰어요.",
  },
  {
    id: "route-contract-aurora-deepcrown-22",
    title: "극광 유물함 심해 기록실",
    chapterId: "crown-route-restoration",
    fromPortId: "aurora-tradepost",
    toPortId: "deepcrown-port",
    requiredLevel: 158,
    requiredGoodId: "aurora-tradepost-relic",
    requiredQuantity: 1,
    recommendedRole: "deepExplorer",
    requiredEventId: "deep-sea-bell",
    requirements: [{ kind: "questClaimed", questId: "deep-crown-gate" }],
    rewards: { shells: 3500, xp: 486, portReputation: [{ portId: "deepcrown-port", amount: 20 }] },
    milestoneId: "route-milestone-aurora-deepcrown-22",
    intro: "심해 기록실에 오로라 유물함을 조심히 옮겨요.",
    successText: "기록실 천장에 극광빛 문양이 천천히 떠올랐어요.",
  },
  {
    id: "route-contract-starwhale-deepcrown-23",
    title: "별고래 유물함 왕관 보관",
    chapterId: "crown-route-restoration",
    fromPortId: "starwhale-observatory",
    toPortId: "deepcrown-port",
    requiredLevel: 162,
    requiredGoodId: "starwhale-observatory-relic",
    requiredQuantity: 1,
    recommendedRole: "mythSeeker",
    requiredEventId: "deep-sea-bell",
    requirements: [
      { kind: "storyFlag", flag: "ancient-witness" },
      { kind: "questClaimed", questId: "deep-crown-gate" },
    ],
    rewards: { shells: 3720, xp: 520, portReputation: [{ portId: "deepcrown-port", amount: 21 }] },
    milestoneId: "route-milestone-starwhale-deepcrown-23",
    intro: "별고래 관측 기록을 왕관해 보관고에 안전히 맡겨요.",
    successText: "보관고의 고대 조개등이 별빛 기록을 감쌌어요.",
  },
  {
    id: "route-contract-deepcrown-aurora-24",
    title: "심해왕관 유물함 극광 귀환",
    chapterId: "crown-route-restoration",
    fromPortId: "deepcrown-port",
    toPortId: "aurora-tradepost",
    requiredLevel: 170,
    requiredGoodId: "deepcrown-port-relic",
    requiredQuantity: 1,
    recommendedRole: "deepExplorer",
    requiredEventId: "deep-sea-bell",
    requirements: [{ kind: "questClaimed", questId: "deep-crown-gate" }],
    rewards: {
      shells: 4100,
      xp: 560,
      portReputation: [
        { portId: "deepcrown-port", amount: 12 },
        { portId: "aurora-tradepost", amount: 22 },
      ],
    },
    effects: { setFlags: ["crown-route-contracts-restored"] },
    milestoneId: "route-milestone-deepcrown-aurora-24",
    intro: "심해왕관의 감사 유물함을 극광교역항으로 돌려보내요.",
    successText: "극광 시장에 왕관해의 고요한 감사 인사가 전해졌어요.",
  },
];

const contractIds = new Set(routeContracts.map((contract) => contract.id));
const milestoneIds = new Set(routeContracts.map((contract) => contract.milestoneId));

export function getRouteContract(contractId: string | undefined): RouteContractDefinition | undefined {
  return routeContracts.find((contract) => contract.id === contractId);
}

export function availableRouteContracts(state: PlayerState): RouteContractDefinition[] {
  return routeContracts.filter((contract) =>
    !routeContractCompleted(state, contract.id) &&
    state.activeRouteContractId !== contract.id &&
    state.level >= contract.requiredLevel &&
    state.currentPortId === contract.fromPortId &&
    isPortUnlocked(state, getPort(contract.fromPortId)!) &&
    isPortUnlocked(state, getPort(contract.toPortId)!) &&
    routeContractRequirementsMet(state, contract.requirements),
  );
}

export function startRouteContract(state: PlayerState, contractId: string): PlayerState {
  const contract = getRouteContract(contractId);
  if (!contract || state.activeRouteContractId || !availableRouteContracts(state).some((entry) => entry.id === contract.id)) {
    return state;
  }

  return {
    ...state,
    activeRouteContractId: contract.id,
    routeContractProgress: {
      ...state.routeContractProgress,
      [contract.id]: {
        contractId: contract.id,
        acceptedAtDay: state.marketState.day,
        deliveredQuantityAtStart: deliveredQuantity(state, contract),
        routeCompletionsAtStart: routeCompletions(state, contract),
        eventSuccessesAtStart: eventSuccesses(state, contract),
        requiredEventDeliveredQuantityAtClear: undefined,
        claimed: false,
      },
    },
  };
}

export function getActiveRouteContract(state: PlayerState): RouteContractDefinition | undefined {
  return getRouteContract(state.activeRouteContractId);
}

export function routeContractStage(state: PlayerState, contractId: string): RouteContractStage | undefined {
  const contract = getRouteContract(contractId);
  const progress = contract ? state.routeContractProgress[contract.id] : undefined;
  if (!contract || !progress) {
    return undefined;
  }
  if (progress.claimed || routeMilestoneReached(state, contract.milestoneId)) {
    return "claimed";
  }
  if (deliveredQuantity(state, contract) >= progress.deliveredQuantityAtStart + contract.requiredQuantity &&
    requiredDeliveryAfterEventClear(state, contract, progress) &&
    routeCompletions(state, contract) > progress.routeCompletionsAtStart) {
    return "sold";
  }
  if (state.currentPortId === contract.toPortId) {
    return "sailed";
  }
  if (hasRequiredCargo(state, contract)) {
    return "cargo-ready";
  }
  return "accepted";
}

export function routeContractNextAction(state: PlayerState, contractId: string): string {
  const contract = getRouteContract(contractId);
  const stage = routeContractStage(state, contractId);
  if (!contract || !stage) {
    return "항로 계약을 선택해 주세요.";
  }
  switch (stage) {
    case "accepted":
      return `${getTradeGood(contract.requiredGoodId)?.name ?? "필요한 화물"} ${contract.requiredQuantity}개를 싣기`;
    case "cargo-ready":
      if (!requiredEventClearedSinceStart(state, contract, state.routeContractProgress[contract.id])) {
        return `${eventLabel(contract.requiredEventId)} 통과하기`;
      }
      return `${getPort(contract.toPortId)?.name ?? "목적지"}로 항해하기`;
    case "sailed":
      if (!requiredEventClearedSinceStart(state, contract, state.routeContractProgress[contract.id])) {
        return `${eventLabel(contract.requiredEventId)} 통과하기`;
      }
      return `${getTradeGood(contract.requiredGoodId)?.name ?? "계약 화물"} 판매하기`;
    case "sold":
      return "계약 보상 받기";
    case "claimed":
      return contract.successText;
  }
}

export function completeRouteContract(state: PlayerState, contractId: string): PlayerState {
  const contract = getRouteContract(contractId);
  if (!contract || routeContractStage(state, contract.id) !== "sold") {
    return state;
  }

  const progress = state.routeContractProgress[contract.id];
  let next: PlayerState = {
    ...state,
    activeRouteContractId: state.activeRouteContractId === contract.id ? undefined : state.activeRouteContractId,
    routeContractProgress: {
      ...state.routeContractProgress,
      [contract.id]: {
        ...progress,
        claimed: true,
      },
    },
    routeMilestones: {
      ...state.routeMilestones,
      [contract.milestoneId]: true,
    },
  };

  next = applyRewards(next, contract.rewards);
  return applyEffects(next, contract.effects);
}

export function normalizeRouteContractProgress(
  stored: Record<string, Partial<RouteContractProgress>> | undefined,
): Record<string, RouteContractProgress> {
  const normalized: Record<string, RouteContractProgress> = {};
  for (const [contractId, progress] of Object.entries(stored ?? {})) {
    if (!contractIds.has(contractId) || progress.contractId !== contractId) {
      continue;
    }
    normalized[contractId] = {
      contractId,
      acceptedAtDay: Math.max(1, Math.floor(progress.acceptedAtDay ?? 1)),
      deliveredQuantityAtStart: Math.max(0, Math.floor(progress.deliveredQuantityAtStart ?? 0)),
      routeCompletionsAtStart: Math.max(0, Math.floor(progress.routeCompletionsAtStart ?? 0)),
      eventSuccessesAtStart: Math.max(0, Math.floor(progress.eventSuccessesAtStart ?? 0)),
      requiredEventDeliveredQuantityAtClear:
        progress.requiredEventDeliveredQuantityAtClear === undefined
          ? undefined
          : Math.max(0, Math.floor(progress.requiredEventDeliveredQuantityAtClear)),
      claimed: progress.claimed === true,
    };
  }
  return normalized;
}

export function normalizeRouteMilestones(stored: Partial<RouteMilestones> | undefined): RouteMilestones {
  const normalized: RouteMilestones = {};
  for (const [milestoneId, reached] of Object.entries(stored ?? {})) {
    if (milestoneIds.has(milestoneId) && reached === true) {
      normalized[milestoneId] = true;
    }
  }
  return normalized;
}

export function routeContractCompleted(state: PlayerState, contractId: string): boolean {
  const progress = state.routeContractProgress[contractId];
  return progress?.claimed === true;
}

export function routeMilestoneReached(state: PlayerState, milestoneId: string): boolean {
  return state.routeMilestones[milestoneId] === true;
}

export function routeContractRequiresGood(contract: RouteContractDefinition | string, goodId: string): boolean {
  const definition = typeof contract === "string" ? getRouteContract(contract) : contract;
  return definition?.requiredGoodId === goodId;
}

export function routeContractHasRequiredCargo(state: PlayerState, contract: RouteContractDefinition | string): boolean {
  const definition = typeof contract === "string" ? getRouteContract(contract) : contract;
  return definition ? hasRequiredCargo(state, definition) : false;
}

export function routeContractRequiredEventCleared(state: PlayerState, contract: RouteContractDefinition | string): boolean {
  const definition = typeof contract === "string" ? getRouteContract(contract) : contract;
  return definition ? requiredEventClearedSinceStart(state, definition, state.routeContractProgress[definition.id]) : true;
}

export function routeContractRequiredEventStatus(
  state: PlayerState,
  contract: RouteContractDefinition | string,
): {
  eventId?: VoyageEventId;
  label: string;
  required: boolean;
  cleared: boolean;
  attempts: number;
  successes: number;
  successesAtStart: number;
} | undefined {
  const definition = typeof contract === "string" ? getRouteContract(contract) : contract;
  if (!definition) {
    return undefined;
  }
  const eventId = definition.requiredEventId;
  const history = eventId ? state.voyageEventHistory[eventId] : undefined;
  const progress = state.routeContractProgress[definition.id];
  return {
    eventId,
    label: routeContractEventLabel(eventId),
    required: Boolean(eventId),
    cleared: requiredEventClearedSinceStart(state, definition, progress),
    attempts: history?.attempts ?? 0,
    successes: history?.successes ?? 0,
    successesAtStart: progress?.eventSuccessesAtStart ?? 0,
  };
}

export function routeContractEventLabel(eventId: RouteContractDefinition["requiredEventId"]): string {
  return eventLabel(eventId);
}

export function markRouteContractRequiredEventCleared(state: PlayerState, eventId: VoyageEventId): PlayerState {
  const contract = getActiveRouteContract(state);
  const progress = contract ? state.routeContractProgress[contract.id] : undefined;
  if (!contract || !progress || contract.requiredEventId !== eventId) {
    return state;
  }
  if (!requiredEventClearedSinceStart(state, contract, progress)) {
    return state;
  }

  const deliveredAtClear = deliveredQuantity(state, contract);
  return {
    ...state,
    routeContractProgress: {
      ...state.routeContractProgress,
      [contract.id]: {
        ...progress,
        requiredEventDeliveredQuantityAtClear:
          progress.requiredEventDeliveredQuantityAtClear === undefined
            ? deliveredAtClear
            : Math.min(progress.requiredEventDeliveredQuantityAtClear, deliveredAtClear),
      },
    },
  };
}

function hasRequiredCargo(state: PlayerState, contract: RouteContractDefinition): boolean {
  const quantity = state.cargoHold
    .filter((lot) => lot.goodId === contract.requiredGoodId && lot.originPortId === contract.fromPortId)
    .reduce((sum, lot) => sum + lot.quantity, 0);
  return quantity >= contract.requiredQuantity;
}

function deliveredQuantity(state: PlayerState, contract: RouteContractDefinition): number {
  return state.tradeLedger.deliveredGoods[deliveredGoodKey(contract.requiredGoodId, contract.toPortId)] ?? 0;
}

function routeCompletions(state: PlayerState, contract: RouteContractDefinition): number {
  return state.tradeRouteHistory[routeKey(contract.fromPortId, contract.toPortId)]?.completed ?? 0;
}

function eventSuccesses(state: PlayerState, contract: RouteContractDefinition): number {
  return contract.requiredEventId ? (state.voyageEventHistory[contract.requiredEventId]?.successes ?? 0) : 0;
}

function requiredEventClearedSinceStart(
  state: PlayerState,
  contract: RouteContractDefinition,
  progress: RouteContractProgress | undefined,
): boolean {
  if (!contract.requiredEventId) {
    return true;
  }
  return eventSuccesses(state, contract) > (progress?.eventSuccessesAtStart ?? 0);
}

function requiredDeliveryAfterEventClear(
  state: PlayerState,
  contract: RouteContractDefinition,
  progress: RouteContractProgress | undefined,
): boolean {
  if (!contract.requiredEventId) {
    return true;
  }
  if (!progress || !requiredEventClearedSinceStart(state, contract, progress)) {
    return false;
  }
  const deliveredAtClear = progress.requiredEventDeliveredQuantityAtClear;
  return deliveredAtClear !== undefined && deliveredQuantity(state, contract) >= deliveredAtClear + contract.requiredQuantity;
}

function eventLabel(eventId: RouteContractDefinition["requiredEventId"]): string {
  if (!eventId) {
    return "항로";
  }
  const event = getVoyageEvent(eventId);
  if (event) {
    return event.label;
  }
  return eventId === "ghost-lighthouse" ? "유령 등대"
    : eventId === "drifting-crate" ? "표류 상자"
      : eventId === "mischievous-pirate-crab-swarm" ? "해적게 무리"
        : eventId === "starlight-backflow" ? "별빛 역류"
          : eventId === "deep-sea-bell" ? "심해 종소리"
            : eventId === "black-reef-vortex" ? "검은 암초 소용돌이"
              : "위험 항로";
}

function routeContractRequirementsMet(state: PlayerState, requirements: StoryCondition[] = []): boolean {
  return requirements.every((condition) => {
    switch (condition.kind) {
      case "questClaimed":
        return state.questProgress[condition.questId]?.claimed === true;
      case "storyFlag":
        return (state.storyFlags[condition.flag] ?? false) === (condition.value ?? true);
      case "notStoryFlag":
        return !state.storyFlags[condition.flag];
      case "levelAtLeast":
        return state.level >= condition.level;
      case "portVisited":
        return state.visitedPortIds.includes(condition.portId);
      case "portReputationAtLeast":
        return (state.portReputation[condition.portId] ?? 0) >= condition.reputation;
      case "tradeProfitAtLeast":
        return state.tradeLedger.totalProfit >= condition.profit;
      case "completeTradeRoute":
        return (state.tradeRouteHistory[routeKey(condition.fromPortId, condition.toPortId)]?.completed ?? 0) >= condition.count;
      case "routeContractCompleted":
        return routeContractCompleted(state, condition.contractId);
      case "routeMilestoneReached":
        return routeMilestoneReached(state, condition.milestoneId);
      default:
        return true;
    }
  });
}

function applyRewards(state: PlayerState, rewards: StoryRewards): PlayerState {
  let next: PlayerState = {
    ...state,
    shells: state.shells + (rewards.shells ?? 0),
  };

  next = addContractXp(next, rewards.xp ?? 0);

  if (rewards.itemId && !next.ownedItemIds.includes(rewards.itemId)) {
    next = {
      ...next,
      ownedItemIds: [...next.ownedItemIds, rewards.itemId],
    };
  }

  for (const reward of rewards.portReputation ?? []) {
    next = addPortReputation(next, reward.portId, reward.amount);
  }

  return next;
}

function applyEffects(state: PlayerState, effects: StoryEffect | undefined): PlayerState {
  if (!effects) {
    return state;
  }
  return {
    ...state,
    storyFlags: {
      ...state.storyFlags,
      ...Object.fromEntries((effects.setFlags ?? []).map((flag) => [flag, true])),
    },
    unlockedAreaIds: Array.from(new Set([...state.unlockedAreaIds, ...(effects.unlockAreaIds ?? [])])),
  };
}

function addContractXp(state: PlayerState, xp: number): PlayerState {
  let next = { ...state, xp: state.xp + Math.max(0, Math.floor(xp)) };
  while (next.xp >= xpForLevel(next.level)) {
    next = {
      ...next,
      xp: next.xp - xpForLevel(next.level),
      level: next.level + 1,
    };
  }
  return next;
}

function xpForLevel(level: number): number {
  return 45 + (level - 1) * 35;
}

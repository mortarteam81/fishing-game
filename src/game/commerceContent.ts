import type {
  AreaTheme,
  PortDefinition,
  PortService,
  QuestDefinition,
  Rarity,
  StoryCondition,
  TradeGoodCategory,
  TradeGoodDefinition,
} from "./types";

type PortBlueprint = {
  id: string;
  name: string;
  region: string;
  requiredLevel: number;
  theme: AreaTheme;
  connectedAreaIds: string[];
  services: PortService[];
  description: string;
  requirements?: StoryCondition[];
  position: { x: number; y: number };
};

const portBlueprints: PortBlueprint[] = [
  {
    id: "sunrise-port",
    name: "햇살항",
    region: "초심자의 푸른만",
    requiredLevel: 1,
    theme: "beach",
    connectedAreaIds: ["sunny-beach", "little-pier"],
    services: ["market", "shipyard", "quests", "inn"],
    description: "모든 교역 원정이 시작되는 밝은 항구예요. 값싼 식료와 기초 선박재가 많아요.",
    position: { x: 320, y: 980 },
  },
  {
    id: "coralworks-port",
    name: "산호공방항",
    region: "붉은 산호 작업구",
    requiredLevel: 18,
    theme: "coral",
    connectedAreaIds: ["coral-sea", "pearl-lagoon"],
    services: ["market", "research", "quests"],
    description: "산호 장인들이 공예품과 연구 장비를 만드는 따뜻한 공방 항구예요.",
    position: { x: 1080, y: 720 },
  },
  {
    id: "mistfjord-port",
    name: "안개협만항",
    region: "회청 안개 수로",
    requiredLevel: 32,
    theme: "mist",
    connectedAreaIds: ["misty-fjord", "moonlit-current"],
    services: ["market", "research", "quests", "inn"],
    description: "안개 속 항로 소문이 모이는 항구예요. 지도와 보존 식량 수요가 커요.",
    position: { x: 560, y: 430 },
  },
  {
    id: "kelpmarket-port",
    name: "해초시장항",
    region: "초록 해초 숲",
    requiredLevel: 44,
    theme: "kelp",
    connectedAreaIds: ["kelp-forest", "amber-archipelago"],
    services: ["market", "research", "quests"],
    description: "해초 차와 향료, 생태 연구 재료가 오가는 느긋한 시장 항구예요.",
    position: { x: 1230, y: 420 },
  },
  {
    id: "basalt-shipyard",
    name: "현무암조선항",
    region: "검은 절벽 조선소",
    requiredLevel: 58,
    theme: "basalt",
    connectedAreaIds: ["basalt-cove", "storm-bank"],
    services: ["market", "shipyard", "quests"],
    description: "두꺼운 선체와 폭풍용 닻을 만드는 조선 항구예요.",
    position: { x: 1880, y: 620 },
  },
  {
    id: "pearlbay-port",
    name: "진주만항",
    region: "진주빛 석호",
    requiredLevel: 72,
    theme: "pearl",
    connectedAreaIds: ["pearl-lagoon", "aurora-reef"],
    services: ["market", "research", "quests", "inn"],
    description: "진주 세공품과 축제 물품이 비싸게 거래되는 화려한 항구예요.",
    position: { x: 2180, y: 1040 },
  },
  {
    id: "stormcompass-port",
    name: "폭풍나침항",
    region: "먹구름 해협",
    requiredLevel: 86,
    theme: "storm",
    connectedAreaIds: ["storm-bank", "tempest-pass"],
    services: ["market", "shipyard", "quests"],
    description: "거친 항로를 통과한 선장들이 보너스를 받는 위험 교역의 중심지예요.",
    position: { x: 1760, y: 1510 },
  },
  {
    id: "aurora-tradepost",
    name: "극광교역항",
    region: "오로라 산호권",
    requiredLevel: 100,
    theme: "aurora",
    connectedAreaIds: ["aurora-reef", "aurora-crown"],
    services: ["market", "research", "quests", "inn"],
    description: "오로라 축제와 변이 연구품 수요가 크게 출렁이는 고급 교역항이에요.",
    position: { x: 2360, y: 1510 },
  },
  {
    id: "starwhale-observatory",
    name: "별고래관측항",
    region: "별숨 외양",
    requiredLevel: 118,
    theme: "moon",
    connectedAreaIds: ["starwhale-lookout", "moonhalo-whale-bay", "stars-breath-open-sea"],
    services: ["market", "research", "quests"],
    description: "고래류 연구품과 별빛 유물이 오가는 원정 항구예요.",
    requirements: [{ kind: "storyFlag", flag: "ancient-witness" }],
    position: { x: 1120, y: 2260 },
  },
  {
    id: "deepcrown-port",
    name: "심해왕관항",
    region: "고대 왕관해",
    requiredLevel: 150,
    theme: "trench",
    connectedAreaIds: ["crown-seafloor-gate", "black-pearl-abyss", "deep-crown-castle"],
    services: ["market", "shipyard", "research", "quests"],
    description: "고대 왕관 유물과 심해 선박재가 거래되는 최후반 항구예요.",
    requirements: [{ kind: "questClaimed", questId: "deep-crown-gate" }],
    position: { x: 2140, y: 2740 },
  },
];

const categoryBlueprints: Array<{
  category: TradeGoodCategory;
  label: string;
  suffix: string;
  basePrice: number;
  volume: number;
  volatility: number;
  rarity: Rarity;
}> = [
  { category: "food", label: "식료", suffix: "도시락", basePrice: 72, volume: 1, volatility: 0.16, rarity: "common" },
  { category: "craft", label: "공예", suffix: "공예품", basePrice: 138, volume: 1, volatility: 0.22, rarity: "uncommon" },
  { category: "shipPart", label: "선박재", suffix: "선박재", basePrice: 226, volume: 2, volatility: 0.18, rarity: "rare" },
  { category: "research", label: "연구재", suffix: "연구상자", basePrice: 318, volume: 2, volatility: 0.26, rarity: "epic" },
  { category: "festival", label: "축제", suffix: "축제상자", basePrice: 440, volume: 3, volatility: 0.34, rarity: "mythic" },
  { category: "relic", label: "유물", suffix: "유물함", basePrice: 620, volume: 3, volatility: 0.38, rarity: "legendary" },
];

const portGoodPrefixes = [
  "햇살",
  "산호",
  "안개",
  "해초",
  "현무암",
  "진주",
  "폭풍",
  "극광",
  "별고래",
  "심해왕관",
] as const;

function goodId(portId: string, category: TradeGoodCategory): string {
  return `${portId}-${category}`;
}

export const tradeGoods: TradeGoodDefinition[] = portBlueprints.flatMap((port, portIndex) =>
  categoryBlueprints.map((category, categoryIndex) => {
    const demandPortIds = [2, 4, 6]
      .map((offset) => portBlueprints[(portIndex + categoryIndex + offset) % portBlueprints.length].id)
      .filter((portId) => portId !== port.id);
    return {
      id: goodId(port.id, category.category),
      name: `${portGoodPrefixes[portIndex]} ${category.suffix}`,
      category: category.category,
      basePrice: category.basePrice + portIndex * 38 + categoryIndex * 18,
      volume: category.volume,
      originPortId: port.id,
      demandPortIds,
      volatility: category.volatility,
      rarity: category.rarity,
      unlockConditions: port.requiredLevel > 1 ? [{ kind: "levelAtLeast", level: Math.max(1, port.requiredLevel - 8) }] : undefined,
    };
  }),
);

export const ports: PortDefinition[] = portBlueprints.map((port, index) => {
  const specialtyGoodIds = categoryBlueprints.map((category) => goodId(port.id, category.category));
  const demandGoodIds = tradeGoods
    .filter((good) => good.demandPortIds.includes(port.id))
    .slice(0, 10)
    .map((good) => good.id);
  return {
    ...port,
    specialtyGoodIds,
    demandGoodIds,
    reputationRewards: [
      { reputation: 25, label: `${port.name} 시장 단골`, shells: 420 + index * 120 },
      { reputation: 60, label: `${port.name} 신뢰 선장`, shells: 900 + index * 180 },
      { reputation: 100, label: `${port.name} 명예 상단`, shells: 1600 + index * 260 },
    ],
  };
});

const deliveryPairs = [
  ["sunrise-port", "coralworks-port", "sunrise-port-food"],
  ["coralworks-port", "mistfjord-port", "coralworks-port-craft"],
  ["mistfjord-port", "kelpmarket-port", "mistfjord-port-research"],
  ["kelpmarket-port", "basalt-shipyard", "kelpmarket-port-food"],
  ["basalt-shipyard", "pearlbay-port", "basalt-shipyard-shipPart"],
  ["pearlbay-port", "stormcompass-port", "pearlbay-port-festival"],
  ["stormcompass-port", "aurora-tradepost", "stormcompass-port-shipPart"],
  ["aurora-tradepost", "starwhale-observatory", "aurora-tradepost-research"],
  ["starwhale-observatory", "deepcrown-port", "starwhale-observatory-relic"],
  ["deepcrown-port", "aurora-tradepost", "deepcrown-port-relic"],
] as const;

const reputationTargets = [
  ["sunrise-port", 25],
  ["coralworks-port", 35],
  ["mistfjord-port", 45],
  ["basalt-shipyard", 55],
  ["stormcompass-port", 65],
  ["deepcrown-port", 80],
] as const;

const routeTargets = [
  ["sunrise-port", "pearlbay-port", 2],
  ["coralworks-port", "stormcompass-port", 2],
  ["mistfjord-port", "aurora-tradepost", 2],
  ["kelpmarket-port", "starwhale-observatory", 2],
  ["basalt-shipyard", "deepcrown-port", 2],
  ["aurora-tradepost", "deepcrown-port", 3],
  ["starwhale-observatory", "deepcrown-port", 3],
  ["deepcrown-port", "sunrise-port", 1],
] as const;

export const tradeQuests: QuestDefinition[] = [
  ...deliveryPairs.map<QuestDefinition>(([fromPortId, toPortId, goodIdValue], index) => ({
    id: `trade-delivery-${index + 1}`,
    chapterId: index < 7 ? "blue-route-trade" : "crown-route-restoration",
    title: `${ports.find((port) => port.id === toPortId)?.name ?? "항구"} 납품 의뢰`,
    helper: `${ports.find((port) => port.id === fromPortId)?.name ?? "출발항"} 특산품을 싣고 수요 항구에 팔아 평판을 올려요.`,
    requirements: [
      { kind: "levelAtLeast", level: Math.max(30, portBlueprints.find((port) => port.id === fromPortId)?.requiredLevel ?? 30) },
      { kind: "portVisited", portId: fromPortId },
    ],
    steps: [
      { kind: "sellTradeGood", goodId: goodIdValue, portId: toPortId, quantity: index >= 7 ? 2 : 1 },
      { kind: "completeTradeRoute", fromPortId, toPortId, count: 1 },
    ],
    rewards: {
      shells: 720 + index * 220,
      xp: 120 + index * 48,
      portReputation: [{ portId: toPortId, amount: 12 + index }],
    },
    effects: index === 0 ? { setFlags: ["blue-route-company"] } : undefined,
  })),
  ...reputationTargets.map<QuestDefinition>(([portId, reputation], index) => ({
    id: `trade-reputation-${index + 1}`,
    chapterId: index < 4 ? "blue-route-trade" : "crown-route-restoration",
    title: `${ports.find((port) => port.id === portId)?.name ?? "항구"} 신뢰 쌓기`,
    helper: "거래와 납품을 이어가며 항구 사람들이 믿는 선장이 되어봐요.",
    requirements: [{ kind: "levelAtLeast", level: 40 + index * 16 }],
    steps: [{ kind: "portReputationAtLeast", portId, reputation }],
    rewards: {
      shells: 1000 + index * 360,
      xp: 220 + index * 70,
      portReputation: [{ portId, amount: 10 }],
    },
  })),
  ...routeTargets.map<QuestDefinition>(([fromPortId, toPortId, count], index) => ({
    id: `trade-route-${index + 1}`,
    chapterId: index < 5 ? "blue-route-trade" : "crown-route-restoration",
    title: `${ports.find((port) => port.id === fromPortId)?.name ?? "출발항"}-` +
      `${ports.find((port) => port.id === toPortId)?.name ?? "도착항"} 교역로`,
    helper: "먼 항구를 잇는 장거리 교역으로 상단의 이름을 알려요.",
    requirements: [
      { kind: "levelAtLeast", level: 60 + index * 12 },
      { kind: "portVisited", portId: fromPortId },
    ],
    steps: [
      { kind: "completeTradeRoute", fromPortId, toPortId, count },
      { kind: "tradeProfitAtLeast", profit: 1400 + index * 620 },
    ],
    rewards: {
      shells: 1600 + index * 520,
      xp: 320 + index * 92,
      portReputation: [
        { portId: fromPortId, amount: 8 + index },
        { portId: toPortId, amount: 12 + index },
      ],
    },
    effects: index === routeTargets.length - 1 ? { setFlags: ["crown-route-restored"] } : undefined,
  })),
];

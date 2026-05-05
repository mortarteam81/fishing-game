export type Rarity = "common" | "uncommon" | "rare" | "epic" | "mythic" | "legendary" | "ancient";

export type SeaFriendFamily =
  | "fish"
  | "crustacean"
  | "mollusk"
  | "jelly"
  | "whale"
  | "reptile"
  | "echinoderm"
  | "deep"
  | "spirit";

export type SeaFriendHabitat =
  | "coastal"
  | "pier"
  | "coral"
  | "mist"
  | "kelp"
  | "basalt"
  | "pearl"
  | "storm"
  | "moon"
  | "amber"
  | "glacier"
  | "trench"
  | "aurora"
  | "legend"
  | "ancient";

export type SeaFriendSize = "tiny" | "small" | "medium" | "large" | "giant";

export type SeaFriendBehavior =
  | "swift"
  | "shy"
  | "steady"
  | "heavy"
  | "drifting"
  | "nocturnal"
  | "erratic"
  | "glowing"
  | "ancient";

export type AreaTheme =
  | "beach"
  | "pier"
  | "coral"
  | "mist"
  | "kelp"
  | "basalt"
  | "pearl"
  | "storm"
  | "moon"
  | "amber"
  | "glacier"
  | "trench"
  | "aurora";

export type WeatherKind = "clear" | "fog" | "rain" | "storm" | "moonTide" | "aurora";

export type WeatherDefinition = {
  id: WeatherKind;
  label: string;
  description: string;
  tint: number;
  effect?: {
    catchEase?: number;
    lureSpeed?: number;
    rareBoost?: number;
    mutationChance?: number;
  };
};

export type ChapterId =
  | "starwhale-expedition"
  | "deep-crown-survey"
  | "blue-route-trade"
  | "crown-route-restoration";

export type VoyageEventId =
  | "current-breakthrough"
  | "deep-shadow"
  | "pirate-crab"
  | "storm-spout"
  | "reef-maze";

export type GearRole =
  | "starter"
  | "navigator"
  | "reeler"
  | "naturalist"
  | "stormbreaker"
  | "deepExplorer"
  | "mythSeeker"
  | "mutationHunter";

export type CaptainStyle = {
  presetId: string;
  name: string;
  skinTone: number;
  hairTint: number;
  outfitTint: number;
  accentTint: number;
};

export type StoryCondition =
  | {
      kind: "questClaimed";
      questId: string;
    }
  | {
      kind: "storyFlag";
      flag: string;
      value?: boolean;
    }
  | {
      kind: "notStoryFlag";
      flag: string;
    }
  | {
      kind: "researchRank";
      fishId: string;
      rank: number;
    }
  | {
      kind: "collectedVariants";
      count: number;
    }
  | {
      kind: "levelAtLeast";
      level: number;
    }
  | {
      kind: "collectionCount";
      count: number;
      family?: SeaFriendFamily;
    }
  | {
      kind: "companionAffinity";
      fishId: string;
      affinity: number;
    }
  | {
      kind: "equippedGearRole";
      role: GearRole;
      synergyLevel?: number;
    }
  | {
      kind: "ownedItem";
      itemId: string;
    }
  | {
      kind: "areaDiscovered";
      areaId: string;
    }
  | {
      kind: "voyageEventCleared";
      eventId: VoyageEventId;
    }
  | {
      kind: "portVisited";
      portId: string;
    }
  | {
      kind: "portReputationAtLeast";
      portId: string;
      reputation: number;
    }
  | {
      kind: "tradeProfitAtLeast";
      profit: number;
    }
  | {
      kind: "completeTradeRoute";
      fromPortId: string;
      toPortId: string;
      count: number;
    };

export type StoryRewards = {
  shells?: number;
  xp?: number;
  itemId?: string;
  portReputation?: Array<{ portId: string; amount: number }>;
};

export type StoryEffect = {
  setFlags?: string[];
  unlockAreaIds?: string[];
};

export type CatchQuality = "miss" | "nice" | "great" | "sparkle";

export type CatchMutationId = "gleaming" | "tidekissed" | "aurora";

export type DexResearchRecord = {
  catches: number;
  points: number;
  bestQuality?: CatchQuality;
  lastAreaId?: string;
  completedAt?: string;
};

export type VariantCollection = Partial<Record<CatchMutationId, number>>;

export type FishDefinition = {
  id: string;
  name: string;
  chapterId?: ChapterId;
  areaIds: string[];
  rarity: Rarity;
  family: SeaFriendFamily;
  habitatTags: SeaFriendHabitat[];
  size: SeaFriendSize;
  behaviorTags: SeaFriendBehavior[];
  baseShells: number;
  xp: number;
  spawnWeight: number;
  funFact: string;
  assetKey: string;
};

export type AreaDefinition = {
  id: string;
  name: string;
  chapterId?: ChapterId;
  requiredLevel: number;
  fishIds: string[];
  backgroundKey: string;
  theme: AreaTheme;
  mapTexture: string;
  flavor: string;
  hidden?: boolean;
  weatherPool?: WeatherKind[];
  route?: {
    discoveryLevel: number;
    discoveryHint: string;
    revealText: string;
    requirements?: StoryCondition[];
  };
};

export type ItemDefinition = {
  id: string;
  name: string;
  chapterId?: ChapterId;
  kind: "rod" | "bait" | "boat" | "boatCosmetic";
  shellCost: number;
  description: string;
  roleTags?: GearRole[];
  setId?: string;
  effect?: {
    catchEase?: number;
    lureSpeed?: number;
    reelPower?: number;
    rareBoost?: number;
    mutationChance?: number;
    boatSpeed?: number;
    areaUnlock?: string;
    rarityBoosts?: Partial<Record<Rarity, number>>;
    familyBoost?: SeaFriendFamily;
    habitatBoost?: SeaFriendHabitat;
    cargoCapacity?: number;
    tradeBonus?: number;
    routeRiskReduction?: number;
    marketInsight?: number;
  };
};

export type GearBuildProfile = {
  primaryRole: GearRole;
  label: string;
  shortLabel: string;
  description: string;
  score: number;
  synergyLevel: number;
  roleScores: Partial<Record<GearRole, number>>;
  effect: {
    catchEase?: number;
    lureSpeed?: number;
    reelPower?: number;
    rareBoost?: number;
    mutationChance?: number;
    boatSpeed?: number;
    affinityBoost?: number;
  };
};

export type QuestStep =
  | {
      kind: "catchFish";
      fishId: string;
      count: number;
    }
  | {
      kind: "catchAny";
      count: number;
    }
  | {
      kind: "collectUnique";
      count: number;
    }
  | {
      kind: "reachLevel";
      level: number;
    }
  | {
      kind: "ownItem";
      itemId: string;
    }
  | {
      kind: "unlockArea";
      areaId: string;
    }
  | {
      kind: "researchRank";
      fishId: string;
      rank: number;
    }
  | {
      kind: "completeResearch";
      count: number;
    }
  | {
      kind: "collectVariants";
      count: number;
    }
  | {
      kind: "clearVoyageEvent";
      eventId: VoyageEventId;
    }
  | {
      kind: "raiseCompanionAffinity";
      fishId: string;
      affinity: number;
    }
  | {
      kind: "discoverArea";
      areaId: string;
    }
  | {
      kind: "portVisited";
      portId: string;
    }
  | {
      kind: "portReputationAtLeast";
      portId: string;
      reputation: number;
    }
  | {
      kind: "tradeProfitAtLeast";
      profit: number;
    }
  | {
      kind: "deliverTradeGood";
      goodId: string;
      portId: string;
      quantity: number;
    }
  | {
      kind: "sellTradeGood";
      goodId: string;
      portId: string;
      quantity: number;
    }
  | {
      kind: "completeTradeRoute";
      fromPortId: string;
      toPortId: string;
      count: number;
    };

export type QuestDefinition = {
  id: string;
  chapterId?: ChapterId;
  title: string;
  helper: string;
  steps: QuestStep[];
  requirements?: StoryCondition[];
  rewards: StoryRewards;
  effects?: StoryEffect;
};

export type StoryChoiceOption = {
  id: string;
  label: string;
  description: string;
  setFlags: string[];
  rewards?: StoryRewards;
};

export type StoryChoiceDefinition = {
  id: string;
  title: string;
  helper: string;
  requirements: StoryCondition[];
  options: StoryChoiceOption[];
};

export type QuestProgress = {
  completed: boolean;
  claimed: boolean;
};

export type PlayerState = {
  saveVersion: 8;
  shells: number;
  level: number;
  xp: number;
  activeChapterId?: ChapterId;
  chapterProgress: Record<ChapterId, { started: boolean; completed: boolean; score: number }>;
  voyageEventHistory: Record<VoyageEventId, { attempts: number; successes: number; lastOutcome?: "success" | "fail" }>;
  collection: Record<string, number>;
  researchProgress: Record<string, DexResearchRecord>;
  variantCollection: Record<string, VariantCollection>;
  companions: string[];
  equippedCompanionIds: string[];
  affinity: Record<string, number>;
  discoveredAreaIds: string[];
  captain: CaptainStyle;
  equippedRodId: string;
  equippedBaitId?: string;
  equippedBoatId: string;
  equippedBoatCosmeticId?: string;
  ownedItemIds: string[];
  unlockedAreaIds: string[];
  questProgress: Record<string, QuestProgress>;
  storyFlags: Record<string, boolean>;
  choiceHistory: Record<string, string>;
  currentPortId: string;
  visitedPortIds: string[];
  cargoHold: CargoLot[];
  portReputation: Record<string, number>;
  tradeLedger: TradeLedger;
  marketState: MarketState;
  tradeRouteHistory: Record<string, TradeRouteRecord>;
  muted: boolean;
};

export type PortService = "market" | "shipyard" | "research" | "quests" | "inn";

export type PortDefinition = {
  id: string;
  name: string;
  region: string;
  requiredLevel: number;
  connectedAreaIds: string[];
  specialtyGoodIds: string[];
  demandGoodIds: string[];
  services: PortService[];
  theme: AreaTheme;
  description: string;
  requirements?: StoryCondition[];
  position: { x: number; y: number };
  reputationRewards: Array<{ reputation: number; label: string; shells?: number; itemId?: string }>;
};

export type TradeGoodCategory = "food" | "craft" | "shipPart" | "research" | "festival" | "relic";

export type TradeGoodDefinition = {
  id: string;
  name: string;
  category: TradeGoodCategory;
  basePrice: number;
  volume: number;
  originPortId: string;
  demandPortIds: string[];
  volatility: number;
  rarity: Rarity;
  unlockConditions?: StoryCondition[];
};

export type CargoLot = {
  goodId: string;
  quantity: number;
  averageCost: number;
  originPortId: string;
  condition: number;
};

export type TradeLedger = {
  totalProfit: number;
  totalRevenue: number;
  totalSpend: number;
  completedRoutes: number;
  deliveredGoods: Record<string, number>;
  soldGoodsByPort: Record<string, number>;
  bestProfit: number;
};

export type MarketState = {
  day: number;
  seed: number;
  featuredGoodIdsByPort: Record<string, string>;
  portMoodById: Record<string, "surplus" | "steady" | "shortage" | "festival">;
};

export type TradeRouteRecord = {
  completed: number;
  bestProfit: number;
  lastCompletedDay: number;
};

export type FishingAttempt = {
  areaId: string;
  fish: FishDefinition;
  weather: WeatherDefinition;
  biteDelayMs: number;
  targetCenter: number;
  targetWidth: number;
};

export type CatchMutation = {
  id: CatchMutationId;
  label: string;
  valueMultiplier: number;
  xpMultiplier: number;
  message: string;
  tint: number;
};

export type CatchResearchResult = {
  points: number;
  rankBefore: number;
  rankAfter: number;
  rankLabel: string;
};

export type CatchResult = {
  success: boolean;
  quality: CatchQuality;
  fish?: FishDefinition;
  mutation?: CatchMutation;
  research?: CatchResearchResult;
  shells: number;
  xp: number;
  message: string;
  consolation?: string;
};

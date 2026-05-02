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
    };

export type StoryRewards = {
  shells?: number;
  xp?: number;
  itemId?: string;
};

export type StoryEffect = {
  setFlags?: string[];
  unlockAreaIds?: string[];
};

export type FishDefinition = {
  id: string;
  name: string;
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
  requiredLevel: number;
  fishIds: string[];
  backgroundKey: string;
  theme: AreaTheme;
  mapTexture: string;
  flavor: string;
};

export type ItemDefinition = {
  id: string;
  name: string;
  kind: "rod" | "bait" | "boat" | "boatCosmetic";
  shellCost: number;
  description: string;
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
    };

export type QuestDefinition = {
  id: string;
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
  saveVersion: 3;
  shells: number;
  level: number;
  xp: number;
  collection: Record<string, number>;
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
  muted: boolean;
};

export type FishingAttempt = {
  areaId: string;
  fish: FishDefinition;
  biteDelayMs: number;
  targetCenter: number;
  targetWidth: number;
};

export type CatchQuality = "miss" | "nice" | "great" | "sparkle";

export type CatchMutation = {
  id: "gleaming" | "tidekissed" | "aurora";
  label: string;
  valueMultiplier: number;
  xpMultiplier: number;
  message: string;
  tint: number;
};

export type CatchResult = {
  success: boolean;
  quality: CatchQuality;
  fish?: FishDefinition;
  mutation?: CatchMutation;
  shells: number;
  xp: number;
  message: string;
  consolation?: string;
};

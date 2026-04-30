export type Rarity = "common" | "uncommon" | "rare" | "special";

export type FishDefinition = {
  id: string;
  name: string;
  areaIds: string[];
  rarity: Rarity;
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
};

export type ItemDefinition = {
  id: string;
  name: string;
  kind: "rod" | "bait" | "boatCosmetic";
  shellCost: number;
  description: string;
  effect?: {
    catchEase?: number;
    rareBoost?: number;
    areaUnlock?: string;
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
  rewards: { shells?: number; xp?: number; itemId?: string };
};

export type QuestProgress = {
  completed: boolean;
  claimed: boolean;
};

export type PlayerState = {
  saveVersion: 1;
  shells: number;
  level: number;
  xp: number;
  collection: Record<string, number>;
  equippedRodId: string;
  equippedBaitId?: string;
  ownedItemIds: string[];
  unlockedAreaIds: string[];
  questProgress: Record<string, QuestProgress>;
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

export type CatchResult = {
  success: boolean;
  quality: CatchQuality;
  fish?: FishDefinition;
  shells: number;
  xp: number;
  message: string;
  consolation?: string;
};

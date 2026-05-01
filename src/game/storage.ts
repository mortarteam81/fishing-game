import { areas, quests } from "./content";
import type { PlayerState } from "./types";

const STORAGE_KEY = "banjjakbada-save-v1";

type StoredPlayerState = Omit<Partial<PlayerState>, "saveVersion"> & {
  saveVersion?: number;
};

export const createInitialState = (): PlayerState => ({
  saveVersion: 2,
  shells: 35,
  level: 1,
  xp: 0,
  collection: {},
  equippedRodId: "twig-rod",
  equippedBoatId: "harbor-skiff",
  ownedItemIds: ["twig-rod", "harbor-skiff"],
  unlockedAreaIds: areas.filter((area) => area.requiredLevel <= 1).map((area) => area.id),
  questProgress: Object.fromEntries(
    quests.map((quest) => [quest.id, { completed: false, claimed: false }]),
  ),
  storyFlags: {},
  choiceHistory: {},
  muted: false,
});

export function loadGame(): PlayerState {
  if (typeof localStorage === "undefined") {
    return createInitialState();
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return createInitialState();
  }

  try {
    const parsed = JSON.parse(raw) as StoredPlayerState;
    if (parsed.saveVersion !== 1 && parsed.saveVersion !== 2) {
      return createInitialState();
    }

    const initial = createInitialState();
    return {
      ...initial,
      ...parsed,
      saveVersion: 2,
      collection: { ...initial.collection, ...(parsed.collection ?? {}) },
      equippedBoatId: parsed.equippedBoatId ?? "harbor-skiff",
      ownedItemIds: Array.from(new Set([...(parsed.ownedItemIds ?? []), "twig-rod", "harbor-skiff"])),
      unlockedAreaIds: Array.from(
        new Set([...(initial.unlockedAreaIds ?? []), ...(parsed.unlockedAreaIds ?? [])]),
      ),
      questProgress: {
        ...initial.questProgress,
        ...(parsed.questProgress ?? {}),
      },
      storyFlags: {
        ...initial.storyFlags,
        ...(parsed.storyFlags ?? {}),
      },
      choiceHistory: {
        ...initial.choiceHistory,
        ...(parsed.choiceHistory ?? {}),
      },
    };
  } catch {
    return createInitialState();
  }
}

export function saveGame(state: PlayerState): void {
  if (typeof localStorage === "undefined") {
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, saveVersion: 2 }));
}

export function resetGame(): PlayerState {
  const state = createInitialState();
  saveGame(state);
  return state;
}

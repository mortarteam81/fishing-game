import { areas, quests } from "./content";
import type { PlayerState } from "./types";

const STORAGE_KEY = "banjjakbada-save-v1";

export const createInitialState = (): PlayerState => ({
  saveVersion: 1,
  shells: 35,
  level: 1,
  xp: 0,
  collection: {},
  equippedRodId: "twig-rod",
  ownedItemIds: ["twig-rod"],
  unlockedAreaIds: areas.filter((area) => area.requiredLevel <= 1).map((area) => area.id),
  questProgress: Object.fromEntries(
    quests.map((quest) => [quest.id, { completed: false, claimed: false }]),
  ),
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
    const parsed = JSON.parse(raw) as Partial<PlayerState>;
    if (parsed.saveVersion !== 1) {
      return createInitialState();
    }

    const initial = createInitialState();
    return {
      ...initial,
      ...parsed,
      collection: { ...initial.collection, ...(parsed.collection ?? {}) },
      ownedItemIds: Array.from(new Set([...(parsed.ownedItemIds ?? []), "twig-rod"])),
      unlockedAreaIds: Array.from(
        new Set([...(initial.unlockedAreaIds ?? []), ...(parsed.unlockedAreaIds ?? [])]),
      ),
      questProgress: {
        ...initial.questProgress,
        ...(parsed.questProgress ?? {}),
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

  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetGame(): PlayerState {
  const state = createInitialState();
  saveGame(state);
  return state;
}

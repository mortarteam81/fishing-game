import { areas, quests } from "./content";
import type { CaptainStyle, PlayerState } from "./types";

const STORAGE_KEY = "banjjakbada-save-v1";
const SAVE_SLOT_PREFIX = "banjjakbada-save-slot-";
const SAVE_SLOT_COUNT = 3;
const COOKIE_CHUNK_SIZE = 2800;
const COOKIE_MAX_CHUNKS = 10;
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export type SaveSlotSummary = {
  slotId: number;
  empty: boolean;
  captainName?: string;
  level?: number;
  shells?: number;
  collectionCount?: number;
  savedAt?: string;
};

type StoredPlayerState = Omit<Partial<PlayerState>, "saveVersion"> & {
  saveVersion?: number;
  savedAt?: string;
};

export const defaultCaptain: CaptainStyle = {
  presetId: "harbor-navigator",
  name: "윤슬",
  skinTone: 0xd8ad8b,
  hairTint: 0x2a211c,
  outfitTint: 0x21394b,
  accentTint: 0xe0a253,
};

export const createInitialState = (): PlayerState => ({
  saveVersion: 3,
  shells: 35,
  level: 1,
  xp: 0,
  collection: {},
  captain: defaultCaptain,
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
  const parsedFromLocal = parseStoredState(raw);
  const parsed = parsedFromLocal ?? readCookieBackup(STORAGE_KEY);
  if (!parsed) {
    return createInitialState();
  }
  if (parsedFromLocal) {
    writeCookieBackup(STORAGE_KEY, parsedFromLocal);
  } else {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  }

  return normalizeStoredState(parsed);
}

export function saveGame(state: PlayerState): void {
  if (typeof localStorage === "undefined") {
    return;
  }

  const stored = { ...state, saveVersion: 3 };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  writeCookieBackup(STORAGE_KEY, stored);
}

export function resetGame(): PlayerState {
  const state = createInitialState();
  saveGame(state);
  return state;
}

export function getSaveSlots(): SaveSlotSummary[] {
  if (typeof localStorage === "undefined") {
    return emptySaveSlots();
  }

  return Array.from({ length: SAVE_SLOT_COUNT }, (_, index) => {
    const slotId = index + 1;
    const key = slotKey(slotId);
    const raw = localStorage.getItem(key);
    const parsedFromLocal = parseStoredState(raw);
    const parsed = parsedFromLocal ?? readCookieBackup(key);
    if (!parsed) {
      return { slotId, empty: true };
    }

    if (parsedFromLocal) {
      writeCookieBackup(key, parsedFromLocal);
    } else {
      localStorage.setItem(key, JSON.stringify(parsed));
    }

    const state = normalizeStoredState(parsed);
    return {
      slotId,
      empty: false,
      captainName: state.captain.name,
      level: state.level,
      shells: state.shells,
      collectionCount: Object.values(state.collection).filter((count) => count > 0).length,
      savedAt: parsed.savedAt,
    };
  });
}

export function saveGameToSlot(slotId: number, state: PlayerState): void {
  if (typeof localStorage === "undefined" || !isValidSlot(slotId)) {
    return;
  }

  const key = slotKey(slotId);
  const stored = { ...state, saveVersion: 3, savedAt: new Date().toISOString() };
  localStorage.setItem(key, JSON.stringify(stored));
  writeCookieBackup(key, stored);
}

export function loadGameFromSlot(slotId: number): PlayerState | undefined {
  if (typeof localStorage === "undefined" || !isValidSlot(slotId)) {
    return undefined;
  }

  const key = slotKey(slotId);
  const raw = localStorage.getItem(key);
  const parsedFromLocal = parseStoredState(raw);
  const parsed = parsedFromLocal ?? readCookieBackup(key);
  if (!parsed) {
    return undefined;
  }
  if (parsedFromLocal) {
    writeCookieBackup(key, parsedFromLocal);
  } else {
    localStorage.setItem(key, JSON.stringify(parsed));
  }

  const state = normalizeStoredState(parsed);
  saveGame(state);
  return state;
}

function normalizeStoredState(parsed: StoredPlayerState): PlayerState {
  const initial = createInitialState();
  return {
    ...initial,
    ...parsed,
    saveVersion: 3,
    collection: { ...initial.collection, ...(parsed.collection ?? {}) },
    captain: {
      ...initial.captain,
      ...(parsed.captain ?? {}),
    },
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
}

function emptySaveSlots(): SaveSlotSummary[] {
  return Array.from({ length: SAVE_SLOT_COUNT }, (_, index) => ({ slotId: index + 1, empty: true }));
}

function isValidSlot(slotId: number): boolean {
  return Number.isInteger(slotId) && slotId >= 1 && slotId <= SAVE_SLOT_COUNT;
}

function slotKey(slotId: number): string {
  return `${SAVE_SLOT_PREFIX}${slotId}`;
}

function parseStoredState(raw: string | null): StoredPlayerState | undefined {
  if (!raw) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(raw) as StoredPlayerState;
    if (parsed.saveVersion !== 1 && parsed.saveVersion !== 2 && parsed.saveVersion !== 3) {
      return undefined;
    }
    return parsed;
  } catch {
    return undefined;
  }
}

function writeCookieBackup(key: string, value: StoredPlayerState): void {
  if (typeof document === "undefined") {
    return;
  }

  const encoded = encodeURIComponent(encodePayload(JSON.stringify(value)));
  const chunks = encoded.match(new RegExp(`.{1,${COOKIE_CHUNK_SIZE}}`, "g")) ?? [];
  chunks.slice(0, COOKIE_MAX_CHUNKS).forEach((chunk, index) => {
    document.cookie = `${cookieChunkName(key, index)}=${chunk}; Max-Age=${COOKIE_MAX_AGE}; Path=/; SameSite=Lax`;
  });

  for (let index = chunks.length; index < COOKIE_MAX_CHUNKS; index += 1) {
    document.cookie = `${cookieChunkName(key, index)}=; Max-Age=0; Path=/; SameSite=Lax`;
  }
}

function readCookieBackup(key: string): StoredPlayerState | undefined {
  if (typeof document === "undefined") {
    return undefined;
  }

  const cookies = Object.fromEntries(
    document.cookie
      .split(";")
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry) => {
        const [name, ...value] = entry.split("=");
        return [name, value.join("=")];
      }),
  );

  let encoded = "";
  for (let index = 0; index < COOKIE_MAX_CHUNKS; index += 1) {
    const chunk = cookies[cookieChunkName(key, index)];
    if (!chunk) {
      break;
    }
    encoded += chunk;
  }

  if (!encoded) {
    return undefined;
  }

  try {
    return parseStoredState(decodePayload(decodeURIComponent(encoded)));
  } catch {
    return undefined;
  }
}

function cookieChunkName(key: string, index: number): string {
  return `${key}-backup-${index}`;
}

function encodePayload(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary);
}

function decodePayload(value: string): string {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

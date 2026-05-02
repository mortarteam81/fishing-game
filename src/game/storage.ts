import { areas, quests } from "./content";
import { normalizeAffinity, normalizeCompanions, normalizeEquippedCompanions, STARTER_COMPANION_ID } from "./companions";
import { seedResearchRecord } from "./research";
import type { CaptainStyle, ChapterId, DexResearchRecord, PlayerState, VariantCollection, VoyageEventId } from "./types";

const STORAGE_KEY = "banjjakbada-save-v1";
const SAVE_SLOT_PREFIX = "banjjakbada-save-slot-";
const SAVE_SLOT_COUNT = 3;
const COOKIE_MAX_CHUNKS = 10;
const LOCAL_SAVE_ENDPOINT = "/api/local-save";
const chapterIds: ChapterId[] = ["starwhale-expedition", "deep-crown-survey"];

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
  saveVersion: 7,
  shells: 35,
  level: 1,
  xp: 0,
  chapterProgress: defaultChapterProgress(),
  voyageEventHistory: defaultVoyageEventHistory(),
  collection: {},
  researchProgress: {},
  variantCollection: {},
  companions: [STARTER_COMPANION_ID],
  equippedCompanionIds: [STARTER_COMPANION_ID],
  affinity: { [STARTER_COMPANION_ID]: 34 },
  discoveredAreaIds: [],
  captain: defaultCaptain,
  equippedRodId: "twig-rod",
  equippedBoatId: "harbor-skiff",
  ownedItemIds: ["twig-rod", "harbor-skiff"],
  unlockedAreaIds: areas.filter((area) => !area.hidden && area.requiredLevel <= 1).map((area) => area.id),
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

  const parsed = bestStoredState([parseStoredState(localStorage.getItem(STORAGE_KEY)), ...readLegacyCookieBackups()]);
  if (!parsed) {
    return createInitialState();
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
  clearLegacyCookieBackups();
  return normalizeStoredState(parsed);
}

export function saveGame(state: PlayerState): void {
  if (typeof localStorage === "undefined") {
    return;
  }

  const stored = { ...state, saveVersion: 7 };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  writeServerBackup(STORAGE_KEY, stored);
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
    const parsed = parseStoredState(raw);
    if (!parsed) {
      return { slotId, empty: true };
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
  const stored = { ...state, saveVersion: 7, savedAt: new Date().toISOString() };
  localStorage.setItem(key, JSON.stringify(stored));
  writeServerBackup(key, stored);
}

export function loadGameFromSlot(slotId: number): PlayerState | undefined {
  if (typeof localStorage === "undefined" || !isValidSlot(slotId)) {
    return undefined;
  }

  const key = slotKey(slotId);
  const raw = localStorage.getItem(key);
  const parsed = parseStoredState(raw);
  if (!parsed) {
    return undefined;
  }

  const current = parseStoredState(localStorage.getItem(STORAGE_KEY));
  const state = normalizeStoredState(bestStoredState([current, parsed]) ?? parsed);
  saveGame(state);
  return state;
}

export async function hydrateGameBackup(): Promise<void> {
  if (typeof localStorage === "undefined") {
    return;
  }

  try {
    const response = await fetch(LOCAL_SAVE_ENDPOINT, { method: "GET" });
    if (!response.ok) {
      return;
    }
    const backups = (await response.json()) as Record<string, StoredPlayerState>;
    const keys = storageKeys();
    const allCandidates: StoredPlayerState[] = [];

    for (const key of keys) {
      const backup = backups[key];
      const bestForKey = bestStoredState([
        parseStoredState(localStorage.getItem(key)),
        backup ? parseStoredState(JSON.stringify(backup)) : undefined,
        readLegacyCookieBackup(key),
      ]);

      if (!bestForKey) {
        continue;
      }

      allCandidates.push(bestForKey);
      localStorage.setItem(key, JSON.stringify(bestForKey));
      writeServerBackup(key, bestForKey);
    }

    const bestOverall = bestStoredState(allCandidates);
    const current = parseStoredState(localStorage.getItem(STORAGE_KEY));
    if (bestOverall && progressScore(bestOverall) > progressScore(current)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bestOverall));
      writeServerBackup(STORAGE_KEY, bestOverall);
    }
    clearLegacyCookieBackups();
  } catch {
    // The static production build may not expose the dev-only backup endpoint.
  }
}

function normalizeStoredState(parsed: StoredPlayerState): PlayerState {
  const initial = createInitialState();
  const level = parsed.level ?? initial.level;
  const collection = { ...initial.collection, ...(parsed.collection ?? {}) };
  const companions = normalizeCompanions(parsed.companions, collection);
  const equippedCompanionIds = normalizeEquippedCompanions(parsed.equippedCompanionIds, companions);
  const affinity = normalizeAffinity(parsed.affinity, collection, companions);
  const levelUnlockedAreaIds = areas
    .filter((area) => !area.hidden && area.requiredLevel <= level)
    .map((area) => area.id);
  return {
    ...initial,
    ...parsed,
    saveVersion: 7,
    activeChapterId: parsed.activeChapterId,
    chapterProgress: normalizeChapterProgress(parsed.chapterProgress),
    voyageEventHistory: normalizeVoyageEventHistory(parsed.voyageEventHistory),
    collection,
    researchProgress: normalizeResearchProgress(parsed.researchProgress, collection),
    variantCollection: normalizeVariantCollection(parsed.variantCollection),
    companions,
    equippedCompanionIds,
    affinity,
    discoveredAreaIds: Array.from(new Set([...(parsed.discoveredAreaIds ?? [])])),
    captain: {
      ...initial.captain,
      ...(parsed.captain ?? {}),
    },
    equippedBoatId: parsed.equippedBoatId ?? "harbor-skiff",
    ownedItemIds: Array.from(new Set([...(parsed.ownedItemIds ?? []), "twig-rod", "harbor-skiff"])),
    unlockedAreaIds: Array.from(
      new Set([...(initial.unlockedAreaIds ?? []), ...levelUnlockedAreaIds, ...(parsed.unlockedAreaIds ?? [])]),
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

function storageKeys(): string[] {
  return [STORAGE_KEY, ...Array.from({ length: SAVE_SLOT_COUNT }, (_, index) => slotKey(index + 1))];
}

function parseStoredState(raw: string | null): StoredPlayerState | undefined {
  if (!raw) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(raw) as StoredPlayerState;
    if (
      parsed.saveVersion !== 1 &&
      parsed.saveVersion !== 2 &&
      parsed.saveVersion !== 3 &&
      parsed.saveVersion !== 4 &&
      parsed.saveVersion !== 5 &&
      parsed.saveVersion !== 6 &&
      parsed.saveVersion !== 7
    ) {
      return undefined;
    }
    return parsed;
  } catch {
    return undefined;
  }
}

function writeServerBackup(key: string, value: StoredPlayerState): void {
  if (typeof fetch === "undefined") {
    return;
  }

  void fetch(LOCAL_SAVE_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, value }),
  }).catch(() => undefined);
}

function bestStoredState(candidates: Array<StoredPlayerState | undefined>): StoredPlayerState | undefined {
  return candidates
    .filter((candidate): candidate is StoredPlayerState => Boolean(candidate))
    .sort((left, right) => progressScore(right) - progressScore(left))[0];
}

function progressScore(value: StoredPlayerState | undefined): number {
  if (!value) {
    return 0;
  }

  const collectionCount = Object.values(value.collection ?? {}).reduce((sum, count) => sum + count, 0);
  const researchPoints = Object.values(value.researchProgress ?? {}).reduce(
    (sum, record) => sum + Math.max(0, record?.points ?? 0),
    0,
  );
  const variantCount = Object.values(value.variantCollection ?? {}).reduce(
    (sum, variants) =>
      sum + Object.values(variants ?? {}).reduce((variantSum, count) => variantSum + Math.max(0, count ?? 0), 0),
    0,
  );
  return (
    (value.level ?? 1) * 100000 +
    (value.xp ?? 0) * 100 +
    collectionCount * 50 +
    researchPoints * 12 +
    variantCount * 80 +
    (value.companions?.length ?? 0) * 35 +
    Object.values(value.affinity ?? {}).reduce((sum, affinity) => sum + Math.max(0, affinity ?? 0), 0) * 2 +
    Object.values(value.voyageEventHistory ?? {}).reduce((sum, record) => sum + (record?.successes ?? 0) * 180 + (record?.attempts ?? 0) * 20, 0) +
    Object.values(value.chapterProgress ?? {}).reduce((sum, record) => sum + (record?.score ?? 0), 0) +
    (value.discoveredAreaIds?.length ?? 0) * 120 +
    (value.ownedItemIds?.length ?? 0) * 20 +
    (value.unlockedAreaIds?.length ?? 0) * 20 +
    (value.shells ?? 0)
  );
}

function normalizeResearchProgress(
  stored: Record<string, DexResearchRecord> | undefined,
  collection: Record<string, number>,
): Record<string, DexResearchRecord> {
  const normalized: Record<string, DexResearchRecord> = {};

  for (const [fishId, record] of Object.entries(stored ?? {})) {
    normalized[fishId] = sanitizeResearchRecord(record);
  }

  for (const [fishId, count] of Object.entries(collection)) {
    if (count <= 0) {
      continue;
    }
    const seeded = seedResearchRecord(count);
    const current = normalized[fishId];
    normalized[fishId] = current
      ? {
          ...current,
          catches: Math.max(current.catches, seeded.catches),
          points: Math.max(current.points, seeded.points),
        }
      : seeded;
  }

  return normalized;
}

function sanitizeResearchRecord(record: DexResearchRecord): DexResearchRecord {
  return {
    ...record,
    catches: Math.max(0, Math.floor(record.catches ?? 0)),
    points: Math.max(0, Math.floor(record.points ?? 0)),
  };
}

function normalizeVariantCollection(
  stored: Record<string, VariantCollection> | undefined,
): Record<string, VariantCollection> {
  return Object.fromEntries(
    Object.entries(stored ?? {}).map(([fishId, variants]) => {
      const normalizedVariants: Record<string, number> = {};
      for (const [mutationId, count] of Object.entries(variants ?? {})) {
        const normalizedCount = Math.max(0, Math.floor(count ?? 0));
        if (normalizedCount > 0) {
          normalizedVariants[mutationId] = normalizedCount;
        }
      }
      return [fishId, normalizedVariants];
    }),
  );
}

function defaultChapterProgress(): PlayerState["chapterProgress"] {
  return Object.fromEntries(
    chapterIds.map((chapterId) => [chapterId, { started: false, completed: false, score: 0 }]),
  ) as PlayerState["chapterProgress"];
}

function normalizeChapterProgress(
  stored: Partial<PlayerState["chapterProgress"]> | undefined,
): PlayerState["chapterProgress"] {
  const defaults = defaultChapterProgress();
  for (const chapterId of chapterIds) {
    defaults[chapterId] = {
      ...defaults[chapterId],
      ...(stored?.[chapterId] ?? {}),
      score: Math.max(0, Math.floor(stored?.[chapterId]?.score ?? defaults[chapterId].score)),
    };
  }
  return defaults;
}

function defaultVoyageEventHistory(): PlayerState["voyageEventHistory"] {
  return {
    "current-breakthrough": { attempts: 0, successes: 0 },
    "deep-shadow": { attempts: 0, successes: 0 },
    "pirate-crab": { attempts: 0, successes: 0 },
    "storm-spout": { attempts: 0, successes: 0 },
    "reef-maze": { attempts: 0, successes: 0 },
  };
}

function normalizeVoyageEventHistory(
  stored: Partial<Record<VoyageEventId, { attempts?: number; successes?: number; lastOutcome?: "success" | "fail" }>> | undefined,
): PlayerState["voyageEventHistory"] {
  const defaults = defaultVoyageEventHistory();
  for (const eventId of Object.keys(defaults) as VoyageEventId[]) {
    const record = stored?.[eventId];
    defaults[eventId] = {
      attempts: Math.max(0, Math.floor(record?.attempts ?? 0)),
      successes: Math.max(0, Math.floor(record?.successes ?? 0)),
      lastOutcome: record?.lastOutcome,
    };
  }
  return defaults;
}

function readLegacyCookieBackups(): Array<StoredPlayerState | undefined> {
  return storageKeys().map((key) => readLegacyCookieBackup(key));
}

function readLegacyCookieBackup(key: string): StoredPlayerState | undefined {
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
    const chunk = cookies[`${key}-backup-${index}`];
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

function clearLegacyCookieBackups(): void {
  if (typeof document === "undefined") {
    return;
  }

  for (const key of storageKeys()) {
    for (let index = 0; index < COOKIE_MAX_CHUNKS; index += 1) {
      document.cookie = `${key}-backup-${index}=; Max-Age=0; Path=/; SameSite=Lax`;
    }
  }
}

function decodePayload(value: string): string {
  const binary = atob(value);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

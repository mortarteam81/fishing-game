import type { AreaDefinition, GearRole, PlayerState, VoyageEventId } from "./types";

export type VoyageEventDefinition = {
  id: VoyageEventId;
  label: string;
  shortLabel: string;
  description: string;
  successText: string;
  failText: string;
  tint: number;
  preferredRole?: GearRole;
  areaThemes: AreaDefinition["theme"][];
  reward: {
    shells: number;
    xp: number;
    affinity: number;
  };
};

export const voyageEvents: VoyageEventDefinition[] = [
  {
    id: "current-breakthrough",
    label: "해류 돌파",
    shortLabel: "해류",
    description: "강한 물살 사이의 반짝 구간을 맞춰 빠져나가요.",
    successText: "선체가 물살을 타고 멋지게 빠져나갔어요.",
    failText: "물살을 조금 돌아갔지만 항로 감각은 더 좋아졌어요.",
    tint: 0x46bcc8,
    preferredRole: "navigator",
    areaThemes: ["moon", "aurora", "pearl", "amber"],
    reward: { shells: 460, xp: 140, affinity: 5 },
  },
  {
    id: "deep-shadow",
    label: "심해 그림자",
    shortLabel: "그림자",
    description: "깊은 그림자의 움직임을 읽고 조용히 지나가요.",
    successText: "동료가 그림자를 달래며 깊은 항로 힌트를 찾았어요.",
    failText: "그림자를 피해 돌아갔지만 동료와 조금 더 가까워졌어요.",
    tint: 0x315a73,
    preferredRole: "deepExplorer",
    areaThemes: ["trench", "aurora", "basalt"],
    reward: { shells: 620, xp: 180, affinity: 7 },
  },
  {
    id: "pirate-crab",
    label: "장난꾸러기 해적게",
    shortLabel: "해적게",
    description: "조개를 노리는 해적게의 장난을 타이밍 좋게 막아요.",
    successText: "해적게가 웃으며 반짝 조개를 두고 물러났어요.",
    failText: "조금 놀랐지만 해적게가 길 안내 조개를 남겼어요.",
    tint: 0xf0ad3d,
    preferredRole: "reeler",
    areaThemes: ["coral", "amber", "pier", "pearl"],
    reward: { shells: 540, xp: 150, affinity: 5 },
  },
  {
    id: "storm-spout",
    label: "폭풍 물기둥",
    shortLabel: "폭풍",
    description: "솟구치는 물기둥 사이로 배를 안정적으로 몰아요.",
    successText: "폭풍 물기둥을 가르며 대담한 항로를 기록했어요.",
    failText: "물보라가 크게 튀었지만 배와 동료는 무사해요.",
    tint: 0x5f89a6,
    preferredRole: "stormbreaker",
    areaThemes: ["storm", "glacier", "basalt"],
    reward: { shells: 700, xp: 205, affinity: 8 },
  },
  {
    id: "reef-maze",
    label: "암초 미로",
    shortLabel: "암초",
    description: "얕은 암초 사이의 안전한 길을 기억해 통과해요.",
    successText: "암초 사이에서 숨은 지도 조각을 발견했어요.",
    failText: "천천히 돌아 나왔지만 다음 길이 조금 더 선명해졌어요.",
    tint: 0x69b985,
    preferredRole: "naturalist",
    areaThemes: ["kelp", "coral", "mist", "pearl"],
    reward: { shells: 520, xp: 160, affinity: 6 },
  },
];

export function getVoyageEvent(eventId: VoyageEventId): VoyageEventDefinition | undefined {
  return voyageEvents.find((event) => event.id === eventId);
}

export function voyageEventForArea(area: AreaDefinition): VoyageEventDefinition {
  return (
    voyageEvents.find((event) => event.areaThemes.includes(area.theme)) ??
    voyageEvents[Math.abs(hashString(area.id)) % voyageEvents.length]
  );
}

export function voyageEventCleared(state: PlayerState, eventId: VoyageEventId): boolean {
  return (state.voyageEventHistory[eventId]?.successes ?? 0) > 0;
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return hash;
}

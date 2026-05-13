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
  {
    id: "ghost-lighthouse",
    label: "유령 등대",
    shortLabel: "등대",
    description: "희미한 등대 불빛의 박자를 읽어 안개 항로를 맞춰요.",
    successText: "유령 등대가 따뜻한 빛으로 안전한 길을 비춰줬어요.",
    failText: "안개 속을 천천히 돌았지만 등대의 다음 신호를 배웠어요.",
    tint: 0x9bd7d3,
    preferredRole: "navigator",
    areaThemes: ["mist", "moon", "aurora"],
    reward: { shells: 590, xp: 175, affinity: 6 },
  },
  {
    id: "drifting-crate",
    label: "표류 상자",
    shortLabel: "상자",
    description: "물결에 떠밀려 온 상자를 안전하게 건져 주인을 찾아요.",
    successText: "상자 속 표식 덕분에 항구 사람들에게 고마운 소식을 전했어요.",
    failText: "상자는 멀어졌지만 표류 방향을 기록해 다음 구조에 도움이 됐어요.",
    tint: 0xd9a760,
    preferredRole: "naturalist",
    areaThemes: ["pier", "beach", "amber", "kelp"],
    reward: { shells: 500, xp: 145, affinity: 5 },
  },
  {
    id: "mischievous-pirate-crab-swarm",
    label: "장난꾸러기 해적게 무리",
    shortLabel: "게무리",
    description: "깃발을 흔드는 해적게 무리의 장난 대형을 차분히 풀어요.",
    successText: "해적게들이 박수처럼 집게를 흔들며 작은 보급품을 나눠줬어요.",
    failText: "장난에 조금 헤맸지만 해적게들이 웃으며 우회 항로를 알려줬어요.",
    tint: 0xf28b4b,
    preferredRole: "reeler",
    areaThemes: ["coral", "pier", "amber", "pearl"],
    reward: { shells: 650, xp: 190, affinity: 7 },
  },
  {
    id: "starlight-backflow",
    label: "별빛 역류",
    shortLabel: "역류",
    description: "거꾸로 흐르는 별빛 물살의 리듬을 따라 돛을 조정해요.",
    successText: "별빛 역류를 타고 반짝이는 관측 좌표를 얻었어요.",
    failText: "잠시 뒤로 밀렸지만 별빛의 흐름을 더 또렷하게 기억했어요.",
    tint: 0xb19cff,
    preferredRole: "mythSeeker",
    areaThemes: ["moon", "aurora", "pearl"],
    reward: { shells: 760, xp: 230, affinity: 8 },
  },
  {
    id: "deep-sea-bell",
    label: "심해 종소리",
    shortLabel: "종소리",
    description: "깊은 바다에서 울리는 종소리의 방향을 듣고 안전하게 내려가요.",
    successText: "종소리가 잔잔한 계단처럼 이어져 심해 길을 열어줬어요.",
    failText: "소리가 멀어졌지만 동료와 함께 깊이의 감각을 익혔어요.",
    tint: 0x5f7fb8,
    preferredRole: "deepExplorer",
    areaThemes: ["trench", "moon", "basalt", "aurora"],
    reward: { shells: 820, xp: 250, affinity: 9 },
  },
  {
    id: "black-reef-vortex",
    label: "검은 암초 소용돌이",
    shortLabel: "소용돌이",
    description: "검은 암초 사이를 도는 소용돌이의 빈틈을 찾아 통과해요.",
    successText: "소용돌이의 중심을 벗어나 단단한 왕관해 좌표를 남겼어요.",
    failText: "멀리 돌아 나왔지만 암초의 안전한 색 표시를 배웠어요.",
    tint: 0x3f5f66,
    preferredRole: "stormbreaker",
    areaThemes: ["basalt", "storm", "trench", "glacier"],
    reward: { shells: 900, xp: 275, affinity: 10 },
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

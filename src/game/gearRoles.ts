import type { GearBuildProfile, GearRole, ItemDefinition } from "./types";

export const gearRoleMeta: Record<GearRole, { label: string; shortLabel: string; description: string; color: number }> = {
  starter: {
    label: "기본 선장",
    shortLabel: "기본",
    description: "아직 뚜렷한 장비 방향은 없지만 모든 항해에 무난해요.",
    color: 0x8ea4b0,
  },
  navigator: {
    label: "항해사",
    shortLabel: "항해",
    description: "빠른 이동과 숨은 항로 발견에 강한 세팅이에요.",
    color: 0x46bcc8,
  },
  reeler: {
    label: "대물 사냥꾼",
    shortLabel: "릴링",
    description: "강한 릴링과 넓은 타이밍으로 큰 친구를 붙잡아요.",
    color: 0xf0ad3d,
  },
  naturalist: {
    label: "박물학자",
    shortLabel: "생태",
    description: "특정 생태와 서식지 친구를 노려 연구하기 좋아요.",
    color: 0x69b985,
  },
  stormbreaker: {
    label: "폭풍 돌파자",
    shortLabel: "폭풍",
    description: "거친 날씨와 폭풍 해역에서 흔들림을 줄여요.",
    color: 0x5f89a6,
  },
  deepExplorer: {
    label: "심해 탐사가",
    shortLabel: "심해",
    description: "해구와 심해 친구, 어두운 물길 탐사에 특화돼요.",
    color: 0x315a73,
  },
  mythSeeker: {
    label: "전설 추적자",
    shortLabel: "전설",
    description: "희귀도 높은 친구와 고대 소문을 따라가는 세팅이에요.",
    color: 0x8f75e8,
  },
  mutationHunter: {
    label: "변이 연구가",
    shortLabel: "변이",
    description: "윤슬, 물결, 오로라 변이를 기록하기 좋은 세팅이에요.",
    color: 0xff9fbd,
  },
};

const roleOrder: GearRole[] = [
  "navigator",
  "reeler",
  "naturalist",
  "stormbreaker",
  "deepExplorer",
  "mutationHunter",
  "mythSeeker",
  "starter",
];

const themeRoleMap: Record<string, GearRole[]> = {
  harbor: ["navigator"],
  sunray: ["starter", "reeler"],
  reef: ["naturalist"],
  mist: ["navigator", "deepExplorer"],
  kelp: ["naturalist"],
  basalt: ["stormbreaker", "reeler"],
  pearl: ["naturalist", "mutationHunter"],
  storm: ["stormbreaker"],
  moon: ["mythSeeker", "mutationHunter"],
  amber: ["navigator"],
  glacier: ["deepExplorer", "stormbreaker"],
  lantern: ["deepExplorer"],
  aurora: ["mutationHunter", "mythSeeker"],
  compass: ["navigator"],
  tide: ["navigator", "naturalist"],
};

export function decorateGearItem(item: ItemDefinition): ItemDefinition {
  if (item.roleTags?.length) {
    return item;
  }

  const inferred = inferGearRoles(item);
  return {
    ...item,
    roleTags: inferred,
    setId: item.setId ?? inferSetId(item),
  };
}

export function getGearBuildProfile(equippedItems: Array<ItemDefinition | undefined>): GearBuildProfile {
  const roleScores: Partial<Record<GearRole, number>> = {};
  const setCounts = new Map<string, number>();

  for (const item of equippedItems.filter(Boolean) as ItemDefinition[]) {
    for (const role of item.roleTags?.length ? item.roleTags : inferGearRoles(item)) {
      roleScores[role] = (roleScores[role] ?? 0) + roleWeight(item);
    }

    if (item.setId) {
      setCounts.set(item.setId, (setCounts.get(item.setId) ?? 0) + 1);
    }
  }

  const primaryRole = roleOrder.reduce<GearRole>(
    (best, role) => ((roleScores[role] ?? 0) > (roleScores[best] ?? 0) ? role : best),
    "starter",
  );
  const score = roleScores[primaryRole] ?? 0;
  const setBonus = Math.max(0, ...Array.from(setCounts.values()));
  const synergyLevel = Math.max(0, Math.min(3, Math.floor(score / 2) + (setBonus >= 3 ? 1 : 0)));
  const meta = gearRoleMeta[primaryRole];

  return {
    primaryRole,
    label: meta.label,
    shortLabel: meta.shortLabel,
    description: buildDescription(meta.description, synergyLevel),
    score,
    synergyLevel,
    roleScores,
    effect: buildSynergyEffect(primaryRole, synergyLevel),
  };
}

export function roleLabelsForItem(item: ItemDefinition): string {
  const roles = item.roleTags?.length ? item.roleTags : inferGearRoles(item);
  return roles.slice(0, 2).map((role) => gearRoleMeta[role].shortLabel).join(" · ");
}

export function roleColorForItem(item: ItemDefinition): number {
  const role = (item.roleTags?.length ? item.roleTags : inferGearRoles(item))[0] ?? "starter";
  return gearRoleMeta[role].color;
}

function inferGearRoles(item: ItemDefinition): GearRole[] {
  const roles = new Set<GearRole>();
  const effect = item.effect;
  const text = `${item.id} ${item.name} ${item.description}`;
  const prefix = item.id.split("-")[0];

  for (const role of themeRoleMap[prefix] ?? []) {
    roles.add(role);
  }

  if (item.kind === "boat" || effect?.boatSpeed || effect?.areaUnlock) {
    roles.add("navigator");
  }
  if (effect?.reelPower || effect?.catchEase) {
    roles.add("reeler");
  }
  if (effect?.familyBoost || effect?.habitatBoost) {
    roles.add("naturalist");
  }
  if (effect?.mutationChance) {
    roles.add("mutationHunter");
  }
  if (effect?.rareBoost || effect?.rarityBoosts) {
    roles.add("mythSeeker");
  }
  if (/storm|tempest|폭풍|먹구름|현무암|basalt/.test(text)) {
    roles.add("stormbreaker");
  }
  if (/deep|trench|lantern|glass|심해|해연|초롱|유리/.test(text)) {
    roles.add("deepExplorer");
  }
  if (roles.size === 0) {
    roles.add("starter");
  }

  return Array.from(roles).slice(0, 3);
}

function inferSetId(item: ItemDefinition): string | undefined {
  const prefix = item.id.split("-")[0];
  return prefix.length > 2 ? prefix : undefined;
}

function roleWeight(item: ItemDefinition): number {
  if (item.kind === "boatCosmetic") {
    return 0.7;
  }
  if (item.kind === "bait") {
    return 0.9;
  }
  return 1;
}

function buildDescription(description: string, synergyLevel: number): string {
  if (synergyLevel <= 0) {
    return description;
  }
  return `${description} 세트 시너지 ${synergyLevel}단계가 켜졌어요.`;
}

function buildSynergyEffect(role: GearRole, level: number): GearBuildProfile["effect"] {
  if (level <= 0) {
    return {};
  }

  const scaled = (value: number) => Number((value * level).toFixed(3));
  const effects: Record<GearRole, GearBuildProfile["effect"]> = {
    starter: { catchEase: scaled(0.008), lureSpeed: scaled(0.008) },
    navigator: { boatSpeed: scaled(0.035), lureSpeed: scaled(0.012) },
    reeler: { reelPower: scaled(0.018), catchEase: scaled(0.014) },
    naturalist: { rareBoost: scaled(0.018), affinityBoost: scaled(0.055) },
    stormbreaker: { catchEase: scaled(0.018), reelPower: scaled(0.015) },
    deepExplorer: { rareBoost: scaled(0.02), lureSpeed: scaled(0.01), affinityBoost: scaled(0.04) },
    mythSeeker: { rareBoost: scaled(0.028), mutationChance: scaled(0.008) },
    mutationHunter: { mutationChance: scaled(0.018), rareBoost: scaled(0.012) },
  };

  return effects[role];
}

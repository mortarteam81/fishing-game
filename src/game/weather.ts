import type { AreaDefinition, PlayerState, WeatherDefinition, WeatherKind } from "./types";

export const weatherDefinitions: Record<WeatherKind, WeatherDefinition> = {
  clear: {
    id: "clear",
    label: "맑은 물결",
    description: "시야가 좋아 기본 항해와 낚시에 알맞아요.",
    tint: 0xb3edf2,
    effect: { catchEase: 0.01 },
  },
  fog: {
    id: "fog",
    label: "은빛 안개",
    description: "숨은 항로의 윤곽이 흐릿하게 드러나요.",
    tint: 0xd8edf1,
    effect: { lureSpeed: -0.03, mutationChance: 0.015 },
  },
  rain: {
    id: "rain",
    label: "잔비 조류",
    description: "입질은 조금 빨라지고 작은 친구들이 더 활발해져요.",
    tint: 0x8fcfe2,
    effect: { lureSpeed: 0.06, rareBoost: 0.015 },
  },
  storm: {
    id: "storm",
    label: "폭풍 물살",
    description: "릴링은 어려워지지만 희귀한 친구 소문이 커져요.",
    tint: 0x5f89a6,
    effect: { catchEase: -0.035, rareBoost: 0.065, mutationChance: 0.02 },
  },
  moonTide: {
    id: "moonTide",
    label: "달빛 밀물",
    description: "밤바다 친구와 변이 친구를 만나기 쉬운 조류예요.",
    tint: 0xb9c3ff,
    effect: { rareBoost: 0.045, mutationChance: 0.035 },
  },
  aurora: {
    id: "aurora",
    label: "오로라 해무",
    description: "전설의 빛이 바다 위를 지나가요.",
    tint: 0xc8b8ff,
    effect: { rareBoost: 0.07, mutationChance: 0.045, lureSpeed: 0.03 },
  },
};

const themeWeather: Record<AreaDefinition["theme"], WeatherKind[]> = {
  beach: ["clear", "rain"],
  pier: ["clear", "fog", "rain"],
  coral: ["clear", "rain", "moonTide"],
  mist: ["fog", "rain", "clear"],
  kelp: ["rain", "fog", "clear"],
  basalt: ["storm", "rain", "clear"],
  pearl: ["clear", "moonTide", "rain"],
  storm: ["storm", "rain", "clear"],
  moon: ["moonTide", "fog", "clear"],
  amber: ["clear", "rain"],
  glacier: ["fog", "clear", "storm"],
  trench: ["fog", "moonTide", "storm"],
  aurora: ["aurora", "moonTide", "clear"],
};

export function getAreaWeather(
  area: AreaDefinition,
  state: PlayerState,
  dayKey = currentDayKey(),
): WeatherDefinition {
  const pool = area.weatherPool ?? themeWeather[area.theme] ?? ["clear"];
  const index = hashString(`${dayKey}:${area.id}:${state.level}`) % pool.length;
  return weatherDefinitions[pool[index]];
}

export function weatherEffectLabel(weather: WeatherDefinition): string {
  const effect = weather.effect;
  if (!effect) {
    return "기본 날씨";
  }

  const parts = [
    effect.catchEase ? `타이밍 ${signedPercent(effect.catchEase)}` : undefined,
    effect.lureSpeed ? `입질 ${signedPercent(effect.lureSpeed)}` : undefined,
    effect.rareBoost ? `희귀 ${signedPercent(effect.rareBoost)}` : undefined,
    effect.mutationChance ? `변이 ${signedPercent(effect.mutationChance)}` : undefined,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(" · ") : "기본 날씨";
}

function signedPercent(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${Math.round(value * 100)}`;
}

function currentDayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function hashString(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
}

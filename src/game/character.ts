import type { CaptainStyle } from "./types";

export const captainPresets: CaptainStyle[] = [
  {
    presetId: "harbor-navigator",
    name: "윤슬",
    skinTone: 0xd8ad8b,
    hairTint: 0x2a211c,
    outfitTint: 0x21394b,
    accentTint: 0xe0a253,
  },
  {
    presetId: "coral-ranger",
    name: "하린",
    skinTone: 0xc98f72,
    hairTint: 0x1f2028,
    outfitTint: 0x2f8f77,
    accentTint: 0xff9f91,
  },
  {
    presetId: "mist-cartographer",
    name: "서우",
    skinTone: 0xe2b58f,
    hairTint: 0x4c3428,
    outfitTint: 0x587281,
    accentTint: 0xd7e6e8,
  },
  {
    presetId: "storm-skipper",
    name: "태오",
    skinTone: 0xb9785f,
    hairTint: 0x171b22,
    outfitTint: 0x303b4c,
    accentTint: 0xf0d16b,
  },
  {
    presetId: "moon-current",
    name: "루나",
    skinTone: 0xf0c6a5,
    hairTint: 0x2d2437,
    outfitTint: 0x384d8a,
    accentTint: 0xb9c3ff,
  },
  {
    presetId: "glacier-maker",
    name: "이든",
    skinTone: 0xd39a78,
    hairTint: 0x6b4432,
    outfitTint: 0x346a7d,
    accentTint: 0xe8fbff,
  },
];

export function captainPresetById(presetId?: string): CaptainStyle {
  return captainPresets.find((preset) => preset.presetId === presetId) ?? captainPresets[0];
}

export function nextCaptainPreset(presetId: string, direction = 1): CaptainStyle {
  const current = captainPresets.findIndex((preset) => preset.presetId === presetId);
  const next = (Math.max(0, current) + direction + captainPresets.length) % captainPresets.length;
  return captainPresets[next];
}

import type { ChapterId } from "./types";

export const chapterOrder: ChapterId[] = ["starwhale-expedition", "deep-crown-survey"];

export const chapterMeta: Record<
  ChapterId,
  {
    label: string;
    shortLabel: string;
    description: string;
    color: number;
  }
> = {
  "starwhale-expedition": {
    label: "별고래 원정",
    shortLabel: "별고래",
    description: "아기고래와 별빛 항로를 따라 전설의 고래 노래를 기록해요.",
    color: 0x9ec8ff,
  },
  "deep-crown-survey": {
    label: "심해 왕관 탐사",
    shortLabel: "왕관",
    description: "고대 등불과 검은 진주빛 심연을 지나 심해 왕관성을 찾아요.",
    color: 0x88b7c9,
  },
};

export function chapterLabel(chapterId: ChapterId | undefined): string {
  return chapterId ? chapterMeta[chapterId].label : "기본 항해";
}

export function chapterShortLabel(chapterId: ChapterId | undefined): string {
  return chapterId ? chapterMeta[chapterId].shortLabel : "기본";
}

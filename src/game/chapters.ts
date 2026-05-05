import type { ChapterId } from "./types";

export const chapterOrder: ChapterId[] = [
  "starwhale-expedition",
  "deep-crown-survey",
  "blue-route-trade",
  "crown-route-restoration",
];

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
  "blue-route-trade": {
    label: "푸른항로 교역 원정",
    shortLabel: "교역",
    description: "항구를 잇고 특산품을 나르며 바다 상단의 이름을 알려요.",
    color: 0x7ed6c4,
  },
  "crown-route-restoration": {
    label: "왕관해 교역로 복원",
    shortLabel: "왕관로",
    description: "심해 왕관해의 오래된 교역로를 안전하고 따뜻하게 되살려요.",
    color: 0xb9a6ff,
  },
};

export function chapterLabel(chapterId: ChapterId | undefined): string {
  return chapterId ? chapterMeta[chapterId].label : "기본 항해";
}

export function chapterShortLabel(chapterId: ChapterId | undefined): string {
  return chapterId ? chapterMeta[chapterId].shortLabel : "기본";
}

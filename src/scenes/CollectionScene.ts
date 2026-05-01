import Phaser from "phaser";
import { fish } from "../game/content";
import { PALETTE, TEXT } from "../game/palette";
import { loadGame } from "../game/storage";
import { addHeader, addMuteButton, addOceanBackground, addTextButton } from "../game/ui";
import type { PlayerState } from "../game/types";

// 稀少度 印章 rarity seal labels and colours (印章 style)
const RARITY_SEAL: Record<string, { color: number; label: string }> = {
  common:   { color: 0x607060, label: "普" },
  uncommon: { color: 0x1e6080, label: "珍" },
  rare:     { color: 0xc85020, label: "稀" },
  special:  { color: 0xcf9820, label: "神" },
};

const PAGE_SIZE = 9;

export class CollectionScene extends Phaser.Scene {
  private state!: PlayerState;
  private page = 0;

  constructor() {
    super("Collection");
  }

  init(data: { page?: number }) {
    const maxPage = Math.max(0, Math.ceil(fish.length / PAGE_SIZE) - 1);
    this.page = Phaser.Math.Clamp(data.page ?? 0, 0, maxPage);
  }

  create() {
    this.state = loadGame();
    addOceanBackground(this, "coral");
    addHeader(this, "바다 친구 도감", this.state);
    addMuteButton(this);

    const pageFish = fish.slice(this.page * PAGE_SIZE, this.page * PAGE_SIZE + PAGE_SIZE);
    const maxPage = Math.max(0, Math.ceil(fish.length / PAGE_SIZE) - 1);
    const discovered = fish.filter((entry) => (this.state.collection[entry.id] ?? 0) > 0).length;
    const completion = Math.round((discovered / fish.length) * 100);

    // 進捗 progress banner
    this.add
      .text(480, 70, `도감 ${discovered}/${fish.length} · 완성도 ${completion}%`, {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "20px",
        fontStyle: "900",
        color: TEXT.primary,
        backgroundColor: "rgba(247,240,224,0.82)",
        padding: { x: 14, y: 6 },
      })
      .setOrigin(0.5);

    pageFish.forEach((entry, index) => {
      const col = index % 3;
      const row = Math.floor(index / 3);
      const x = 190 + col * 290;
      const y = 135 + row * 115;
      const count = this.state.collection[entry.id] ?? 0;
      this.drawEncyclopediaCard(x, y, entry, count);
    });

    this.add
      .text(480, 500, `${this.page + 1} / ${maxPage + 1}`, {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "18px",
        fontStyle: "900",
        color: TEXT.primary,
      })
      .setOrigin(0.5);

    addTextButton(this, 365, 500, "이전", () => this.scene.restart({ page: this.page - 1 }), {
      width: 112,
      height: 44,
      fontSize: 18,
      fill: PALETTE.seaFoam,
      disabled: this.page <= 0,
    });

    addTextButton(this, 595, 500, "다음", () => this.scene.restart({ page: this.page + 1 }), {
      width: 112,
      height: 44,
      fontSize: 18,
      fill: PALETTE.butter,
      disabled: this.page >= maxPage,
    });

    addTextButton(this, 92, 500, "항구", () => this.scene.start("Harbor"), {
      width: 120,
      height: 44,
      fontSize: 18,
      fill: PALETTE.seaFoam,
      iconKey: "icon-harbor",
      iconScale: 0.34,
    });
  }

  // 図鑑カード encyclopedia card — washi paper style
  private drawEncyclopediaCard(
    x: number,
    y: number,
    entry: { id: string; name: string; rarity: string; assetKey: string; funFact?: string },
    count: number,
  ) {
    const discovered = count > 0;
    const cardW = 250;
    const cardH = 100;
    const left  = x - cardW / 2;
    const top   = y - cardH / 2;

    const g = this.add.graphics();

    // Washi paper background
    const bgColor = discovered ? PALETTE.paper : 0xd4dbd8;
    g.fillStyle(bgColor, 0.92);
    g.fillRect(left, top, cardW, cardH);

    // Outer ink border (double-line effect)
    g.lineStyle(2.5, PALETTE.ink, discovered ? 0.72 : 0.30);
    g.strokeRect(left, top, cardW, cardH);
    g.lineStyle(1, PALETTE.ink, discovered ? 0.18 : 0.08);
    g.strokeRect(left + 4, top + 4, cardW - 8, cardH - 8);

    // Vertical divider between image and text
    g.lineStyle(1, PALETTE.ink, discovered ? 0.22 : 0.10);
    g.lineBetween(x - 46, top + 8, x - 46, top + cardH - 8);

    // Fish image
    this.add.image(x - 87, y, entry.assetKey)
      .setScale(0.84)
      .setAlpha(discovered ? 1 : 0.20);

    // 印章 rarity seal — top-right corner
    if (discovered) {
      const seal = RARITY_SEAL[entry.rarity] ?? RARITY_SEAL.common;
      const sx = left + cardW - 30;
      const sy = top;
      g.fillStyle(seal.color, 0.90);
      g.fillRect(sx, sy, 30, 30);
      g.lineStyle(1.5, PALETTE.white, 0.55);
      g.strokeRect(sx + 2, sy + 2, 26, 26);
      this.add.text(sx + 15, sy + 15, seal.label, {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "13px",
        fontStyle: "900",
        color: "#ffffff",
      }).setOrigin(0.5);
    }

    // Text block
    const textX = x - 30;

    if (discovered) {
      this.add.text(textX, y - 26, entry.name, {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: entry.name.length > 10 ? "15px" : "19px",
        fontStyle: "800",
        color: TEXT.primary,
        wordWrap: { width: 144 },
      }).setOrigin(0, 0.5);

      // Rarity label in secondary colour
      const rarityText = { common: "흔히 만나요", uncommon: "가끔 만나요", rare: "특별한 날", special: "전설" };
      this.add.text(textX, y + 2, rarityText[entry.rarity as keyof typeof rarityText] ?? "", {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "14px",
        fontStyle: "700",
        color: TEXT.secondary,
      }).setOrigin(0, 0.5);

      this.add.text(textX, y + 26, `${count}번 만남`, {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "14px",
        fontStyle: "800",
        color: TEXT.secondary,
      }).setOrigin(0, 0.5);
    } else {
      this.add.text(x - 24, y - 10, "아직 못\n만났어요", {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "15px",
        fontStyle: "700",
        color: TEXT.disabled,
        align: "left",
        lineSpacing: 4,
      }).setOrigin(0, 0.5);

      // 「?」 mark in place of seal
      const sx = left + cardW - 30;
      const sy = top;
      g.fillStyle(PALETTE.disabled, 0.50);
      g.fillRect(sx, sy, 30, 30);
      this.add.text(sx + 15, sy + 15, "?", {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "16px",
        fontStyle: "900",
        color: "rgba(255,255,255,0.55)",
      }).setOrigin(0.5);
    }
  }
}

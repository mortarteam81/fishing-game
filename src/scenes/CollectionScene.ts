import Phaser from "phaser";
import { fish } from "../game/content";
import { PALETTE, TEXT } from "../game/palette";
import { loadGame } from "../game/storage";
import { addHeader, addMuteButton, addOceanBackground, addPanel, addTextButton } from "../game/ui";
import type { PlayerState } from "../game/types";

const rarityLabel = {
  common: "흔히 만나요",
  uncommon: "가끔 만나요",
  rare: "특별한 날 만나요",
  special: "무지개 소문",
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

    this.add
      .text(480, 70, `도감 ${discovered}/${fish.length} · 완성도 ${completion}%`, {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "20px",
        fontStyle: "900",
        color: TEXT.primary,
        backgroundColor: "rgba(255,251,239,0.68)",
        padding: { x: 14, y: 6 },
      })
      .setOrigin(0.5);

    pageFish.forEach((entry, index) => {
      const col = index % 3;
      const row = Math.floor(index / 3);
      const x = 190 + col * 290;
      const y = 135 + row * 115;
      const count = this.state.collection[entry.id] ?? 0;
      addPanel(this, x, y, 250, 100, count > 0 ? PALETTE.paper : 0xdce8ef);
      this.add.image(x - 88, y, entry.assetKey).setScale(0.85).setAlpha(count > 0 ? 1 : 0.18);
      this.add
        .text(x - 25, y - 28, count > 0 ? entry.name : "아직 못 만났어요", {
          fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
          fontSize: entry.name.length > 10 ? "16px" : "20px",
          fontStyle: "800",
          color: count > 0 ? TEXT.primary : TEXT.disabled,
          wordWrap: { width: 150 },
        })
        .setOrigin(0, 0.5);
      this.add
        .text(x - 25, y + 2, count > 0 ? rarityLabel[entry.rarity] : "낚시터에서 찾아봐요", {
          fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
          fontSize: "16px",
          fontStyle: "700",
          color: count > 0 ? TEXT.secondary : TEXT.disabled,
        })
        .setOrigin(0, 0.5);
      this.add
        .text(x - 25, y + 28, count > 0 ? `${count}번 만남` : "?", {
          fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
          fontSize: "16px",
          fontStyle: "800",
          color: count > 0 ? TEXT.secondary : TEXT.disabled,
        })
        .setOrigin(0, 0.5);
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
}

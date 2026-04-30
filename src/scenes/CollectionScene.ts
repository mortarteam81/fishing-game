import Phaser from "phaser";
import { fish } from "../game/content";
import { loadGame } from "../game/storage";
import { addHeader, addMuteButton, addOceanBackground, addPanel, addTextButton } from "../game/ui";
import type { PlayerState } from "../game/types";

const rarityLabel = {
  common: "흔히 만나요",
  uncommon: "가끔 만나요",
  rare: "특별한 날 만나요",
  special: "무지개 소문",
};

export class CollectionScene extends Phaser.Scene {
  private state!: PlayerState;

  constructor() {
    super("Collection");
  }

  create() {
    this.state = loadGame();
    addOceanBackground(this, "coral");
    addHeader(this, "바다 친구 도감", this.state);
    addMuteButton(this);

    fish.forEach((entry, index) => {
      const col = index % 3;
      const row = Math.floor(index / 3);
      const x = 190 + col * 290;
      const y = 120 + row * 125;
      const count = this.state.collection[entry.id] ?? 0;
      addPanel(this, x, y, 250, 100, count > 0 ? 0xffffff : 0xdce8ef);
      this.add.image(x - 88, y, count > 0 ? entry.assetKey : "fish-bubble-flounder").setScale(0.85).setAlpha(count > 0 ? 1 : 0.22);
      this.add
        .text(x - 25, y - 28, count > 0 ? entry.name : "아직 못 만났어요", {
          fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
          fontSize: "20px",
          fontStyle: "800",
          color: "#143049",
        })
        .setOrigin(0, 0.5);
      this.add
        .text(x - 25, y + 2, count > 0 ? rarityLabel[entry.rarity] : "낚시터에서 찾아봐요", {
          fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
          fontSize: "16px",
          fontStyle: "700",
          color: "#315a73",
        })
        .setOrigin(0, 0.5);
      this.add
        .text(x - 25, y + 28, count > 0 ? `${count}번 만남` : "?", {
          fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
          fontSize: "16px",
          fontStyle: "800",
          color: "#315a73",
        })
        .setOrigin(0, 0.5);
    });

    addTextButton(this, 92, 500, "항구", () => this.scene.start("Harbor"), {
      width: 120,
      height: 44,
      fontSize: 18,
      fill: 0xd7f6ff,
    });
  }
}

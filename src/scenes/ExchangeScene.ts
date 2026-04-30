import Phaser from "phaser";
import { items } from "../game/content";
import { buyItem, canBuyItem, equipItem, refreshQuestCompletion } from "../game/progression";
import { loadGame, saveGame } from "../game/storage";
import { addHeader, addMuteButton, addOceanBackground, addPanel, addTextButton } from "../game/ui";
import type { ItemDefinition, PlayerState } from "../game/types";

export class ExchangeScene extends Phaser.Scene {
  private state!: PlayerState;

  constructor() {
    super("Exchange");
  }

  create() {
    this.state = loadGame();
    addOceanBackground(this, "beach");
    addHeader(this, "조개 교환소", this.state);
    addMuteButton(this);

    this.add
      .text(480, 72, "바다에서 모은 조개로 장비와 꾸미기를 바꿔요.", {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "22px",
        fontStyle: "800",
        color: "#143049",
      })
      .setOrigin(0.5);

    items.forEach((item, index) => this.addItemCard(item, index));

    addTextButton(this, 92, 500, "항구", () => this.scene.start("Harbor"), {
      width: 120,
      height: 44,
      fontSize: 18,
      fill: 0xd7f6ff,
    });
  }

  private addItemCard(item: ItemDefinition, index: number) {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = 285 + col * 390;
    const y = 145 + row * 118;
    const owned = this.state.ownedItemIds.includes(item.id);
    const equipped = this.state.equippedRodId === item.id || this.state.equippedBaitId === item.id;
    addPanel(this, x, y, 340, 96, owned ? 0xffffff : 0xfffbdf);

    this.add
      .text(x - 145, y - 27, item.name, {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "22px",
        fontStyle: "900",
        color: "#143049",
      })
      .setOrigin(0, 0.5);
    this.add
      .text(x - 145, y + 6, item.description, {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "15px",
        fontStyle: "700",
        color: "#315a73",
        wordWrap: { width: 210 },
      })
      .setOrigin(0, 0.5);

    const label = owned ? (equipped ? "사용 중" : "선택") : `조개 ${item.shellCost}`;
    const disabled = (!owned && !canBuyItem(this.state, item.id)) || equipped;
    addTextButton(
      this,
      x + 112,
      y + 15,
      label,
      () => {
        const updated = owned ? equipItem(this.state, item.id) : buyItem(this.state, item.id);
        saveGame(refreshQuestCompletion(updated));
        this.scene.restart();
      },
      {
        width: 105,
        height: 44,
        fontSize: 16,
        fill: owned ? 0x9bf6d2 : 0xffd166,
        disabled,
      },
    );
  }
}

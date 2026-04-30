import Phaser from "phaser";
import { areas } from "../game/content";
import { nextQuestHint, refreshQuestCompletion } from "../game/progression";
import { loadGame, saveGame } from "../game/storage";
import { addHeader, addMuteButton, addOceanBackground, addPanel, addTextButton } from "../game/ui";
import type { PlayerState } from "../game/types";

export class HarborScene extends Phaser.Scene {
  private state!: PlayerState;

  constructor() {
    super("Harbor");
  }

  create() {
    this.state = refreshQuestCompletion(loadGame());
    saveGame(this.state);

    addOceanBackground(this, "harbor");
    addHeader(this, "반짝바다 낚시단", this.state);
    addMuteButton(this);
    this.addBoat();
    this.addHeroPanel();
    this.addVoyagePanel();
    this.addNavigation();
  }

  private addBoat() {
    const boat = this.add.image(190, 330, "boat").setScale(1.4);
    this.tweens.add({
      targets: boat,
      y: 340,
      duration: 1600,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut",
    });
  }

  private addHeroPanel() {
    addPanel(this, 625, 142, 560, 150, 0xffffff);
    this.add
      .text(380, 95, "오늘은 어떤 바다 친구를 만날까요?", {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "30px",
        fontStyle: "800",
        color: "#143049",
      })
      .setOrigin(0, 0.5);
    this.add
      .text(380, 139, "배를 움직여 반짝이는 낚시 포인트를 찾아봐요.", {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "22px",
        fontStyle: "800",
        color: "#315a73",
        wordWrap: { width: 480 },
      })
      .setOrigin(0, 0.5);
    this.add
      .text(380, 174, nextQuestHint(this.state), {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "18px",
        fontStyle: "700",
        color: "#315a73",
        wordWrap: { width: 480 },
      })
      .setOrigin(0, 0.5);
  }

  private addVoyagePanel() {
    this.add
      .text(64, 410, "항해 준비", {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "25px",
        fontStyle: "800",
        color: "#143049",
      })
      .setOrigin(0, 0.5);

    addTextButton(this, 175, 470, "항해 시작", () => this.scene.start("Ocean"), {
      width: 220,
      height: 66,
      fill: 0xffd166,
      fontSize: 26,
    });

    areas.forEach((area, index) => {
      const unlocked = this.state.unlockedAreaIds.includes(area.id);
      const x = 410 + index * 172;
      const label = unlocked ? area.name : `Lv.${area.requiredLevel} 열림`;
      addTextButton(
        this,
        x,
        470,
        label,
        () => this.scene.start("Fishing", { areaId: area.id }),
        {
          width: 152,
          height: 54,
          fontSize: 17,
          fill: unlocked ? 0xffd166 : 0xb8ccd7,
          disabled: !unlocked,
        },
      );
    });
  }

  private addNavigation() {
    addTextButton(this, 505, 265, "도감", () => this.scene.start("Collection"), {
      width: 150,
      fill: 0x9bf6d2,
    });
    addTextButton(this, 675, 265, "교환소", () => this.scene.start("Exchange"), {
      width: 150,
      fill: 0xffc2d1,
    });
    addTextButton(this, 845, 265, "퀘스트", () => this.scene.start("Quest"), {
      width: 150,
      fill: 0xc7ceff,
    });
  }
}

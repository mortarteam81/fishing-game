import Phaser from "phaser";
import { addPlayerBoat } from "../game/boat";
import { areas } from "../game/content";
import { PALETTE, TEXT } from "../game/palette";
import {
  applyStoryChoice,
  getAvailableStoryChoices,
  nextQuestHint,
  refreshQuestCompletion,
} from "../game/progression";
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
    this.addStoryChoicePanel();
    this.addVoyagePanel();
    this.addNavigation();
  }

  private addBoat() {
    const boat = addPlayerBoat(this, 190, 302, this.state, { scale: 1.18, depth: 5 });
    this.tweens.add({
      targets: boat,
      y: 316,
      duration: 1600,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut",
    });
  }

  private addHeroPanel() {
    addPanel(this, 625, 142, 560, 150, PALETTE.paper);
    this.add
      .text(380, 95, "오늘은 어떤 바다 친구를 만날까요?", {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "30px",
        fontStyle: "800",
        color: TEXT.primary,
      })
      .setOrigin(0, 0.5);
    this.add
      .text(380, 139, "배를 움직여 반짝이는 낚시 포인트를 찾아봐요.", {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "22px",
        fontStyle: "800",
        color: TEXT.secondary,
        wordWrap: { width: 480 },
      })
      .setOrigin(0, 0.5);
    this.add
      .text(380, 174, nextQuestHint(this.state), {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "18px",
        fontStyle: "700",
        color: TEXT.secondary,
        wordWrap: { width: 480 },
      })
      .setOrigin(0, 0.5);
  }

  private addVoyagePanel() {
    addTextButton(this, 175, 470, "항해 시작", () => this.scene.start("Ocean"), {
      width: 220,
      height: 66,
      fill: PALETTE.butter,
      fontSize: 26,
      iconKey: "icon-map",
      iconScale: 0.5,
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
          fill: unlocked ? PALETTE.butter : PALETTE.disabled,
          disabled: !unlocked,
          iconKey: unlocked ? "icon-bait" : undefined,
          iconScale: 0.38,
        },
      );
    });
  }

  private addStoryChoicePanel() {
    const choice = getAvailableStoryChoices(this.state)[0];
    if (!choice) {
      return;
    }

    addPanel(this, 625, 354, 560, 124, PALETTE.paper);
    this.add
      .text(380, 318, choice.title, {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "24px",
        fontStyle: "900",
        color: TEXT.primary,
      })
      .setOrigin(0, 0.5);
    this.add
      .text(380, 348, choice.helper, {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "16px",
        fontStyle: "700",
        color: TEXT.secondary,
        wordWrap: { width: 480 },
      })
      .setOrigin(0, 0.5);

    choice.options.forEach((option, index) => {
      addTextButton(
        this,
        506 + index * 238,
        392,
        option.label,
        () => {
          saveGame(applyStoryChoice(this.state, choice.id, option.id));
          this.scene.restart();
        },
        {
          width: 216,
          height: 48,
          fontSize: 16,
          fill: index === 0 ? PALETTE.seaFoam : PALETTE.lavender,
          iconKey: index === 0 ? "icon-harbor" : "icon-bait",
          iconScale: 0.31,
        },
      );
    });
  }

  private addNavigation() {
    addTextButton(this, 505, 265, "도감", () => this.scene.start("Collection"), {
      width: 150,
      fill: PALETTE.seaFoam,
      iconKey: "icon-collection",
      iconScale: 0.38,
    });
    addTextButton(this, 675, 265, "교환소", () => this.scene.start("Exchange"), {
      width: 150,
      fill: 0xffc2d1,
      iconKey: "icon-shop",
      iconScale: 0.38,
    });
    addTextButton(this, 845, 265, "퀘스트", () => this.scene.start("Quest"), {
      width: 150,
      fill: PALETTE.lavender,
      iconKey: "icon-quest",
      iconScale: 0.38,
    });
  }
}

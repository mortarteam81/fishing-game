import Phaser from "phaser";
import { PALETTE, TEXT } from "../game/palette";
import {
  claimQuest,
  getVisibleQuests,
  refreshQuestCompletion,
  stepLabel,
  stepProgress,
  stepTarget,
} from "../game/progression";
import { loadGame, saveGame } from "../game/storage";
import { addHeader, addMuteButton, addOceanBackground, addPanel, addTextButton } from "../game/ui";
import type { PlayerState, QuestDefinition } from "../game/types";

export class QuestScene extends Phaser.Scene {
  private state!: PlayerState;

  constructor() {
    super("Quest");
  }

  create() {
    this.state = refreshQuestCompletion(loadGame());
    saveGame(this.state);
    addOceanBackground(this, "pier");
    addHeader(this, "오늘의 부탁", this.state);
    addMuteButton(this);

    getVisibleQuests(this.state).forEach((quest, index) => this.addQuestRow(quest, index));

    addTextButton(this, 92, 500, "항구", () => this.scene.start("Harbor"), {
      width: 120,
      height: 44,
      fontSize: 18,
      fill: PALETTE.seaFoam,
      iconKey: "icon-harbor",
      iconScale: 0.34,
    });
  }

  private addQuestRow(quest: QuestDefinition, index: number) {
    const y = 88 + index * 78;
    const progress = this.state.questProgress[quest.id] ?? { completed: false, claimed: false };
    addPanel(this, 480, y, 790, 64, progress.claimed ? 0xe8f4ea : PALETTE.paper);
    this.add.image(112, y, "icon-quest").setScale(0.42).setAlpha(progress.claimed ? 0.55 : 1);
    this.add
      .text(142, y - 16, quest.title, {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "21px",
        fontStyle: "900",
        color: progress.claimed ? TEXT.disabled : TEXT.primary,
      })
      .setOrigin(0, 0.5);

    const stepText = quest.steps
      .map((step) => `${stepLabel(step)} ${stepProgress(this.state, step)}/${stepTarget(step)}`)
      .join("  ·  ");

    this.add
      .text(142, y + 16, stepText, {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "15px",
        fontStyle: "700",
        color: progress.claimed ? TEXT.disabled : TEXT.secondary,
      })
      .setOrigin(0, 0.5);

    const reward = `조개 ${quest.rewards.shells ?? 0} · 경험치 ${quest.rewards.xp ?? 0}`;
    this.add
      .text(640, y - 14, reward, {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "15px",
        fontStyle: "800",
        color: TEXT.secondary,
      })
      .setOrigin(0, 0.5);

    addTextButton(
      this,
      760,
      y + 16,
      progress.claimed ? "완료" : progress.completed ? "받기" : "진행 중",
      () => {
        saveGame(claimQuest(this.state, quest.id));
        this.scene.restart();
      },
      {
        width: 120,
        height: 36,
        fontSize: 15,
        fill: progress.completed ? PALETTE.butter : PALETTE.seaFoam,
        disabled: progress.claimed || !progress.completed,
        iconKey: progress.completed && !progress.claimed ? "icon-shell" : undefined,
        iconScale: 0.28,
      },
    );
  }
}

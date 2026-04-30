import Phaser from "phaser";
import { quests } from "../game/content";
import {
  claimQuest,
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

    quests.forEach((quest, index) => this.addQuestRow(quest, index));

    addTextButton(this, 92, 500, "항구", () => this.scene.start("Harbor"), {
      width: 120,
      height: 44,
      fontSize: 18,
      fill: 0xd7f6ff,
    });
  }

  private addQuestRow(quest: QuestDefinition, index: number) {
    const y = 88 + index * 78;
    const progress = this.state.questProgress[quest.id] ?? { completed: false, claimed: false };
    addPanel(this, 480, y, 790, 64, progress.claimed ? 0xe8f4ea : 0xffffff);
    this.add
      .text(110, y - 16, quest.title, {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "21px",
        fontStyle: "900",
        color: "#143049",
      })
      .setOrigin(0, 0.5);

    const stepText = quest.steps
      .map((step) => `${stepLabel(step)} ${stepProgress(this.state, step)}/${stepTarget(step)}`)
      .join("  ·  ");

    this.add
      .text(110, y + 16, stepText, {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "15px",
        fontStyle: "700",
        color: "#315a73",
      })
      .setOrigin(0, 0.5);

    const reward = `조개 ${quest.rewards.shells ?? 0} · 경험치 ${quest.rewards.xp ?? 0}`;
    this.add
      .text(640, y - 14, reward, {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "15px",
        fontStyle: "800",
        color: "#315a73",
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
        fill: progress.completed ? 0xffd166 : 0xd7f6ff,
        disabled: progress.claimed || !progress.completed,
      },
    );
  }
}

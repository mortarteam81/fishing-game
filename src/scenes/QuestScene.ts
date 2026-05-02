import Phaser from "phaser";
import { chapterMeta, chapterOrder, chapterShortLabel } from "../game/chapters";
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

const QUESTS_PER_PAGE = 5;

export class QuestScene extends Phaser.Scene {
  private state!: PlayerState;
  private page = 0;

  constructor() {
    super("Quest");
  }

  create(data?: { page?: number }) {
    this.page = Math.max(0, Math.floor(data?.page ?? 0));
    this.state = refreshQuestCompletion(loadGame());
    saveGame(this.state);
    addOceanBackground(this, "pier");
    addHeader(this, "오늘의 부탁", this.state);
    addMuteButton(this);

    const visibleQuests = [...getVisibleQuests(this.state)].sort((a, b) => this.questSortRank(a) - this.questSortRank(b));
    const maxPage = Math.max(0, Math.ceil(visibleQuests.length / QUESTS_PER_PAGE) - 1);
    this.page = Math.min(this.page, maxPage);
    visibleQuests
      .slice(this.page * QUESTS_PER_PAGE, this.page * QUESTS_PER_PAGE + QUESTS_PER_PAGE)
      .forEach((quest, index) => this.addQuestRow(quest, index));

    addTextButton(this, 92, 500, "항구", () => this.scene.start("Harbor"), {
      width: 120,
      height: 44,
      fontSize: 18,
      fill: PALETTE.seaFoam,
      iconKey: "icon-harbor",
      iconScale: 0.34,
    });

    if (maxPage > 0) {
      addTextButton(this, 640, 500, "이전", () => this.scene.restart({ page: Math.max(0, this.page - 1) }), {
        width: 86,
        height: 40,
        fontSize: 15,
        fill: PALETTE.seaFoam,
        disabled: this.page <= 0,
      });
      addTextButton(this, 742, 500, "다음", () => this.scene.restart({ page: Math.min(maxPage, this.page + 1) }), {
        width: 86,
        height: 40,
        fontSize: 15,
        fill: PALETTE.butter,
        disabled: this.page >= maxPage,
      });
      this.add
        .text(542, 500, `${this.page + 1}/${maxPage + 1}`, {
          fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
          fontSize: "16px",
          fontStyle: "900",
          color: TEXT.secondary,
        })
        .setOrigin(0.5);
    }
  }

  private addQuestRow(quest: QuestDefinition, index: number) {
    const y = 108 + index * 76;
    const progress = this.state.questProgress[quest.id] ?? { completed: false, claimed: false };
    addPanel(this, 480, y, 790, 64, progress.claimed ? 0xe8f4ea : PALETTE.paper);
    this.add.image(112, y, "icon-quest").setScale(0.42).setAlpha(progress.claimed ? 0.55 : 1);
    const chapterColor = quest.chapterId ? chapterMeta[quest.chapterId].color : PALETTE.seaFoam;
    this.add.rectangle(174, y - 18, 62, 22, chapterColor, progress.claimed ? 0.35 : 0.72).setStrokeStyle(1, 0xffffff, 0.75);
    this.add
      .text(174, y - 18, chapterShortLabel(quest.chapterId), {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "12px",
        fontStyle: "900",
        color: TEXT.primary,
      })
      .setOrigin(0.5);
    this.add
      .text(214, y - 16, quest.title, {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "21px",
        fontStyle: "900",
        color: progress.claimed ? TEXT.disabled : TEXT.primary,
        fixedWidth: 400,
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
        fixedWidth: 470,
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
        this.scene.restart({ page: this.page });
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

  private questSortRank(quest: QuestDefinition): number {
    const chapterIndex = quest.chapterId ? chapterOrder.indexOf(quest.chapterId) + 1 : 0;
    const claimedOffset = this.state.questProgress[quest.id]?.claimed ? 100 : 0;
    return claimedOffset + chapterIndex * 10 + Math.max(0, getVisibleQuests(this.state).findIndex((entry) => entry.id === quest.id)) / 100;
  }
}

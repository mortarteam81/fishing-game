import Phaser from "phaser";
import { addPlayerBoat } from "../game/boat";
import { chapterMeta, chapterOrder, chapterLabel } from "../game/chapters";
import { getEquippedCompanionProfiles } from "../game/companions";
import { addCompanionFollowers } from "../game/companionVisuals";
import { areas } from "../game/content";
import { companionTextures, ensureSvgTextures, playerPresentationTextures } from "../game/lazyTextures";
import { PALETTE, TEXT } from "../game/palette";
import {
  applyStoryChoice,
  getAvailableStoryChoices,
  getEquippedGearBuild,
  getVisibleQuests,
  isAreaDiscovered,
  nextQuestHint,
  refreshQuestCompletion,
} from "../game/progression";
import { loadGame, saveGame } from "../game/storage";
import { addHeader, addMuteButton, addOceanBackground, addPanel, addTextButton } from "../game/ui";
import type { ChapterId, PlayerState } from "../game/types";

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
    const loadingText = this.add
      .text(480, 302, "항구를 준비하는 중...", {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "22px",
        fontStyle: "900",
        color: TEXT.primary,
        backgroundColor: "rgba(255,251,239,0.7)",
        padding: { x: 14, y: 7 },
      })
      .setOrigin(0.5)
      .setDepth(30);

    void this.renderWhenReady(loadingText);
  }

  private async renderWhenReady(loadingText: Phaser.GameObjects.Text) {
    await ensureSvgTextures(this, [...playerPresentationTextures(this.state), ...companionTextures(this.state)]);
    loadingText.destroy();
    this.addBoat();
    this.addHeroPanel();
    this.addCompanionPanel();
    if (!this.addStoryChoicePanel()) {
      this.addChapterPanel();
    }
    this.addVoyagePanel();
    this.addNavigation();
  }

  private addBoat() {
    const boat = addPlayerBoat(this, 190, 302, this.state, { scale: 1.18, depth: 5 });
    addCompanionFollowers(this, boat, this.state, "harbor");
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

    const build = getEquippedGearBuild(this.state);
    this.add
      .text(380, 206, `장비 빌드: ${build.label} · 시너지 ${build.synergyLevel}단계`, {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "16px",
        fontStyle: "900",
        color: TEXT.primary,
        backgroundColor: "rgba(255,251,239,0.58)",
        padding: { x: 10, y: 4 },
      })
      .setOrigin(0, 0.5);
  }

  private addCompanionPanel() {
    const companions = getEquippedCompanionProfiles(this.state);
    const lead = companions[0];
    if (!lead) {
      return;
    }

    addPanel(this, 190, 92, 302, 82, PALETTE.paper);
    this.add
      .text(62, 67, "오늘의 동료", {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "16px",
        fontStyle: "900",
        color: TEXT.secondary,
      })
      .setOrigin(0, 0.5);
    this.add
      .text(62, 91, `${lead.fish.name} · ${lead.mood}`, {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: lead.fish.name.length > 8 ? "17px" : "19px",
        fontStyle: "900",
        color: TEXT.primary,
        fixedWidth: 250,
      })
      .setOrigin(0, 0.5);
    this.add
      .text(62, 117, lead.effectLabel, {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "13px",
        fontStyle: "800",
        color: TEXT.secondary,
        fixedWidth: 250,
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

    const knownAreas = areas.filter((area) => isAreaDiscovered(this.state, area));
    const farthestUnlocked = Math.max(
      0,
      ...knownAreas.map((area, index) => (this.state.unlockedAreaIds.includes(area.id) ? index : -1)),
    );
    const startIndex = Phaser.Math.Clamp(farthestUnlocked - 1, 0, Math.max(0, knownAreas.length - 3));
    const voyageAreas = knownAreas.slice(startIndex, startIndex + 3);

    voyageAreas.forEach((area, index) => {
      const unlocked = this.state.unlockedAreaIds.includes(area.id);
      const x = 390 + index * 146;
      const label = unlocked ? area.name : `Lv.${area.requiredLevel} 열림`;
      addTextButton(
        this,
        x,
        470,
        label,
        () => this.scene.start("Fishing", { areaId: area.id }),
        {
          width: 132,
          height: 54,
          fontSize: 15,
          fill: unlocked ? PALETTE.butter : PALETTE.disabled,
          disabled: !unlocked,
          iconKey: unlocked ? "icon-bait" : undefined,
          iconScale: 0.38,
        },
      );
    });
  }

  private addStoryChoicePanel(): boolean {
    const choice = getAvailableStoryChoices(this.state)[0];
    if (!choice) {
      return false;
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
    return true;
  }

  private addChapterPanel() {
    const visibleChapterQuest = getVisibleQuests(this.state).find(
      (quest) => quest.chapterId && !this.state.questProgress[quest.id]?.claimed,
    );
    const chapterId = this.resolveChapterId(visibleChapterQuest?.chapterId);
    const meta = chapterMeta[chapterId];
    const progress = this.state.chapterProgress[chapterId];
    const nextArea = areas.find(
      (area) => area.chapterId === chapterId && area.hidden && !isAreaDiscovered(this.state, area),
    );
    const progressText = progress?.completed
      ? "원정 기록 완료"
      : `원정 기록 ${Math.min(100, Math.floor((progress?.score ?? 0) / 4))}%`;
    const targetText = visibleChapterQuest
      ? visibleChapterQuest.title
      : nextArea
        ? `${nextArea.name} 항로 조사`
        : meta.description;

    addPanel(this, 625, 354, 560, 124, PALETTE.paper);
    this.add
      .text(380, 318, "원정 기록", {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "16px",
        fontStyle: "900",
        color: TEXT.secondary,
      })
      .setOrigin(0, 0.5);
    this.add
      .text(380, 344, chapterLabel(chapterId), {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "24px",
        fontStyle: "900",
        color: TEXT.primary,
      })
      .setOrigin(0, 0.5);
    this.add
      .text(380, 374, `${progressText} · 다음 목표: ${targetText}`, {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "15px",
        fontStyle: "800",
        color: TEXT.secondary,
        wordWrap: { width: 485 },
      })
      .setOrigin(0, 0.5);

    addTextButton(this, 746, 402, "원정 보기", () => this.scene.start("Quest"), {
      width: 150,
      height: 42,
      fontSize: 15,
      fill: meta.color,
      iconKey: "icon-quest",
      iconScale: 0.28,
    });
  }

  private resolveChapterId(preferred?: ChapterId): ChapterId {
    if (preferred) {
      return preferred;
    }
    if (this.state.activeChapterId) {
      return this.state.activeChapterId;
    }
    return chapterOrder.find((chapterId) => !this.state.chapterProgress[chapterId]?.completed) ?? "deep-crown-survey";
  }

  private addNavigation() {
    addTextButton(this, 390, 265, "도감", () => this.scene.start("Collection"), {
      width: 112,
      fontSize: 18,
      fill: PALETTE.seaFoam,
      iconKey: "icon-collection",
      iconScale: 0.32,
    });
    addTextButton(this, 512, 265, "교환소", () => this.scene.start("Exchange"), {
      width: 112,
      fontSize: 17,
      fill: 0xffc2d1,
      iconKey: "icon-shop",
      iconScale: 0.32,
    });
    addTextButton(this, 634, 265, "퀘스트", () => this.scene.start("Quest"), {
      width: 112,
      fontSize: 17,
      fill: PALETTE.lavender,
      iconKey: "icon-quest",
      iconScale: 0.32,
    });
    addTextButton(this, 756, 265, "선장", () => this.scene.start("Character"), {
      width: 112,
      fontSize: 18,
      fill: PALETTE.butter,
      iconKey: "icon-harbor",
      iconScale: 0.32,
    });
    addTextButton(this, 878, 265, "저장", () => this.scene.start("Save"), {
      width: 112,
      fontSize: 18,
      fill: PALETTE.seaFoam,
      iconKey: "icon-map",
      iconScale: 0.32,
    });
  }
}

import Phaser from "phaser";
import { ports } from "../game/commerceContent";
import { getCargoCapacity, getPort, getTradeGood, getUsedCargoVolume, isPortUnlocked } from "../game/commerce";
import { chapterShortLabel } from "../game/chapters";
import { ensureSvgTextures, portInteriorTexture } from "../game/lazyTextures";
import { PALETTE, TEXT } from "../game/palette";
import { getPortVisual } from "../game/portVisuals";
import { claimQuest, getVisibleQuests, refreshQuestCompletion, stepLabel, stepProgress, stepTarget } from "../game/progression";
import { loadGame, saveGame } from "../game/storage";
import { portInteriorTextureKey } from "../game/textureKeys";
import { addHeader, addMuteButton, addOceanBackground, addPanel, addTextButton } from "../game/ui";
import type { PlayerState, PortDefinition, QuestDefinition } from "../game/types";

export class PortScene extends Phaser.Scene {
  private state!: PlayerState;
  private port!: PortDefinition;
  private notice?: string;

  constructor() {
    super("Port");
  }

  init(data?: { portId?: string; notice?: string }) {
    this.notice = data?.notice;
  }

  create(data?: { portId?: string; notice?: string }) {
    this.state = refreshQuestCompletion(loadGame());
    this.notice = data?.notice ?? this.notice;
    this.port = getPort(data?.portId) ?? getPort(this.state.currentPortId) ?? ports[0];
    if (!isPortUnlocked(this.state, this.port)) {
      this.port = getPort(this.state.currentPortId) ?? ports[0];
    }

    const loadingBg = this.add.rectangle(480, 270, 960, 540, 0xb3edf2, 1);
    const loading = this.add.text(480, 270, "항구 전경을 준비하는 중...", {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "22px",
      fontStyle: "900",
      color: TEXT.primary,
      backgroundColor: "rgba(255,251,239,0.72)",
      padding: { x: 16, y: 8 },
    }).setOrigin(0.5);
    void this.renderWhenReady([loadingBg, loading]);
  }

  private async renderWhenReady(loadingObjects: Phaser.GameObjects.GameObject[]) {
    await ensureSvgTextures(this, portInteriorTexture(this.port));
    loadingObjects.forEach((object) => object.destroy());
    addOceanBackground(this, this.port.theme);
    this.addInteriorBackdrop();
    addHeader(this, "항구 네트워크", this.state);
    addMuteButton(this);

    this.addPortSummary();
    this.addMarketPanel();
    this.addQuestPanel();
    this.addRoutePanel();
    this.addNavigation();
  }

  private addInteriorBackdrop() {
    const visual = getPortVisual(this.port);
    this.add.image(480, 160, portInteriorTextureKey(this.port.id)).setDepth(-8).setDisplaySize(900, 254).setAlpha(0.96);
    this.add.rectangle(480, 268, 900, 34, PALETTE.ink, 0.12).setDepth(-7);
    this.add.text(86, 250, `${visual.landmark} · ${visual.arrivalLine}`, {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "14px",
      fontStyle: "900",
      color: TEXT.primary,
      backgroundColor: "rgba(255,248,234,0.72)",
      padding: { x: 10, y: 4 },
      fixedWidth: 790,
    }).setOrigin(0, 0.5).setDepth(-6);
  }

  private addPortSummary() {
    addPanel(this, 254, 154, 390, 190, PALETTE.paper);
    this.add.text(82, 83, this.port.name, {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "31px",
      fontStyle: "900",
      color: TEXT.primary,
    }).setOrigin(0, 0.5);
    this.add.text(84, 121, `${this.port.region} · 평판 ${this.state.portReputation[this.port.id] ?? 0}`, {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "17px",
      fontStyle: "900",
      color: TEXT.secondary,
    }).setOrigin(0, 0.5);
    this.add.text(84, 161, this.port.description, {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "16px",
      fontStyle: "800",
      color: TEXT.primary,
      wordWrap: { width: 316 },
    }).setOrigin(0, 0.5);
    this.add.text(84, 222, `화물 ${getUsedCargoVolume(this.state)}/${getCargoCapacity(this.state)} · 교역일 ${this.state.marketState.day}`, {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "16px",
      fontStyle: "900",
      color: TEXT.secondary,
    }).setOrigin(0, 0.5);

    if (this.notice) {
      this.add.text(480, 60, this.notice, {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "16px",
        fontStyle: "900",
        color: TEXT.primary,
        backgroundColor: "rgba(255,251,239,0.78)",
        padding: { x: 12, y: 5 },
      }).setOrigin(0.5);
    }
  }

  private addMarketPanel() {
    addPanel(this, 706, 138, 390, 158, PALETTE.warmCream);
    this.add.text(546, 86, "시장", {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "25px",
      fontStyle: "900",
      color: TEXT.primary,
    }).setOrigin(0, 0.5);
    const featuredId = this.state.marketState.featuredGoodIdsByPort[this.port.id];
    const mood = this.state.marketState.portMoodById[this.port.id] ?? "steady";
    this.add.text(546, 125, `오늘 인기: ${featuredId ? featuredId.split("-").slice(-1)[0] : "항구 소문"} · ${this.marketMoodLabel(mood)}`, {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "16px",
      fontStyle: "800",
      color: TEXT.secondary,
      fixedWidth: 300,
    }).setOrigin(0, 0.5);
    this.add.text(546, 158, "원산지에서 싸게 사고 수요 항구에서 비싸게 팔아요.", {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "15px",
      fontStyle: "800",
      color: TEXT.primary,
      wordWrap: { width: 286 },
    }).setOrigin(0, 0.5);
    addTextButton(this, 636, 207, "사기", () => this.scene.start("Trade", { mode: "buy" }), {
      width: 128,
      height: 42,
      fontSize: 17,
      fill: PALETTE.butter,
      iconKey: "icon-shop",
      iconScale: 0.28,
    });
    addTextButton(this, 784, 207, "팔기", () => this.scene.start("Trade", { mode: "sell" }), {
      width: 128,
      height: 42,
      fontSize: 17,
      fill: PALETTE.seaFoam,
      iconKey: "icon-shell",
      iconScale: 0.28,
    });
  }

  private addQuestPanel() {
    addPanel(this, 254, 354, 390, 172, PALETTE.paper);
    this.add.text(82, 292, "항구 의뢰", {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "24px",
      fontStyle: "900",
      color: TEXT.primary,
    }).setOrigin(0, 0.5);
    const tradeQuests = getVisibleQuests(this.state)
      .filter((quest) => quest.chapterId === "blue-route-trade" || quest.chapterId === "crown-route-restoration")
      .filter((quest) => !this.state.questProgress[quest.id]?.claimed)
      .slice(0, 2);

    if (tradeQuests.length === 0) {
      this.add.text(84, 346, "거래를 이어가면 새 항구 의뢰가 열려요.", {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "16px",
        fontStyle: "800",
        color: TEXT.secondary,
        wordWrap: { width: 300 },
      }).setOrigin(0, 0.5);
      return;
    }

    tradeQuests.forEach((quest, index) => this.addQuestRow(quest, 326 + index * 54));
  }

  private addQuestRow(quest: QuestDefinition, y: number) {
    const progress = this.state.questProgress[quest.id] ?? { completed: false, claimed: false };
    const step = quest.steps[0];
    this.add.text(92, y - 14, `${chapterShortLabel(quest.chapterId)} · ${quest.title}`, {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "14px",
      fontStyle: "900",
      color: TEXT.primary,
      fixedWidth: 230,
    }).setOrigin(0, 0.5);
    this.add.text(92, y + 10, `${stepLabel(step)} ${stepProgress(this.state, step)}/${stepTarget(step)}`, {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "12px",
      fontStyle: "800",
      color: TEXT.secondary,
      fixedWidth: 220,
    }).setOrigin(0, 0.5);
    addTextButton(this, 396, y, progress.completed ? "받기" : "진행", () => {
      this.state = claimQuest(this.state, quest.id);
      saveGame(this.state);
      this.scene.restart({ notice: `${quest.title} 보상을 확인했어요.` });
    }, {
      width: 72,
      height: 34,
      fontSize: 13,
      fill: progress.completed ? PALETTE.butter : PALETTE.seaFoam,
      disabled: !progress.completed,
    });
  }

  private addRoutePanel() {
    addPanel(this, 706, 360, 390, 184, PALETTE.paper);
    this.add.text(546, 292, "추천 항로", {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "24px",
      fontStyle: "900",
      color: TEXT.primary,
    }).setOrigin(0, 0.5);

    this.add.text(546, 324, "다른 항구는 바다 지도에서 직접 운항해 도크에 닿아야 입항할 수 있어요.", {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "14px",
      fontStyle: "800",
      color: TEXT.secondary,
      wordWrap: { width: 300 },
    }).setOrigin(0, 0.5);

    const suggestions = this.routeSuggestions().slice(0, 3);
    if (suggestions.length === 0) {
      this.add.text(546, 378, "교역을 이어가면 추천 항로가 더 또렷해져요.", {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "15px",
        fontStyle: "800",
        color: TEXT.secondary,
        wordWrap: { width: 300 },
      }).setOrigin(0, 0.5);
    }

    suggestions.forEach((suggestion, index) => {
      this.add.text(552, 372 + index * 31, `${index + 1}. ${suggestion}`, {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "14px",
        fontStyle: "900",
        color: TEXT.primary,
        fixedWidth: 306,
      }).setOrigin(0, 0.5);
    });

    addTextButton(this, 772, 462, "지도에서 출항", () => this.scene.start("Ocean"), {
      width: 154,
      height: 40,
      fontSize: 15,
      fill: PALETTE.butter,
      iconKey: "icon-map",
      iconScale: 0.28,
    });
  }

  private routeSuggestions(): string[] {
    const seen = new Set<string>();
    const suggestions: string[] = [];
    for (const goodId of this.port.specialtyGoodIds) {
      const good = getTradeGood(goodId);
      if (!good) {
        continue;
      }
      for (const portId of good.demandPortIds) {
        const destination = getPort(portId);
        if (!destination || destination.id === this.port.id || !isPortUnlocked(this.state, destination) || seen.has(destination.id)) {
          continue;
        }
        seen.add(destination.id);
        suggestions.push(`${good.name} → ${destination.name}`);
      }
    }
    return suggestions;
  }

  private addNavigation() {
    addTextButton(this, 92, 500, "항구", () => this.scene.start("Harbor"), {
      width: 120,
      height: 44,
      fontSize: 18,
      fill: PALETTE.seaFoam,
      iconKey: "icon-harbor",
      iconScale: 0.34,
    });
    addTextButton(this, 242, 500, "바다 지도", () => this.scene.start("Ocean"), {
      width: 140,
      height: 44,
      fontSize: 16,
      fill: PALETTE.butter,
      iconKey: "icon-map",
      iconScale: 0.3,
    });
    addTextButton(this, 406, 500, "장비 교환", () => this.scene.start("Exchange"), {
      width: 150,
      height: 44,
      fontSize: 16,
      fill: 0xffc2d1,
      iconKey: "icon-shop",
      iconScale: 0.3,
    });
  }

  private marketMoodLabel(mood: string): string {
    if (mood === "surplus") return "재고 넉넉";
    if (mood === "shortage") return "수요 급등";
    if (mood === "festival") return "항구 축제";
    return "안정 시장";
  }
}

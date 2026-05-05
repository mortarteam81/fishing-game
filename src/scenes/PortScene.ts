import Phaser from "phaser";
import { ports } from "../game/commerceContent";
import { availablePorts, getCargoCapacity, getPort, getUsedCargoVolume, isPortUnlocked, sailToPort } from "../game/commerce";
import { chapterShortLabel } from "../game/chapters";
import { PALETTE, TEXT } from "../game/palette";
import { claimQuest, getVisibleQuests, refreshQuestCompletion, stepLabel, stepProgress, stepTarget } from "../game/progression";
import { loadGame, saveGame } from "../game/storage";
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

    addOceanBackground(this, this.port.theme);
    addHeader(this, "항구 네트워크", this.state);
    addMuteButton(this);

    this.addPortSummary();
    this.addMarketPanel();
    this.addQuestPanel();
    this.addRoutePanel();
    this.addNavigation();
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
    this.add.text(546, 292, "항구 이동", {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "24px",
      fontStyle: "900",
      color: TEXT.primary,
    }).setOrigin(0, 0.5);

    availablePorts(this.state).slice(0, 6).forEach((port, index) => {
      const x = 620 + (index % 2) * 156;
      const y = 332 + Math.floor(index / 2) * 48;
      addTextButton(this, x, y, port.id === this.state.currentPortId ? "현재 항구" : port.name, () => {
        const outcome = sailToPort(this.state, port.id);
        saveGame(outcome.state);
        this.scene.restart({ portId: outcome.state.currentPortId, notice: outcome.message });
      }, {
        width: 140,
        height: 38,
        fontSize: 13,
        fill: port.id === this.state.currentPortId ? PALETTE.disabled : PALETTE.seaFoam,
        disabled: port.id === this.state.currentPortId,
      });
    });
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

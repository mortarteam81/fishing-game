import Phaser from "phaser";
import {
  availableTradeGoodsForPort,
  buyTradeGood,
  canBuyTradeGood,
  getCargoCapacity,
  getMarketQuote,
  getPort,
  getTradeGood,
  getUsedCargoVolume,
  sellTradeGood,
  type MarketQuote,
} from "../game/commerce";
import { PALETTE, TEXT } from "../game/palette";
import { refreshQuestCompletion } from "../game/progression";
import { loadGame, saveGame } from "../game/storage";
import { addHeader, addMuteButton, addOceanBackground, addPanel, addTextButton } from "../game/ui";
import type { PlayerState, TradeGoodDefinition } from "../game/types";

type TradeMode = "buy" | "sell";

const PAGE_SIZE = 5;

export class TradeScene extends Phaser.Scene {
  private state!: PlayerState;
  private mode: TradeMode = "buy";
  private page = 0;

  constructor() {
    super("Trade");
  }

  init(data?: { mode?: TradeMode; page?: number }) {
    this.mode = data?.mode ?? "buy";
    this.page = Math.max(0, Math.floor(data?.page ?? 0));
  }

  create() {
    this.state = refreshQuestCompletion(loadGame());
    const port = getPort(this.state.currentPortId);
    addOceanBackground(this, port?.theme ?? "beach");
    addHeader(this, this.mode === "buy" ? "교역 시장 - 사기" : "교역 시장 - 팔기", this.state);
    addMuteButton(this);
    this.addSummary();
    this.addTabs();
    this.addRows();
    this.addNavigation();
  }

  private addSummary() {
    const port = getPort(this.state.currentPortId);
    addPanel(this, 480, 96, 760, 74, PALETTE.paper);
    this.add.text(124, 84, `${port?.name ?? "항구"} 시장`, {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "23px",
      fontStyle: "900",
      color: TEXT.primary,
    }).setOrigin(0, 0.5);
    this.add.text(124, 114, `화물 ${getUsedCargoVolume(this.state)}/${getCargoCapacity(this.state)} · 순이익 ${this.state.tradeLedger.totalProfit} · 교역일 ${this.state.marketState.day}`, {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "16px",
      fontStyle: "900",
      color: TEXT.secondary,
    }).setOrigin(0, 0.5);
    this.add.text(820, 99, `조개 ${this.state.shells}`, {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "21px",
      fontStyle: "900",
      color: TEXT.primary,
    }).setOrigin(1, 0.5);
  }

  private addTabs() {
    addTextButton(this, 380, 162, "사기", () => this.scene.restart({ mode: "buy", page: 0 }), {
      width: 130,
      height: 38,
      fontSize: 16,
      fill: this.mode === "buy" ? PALETTE.butter : PALETTE.seaFoam,
      iconKey: "icon-shop",
      iconScale: 0.28,
    });
    addTextButton(this, 530, 162, "팔기", () => this.scene.restart({ mode: "sell", page: 0 }), {
      width: 130,
      height: 38,
      fontSize: 16,
      fill: this.mode === "sell" ? PALETTE.butter : PALETTE.seaFoam,
      iconKey: "icon-shell",
      iconScale: 0.28,
    });
  }

  private addRows() {
    const entries = this.mode === "buy" ? this.buyEntries() : this.sellEntries();
    const maxPage = Math.max(0, Math.ceil(entries.length / PAGE_SIZE) - 1);
    this.page = Phaser.Math.Clamp(this.page, 0, maxPage);
    const visible = entries.slice(this.page * PAGE_SIZE, this.page * PAGE_SIZE + PAGE_SIZE);

    if (visible.length === 0) {
      addPanel(this, 480, 310, 640, 110, PALETTE.paper);
      this.add.text(480, 310, this.mode === "buy" ? "이 항구에서 살 수 있는 교역품이 아직 없어요." : "팔 수 있는 화물이 없어요.", {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "20px",
        fontStyle: "900",
        color: TEXT.secondary,
      }).setOrigin(0.5);
    }

    visible.forEach((good, index) => this.addTradeRow(good, 220 + index * 54));

    if (maxPage > 0) {
      addTextButton(this, 398, 500, "이전", () => this.scene.restart({ mode: this.mode, page: this.page - 1 }), {
        width: 90,
        height: 40,
        fontSize: 15,
        fill: PALETTE.seaFoam,
        disabled: this.page <= 0,
      });
      this.add.text(480, 500, `${this.page + 1}/${maxPage + 1}`, {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "16px",
        fontStyle: "900",
        color: TEXT.secondary,
      }).setOrigin(0.5);
      addTextButton(this, 562, 500, "다음", () => this.scene.restart({ mode: this.mode, page: this.page + 1 }), {
        width: 90,
        height: 40,
        fontSize: 15,
        fill: PALETTE.butter,
        disabled: this.page >= maxPage,
      });
    }
  }

  private addTradeRow(good: TradeGoodDefinition, y: number) {
    const quote = getMarketQuote(this.state, good.id);
    if (!quote) {
      return;
    }
    const owned = this.state.cargoHold.filter((lot) => lot.goodId === good.id).reduce((sum, lot) => sum + lot.quantity, 0);
    const canAct = this.mode === "buy" ? canBuyTradeGood(this.state, good.id, 1) : owned > 0;
    addPanel(this, 480, y, 760, 46, this.mode === "buy" ? PALETTE.warmCream : PALETTE.paper);
    this.add.text(124, y - 10, `${good.name} · ${this.categoryLabel(good.category)} · 부피 ${good.volume}`, {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "17px",
      fontStyle: "900",
      color: TEXT.primary,
      fixedWidth: 280,
    }).setOrigin(0, 0.5);
    this.add.text(124, y + 12, this.mode === "buy" ? quote.detail : `보유 ${owned} · 평균가 ${this.averageCost(good.id)}`, {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "12px",
      fontStyle: "800",
      color: TEXT.secondary,
      fixedWidth: 280,
    }).setOrigin(0, 0.5);
    this.add.rectangle(536, y, 150, 30, this.trendFill(quote.trend), 0.94)
      .setStrokeStyle(2, PALETTE.ink, 0.34)
      .setOrigin(0.5);
    this.add.text(466, y, `${quote.label} · ${this.mode === "buy" ? quote.buyPrice : quote.sellPrice}`, {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "16px",
      fontStyle: "900",
      color: TEXT.primary,
      fixedWidth: 156,
    }).setOrigin(0, 0.5);
    addTextButton(this, 740, y, this.mode === "buy" ? "1개 사기" : "1개 팔기", () => {
      this.state = this.mode === "buy" ? buyTradeGood(this.state, good.id, 1) : sellTradeGood(this.state, good.id, 1);
      this.state = refreshQuestCompletion(this.state);
      saveGame(this.state);
      this.scene.restart({ mode: this.mode, page: this.page });
    }, {
      width: 126,
      height: 34,
      fontSize: 14,
      fill: this.mode === "buy" ? PALETTE.butter : PALETTE.seaFoam,
      disabled: !canAct,
    });
  }

  private addNavigation() {
    addTextButton(this, 92, 500, "항구", () => this.scene.start("Port"), {
      width: 120,
      height: 44,
      fontSize: 18,
      fill: PALETTE.seaFoam,
      iconKey: "icon-harbor",
      iconScale: 0.34,
    });
  }

  private buyEntries(): TradeGoodDefinition[] {
    return availableTradeGoodsForPort(this.state);
  }

  private sellEntries(): TradeGoodDefinition[] {
    return this.state.cargoHold
      .map((lot) => getTradeGood(lot.goodId))
      .filter((good): good is TradeGoodDefinition => Boolean(good));
  }

  private averageCost(goodId: string): number {
    const lots = this.state.cargoHold.filter((lot) => lot.goodId === goodId);
    const quantity = lots.reduce((sum, lot) => sum + lot.quantity, 0);
    if (quantity <= 0) {
      return 0;
    }
    return Math.round(lots.reduce((sum, lot) => sum + lot.averageCost * lot.quantity, 0) / quantity);
  }

  private categoryLabel(category: TradeGoodDefinition["category"]): string {
    const labels: Record<TradeGoodDefinition["category"], string> = {
      food: "식료",
      craft: "공예",
      shipPart: "선박재",
      research: "연구재",
      festival: "축제",
      relic: "유물",
    };
    return labels[category];
  }

  private trendFill(trend: MarketQuote["trend"]): number {
    if (trend === "hot") return PALETTE.butter;
    if (trend === "rare") return 0xc7f6ef;
    if (trend === "cheap") return PALETTE.seaFoam;
    if (trend === "expensive") return 0xffd6c9;
    return PALETTE.paper;
  }
}

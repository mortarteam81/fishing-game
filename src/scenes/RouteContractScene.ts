import Phaser from "phaser";
import { getPort, getTradeGood } from "../game/commerce";
import { gearRoleMeta } from "../game/gearRoles";
import { PALETTE, TEXT } from "../game/palette";
import {
  availableRouteContracts,
  completeRouteContract,
  getActiveRouteContract,
  routeContractEventLabel,
  routeContractHasRequiredCargo,
  routeContractNextAction,
  routeContractRequiredEventCleared,
  routeContractRequiredEventStatus,
  routeContractStage,
  startRouteContract,
} from "../game/routeContracts";
import { refreshQuestCompletion } from "../game/progression";
import { loadGame, saveGame } from "../game/storage";
import { addHeader, addMuteButton, addOceanBackground, addPanel, addTextButton } from "../game/ui";
import type { PlayerState, RouteContractDefinition } from "../game/types";

export class RouteContractScene extends Phaser.Scene {
  private state!: PlayerState;
  private notice?: string;

  constructor() {
    super("RouteContract");
  }

  init(data?: { notice?: string }) {
    this.notice = data?.notice;
  }

  create(data?: { notice?: string }) {
    this.state = refreshQuestCompletion(loadGame());
    this.notice = data?.notice ?? this.notice;
    const port = getPort(this.state.currentPortId);
    addOceanBackground(this, port?.theme ?? "harbor");
    addHeader(this, "항로 의뢰", this.state);
    addMuteButton(this);

    this.addOverview();
    this.addActiveContractPanel();
    this.addAvailableContractsPanel();
    this.addNavigation();
  }

  private addOverview() {
    const port = getPort(this.state.currentPortId);
    addPanel(this, 480, 84, 824, 62, PALETTE.paper);
    this.add.text(92, 76, `${port?.name ?? "현재 항구"} 계약 게시판`, {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "22px",
      fontStyle: "900",
      color: TEXT.primary,
      fixedWidth: 380,
    }).setOrigin(0, 0.5);
    this.add.text(92, 104, this.notice ?? "화물을 싣고, 항해 이벤트를 통과하고, 목적지에서 판매하면 보상을 받을 수 있어요.", {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "14px",
      fontStyle: "800",
      color: TEXT.secondary,
      fixedWidth: 620,
    }).setOrigin(0, 0.5);
  }

  private addActiveContractPanel() {
    const active = getActiveRouteContract(this.state);
    addPanel(this, 276, 270, 410, 300, PALETTE.paper);
    this.add.text(92, 145, "진행 중인 항로", {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "23px",
      fontStyle: "900",
      color: TEXT.primary,
    }).setOrigin(0, 0.5);

    if (!active) {
      this.add.text(94, 242, "진행 중인 항로 의뢰가 없어요. 현재 항구에서 받을 수 있는 의뢰를 골라 보세요.", {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "18px",
        fontStyle: "800",
        color: TEXT.secondary,
        wordWrap: { width: 332 },
      }).setOrigin(0, 0.5);
      return;
    }

    this.addContractDetails(active, 96, 180, 330);
    const stage = routeContractStage(this.state, active.id);
    const buttonLabel = stage === "sold" ? "보상 받기" : this.nextSceneLabel(active);
    addTextButton(this, 276, 386, buttonLabel, () => this.handleActiveAction(active), {
      width: 210,
      height: 44,
      fontSize: 17,
      fill: stage === "sold" ? PALETTE.butter : PALETTE.seaFoam,
      iconKey: stage === "sold" ? "icon-shell" : "icon-map",
      iconScale: 0.3,
    });
  }

  private addAvailableContractsPanel() {
    const available = availableRouteContracts(this.state).slice(0, 4);
    const active = getActiveRouteContract(this.state);
    addPanel(this, 704, 270, 410, 300, PALETTE.warmCream);
    this.add.text(520, 145, "받을 수 있는 의뢰", {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "23px",
      fontStyle: "900",
      color: TEXT.primary,
    }).setOrigin(0, 0.5);

    if (available.length === 0) {
      this.add.text(522, 246, active ? "진행 중인 의뢰를 마치면 새 항로를 받을 수 있어요." : "현재 항구에서는 받을 수 있는 새 항로가 없어요.", {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "17px",
        fontStyle: "800",
        color: TEXT.secondary,
        wordWrap: { width: 326 },
      }).setOrigin(0, 0.5);
      return;
    }

    available.forEach((contract, index) => this.addAvailableRow(contract, 190 + index * 60, Boolean(active)));
  }

  private addAvailableRow(contract: RouteContractDefinition, y: number, lockedByActive: boolean) {
    const toPort = getPort(contract.toPortId);
    const good = getTradeGood(contract.requiredGoodId);
    this.add.text(528, y - 16, contract.title, {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "15px",
      fontStyle: "900",
      color: TEXT.primary,
      fixedWidth: 230,
    }).setOrigin(0, 0.5);
    this.add.text(528, y + 6, `${good?.name ?? "화물"} ${contract.requiredQuantity}개 → ${toPort?.name ?? "목적지"}`, {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "12px",
      fontStyle: "800",
      color: TEXT.secondary,
      fixedWidth: 238,
    }).setOrigin(0, 0.5);
    this.add.text(528, y + 25, this.eventSummary(contract), {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "11px",
      fontStyle: "800",
      color: TEXT.secondary,
      fixedWidth: 226,
    }).setOrigin(0, 0.5);
    addTextButton(this, 832, y + 4, "수락", () => {
      this.state = startRouteContract(this.state, contract.id);
      saveGame(this.state);
      this.scene.restart({ notice: `${contract.title} 의뢰를 맡았어요.` });
    }, {
      width: 86,
      height: 36,
      fontSize: 14,
      fill: PALETTE.butter,
      disabled: lockedByActive,
    });
  }

  private addContractDetails(contract: RouteContractDefinition, x: number, y: number, width: number) {
    const fromPort = getPort(contract.fromPortId);
    const toPort = getPort(contract.toPortId);
    const good = getTradeGood(contract.requiredGoodId);
    const role = gearRoleMeta[contract.recommendedRole];
    const eventStatus = routeContractRequiredEventStatus(this.state, contract);
    const reward = `보상 조개 ${contract.rewards.shells ?? 0} · XP ${contract.rewards.xp ?? 0}`;
    const stage = routeContractStage(this.state, contract.id);

    this.add.text(x, y, contract.title, {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "18px",
      fontStyle: "900",
      color: TEXT.primary,
      fixedWidth: width,
    }).setOrigin(0, 0.5);
    this.add.text(x, y + 28, `${fromPort?.name ?? "출발"} → ${toPort?.name ?? "도착"}`, this.detailStyle(width)).setOrigin(0, 0.5);
    this.add.text(x, y + 52, `필요 화물: ${good?.name ?? "화물"} ${contract.requiredQuantity}개`, this.detailStyle(width)).setOrigin(0, 0.5);
    this.add.text(x, y + 76, reward, this.detailStyle(width)).setOrigin(0, 0.5);
    this.add.text(x, y + 100, `다음: ${routeContractNextAction(this.state, contract.id)}`, this.detailStyle(width)).setOrigin(0, 0.5);
    this.add.text(x, y + 126, `추천 역할: ${role.label}`, this.detailStyle(width)).setOrigin(0, 0.5);
    this.add.text(x, y + 150, this.eventSummary(contract, eventStatus?.cleared), this.detailStyle(width)).setOrigin(0, 0.5);
    this.add.text(x, y + 174, `화물 준비: ${routeContractHasRequiredCargo(this.state, contract) ? "완료" : "대기"} · 단계 ${stage ?? "대기"}`, this.detailStyle(width)).setOrigin(0, 0.5);
  }

  private detailStyle(width: number): Phaser.Types.GameObjects.Text.TextStyle {
    return {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "13px",
      fontStyle: "800",
      color: TEXT.secondary,
      fixedWidth: width,
    };
  }

  private eventSummary(contract: RouteContractDefinition, cleared?: boolean): string {
    const required = contract.requiredEventId
      ? `필수 ${routeContractEventLabel(contract.requiredEventId)}${cleared === undefined ? "" : cleared ? " 완료" : " 대기"}`
      : "필수 이벤트 없음";
    const bonus = contract.bonusEventId ? `보너스 ${routeContractEventLabel(contract.bonusEventId)}` : "보너스 없음";
    return `${required} · ${bonus}`;
  }

  private nextSceneLabel(contract: RouteContractDefinition): string {
    const stage = routeContractStage(this.state, contract.id);
    if (stage === "accepted" && this.state.currentPortId === contract.fromPortId) return "화물 싣기";
    if (stage === "sailed" && this.state.currentPortId === contract.toPortId && routeContractRequiredEventCleared(this.state, contract)) return "화물 팔기";
    if (stage === "sold") return "보상 받기";
    return "항해하기";
  }

  private handleActiveAction(contract: RouteContractDefinition) {
    const stage = routeContractStage(this.state, contract.id);
    if (stage === "sold") {
      this.state = completeRouteContract(this.state, contract.id);
      saveGame(this.state);
      this.scene.restart({ notice: `${contract.title} 보상을 받았어요.` });
      return;
    }
    if (stage === "accepted" && this.state.currentPortId === contract.fromPortId) {
      this.scene.start("Trade", { mode: "buy" });
      return;
    }
    if (stage === "sailed" && this.state.currentPortId === contract.toPortId && routeContractRequiredEventCleared(this.state, contract)) {
      this.scene.start("Trade", { mode: "sell" });
      return;
    }
    this.scene.start("Ocean");
  }

  private addNavigation() {
    addTextButton(this, 98, 500, "항구", () => this.scene.start("Port"), {
      width: 120,
      height: 44,
      fontSize: 18,
      fill: PALETTE.seaFoam,
      iconKey: "icon-harbor",
      iconScale: 0.34,
    });
    addTextButton(this, 244, 500, "교역", () => this.scene.start("Trade", { mode: "buy" }), {
      width: 120,
      height: 44,
      fontSize: 18,
      fill: PALETTE.butter,
      iconKey: "icon-shop",
      iconScale: 0.3,
    });
    addTextButton(this, 390, 500, "바다 지도", () => this.scene.start("Ocean"), {
      width: 140,
      height: 44,
      fontSize: 16,
      fill: PALETTE.seaFoam,
      iconKey: "icon-map",
      iconScale: 0.3,
    });
  }
}

import Phaser from "phaser";
import { trackEvent } from "../game/analytics";
import {
  getBillingCopy,
  purchaseCaptainPass,
  queryCaptainPassProducts,
  restoreCaptainPass,
  type BillingProduct,
  type BillingResult,
} from "../game/billing";
import {
  CAPTAIN_PASS_PRODUCT_ID,
  captainPassParentSafetyLines,
  captainPassRewardPreviews,
  grantProductEntitlement,
  hasCaptainPass,
  saveSlotCountForState,
  type CaptainPassRewardPreview,
} from "../game/monetization";
import { PALETTE, TEXT } from "../game/palette";
import { loadGame, saveGame } from "../game/storage";
import { addHeader, addMuteButton, addOceanBackground, addPanel, addTextButton } from "../game/ui";
import type { PlayerState } from "../game/types";

type CaptainPassMode = "intro" | "parent";

export class CaptainPassScene extends Phaser.Scene {
  private state!: PlayerState;
  private mode: CaptainPassMode = "intro";
  private message = "";
  private product?: BillingProduct;
  private billingCopy = getBillingCopy();

  constructor() {
    super("CaptainPass");
  }

  init(data?: { mode?: CaptainPassMode; message?: string }) {
    this.mode = data?.mode ?? "intro";
    this.message = data?.message ?? "";
  }

  create() {
    this.state = loadGame();
    addOceanBackground(this, "pearl");
    addHeader(this, "선장 패스", this.state);
    addMuteButton(this);
    const loading = this.add.text(480, 280, "선장 패스 정보를 확인하는 중...", {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "21px",
      fontStyle: "900",
      color: TEXT.primary,
      backgroundColor: "rgba(255,251,239,0.74)",
      padding: { x: 14, y: 7 },
    }).setOrigin(0.5);

    void this.renderWhenReady(loading);
  }

  private async renderWhenReady(loading: Phaser.GameObjects.Text) {
    this.product = (await queryCaptainPassProducts())[0];
    loading.destroy();
    trackEvent("captain_pass_viewed", this.state, { scene: "CaptainPass" });

    if (this.mode === "parent") {
      this.addParentGate();
    } else {
      this.addIntro();
    }
    this.addNavigation();
  }

  private addIntro() {
    const owned = hasCaptainPass(this.state);
    addPanel(this, 480, 142, 780, 164, owned ? PALETTE.seaFoam : PALETTE.paper);
    this.drawPassLedgerVisual(716, 142, owned);
    this.add.text(118, 82, owned ? "선장 패스 사용 중" : "가족 원정을 더 오래 보관해요", {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "30px",
      fontStyle: "900",
      color: TEXT.primary,
    }).setOrigin(0, 0.5);
    this.add.text(118, 124, owned
      ? `저장 슬롯 ${saveSlotCountForState(this.state)}개와 전용 외형이 열려 있어요.`
      : "광고, 채팅, 랜덤박스 없이 가족이 믿고 열 수 있는 1회성 패스예요.", {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "18px",
      fontStyle: "800",
      color: TEXT.secondary,
      wordWrap: { width: 512 },
    }).setOrigin(0, 0.5);
    this.add.text(118, 166, this.message || (this.product?.formattedPrice ? `가격: ${this.product.formattedPrice}` : "가격은 Play Console에서 표시돼요."), {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "16px",
      fontStyle: "900",
      color: TEXT.primary,
      backgroundColor: "rgba(255,251,239,0.62)",
      padding: { x: 10, y: 4 },
    }).setOrigin(0, 0.5);

    this.addRewardPreviewPanel(owned);
    this.addReportPanel();

    if (owned) {
      addTextButton(this, 380, 482, "저장 슬롯 보기", () => this.scene.start("Save"), {
        width: 170,
        height: 48,
        fontSize: 16,
        fill: PALETTE.butter,
        iconKey: "icon-map",
        iconScale: 0.32,
      });
      addTextButton(this, 580, 482, "전용 외형 보기", () => this.scene.start("Exchange", { category: "boat", chapterFilter: "base", roleFilter: "all" }), {
        width: 180,
        height: 48,
        fontSize: 16,
        fill: PALETTE.seaFoam,
        iconKey: "icon-shop",
        iconScale: 0.3,
      });
      return;
    }

    addTextButton(this, 362, 482, "부모 안내 보기", () => {
      trackEvent("parent_gate_viewed", this.state, { scene: "CaptainPass" });
      this.scene.restart({ mode: "parent" });
    }, {
      width: 174,
      height: 48,
      fontSize: 16,
      fill: PALETTE.butter,
      iconKey: "icon-quest",
      iconScale: 0.3,
    });
    addTextButton(this, 586, 482, "구매 복원", () => void this.handleRestore(), {
      width: 154,
      height: 48,
      fontSize: 16,
      fill: PALETTE.seaFoam,
      iconKey: "icon-repeat",
      iconScale: 0.28,
    });
  }

  private addParentGate() {
    addPanel(this, 480, 252, 740, 354, PALETTE.paper);
    this.add.text(132, 100, "부모 안내", {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "31px",
      fontStyle: "900",
      color: TEXT.primary,
    }).setOrigin(0, 0.5);
    const lines = captainPassParentSafetyLines(this.billingCopy.platform);
    lines.forEach((line, index) => {
      this.add.text(150, 146 + index * 34, `• ${line}`, {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "16px",
        fontStyle: "800",
        color: TEXT.primary,
        wordWrap: { width: 640 },
      }).setOrigin(0, 0.5);
    });
    this.add.text(150, 386, this.billingCopy.availabilityLine, {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "15px",
      fontStyle: "900",
      color: TEXT.secondary,
      wordWrap: { width: 640 },
    }).setOrigin(0, 0.5);
    addTextButton(this, 342, 432, this.billingCopy.purchaseCta, () => void this.handlePurchase(), {
      width: 264,
      height: 52,
      fontSize: 16,
      fill: PALETTE.butter,
      iconKey: "icon-shop",
      iconScale: 0.3,
    });
    addTextButton(this, 620, 432, this.billingCopy.restoreCta, () => void this.handleRestore(), {
      width: 168,
      height: 52,
      fontSize: 16,
      fill: PALETTE.seaFoam,
      iconKey: "icon-repeat",
      iconScale: 0.28,
    });
  }

  private drawPassLedgerVisual(x: number, y: number, owned: boolean) {
    const g = this.add.graphics();
    g.fillStyle(PALETTE.warmCream, 1);
    g.fillRoundedRect(x - 102, y - 56, 204, 112, 8);
    g.lineStyle(3, PALETTE.ink, 0.62);
    g.strokeRoundedRect(x - 102, y - 56, 204, 112, 8);

    g.fillStyle(owned ? PALETTE.butter : PALETTE.seaFoam, 1);
    g.fillRoundedRect(x - 82, y - 38, 68, 48, 5);
    g.lineStyle(2, PALETTE.ink, 0.52);
    g.strokeRoundedRect(x - 82, y - 38, 68, 48, 5);

    g.fillStyle(PALETTE.lagoon, 1);
    g.fillRoundedRect(x + 8, y - 26, 74, 26, 4);
    g.fillStyle(PALETTE.coral, 1);
    g.fillTriangle(x + 40, y - 54, x + 40, y - 8, x + 78, y - 32);
    g.lineStyle(2, PALETTE.ink, 0.46);
    g.lineBetween(x + 40, y - 54, x + 40, y + 14);

    g.lineStyle(2, PALETTE.ink, 0.28);
    g.lineBetween(x - 82, y + 30, x + 82, y + 30);
    g.lineBetween(x - 82, y + 42, x + 54, y + 42);

    this.add.text(x, y + 60, owned ? "열린 항해 도구" : "패스 보상 미리보기", {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "13px",
      fontStyle: "900",
      color: TEXT.primary,
    }).setOrigin(0.5);
  }

  private addRewardPreviewPanel(owned: boolean) {
    const rewards = captainPassRewardPreviews();
    addPanel(this, 282, 338, 356, 224, PALETTE.paper);
    this.add.text(126, 244, owned ? "열린 보상" : "패스 보상", {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "23px",
      fontStyle: "900",
      color: TEXT.primary,
    }).setOrigin(0, 0.5);

    rewards.forEach((reward, index) => {
      const y = 286 + index * 40;
      this.drawRewardGlyph(144, y, reward);
      this.add.text(174, y - 8, reward.title, {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "15px",
        fontStyle: "900",
        color: TEXT.primary,
      }).setOrigin(0, 0.5);
      this.add.text(174, y + 10, reward.detail, {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "11px",
        fontStyle: "800",
        color: TEXT.secondary,
        wordWrap: { width: 250 },
      }).setOrigin(0, 0.5);
    });
  }

  private drawRewardGlyph(x: number, y: number, reward: CaptainPassRewardPreview) {
    const g = this.add.graphics();
    g.fillStyle(PALETTE.seaFoam, 1);
    g.fillRoundedRect(x - 15, y - 15, 30, 30, 6);
    g.lineStyle(2, PALETTE.ink, 0.55);
    g.strokeRoundedRect(x - 15, y - 15, 30, 30, 6);

    g.lineStyle(2, PALETTE.ink, 0.72);
    if (reward.visualKind === "slots") {
      g.strokeRoundedRect(x - 8, y - 8, 7, 7, 1);
      g.strokeRoundedRect(x + 2, y - 8, 7, 7, 1);
      g.strokeRoundedRect(x - 8, y + 2, 7, 7, 1);
      return;
    }
    if (reward.visualKind === "boat") {
      g.fillStyle(PALETTE.lagoon, 1);
      g.fillTriangle(x - 10, y + 4, x + 10, y + 4, x + 5, y + 10);
      g.lineBetween(x, y - 10, x, y + 4);
      g.lineBetween(x, y - 8, x + 8, y - 2);
      return;
    }
    if (reward.visualKind === "ledger") {
      g.strokeRoundedRect(x - 8, y - 10, 16, 20, 2);
      g.lineBetween(x - 4, y - 2, x + 5, y - 2);
      g.lineBetween(x - 4, y + 4, x + 4, y + 4);
      return;
    }
    g.strokeCircle(x, y, 9);
    g.lineBetween(x - 5, y, x - 1, y + 4);
    g.lineBetween(x, y + 4, x + 6, y - 5);
  }

  private addReportPanel() {
    const uniqueFriends = Object.values(this.state.collection).filter((count) => count > 0).length;
    addPanel(this, 678, 330, 346, 210, PALETTE.warmCream);
    this.add.text(526, 252, "부모용 탐험 리포트", {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "23px",
      fontStyle: "900",
      color: TEXT.primary,
    }).setOrigin(0, 0.5);

    const metrics = [
      { label: "선장", value: `Lv.${this.state.level}` },
      { label: "도감", value: `${uniqueFriends}종` },
      { label: "항구", value: `${this.state.visitedPortIds.length}곳` },
      { label: "교역", value: `${this.state.tradeLedger.completedRoutes}회` },
    ];
    metrics.forEach((metric, index) => {
      const col = index % 2;
      const row = Math.floor(index / 2);
      this.drawReportStamp(574 + col * 108, 304 + row * 58, metric.label, metric.value);
    });
    this.add.text(526, 414, hasCaptainPass(this.state) ? "원정 기록 보관 준비 완료" : "패스를 열면 기록 보관함이 확장돼요", {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "14px",
      fontStyle: "900",
      color: TEXT.secondary,
      wordWrap: { width: 284 },
    }).setOrigin(0, 0.5);
  }

  private drawReportStamp(x: number, y: number, label: string, value: string) {
    const g = this.add.graphics();
    g.fillStyle(PALETTE.paper, 1);
    g.fillRoundedRect(x - 44, y - 22, 88, 44, 7);
    g.lineStyle(2, PALETTE.ink, 0.42);
    g.strokeRoundedRect(x - 44, y - 22, 88, 44, 7);
    this.add.text(x, y - 8, label, {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "11px",
      fontStyle: "900",
      color: TEXT.secondary,
    }).setOrigin(0.5);
    this.add.text(x, y + 9, value, {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "17px",
      fontStyle: "900",
      color: TEXT.primary,
    }).setOrigin(0.5);
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
  }

  private async handlePurchase() {
    trackEvent("purchase_started", this.state, { productId: CAPTAIN_PASS_PRODUCT_ID, scene: "CaptainPass" });
    const result = await purchaseCaptainPass();
    this.applyBillingResult(result, result.status === "purchased" ? "새 항해 도구가 열렸어요." : undefined);
  }

  private async handleRestore() {
    const result = await restoreCaptainPass();
    this.applyBillingResult(result, result.status === "restored" ? "구매 기록을 확인하고 선장 패스를 열었어요." : undefined);
  }

  private applyBillingResult(result: BillingResult, successMessage?: string) {
    if (result.status === "purchased" || result.status === "restored") {
      const productIds = result.purchasedProductIds?.length ? result.purchasedProductIds : (result.productId ? [result.productId] : []);
      if (!productIds.includes(CAPTAIN_PASS_PRODUCT_ID)) {
        this.scene.restart({ message: result.message ?? "선장 패스 구매 결과를 확인하지 못했어요." });
        return;
      }
      const next = productIds.reduce(
        (state, productId) => grantProductEntitlement(state, productId, result.status === "restored" ? new Date().toISOString() : undefined),
        this.state,
      );
      saveGame(next);
      this.state = next;
      trackEvent(result.status === "restored" ? "restore_completed" : "purchase_completed", next, {
        productId: CAPTAIN_PASS_PRODUCT_ID,
        scene: "CaptainPass",
      });
      this.scene.restart({ message: successMessage ?? result.message ?? "선장 패스를 확인했어요." });
      return;
    }

    if (result.status === "cancelled") {
      trackEvent("purchase_cancelled", this.state, { productId: CAPTAIN_PASS_PRODUCT_ID, scene: "CaptainPass" });
    }

    this.scene.restart({
      message: result.message ?? (result.status === "cancelled" ? "구매를 취소했어요." : "지금은 구매를 진행할 수 없어요."),
    });
  }
}

import Phaser from "phaser";
import { ensureSvgTextures, fishTexture } from "../game/lazyTextures";
import { getStarterJourney } from "../game/onboarding";
import { PALETTE, TEXT } from "../game/palette";
import { addHeader, addMuteButton, addOceanBackground, addPanel, addTextButton } from "../game/ui";
import { loadGame } from "../game/storage";
import type { CatchResult, PlayerState } from "../game/types";

export class CatchResultScene extends Phaser.Scene {
  private result!: CatchResult;
  private areaId = "sunny-beach";
  private state!: PlayerState;

  constructor() {
    super("CatchResult");
  }

  init(data: { result: CatchResult; areaId: string }) {
    this.result = data.result;
    this.areaId = data.areaId;
  }

  create() {
    this.state = loadGame();
    addOceanBackground(this, "harbor");
    addHeader(this, "만남 기록", this.state);
    addMuteButton(this);
    addPanel(this, 480, 262, 620, 330, PALETTE.paper);

    const loadingText = this.add
      .text(480, 262, "만남 기록을 펼치는 중...", {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "21px",
        fontStyle: "900",
        color: TEXT.primary,
        backgroundColor: "rgba(255,251,239,0.72)",
        padding: { x: 14, y: 7 },
      })
      .setOrigin(0.5)
      .setDepth(20);

    void this.renderResult(loadingText);
  }

  private async renderResult(loadingText: Phaser.GameObjects.Text) {
    await ensureSvgTextures(this, this.result.success ? fishTexture(this.result.fish) : []);
    loadingText.destroy();

    if (this.result.success && this.result.fish) {
      this.add.image(480, 176, "sparkle-point").setScale(1.25).setAlpha(0.5);
      const fishImage = this.add.image(480, 180, this.result.fish.assetKey).setScale(2.1);
      if (this.result.mutation) {
        fishImage.setTint(this.result.mutation.tint);
        this.add
          .text(480, 226, this.result.mutation.label, {
            fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
            fontSize: "18px",
            fontStyle: "900",
            color: TEXT.primary,
            backgroundColor: "rgba(255,251,239,0.72)",
            padding: { x: 12, y: 5 },
          })
          .setOrigin(0.5);
      }
      this.add
        .text(480, 272, this.result.fish.name, {
          fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
          fontSize: "36px",
          fontStyle: "900",
          color: TEXT.primary,
        })
        .setOrigin(0.5);
      this.add
        .text(480, 322, this.result.fish.funFact, {
          fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
          fontSize: "22px",
          fontStyle: "700",
          color: TEXT.secondary,
          align: "center",
          wordWrap: { width: 520 },
        })
        .setOrigin(0.5);
    } else {
      this.add
        .text(480, 190, "퐁!", {
          fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
          fontSize: "54px",
          fontStyle: "900",
          color: TEXT.primary,
        })
        .setOrigin(0.5);
      this.add
        .text(480, 280, this.result.consolation ?? "반짝 조개", {
          fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
          fontSize: "34px",
          fontStyle: "900",
          color: TEXT.primary,
        })
        .setOrigin(0.5);
    }

    const researchLine = this.result.research
      ? `연구 +${this.result.research.points} · ${
          this.result.research.rankAfter > this.result.research.rankBefore
            ? `${this.result.research.rankLabel} 단계 달성!`
            : `${this.result.research.rankLabel} 단계 진행 중`
        }`
      : undefined;

    this.add
      .text(
        480,
        376,
        [
          this.result.message,
          `조개 +${this.result.shells}  ·  경험치 +${this.result.xp}`,
          researchLine,
        ].filter(Boolean).join("\n"),
        {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: researchLine ? "20px" : "23px",
        fontStyle: "800",
        color: TEXT.primary,
        align: "center",
        lineSpacing: researchLine ? 6 : 8,
      },
      )
      .setOrigin(0.5);

    const starterJourney = getStarterJourney(this.state);
    if (starterJourney) {
      this.add
        .text(480, 426, `다음 목표: ${starterJourney.title}`, {
          fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
          fontSize: "16px",
          fontStyle: "900",
          color: TEXT.secondary,
          backgroundColor: "rgba(255,251,239,0.62)",
          padding: { x: 10, y: 4 },
        })
        .setOrigin(0.5);
      addTextButton(this, 318, 480, "한 번 더", () => this.scene.start("Fishing", { areaId: this.areaId }), {
        width: 146,
        height: 50,
        fontSize: 17,
        fill: PALETTE.butter,
        iconKey: "icon-repeat",
        iconScale: 0.32,
      });
      addTextButton(this, 480, 480, starterJourney.ctaLabel, () => this.scene.start(starterJourney.scene, starterJourney.data), {
        width: 150,
        height: 50,
        fontSize: 16,
        fill: PALETTE.lavender,
        iconKey: starterJourney.scene === "Quest" ? "icon-quest" : starterJourney.scene === "Exchange" ? "icon-shop" : "icon-bait",
        iconScale: 0.3,
      });
      addTextButton(this, 642, 480, "항구로", () => this.scene.start("Harbor"), {
        width: 146,
        height: 50,
        fontSize: 17,
        fill: PALETTE.seaFoam,
        iconKey: "icon-harbor",
        iconScale: 0.32,
      });
      return;
    }

    addTextButton(this, 380, 470, "한 번 더", () => this.scene.start("Fishing", { areaId: this.areaId }), {
      width: 180,
      height: 58,
      fill: PALETTE.butter,
      iconKey: "icon-repeat",
      iconScale: 0.38,
    });
    addTextButton(this, 580, 470, "항구로", () => this.scene.start("Harbor"), {
      width: 180,
      height: 58,
      fill: PALETTE.seaFoam,
      iconKey: "icon-harbor",
      iconScale: 0.36,
    });
  }
}

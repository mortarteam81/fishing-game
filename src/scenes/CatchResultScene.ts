import Phaser from "phaser";
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

    this.add
      .text(480, 376, `${this.result.message}\n조개 +${this.result.shells}  ·  경험치 +${this.result.xp}`, {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "23px",
        fontStyle: "800",
        color: TEXT.primary,
        align: "center",
        lineSpacing: 8,
      })
      .setOrigin(0.5);

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

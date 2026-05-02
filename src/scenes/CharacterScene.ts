import Phaser from "phaser";
import { addCaptainFigure, addPlayerBoat } from "../game/boat";
import { captainPresets, nextCaptainPreset } from "../game/character";
import { allCaptainTextures, ensureSvgTextures, playerPresentationTextures } from "../game/lazyTextures";
import { PALETTE, TEXT } from "../game/palette";
import { loadGame, saveGame } from "../game/storage";
import { addHeader, addMuteButton, addOceanBackground, addPanel, addTextButton } from "../game/ui";
import type { PlayerState } from "../game/types";

export class CharacterScene extends Phaser.Scene {
  private state!: PlayerState;

  constructor() {
    super("Character");
  }

  create() {
    this.state = loadGame();
    addOceanBackground(this, "mist");
    addHeader(this, "선장 생성", this.state);
    addMuteButton(this, 880, 82);

    const loadingText = this.add
      .text(480, 290, "선장 의상을 준비하는 중...", {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "22px",
        fontStyle: "900",
        color: TEXT.primary,
        backgroundColor: "rgba(255,251,239,0.72)",
        padding: { x: 14, y: 7 },
      })
      .setOrigin(0.5)
      .setDepth(20);

    void this.renderWhenReady(loadingText);
  }

  private async renderWhenReady(loadingText: Phaser.GameObjects.Text) {
    await ensureSvgTextures(this, [
      ...allCaptainTextures(),
      ...playerPresentationTextures(this.state),
    ]);
    loadingText.destroy();

    addPanel(this, 260, 298, 360, 360, PALETTE.paper);
    this.add
      .text(260, 126, "선장 프로필", {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "30px",
        fontStyle: "900",
        color: TEXT.primary,
      })
      .setOrigin(0.5);
    this.add
      .text(260, 158, this.state.captain.name, {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "22px",
        fontStyle: "900",
        color: TEXT.secondary,
      })
      .setOrigin(0.5);
    addCaptainFigure(this, 260, 312, this.state.captain, 1.36);

    addPanel(this, 680, 286, 400, 336, PALETTE.warmCream);
    this.add
      .text(512, 136, "항구 의상실에 새 선장복이 준비됐어요.", {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "21px",
        fontStyle: "900",
        color: TEXT.primary,
        wordWrap: { width: 336 },
      })
      .setOrigin(0, 0.5);
    this.add
      .text(512, 190, "오늘의 항로에 어울리는 분위기로 선장의 이름과 옷차림을 골라보세요.", {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "17px",
        fontStyle: "800",
        color: TEXT.secondary,
        wordWrap: { width: 336 },
      })
      .setOrigin(0, 0.5);

    addPlayerBoat(this, 682, 350, this.state, { scale: 0.68, depth: 6 });

    addTextButton(this, 574, 442, "이전", () => this.selectPreset(-1), {
      width: 130,
      height: 48,
      fontSize: 18,
      fill: PALETTE.seaFoam,
    });
    addTextButton(this, 724, 442, "다음", () => this.selectPreset(1), {
      width: 130,
      height: 48,
      fontSize: 18,
      fill: PALETTE.butter,
    });
    addTextButton(this, 846, 500, "항구", () => this.scene.start("Harbor"), {
      width: 120,
      height: 44,
      fontSize: 18,
      fill: PALETTE.seaFoam,
      iconKey: "icon-harbor",
      iconScale: 0.34,
    });

    this.addPresetDots();
  }

  private selectPreset(direction: number) {
    const captain = nextCaptainPreset(this.state.captain.presetId, direction);
    saveGame({ ...this.state, captain });
    this.scene.restart();
  }

  private addPresetDots() {
    captainPresets.forEach((preset, index) => {
      const selected = preset.presetId === this.state.captain.presetId;
      const dot = this.add.circle(545 + index * 36, 492, selected ? 10 : 7, selected ? preset.accentTint : 0xffffff, 1);
      dot.setStrokeStyle(3, PALETTE.ink, selected ? 0.8 : 0.32);
      dot.setInteractive({ useHandCursor: true });
      dot.on("pointerdown", () => {
        saveGame({ ...this.state, captain: preset });
        this.scene.restart();
      });
    });
  }
}

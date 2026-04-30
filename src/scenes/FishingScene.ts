import Phaser from "phaser";
import { getArea } from "../game/content";
import { playSoftTone } from "../game/audio";
import { recordCatch, recordConsolation, refreshQuestCompletion } from "../game/progression";
import { resolveTiming, startFishing } from "../game/fishing";
import { PALETTE, TEXT } from "../game/palette";
import { loadGame, saveGame } from "../game/storage";
import { addHeader, addMuteButton, addOceanBackground, addTextButton } from "../game/ui";
import type { CatchResult, FishingAttempt, PlayerState } from "../game/types";

export class FishingScene extends Phaser.Scene {
  private state!: PlayerState;
  private areaId = "sunny-beach";
  private attempt?: FishingAttempt;
  private castButton?: Phaser.GameObjects.Container;
  private needle?: Phaser.GameObjects.Rectangle;
  private meterGroup?: Phaser.GameObjects.Container;
  private waitingText?: Phaser.GameObjects.Text;
  private meterActive = false;
  private direction = 1;
  private score = 0;

  constructor() {
    super("Fishing");
  }

  init(data: { areaId?: string }) {
    this.areaId = data.areaId ?? "sunny-beach";
  }

  create() {
    this.state = loadGame();
    const area = getArea(this.areaId);
    const variant = this.areaId === "coral-sea" ? "coral" : this.areaId === "little-pier" ? "pier" : "beach";
    addOceanBackground(this, variant);
    addHeader(this, area?.name ?? "낚시터", this.state);
    addMuteButton(this);

    this.addFishingSetPiece();
    this.add
      .text(480, 118, "물결이 반짝이면 버튼을 눌러요.", {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "28px",
        fontStyle: "800",
        color: TEXT.primary,
        align: "center",
      })
      .setOrigin(0.5);

    this.castButton = addTextButton(this, 480, 430, "낚시하기", () => this.castLine(), {
      width: 230,
      height: 72,
      fill: PALETTE.butter,
      fontSize: 28,
      iconKey: "icon-rod",
      iconScale: 0.5,
    });

    addTextButton(this, 92, 500, "항구", () => this.scene.start("Harbor"), {
      width: 120,
      height: 44,
      fontSize: 18,
      fill: PALETTE.seaFoam,
      iconKey: "icon-harbor",
      iconScale: 0.34,
    });
  }

  update(_: number, delta: number) {
    if (!this.meterActive || !this.needle) {
      return;
    }

    this.score += this.direction * delta * 0.00072;
    if (this.score >= 1) {
      this.score = 1;
      this.direction = -1;
    }
    if (this.score <= 0) {
      this.score = 0;
      this.direction = 1;
    }
    this.needle.x = -180 + this.score * 360;
  }

  private castLine() {
    if (this.castButton) {
      this.castButton.destroy();
    }

    this.attempt = startFishing(this.areaId, this.state);
    playSoftTone(this, this.state, 440, 0.06);
    this.waitingText = this.add
      .text(480, 405, "기다리는 중... 찰랑찰랑", {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "26px",
        fontStyle: "800",
        color: TEXT.primary,
      })
      .setOrigin(0.5);

    this.time.delayedCall(this.attempt.biteDelayMs, () => this.showMeter());
  }

  private showMeter() {
    if (!this.attempt) {
      return;
    }

    this.waitingText?.destroy();
    playSoftTone(this, this.state, 660, 0.08);

    const bg = this.add.rectangle(0, 0, 410, 56, PALETTE.paper, 0.9).setStrokeStyle(4, PALETTE.ink);
    const targetWidth = this.attempt.targetWidth * 360;
    const target = this.add.rectangle(0, 0, targetWidth, 42, PALETTE.moss, 0.95);
    const sparkle = this.add.rectangle(0, 0, 34, 42, PALETTE.butter, 0.95);
    this.needle = this.add.rectangle(-180, 0, 10, 78, PALETTE.coralDeep, 1);
    const text = this.add
      .text(0, -72, "초록빛일 때 당기기!", {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "28px",
        fontStyle: "800",
        color: TEXT.primary,
      })
      .setOrigin(0.5);
    this.meterGroup = this.add.container(480, 382, [bg, target, sparkle, this.needle, text]);
    this.meterActive = true;
    this.input.once("pointerdown", () => this.resolveCatch());
  }

  private resolveCatch() {
    if (!this.attempt || !this.meterActive) {
      return;
    }

    this.meterActive = false;
    const result = resolveTiming(this.attempt, this.score, this.state);
    const next = result.success && result.fish
      ? recordCatch(this.state, result.fish.id, result.shells, result.xp)
      : recordConsolation(this.state, result.shells, result.xp);
    const refreshed = refreshQuestCompletion(next);
    saveGame(refreshed);
    this.playResultTone(result);
    this.scene.start("CatchResult", { result, areaId: this.areaId });
  }

  private playResultTone(result: CatchResult) {
    if (result.success) {
      playSoftTone(this, this.state, result.quality === "sparkle" ? 880 : 720, 0.12);
    } else {
      playSoftTone(this, this.state, 360, 0.08);
    }
  }

  private addFishingSetPiece() {
    const landmark =
      this.areaId === "coral-sea" ? "map-reef" : this.areaId === "little-pier" ? "map-pier" : "map-island";
    this.add.image(738, 308, landmark).setScale(this.areaId === "little-pier" ? 1.05 : 0.92).setAlpha(0.86);
    this.add.image(210, 340, "boat").setScale(1.15);
    this.add.image(244, 282, "captain-kid").setScale(0.48);

    const line = this.add.graphics();
    line.lineStyle(4, PALETTE.inkSoft, 0.36);
    line.beginPath();
    line.moveTo(262, 300);
    line.lineTo(372, 365);
    line.strokePath();
    line.fillStyle(PALETTE.butter, 0.85);
    line.fillCircle(374, 365, 8);
  }
}

import Phaser from "phaser";
import { addPlayerBoat } from "../game/boat";
import { getArea } from "../game/content";
import { playHaptic, stopHaptics } from "../game/haptics";
import { playSoftTone } from "../game/audio";
import { getReelPower, recordCatch, recordConsolation, refreshQuestCompletion } from "../game/progression";
import { resolveTiming, startFishing } from "../game/fishing";
import { ensureSvgTextures, playerPresentationTextures } from "../game/lazyTextures";
import { PALETTE, TEXT } from "../game/palette";
import { loadGame, saveGame } from "../game/storage";
import { itemIconTextureKey } from "../game/textureKeys";
import { addHeader, addMuteButton, addOceanBackground, addTextButton } from "../game/ui";
import { getAreaWeather, weatherEffectLabel } from "../game/weather";
import type { CatchResult, FishingAttempt, PlayerState } from "../game/types";

export class FishingScene extends Phaser.Scene {
  private state!: PlayerState;
  private areaId = "sunny-beach";
  private attempt?: FishingAttempt;
  private castButton?: Phaser.GameObjects.Container;
  private needle?: Phaser.GameObjects.Rectangle;
  private meterGroup?: Phaser.GameObjects.Container;
  private targetZone?: Phaser.GameObjects.Rectangle;
  private progressBar?: Phaser.GameObjects.Rectangle;
  private waitingText?: Phaser.GameObjects.Text;
  private meterActive = false;
  private reeling = false;
  private direction = 1;
  private score = 0;
  private reelProgress = 0.35;
  private reelTime = 0;
  private lastReelHapticAt = 0;
  private targetWave = 0;
  private dynamicTargetCenter = 0.5;

  constructor() {
    super("Fishing");
  }

  init(data: { areaId?: string }) {
    this.areaId = data.areaId ?? "sunny-beach";
  }

  create() {
    this.state = loadGame();
    const area = getArea(this.areaId);
    const variant = area?.theme ?? "beach";
    const weather = area ? getAreaWeather(area, this.state) : undefined;
    addOceanBackground(this, variant);
    addHeader(this, area?.name ?? "낚시터", this.state);
    addMuteButton(this);

    this.add
      .text(480, 112, area?.flavor ?? "물결이 반짝이면 버튼을 눌러요.", {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "22px",
        fontStyle: "800",
        color: TEXT.primary,
        align: "center",
        wordWrap: { width: 760 },
      })
      .setOrigin(0.5);

    if (weather) {
      this.addWeatherBadge(weather.label, weather.description, weatherEffectLabel(weather), weather.tint);
    }

    const loadingText = this.add
      .text(480, 330, "낚시 장비를 준비하는 중...", {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "21px",
        fontStyle: "900",
        color: TEXT.primary,
        backgroundColor: "rgba(255,251,239,0.7)",
        padding: { x: 14, y: 7 },
      })
      .setOrigin(0.5)
      .setDepth(20);

    void this.renderFishingSetup(loadingText);
  }

  private async renderFishingSetup(loadingText: Phaser.GameObjects.Text) {
    await ensureSvgTextures(this, playerPresentationTextures(this.state));
    loadingText.destroy();
    this.addFishingSetPiece();
    this.castButton = addTextButton(this, 480, 430, "낚시하기", () => this.castLine(), {
      width: 230,
      height: 72,
      fill: PALETTE.butter,
      fontSize: 28,
      iconKey: itemIconTextureKey(this.state.equippedRodId),
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

    this.score += this.direction * delta * 0.00068;
    if (this.score >= 1) {
      this.score = 1;
      this.direction = -1;
    }
    if (this.score <= 0) {
      this.score = 0;
      this.direction = 1;
    }
    this.needle.x = -180 + this.score * 360;

    if (this.targetZone && this.attempt) {
      this.targetWave += delta * this.fishMotionSpeed();
      const sway = Math.sin(this.targetWave) * this.targetSway();
      this.targetZone.x = sway;
      this.dynamicTargetCenter = Phaser.Math.Clamp(0.5 + sway / 360, 0.16, 0.84);
    }

    this.updateReelProgress(delta);
  }

  private castLine() {
    if (this.castButton) {
      this.castButton.destroy();
    }

    this.attempt = startFishing(this.areaId, this.state);
    this.score = 0;
    this.direction = 1;
    this.reelProgress = 0.35;
    this.reelTime = 0;
    this.lastReelHapticAt = 0;
    this.dynamicTargetCenter = this.attempt.targetCenter;
    playHaptic("cast");
    playSoftTone(this, this.state, 440, 0.06);
    this.playCastEffects();
    this.waitingText = this.add
      .text(480, 405, "캐스팅 성공! 물결을 살피는 중...", {
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
    playHaptic("bite");
    playSoftTone(this, this.state, 660, 0.08);
    this.playBiteEffects();

    // 釣り計器 Fishing meter — washi paper with lacquer border
    const bg = this.add.rectangle(0, 0, 410, 56, PALETTE.paper, 0.92).setStrokeStyle(3, PALETTE.ink, 0.72);
    const targetWidth = this.attempt.targetWidth * 360;
    const target = this.add.rectangle(0, 0, targetWidth, 42, PALETTE.moss, 0.95);
    const sparkle = this.add.rectangle(0, 0, 34, 42, PALETTE.butter, 0.90);
    this.needle = this.add.rectangle(-180, 0, 8, 78, PALETTE.coral, 1);
    this.targetZone = target;
    this.progressBar = this.add.rectangle(-180, 58, 126, 14, PALETTE.seaGlass, 1).setOrigin(0, 0.5);
    const progressBg = this.add.rectangle(0, 58, 360, 18, PALETTE.warmCream, 0.82).setStrokeStyle(2, PALETTE.ink, 0.35);
    const text = this.add
      .text(0, -76, "누르고 있으면 릴 감기 · 초록빛에 맞추면 빨라져요", {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "22px",
        fontStyle: "800",
        color: TEXT.primary,
      })
      .setOrigin(0.5);
    this.meterGroup = this.add.container(480, 372, [bg, target, sparkle, this.needle, progressBg, this.progressBar, text]);
    this.meterActive = true;
    this.input.on("pointerdown", this.beginReel, this);
    this.input.on("pointerup", this.stopReel, this);
    this.input.keyboard?.on("keydown-SPACE", this.beginReel, this);
    this.input.keyboard?.on("keyup-SPACE", this.stopReel, this);
  }

  private beginReel() {
    if (!this.meterActive || this.reeling) {
      return;
    }

    this.reeling = true;
    this.lastReelHapticAt = 0;
    playHaptic("reelStart");
  }

  private stopReel() {
    this.reeling = false;
    stopHaptics();
  }

  private updateReelProgress(delta: number) {
    if (!this.attempt) {
      return;
    }

    this.reelTime += delta;
    const distance = Math.abs(this.score - this.dynamicTargetCenter);
    const inTarget = distance <= this.attempt.targetWidth / 2;
    const qualityBoost = distance <= this.attempt.targetWidth * 0.14 ? 1.25 : 1;

    if (this.reeling) {
      const reelPower = getReelPower(this.state);
      this.reelProgress += (inTarget ? (0.00028 + reelPower * 0.00055) * qualityBoost : -0.0002) * delta;
      this.playReelHaptic(inTarget);
    } else {
      this.reelProgress -= 0.000035 * delta;
    }

    this.reelProgress = Phaser.Math.Clamp(this.reelProgress, 0, 1);
    if (this.progressBar) {
      this.progressBar.width = 360 * this.reelProgress;
      this.progressBar.setFillStyle(inTarget ? PALETTE.seaGlass : PALETTE.coral, 1);
    }

    if (this.reelProgress >= 1) {
      this.resolveCatch();
      return;
    }

    if (this.reelTime > 3200 && this.reelProgress <= 0.02) {
      this.resolveCatch(true);
    }
  }

  private fishMotionSpeed() {
    if (!this.attempt) {
      return 0.003;
    }

    switch (this.attempt.fish.rarity) {
      case "ancient":
        return 0.0074;
      case "legendary":
        return 0.0068;
      case "mythic":
        return 0.0062;
      case "epic":
        return 0.0056;
      case "rare":
        return 0.0051;
      case "uncommon":
        return 0.0042;
      default:
        return 0.0034;
    }
  }

  private targetSway() {
    if (!this.attempt) {
      return 0;
    }

    switch (this.attempt.fish.rarity) {
      case "ancient":
        return 138;
      case "legendary":
        return 124;
      case "mythic":
        return 112;
      case "epic":
        return 96;
      case "rare":
        return 84;
      case "uncommon":
        return 58;
      default:
        return 32;
    }
  }

  private resolveCatch(forceMiss = false) {
    if (!this.attempt || !this.meterActive) {
      return;
    }

    this.meterActive = false;
    this.reeling = false;
    stopHaptics();
    this.input.off("pointerdown", this.beginReel, this);
    this.input.off("pointerup", this.stopReel, this);
    this.input.keyboard?.off("keydown-SPACE", this.beginReel, this);
    this.input.keyboard?.off("keyup-SPACE", this.stopReel, this);
    const attempt = {
      ...this.attempt,
      targetCenter: this.dynamicTargetCenter,
    };
    const inputScore = forceMiss ? (this.dynamicTargetCenter > 0.5 ? 0 : 1) : this.score;
    const result = resolveTiming(attempt, inputScore, this.state);
    const next = result.success && result.fish
      ? recordCatch(this.state, result.fish.id, result.shells, result.xp, {
          areaId: this.areaId,
          mutationId: result.mutation?.id,
          quality: result.quality,
        })
      : recordConsolation(this.state, result.shells, result.xp);
    const refreshed = refreshQuestCompletion(next);
    saveGame(refreshed);
    this.playResultTone(result);
    playHaptic(result.success ? "catch" : "miss");
    this.scene.start("CatchResult", { result, areaId: this.areaId });
  }

  private playReelHaptic(inTarget: boolean) {
    const now = this.time.now;
    const interval = inTarget ? 165 : 260;
    if (now - this.lastReelHapticAt < interval) {
      return;
    }

    this.lastReelHapticAt = now;
    playHaptic(inTarget ? "reelGood" : "reelStrain");
  }

  private playResultTone(result: CatchResult) {
    if (result.success) {
      playSoftTone(this, this.state, result.quality === "sparkle" ? 880 : 720, 0.12);
    } else {
      playSoftTone(this, this.state, 360, 0.08);
    }
  }

  private addFishingSetPiece() {
    const area = getArea(this.areaId);
    const landmark = area?.mapTexture ?? "map-island";
    this.add.image(738, 308, landmark).setScale(area?.theme === "pier" ? 1.05 : 0.92).setAlpha(0.86);
    addPlayerBoat(this, 210, 284, this.state, { scale: 0.98, depth: 5 });
    this.add
      .image(278, 266, itemIconTextureKey(this.state.equippedRodId))
      .setScale(0.34)
      .setRotation(0.72)
      .setDepth(8);

    const line = this.add.graphics();
    line.lineStyle(this.rodLineWidth(), this.rodColor(), 0.54);
    line.beginPath();
    line.moveTo(258, 274);
    line.lineTo(372, 365);
    line.strokePath();
    line.fillStyle(PALETTE.butter, 0.85);
    line.fillCircle(374, 365, 8);
  }

  private addWeatherBadge(label: string, description: string, effect: string, tint: number) {
    const badge = this.add.container(480, 160).setDepth(6);
    badge.add(this.add.rectangle(0, 0, 560, 42, 0xffffff, 0.68).setStrokeStyle(3, PALETTE.ink, 0.55));
    badge.add(this.add.circle(-250, 0, 13, tint, 0.95).setStrokeStyle(2, PALETTE.ink, 0.35));
    badge.add(
      this.add
        .text(-226, -1, `${label} · ${effect}`, {
          fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
          fontSize: "16px",
          fontStyle: "900",
          color: TEXT.primary,
          fixedWidth: 242,
        })
        .setOrigin(0, 0.5),
    );
    badge.add(
      this.add
        .text(38, 0, description, {
          fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
          fontSize: "14px",
          fontStyle: "800",
          color: TEXT.secondary,
          fixedWidth: 220,
          align: "right",
        })
        .setOrigin(0, 0.5),
    );
  }

  private playCastEffects() {
    const arc = this.add.graphics().setDepth(8);
    arc.lineStyle(this.rodLineWidth(), this.rodColor(), 0.62);
    arc.beginPath();
    arc.moveTo(258, 274);
    for (let i = 1; i <= 14; i += 1) {
      const t = i / 14;
      const oneMinus = 1 - t;
      const x = oneMinus * oneMinus * 258 + 2 * oneMinus * t * 312 + t * t * 374;
      const y = oneMinus * oneMinus * 274 + 2 * oneMinus * t * 230 + t * t * 365;
      arc.lineTo(x, y);
    }
    arc.strokePath();
    this.tweens.add({
      targets: arc,
      alpha: 0,
      duration: 640,
      onComplete: () => arc.destroy(),
    });

    const bobber = this.add.circle(374, 365, 9, this.rodColor(), 1).setDepth(9).setStrokeStyle(3, PALETTE.white, 0.85);
    this.tweens.add({
      targets: bobber,
      y: 372,
      duration: 520,
      yoyo: true,
      repeat: 2,
      ease: "Sine.inOut",
      onComplete: () => bobber.destroy(),
    });
  }

  private playBiteEffects() {
    for (let i = 0; i < 3; i += 1) {
      const splash = this.add.circle(374, 365, 10 + i * 5, PALETTE.white, 0.42).setDepth(7);
      this.tweens.add({
        targets: splash,
        scale: 2.2 + i * 0.25,
        alpha: 0,
        duration: 520 + i * 90,
        onComplete: () => splash.destroy(),
      });
    }
  }

  private rodColor() {
    switch (this.state.equippedRodId) {
      case "sparkle-rod":
        return PALETTE.butter;
      case "captain-rod":
        return PALETTE.coralDeep;
      case "tideglass-rod":
        return PALETTE.lagoon;
      case "aurora-rod":
        return PALETTE.lavender;
      default:
        return this.colorFromId(this.state.equippedRodId);
    }
  }

  private rodLineWidth() {
    switch (this.state.equippedRodId) {
      case "tideglass-rod":
      case "aurora-rod":
        return 5;
      default:
        return this.state.equippedRodId.includes("-5-") || this.state.equippedRodId.includes("-6-") ? 5 : 4;
    }
  }

  private colorFromId(id: string) {
    let hash = 0;
    for (let i = 0; i < id.length; i += 1) {
      hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
    }
    const palette = [
      PALETTE.inkSoft,
      PALETTE.butter,
      PALETTE.coralDeep,
      PALETTE.lagoon,
      PALETTE.lavender,
      PALETTE.moss,
      0xb9c3ff,
      0xe0a253,
    ];
    return palette[hash % palette.length];
  }
}

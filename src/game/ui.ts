import Phaser from "phaser";
import { applyFixedViewport, BASE_GAME_WIDTH, fixedViewportLeft, fixedViewportRight, fixedViewportWidth } from "./layout";
import { PALETTE, TEXT } from "./palette";
import { loadGame, saveGame } from "./storage";
import type { AreaTheme, PlayerState } from "./types";

export type ButtonOptions = {
  width?: number;
  height?: number;
  fill?: number;
  stroke?: number;
  fontSize?: number;
  disabled?: boolean;
  iconKey?: string;
  iconScale?: number;
};

export function addTextButton(
  scene: Phaser.Scene,
  x: number,
  y: number,
  label: string,
  onClick: () => void,
  options: ButtonOptions = {},
): Phaser.GameObjects.Container {
  const width = options.width ?? 180;
  const height = options.height ?? 54;
  const disabled = options.disabled ?? false;
  const fill = disabled ? PALETTE.disabled : (options.fill ?? PALETTE.butter);

  const bg = scene.add.graphics();
  // Lacquer plate: angular corners (radius 4)
  bg.fillStyle(fill, 1);
  bg.fillRoundedRect(-width / 2, -height / 2, width, height, 4);
  // Outer ink border
  bg.lineStyle(3, options.stroke ?? PALETTE.ink, disabled ? 0.32 : 0.72);
  bg.strokeRoundedRect(-width / 2, -height / 2, width, height, 4);
  // Inner shine line (lacquer double-border)
  bg.lineStyle(1, PALETTE.white, disabled ? 0.06 : 0.20);
  bg.strokeRoundedRect(-width / 2 + 4, -height / 2 + 4, width - 8, height - 8, 2);

  const icon = options.iconKey
    ? scene.add.image(-width / 2 + 31, 0, options.iconKey).setScale(options.iconScale ?? 0.46)
    : undefined;
  const text = scene.add
    .text(icon ? 14 : 0, 1, label, {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: `${options.fontSize ?? 22}px`,
      fontStyle: "800",
      color: disabled ? TEXT.disabled : TEXT.primary,
      align: "center",
      fixedWidth: width - (icon ? 58 : 20),
    })
    .setOrigin(0.5);

  const children: Phaser.GameObjects.GameObject[] = icon ? [bg, icon, text] : [bg, text];
  const button = scene.add.container(x, y, children);
  button.setSize(width, height);
  button.setData("labelText", text);

  if (!disabled) {
    button.setInteractive({ useHandCursor: true });
    button.on("pointerover", () => {
      bg.setScale(1.03);
      icon?.setScale((options.iconScale ?? 0.46) * 1.03);
      text.setScale(1.03);
    });
    button.on("pointerout", () => {
      bg.setScale(1);
      icon?.setScale(options.iconScale ?? 0.46);
      text.setScale(1);
    });
    button.on("pointerdown", () => {
      scene.tweens.add({
        targets: button,
        scale: 0.96,
        yoyo: true,
        duration: 80,
        onComplete: onClick,
      });
    });
  }

  return button;
}

export function addPanel(
  scene: Phaser.Scene,
  x: number,
  y: number,
  width: number,
  height: number,
  fill = 0xffffff,
): Phaser.GameObjects.Rectangle {
  return scene.add
    .rectangle(x, y, width, height, fill, 0.90)
    .setStrokeStyle(3, PALETTE.ink, 0.70)
    .setOrigin(0.5);
}

export function addHeader(scene: Phaser.Scene, title: string, state: PlayerState): void {
  applyFixedViewport(scene);
  scene.add
    .text(32, 26, title, {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "34px",
      fontStyle: "800",
      color: TEXT.primary,
    })
    .setOrigin(0, 0.5);

  scene.add
    .text(928, 26, `${state.captain.name}  ·  조개 ${state.shells}  ·  Lv.${state.level}`, {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "20px",
      fontStyle: "700",
      color: TEXT.primary,
    })
    .setOrigin(1, 0.5);
}

export function addMuteButton(scene: Phaser.Scene, x = 880, y = 500): Phaser.GameObjects.Container {
  const state = loadGame();
  const label = () => (state.muted ? "소리 켜기" : "소리 끄기");
  let text: Phaser.GameObjects.Text;
  const button = addTextButton(
    scene,
    x,
    y,
    label(),
    () => {
      const latest = loadGame();
      latest.muted = !latest.muted;
      saveGame(latest);
      state.muted = latest.muted;
      text.setText(label());
    },
    { width: 120, height: 42, fontSize: 17, fill: PALETTE.seaFoam },
  );
  text = button.getData("labelText") as Phaser.GameObjects.Text;
  return button;
}

type OceanBackgroundVariant = "harbor" | AreaTheme;

// Japanese nature illustration palette for each sea area
const backgroundPalettes: Record<OceanBackgroundVariant, {
  top: number; mid: number; bottom: number; accent: number; sun: number;
}> = {
  harbor:  { top: 0xdde8f4, mid: 0x7aaccc, bottom: 0x1a3858, accent: 0xc85020, sun: 0xcf9820 },
  beach:   { top: 0xe8f4fc, mid: 0x82c4c8, bottom: 0x14506c, accent: 0xd07848, sun: 0xcf9820 },
  pier:    { top: 0xe0d8cc, mid: 0x708898, bottom: 0x1e303c, accent: 0x7a5535, sun: 0xcf8820 },
  coral:   { top: 0xf0e8e4, mid: 0x98b8b4, bottom: 0x183848, accent: 0xc85020, sun: 0xf0c4b8 },
  mist:    { top: 0xf4f2ee, mid: 0xc0c8d0, bottom: 0x505868, accent: 0x9098a4, sun: 0xf0e8e0 },
  kelp:    { top: 0xe4f0e0, mid: 0x408868, bottom: 0x143428, accent: 0x2a6848, sun: 0xc8d060 },
  basalt:  { top: 0xc8ccd0, mid: 0x406070, bottom: 0x141e28, accent: 0x243038, sun: 0xf0d0a0 },
  pearl:   { top: 0xf4f0f0, mid: 0xa8c8cc, bottom: 0x183040, accent: 0xf0c4b8, sun: 0xffffff },
  storm:   { top: 0x808890, mid: 0x304858, bottom: 0x101820, accent: 0xc8b050, sun: 0xb0b8c0 },
  moon:    { top: 0x6870a0, mid: 0x202848, bottom: 0x080e1c, accent: 0x8895c8, sun: 0xd8dce8 },
  amber:   { top: 0xf8c880, mid: 0xc06838, bottom: 0x283848, accent: 0xcf9820, sun: 0xf8d080 },
  glacier: { top: 0xe0f0f8, mid: 0x70b8cc, bottom: 0x304e6c, accent: 0xffffff, sun: 0xe0f4ff },
  trench:  { top: 0x283848, mid: 0x101e2c, bottom: 0x040a14, accent: 0x5db8b0, sun: 0x6090d0 },
  aurora:  { top: 0x485888, mid: 0x202858, bottom: 0x06101c, accent: 0x8895c8, sun: 0x70e8b0 },
};

export function addOceanBackground(scene: Phaser.Scene, variant: OceanBackgroundVariant): void {
  applyFixedViewport(scene);
  const pal = backgroundPalettes[variant];
  const left = fixedViewportLeft(scene);
  const right = fixedViewportRight(scene);
  const width = fixedViewportWidth(scene);
  const centerX = BASE_GAME_WIDTH / 2;
  const g = scene.add.graphics();

  // === 空 SKY — clean gradient ===
  g.fillGradientStyle(pal.top, pal.top, pal.mid, pal.mid, 1);
  g.fillRect(left, 0, width, 298);

  // === 水平線 HORIZON — thin ink line ===
  g.lineStyle(2, PALETTE.ink, 0.10);
  g.lineBetween(left, 298, right, 298);

  // === 海 SEA — deep colour fill ===
  g.fillStyle(pal.bottom, 1);
  g.fillRect(left, 298, width, 242);

  // === 日 / 月  SUN or MOON — bold circle ===
  g.fillStyle(pal.sun, 1);
  g.fillCircle(818, 74, 34);
  g.lineStyle(2, PALETTE.ink, 0.08);
  g.strokeCircle(818, 74, 34);

  // === 地形 THEME LANDMARKS ===
  drawJapaneseLandmarks(g, variant, pal.accent);

  // === 波動 ANIMATED WAVES — scrolling parallax ===
  addAnimatedWaves(scene, variant, left, right);

  // === 泡 BUBBLES — floating particle system ===
  addBubbles(scene, centerX, width);
}

function addAnimatedWaves(scene: Phaser.Scene, variant: OceanBackgroundVariant, left: number, right: number): void {
  const darkVariants = new Set(["moon", "trench", "aurora", "storm", "basalt"]);
  const baseAlpha = darkVariants.has(variant) ? 0.72 : 0.60;

  const rows = [
    { y: 314, waveW: 96,  waveR: 19, lw: 3.0, speed: 0.040, phase: 0   },
    { y: 352, waveW: 82,  waveR: 15, lw: 2.4, speed: 0.028, phase: 41  },
    { y: 386, waveW: 70,  waveR: 12, lw: 1.8, speed: 0.019, phase: 22  },
    { y: 416, waveW: 60,  waveR: 10, lw: 1.3, speed: 0.013, phase: 50  },
    { y: 442, waveW: 52,  waveR:  8, lw: 1.0, speed: 0.008, phase: 12  },
  ];

  const offsets = rows.map(r => r.phase);
  const waveLayer = scene.add.graphics().setDepth(1);

  const redraw = (_: number, delta: number) => {
    waveLayer.clear();

    rows.forEach(({ y, waveW, waveR, lw, speed }, i) => {
      offsets[i] = (offsets[i] + delta * speed) % waveW;
      const alpha = Math.max(0, baseAlpha - i * 0.09);
      const foam  = i < 2;

      waveLayer.lineStyle(lw, PALETTE.white, alpha);
      waveLayer.beginPath();
      for (let x = left - waveW - offsets[i]; x < right + waveW; x += waveW) {
        const cx = x + waveW / 2;
        waveLayer.arc(cx, y + waveR, waveR, Math.PI, 0, true);
      }
      waveLayer.strokePath();

      if (foam) {
        waveLayer.fillStyle(PALETTE.white, alpha + 0.14);
        const tipW = 7;
        for (let x = left - waveW - offsets[i]; x < right + waveW; x += waveW) {
          const cx = x + waveW / 2;
          waveLayer.fillTriangle(cx - waveR - tipW, y, cx - waveR, y - 9, cx - waveR + tipW, y);
          waveLayer.fillTriangle(cx + waveR - tipW, y, cx + waveR, y - 9, cx + waveR + tipW, y);
        }
      }
    });
  };

  scene.events.on("update", redraw);
  scene.events.once("shutdown", () => scene.events.off("update", redraw));
}

function addBubbles(scene: Phaser.Scene, centerX: number, width: number): void {
  const KEY = "__bubble__";
  if (!scene.textures.exists(KEY)) {
    const bg = scene.make.graphics({}, false);
    bg.lineStyle(1.5, 0xffffff, 0.9);
    bg.strokeCircle(8, 8, 6);
    bg.fillStyle(0xffffff, 0.12);
    bg.fillCircle(8, 8, 6);
    bg.lineStyle(1, 0xffffff, 0.55);
    bg.lineBetween(5, 5, 6, 6);
    bg.generateTexture(KEY, 16, 16);
    bg.destroy();
  }

  scene.add.particles(centerX, 520, KEY, {
    x:        { min: -width / 2, max: width / 2 },
    y:        { min: -200, max: 20 },
    speedY:   { min: -55,  max: -20 },
    speedX:   { min: -8,   max: 8   },
    scale:    { start: 0.22, end: 0.55 },
    alpha:    { start: 0.65, end: 0   },
    lifespan: { min: 4500,  max: 9000 },
    frequency: 650,
    quantity:  1,
  }).setDepth(2);
}

function drawUkiyoeWaves(g: Phaser.GameObjects.Graphics, variant: OceanBackgroundVariant): void {
  // Darker sea variants get brighter white waves; lighter gets softer
  const darkVariants = new Set(["moon", "trench", "aurora", "storm", "basalt"]);
  const baseAlpha = darkVariants.has(variant) ? 0.72 : 0.60;

  const rows = [
    { y: 314, waveW: 96, waveR: 19, lw: 3.0, alpha: baseAlpha,        foam: true  },
    { y: 352, waveW: 82, waveR: 15, lw: 2.4, alpha: baseAlpha - 0.10, foam: true  },
    { y: 386, waveW: 70, waveR: 12, lw: 1.8, alpha: baseAlpha - 0.20, foam: false },
    { y: 416, waveW: 60, waveR: 10, lw: 1.3, alpha: baseAlpha - 0.28, foam: false },
    { y: 442, waveW: 52, waveR:  8, lw: 1.0, alpha: baseAlpha - 0.35, foam: false },
  ];

  rows.forEach(({ y, waveW, waveR, lw, alpha, foam }, i) => {
    if (alpha <= 0) return;
    const offset = i % 2 === 0 ? 0 : waveW / 2;
    for (let x = -waveW + offset; x < 960 + waveW; x += waveW) {
      const cx = x + waveW / 2;
      // Arc: upward hump (top half of circle)
      g.lineStyle(lw, PALETTE.white, alpha);
      g.beginPath();
      g.arc(cx, y + waveR, waveR, Math.PI, 0, true);
      g.strokePath();

      // Foam claw tips on foreground rows
      if (foam) {
        g.fillStyle(PALETTE.white, alpha + 0.12);
        const tipW = 7;
        // Left claw
        g.fillTriangle(cx - waveR - tipW, y, cx - waveR, y - 9, cx - waveR + tipW, y);
        // Right claw
        g.fillTriangle(cx + waveR - tipW, y, cx + waveR, y - 9, cx + waveR + tipW, y);
      }
    }
  });
}

function drawJapaneseLandmarks(
  g: Phaser.GameObjects.Graphics,
  variant: OceanBackgroundVariant,
  accent: number,
): void {
  switch (variant) {
    case "mist": {
      // 霞 kasumi — horizontal mist cloud bands
      g.fillStyle(PALETTE.white, 0.50);
      g.fillRoundedRect(80,  168, 250, 14, 7);
      g.fillRoundedRect(380, 198, 190, 12, 6);
      g.fillRoundedRect(640, 174, 230, 13, 6);
      g.fillRoundedRect(145, 218, 165, 10, 5);
      g.fillStyle(PALETTE.white, 0.26);
      g.fillRoundedRect(55,  238, 310,  8, 4);
      g.fillRoundedRect(500, 226, 230,  8, 4);
      break;
    }
    case "kelp": {
      // 海藻 kaisou — sumi-e kelp strokes with tiny leaves
      g.lineStyle(6, accent, 0.42);
      for (let sx = 70; sx <= 920; sx += 90) {
        g.beginPath();
        g.moveTo(sx, 298);
        for (let step = 1; step <= 10; step++) {
          const t = step / 10;
          g.lineTo(
            sx + Math.sin(sx * 0.04 + t * Math.PI * 1.6) * 22,
            298 - t * 124,
          );
        }
        g.strokePath();
        // Small leaf ellipse at tip
        g.fillStyle(accent, 0.55);
        const leafX = sx + Math.sin(sx * 0.04 + Math.PI * 1.6) * 22;
        g.fillEllipse(leafX, 174, 13, 26);
      }
      break;
    }
    case "basalt":
    case "storm": {
      // 岩 iwa — bold sumi-e ink rock silhouettes
      const rockC = variant === "storm" ? 0x0e1820 : 0x181e24;
      g.fillStyle(rockC, 0.76);
      g.fillPoints(
        [
          new Phaser.Math.Vector2(28, 298),
          new Phaser.Math.Vector2(105, 238),
          new Phaser.Math.Vector2(180, 216),
          new Phaser.Math.Vector2(248, 254),
          new Phaser.Math.Vector2(285, 298),
        ],
        true,
      );
      g.fillStyle(rockC, 0.60);
      g.fillPoints(
        [
          new Phaser.Math.Vector2(678, 298),
          new Phaser.Math.Vector2(762, 212),
          new Phaser.Math.Vector2(845, 228),
          new Phaser.Math.Vector2(915, 258),
          new Phaser.Math.Vector2(960, 298),
        ],
        true,
      );
      // Foam at rock bases
      g.fillStyle(PALETTE.white, 0.50);
      g.fillEllipse(158, 294, 102, 12);
      g.fillEllipse(805, 293, 102, 12);
      break;
    }
    case "pearl": {
      // 砂洲 sunasu — soft sandbars
      g.fillStyle(PALETTE.white, 0.58);
      g.fillEllipse(700, 290, 196, 18);
      g.fillEllipse(235, 293, 148, 15);
      g.fillStyle(PALETTE.white, 0.34);
      g.fillEllipse(462, 294, 128, 10);
      break;
    }
    case "moon":
    case "aurora": {
      // 極光 / 月光 — aurora or moonlight ripple bands
      g.lineStyle(3, accent, 0.28);
      for (let i = 0; i < 5; i++) {
        g.beginPath();
        g.moveTo(0, 96 + i * 40);
        for (let x = 0; x <= 960; x += 72) {
          g.lineTo(x, 96 + i * 40 + Math.sin(x * 0.016 + i * 1.2) * 19);
        }
        g.strokePath();
      }
      break;
    }
    case "glacier": {
      // 氷山 hyouzan — iceberg silhouettes (Mt. Fuji style triangle)
      g.fillStyle(PALETTE.white, 0.78);
      g.fillTriangle(644, 298, 716, 236, 788, 298);
      g.fillStyle(0xa8d0e0, 0.86);
      g.fillTriangle(652, 298, 716, 242, 778, 298);
      g.fillStyle(PALETTE.white, 0.56);
      g.fillTriangle(138, 298, 200, 256, 262, 298);
      break;
    }
    case "trench": {
      // 提灯 chouchin — hanging lantern orbs in the deep
      g.fillStyle(accent, 0.34);
      for (let i = 0; i < 8; i++) {
        const px = 82 + i * 112;
        const py = 370 + (i % 3) * 36;
        g.fillCircle(px, py, 7 + (i % 2) * 3);
        g.lineStyle(1, accent, 0.52);
        g.lineBetween(px, py + 10 + (i % 2) * 3, px, py + 28);
      }
      break;
    }
    case "amber": {
      // 島影 shimakage — island silhouettes at sunset horizon
      g.fillStyle(0x101820, 0.42);
      g.fillEllipse(184, 292, 262, 24);
      g.fillEllipse(742, 290, 298, 22);
      break;
    }
    case "harbor":
    case "beach": {
      // 岸 kishi — subtle coastal accent circles (flora)
      g.fillStyle(accent, 0.14);
      g.fillCircle(104, 204, 36);
      g.fillStyle(PALETTE.moss, 0.18);
      g.fillCircle(144, 212, 28);
      break;
    }
    default:
      break;
  }
}

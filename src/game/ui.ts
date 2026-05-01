import Phaser from "phaser";
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
  const bg = scene.add.graphics();
  bg.fillStyle(disabled ? PALETTE.disabled : (options.fill ?? PALETTE.butter), 1);
  bg.fillRoundedRect(-width / 2, -height / 2, width, height, 10);
  bg.lineStyle(4, options.stroke ?? PALETTE.ink, disabled ? 0.45 : 0.95);
  bg.strokeRoundedRect(-width / 2, -height / 2, width, height, 10);
  bg.lineStyle(2, PALETTE.white, disabled ? 0.18 : 0.38);
  bg.lineBetween(-width / 2 + 14, -height / 2 + 9, width / 2 - 16, -height / 2 + 9);
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
    .rectangle(x, y, width, height, fill, 0.88)
    .setStrokeStyle(4, PALETTE.ink)
    .setOrigin(0.5);
}

export function addHeader(scene: Phaser.Scene, title: string, state: PlayerState): void {
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

const backgroundPalettes: Record<OceanBackgroundVariant, { top: number; mid: number; bottom: number; accent: number; sun: number }> = {
  harbor: { top: 0xace9ee, mid: PALETTE.lagoon, bottom: PALETTE.warmCream, accent: PALETTE.coral, sun: PALETTE.butter },
  beach: { top: 0xace9ee, mid: 0x79d7d6, bottom: 0xf7e7b1, accent: PALETTE.coral, sun: PALETTE.butter },
  pier: { top: 0xaee7df, mid: 0x6ec3c7, bottom: 0xd9c4a3, accent: PALETTE.driftwoodDark, sun: 0xffd786 },
  coral: { top: 0x9de8dc, mid: 0x78d5ca, bottom: PALETTE.seaGlass, accent: PALETTE.coral, sun: 0xffc2d1 },
  mist: { top: 0xd7e6e8, mid: 0x9bc4c8, bottom: 0x809aa8, accent: 0xb9c3c9, sun: 0xf0ead8 },
  kelp: { top: 0x9edfc9, mid: 0x4fa98f, bottom: 0x2f6c68, accent: 0x356f4f, sun: 0xd6e87a },
  basalt: { top: 0xa8ccd0, mid: 0x497d8d, bottom: 0x283f4a, accent: 0x2c2f36, sun: 0xf2d8a7 },
  pearl: { top: 0xd6f2ef, mid: 0x8bded8, bottom: 0xf6dfd1, accent: 0xf0b8c6, sun: 0xffffff },
  storm: { top: 0x879dac, mid: 0x395f72, bottom: 0x273948, accent: 0xf0d16b, sun: 0xbec6d4 },
  moon: { top: 0x7488b4, mid: 0x34486f, bottom: 0x17233f, accent: 0xb9c3ff, sun: 0xe8eaff },
  amber: { top: 0xffc98a, mid: 0xdf8f65, bottom: 0x5c7587, accent: 0xf6cf62, sun: 0xffe8a6 },
  glacier: { top: 0xd8f5ff, mid: 0x93dce8, bottom: 0x6b9fc5, accent: 0xffffff, sun: 0xe8fbff },
  trench: { top: 0x395b77, mid: 0x16314a, bottom: 0x071729, accent: 0x74d7cf, sun: 0x9de8ff },
  aurora: { top: 0x6e8bd2, mid: 0x3d579a, bottom: 0x102340, accent: 0xb9c3ff, sun: 0x9effdf },
};

export function addOceanBackground(scene: Phaser.Scene, variant: OceanBackgroundVariant): void {
  const palette = backgroundPalettes[variant];
  const graphics = scene.add.graphics();
  graphics.fillGradientStyle(palette.top, palette.top, palette.bottom, palette.bottom, 1);
  graphics.fillRect(0, 0, 960, 540);
  graphics.fillStyle(palette.mid, 0.58);
  graphics.fillRect(0, 330, 960, 210);

  for (let i = 0; i < 7; i += 1) {
    const y = 352 + i * 24;
    graphics.lineStyle(3, PALETTE.white, 0.34);
    graphics.beginPath();
    graphics.moveTo(0, y);
    for (let x = 0; x <= 960; x += 80) {
      graphics.lineTo(x, y + Math.sin(x * 0.02 + i) * 8);
    }
    graphics.strokePath();
  }

  graphics.fillStyle(palette.sun, 1);
  graphics.fillCircle(820, 86, 42);
  graphics.fillStyle(palette.accent, 0.18);
  graphics.fillCircle(114, 156, 26);
  graphics.fillStyle(PALETTE.moss, 0.22);
  graphics.fillCircle(152, 162, 20);

  drawBackgroundLandmarks(graphics, variant, palette.accent);
}

function drawBackgroundLandmarks(
  graphics: Phaser.GameObjects.Graphics,
  variant: OceanBackgroundVariant,
  accent: number,
) {
  graphics.fillStyle(0xffffff, 0.22);
  if (variant === "mist") {
    for (let i = 0; i < 4; i += 1) {
      graphics.fillRoundedRect(120 + i * 190, 176 + (i % 2) * 28, 170, 16, 8);
    }
  } else if (variant === "kelp") {
    graphics.lineStyle(8, accent, 0.34);
    for (let x = 80; x <= 900; x += 92) {
      graphics.beginPath();
      graphics.moveTo(x, 540);
      graphics.lineTo(x + Math.sin(x) * 18, 410);
      graphics.strokePath();
    }
  } else if (variant === "basalt" || variant === "storm") {
    graphics.fillStyle(variant === "storm" ? 0x1f2c38 : 0x2c2f36, 0.5);
    graphics.fillTriangle(60, 330, 180, 220, 310, 330);
    graphics.fillTriangle(640, 330, 760, 205, 910, 330);
  } else if (variant === "pearl") {
    graphics.fillStyle(0xffffff, 0.4);
    graphics.fillEllipse(710, 302, 150, 34);
    graphics.fillEllipse(245, 318, 120, 28);
  } else if (variant === "moon" || variant === "aurora") {
    graphics.lineStyle(4, accent, 0.32);
    for (let i = 0; i < 4; i += 1) {
      graphics.beginPath();
      graphics.moveTo(0, 130 + i * 30);
      for (let x = 0; x <= 960; x += 90) {
        graphics.lineTo(x, 130 + i * 30 + Math.sin(x * 0.02 + i) * 18);
      }
      graphics.strokePath();
    }
  } else if (variant === "glacier") {
    graphics.fillStyle(0xffffff, 0.54);
    graphics.fillTriangle(640, 330, 720, 248, 806, 330);
    graphics.fillTriangle(160, 330, 225, 266, 292, 330);
  } else if (variant === "trench") {
    graphics.fillStyle(accent, 0.24);
    for (let i = 0; i < 10; i += 1) {
      graphics.fillCircle(110 + i * 84, 360 + (i % 3) * 34, 5 + (i % 2) * 3);
    }
  } else if (variant === "amber") {
    graphics.fillStyle(0x5c7587, 0.34);
    graphics.fillEllipse(180, 323, 190, 42);
    graphics.fillEllipse(720, 320, 220, 44);
  }
}

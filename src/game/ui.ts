import Phaser from "phaser";
import { PALETTE, TEXT } from "./palette";
import { loadGame, saveGame } from "./storage";
import type { PlayerState } from "./types";

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
    .text(928, 26, `조개 ${state.shells}  ·  Lv.${state.level}`, {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "22px",
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

export function addOceanBackground(scene: Phaser.Scene, variant: "harbor" | "beach" | "pier" | "coral"): void {
  const top = variant === "coral" ? 0x9de8dc : variant === "pier" ? 0xaee7df : 0xace9ee;
  const bottom = variant === "harbor" ? PALETTE.warmCream : variant === "coral" ? PALETTE.seaGlass : 0xf7e7b1;
  const graphics = scene.add.graphics();
  graphics.fillGradientStyle(top, top, bottom, bottom, 1);
  graphics.fillRect(0, 0, 960, 540);
  graphics.fillStyle(PALETTE.lagoon, 0.48);
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

  graphics.fillStyle(PALETTE.butter, 1);
  graphics.fillCircle(820, 86, 42);
  graphics.fillStyle(PALETTE.coral, 0.18);
  graphics.fillCircle(114, 156, 26);
  graphics.fillStyle(PALETTE.moss, 0.22);
  graphics.fillCircle(152, 162, 20);
}

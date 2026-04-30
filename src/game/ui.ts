import Phaser from "phaser";
import { loadGame, saveGame } from "./storage";
import type { PlayerState } from "./types";

export type ButtonOptions = {
  width?: number;
  height?: number;
  fill?: number;
  stroke?: number;
  fontSize?: number;
  disabled?: boolean;
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
  const bg = scene.add
    .rectangle(0, 0, width, height, disabled ? 0xb3c6d4 : (options.fill ?? 0xffd166), 1)
    .setStrokeStyle(4, options.stroke ?? 0x143049)
    .setOrigin(0.5);
  const text = scene.add
    .text(0, 1, label, {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: `${options.fontSize ?? 22}px`,
      fontStyle: "700",
      color: disabled ? "#617180" : "#143049",
      align: "center",
      fixedWidth: width - 20,
    })
    .setOrigin(0.5);

  const button = scene.add.container(x, y, [bg, text]);
  button.setSize(width, height);

  if (!disabled) {
    button.setInteractive({ useHandCursor: true });
    button.on("pointerover", () => {
      bg.setScale(1.03);
      text.setScale(1.03);
    });
    button.on("pointerout", () => {
      bg.setScale(1);
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
    .setStrokeStyle(4, 0x143049)
    .setOrigin(0.5);
}

export function addHeader(scene: Phaser.Scene, title: string, state: PlayerState): void {
  scene.add
    .text(32, 26, title, {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "34px",
      fontStyle: "800",
      color: "#143049",
    })
    .setOrigin(0, 0.5);

  scene.add
    .text(928, 26, `조개 ${state.shells}  ·  Lv.${state.level}`, {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "22px",
      fontStyle: "700",
      color: "#143049",
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
    { width: 120, height: 42, fontSize: 17, fill: 0xd7f6ff },
  );
  text = button.list[1] as Phaser.GameObjects.Text;
  return button;
}

export function addOceanBackground(scene: Phaser.Scene, variant: "harbor" | "beach" | "pier" | "coral"): void {
  const top = variant === "coral" ? 0x89ddff : variant === "pier" ? 0xa4e2ff : 0x98e5ff;
  const bottom = variant === "harbor" ? 0xfff2a8 : variant === "coral" ? 0x7fd8bd : 0xf8e9a1;
  const graphics = scene.add.graphics();
  graphics.fillGradientStyle(top, top, bottom, bottom, 1);
  graphics.fillRect(0, 0, 960, 540);
  graphics.fillStyle(0x49b9da, 0.55);
  graphics.fillRect(0, 330, 960, 210);

  for (let i = 0; i < 7; i += 1) {
    const y = 352 + i * 24;
    graphics.lineStyle(3, 0xffffff, 0.34);
    graphics.beginPath();
    graphics.moveTo(0, y);
    for (let x = 0; x <= 960; x += 80) {
      graphics.lineTo(x, y + Math.sin(x * 0.02 + i) * 8);
    }
    graphics.strokePath();
  }

  graphics.fillStyle(0xffe08a, 1);
  graphics.fillCircle(820, 86, 42);
}

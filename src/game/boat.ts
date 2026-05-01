import Phaser from "phaser";
import { PALETTE } from "./palette";
import type { CaptainStyle, PlayerState } from "./types";

export type PlayerBoatOptions = {
  scale?: number;
  depth?: number;
  mapMode?: boolean;
  showCaptain?: boolean;
};

export function addPlayerBoat(
  scene: Phaser.Scene,
  x: number,
  y: number,
  state: PlayerState,
  options: PlayerBoatOptions = {},
): Phaser.GameObjects.Container {
  const scale = options.scale ?? 1;
  const depth = options.depth ?? 1;
  const mapMode = options.mapMode ?? false;
  const flagKey = boatCosmeticTexture(state.equippedBoatCosmeticId);
  const style = boatStyle(state.equippedBoatId);
  const flagTint = boatCosmeticTint(state.equippedBoatCosmeticId);

  if (mapMode) {
    const boat = scene.add.container(x, y).setDepth(depth).setScale(scale);
    boat.add(scene.add.image(0, 0, "boat-map").setTint(style.hullTint));
    if (style.glowTint) {
      boat.add(scene.add.ellipse(0, 38, 54, 16, style.glowTint, 0.24));
    }
    if (flagKey) {
      boat.add(scene.add.image(12, -28, flagKey).setScale(0.48).setRotation(-0.22).setTint(flagTint));
    }
    boat.setSize(108, 118);
    return boat;
  }

  const boat = scene.add.container(x, y).setDepth(depth).setScale(scale);
  boat.add(scene.add.image(0, 50, "boat-shadow"));
  boat.add(scene.add.image(0, 28, "boat-sail").setOrigin(0.5).setTint(style.cabinTint));
  if (style.glowTint) {
    boat.add(scene.add.ellipse(16, 88, 128, 14, style.glowTint, 0.18));
  }
  if (flagKey) {
    boat.add(scene.add.image(-24, -30, flagKey).setScale(0.8).setRotation(-0.18).setTint(flagTint));
  }
  boat.add(scene.add.image(0, 52, "boat-hull").setTint(style.hullTint));

  if (options.showCaptain ?? true) {
    boat.add(scene.add.ellipse(-62, 55, 34, 8, 0x102f3f, 0.22));
    boat.add(addCaptainFigure(scene, -62, -8, state.captain, 0.64));
  }

  boat.setSize(230, 170);
  return boat;
}

export function boatCosmeticTexture(itemId?: string): string | undefined {
  switch (itemId) {
    case "star-flag":
      return "boat-flag-star";
    case "harbor-pennant":
      return "boat-flag-harbor";
    case "coral-pennant":
      return "boat-flag-coral";
    default:
      return itemId ? ["boat-flag-star", "boat-flag-harbor", "boat-flag-coral"][hashString(itemId) % 3] : undefined;
  }
}

export function boatCosmeticTint(itemId?: string): number {
  if (!itemId) {
    return 0xffffff;
  }
  switch (itemId) {
    case "star-flag":
      return 0xffffff;
    case "harbor-pennant":
      return 0xffffff;
    case "coral-pennant":
      return 0xffffff;
    default:
      return colorFromHash(hashString(itemId) * 3 + 5);
  }
}

export function boatWakeTint(itemId?: string): number {
  return boatStyle(itemId).wakeTint;
}

export function boatItemTint(itemId?: string): number {
  return boatStyle(itemId).hullTint;
}

function boatStyle(itemId?: string) {
  switch (itemId) {
    case "blue-runabout":
      return { hullTint: 0x2f91a5, cabinTint: 0xffffff, wakeTint: 0xbdeedc };
    case "coral-runner":
      return { hullTint: 0x3f8f63, cabinTint: 0xffd6cf, wakeTint: 0xffc2d1, glowTint: 0xff8f91 };
    case "aurora-cutter":
      return { hullTint: 0x315a73, cabinTint: 0xe8eaff, wakeTint: 0xb9c3ff, glowTint: 0xb9c3ff };
    default:
      if (itemId && itemId !== "harbor-skiff") {
        const hash = hashString(itemId);
        const hullTint = colorFromHash(hash);
        const cabinTint = colorFromHash(hash * 5 + 13);
        const wakeTint = colorFromHash(hash * 7 + 29);
        return {
          hullTint,
          cabinTint,
          wakeTint,
          glowTint: itemId.includes("5") || itemId.includes("6") || itemId.includes("aurora") ? wakeTint : undefined,
        };
      }
      return { hullTint: 0xffffff, cabinTint: 0xffffff, wakeTint: 0xffffff };
  }
}

export function addCaptainFigure(
  scene: Phaser.Scene,
  x: number,
  y: number,
  captain: CaptainStyle,
  scale = 1,
): Phaser.GameObjects.Container {
  const figure = scene.add.container(x, y).setScale(scale);
  const g = scene.add.graphics();

  g.fillStyle(0x102f3f, 0.16);
  g.fillEllipse(0, 84, 46, 10);

  g.fillStyle(0x1d242d, 0.95);
  g.fillPoints(
    [
      new Phaser.Math.Vector2(-17, 22),
      new Phaser.Math.Vector2(-4, 22),
      new Phaser.Math.Vector2(-9, 78),
      new Phaser.Math.Vector2(-22, 78),
    ],
    true,
  );
  g.fillPoints(
    [
      new Phaser.Math.Vector2(5, 22),
      new Phaser.Math.Vector2(18, 22),
      new Phaser.Math.Vector2(24, 78),
      new Phaser.Math.Vector2(11, 78),
    ],
    true,
  );
  g.lineStyle(5, 0x2a221f, 0.95);
  g.lineBetween(-22, 82, -6, 82);
  g.lineBetween(11, 82, 29, 82);

  g.fillStyle(captain.outfitTint, 1);
  g.fillPoints(
    [
      new Phaser.Math.Vector2(-23, -35),
      new Phaser.Math.Vector2(22, -35),
      new Phaser.Math.Vector2(25, 25),
      new Phaser.Math.Vector2(-25, 25),
    ],
    true,
  );
  g.fillStyle(captain.accentTint, 0.92);
  g.fillPoints(
    [
      new Phaser.Math.Vector2(-12, -29),
      new Phaser.Math.Vector2(12, -29),
      new Phaser.Math.Vector2(14, 16),
      new Phaser.Math.Vector2(-15, 16),
    ],
    true,
  );
  g.fillStyle(0x142b39, 0.6);
  g.fillRect(-5, -27, 4, 46);
  g.fillRect(7, -27, 4, 46);
  g.lineStyle(3, PALETTE.ink, 0.26);
  g.strokePoints(
    [
      new Phaser.Math.Vector2(-23, -35),
      new Phaser.Math.Vector2(22, -35),
      new Phaser.Math.Vector2(25, 25),
      new Phaser.Math.Vector2(-25, 25),
    ],
    true,
  );

  g.lineStyle(7, captain.outfitTint, 1);
  g.lineBetween(-21, -24, -39, 15);
  g.lineBetween(22, -24, 43, -4);
  g.lineStyle(3, PALETTE.ink, 0.22);
  g.lineBetween(-21, -24, -39, 15);
  g.lineBetween(22, -24, 43, -4);
  g.fillStyle(captain.skinTone, 1);
  g.fillEllipse(-39, 16, 10, 12);
  g.fillEllipse(43, -4, 10, 12);

  g.fillStyle(captain.skinTone, 1);
  g.fillEllipse(0, -58, 29, 34);
  g.lineStyle(3, PALETTE.ink, 0.22);
  g.strokeEllipse(0, -58, 29, 34);
  g.fillStyle(captain.hairTint, 1);
  g.fillEllipse(0, -74, 32, 14);
  g.fillStyle(captain.outfitTint, 1);
  g.fillRoundedRect(-24, -78, 48, 12, 3);
  g.fillStyle(captain.accentTint, 0.95);
  g.fillRect(-4, -86, 8, 9);
  g.lineStyle(2, PALETTE.ink, 0.3);
  g.strokeRoundedRect(-24, -78, 48, 12, 3);

  g.fillStyle(PALETTE.ink, 1);
  g.fillRoundedRect(-10, -58, 8, 3, 1);
  g.fillRoundedRect(6, -58, 8, 3, 1);
  g.lineStyle(2, 0x6b4432, 0.72);
  g.lineBetween(0, -54, -2, -47);
  g.lineStyle(2, 0x4e3428, 0.82);
  g.beginPath();
  g.arc(0, -45, 7, 0.18, Math.PI - 0.18);
  g.strokePath();

  g.lineStyle(4, 0x6d4b34, 0.95);
  g.lineBetween(42, -5, 56, -30);
  g.lineStyle(2, PALETTE.ink, 0.34);
  g.lineBetween(56, -30, 55, -9);
  g.fillStyle(captain.accentTint, 0.85);
  g.fillEllipse(55, -5, 8, 7);
  g.strokeCircle(55, -5, 5);

  figure.add(g);
  figure.setSize(120, 190);
  return figure;
}

function hashString(value: string) {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

function colorFromHash(hash: number) {
  const palette = [
    0xffffff,
    0x2f91a5,
    0x3f8f63,
    0x315a73,
    0x587281,
    0xf0ead8,
    0xe0a253,
    0xff9f91,
    0x384d8a,
    0x346a7d,
    0x303b4c,
    0xb9c3ff,
  ];
  return palette[hash % palette.length];
}

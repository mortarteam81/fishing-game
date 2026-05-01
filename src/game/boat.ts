import Phaser from "phaser";
import type { PlayerState } from "./types";

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

  if (mapMode) {
    const boat = scene.add.container(x, y).setDepth(depth).setScale(scale);
    boat.add(scene.add.image(0, 0, "boat-map").setTint(style.hullTint));
    if (style.glowTint) {
      boat.add(scene.add.ellipse(0, 38, 54, 16, style.glowTint, 0.24));
    }
    if (flagKey) {
      boat.add(scene.add.image(12, -28, flagKey).setScale(0.48).setRotation(-0.22));
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
    boat.add(scene.add.image(-24, -30, flagKey).setScale(0.8).setRotation(-0.18));
  }
  boat.add(scene.add.image(0, 52, "boat-hull").setTint(style.hullTint));

  if (options.showCaptain ?? true) {
    boat.add(scene.add.ellipse(-62, 55, 34, 8, 0x102f3f, 0.22));
    boat.add(scene.add.image(-62, -3, "captain-kid").setScale(0.64));
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
      return undefined;
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
      return { hullTint: 0xffffff, cabinTint: 0xffffff, wakeTint: 0xffffff };
  }
}

import Phaser from "phaser";
import { getEquippedCompanionProfiles } from "./companions";
import { PALETTE, TEXT } from "./palette";
import type { PlayerState } from "./types";

type CompanionSceneMode = "harbor" | "ocean" | "fishing";

const offsets: Record<CompanionSceneMode, Array<{ x: number; y: number; scale: number; alpha: number }>> = {
  harbor: [
    { x: -112, y: 98, scale: 0.34, alpha: 0.96 },
    { x: 96, y: 104, scale: 0.27, alpha: 0.9 },
    { x: 34, y: 132, scale: 0.23, alpha: 0.86 },
  ],
  ocean: [
    { x: -86, y: 54, scale: 0.24, alpha: 0.9 },
    { x: 74, y: 58, scale: 0.2, alpha: 0.84 },
    { x: -8, y: 88, scale: 0.18, alpha: 0.78 },
  ],
  fishing: [
    { x: -114, y: 92, scale: 0.3, alpha: 0.94 },
    { x: 94, y: 96, scale: 0.24, alpha: 0.86 },
    { x: 30, y: 126, scale: 0.2, alpha: 0.8 },
  ],
};

export function addCompanionFollowers(
  scene: Phaser.Scene,
  parent: Phaser.GameObjects.Container,
  state: PlayerState,
  mode: CompanionSceneMode,
): Phaser.GameObjects.Container[] {
  const profiles = getEquippedCompanionProfiles(state);
  return profiles.map((profile, index) => {
    const offset = offsets[mode][index] ?? offsets[mode][offsets[mode].length - 1];
    const scale = companionScale(profile.fish.size, offset.scale);
    const glow = scene.add.ellipse(0, 18, 92, 24, PALETTE.white, 0.2).setAlpha(offset.alpha);
    const friend = scene.add.image(0, 0, profile.fish.assetKey).setScale(scale).setAlpha(offset.alpha);
    friend.setFlipX(index % 2 === 1);
    const follower = scene.add.container(offset.x, offset.y, [glow, friend]);
    follower.setDepth(-1);
    parent.add(follower);
    scene.tweens.add({
      targets: follower,
      y: follower.y - (mode === "ocean" ? 12 : 9),
      duration: 1240 + index * 180,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut",
    });
    scene.tweens.add({
      targets: friend,
      rotation: index % 2 === 0 ? 0.08 : -0.08,
      duration: 1520 + index * 140,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut",
    });
    return follower;
  });
}

export function addCompanionBadge(scene: Phaser.Scene, x: number, y: number, state: PlayerState): void {
  const profile = getEquippedCompanionProfiles(state)[0];
  if (!profile) {
    return;
  }

  scene.add
    .text(x, y, `동료 ${profile.fish.name} · ${profile.mood}`, {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "14px",
      fontStyle: "900",
      color: TEXT.primary,
      backgroundColor: "rgba(255,251,239,0.62)",
      padding: { x: 10, y: 5 },
    })
    .setOrigin(0.5)
    .setDepth(6);
}

function companionScale(size: string, baseScale: number): number {
  switch (size) {
    case "giant":
      return baseScale * 0.92;
    case "large":
      return baseScale;
    case "tiny":
      return baseScale * 1.28;
    case "small":
      return baseScale * 1.16;
    default:
      return baseScale * 1.08;
  }
}

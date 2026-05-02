import type Phaser from "phaser";

export const BASE_GAME_WIDTH = 960;
export const BASE_GAME_HEIGHT = 540;
export const MAX_GAME_WIDTH = 1280;

const BASE_ASPECT = BASE_GAME_WIDTH / BASE_GAME_HEIGHT;

export type GameSize = {
  width: number;
  height: number;
};

export function getAdaptiveGameSize(): GameSize {
  const viewport = getViewportSize();
  const aspect = viewport.width / Math.max(1, viewport.height);
  const targetWidth = aspect > BASE_ASPECT ? Math.round(BASE_GAME_HEIGHT * aspect) : BASE_GAME_WIDTH;
  const width = clampEven(targetWidth, BASE_GAME_WIDTH, MAX_GAME_WIDTH);
  return { width, height: BASE_GAME_HEIGHT };
}

export function sceneGameWidth(scene: Phaser.Scene): number {
  return Math.max(BASE_GAME_WIDTH, Math.round(scene.scale.gameSize.width || scene.scale.width || BASE_GAME_WIDTH));
}

export function fixedContentOffset(scene: Phaser.Scene): number {
  return Math.max(0, (sceneGameWidth(scene) - BASE_GAME_WIDTH) / 2);
}

export function fixedViewportLeft(scene: Phaser.Scene): number {
  return -fixedContentOffset(scene);
}

export function fixedViewportRight(scene: Phaser.Scene): number {
  return BASE_GAME_WIDTH + fixedContentOffset(scene);
}

export function fixedViewportWidth(scene: Phaser.Scene): number {
  return fixedViewportRight(scene) - fixedViewportLeft(scene);
}

export function fixedScreenCenterX(scene: Phaser.Scene): number {
  return sceneGameWidth(scene) / 2;
}

export function applyFixedViewport(scene: Phaser.Scene): void {
  const update = () => {
    const left = fixedViewportLeft(scene);
    const width = fixedViewportWidth(scene);
    scene.cameras.main.setBounds(left, 0, width, BASE_GAME_HEIGHT);
    scene.cameras.main.setScroll(left, 0);
  };
  update();

  const responsiveScene = scene as Phaser.Scene & { __responsiveViewportUpdate?: () => void };
  if (!responsiveScene.__responsiveViewportUpdate) {
    responsiveScene.__responsiveViewportUpdate = update;
    scene.scale.on("resize", update);
    scene.events.once("shutdown", () => {
      scene.scale.off("resize", update);
      responsiveScene.__responsiveViewportUpdate = undefined;
    });
  }
}

function getViewportSize(): GameSize {
  const coarsePointer = window.matchMedia?.("(pointer: coarse)").matches ?? false;
  if (coarsePointer && window.screen.width > 0 && window.screen.height > 0) {
    return {
      width: Math.max(window.screen.width, window.screen.height),
      height: Math.max(1, Math.min(window.screen.width, window.screen.height)),
    };
  }

  const viewport = window.visualViewport;
  return {
    width: Math.max(1, Math.round(viewport?.width ?? window.innerWidth)),
    height: Math.max(1, Math.round(viewport?.height ?? window.innerHeight)),
  };
}

function clampEven(value: number, min: number, max: number): number {
  const clamped = Math.max(min, Math.min(max, value));
  return clamped % 2 === 0 ? clamped : clamped + 1;
}

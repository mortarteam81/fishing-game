import type Phaser from "phaser";
import type { PlayerState } from "./types";

export function playSoftTone(scene: Phaser.Scene, state: PlayerState, frequency = 560, duration = 0.08) {
  if (state.muted || scene.sound.locked || !("context" in scene.sound)) {
    return;
  }

  const context = scene.sound.context;
  if (!context) {
    return;
  }

  const oscillator = context.createOscillator();
  const gain = context.createGain();
  oscillator.type = "sine";
  oscillator.frequency.value = frequency;
  gain.gain.value = 0.04;
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + duration);
}

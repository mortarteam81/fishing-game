type HapticCue = "cast" | "bite" | "reelStart" | "reelGood" | "reelStrain" | "catch" | "miss";

const hapticPatterns: Record<HapticCue, number | number[]> = {
  cast: 12,
  bite: [28, 34, 52],
  reelStart: 14,
  reelGood: [10, 24, 10],
  reelStrain: 28,
  catch: [54, 42, 86, 48, 130],
  miss: [36, 70, 24],
};

export function playHaptic(cue: HapticCue): void {
  vibrate(hapticPatterns[cue]);
}

export function stopHaptics(): void {
  vibrate(0);
}

export function canUseHaptics(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.vibrate === "function";
}

function vibrate(pattern: number | number[]): void {
  if (!canUseHaptics() || document.visibilityState === "hidden") {
    return;
  }

  try {
    navigator.vibrate(pattern);
  } catch {
    // Some browsers expose the API but block it depending on user settings.
  }
}

import type { CaptainStyle } from "./types";

export function itemIconTextureKey(itemId: string): string {
  return `gear-${itemId}`;
}

export function boatSideTextureKey(itemId: string): string {
  return `boat-side-${itemId}`;
}

export function boatMapTextureKey(itemId: string): string {
  return `boat-map-${itemId}`;
}

export function boatFlagTextureKey(itemId: string): string {
  return `boat-flag-${itemId}`;
}

export function captainTextureKey(captain: CaptainStyle): string {
  return `captain-${captain.presetId}`;
}

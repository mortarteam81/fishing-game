import type Phaser from "phaser";
import { captainPresets } from "./character";
import { getFish, getItem } from "./content";
import {
  boatFlagTextureKey,
  boatMapTextureKey,
  boatSideTextureKey,
  captainTextureKey,
  itemIconTextureKey,
  portInteriorTextureKey,
  portMarkerTextureKey,
} from "./textureKeys";
import type { CaptainStyle, FishDefinition, ItemDefinition, PlayerState, PortDefinition } from "./types";

type TextureRequest =
  | { kind: "fish"; fish: FishDefinition }
  | { kind: "itemIcon"; item: ItemDefinition }
  | { kind: "boatSide"; item: ItemDefinition }
  | { kind: "boatMap"; item: ItemDefinition }
  | { kind: "boatFlag"; item: ItemDefinition }
  | { kind: "captain"; captain: CaptainStyle }
  | { kind: "portMarker"; port: PortDefinition }
  | { kind: "portInterior"; port: PortDefinition };

export function fishTexture(fish: FishDefinition | undefined): TextureRequest[] {
  return fish ? [{ kind: "fish", fish }] : [];
}

export function itemPreviewTexture(item: ItemDefinition): TextureRequest[] {
  return item.kind === "boat" ? [{ kind: "boatMap", item }] : [{ kind: "itemIcon", item }];
}

export function allCaptainTextures(): TextureRequest[] {
  return captainPresets.map((captain) => ({ kind: "captain", captain }));
}

export function playerPresentationTextures(state: PlayerState): TextureRequest[] {
  const requests: TextureRequest[] = [];
  const boat = getItem(state.equippedBoatId);
  const flag = state.equippedBoatCosmeticId ? getItem(state.equippedBoatCosmeticId) : undefined;
  const rod = getItem(state.equippedRodId);
  const bait = state.equippedBaitId ? getItem(state.equippedBaitId) : undefined;

  if (boat?.kind === "boat") {
    requests.push({ kind: "boatSide", item: boat }, { kind: "boatMap", item: boat });
  }
  if (flag?.kind === "boatCosmetic") {
    requests.push({ kind: "boatFlag", item: flag }, { kind: "itemIcon", item: flag });
  }
  if (rod) {
    requests.push({ kind: "itemIcon", item: rod });
  }
  if (bait) {
    requests.push({ kind: "itemIcon", item: bait });
  }
  requests.push({ kind: "captain", captain: state.captain });
  return requests;
}

export function fishTexturesForIds(ids: readonly string[]): TextureRequest[] {
  return ids.flatMap((id) => fishTexture(getFish(id)));
}

export function companionTextures(state: PlayerState): TextureRequest[] {
  return fishTexturesForIds(state.equippedCompanionIds);
}

export function portMarkerTextures(ports: readonly PortDefinition[]): TextureRequest[] {
  return ports.map((port) => ({ kind: "portMarker", port }));
}

export function portInteriorTexture(port: PortDefinition | undefined): TextureRequest[] {
  return port ? [{ kind: "portInterior", port }] : [];
}

export async function ensureSvgTextures(scene: Phaser.Scene, requests: TextureRequest[]): Promise<void> {
  const unique = uniqueMissingRequests(scene, requests);
  if (unique.length === 0) {
    return;
  }

  const factory = await import("./svgFactory");
  for (const request of unique) {
    scene.load.image(textureKey(request), factory.svgDataUri(svgFor(factory, request)));
  }

  await new Promise<void>((resolve) => {
    scene.load.once("complete", () => resolve());
    if (!scene.load.isLoading()) {
      scene.load.start();
    }
  });
}

function uniqueMissingRequests(scene: Phaser.Scene, requests: TextureRequest[]): TextureRequest[] {
  const seen = new Set<string>();
  const unique: TextureRequest[] = [];
  for (const request of requests) {
    const key = textureKey(request);
    if (seen.has(key) || scene.textures.exists(key)) {
      continue;
    }
    seen.add(key);
    unique.push(request);
  }
  return unique;
}

function textureKey(request: TextureRequest): string {
  switch (request.kind) {
    case "fish":
      return request.fish.assetKey;
    case "itemIcon":
      return itemIconTextureKey(request.item.id);
    case "boatSide":
      return boatSideTextureKey(request.item.id);
    case "boatMap":
      return boatMapTextureKey(request.item.id);
    case "boatFlag":
      return boatFlagTextureKey(request.item.id);
    case "captain":
      return captainTextureKey(request.captain);
    case "portMarker":
      return portMarkerTextureKey(request.port.id);
    case "portInterior":
      return portInteriorTextureKey(request.port.id);
  }
}

function svgFor(
  factory: typeof import("./svgFactory"),
  request: TextureRequest,
): string {
  switch (request.kind) {
    case "fish":
      return factory.creatureSvgFor(request.fish);
    case "itemIcon":
      return factory.itemIconSvgFor(request.item);
    case "boatSide":
      return factory.boatSideSvgFor(request.item);
    case "boatMap":
      return factory.boatMapSvgFor(request.item);
    case "boatFlag":
      return factory.boatFlagSvgFor(request.item);
    case "captain":
      return factory.captainSvgFor(request.captain);
    case "portMarker":
      return factory.portMarkerSvgFor(request.port);
    case "portInterior":
      return factory.portInteriorSvgFor(request.port);
  }
}

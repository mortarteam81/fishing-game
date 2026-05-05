import Phaser from "phaser";
import { addPlayerBoat, boatWakeTint } from "../game/boat";
import { ports } from "../game/commerceContent";
import { isPortUnlocked } from "../game/commerce";
import { addCompanionFollowers } from "../game/companionVisuals";
import { areas, fish } from "../game/content";
import { fixedContentOffset, fixedScreenCenterX, sceneGameWidth } from "../game/layout";
import { companionTextures, ensureSvgTextures, fishTexturesForIds, playerPresentationTextures } from "../game/lazyTextures";
import { PALETTE, TEXT } from "../game/palette";
import { playSoftTone } from "../game/audio";
import {
  canAttemptVoyageEventForArea,
  canDiscoverArea,
  discoverArea,
  getBoatSpeed,
  getEquippedGearBuild,
  isAreaDiscovered,
  recordVoyageEventResult,
  requiredVoyageEventForArea,
} from "../game/progression";
import { loadGame, saveGame } from "../game/storage";
import { addMuteButton, addTextButton } from "../game/ui";
import { getVoyageEvent, voyageEventForArea } from "../game/voyageEvents";
import { getAreaWeather } from "../game/weather";
import type { AreaDefinition, PlayerState, VoyageEventId } from "../game/types";

type Hotspot = {
  area: AreaDefinition;
  x: number;
  y: number;
  texture: string;
  label: string;
};

type OceanLifeSpot = {
  fishId: string;
  x: number;
  y: number;
  scale: number;
  depth: number;
  alpha: number;
  driftX: number;
  driftY: number;
  duration: number;
  flipX?: boolean;
};

const WORLD_WIDTH = 3180;
const WORLD_HEIGHT = 3180;

const hotspotLayout = [
  [430, 1280],
  [930, 900],
  [1430, 1260],
  [540, 540],
  [1180, 430],
  [1840, 620],
  [2160, 1090],
  [1640, 1540],
  [820, 1530],
  [2340, 420],
  [2460, 1490],
  [1320, 1040],
  [2040, 1580],
  [1730, 1240],
  [1930, 1380],
  [2190, 1210],
  [2050, 1450],
  [2410, 1360],
  [420, 320],
  [2320, 760],
  [1110, 1660],
] as const;

const hotspots: Hotspot[] = areas.map((area, index) => {
  const point = hotspotLayout[index] ?? [420 + (index % 5) * 460, 420 + Math.floor(index / 5) * 420];
  return {
    area,
    x: point[0],
    y: point[1],
    texture: area.mapTexture,
    label: area.name,
  };
});

const oceanLifeConfig: readonly OceanLifeSpot[] = [
  { fishId: "sunny-minnow", x: 560, y: 720, scale: 0.72, depth: 7, alpha: 0.78, driftX: 32, driftY: -12, duration: 2300 },
  { fishId: "sunny-minnow", x: 700, y: 825, scale: 0.58, depth: 6, alpha: 0.7, driftX: -24, driftY: -10, duration: 2600, flipX: true },
  { fishId: "bubble-flounder", x: 470, y: 1160, scale: 0.62, depth: 6, alpha: 0.66, driftX: 18, driftY: -8, duration: 2800 },
  { fishId: "sand-shrimp", x: 340, y: 1335, scale: 0.52, depth: 6, alpha: 0.7, driftX: 20, driftY: -14, duration: 2100 },
  { fishId: "peach-seahorse", x: 820, y: 990, scale: 0.56, depth: 7, alpha: 0.75, driftX: -20, driftY: -18, duration: 2600, flipX: true },
  { fishId: "moon-jelly", x: 760, y: 520, scale: 0.64, depth: 7, alpha: 0.72, driftX: 18, driftY: -26, duration: 3100 },
  { fishId: "ribbon-squid", x: 940, y: 790, scale: 0.66, depth: 7, alpha: 0.78, driftX: 30, driftY: -16, duration: 2500 },
  { fishId: "harbor-mackerel", x: 840, y: 830, scale: 0.58, depth: 6, alpha: 0.66, driftX: 34, driftY: -8, duration: 2400 },
  { fishId: "shell-crab", x: 1010, y: 1010, scale: 0.54, depth: 6, alpha: 0.68, driftX: -18, driftY: -8, duration: 2700, flipX: true },
  { fishId: "drum-octopus", x: 1125, y: 760, scale: 0.62, depth: 7, alpha: 0.72, driftX: 22, driftY: -18, duration: 3000 },
  { fishId: "sleepy-ray", x: 1110, y: 915, scale: 0.72, depth: 7, alpha: 0.66, driftX: -30, driftY: -12, duration: 3300, flipX: true },
  { fishId: "candy-puffer", x: 1085, y: 665, scale: 0.64, depth: 7, alpha: 0.78, driftX: 26, driftY: -14, duration: 2900 },
  { fishId: "starfish-pal", x: 1520, y: 360, scale: 0.6, depth: 7, alpha: 0.72, driftX: -22, driftY: -12, duration: 3200, flipX: true },
  { fishId: "coral-tang", x: 1260, y: 610, scale: 0.68, depth: 7, alpha: 0.8, driftX: 28, driftY: -12, duration: 2700 },
  { fishId: "ribbon-eel", x: 1370, y: 915, scale: 0.66, depth: 7, alpha: 0.74, driftX: -34, driftY: -16, duration: 3100, flipX: true },
  { fishId: "pearl-clam", x: 1475, y: 1295, scale: 0.58, depth: 7, alpha: 0.7, driftX: 16, driftY: -10, duration: 2800 },
  { fishId: "pearl-turtle", x: 1550, y: 1370, scale: 0.7, depth: 7, alpha: 0.72, driftX: -28, driftY: -12, duration: 3400, flipX: true },
  { fishId: "lantern-angler", x: 1650, y: 1180, scale: 0.64, depth: 8, alpha: 0.76, driftX: 24, driftY: -18, duration: 3000 },
  { fishId: "sea-bunny", x: 1330, y: 1160, scale: 0.58, depth: 7, alpha: 0.76, driftX: -20, driftY: -14, duration: 2600, flipX: true },
  { fishId: "rainbow-whale", x: 1605, y: 1125, scale: 0.92, depth: 8, alpha: 0.88, driftX: 56, driftY: -22, duration: 3700 },
  { fishId: "misty-fjord-drifter", x: 510, y: 455, scale: 0.6, depth: 7, alpha: 0.68, driftX: 24, driftY: -16, duration: 2800 },
  { fishId: "misty-fjord-lantern-eel", x: 655, y: 610, scale: 0.52, depth: 6, alpha: 0.62, driftX: -30, driftY: -14, duration: 3200, flipX: true },
  { fishId: "kelp-forest-needlefish", x: 1100, y: 345, scale: 0.62, depth: 7, alpha: 0.68, driftX: 34, driftY: -10, duration: 2500 },
  { fishId: "kelp-forest-velvet-turtle", x: 1265, y: 525, scale: 0.64, depth: 7, alpha: 0.66, driftX: -22, driftY: -12, duration: 3400, flipX: true },
  { fishId: "basalt-cove-veil-ray", x: 1760, y: 560, scale: 0.7, depth: 7, alpha: 0.68, driftX: 30, driftY: -16, duration: 3100 },
  { fishId: "basalt-cove-crown-clam", x: 1950, y: 700, scale: 0.54, depth: 6, alpha: 0.64, driftX: -18, driftY: -10, duration: 2800, flipX: true },
  { fishId: "pearl-lagoon-comet-squid", x: 2075, y: 1005, scale: 0.64, depth: 7, alpha: 0.7, driftX: 28, driftY: -18, duration: 2700 },
  { fishId: "pearl-lagoon-mosaic-crab", x: 2225, y: 1160, scale: 0.56, depth: 6, alpha: 0.66, driftX: -20, driftY: -10, duration: 3000, flipX: true },
  { fishId: "storm-bank-veil-ray", x: 1515, y: 1480, scale: 0.72, depth: 7, alpha: 0.72, driftX: 34, driftY: -18, duration: 3300 },
  { fishId: "storm-bank-lantern-eel", x: 1700, y: 1560, scale: 0.58, depth: 7, alpha: 0.68, driftX: -28, driftY: -16, duration: 2900, flipX: true },
  { fishId: "moonlit-current-comet-squid", x: 735, y: 1450, scale: 0.64, depth: 7, alpha: 0.72, driftX: 28, driftY: -20, duration: 3000 },
  { fishId: "moonlit-current-skywhale", x: 930, y: 1605, scale: 0.82, depth: 7, alpha: 0.7, driftX: -42, driftY: -18, duration: 3800, flipX: true },
  { fishId: "amber-archipelago-drifter", x: 2280, y: 345, scale: 0.6, depth: 7, alpha: 0.7, driftX: 28, driftY: -12, duration: 2700 },
  { fishId: "amber-archipelago-mosaic-crab", x: 2440, y: 515, scale: 0.56, depth: 6, alpha: 0.66, driftX: -20, driftY: -10, duration: 3000, flipX: true },
  { fishId: "glacier-shelf-velvet-turtle", x: 2355, y: 1410, scale: 0.7, depth: 7, alpha: 0.7, driftX: 30, driftY: -14, duration: 3500 },
  { fishId: "glacier-shelf-needlefish", x: 2505, y: 1560, scale: 0.6, depth: 7, alpha: 0.68, driftX: -34, driftY: -12, duration: 2600, flipX: true },
  { fishId: "lantern-trench-lantern-eel", x: 1225, y: 955, scale: 0.62, depth: 8, alpha: 0.76, driftX: 30, driftY: -18, duration: 3100 },
  { fishId: "lantern-trench-mythic-nudibranch", x: 1405, y: 1085, scale: 0.62, depth: 8, alpha: 0.72, driftX: -24, driftY: -16, duration: 3400, flipX: true },
  { fishId: "aurora-reef-skywhale", x: 1970, y: 1500, scale: 0.86, depth: 8, alpha: 0.74, driftX: 44, driftY: -20, duration: 3900 },
  { fishId: "aurora-reef-mythic-nudibranch", x: 2135, y: 1640, scale: 0.68, depth: 8, alpha: 0.72, driftX: -26, driftY: -18, duration: 3200, flipX: true },
  { fishId: "starlit-offshore-drifter", x: 1740, y: 1245, scale: 0.64, depth: 7, alpha: 0.7, driftX: 28, driftY: -14, duration: 2700 },
  { fishId: "glass-trench-needlefish", x: 1890, y: 1335, scale: 0.6, depth: 7, alpha: 0.68, driftX: -34, driftY: -12, duration: 2600, flipX: true },
  { fishId: "tempest-pass-veil-ray", x: 2025, y: 1215, scale: 0.74, depth: 8, alpha: 0.74, driftX: 36, driftY: -18, duration: 3300 },
  { fishId: "temporal-garden-comet-squid", x: 2165, y: 1340, scale: 0.7, depth: 8, alpha: 0.74, driftX: -30, driftY: -20, duration: 3100, flipX: true },
  { fishId: "aurora-crown-mosaic-crab", x: 2305, y: 1215, scale: 0.62, depth: 7, alpha: 0.7, driftX: 22, driftY: -10, duration: 3000 },
  { fishId: "starlit-offshore-lantern-eel", x: 1840, y: 1515, scale: 0.62, depth: 8, alpha: 0.72, driftX: -30, driftY: -16, duration: 3000, flipX: true },
  { fishId: "glass-trench-velvet-turtle", x: 2005, y: 1650, scale: 0.76, depth: 8, alpha: 0.74, driftX: 32, driftY: -14, duration: 3600 },
  { fishId: "tempest-pass-crown-clam", x: 2200, y: 1530, scale: 0.58, depth: 7, alpha: 0.7, driftX: -18, driftY: -10, duration: 2900, flipX: true },
  { fishId: "temporal-garden-skywhale", x: 2420, y: 1320, scale: 0.9, depth: 8, alpha: 0.76, driftX: 48, driftY: -20, duration: 4000 },
  { fishId: "aurora-crown-mythic-nudibranch", x: 2505, y: 1545, scale: 0.7, depth: 8, alpha: 0.74, driftX: -28, driftY: -18, duration: 3300, flipX: true },
  { fishId: "starwhale-lookout-ancient-starwhale-skywhale", x: 520, y: 2140, scale: 0.88, depth: 8, alpha: 0.78, driftX: 54, driftY: -22, duration: 4100 },
  { fishId: "galaxy-buoy-field-prism-needlefish", x: 1040, y: 2280, scale: 0.6, depth: 7, alpha: 0.72, driftX: -36, driftY: -14, duration: 2600, flipX: true },
  { fishId: "moonhalo-whale-bay-moonhalo-skywhale", x: 1580, y: 2220, scale: 0.9, depth: 8, alpha: 0.76, driftX: 48, driftY: -20, duration: 3900 },
  { fishId: "meteor-coral-belt-comet-oracle-clam", x: 2140, y: 2300, scale: 0.62, depth: 7, alpha: 0.72, driftX: -20, driftY: -10, duration: 3100, flipX: true },
  { fishId: "stars-breath-open-sea-ancient-starwhale-skywhale", x: 2700, y: 2140, scale: 0.92, depth: 8, alpha: 0.78, driftX: 58, driftY: -24, duration: 4200 },
  { fishId: "crown-seafloor-gate-crown-lantern-eel", x: 560, y: 2760, scale: 0.62, depth: 8, alpha: 0.72, driftX: -30, driftY: -16, duration: 3100, flipX: true },
  { fishId: "black-pearl-abyss-black-pearl-crown-clam", x: 1120, y: 2880, scale: 0.6, depth: 8, alpha: 0.7, driftX: 18, driftY: -10, duration: 2900 },
  { fishId: "silent-throne-reef-throne-velvet-turtle", x: 1680, y: 2760, scale: 0.72, depth: 8, alpha: 0.72, driftX: -28, driftY: -12, duration: 3600, flipX: true },
  { fishId: "ancient-lantern-stairs-shadow-mosaic-crab", x: 2240, y: 2920, scale: 0.62, depth: 8, alpha: 0.72, driftX: 24, driftY: -12, duration: 3200 },
  { fishId: "deep-crown-castle-abyss-mythic-nudibranch", x: 2780, y: 2820, scale: 0.7, depth: 8, alpha: 0.76, driftX: -30, driftY: -18, duration: 3400, flipX: true },
];

export class OceanScene extends Phaser.Scene {
  private state!: PlayerState;
  private boat!: Phaser.GameObjects.Container;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys?: Record<string, Phaser.Input.Keyboard.Key>;
  private target?: Phaser.Math.Vector2;
  private wakeTimer = 0;
  private prompt?: Phaser.GameObjects.Container;
  private targetMarker?: Phaser.GameObjects.Container;
  private miniBoat?: Phaser.GameObjects.Triangle;
  private statusText?: Phaser.GameObjects.Text;
  private weatherText?: Phaser.GameObjects.Text;
  private compassNeedle?: Phaser.GameObjects.Triangle;
  private nearby?: Hotspot;
  private shimmerLayers: Phaser.GameObjects.Graphics[] = [];
  private wakeCooldown = 0;
  private voyageEventGroup?: Phaser.GameObjects.Container;
  private voyageEventNeedle?: Phaser.GameObjects.Rectangle;
  private voyageEventScore = 0;
  private voyageEventDirection = 1;
  private voyageEventArea?: AreaDefinition;
  private voyageEventId?: VoyageEventId;
  private voyageEventActive = false;

  constructor() {
    super("Ocean");
  }

  create() {
    this.state = loadGame();
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.cameras.main.setZoom(1);

    const screenCenterX = fixedScreenCenterX(this);
    const loadingBg = this.add.rectangle(screenCenterX, 270, sceneGameWidth(this), 540, 0xb3edf2, 1).setScrollFactor(0).setDepth(90);
    const loadingText = this.add
      .text(screenCenterX, 270, "바다 지도를 펼치는 중...", {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "24px",
        fontStyle: "900",
        color: TEXT.primary,
        backgroundColor: "rgba(255,251,239,0.72)",
        padding: { x: 16, y: 8 },
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(91);

    void this.renderWhenReady([loadingBg, loadingText]);
  }

  private async renderWhenReady(loadingObjects: Phaser.GameObjects.GameObject[]) {
    await ensureSvgTextures(this, [
      ...playerPresentationTextures(this.state),
      ...companionTextures(this.state),
      ...fishTexturesForIds(this.oceanFishIds()),
    ]);
    loadingObjects.forEach((object) => object.destroy());
    this.drawSea();
    this.addMapObjects();
    this.addBoat();
    this.addHud();
    this.addTouchControls();
    this.setupInput();
  }

  private oceanFishIds() {
    return [...new Set(oceanLifeConfig.map((spot) => spot.fishId))];
  }

  update(_: number, delta: number) {
    if (!this.boat) {
      return;
    }

    this.animateSea(delta);
    if (this.voyageEventActive) {
      this.updateVoyageEvent(delta);
      return;
    }
    this.moveBoat(delta);
    this.updateNearbyPrompt();
  }

  private drawSea() {
    const bg = this.add.graphics();
    bg.fillGradientStyle(0xaacfe0, 0xaacfe0, PALETTE.seaGlass, PALETTE.lagoon, 1);
    bg.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    bg.fillStyle(PALETTE.butter, 1);
    bg.fillCircle(1460, 150, 64);

    this.addSeaLife();

    for (let layer = 0; layer < 3; layer += 1) {
      const waves = this.add.graphics();
      waves.setDepth(layer);
      this.shimmerLayers.push(waves);
    }
  }

  private addSeaLife() {
    const fishById = new Map(fish.map((entry) => [entry.id, entry]));

    for (const point of [
      [320, 520],
      [760, 390],
      [1190, 950],
      [1580, 690],
    ] as const) {
      const buoy = this.add.graphics().setDepth(5);
      buoy.fillStyle(PALETTE.coral, 1);
      buoy.fillCircle(point[0], point[1], 15);
      buoy.fillStyle(0xffffff, 1);
      buoy.fillRect(point[0] - 13, point[1] - 4, 26, 8);
      buoy.lineStyle(3, PALETTE.ink, 0.25);
      buoy.strokeCircle(point[0], point[1], 15);
      this.tweens.add({
        targets: buoy,
        y: buoy.y + 10,
        duration: 1300,
        yoyo: true,
        repeat: -1,
        ease: "Sine.inOut",
      });
    }

    oceanLifeConfig.forEach((spot, index) => {
      const friendDefinition = fishById.get(spot.fishId);
      if (!friendDefinition) {
        return;
      }
      const friend = this.add
        .image(spot.x, spot.y, friendDefinition.assetKey)
        .setScale(spot.scale)
        .setDepth(Math.min(4, spot.depth))
        .setAlpha(spot.alpha);
      friend.setFlipX(Boolean(spot.flipX));
      this.tweens.add({
        targets: friend,
        x: friend.x + spot.driftX,
        y: friend.y + spot.driftY,
        duration: spot.duration + (index % 5) * 90,
        yoyo: true,
        repeat: -1,
        ease: "Sine.inOut",
      });
    });
  }

  private animateSea(delta: number) {
    this.wakeTimer += delta;
    this.shimmerLayers.forEach((graphics, layer) => {
      graphics.clear();
      graphics.lineStyle(3 - layer * 0.5, PALETTE.white, 0.28 - layer * 0.05);
      for (let y = 90 + layer * 28; y < WORLD_HEIGHT; y += 68) {
        graphics.beginPath();
        graphics.moveTo(0, y);
        for (let x = 0; x <= WORLD_WIDTH; x += 70) {
          const offset = Math.sin(x * 0.018 + y * 0.012 + this.wakeTimer * 0.001 + layer) * (8 + layer * 2);
          graphics.lineTo(x, y + offset);
        }
        graphics.strokePath();
      }
    });
  }

  private addMapObjects() {
    for (const hotspot of this.mapHotspots()) {
      const unlocked = this.state.unlockedAreaIds.includes(hotspot.area.id);
      const discovered = isAreaDiscovered(this.state, hotspot.area);
      const risk = !discovered && canAttemptVoyageEventForArea(this.state, hotspot.area);
      const rumor = !discovered && (canDiscoverArea(this.state, hotspot.area) || risk);
      const weather = getAreaWeather(hotspot.area, this.state);
      const object = this.add.image(hotspot.x, hotspot.y, hotspot.texture).setDepth(5).setAlpha(unlocked ? 1 : rumor ? 0.34 : 0.48);
      if (rumor) {
        object.setTint(weather.tint);
      }
      const glow = this.add.image(hotspot.x, hotspot.y - 74, "sparkle-point").setDepth(6).setScale(0.9);
      glow.setAlpha(unlocked ? 0.95 : rumor ? 0.58 : 0.24);
      glow.setTint(weather.tint);
      this.tweens.add({
        targets: glow,
        scale: unlocked ? 1.15 : rumor ? 1.05 : 0.92,
        alpha: unlocked ? 0.45 : rumor ? 0.32 : 0.18,
        duration: 900,
        yoyo: true,
        repeat: -1,
        ease: "Sine.inOut",
      });

      this.add
        .text(hotspot.x, hotspot.y + 92, this.hotspotLabel(hotspot.area, unlocked, rumor), {
          fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
          fontSize: "22px",
          fontStyle: "900",
          color: unlocked || rumor ? TEXT.primary : TEXT.disabled,
          backgroundColor: unlocked || rumor ? "rgba(255,255,255,0.68)" : "rgba(255,255,255,0.45)",
          padding: { x: 12, y: 7 },
        })
        .setOrigin(0.5)
        .setDepth(7);

      object.setInteractive({ useHandCursor: true });
      object.on("pointerdown", () => {
        this.setSailTarget(hotspot.x, hotspot.y - 92);
      });
    }

    this.addPortObjects();
    this.addDecorativeSailRoutes();
  }

  private addPortObjects() {
    for (const port of ports.filter((entry) => isPortUnlocked(this.state, entry))) {
      const marker = this.add.container(port.position.x, port.position.y).setDepth(9);
      marker.add(this.add.circle(0, 0, 26, PALETTE.butter, 0.92).setStrokeStyle(4, PALETTE.ink, 0.72));
      marker.add(this.add.rectangle(0, 4, 34, 18, PALETTE.paper, 0.95).setStrokeStyle(2, PALETTE.ink, 0.45));
      marker.add(this.add.triangle(0, -24, 0, -20, -16, 8, 16, 8, PALETTE.coral, 0.95).setStrokeStyle(2, PALETTE.ink, 0.4));
      this.add
        .text(port.position.x, port.position.y + 48, port.name, {
          fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
          fontSize: "18px",
          fontStyle: "900",
          color: TEXT.primary,
          backgroundColor: "rgba(255,251,239,0.76)",
          padding: { x: 9, y: 5 },
        })
        .setOrigin(0.5)
        .setDepth(10);
      marker.setSize(74, 74);
      marker.setInteractive({ useHandCursor: true });
      marker.on("pointerdown", () => this.scene.start("Port", { portId: port.id }));
    }
  }

  private addDecorativeSailRoutes() {
    const route = this.add.graphics().setDepth(2);
    route.lineStyle(4, PALETTE.white, 0.26);
    route.beginPath();
    route.moveTo(230, 850);
    for (const hotspot of this.mapHotspots()) {
      route.lineTo(hotspot.x, hotspot.y - 92);
    }
    route.strokePath();

    for (const point of [
      [250, 310],
      [680, 210],
      [1260, 270],
      [1540, 980],
      [800, 950],
      [2140, 230],
      [2240, 1340],
      [520, 1500],
    ] as const) {
      const cloud = this.add.graphics().setDepth(3);
      cloud.fillStyle(PALETTE.white, 0.32);
      cloud.fillCircle(point[0], point[1], 28);
      cloud.fillCircle(point[0] + 28, point[1] - 8, 22);
      cloud.fillCircle(point[0] + 52, point[1], 24);
    }
  }

  private addBoat() {
    this.boat = addPlayerBoat(this, 230, 850, this.state, { scale: 0.82, depth: 12, mapMode: true, showCaptain: false });
    addCompanionFollowers(this, this.boat, this.state, "ocean");
    this.cameras.main.startFollow(this.boat, true, 0.08, 0.08);
    this.tweens.add({
      targets: this.boat,
      scaleY: 0.9,
      duration: 1100,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut",
    });
  }

  private addHud() {
    const offset = fixedContentOffset(this);
    const fixed = this.add.container(offset, 0).setScrollFactor(0).setDepth(50);
    fixed.add(
      this.add
        .rectangle(480, 38, 900, 62, 0xffffff, 0.72)
        .setStrokeStyle(3, PALETTE.ink, 0.9),
    );
    fixed.add(
      this.add
        .text(44, 38, "바다 지도", {
          fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
          fontSize: "30px",
          fontStyle: "900",
          color: TEXT.primary,
        })
        .setOrigin(0, 0.5),
    );
    fixed.add(
      this.add
        .text(322, 38, "클릭/터치한 곳으로 항해 · 방향키/WASD도 가능", {
          fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
          fontSize: "18px",
          fontStyle: "800",
          color: TEXT.secondary,
          fixedWidth: 386,
        })
        .setOrigin(0, 0.5),
    );
    fixed.add(
      this.add
        .text(910, 38, `조개 ${this.state.shells} · Lv.${this.state.level}`, {
          fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
          fontSize: "21px",
          fontStyle: "900",
          color: TEXT.primary,
        })
        .setOrigin(1, 0.5),
    );

    fixed.add(this.createCompass(190, 38));
    fixed.add(this.createMiniMap(824, 392));
    this.weatherText = this.add
      .text(322, 60, "날씨 소문을 확인하는 중", {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "13px",
        fontStyle: "800",
        color: TEXT.secondary,
        fixedWidth: 380,
      })
      .setOrigin(0, 0.5);
    fixed.add(this.weatherText);

    addTextButton(this, offset + 84, 500, "항구", () => this.scene.start("Harbor"), {
      width: 120,
      height: 44,
      fontSize: 18,
      fill: PALETTE.seaFoam,
      iconKey: "icon-harbor",
      iconScale: 0.34,
    }).setScrollFactor(0).setDepth(60);
    addMuteButton(this, offset + 880, 500).setScrollFactor(0).setDepth(60);
  }

  private createCompass(x: number, y: number) {
    const compass = this.add.container(x, y);
    compass.add(this.add.circle(0, 0, 22, PALETTE.paper, 0.92).setStrokeStyle(3, PALETTE.ink, 0.85));
    compass.add(
      this.add
        .text(0, -1, "N", {
          fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
          fontSize: "12px",
          fontStyle: "900",
          color: TEXT.primary,
        })
        .setOrigin(0.5),
    );
    this.compassNeedle = this.add.triangle(0, 0, 0, -17, -7, 7, 7, 7, PALETTE.coral, 1).setStrokeStyle(2, PALETTE.ink, 0.55);
    compass.add(this.compassNeedle);
    return compass;
  }

  private createMiniMap(x: number, y: number) {
    const map = this.add.container(x, y);
    map.add(this.add.rectangle(0, 0, 170, 102, PALETTE.paper, 0.76).setStrokeStyle(3, PALETTE.ink, 0.85));
    map.add(
      this.add
        .text(-74, -38, "작은 지도", {
          fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
          fontSize: "14px",
          fontStyle: "900",
          color: TEXT.primary,
        })
        .setOrigin(0, 0.5),
    );

    for (const hotspot of this.mapHotspots()) {
      const unlocked = this.state.unlockedAreaIds.includes(hotspot.area.id);
      const rumor = !isAreaDiscovered(this.state, hotspot.area) && canDiscoverArea(this.state, hotspot.area);
      const dot = this.add.circle(
        -72 + (hotspot.x / WORLD_WIDTH) * 144,
        -28 + (hotspot.y / WORLD_HEIGHT) * 70,
        unlocked ? 5 : rumor ? 4.5 : 4,
        unlocked ? PALETTE.butter : rumor ? getAreaWeather(hotspot.area, this.state).tint : 0x91a4ad,
        1,
      );
      dot.setStrokeStyle(2, PALETTE.ink, 0.35);
      map.add(dot);
    }

    for (const port of ports.filter((entry) => isPortUnlocked(this.state, entry))) {
      const dot = this.add.rectangle(
        -72 + (port.position.x / WORLD_WIDTH) * 144,
        -28 + (port.position.y / WORLD_HEIGHT) * 70,
        7,
        7,
        PALETTE.coral,
        0.96,
      );
      dot.setStrokeStyle(1, PALETTE.ink, 0.35);
      map.add(dot);
    }

    this.miniBoat = this.add.triangle(-72, 22, 0, -7, -7, 7, 7, 7, PALETTE.lagoon, 1).setStrokeStyle(2, PALETTE.ink, 0.55);
    map.add(this.miniBoat);
    this.statusText = this.add
      .text(-74, 38, "반짝 포인트를 찾아요", {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "13px",
        fontStyle: "800",
        color: TEXT.secondary,
      })
      .setOrigin(0, 0.5);
    map.add(this.statusText);
    return map;
  }

  private addTouchControls() {
    const controls = this.add.container(fixedContentOffset(this) + 250, 448).setScrollFactor(0).setDepth(62).setAlpha(0.72);
    controls.add(this.add.circle(0, 0, 58, PALETTE.paper, 0.52).setStrokeStyle(3, PALETTE.ink, 0.45));
    const controlsText = this.add
      .text(0, 0, "터치\n항해", {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "16px",
        fontStyle: "900",
        color: TEXT.primary,
        align: "center",
      })
      .setOrigin(0.5);
    controls.add(controlsText);
    controls.setSize(116, 116);
    controls.setInteractive({ useHandCursor: true });
    controls.on("pointerdown", () => {
      this.setSailTarget(this.boat.x + 260, this.boat.y);
    });
  }

  private setupInput() {
    this.cursors = this.input.keyboard?.createCursorKeys();
    this.keys = this.input.keyboard?.addKeys("W,A,S,D") as Record<string, Phaser.Input.Keyboard.Key>;
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (pointer.y < 78 || pointer.y > 470) {
        return;
      }
      const world = pointer.positionToCamera(this.cameras.main) as Phaser.Math.Vector2;
      this.setSailTarget(
        Phaser.Math.Clamp(world.x, 80, WORLD_WIDTH - 80),
        Phaser.Math.Clamp(world.y, 90, WORLD_HEIGHT - 90),
      );
    });
  }

  private moveBoat(delta: number) {
    const speed = (0.23 + getBoatSpeed(this.state) * 0.16) * delta;
    const direction = new Phaser.Math.Vector2(0, 0);
    if (this.cursors?.left.isDown || this.keys?.A.isDown) direction.x -= 1;
    if (this.cursors?.right.isDown || this.keys?.D.isDown) direction.x += 1;
    if (this.cursors?.up.isDown || this.keys?.W.isDown) direction.y -= 1;
    if (this.cursors?.down.isDown || this.keys?.S.isDown) direction.y += 1;

    if (direction.lengthSq() > 0) {
      this.target = undefined;
      direction.normalize().scale(speed);
      this.setBoatPosition(this.boat.x + direction.x, this.boat.y + direction.y);
      this.rotateBoat(direction);
      this.addWake(delta);
      this.updateHudDirection(direction);
      return;
    }

    if (!this.target) {
      return;
    }

    const toTarget = this.target.clone().subtract(new Phaser.Math.Vector2(this.boat.x, this.boat.y));
    if (toTarget.length() < 9) {
      this.target = undefined;
      return;
    }

    toTarget.normalize().scale(Math.min(speed, toTarget.length()));
    this.setBoatPosition(this.boat.x + toTarget.x, this.boat.y + toTarget.y);
    this.rotateBoat(toTarget);
    this.addWake(delta);
    this.updateHudDirection(toTarget);
    this.updateTargetMarker();
  }

  private setBoatPosition(x: number, y: number) {
    this.boat.setPosition(
      Phaser.Math.Clamp(x, 70, WORLD_WIDTH - 70),
      Phaser.Math.Clamp(y, 70, WORLD_HEIGHT - 70),
    );
  }

  private rotateBoat(direction: Phaser.Math.Vector2) {
    const targetRotation = Phaser.Math.Angle.Between(0, 0, direction.x, direction.y) + Math.PI / 2;
    this.boat.rotation = Phaser.Math.Angle.RotateTo(this.boat.rotation, targetRotation, 0.08);
  }

  private addWake(delta: number) {
    this.wakeCooldown -= delta;
    if (this.wakeCooldown > 0) {
      return;
    }
    this.wakeCooldown = Math.max(62, 110 - getBoatSpeed(this.state) * 95);
    const wake = this.add.circle(this.boat.x - 24, this.boat.y + 22, 10, boatWakeTint(this.state.equippedBoatId), 0.38).setDepth(9);
    this.tweens.add({
      targets: wake,
      scale: 2.4,
      alpha: 0,
      duration: 620,
      onComplete: () => wake.destroy(),
    });
  }

  private setSailTarget(x: number, y: number) {
    this.target = new Phaser.Math.Vector2(x, y);
    this.targetMarker?.destroy();
    const ring = this.add.circle(0, 0, 30, PALETTE.butter, 0.15).setStrokeStyle(4, PALETTE.butter, 0.88);
    const sparkle = this.add.image(0, -30, "sparkle-point").setScale(0.55);
    this.targetMarker = this.add.container(x, y, [ring, sparkle]).setDepth(11);
    this.tweens.add({
      targets: this.targetMarker,
      scale: 1.18,
      alpha: 0.5,
      duration: 760,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut",
    });
  }

  private updateTargetMarker() {
    if (!this.target || !this.targetMarker) {
      return;
    }
    const distance = Phaser.Math.Distance.Between(this.boat.x, this.boat.y, this.target.x, this.target.y);
    if (distance < 28) {
      this.targetMarker.destroy();
      this.targetMarker = undefined;
    }
  }

  private updateHudDirection(direction: Phaser.Math.Vector2) {
    this.compassNeedle?.setRotation(Phaser.Math.Angle.Between(0, 0, direction.x, direction.y) + Math.PI / 2);
    if (this.miniBoat) {
      this.miniBoat.setPosition(
        -72 + (this.boat.x / WORLD_WIDTH) * 144,
        -28 + (this.boat.y / WORLD_HEIGHT) * 70,
      );
      this.miniBoat.setRotation(Phaser.Math.Angle.Between(0, 0, direction.x, direction.y) + Math.PI / 2);
    }
  }

  private updateNearbyPrompt() {
    const available = this.mapHotspots().filter((hotspot) => this.state.unlockedAreaIds.includes(hotspot.area.id) || canDiscoverArea(this.state, hotspot.area) || canAttemptVoyageEventForArea(this.state, hotspot.area));
    const closest = available.find((hotspot) => Phaser.Math.Distance.Between(this.boat.x, this.boat.y, hotspot.x, hotspot.y) < 170);
    if (closest?.area.id === this.nearby?.area.id) {
      return;
    }

    this.prompt?.destroy();
    this.prompt = undefined;
    this.nearby = closest;

    if (!closest) {
      this.statusText?.setText("반짝 포인트를 찾아요");
      this.weatherText?.setText("숨은 항로는 이상한 물결 근처에서 드러나요");
      return;
    }

    const wasDiscovered = isAreaDiscovered(this.state, closest.area);
    const canAttemptRisk = canAttemptVoyageEventForArea(this.state, closest.area);
    if (!wasDiscovered && !canAttemptRisk && canDiscoverArea(this.state, closest.area)) {
      this.state = discoverArea(this.state, closest.area.id);
      saveGame(this.state);
    }

    const weather = getAreaWeather(closest.area, this.state);
    const newlyDiscovered = !wasDiscovered && isAreaDiscovered(this.state, closest.area);
    this.statusText?.setText(newlyDiscovered ? "숨은 항로 발견!" : `${closest.area.name} 발견!`);
    this.weatherText?.setText(`${closest.area.name} · ${weather.label} · ${weather.description}`);
    playSoftTone(this, this.state, 640, 0.06);
    const eventId = requiredVoyageEventForArea(closest.area) ?? voyageEventForArea(closest.area).id;
    const event = getVoyageEvent(eventId);
    const panel = this.add.rectangle(0, 0, 438, 88, PALETTE.paper, 0.9).setStrokeStyle(4, PALETTE.ink);
    const text = this.add
      .text(-200, -18, canAttemptRisk ? `${event?.label ?? "위험 항로"} 발견!` : newlyDiscovered ? closest.area.route?.revealText ?? `${closest.area.name} 발견!` : `${closest.area.name} 근처예요`, {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: newlyDiscovered ? "18px" : "23px",
        fontStyle: "900",
        color: TEXT.primary,
        wordWrap: { width: 268 },
      })
      .setOrigin(0, 0.5);
    const hint = this.add
      .text(-200, 24, canAttemptRisk ? `${event?.description ?? "위험한 항로를 통과해야 해요."}` : `${weather.label} · 반짝 포인트에서 낚시해볼까요?`, {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "16px",
        fontStyle: "800",
        color: TEXT.secondary,
        wordWrap: { width: 284 },
      })
      .setOrigin(0, 0.5);
    const button = addTextButton(this, 140, 0, canAttemptRisk ? "위험 항로" : "낚시", () => {
      if (canAttemptRisk) {
        this.startVoyageEvent(closest.area, eventId);
        return;
      }
      this.scene.start("Fishing", { areaId: closest.area.id });
    }, {
      width: 104,
      height: 48,
      fontSize: 19,
      fill: PALETTE.butter,
      iconKey: "icon-rod",
      iconScale: 0.3,
    });
    this.prompt = this.add.container(fixedContentOffset(this) + 480, 112, [panel, text, hint, button]).setScrollFactor(0).setDepth(70);
    this.prompt.setSize(438, 88);
    this.prompt.setInteractive({ useHandCursor: true });
    this.prompt.on("pointerdown", () => {
      if (canAttemptRisk) {
        this.startVoyageEvent(closest.area, eventId);
        return;
      }
      this.scene.start("Fishing", { areaId: closest.area.id });
    });
  }

  private mapHotspots(): Hotspot[] {
    return hotspots.filter((hotspot) => isAreaDiscovered(this.state, hotspot.area) || canDiscoverArea(this.state, hotspot.area) || canAttemptVoyageEventForArea(this.state, hotspot.area));
  }

  private hotspotLabel(area: AreaDefinition, unlocked: boolean, rumor: boolean): string {
    if (unlocked) {
      return area.name;
    }
    if (rumor) {
      return canAttemptVoyageEventForArea(this.state, area) ? "위험 항로" : "수상한 물결";
    }
    return `Lv.${area.requiredLevel} 열림`;
  }

  private startVoyageEvent(area: AreaDefinition, eventId: VoyageEventId) {
    if (this.voyageEventActive) {
      return;
    }

    const event = getVoyageEvent(eventId) ?? voyageEventForArea(area);
    this.voyageEventArea = area;
    this.voyageEventId = event.id;
    this.voyageEventScore = 0;
    this.voyageEventDirection = 1;
    this.voyageEventActive = true;
    this.prompt?.destroy();
    this.prompt = undefined;
    this.target = undefined;

    const panel = this.add.rectangle(0, 0, 560, 190, PALETTE.paper, 0.94).setStrokeStyle(4, PALETTE.ink, 0.86);
    const title = this.add.text(-250, -70, event.label, {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "26px",
      fontStyle: "900",
      color: TEXT.primary,
    }).setOrigin(0, 0.5);
    const helper = this.add.text(-250, -34, event.description, {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "16px",
      fontStyle: "800",
      color: TEXT.secondary,
      fixedWidth: 500,
      wordWrap: { width: 500 },
    }).setOrigin(0, 0.5);
    const meterBg = this.add.rectangle(0, 36, 420, 42, 0xd9eef0, 1).setStrokeStyle(3, PALETTE.ink, 0.52);
    const safeZone = this.add.rectangle(0, 36, 132 + this.voyageEventWindow() * 220, 36, event.tint, 0.82);
    this.voyageEventNeedle = this.add.rectangle(-196, 36, 8, 62, PALETTE.coral, 1);
    const button = addTextButton(this, 0, 86, "지금 통과", () => this.resolveVoyageEvent(false), {
      width: 170,
      height: 42,
      fontSize: 18,
      fill: PALETTE.butter,
    });
    this.voyageEventGroup = this.add.container(fixedContentOffset(this) + 480, 258, [panel, title, helper, meterBg, safeZone, this.voyageEventNeedle, button])
      .setScrollFactor(0)
      .setDepth(90);
    this.time.delayedCall(7600, () => this.resolveVoyageEvent(true));
  }

  private updateVoyageEvent(delta: number) {
    if (!this.voyageEventNeedle) {
      return;
    }
    this.voyageEventScore += this.voyageEventDirection * delta * 0.00078;
    if (this.voyageEventScore >= 1) {
      this.voyageEventScore = 1;
      this.voyageEventDirection = -1;
    }
    if (this.voyageEventScore <= 0) {
      this.voyageEventScore = 0;
      this.voyageEventDirection = 1;
    }
    this.voyageEventNeedle.x = -196 + this.voyageEventScore * 392;
  }

  private resolveVoyageEvent(forceFail: boolean) {
    if (!this.voyageEventActive || !this.voyageEventId || !this.voyageEventArea) {
      return;
    }
    const event = getVoyageEvent(this.voyageEventId);
    const success = !forceFail && Math.abs(this.voyageEventScore - 0.5) <= this.voyageEventWindow();
    this.voyageEventActive = false;
    this.voyageEventGroup?.destroy(true);
    this.voyageEventGroup = undefined;
    const updated = recordVoyageEventResult(this.state, this.voyageEventId, success);
    const discovered = success && canDiscoverArea(updated, this.voyageEventArea)
      ? discoverArea(updated, this.voyageEventArea.id)
      : updated;
    saveGame(discovered);
    playSoftTone(this, discovered, success ? 760 : 420, 0.1);
    this.statusText?.setText(success ? event?.successText ?? "위험 항로 통과!" : event?.failText ?? "다시 도전할 수 있어요.");
    this.scene.restart();
  }

  private voyageEventWindow() {
    const event = this.voyageEventId ? getVoyageEvent(this.voyageEventId) : undefined;
    const build = getEquippedGearBuild(this.state);
    const roleBonus = event?.preferredRole && build.primaryRole === event.preferredRole ? 0.045 + build.synergyLevel * 0.012 : 0;
    const companionBonus = Math.min(0.05, this.state.equippedCompanionIds.reduce((sum, id) => sum + (this.state.affinity[id] ?? 0), 0) / 6000);
    return 0.14 + roleBonus + companionBonus;
  }
}

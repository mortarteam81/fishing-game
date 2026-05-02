import Phaser from "phaser";
import { areas, fish as fishContent } from "../game/content";
import { ensureSvgTextures, playerPresentationTextures } from "../game/lazyTextures";
import { PALETTE } from "../game/palette";
import { CREATURE_SVGS } from "../game/creatureSvgs";
import { loadGame } from "../game/storage";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  preload() {
    for (const [key, svg] of Object.entries(CREATURE_SVGS)) {
      if (!this.textures.exists(key)) {
        this.load.image(key, `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`);
      }
    }
  }

  create() {
    this.createBoatTexture();
    this.createCharacterTexture();
    this.createOceanTextures();
    this.createUiIcons();
    this.add
      .text(480, 270, "바다 장비를 준비하는 중...", {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "26px",
        fontStyle: "900",
        color: "#183346",
      })
      .setOrigin(0.5);
    void this.startWhenReady();
  }

  private async startWhenReady() {
    await ensureSvgTextures(this, playerPresentationTextures(loadGame()));
    this.scene.start("Harbor");
  }

  private createFishTextures() {
    const fishStyles = [
      ["fish-sunny-minnow", "fish", PALETTE.butter, PALETTE.coral],
      ["fish-bubble-flounder", "flat", 0x8bd7ef, PALETTE.seaGlass],
      ["fish-sand-shrimp", "shrimp", 0xffb56f, PALETTE.coralDeep],
      ["fish-peach-seahorse", "seahorse", 0xffb2a8, PALETTE.butter],
      ["fish-ribbon-squid", "squid", 0xf4a7ca, 0xb98bd8],
      ["fish-moon-jelly", "jelly", 0xbce7ff, PALETTE.lavender],
      ["fish-harbor-mackerel", "fish", 0x6fc3d7, PALETTE.deepLagoon],
      ["fish-shell-crab", "crab", PALETTE.coral, PALETTE.coralDeep],
      ["fish-drum-octopus", "octopus", 0xd896ff, 0xff9fc9],
      ["fish-sleepy-ray", "ray", 0x92d7d3, PALETTE.deepLagoon],
      ["fish-candy-puffer", "puffer", 0xffc7d7, PALETTE.butter],
      ["fish-starfish-pal", "star", PALETTE.butter, 0xf0a84e],
      ["fish-coral-tang", "fish", PALETTE.seaGlass, PALETTE.mossDark],
      ["fish-ribbon-eel", "eel", 0x67c9db, PALETTE.lavender],
      ["fish-pearl-clam", "clam", PALETTE.warmCream, PALETTE.coral],
      ["fish-pearl-turtle", "turtle", 0xa7dbc7, PALETTE.moss],
      ["fish-lantern-angler", "angler", 0x5275b8, PALETTE.butter],
      ["fish-sea-bunny", "slug", 0xfff0f6, PALETTE.coral],
      ["fish-rainbow-whale", "whale", 0xb9a6ff, 0xff9fbd],
    ] as const;

    for (const [key, shape, body, accent] of fishStyles) {
      if (this.textures.exists(key)) {
        continue;
      }
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      this.drawSeaCreature(g, shape, body, accent);
      g.generateTexture(key, 96, 68);
      g.destroy();
    }

    const generatedShapes = [
      "fish",
      "flat",
      "squid",
      "crab",
      "star",
      "turtle",
      "whale",
      "jelly",
      "seahorse",
      "shrimp",
      "ray",
      "octopus",
      "puffer",
      "eel",
      "clam",
      "angler",
      "slug",
    ] as const;

    for (const entry of fishContent) {
      if (this.textures.exists(entry.assetKey)) {
        continue;
      }
      const hash = this.hashString(entry.id);
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      const shape = generatedShapes[hash % generatedShapes.length];
      this.drawSeaCreature(g, shape, this.colorFromHash(hash), this.colorFromHash(hash * 7 + 19));
      g.generateTexture(entry.assetKey, 96, 68);
      g.destroy();
    }
  }

  private drawSeaCreature(
    g: Phaser.GameObjects.Graphics,
    shape:
      | "fish"
      | "flat"
      | "squid"
      | "crab"
      | "star"
      | "turtle"
      | "whale"
      | "jelly"
      | "seahorse"
      | "shrimp"
      | "ray"
      | "octopus"
      | "puffer"
      | "eel"
      | "clam"
      | "angler"
      | "slug",
    body: number,
    accent: number,
  ) {
    g.fillStyle(0xffffff, 0.2);
    g.fillEllipse(48, 42, 76, 34);
    g.lineStyle(3, PALETTE.ink, 0.24);

    if (shape === "squid") {
      g.fillStyle(body, 1);
      g.fillEllipse(47, 28, 48, 38);
      g.fillStyle(accent, 1);
      for (let i = 0; i < 5; i += 1) {
        g.fillRoundedRect(29 + i * 8, 43, 5, 18 + (i % 2) * 5, 4);
      }
      g.strokeEllipse(47, 28, 48, 38);
    } else if (shape === "crab") {
      g.fillStyle(body, 1);
      g.fillEllipse(48, 38, 54, 34);
      g.fillStyle(accent, 1);
      g.fillCircle(20, 31, 10);
      g.fillCircle(76, 31, 10);
      g.lineStyle(3, PALETTE.ink, 0.24);
      g.strokeEllipse(48, 38, 54, 34);
      g.strokeCircle(20, 31, 10);
      g.strokeCircle(76, 31, 10);
    } else if (shape === "star") {
      g.fillStyle(body, 1);
      g.fillPoints(
        [
          new Phaser.Math.Vector2(48, 7),
          new Phaser.Math.Vector2(57, 28),
          new Phaser.Math.Vector2(80, 28),
          new Phaser.Math.Vector2(61, 42),
          new Phaser.Math.Vector2(68, 63),
          new Phaser.Math.Vector2(48, 50),
          new Phaser.Math.Vector2(28, 63),
          new Phaser.Math.Vector2(35, 42),
          new Phaser.Math.Vector2(16, 28),
          new Phaser.Math.Vector2(39, 28),
        ],
        true,
      );
      g.fillStyle(accent, 0.45);
      g.fillCircle(48, 36, 12);
    } else if (shape === "turtle") {
      g.fillStyle(accent, 1);
      g.fillCircle(72, 33, 12);
      g.fillStyle(body, 1);
      g.fillEllipse(45, 36, 56, 42);
      g.fillStyle(PALETTE.mossDark, 0.28);
      g.fillEllipse(45, 32, 28, 18);
      g.strokeEllipse(45, 36, 56, 42);
    } else if (shape === "whale") {
      g.fillStyle(body, 1);
      g.fillEllipse(47, 38, 76, 42);
      g.fillStyle(accent, 1);
      g.fillTriangle(13, 38, 0, 22, 0, 54);
      g.fillTriangle(70, 23, 94, 10, 84, 33);
      g.fillStyle(PALETTE.white, 0.38);
      g.fillEllipse(40, 47, 36, 13);
      g.strokeEllipse(47, 38, 76, 42);
    } else if (shape === "jelly") {
      g.fillStyle(body, 0.95);
      g.fillEllipse(48, 29, 56, 34);
      g.fillStyle(accent, 0.58);
      g.fillEllipse(48, 28, 32, 18);
      g.lineStyle(4, body, 0.78);
      for (let i = 0; i < 5; i += 1) {
        const x = 30 + i * 9;
        g.lineBetween(x, 43, x - 4 + (i % 2) * 8, 62);
      }
      g.lineStyle(3, PALETTE.ink, 0.2);
      g.strokeEllipse(48, 29, 56, 34);
    } else if (shape === "seahorse") {
      g.fillStyle(body, 1);
      g.fillCircle(55, 23, 15);
      g.fillEllipse(48, 42, 34, 46);
      g.fillStyle(accent, 1);
      g.fillTriangle(39, 39, 21, 31, 31, 50);
      g.lineStyle(5, body, 1);
      g.beginPath();
      g.arc(49, 58, 16, 0.2, Math.PI * 1.55);
      g.strokePath();
      g.lineStyle(3, PALETTE.ink, 0.23);
      g.strokeCircle(55, 23, 15);
      g.strokeEllipse(48, 42, 34, 46);
    } else if (shape === "shrimp") {
      g.fillStyle(body, 1);
      g.fillEllipse(48, 37, 57, 30);
      g.fillStyle(accent, 1);
      g.fillTriangle(17, 37, 2, 24, 5, 52);
      g.fillTriangle(78, 36, 94, 27, 89, 48);
      g.lineStyle(3, PALETTE.ink, 0.2);
      for (let x = 35; x <= 62; x += 9) {
        g.lineBetween(x, 25, x + 3, 49);
      }
      g.lineBetween(74, 27, 91, 12);
      g.lineBetween(75, 30, 94, 20);
      g.strokeEllipse(48, 37, 57, 30);
    } else if (shape === "ray") {
      g.fillStyle(body, 1);
      g.fillPoints(
        [
          new Phaser.Math.Vector2(10, 35),
          new Phaser.Math.Vector2(48, 14),
          new Phaser.Math.Vector2(86, 35),
          new Phaser.Math.Vector2(56, 52),
          new Phaser.Math.Vector2(48, 66),
          new Phaser.Math.Vector2(40, 52),
        ],
        true,
      );
      g.fillStyle(accent, 0.38);
      g.fillEllipse(48, 35, 34, 17);
      g.lineStyle(3, PALETTE.ink, 0.22);
      g.lineBetween(56, 52, 84, 64);
    } else if (shape === "octopus") {
      g.fillStyle(body, 1);
      g.fillEllipse(48, 27, 46, 38);
      g.fillStyle(accent, 1);
      for (let i = 0; i < 6; i += 1) {
        g.fillRoundedRect(25 + i * 8, 42, 6, 20 + (i % 2) * 7, 4);
      }
      g.fillStyle(PALETTE.butter, 0.85);
      g.fillCircle(30, 52, 5);
      g.fillCircle(66, 52, 5);
      g.lineStyle(3, PALETTE.ink, 0.22);
      g.strokeEllipse(48, 27, 46, 38);
    } else if (shape === "puffer") {
      g.fillStyle(accent, 0.85);
      g.fillTriangle(48, 5, 42, 18, 54, 18);
      g.fillTriangle(48, 64, 42, 51, 54, 51);
      g.fillTriangle(16, 35, 30, 29, 30, 41);
      g.fillTriangle(80, 35, 66, 29, 66, 41);
      g.fillStyle(body, 1);
      g.fillCircle(48, 36, 30);
      g.fillStyle(accent, 0.72);
      g.fillCircle(37, 28, 5);
      g.fillCircle(57, 43, 5);
      g.fillCircle(43, 49, 4);
      g.lineStyle(3, PALETTE.ink, 0.22);
      g.strokeCircle(48, 36, 30);
    } else if (shape === "eel") {
      g.fillStyle(body, 1);
      g.fillEllipse(30, 42, 42, 20);
      g.fillEllipse(53, 33, 43, 19);
      g.fillEllipse(73, 39, 34, 17);
      g.fillStyle(accent, 0.65);
      g.fillEllipse(48, 35, 58, 7);
      g.fillTriangle(86, 39, 96, 29, 94, 49);
      g.lineStyle(3, PALETTE.ink, 0.18);
      g.strokeEllipse(53, 33, 43, 19);
    } else if (shape === "clam") {
      g.fillStyle(body, 1);
      g.fillEllipse(48, 42, 62, 34);
      g.fillStyle(accent, 0.84);
      g.fillTriangle(48, 17, 18, 42, 78, 42);
      g.fillStyle(PALETTE.white, 0.92);
      g.fillCircle(48, 44, 8);
      g.lineStyle(3, PALETTE.ink, 0.24);
      g.strokeEllipse(48, 42, 62, 34);
      for (let x = 27; x <= 69; x += 10) {
        g.lineBetween(48, 19, x, 49);
      }
    } else if (shape === "angler") {
      g.fillStyle(body, 1);
      g.fillEllipse(47, 38, 70, 38);
      g.fillTriangle(15, 38, 0, 22, 0, 54);
      g.fillStyle(accent, 1);
      g.fillCircle(74, 14, 8);
      g.lineStyle(3, accent, 0.9);
      g.lineBetween(58, 23, 72, 15);
      g.fillStyle(PALETTE.white, 0.28);
      g.fillEllipse(39, 47, 31, 10);
      g.lineStyle(3, PALETTE.ink, 0.24);
      g.strokeEllipse(47, 38, 70, 38);
    } else if (shape === "slug") {
      g.fillStyle(body, 1);
      g.fillRoundedRect(19, 32, 58, 26, 14);
      g.fillCircle(68, 31, 14);
      g.fillStyle(accent, 0.82);
      g.fillCircle(42, 44, 5);
      g.fillCircle(55, 48, 4);
      g.lineStyle(4, accent, 1);
      g.lineBetween(63, 21, 58, 8);
      g.lineBetween(73, 22, 78, 9);
      g.lineStyle(3, PALETTE.ink, 0.2);
      g.strokeRoundedRect(19, 32, 58, 26, 14);
    } else {
      const height = shape === "flat" ? 34 : 42;
      g.fillStyle(body, 1);
      g.fillEllipse(48, 34, 72, height);
      g.fillTriangle(15, 34, 0, 16, 0, 52);
      g.fillStyle(accent, 1);
      g.fillEllipse(58, 29, 18, 10);
      g.fillTriangle(78, 34, 95, 24, 95, 44);
      g.strokeEllipse(48, 34, 72, height);
    }

    g.fillStyle(PALETTE.white, 1);
    g.fillCircle(66, 27, 6);
    g.fillStyle(PALETTE.ink, 1);
    g.fillCircle(68, 27, 3);
    g.fillStyle(PALETTE.white, 0.5);
    g.fillCircle(38, 22, 7);
  }

  private createBoatTexture() {
    if (!this.textures.exists("boat-shadow")) {
      const shadow = this.make.graphics({ x: 0, y: 0 }, false);
      shadow.fillStyle(0x102f3f, 0.2);
      shadow.fillEllipse(115, 28, 188, 24);
      shadow.generateTexture("boat-shadow", 230, 56);
      shadow.destroy();
    }

    if (!this.textures.exists("boat-hull")) {
      const hull = this.make.graphics({ x: 0, y: 0 }, false);
      const hullShape = [
        new Phaser.Math.Vector2(18, 66),
        new Phaser.Math.Vector2(208, 66),
        new Phaser.Math.Vector2(188, 103),
        new Phaser.Math.Vector2(44, 108),
        new Phaser.Math.Vector2(28, 94),
      ];
      hull.fillStyle(0x0f2f3d, 0.18);
      hull.fillEllipse(116, 104, 172, 18);
      hull.fillStyle(0x254f61, 1);
      hull.fillPoints(hullShape, true);
      hull.fillStyle(0x17384a, 0.86);
      hull.fillPoints(
        [
          new Phaser.Math.Vector2(34, 84),
          new Phaser.Math.Vector2(194, 80),
          new Phaser.Math.Vector2(184, 100),
          new Phaser.Math.Vector2(48, 104),
        ],
        true,
      );
      hull.fillStyle(0xd9c4a3, 1);
      hull.fillRect(43, 58, 126, 9);
      hull.fillStyle(0x8c6d4e, 1);
      for (let x = 52; x <= 143; x += 23) {
        hull.fillRect(x, 59, 13, 6);
      }
      hull.fillStyle(0xf0ead8, 1);
      hull.fillRoundedRect(82, 36, 58, 28, 5);
      hull.fillStyle(0x224a5f, 0.92);
      hull.fillRoundedRect(91, 42, 16, 11, 3);
      hull.fillRoundedRect(113, 42, 16, 11, 3);
      hull.lineStyle(5, PALETTE.ink, 0.32);
      hull.beginPath();
      hull.moveTo(hullShape[0].x, hullShape[0].y);
      for (const point of hullShape.slice(1)) {
        hull.lineTo(point.x, point.y);
      }
      hull.closePath();
      hull.strokePath();
      hull.lineStyle(2, PALETTE.white, 0.44);
      hull.lineBetween(42, 70, 187, 68);
      hull.lineStyle(3, 0x0f2f3d, 0.32);
      hull.lineBetween(71, 36, 152, 36);
      hull.generateTexture("boat-hull", 230, 118);
      hull.destroy();
    }

    if (!this.textures.exists("boat-sail")) {
      const sail = this.make.graphics({ x: 0, y: 0 }, false);
      sail.lineStyle(5, PALETTE.ink, 0.34);
      sail.lineBetween(43, 9, 43, 91);
      sail.lineStyle(3, PALETTE.ink, 0.28);
      sail.lineBetween(43, 22, 93, 40);
      sail.lineBetween(43, 48, 98, 73);
      sail.fillStyle(0xf0ead8, 1);
      sail.fillRoundedRect(58, 49, 54, 32, 4);
      sail.fillStyle(0xd8e8ea, 1);
      sail.fillRoundedRect(64, 54, 18, 13, 2);
      sail.fillRoundedRect(87, 54, 15, 13, 2);
      sail.fillStyle(0xc64f52, 0.92);
      sail.fillRect(54, 80, 64, 6);
      sail.lineStyle(3, PALETTE.ink, 0.22);
      sail.strokeRoundedRect(58, 49, 54, 32, 4);
      sail.lineStyle(2, PALETTE.white, 0.55);
      sail.lineBetween(65, 50, 106, 50);
      sail.generateTexture("boat-sail", 128, 112);
      sail.destroy();
    }

    if (!this.textures.exists("boat-map")) {
      const mapBoat = this.make.graphics({ x: 0, y: 0 }, false);
      const deck = [
        new Phaser.Math.Vector2(54, 8),
        new Phaser.Math.Vector2(83, 53),
        new Phaser.Math.Vector2(70, 104),
        new Phaser.Math.Vector2(38, 104),
        new Phaser.Math.Vector2(25, 53),
      ];
      mapBoat.fillStyle(0x102f3f, 0.16);
      mapBoat.fillEllipse(54, 67, 50, 86);
      mapBoat.fillStyle(0x254f61, 1);
      mapBoat.fillPoints(deck, true);
      mapBoat.fillStyle(0xd9c4a3, 1);
      mapBoat.fillRoundedRect(43, 42, 22, 35, 4);
      mapBoat.fillStyle(0xf0ead8, 1);
      mapBoat.fillRoundedRect(42, 25, 25, 17, 3);
      mapBoat.lineStyle(4, PALETTE.ink, 0.26);
      mapBoat.beginPath();
      mapBoat.moveTo(deck[0].x, deck[0].y);
      for (const point of deck.slice(1)) {
        mapBoat.lineTo(point.x, point.y);
      }
      mapBoat.closePath();
      mapBoat.strokePath();
      mapBoat.generateTexture("boat-map", 108, 118);
      mapBoat.destroy();
    }

    this.createBoatFlagTexture("boat-flag-star", PALETTE.coral, PALETTE.butter);
    this.createBoatFlagTexture("boat-flag-harbor", PALETTE.deepLagoon, PALETTE.seaFoam);
    this.createBoatFlagTexture("boat-flag-coral", PALETTE.coralDeep, PALETTE.lavender);

    if (!this.textures.exists("boat")) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      const hullShape = [
        new Phaser.Math.Vector2(18, 82),
        new Phaser.Math.Vector2(208, 82),
        new Phaser.Math.Vector2(188, 119),
        new Phaser.Math.Vector2(44, 124),
        new Phaser.Math.Vector2(28, 110),
      ];
      g.fillStyle(0x102f3f, 0.16);
      g.fillEllipse(116, 123, 188, 24);
      g.lineStyle(5, PALETTE.ink, 0.34);
      g.lineBetween(68, 19, 68, 99);
      g.lineStyle(3, PALETTE.ink, 0.28);
      g.lineBetween(68, 31, 118, 49);
      g.lineBetween(68, 57, 123, 82);
      g.fillStyle(0xf0ead8, 1);
      g.fillRoundedRect(83, 64, 54, 32, 4);
      g.fillStyle(0xd8e8ea, 1);
      g.fillRoundedRect(90, 69, 18, 13, 2);
      g.fillRoundedRect(113, 69, 15, 13, 2);
      g.fillStyle(0xc64f52, 0.92);
      g.fillRect(79, 95, 64, 6);
      g.fillStyle(0x254f61, 1);
      g.fillPoints(hullShape, true);
      g.fillStyle(0x17384a, 0.86);
      g.fillPoints(
        [
          new Phaser.Math.Vector2(34, 100),
          new Phaser.Math.Vector2(194, 96),
          new Phaser.Math.Vector2(184, 116),
          new Phaser.Math.Vector2(48, 120),
        ],
        true,
      );
      g.fillStyle(0xd9c4a3, 1);
      g.fillRect(43, 74, 126, 9);
      g.lineStyle(5, PALETTE.ink, 0.32);
      g.beginPath();
      g.moveTo(hullShape[0].x, hullShape[0].y);
      for (const point of hullShape.slice(1)) {
        g.lineTo(point.x, point.y);
      }
      g.closePath();
      g.strokePath();
      g.generateTexture("boat", 230, 140);
      g.destroy();
    }
  }

  private createBoatFlagTexture(key: string, fill: number, accent: number) {
    if (this.textures.exists(key)) {
      return;
    }

    const flag = this.make.graphics({ x: 0, y: 0 }, false);
    flag.fillStyle(fill, 1);
    flag.fillTriangle(7, 7, 7, 34, 43, 21);
    flag.fillStyle(accent, 0.92);
    flag.fillTriangle(11, 12, 11, 28, 32, 20);
    flag.lineStyle(3, PALETTE.ink, 0.32);
    flag.lineBetween(7, 6, 7, 39);
    flag.lineBetween(7, 7, 43, 21);
    flag.generateTexture(key, 48, 42);
    flag.destroy();
  }

  private createCharacterTexture() {
    if (this.textures.exists("captain-kid")) {
      return;
    }

    const g = this.make.graphics({ x: 0, y: 0 }, false);
    g.fillStyle(PALETTE.ink, 0.12);
    g.fillEllipse(60, 178, 52, 12);

    g.fillStyle(0x1d3547, 0.95);
    g.fillPoints(
      [
        new Phaser.Math.Vector2(45, 128),
        new Phaser.Math.Vector2(58, 128),
        new Phaser.Math.Vector2(55, 170),
        new Phaser.Math.Vector2(42, 170),
      ],
      true,
    );
    g.fillPoints(
      [
        new Phaser.Math.Vector2(64, 128),
        new Phaser.Math.Vector2(77, 128),
        new Phaser.Math.Vector2(84, 170),
        new Phaser.Math.Vector2(70, 170),
      ],
      true,
    );
    g.lineStyle(3, PALETTE.ink, 0.22);
    g.lineBetween(51, 130, 48, 167);
    g.lineBetween(70, 130, 77, 167);
    g.lineStyle(6, 0x2a221f, 0.95);
    g.lineBetween(38, 172, 53, 172);
    g.lineBetween(70, 172, 88, 172);

    g.fillStyle(0x21394b, 1);
    g.fillPoints(
      [
        new Phaser.Math.Vector2(43, 64),
        new Phaser.Math.Vector2(78, 64),
        new Phaser.Math.Vector2(82, 130),
        new Phaser.Math.Vector2(39, 130),
      ],
      true,
    );
    g.fillStyle(0xe0a253, 0.92);
    g.fillPoints(
      [
        new Phaser.Math.Vector2(49, 70),
        new Phaser.Math.Vector2(72, 70),
        new Phaser.Math.Vector2(75, 122),
        new Phaser.Math.Vector2(45, 122),
      ],
      true,
    );
    g.fillStyle(0x142b39, 0.8);
    g.fillRect(56, 71, 4, 52);
    g.fillRect(66, 71, 4, 52);
    g.lineStyle(3, PALETTE.ink, 0.27);
    g.beginPath();
    g.moveTo(43, 64);
    g.lineTo(78, 64);
    g.lineTo(82, 130);
    g.lineTo(39, 130);
    g.closePath();
    g.strokePath();

    g.lineStyle(8, 0x21394b, 1);
    g.lineBetween(43, 76, 29, 116);
    g.lineBetween(77, 76, 99, 42);
    g.lineStyle(4, PALETTE.ink, 0.24);
    g.lineBetween(43, 76, 29, 116);
    g.lineBetween(77, 76, 99, 42);
    g.fillStyle(0xd8ad8b, 1);
    g.fillEllipse(29, 117, 9, 11);
    g.fillEllipse(99, 42, 9, 11);

    g.fillStyle(0xd8ad8b, 1);
    g.fillEllipse(60, 43, 27, 33);
    g.lineStyle(3, PALETTE.ink, 0.22);
    g.strokeEllipse(60, 43, 27, 33);
    g.fillStyle(0x2a211c, 1);
    g.fillEllipse(60, 28, 31, 12);
    g.fillStyle(0x1b3445, 1);
    g.fillRoundedRect(39, 23, 42, 12, 3);
    g.fillStyle(0x102634, 1);
    g.fillRect(48, 14, 24, 11);
    g.fillStyle(0xd9c4a3, 0.95);
    g.fillRect(57, 16, 7, 7);
    g.lineStyle(2, PALETTE.ink, 0.3);
    g.strokeRoundedRect(39, 23, 42, 12, 3);

    g.fillStyle(0x102634, 1);
    g.fillRoundedRect(50, 44, 8, 3, 1);
    g.fillRoundedRect(63, 44, 8, 3, 1);
    g.lineStyle(2, 0x6b4432, 0.72);
    g.lineBetween(60, 48, 58, 55);
    g.lineStyle(2, 0x4e3428, 0.82);
    g.beginPath();
    g.arc(60, 57, 7, 0.18, Math.PI - 0.18);
    g.strokePath();

    g.lineStyle(4, 0x6d4b34, 0.95);
    g.lineBetween(96, 45, 112, 20);
    g.lineStyle(2, PALETTE.ink, 0.34);
    g.lineBetween(112, 20, 111, 43);
    g.fillStyle(0xe8c76a, 0.85);
    g.fillEllipse(111, 47, 8, 7);
    g.strokeCircle(111, 47, 5);
    g.generateTexture("captain-kid", 120, 190);
    g.destroy();
  }

  private createOceanTextures() {
    if (!this.textures.exists("map-island")) {
      const island = this.make.graphics({ x: 0, y: 0 }, false);
      island.fillStyle(PALETTE.warmCream, 1);
      island.fillEllipse(80, 82, 138, 70);
      island.fillStyle(PALETTE.butter, 0.5);
      island.fillEllipse(86, 88, 94, 28);
      island.fillStyle(PALETTE.moss, 1);
      island.fillCircle(48, 64, 24);
      island.fillCircle(76, 48, 34);
      island.fillCircle(112, 63, 28);
      island.fillStyle(PALETTE.mossDark, 0.58);
      island.fillCircle(70, 63, 18);
      island.fillCircle(103, 73, 16);
      island.lineStyle(4, PALETTE.ink, 0.18);
      island.strokeEllipse(80, 82, 138, 70);
      island.generateTexture("map-island", 160, 128);
      island.destroy();
    }

    if (!this.textures.exists("map-pier")) {
      const pier = this.make.graphics({ x: 0, y: 0 }, false);
      pier.fillStyle(PALETTE.driftwoodDark, 1);
      pier.fillRoundedRect(18, 70, 124, 26, 10);
      pier.fillStyle(PALETTE.driftwood, 1);
      for (let x = 26; x <= 130; x += 26) {
        pier.fillRect(x, 20, 14, 70);
      }
      pier.lineStyle(4, PALETTE.ink, 0.22);
      pier.strokeRoundedRect(18, 70, 124, 26, 10);
      pier.generateTexture("map-pier", 160, 120);
      pier.destroy();
    }

    if (!this.textures.exists("map-reef")) {
      const reef = this.make.graphics({ x: 0, y: 0 }, false);
      reef.fillStyle(PALETTE.coral, 1);
      reef.fillCircle(50, 72, 24);
      reef.fillStyle(PALETTE.butter, 1);
      reef.fillCircle(86, 55, 18);
      reef.fillStyle(PALETTE.seaGlass, 1);
      reef.fillCircle(112, 80, 26);
      reef.fillStyle(PALETTE.lavender, 1);
      reef.fillCircle(76, 94, 16);
      reef.lineStyle(4, PALETTE.ink, 0.18);
      reef.strokeCircle(50, 72, 24);
      reef.strokeCircle(112, 80, 26);
      reef.generateTexture("map-reef", 160, 128);
      reef.destroy();
    }

    for (const area of areas) {
      if (this.textures.exists(area.mapTexture)) {
        continue;
      }
      this.createAreaMapTexture(area.mapTexture, area.theme);
    }

    if (!this.textures.exists("sparkle-point")) {
      // 家紋 kamon-style fishing point marker
      const sparkle = this.make.graphics({ x: 0, y: 0 }, false);
      sparkle.fillStyle(PALETTE.butter, 0.90);
      sparkle.fillCircle(32, 32, 18);
      sparkle.lineStyle(2.5, PALETTE.ink, 0.28);
      sparkle.strokeCircle(32, 32, 18);
      sparkle.lineStyle(1.5, PALETTE.white, 0.62);
      sparkle.strokeCircle(32, 32, 12);
      sparkle.lineStyle(2, PALETTE.white, 0.82);
      sparkle.lineBetween(32, 17, 32, 47);
      sparkle.lineBetween(17, 32, 47, 32);
      sparkle.generateTexture("sparkle-point", 64, 64);
      sparkle.destroy();
    }
  }

  private createAreaMapTexture(key: string, theme: string) {
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    const hash = this.hashString(key);
    const body = this.colorFromHash(hash);
    const accent = this.colorFromHash(hash * 5 + 11);

    g.fillStyle(0x102f3f, 0.14);
    g.fillEllipse(80, 100, 128, 28);
    g.fillStyle(body, 0.95);

    if (theme === "mist") {
      g.fillEllipse(80, 78, 128, 54);
      g.fillStyle(0xffffff, 0.46);
      g.fillRoundedRect(22, 46, 116, 12, 6);
      g.fillRoundedRect(38, 72, 92, 11, 6);
    } else if (theme === "kelp") {
      g.fillEllipse(80, 86, 118, 42);
      g.lineStyle(8, accent, 0.82);
      for (let x = 34; x <= 126; x += 18) {
        g.beginPath();
        g.moveTo(x, 96);
        g.lineTo(x + Math.sin(x) * 10, 36);
        g.strokePath();
      }
    } else if (theme === "basalt" || theme === "storm") {
      g.fillTriangle(20, 96, 64, 32, 108, 96);
      g.fillTriangle(64, 100, 112, 26, 150, 100);
      g.fillStyle(accent, 0.9);
      g.fillEllipse(80, 102, 120, 18);
    } else if (theme === "pearl") {
      g.fillEllipse(80, 84, 132, 56);
      g.fillStyle(0xffffff, 0.76);
      g.fillCircle(72, 72, 18);
      g.fillCircle(104, 83, 12);
    } else if (theme === "moon" || theme === "aurora") {
      g.fillEllipse(80, 86, 118, 50);
      g.fillStyle(accent, 0.64);
      g.fillCircle(112, 48, 18);
      g.lineStyle(4, 0xffffff, 0.36);
      g.lineBetween(28, 78, 132, 61);
      g.lineBetween(34, 94, 126, 82);
    } else if (theme === "glacier") {
      g.fillTriangle(28, 98, 66, 34, 98, 98);
      g.fillTriangle(78, 100, 112, 42, 146, 100);
      g.fillStyle(0xffffff, 0.58);
      g.fillTriangle(66, 34, 76, 70, 50, 70);
    } else if (theme === "trench") {
      g.fillEllipse(80, 88, 126, 58);
      g.fillStyle(accent, 0.86);
      for (let i = 0; i < 7; i += 1) {
        g.fillCircle(36 + i * 15, 73 + (i % 3) * 8, 4);
      }
    } else {
      g.fillEllipse(80, 84, 132, 52);
      g.fillStyle(accent, 0.72);
      g.fillCircle(54, 70, 18);
      g.fillCircle(108, 82, 24);
    }

    g.lineStyle(4, PALETTE.ink, 0.2);
    g.strokeEllipse(80, 88, 130, 56);
    g.generateTexture(key, 160, 128);
    g.destroy();
  }

  private createUiIcons() {
    this.createShellIcon();
    this.createBaitIcon();
    this.createFramedIcon("icon-map", PALETTE.butter, (g) => {
      g.fillStyle(PALETTE.paper, 1);
      g.fillRoundedRect(18, 20, 30, 25, 5);
      g.lineStyle(2, PALETTE.ink, 0.28);
      g.strokeRoundedRect(18, 20, 30, 25, 5);
      g.lineBetween(28, 22, 28, 43);
      g.lineBetween(38, 22, 38, 43);
      g.fillStyle(PALETTE.coral, 1);
      g.fillCircle(41, 30, 4);
      g.lineStyle(3, PALETTE.ink, 0.5);
      g.lineBetween(24, 37, 32, 32);
      g.lineBetween(32, 32, 41, 30);
    });
    this.createFramedIcon("icon-collection", PALETTE.seaGlass, (g) => {
      g.fillStyle(PALETTE.paper, 1);
      g.fillRoundedRect(19, 18, 28, 31, 6);
      g.fillStyle(PALETTE.lavender, 0.85);
      g.fillRoundedRect(23, 22, 20, 23, 4);
      g.lineStyle(3, PALETTE.ink, 0.28);
      g.strokeRoundedRect(19, 18, 28, 31, 6);
      g.lineBetween(32, 20, 32, 47);
      this.fillStar(g, 33, 33, 10, 4, PALETTE.butter);
    });
    this.createFramedIcon("icon-shop", 0xf4a7ca, (g) => {
      g.fillStyle(PALETTE.paper, 1);
      g.fillEllipse(33, 38, 31, 20);
      g.fillStyle(PALETTE.butter, 0.95);
      g.fillCircle(44, 25, 8);
      g.lineStyle(3, PALETTE.ink, 0.25);
      g.strokeEllipse(33, 38, 31, 20);
      g.strokeCircle(44, 25, 8);
      for (let x = 25; x <= 41; x += 8) {
        g.lineBetween(33, 29, x, 45);
      }
    });
    this.createFramedIcon("icon-quest", PALETTE.coral, (g) => {
      g.fillStyle(PALETTE.paper, 1);
      g.fillRoundedRect(21, 18, 26, 31, 5);
      g.fillStyle(PALETTE.butter, 1);
      g.fillCircle(43, 20, 5);
      g.lineStyle(3, PALETTE.ink, 0.28);
      g.strokeRoundedRect(21, 18, 26, 31, 5);
      g.lineBetween(27, 29, 40, 29);
      g.lineBetween(27, 36, 38, 36);
      g.lineBetween(27, 43, 34, 43);
    });
    this.createFramedIcon("icon-rod", PALETTE.seaGlass, (g) => {
      g.lineStyle(5, PALETTE.driftwoodDark, 1);
      g.lineBetween(19, 46, 47, 17);
      g.lineStyle(2, PALETTE.ink, 0.35);
      g.lineBetween(46, 18, 46, 39);
      g.beginPath();
      g.arc(46, 43, 6, -0.65, Math.PI * 0.85);
      g.strokePath();
      g.fillStyle(PALETTE.coral, 1);
      g.fillCircle(25, 41, 5);
    });
    this.createFramedIcon("icon-repeat", PALETTE.lavender, (g) => {
      g.lineStyle(4, PALETTE.ink, 0.55);
      g.beginPath();
      g.arc(32, 32, 15, -0.3, Math.PI * 1.28);
      g.strokePath();
      g.fillStyle(PALETTE.coral, 1);
      g.fillTriangle(43, 17, 51, 20, 45, 27);
    });
    this.createFramedIcon("icon-harbor", PALETTE.seaFoam, (g) => {
      g.fillStyle(PALETTE.driftwood, 1);
      g.fillRoundedRect(18, 39, 30, 8, 4);
      g.fillStyle(PALETTE.warmCream, 1);
      g.fillRoundedRect(23, 25, 21, 18, 4);
      g.fillStyle(PALETTE.coral, 1);
      g.fillTriangle(20, 27, 34, 16, 48, 27);
      g.lineStyle(3, PALETTE.ink, 0.25);
      g.strokeRoundedRect(23, 25, 21, 18, 4);
      g.lineBetween(22, 47, 22, 53);
      g.lineBetween(43, 47, 43, 53);
    });
  }

  private createShellIcon() {
    if (this.textures.exists("icon-shell")) {
      return;
    }
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    g.fillStyle(PALETTE.warmCream, 1);
    g.fillEllipse(32, 37, 42, 31);
    g.fillStyle(PALETTE.butter, 0.85);
    g.fillTriangle(32, 14, 15, 38, 49, 38);
    g.lineStyle(3, PALETTE.ink, 0.26);
    g.strokeEllipse(32, 37, 42, 31);
    for (let x = 22; x <= 42; x += 10) {
      g.lineBetween(32, 16, x, 44);
    }
    g.generateTexture("icon-shell", 64, 64);
    g.destroy();
  }

  private createBaitIcon() {
    if (this.textures.exists("icon-bait")) {
      return;
    }
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    g.fillStyle(PALETTE.moss, 1);
    g.fillEllipse(30, 36, 38, 24);
    g.fillStyle(PALETTE.coral, 1);
    g.fillCircle(45, 28, 9);
    g.lineStyle(3, PALETTE.ink, 0.24);
    g.strokeEllipse(30, 36, 38, 24);
    g.strokeCircle(45, 28, 9);
    g.generateTexture("icon-bait", 64, 64);
    g.destroy();
  }

  private createFramedIcon(
    key: string,
    fill: number,
    draw: (graphics: Phaser.GameObjects.Graphics) => void,
  ) {
    if (this.textures.exists(key)) {
      return;
    }

    const g = this.make.graphics({ x: 0, y: 0 }, false);
    g.fillStyle(PALETTE.paper, 1);
    g.fillRoundedRect(10, 10, 44, 44, 13);
    g.fillStyle(fill, 1);
    g.fillCircle(32, 32, 16);
    g.lineStyle(3, PALETTE.ink, 0.24);
    g.strokeRoundedRect(10, 10, 44, 44, 13);
    draw(g);
    g.generateTexture(key, 64, 64);
    g.destroy();
  }

  private hashString(value: string) {
    let hash = 0;
    for (let i = 0; i < value.length; i += 1) {
      hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
    }
    return hash;
  }

  private colorFromHash(hash: number) {
    // Japanese nature illustration colour palette for generated creatures
    const palette = [
      PALETTE.seaGlass,   // jade-teal
      PALETTE.lagoon,     // deep indigo
      PALETTE.coral,      // vermilion
      PALETTE.coralDeep,  // deep vermilion
      PALETTE.butter,     // kinpaku gold
      PALETTE.lavender,   // fusuma grey-blue
      PALETTE.moss,       // hisui jade
      0x8bc8e8,           // sky blue
      0xe0a850,           // warm amber
      0x7ac0b8,           // sea-glass
      0xa0afd8,           // pale indigo
      PALETTE.warmCream,  // aged washi
    ];
    return palette[hash % palette.length];
  }

  private fillStar(
    g: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    outerRadius: number,
    innerRadius: number,
    fill: number,
  ) {
    const points: Phaser.Math.Vector2[] = [];
    for (let i = 0; i < 10; i += 1) {
      const angle = -Math.PI / 2 + i * (Math.PI / 5);
      const radius = i % 2 === 0 ? outerRadius : innerRadius;
      points.push(new Phaser.Math.Vector2(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius));
    }
    g.fillStyle(fill, 1);
    g.fillPoints(points, true);
  }
}

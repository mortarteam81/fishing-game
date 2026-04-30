import Phaser from "phaser";
import { PALETTE } from "../game/palette";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  create() {
    this.createFishTextures();
    this.createBoatTexture();
    this.createCharacterTexture();
    this.createOceanTextures();
    this.createUiIcons();
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
    if (this.textures.exists("boat")) {
      return;
    }
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    g.fillStyle(0xffffff, 0.25);
    g.fillEllipse(83, 78, 132, 20);
    g.fillStyle(PALETTE.driftwoodDark, 1);
    g.fillRoundedRect(12, 55, 136, 32, 16);
    g.fillStyle(PALETTE.driftwood, 1);
    g.fillRoundedRect(20, 50, 118, 24, 13);
    g.fillStyle(0xc9855d, 0.72);
    g.fillRoundedRect(31, 54, 82, 7, 4);
    g.fillStyle(PALETTE.warmCream, 1);
    g.fillTriangle(76, 8, 76, 52, 131, 54);
    g.fillStyle(PALETTE.butter, 0.76);
    g.fillTriangle(79, 17, 79, 49, 119, 50);
    g.fillStyle(PALETTE.coral, 1);
    g.fillTriangle(76, 10, 76, 24, 92, 17);
    g.lineStyle(5, PALETTE.ink, 0.24);
    g.lineBetween(76, 8, 76, 57);
    g.lineStyle(4, PALETTE.ink, 0.25);
    g.strokeRoundedRect(12, 55, 136, 32, 16);
    g.lineStyle(2, PALETTE.white, 0.55);
    g.lineBetween(83, 17, 123, 51);
    g.generateTexture("boat", 160, 96);
    g.destroy();
  }

  private createCharacterTexture() {
    if (this.textures.exists("captain-kid")) {
      return;
    }

    const g = this.make.graphics({ x: 0, y: 0 }, false);
    g.fillStyle(PALETTE.ink, 0.12);
    g.fillEllipse(60, 136, 64, 14);

    g.lineStyle(4, PALETTE.ink, 0.24);
    g.fillStyle(PALETTE.seaGlass, 1);
    g.fillRoundedRect(38, 72, 44, 48, 16);
    g.fillStyle(PALETTE.warmCream, 1);
    g.fillCircle(60, 47, 25);
    g.strokeCircle(60, 47, 25);

    g.fillStyle(PALETTE.driftwoodDark, 1);
    g.fillEllipse(60, 34, 45, 25);
    g.fillStyle(PALETTE.butter, 1);
    g.fillRoundedRect(34, 20, 52, 17, 9);
    g.fillStyle(PALETTE.coral, 1);
    g.fillTriangle(85, 21, 102, 28, 85, 35);

    g.fillStyle(PALETTE.coral, 1);
    g.fillRoundedRect(31, 77, 17, 15, 8);
    g.fillRoundedRect(72, 77, 17, 15, 8);
    g.fillStyle(PALETTE.warmCream, 1);
    g.fillCircle(48, 52, 5);
    g.fillCircle(72, 52, 5);
    g.fillStyle(PALETTE.ink, 1);
    g.fillCircle(49, 52, 2.5);
    g.fillCircle(73, 52, 2.5);
    g.lineStyle(3, PALETTE.coralDeep, 0.8);
    g.beginPath();
    g.arc(60, 58, 8, 0.08, Math.PI - 0.08);
    g.strokePath();

    g.lineStyle(5, PALETTE.driftwoodDark, 0.9);
    g.lineBetween(86, 76, 107, 42);
    g.lineStyle(3, PALETTE.ink, 0.3);
    g.lineBetween(107, 42, 105, 63);
    g.beginPath();
    g.arc(105, 67, 6, -0.6, Math.PI * 0.9);
    g.strokePath();

    g.lineStyle(5, PALETTE.inkSoft, 0.72);
    g.lineBetween(47, 118, 43, 133);
    g.lineBetween(73, 118, 77, 133);
    g.generateTexture("captain-kid", 120, 148);
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

    if (!this.textures.exists("sparkle-point")) {
      const sparkle = this.make.graphics({ x: 0, y: 0 }, false);
      sparkle.fillStyle(PALETTE.butter, 0.95);
      sparkle.fillCircle(32, 32, 15);
      sparkle.fillStyle(PALETTE.white, 0.9);
      sparkle.fillCircle(26, 26, 5);
      sparkle.lineStyle(3, PALETTE.white, 0.75);
      sparkle.lineBetween(32, 4, 32, 60);
      sparkle.lineBetween(4, 32, 60, 32);
      sparkle.generateTexture("sparkle-point", 64, 64);
      sparkle.destroy();
    }
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

import Phaser from "phaser";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  create() {
    this.createFishTextures();
    this.createBoatTexture();
    this.createOceanTextures();
    this.scene.start("Harbor");
  }

  private createFishTextures() {
    const fishStyles = [
      ["fish-sunny-minnow", 0xffcf56, 0xff8c42],
      ["fish-bubble-flounder", 0x84d2f6, 0x4ea5d9],
      ["fish-ribbon-squid", 0xf7a8d8, 0xbe6ed2],
      ["fish-harbor-mackerel", 0x5fb4d9, 0x2f6f9f],
      ["fish-shell-crab", 0xff8a65, 0xc8584c],
      ["fish-starfish-pal", 0xffd166, 0xf77f00],
      ["fish-coral-tang", 0x4ecdc4, 0x2f9f95],
      ["fish-pearl-turtle", 0x9ed8c8, 0x65a78c],
      ["fish-rainbow-whale", 0xb895ff, 0xff8ec7],
    ] as const;

    for (const [key, body, accent] of fishStyles) {
      const g = this.make.graphics({ x: 0, y: 0 }, false);
      g.fillStyle(body, 1);
      g.fillEllipse(48, 34, 72, 42);
      g.fillTriangle(15, 34, 0, 15, 0, 53);
      g.fillStyle(accent, 1);
      g.fillEllipse(58, 28, 18, 10);
      g.fillTriangle(78, 34, 95, 24, 95, 44);
      g.fillStyle(0xffffff, 1);
      g.fillCircle(68, 27, 6);
      g.fillStyle(0x143049, 1);
      g.fillCircle(70, 27, 3);
      g.lineStyle(3, 0x143049, 0.25);
      g.strokeEllipse(48, 34, 72, 42);
      g.generateTexture(key, 96, 68);
      g.destroy();
    }
  }

  private createBoatTexture() {
    const g = this.make.graphics({ x: 0, y: 0 }, false);
    g.fillStyle(0x8d5a3b, 1);
    g.fillRoundedRect(8, 52, 144, 34, 12);
    g.fillStyle(0xffd166, 1);
    g.fillTriangle(76, 8, 76, 52, 126, 52);
    g.lineStyle(5, 0x143049, 0.35);
    g.lineBetween(76, 8, 76, 55);
    g.lineStyle(4, 0x143049, 0.3);
    g.strokeRoundedRect(8, 52, 144, 34, 12);
    g.generateTexture("boat", 160, 96);
    g.destroy();
  }

  private createOceanTextures() {
    const island = this.make.graphics({ x: 0, y: 0 }, false);
    island.fillStyle(0xf7d77b, 1);
    island.fillEllipse(80, 82, 138, 70);
    island.fillStyle(0x61c38f, 1);
    island.fillCircle(48, 64, 24);
    island.fillCircle(76, 48, 34);
    island.fillCircle(112, 63, 28);
    island.lineStyle(4, 0x143049, 0.2);
    island.strokeEllipse(80, 82, 138, 70);
    island.generateTexture("map-island", 160, 128);
    island.destroy();

    const pier = this.make.graphics({ x: 0, y: 0 }, false);
    pier.fillStyle(0x8d5a3b, 1);
    pier.fillRoundedRect(18, 70, 124, 26, 10);
    pier.fillStyle(0xc47a45, 1);
    for (let x = 26; x <= 130; x += 26) {
      pier.fillRect(x, 20, 14, 70);
    }
    pier.lineStyle(4, 0x143049, 0.24);
    pier.strokeRoundedRect(18, 70, 124, 26, 10);
    pier.generateTexture("map-pier", 160, 120);
    pier.destroy();

    const reef = this.make.graphics({ x: 0, y: 0 }, false);
    reef.fillStyle(0xff8ec7, 1);
    reef.fillCircle(50, 72, 24);
    reef.fillStyle(0xffd166, 1);
    reef.fillCircle(86, 55, 18);
    reef.fillStyle(0x4ecdc4, 1);
    reef.fillCircle(112, 80, 26);
    reef.fillStyle(0xb895ff, 1);
    reef.fillCircle(76, 94, 16);
    reef.lineStyle(4, 0x143049, 0.2);
    reef.strokeCircle(50, 72, 24);
    reef.strokeCircle(112, 80, 26);
    reef.generateTexture("map-reef", 160, 128);
    reef.destroy();

    const sparkle = this.make.graphics({ x: 0, y: 0 }, false);
    sparkle.fillStyle(0xfff06a, 0.95);
    sparkle.fillCircle(32, 32, 15);
    sparkle.fillStyle(0xffffff, 0.9);
    sparkle.fillCircle(26, 26, 5);
    sparkle.lineStyle(3, 0xffffff, 0.75);
    sparkle.lineBetween(32, 4, 32, 60);
    sparkle.lineBetween(4, 32, 60, 32);
    sparkle.generateTexture("sparkle-point", 64, 64);
    sparkle.destroy();
  }
}

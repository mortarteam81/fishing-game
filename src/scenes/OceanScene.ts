import Phaser from "phaser";
import { getArea } from "../game/content";
import { playSoftTone } from "../game/audio";
import { loadGame } from "../game/storage";
import { addMuteButton, addTextButton } from "../game/ui";
import type { AreaDefinition, PlayerState } from "../game/types";

type Hotspot = {
  area: AreaDefinition;
  x: number;
  y: number;
  texture: string;
  label: string;
};

const WORLD_WIDTH = 1760;
const WORLD_HEIGHT = 1120;

const hotspots: Hotspot[] = [
  {
    area: getArea("sunny-beach")!,
    x: 430,
    y: 760,
    texture: "map-island",
    label: "잔잔한 햇살 해변",
  },
  {
    area: getArea("little-pier")!,
    x: 1060,
    y: 470,
    texture: "map-pier",
    label: "작은 방파제",
  },
  {
    area: getArea("coral-sea")!,
    x: 1410,
    y: 805,
    texture: "map-reef",
    label: "산호초 바다",
  },
];

export class OceanScene extends Phaser.Scene {
  private state!: PlayerState;
  private boat!: Phaser.GameObjects.Image;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys?: Record<string, Phaser.Input.Keyboard.Key>;
  private target?: Phaser.Math.Vector2;
  private wakeTimer = 0;
  private prompt?: Phaser.GameObjects.Container;
  private targetMarker?: Phaser.GameObjects.Container;
  private miniBoat?: Phaser.GameObjects.Triangle;
  private statusText?: Phaser.GameObjects.Text;
  private compassNeedle?: Phaser.GameObjects.Triangle;
  private nearby?: Hotspot;
  private shimmerLayers: Phaser.GameObjects.Graphics[] = [];
  private wakeCooldown = 0;

  constructor() {
    super("Ocean");
  }

  create() {
    this.state = loadGame();
    this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    this.cameras.main.setZoom(1);

    this.drawSea();
    this.addMapObjects();
    this.addBoat();
    this.addHud();
    this.addTouchControls();
    this.setupInput();
  }

  update(_: number, delta: number) {
    this.animateSea(delta);
    this.moveBoat(delta);
    this.updateNearbyPrompt();
  }

  private drawSea() {
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x8fe5ff, 0x8fe5ff, 0x5bd5c8, 0x49bad9, 1);
    bg.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
    bg.fillStyle(0xffe08a, 1);
    bg.fillCircle(1460, 150, 64);

    this.addSeaLife();

    for (let layer = 0; layer < 3; layer += 1) {
      const waves = this.add.graphics();
      waves.setDepth(layer);
      this.shimmerLayers.push(waves);
    }
  }

  private addSeaLife() {
    for (const point of [
      [610, 730, "fish-sunny-minnow", 0.55],
      [940, 790, "fish-ribbon-squid", 0.5],
      [1260, 610, "fish-coral-tang", 0.52],
      [1520, 360, "fish-starfish-pal", 0.44],
    ] as const) {
      const friend = this.add.image(point[0], point[1], point[2]).setScale(point[3]).setDepth(4).setAlpha(0.55);
      this.tweens.add({
        targets: friend,
        x: friend.x + 26,
        y: friend.y - 12,
        duration: 2200 + point[0],
        yoyo: true,
        repeat: -1,
        ease: "Sine.inOut",
      });
    }

    for (const point of [
      [320, 520],
      [760, 390],
      [1190, 950],
      [1580, 690],
    ] as const) {
      const buoy = this.add.graphics().setDepth(5);
      buoy.fillStyle(0xff5d73, 1);
      buoy.fillCircle(point[0], point[1], 15);
      buoy.fillStyle(0xffffff, 1);
      buoy.fillRect(point[0] - 13, point[1] - 4, 26, 8);
      buoy.lineStyle(3, 0x143049, 0.25);
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
  }

  private animateSea(delta: number) {
    this.wakeTimer += delta;
    this.shimmerLayers.forEach((graphics, layer) => {
      graphics.clear();
      graphics.lineStyle(3 - layer * 0.5, 0xffffff, 0.28 - layer * 0.05);
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
    for (const hotspot of hotspots) {
      const unlocked = this.state.unlockedAreaIds.includes(hotspot.area.id);
      const object = this.add.image(hotspot.x, hotspot.y, hotspot.texture).setDepth(5).setAlpha(unlocked ? 1 : 0.48);
      const glow = this.add.image(hotspot.x, hotspot.y - 74, "sparkle-point").setDepth(6).setScale(0.9);
      glow.setAlpha(unlocked ? 0.95 : 0.24);
      this.tweens.add({
        targets: glow,
        scale: unlocked ? 1.15 : 0.92,
        alpha: unlocked ? 0.45 : 0.18,
        duration: 900,
        yoyo: true,
        repeat: -1,
        ease: "Sine.inOut",
      });

      this.add
        .text(hotspot.x, hotspot.y + 92, unlocked ? hotspot.label : `Lv.${hotspot.area.requiredLevel} 열림`, {
          fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
          fontSize: "22px",
          fontStyle: "900",
          color: unlocked ? "#143049" : "#607382",
          backgroundColor: unlocked ? "rgba(255,255,255,0.68)" : "rgba(255,255,255,0.45)",
          padding: { x: 12, y: 7 },
        })
        .setOrigin(0.5)
        .setDepth(7);

      object.setInteractive({ useHandCursor: true });
      object.on("pointerdown", () => {
        this.setSailTarget(hotspot.x, hotspot.y - 92);
      });
    }

    this.addDecorativeSailRoutes();
  }

  private addDecorativeSailRoutes() {
    const route = this.add.graphics().setDepth(2);
    route.lineStyle(4, 0xffffff, 0.26);
    route.beginPath();
    route.moveTo(220, 820);
    route.lineTo(430, 690);
    route.lineTo(820, 580);
    route.lineTo(1060, 380);
    route.lineTo(1250, 620);
    route.lineTo(1410, 700);
    route.strokePath();

    for (const point of [
      [250, 310],
      [680, 210],
      [1260, 270],
      [1540, 980],
      [800, 950],
    ] as const) {
      const cloud = this.add.graphics().setDepth(3);
      cloud.fillStyle(0xffffff, 0.32);
      cloud.fillCircle(point[0], point[1], 28);
      cloud.fillCircle(point[0] + 28, point[1] - 8, 22);
      cloud.fillCircle(point[0] + 52, point[1], 24);
    }
  }

  private addBoat() {
    this.boat = this.add.image(230, 850, "boat").setScale(1.03).setDepth(12);
    this.cameras.main.startFollow(this.boat, true, 0.08, 0.08);
    this.tweens.add({
      targets: this.boat,
      scaleY: 1.09,
      duration: 1100,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut",
    });
  }

  private addHud() {
    const fixed = this.add.container(0, 0).setScrollFactor(0).setDepth(50);
    fixed.add(
      this.add
        .rectangle(480, 38, 900, 62, 0xffffff, 0.72)
        .setStrokeStyle(3, 0x143049, 0.9),
    );
    fixed.add(
      this.add
        .text(44, 38, "바다 지도", {
          fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
          fontSize: "30px",
          fontStyle: "900",
          color: "#143049",
        })
        .setOrigin(0, 0.5),
    );
    fixed.add(
      this.add
        .text(322, 38, "클릭/터치한 곳으로 항해 · 방향키/WASD도 가능", {
          fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
          fontSize: "20px",
          fontStyle: "800",
          color: "#315a73",
        })
        .setOrigin(0, 0.5),
    );
    fixed.add(
      this.add
        .text(910, 38, `조개 ${this.state.shells} · Lv.${this.state.level}`, {
          fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
          fontSize: "21px",
          fontStyle: "900",
          color: "#143049",
        })
        .setOrigin(1, 0.5),
    );

    fixed.add(this.createCompass(190, 38));
    fixed.add(this.createMiniMap(824, 392));

    addTextButton(this, 84, 500, "항구", () => this.scene.start("Harbor"), {
      width: 120,
      height: 44,
      fontSize: 18,
      fill: 0xd7f6ff,
    }).setScrollFactor(0).setDepth(60);
    addMuteButton(this, 880, 500).setScrollFactor(0).setDepth(60);
  }

  private createCompass(x: number, y: number) {
    const compass = this.add.container(x, y);
    compass.add(this.add.circle(0, 0, 22, 0xfffbdf, 0.92).setStrokeStyle(3, 0x143049, 0.85));
    compass.add(
      this.add
        .text(0, -1, "N", {
          fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
          fontSize: "12px",
          fontStyle: "900",
          color: "#143049",
        })
        .setOrigin(0.5),
    );
    this.compassNeedle = this.add.triangle(0, 0, 0, -17, -7, 7, 7, 7, 0xff5d73, 1).setStrokeStyle(2, 0x143049, 0.55);
    compass.add(this.compassNeedle);
    return compass;
  }

  private createMiniMap(x: number, y: number) {
    const map = this.add.container(x, y);
    map.add(this.add.rectangle(0, 0, 170, 102, 0xffffff, 0.72).setStrokeStyle(3, 0x143049, 0.85));
    map.add(
      this.add
        .text(-74, -38, "작은 지도", {
          fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
          fontSize: "14px",
          fontStyle: "900",
          color: "#143049",
        })
        .setOrigin(0, 0.5),
    );

    for (const hotspot of hotspots) {
      const unlocked = this.state.unlockedAreaIds.includes(hotspot.area.id);
      const dot = this.add.circle(
        -72 + (hotspot.x / WORLD_WIDTH) * 144,
        -28 + (hotspot.y / WORLD_HEIGHT) * 70,
        unlocked ? 5 : 4,
        unlocked ? 0xffd166 : 0x91a4ad,
        1,
      );
      dot.setStrokeStyle(2, 0x143049, 0.35);
      map.add(dot);
    }

    this.miniBoat = this.add.triangle(-72, 22, 0, -7, -7, 7, 7, 7, 0x49bad9, 1).setStrokeStyle(2, 0x143049, 0.55);
    map.add(this.miniBoat);
    this.statusText = this.add
      .text(-74, 38, "반짝 포인트를 찾아요", {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "13px",
        fontStyle: "800",
        color: "#315a73",
      })
      .setOrigin(0, 0.5);
    map.add(this.statusText);
    return map;
  }

  private addTouchControls() {
    const controls = this.add.container(250, 448).setScrollFactor(0).setDepth(62).setAlpha(0.72);
    controls.add(this.add.circle(0, 0, 58, 0xffffff, 0.48).setStrokeStyle(3, 0x143049, 0.45));
    const controlsText = this.add
      .text(0, 0, "터치\n항해", {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "16px",
        fontStyle: "900",
        color: "#143049",
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
    const speed = 0.23 * delta;
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
    const targetRotation = Phaser.Math.Angle.Between(0, 0, direction.x, direction.y) * 0.25;
    this.boat.rotation = Phaser.Math.Angle.RotateTo(this.boat.rotation, targetRotation, 0.045);
    this.boat.setFlipX(direction.x < -0.1);
  }

  private addWake(delta: number) {
    this.wakeCooldown -= delta;
    if (this.wakeCooldown > 0) {
      return;
    }
    this.wakeCooldown = 110;
    const wake = this.add.circle(this.boat.x - 24, this.boat.y + 22, 10, 0xffffff, 0.38).setDepth(9);
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
    const ring = this.add.circle(0, 0, 30, 0xffd166, 0.15).setStrokeStyle(4, 0xffd166, 0.88);
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
    const unlocked = hotspots.filter((hotspot) => this.state.unlockedAreaIds.includes(hotspot.area.id));
    const closest = unlocked.find((hotspot) => Phaser.Math.Distance.Between(this.boat.x, this.boat.y, hotspot.x, hotspot.y) < 170);
    if (closest?.area.id === this.nearby?.area.id) {
      return;
    }

    this.prompt?.destroy();
    this.prompt = undefined;
    this.nearby = closest;

    if (!closest) {
      this.statusText?.setText("반짝 포인트를 찾아요");
      return;
    }

    this.statusText?.setText(`${closest.area.name} 발견!`);
    playSoftTone(this, this.state, 640, 0.06);
    const panel = this.add.rectangle(0, 0, 438, 88, 0xffffff, 0.86).setStrokeStyle(4, 0x143049);
    const text = this.add
      .text(-200, -18, `${closest.area.name} 근처예요`, {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "23px",
        fontStyle: "900",
        color: "#143049",
      })
      .setOrigin(0, 0.5);
    const hint = this.add
      .text(-200, 20, "반짝 포인트에서 낚시해볼까요?", {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "17px",
        fontStyle: "800",
        color: "#315a73",
      })
      .setOrigin(0, 0.5);
    const button = addTextButton(this, 140, 0, "낚시", () => this.scene.start("Fishing", { areaId: closest.area.id }), {
      width: 104,
      height: 48,
      fontSize: 19,
      fill: 0xffd166,
    });
    this.prompt = this.add.container(480, 112, [panel, text, hint, button]).setScrollFactor(0).setDepth(70);
    this.prompt.setSize(438, 88);
    this.prompt.setInteractive({ useHandCursor: true });
    this.prompt.on("pointerdown", () => this.scene.start("Fishing", { areaId: closest.area.id }));
  }
}

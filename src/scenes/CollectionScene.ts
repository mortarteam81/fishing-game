import Phaser from "phaser";
import { areas, fish } from "../game/content";
import { ensureSvgTextures, fishTexture } from "../game/lazyTextures";
import { PALETTE, TEXT } from "../game/palette";
import {
  getNextResearchTarget,
  getResearchCompletionRatio,
  getResearchMeta,
  getResearchRank,
  mutationMeta,
} from "../game/research";
import { loadGame } from "../game/storage";
import { addHeader, addMuteButton, addOceanBackground, addTextButton } from "../game/ui";
import type {
  CatchMutationId,
  FishDefinition,
  PlayerState,
  Rarity,
  SeaFriendBehavior,
  SeaFriendFamily,
  SeaFriendSize,
} from "../game/types";

type RarityCardMeta = {
  label: string;
  short: string;
  pips: number;
  surface: number;
  fill: number;
  stroke: number;
  glow: number;
};

const rarityLabel: Record<Rarity, string> = {
  common: "흔히 만나요",
  uncommon: "가끔 만나요",
  rare: "희귀한 만남",
  epic: "영웅 소문",
  mythic: "환상 소문",
  legendary: "전설 소문",
  ancient: "고대 전설",
};

const rarityMeta: Record<Rarity, RarityCardMeta> = {
  common: {
    label: rarityLabel.common,
    short: "흔함",
    pips: 1,
    surface: 0xf7fff7,
    fill: 0x69b985,
    stroke: 0x4f9f76,
    glow: 0xbdeedc,
  },
  uncommon: {
    label: rarityLabel.uncommon,
    short: "가끔",
    pips: 2,
    surface: 0xf0fff6,
    fill: 0x46bcc8,
    stroke: 0x2f91a5,
    glow: 0x9de8dc,
  },
  rare: {
    label: rarityLabel.rare,
    short: "희귀",
    pips: 3,
    surface: 0xebf8ff,
    fill: 0x4c9fd6,
    stroke: 0x315a73,
    glow: 0x9de8ff,
  },
  epic: {
    label: rarityLabel.epic,
    short: "영웅",
    pips: 4,
    surface: 0xffedf1,
    fill: 0xe56f76,
    stroke: 0xb84f67,
    glow: 0xffc2d1,
  },
  mythic: {
    label: rarityLabel.mythic,
    short: "환상",
    pips: 5,
    surface: 0xf4efff,
    fill: 0x8f75e8,
    stroke: 0x6b55b8,
    glow: 0xb9c3ff,
  },
  legendary: {
    label: rarityLabel.legendary,
    short: "전설",
    pips: 6,
    surface: 0xfff4cf,
    fill: 0xf0ad3d,
    stroke: 0x9b6749,
    glow: 0xf6cf62,
  },
  ancient: {
    label: rarityLabel.ancient,
    short: "고대",
    pips: 7,
    surface: 0xefe8db,
    fill: 0x18364a,
    stroke: 0x704632,
    glow: 0xf6cf62,
  },
};

const familyLabel: Record<SeaFriendFamily, string> = {
  fish: "어류",
  crustacean: "갑각류",
  mollusk: "연체류",
  jelly: "해파리류",
  whale: "고래류",
  reptile: "바다파충류",
  echinoderm: "극피류",
  deep: "심해류",
  spirit: "정령류",
};

const sizeLabel: Record<SeaFriendSize, string> = {
  tiny: "초소형",
  small: "소형",
  medium: "중형",
  large: "대형",
  giant: "거대",
};

const behaviorLabel: Record<SeaFriendBehavior, string> = {
  swift: "빠름",
  shy: "수줍음",
  steady: "차분함",
  heavy: "묵직함",
  drifting: "유영",
  nocturnal: "야행성",
  erratic: "변칙",
  glowing: "발광",
  ancient: "고대종",
};

const PAGE_SIZE = 8;
const CARD_WIDTH = 204;
const CARD_HEIGHT = 158;
const CARD_X_START = 132;
const CARD_X_GAP = 232;
const CARD_Y_START = 174;
const CARD_Y_GAP = 174;
const areaNameById = new Map(areas.map((area) => [area.id, area.name]));

export class CollectionScene extends Phaser.Scene {
  private state!: PlayerState;
  private page = 0;
  private detailLayer?: Phaser.GameObjects.Container;

  constructor() {
    super("Collection");
  }

  init(data: { page?: number }) {
    const maxPage = Math.max(0, Math.ceil(fish.length / PAGE_SIZE) - 1);
    this.page = Phaser.Math.Clamp(data.page ?? 0, 0, maxPage);
  }

  create() {
    this.state = loadGame();
    addOceanBackground(this, "pearl");
    this.addCollectionBackdrop();
    addHeader(this, "바다 친구 도감", this.state);
    addMuteButton(this);

    const pageFish = fish.slice(this.page * PAGE_SIZE, this.page * PAGE_SIZE + PAGE_SIZE);
    const maxPage = Math.max(0, Math.ceil(fish.length / PAGE_SIZE) - 1);
    const discovered = fish.filter((entry) => (this.state.collection[entry.id] ?? 0) > 0).length;
    const completion = Math.round((discovered / fish.length) * 100);
    const researchDone = fish.filter((entry) => getResearchRank(this.state.researchProgress[entry.id]?.points ?? 0) >= 4).length;

    this.addProgressSummary(discovered, completion, researchDone);

    const loadingText = this.add
      .text(480, 286, "도감 그림을 준비하는 중...", {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "21px",
        fontStyle: "900",
        color: TEXT.primary,
        backgroundColor: "rgba(255,251,239,0.76)",
        padding: { x: 14, y: 7 },
      })
      .setOrigin(0.5)
      .setDepth(20);

    void this.renderCollectionPage(pageFish, maxPage, loadingText);

    addTextButton(this, 92, 500, "항구", () => this.scene.start("Harbor"), {
      width: 120,
      height: 44,
      fontSize: 18,
      fill: PALETTE.seaFoam,
      iconKey: "icon-harbor",
      iconScale: 0.34,
    });
  }

  private addCollectionBackdrop() {
    const graphics = this.add.graphics().setDepth(0);
    graphics.fillStyle(PALETTE.white, 0.11);
    graphics.fillRoundedRect(30, 92, 900, 350, 18);
    graphics.lineStyle(2, PALETTE.white, 0.28);
    graphics.strokeRoundedRect(30, 92, 900, 350, 18);

    for (let i = 0; i < 7; i += 1) {
      const x = 70 + i * 138;
      graphics.lineStyle(2, i % 2 === 0 ? PALETTE.seaGlass : PALETTE.coral, 0.12);
      graphics.beginPath();
      graphics.moveTo(x, 106);
      graphics.lineTo(x + 38, 432);
      graphics.strokePath();
    }
  }

  private addProgressSummary(discovered: number, completion: number, researchDone: number) {
    const x = 480;
    const y = 70;
    const width = 482;
    const graphics = this.add.graphics();
    graphics.fillStyle(0x18364a, 0.18);
    graphics.fillRoundedRect(x - width / 2 + 4, y - 20 + 5, width, 44, 18);
    graphics.fillStyle(PALETTE.paper, 0.92);
    graphics.fillRoundedRect(x - width / 2, y - 20, width, 44, 18);
    graphics.lineStyle(3, PALETTE.ink, 0.72);
    graphics.strokeRoundedRect(x - width / 2, y - 20, width, 44, 18);
    graphics.fillStyle(0xd9eef0, 1);
    graphics.fillRoundedRect(x - 32, y + 3, 188, 10, 5);
    graphics.fillStyle(PALETTE.coral, 1);
    graphics.fillRoundedRect(x - 32, y + 3, Math.max(12, 188 * (completion / 100)), 10, 5);

    this.add
      .text(x - 216, y - 3, "컬렉션 앨범", {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "13px",
        fontStyle: "900",
        color: TEXT.secondary,
      })
      .setOrigin(0, 0.5);
    this.add
      .text(x - 216, y + 12, `${discovered}/${fish.length}장 · 연구 완료 ${researchDone}종`, {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "18px",
        fontStyle: "900",
        color: TEXT.primary,
      })
      .setOrigin(0, 0.5);
    this.add
      .text(x + 172, y + 7, `${completion}%`, {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "20px",
        fontStyle: "900",
        color: TEXT.primary,
      })
      .setOrigin(0, 0.5);
  }

  private async renderCollectionPage(
    pageFish: FishDefinition[],
    maxPage: number,
    loadingText: Phaser.GameObjects.Text,
  ) {
    await ensureSvgTextures(this, pageFish.flatMap(fishTexture));
    loadingText.destroy();

    pageFish.forEach((entry, index) => {
      this.renderCard(entry, this.page * PAGE_SIZE + index + 1, index);
    });

    this.add
      .text(480, 500, `${this.page + 1} / ${maxPage + 1}`, {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "18px",
        fontStyle: "900",
        color: TEXT.primary,
        backgroundColor: "rgba(255,251,239,0.72)",
        padding: { x: 14, y: 5 },
      })
      .setOrigin(0.5);

    addTextButton(this, 365, 500, "이전", () => this.scene.restart({ page: this.page - 1 }), {
      width: 112,
      height: 44,
      fontSize: 18,
      fill: PALETTE.seaFoam,
      disabled: this.page <= 0,
    });

    addTextButton(this, 595, 500, "다음", () => this.scene.restart({ page: this.page + 1 }), {
      width: 112,
      height: 44,
      fontSize: 18,
      fill: PALETTE.butter,
      disabled: this.page >= maxPage,
    });
  }

  private renderCard(entry: FishDefinition, cardNumber: number, index: number) {
    const col = index % 4;
    const row = Math.floor(index / 4);
    const x = CARD_X_START + col * CARD_X_GAP;
    const y = CARD_Y_START + row * CARD_Y_GAP;
    const count = this.state.collection[entry.id] ?? 0;
    const discovered = count > 0;
    const meta = rarityMeta[entry.rarity];
    const container = this.add.container(x, y).setDepth(2);
    const graphics = this.add.graphics();

    this.drawCardShell(graphics, meta, discovered);
    container.add(graphics);

    this.addRarityBand(container, meta, cardNumber, discovered);
    this.addCreaturePortrait(container, entry, meta, discovered);
    this.addCardText(container, entry, meta, count, discovered);

    container.setInteractive(
      new Phaser.Geom.Rectangle(-CARD_WIDTH / 2, -CARD_HEIGHT / 2, CARD_WIDTH, CARD_HEIGHT),
      Phaser.Geom.Rectangle.Contains,
    );
    container.on("pointerover", () => {
      this.tweens.add({ targets: container, scale: 1.025, duration: 100, ease: "Sine.easeOut" });
    });
    container.on("pointerout", () => {
      this.tweens.add({ targets: container, scale: 1, duration: 100, ease: "Sine.easeOut" });
    });
    container.on("pointerdown", () => this.showCardDetail(entry, cardNumber, count));
  }

  private drawCardShell(graphics: Phaser.GameObjects.Graphics, meta: RarityCardMeta, discovered: boolean) {
    const fill = discovered ? meta.surface : 0xd9e6ec;
    const stroke = discovered ? meta.stroke : 0x7f96a5;

    graphics.fillStyle(0x18364a, 0.18);
    graphics.fillRoundedRect(-CARD_WIDTH / 2 + 5, -CARD_HEIGHT / 2 + 7, CARD_WIDTH, CARD_HEIGHT, 13);
    graphics.fillStyle(fill, discovered ? 0.98 : 0.88);
    graphics.fillRoundedRect(-CARD_WIDTH / 2, -CARD_HEIGHT / 2, CARD_WIDTH, CARD_HEIGHT, 13);
    graphics.lineStyle(5, stroke, discovered ? 0.92 : 0.48);
    graphics.strokeRoundedRect(-CARD_WIDTH / 2, -CARD_HEIGHT / 2, CARD_WIDTH, CARD_HEIGHT, 13);
    graphics.lineStyle(2, PALETTE.white, discovered ? 0.78 : 0.24);
    graphics.strokeRoundedRect(-CARD_WIDTH / 2 + 7, -CARD_HEIGHT / 2 + 7, CARD_WIDTH - 14, CARD_HEIGHT - 14, 9);

    if (discovered && meta.pips >= 4) {
      graphics.lineStyle(1.4, PALETTE.white, meta.pips >= 6 ? 0.22 : 0.15);
      for (let i = -170; i < 190; i += 30) {
        graphics.beginPath();
        graphics.moveTo(i, -70);
        graphics.lineTo(i + 58, 72);
        graphics.strokePath();
      }
      graphics.fillStyle(meta.glow, 0.22);
      graphics.fillCircle(70, -42, 24);
      graphics.fillCircle(-74, 46, 16);
    }
  }

  private addRarityBand(
    container: Phaser.GameObjects.Container,
    meta: RarityCardMeta,
    cardNumber: number,
    discovered: boolean,
  ) {
    const band = this.add.graphics();
    band.fillStyle(discovered ? meta.fill : 0x8ea4b0, 0.96);
    band.fillRoundedRect(-CARD_WIDTH / 2 + 7, -CARD_HEIGHT / 2 + 7, CARD_WIDTH - 14, 28, 9);
    band.fillStyle(PALETTE.white, 0.22);
    band.fillRoundedRect(-CARD_WIDTH / 2 + 14, -CARD_HEIGHT / 2 + 12, CARD_WIDTH - 28, 5, 3);
    this.drawRarityPips(band, 33, -CARD_HEIGHT / 2 + 22, meta, discovered);
    container.add(band);

    container.add(
      this.add
        .text(-84, -64, `No.${cardNumber.toString().padStart(3, "0")}`, {
          fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
          fontSize: "12px",
          fontStyle: "900",
          color: "#ffffff",
        })
        .setOrigin(0, 0.5),
    );
    container.add(
      this.add
        .text(84, -64, discovered ? meta.short : "미확인", {
          fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
          fontSize: "12px",
          fontStyle: "900",
          color: "#ffffff",
          fixedWidth: 58,
          align: "right",
        })
        .setOrigin(1, 0.5),
    );
  }

  private addCreaturePortrait(
    container: Phaser.GameObjects.Container,
    entry: FishDefinition,
    meta: RarityCardMeta,
    discovered: boolean,
  ) {
    const frame = this.add.graphics();
    frame.fillStyle(PALETTE.white, discovered ? 0.72 : 0.3);
    frame.fillEllipse(0, -27, 100, 70);
    frame.lineStyle(2, discovered ? meta.glow : 0xffffff, discovered ? 0.75 : 0.28);
    frame.strokeEllipse(0, -27, 100, 70);
    frame.fillStyle(meta.glow, discovered ? 0.16 : 0.06);
    frame.fillEllipse(0, -27, 76, 48);
    container.add(frame);

    const scale = entry.size === "giant" ? 0.5 : entry.size === "large" ? 0.58 : 0.66;
    const portrait = this.add.image(0, -29, entry.assetKey).setScale(scale).setAlpha(discovered ? 1 : 0.16);
    if (!discovered) {
      portrait.setTint(0x315a73);
    }
    container.add(portrait);

    if (!discovered) {
      container.add(
        this.add
          .text(0, -27, "?", {
            fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
            fontSize: "34px",
            fontStyle: "900",
            color: "#315a73",
          })
          .setOrigin(0.5)
          .setAlpha(0.72),
      );
    }
  }

  private addCardText(
    container: Phaser.GameObjects.Container,
    entry: FishDefinition,
    meta: RarityCardMeta,
    count: number,
    discovered: boolean,
  ) {
    const name = discovered ? entry.name : "미확인 카드";
    const research = this.state.researchProgress[entry.id];
    const researchPoints = discovered ? research?.points ?? 1 : 0;
    const researchMeta = getResearchMeta(researchPoints);
    const variants = this.state.variantCollection[entry.id] ?? {};
    const nameSize = name.length > 10 ? "13px" : name.length > 7 ? "14px" : "16px";
    container.add(
      this.add
        .text(0, 20, name, {
          fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
          fontSize: nameSize,
          fontStyle: "900",
          color: discovered ? TEXT.primary : TEXT.disabled,
          fixedWidth: CARD_WIDTH - 28,
          align: "center",
          wordWrap: { width: CARD_WIDTH - 34 },
        })
        .setOrigin(0.5),
    );

    container.add(
      this.add
        .text(0, 45, discovered ? `${familyLabel[entry.family]} · ${rarityLabel[entry.rarity]}` : this.getAreaHint(entry), {
          fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
          fontSize: "12px",
          fontStyle: "800",
          color: discovered ? TEXT.secondary : TEXT.disabled,
          fixedWidth: CARD_WIDTH - 30,
          align: "center",
        })
        .setOrigin(0.5),
    );

    if (discovered) {
      this.addChip(container, -62, 66, `${count}회`, PALETTE.white, TEXT.primary, 52);
      this.addChip(container, 2, 66, researchMeta.short, meta.glow, TEXT.primary, 70);
      this.addMutationPips(container, 72, 66, variants);
      this.addResearchStrip(container, researchPoints, meta.glow);
      return;
    }

    this.addChip(container, -38, 66, "힌트", PALETTE.white, TEXT.disabled, 52);
    this.addChip(container, 38, 66, "탐사 필요", 0xc6d5dd, TEXT.disabled, 76);
  }

  private addMutationPips(
    container: Phaser.GameObjects.Container,
    x: number,
    y: number,
    variants: Record<string, number | undefined>,
  ) {
    const graphics = this.add.graphics();
    graphics.fillStyle(PALETTE.white, 0.62);
    graphics.fillRoundedRect(x - 28, y - 10, 56, 20, 10);
    graphics.lineStyle(1.5, PALETTE.ink, 0.18);
    graphics.strokeRoundedRect(x - 28, y - 10, 56, 20, 10);

    Object.entries(mutationMeta).forEach(([mutationId, meta], index) => {
      const collected = (variants[mutationId] ?? 0) > 0;
      graphics.fillStyle(collected ? meta.tint : 0xc6d5dd, collected ? 1 : 0.78);
      graphics.fillCircle(x - 14 + index * 14, y, 4.2);
      graphics.lineStyle(1.2, PALETTE.ink, collected ? 0.32 : 0.16);
      graphics.strokeCircle(x - 14 + index * 14, y, 4.2);
    });

    container.add(graphics);
  }

  private addResearchStrip(container: Phaser.GameObjects.Container, points: number, fill: number) {
    const width = CARD_WIDTH - 38;
    const graphics = this.add.graphics();
    graphics.fillStyle(0x18364a, 0.1);
    graphics.fillRoundedRect(-width / 2, 75, width, 5, 3);
    graphics.fillStyle(fill, 0.95);
    graphics.fillRoundedRect(-width / 2, 75, Math.max(8, width * getResearchCompletionRatio(points)), 5, 3);
    container.add(graphics);
  }

  private addChip(
    container: Phaser.GameObjects.Container,
    x: number,
    y: number,
    label: string,
    fill: number,
    color: string,
    width: number,
  ) {
    const chip = this.add.graphics();
    chip.fillStyle(fill, 0.9);
    chip.fillRoundedRect(x - width / 2, y - 10, width, 20, 10);
    chip.lineStyle(1.5, PALETTE.ink, 0.2);
    chip.strokeRoundedRect(x - width / 2, y - 10, width, 20, 10);
    container.add(chip);
    container.add(
      this.add
        .text(x, y + 1, label, {
          fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
          fontSize: "11px",
          fontStyle: "900",
          color,
          fixedWidth: width - 8,
          align: "center",
        })
        .setOrigin(0.5),
    );
  }

  private drawRarityPips(
    graphics: Phaser.GameObjects.Graphics,
    x: number,
    y: number,
    meta: RarityCardMeta,
    discovered: boolean,
  ) {
    for (let i = 0; i < 7; i += 1) {
      graphics.fillStyle(i < meta.pips && discovered ? PALETTE.white : 0xffffff, i < meta.pips && discovered ? 0.96 : 0.22);
      graphics.fillCircle(x + i * 7, y, 2.25);
    }
  }

  private showCardDetail(entry: FishDefinition, cardNumber: number, count: number) {
    this.detailLayer?.destroy(true);

    const discovered = count > 0;
    const meta = rarityMeta[entry.rarity];
    const research = this.state.researchProgress[entry.id];
    const researchPoints = discovered ? research?.points ?? 1 : 0;
    const researchMeta = getResearchMeta(researchPoints);
    const nextResearchTarget = getNextResearchTarget(researchPoints);
    const variantLine = this.variantDetailLine(entry.id);
    const layer = this.add.container(0, 0).setDepth(80);
    this.detailLayer = layer;

    const backdrop = this.add.rectangle(480, 270, 960, 540, 0x102340, 0.46).setInteractive();
    backdrop.on("pointerdown", () => this.closeDetail());
    layer.add(backdrop);

    const panel = this.add.graphics();
    panel.fillStyle(0x18364a, 0.24);
    panel.fillRoundedRect(182, 104, 606, 356, 20);
    panel.fillStyle(discovered ? meta.surface : 0xe1edf2, 0.98);
    panel.fillRoundedRect(170, 92, 606, 356, 20);
    panel.lineStyle(5, discovered ? meta.stroke : 0x7f96a5, discovered ? 0.92 : 0.62);
    panel.strokeRoundedRect(170, 92, 606, 356, 20);
    panel.fillStyle(discovered ? meta.fill : 0x8ea4b0, 0.98);
    panel.fillRoundedRect(170, 92, 606, 48, 20);
    panel.fillStyle(PALETTE.white, 0.22);
    panel.fillRoundedRect(194, 104, 558, 7, 4);
    layer.add(panel);

    layer.add(
      this.add
        .text(204, 117, `No.${cardNumber.toString().padStart(3, "0")}`, {
          fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
          fontSize: "16px",
          fontStyle: "900",
          color: "#ffffff",
        })
        .setOrigin(0, 0.5),
    );
    layer.add(
      this.add
        .text(736, 117, discovered ? meta.label : "미확인 카드", {
          fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
          fontSize: "16px",
          fontStyle: "900",
          color: "#ffffff",
          fixedWidth: 180,
          align: "right",
        })
        .setOrigin(1, 0.5),
    );

    const portraitFrame = this.add.graphics();
    portraitFrame.fillStyle(PALETTE.white, 0.7);
    portraitFrame.fillRoundedRect(212, 164, 226, 232, 16);
    portraitFrame.lineStyle(3, meta.glow, discovered ? 0.86 : 0.28);
    portraitFrame.strokeRoundedRect(212, 164, 226, 232, 16);
    portraitFrame.fillStyle(meta.glow, discovered ? 0.18 : 0.08);
    portraitFrame.fillEllipse(325, 272, 176, 130);
    layer.add(portraitFrame);

    const portraitScale = entry.size === "giant" ? 1.02 : entry.size === "large" ? 1.16 : 1.28;
    const portrait = this.add.image(325, 270, entry.assetKey).setScale(portraitScale).setAlpha(discovered ? 1 : 0.16);
    if (!discovered) {
      portrait.setTint(0x315a73);
    }
    layer.add(portrait);

    if (!discovered) {
      layer.add(
        this.add
          .text(325, 270, "?", {
            fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
            fontSize: "72px",
            fontStyle: "900",
            color: "#315a73",
          })
          .setOrigin(0.5)
          .setAlpha(0.7),
      );
    }

    const title = discovered ? entry.name : "아직 만나지 못한 바다 친구";
    layer.add(
      this.add
        .text(470, 174, title, {
          fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
          fontSize: title.length > 12 ? "22px" : "26px",
          fontStyle: "900",
          color: discovered ? TEXT.primary : TEXT.disabled,
          fixedWidth: 258,
          wordWrap: { width: 258 },
        })
        .setOrigin(0, 0.5),
    );

    layer.add(
      this.add
        .text(470, 214, discovered ? `${familyLabel[entry.family]} · ${sizeLabel[entry.size]} · ${rarityLabel[entry.rarity]}` : this.getAreaHint(entry), {
          fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
          fontSize: "16px",
          fontStyle: "900",
          color: TEXT.secondary,
          fixedWidth: 260,
          wordWrap: { width: 260 },
        })
        .setOrigin(0, 0.5),
    );

    const body = discovered
      ? entry.funFact
      : `${this.getAreaHint(entry)}에서 새로운 만남을 기다리고 있어요.`;
    layer.add(
      this.add
        .text(470, 272, body, {
          fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
          fontSize: "16px",
          fontStyle: "700",
          color: TEXT.primary,
          fixedWidth: 258,
          lineSpacing: 6,
          wordWrap: { width: 258 },
        })
        .setOrigin(0, 0.5),
    );

    const behaviorTags = entry.behaviorTags.map((behavior) => behaviorLabel[behavior]).join(" · ");
    const researchLine = nextResearchTarget
      ? `연구 ${researchMeta.label} ${researchPoints}/${nextResearchTarget}`
      : `연구 ${researchMeta.label} 완료`;
    layer.add(
      this.add
        .text(
          470,
          364,
          discovered
            ? `서식 ${this.areaNamesFor(entry)}\n특성 ${behaviorTags}\n수집 ${count}회 · ${researchLine}\n${variantLine}`
            : `서식 ${this.areaNamesFor(entry)}`,
          {
          fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
          fontSize: "13px",
          fontStyle: "800",
          color: TEXT.secondary,
          fixedWidth: 260,
          lineSpacing: 4,
          wordWrap: { width: 260 },
        },
        )
        .setOrigin(0, 0.5),
    );

    const close = this.add.graphics();
    close.fillStyle(PALETTE.paper, 0.96);
    close.fillCircle(746, 118, 18);
    close.lineStyle(3, PALETTE.ink, 0.82);
    close.strokeCircle(746, 118, 18);
    layer.add(close);
    layer.add(
      this.add
        .text(746, 117, "×", {
          fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
          fontSize: "25px",
          fontStyle: "900",
          color: TEXT.primary,
        })
        .setOrigin(0.5),
    );

    const closeHit = this.add.circle(746, 118, 24, 0xffffff, 0.001).setInteractive({ useHandCursor: true });
    closeHit.on("pointerdown", () => this.closeDetail());
    layer.add(closeHit);

    layer.setAlpha(0);
    this.tweens.add({ targets: layer, alpha: 1, duration: 120, ease: "Sine.easeOut" });
  }

  private closeDetail() {
    if (!this.detailLayer) {
      return;
    }
    const layer = this.detailLayer;
    this.detailLayer = undefined;
    this.tweens.add({
      targets: layer,
      alpha: 0,
      duration: 90,
      ease: "Sine.easeOut",
      onComplete: () => layer.destroy(true),
    });
  }

  private getAreaHint(entry: FishDefinition): string {
    const firstArea = areaNameById.get(entry.areaIds[0]);
    return firstArea ? `${firstArea} 힌트` : "새 해역 힌트";
  }

  private areaNamesFor(entry: FishDefinition): string {
    return entry.areaIds
      .map((areaId) => areaNameById.get(areaId) ?? areaId)
      .slice(0, 3)
      .join(" · ");
  }

  private variantDetailLine(fishId: string): string {
    const variants = this.state.variantCollection[fishId] ?? {};
    return Object.entries(mutationMeta)
      .map(([mutationId, meta]) => `${meta.short} ${(variants[mutationId as CatchMutationId] ?? 0)}`)
      .join(" · ");
  }
}

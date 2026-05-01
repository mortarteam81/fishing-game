import Phaser from "phaser";
import { boatItemTint } from "../game/boat";
import { items } from "../game/content";
import { PALETTE, TEXT } from "../game/palette";
import { buyItem, canBuyItem, equipItem, refreshQuestCompletion } from "../game/progression";
import { loadGame, saveGame } from "../game/storage";
import { addHeader, addMuteButton, addOceanBackground, addPanel, addTextButton } from "../game/ui";
import type { ItemDefinition, PlayerState } from "../game/types";

type ExchangeCategory = "rod" | "bait" | "boat" | "boatCosmetic";

const categories: { id: ExchangeCategory; label: string }[] = [
  { id: "rod", label: "낚싯대" },
  { id: "boat", label: "배" },
  { id: "bait", label: "미끼" },
  { id: "boatCosmetic", label: "깃발" },
];

const PAGE_SIZE = 4;

export class ExchangeScene extends Phaser.Scene {
  private state!: PlayerState;
  private category: ExchangeCategory = "rod";
  private page = 0;

  constructor() {
    super("Exchange");
  }

  init(data: { category?: ExchangeCategory; page?: number }) {
    this.category = data.category ?? "rod";
    this.page = Math.max(0, data.page ?? 0);
  }

  create() {
    this.state = loadGame();
    addOceanBackground(this, "beach");
    addHeader(this, "조개 교환소", this.state);
    addMuteButton(this);

    this.add
      .text(480, 68, "장비가 좋아질수록 낚시 감각과 배의 외형이 달라져요.", {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "20px",
        fontStyle: "800",
        color: TEXT.primary,
      })
      .setOrigin(0.5);

    this.addCategoryTabs();
    this.addItemGrid();

    addTextButton(this, 92, 500, "항구", () => this.scene.start("Harbor"), {
      width: 120,
      height: 44,
      fontSize: 18,
      fill: PALETTE.seaFoam,
      iconKey: "icon-harbor",
      iconScale: 0.34,
    });
  }

  private addCategoryTabs() {
    categories.forEach((category, index) => {
      addTextButton(
        this,
        272 + index * 138,
        108,
        category.label,
        () => this.scene.restart({ category: category.id, page: 0 }),
        {
          width: 122,
          height: 38,
          fontSize: 16,
          fill: this.category === category.id ? PALETTE.butter : PALETTE.seaFoam,
        },
      );
    });
  }

  private addItemGrid() {
    const filtered = items.filter((item) => item.kind === this.category);
    const maxPage = Math.max(0, Math.ceil(filtered.length / PAGE_SIZE) - 1);
    this.page = Phaser.Math.Clamp(this.page, 0, maxPage);

    filtered
      .slice(this.page * PAGE_SIZE, this.page * PAGE_SIZE + PAGE_SIZE)
      .forEach((item, index) => this.addItemCard(item, index));

    this.add
      .text(480, 500, `${this.page + 1} / ${maxPage + 1}`, {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "17px",
        fontStyle: "900",
        color: TEXT.primary,
      })
      .setOrigin(0.5);

    addTextButton(this, 362, 500, "이전", () => this.scene.restart({ category: this.category, page: this.page - 1 }), {
      width: 108,
      height: 42,
      fontSize: 17,
      fill: PALETTE.seaFoam,
      disabled: this.page <= 0,
    });
    addTextButton(this, 598, 500, "다음", () => this.scene.restart({ category: this.category, page: this.page + 1 }), {
      width: 108,
      height: 42,
      fontSize: 17,
      fill: PALETTE.butter,
      disabled: this.page >= maxPage,
    });
  }

  private addItemCard(item: ItemDefinition, index: number) {
    const col = index % 2;
    const row = Math.floor(index / 2);
    const x = 285 + col * 390;
    const y = 188 + row * 118;
    const owned = this.state.ownedItemIds.includes(item.id);
    const equipped =
      this.state.equippedRodId === item.id ||
      this.state.equippedBaitId === item.id ||
      this.state.equippedBoatId === item.id ||
      this.state.equippedBoatCosmeticId === item.id;
    addPanel(this, x, y, 340, 100, owned ? PALETTE.paper : PALETTE.warmCream);
    const icon = this.add.image(x - 145, y + 8, this.itemIcon(item)).setScale(item.kind === "boat" ? 0.58 : 0.42);
    if (item.kind === "boat") {
      icon.setTint(boatItemTint(item.id));
    }
    if (item.kind === "rod") {
      icon.setTint(this.rodTint(item.id));
    }

    this.add
      .text(x - 110, y - 34, item.name, {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "19px",
        fontStyle: "900",
        color: TEXT.primary,
      })
      .setOrigin(0, 0.5);
    this.add
      .text(x - 110, y - 4, item.description, {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "13px",
        fontStyle: "700",
        color: TEXT.secondary,
        wordWrap: { width: 190 },
      })
      .setOrigin(0, 0.5);
    this.add
      .text(x - 110, y + 27, this.effectLabel(item), {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "12px",
        fontStyle: "800",
        color: TEXT.secondary,
        wordWrap: { width: 190 },
      })
      .setOrigin(0, 0.5);

    const label = owned ? (equipped ? "사용 중" : "선택") : `조개 ${item.shellCost}`;
    const disabled = (!owned && !canBuyItem(this.state, item.id)) || equipped;
    addTextButton(
      this,
      x + 106,
      y + 22,
      label,
      () => {
        const updated = owned ? equipItem(this.state, item.id) : buyItem(this.state, item.id);
        saveGame(refreshQuestCompletion(updated));
        this.scene.restart();
      },
      {
        width: 118,
        height: 44,
        fontSize: 15,
        fill: owned ? PALETTE.seaFoam : PALETTE.butter,
        disabled,
        iconKey: owned ? this.itemIcon(item) : "icon-shell",
        iconScale: 0.28,
      },
    );
  }

  private itemIcon(item: ItemDefinition) {
    if (item.kind === "rod") {
      return "icon-rod";
    }
    if (item.kind === "bait") {
      return "icon-bait";
    }
    if (item.kind === "boat") {
      return "boat-map";
    }
    return "icon-shop";
  }

  private effectLabel(item: ItemDefinition) {
    const effect = item.effect;
    if (!effect) {
      return "외형 변경";
    }

    const parts = [
      effect.catchEase ? `타이밍 +${Math.round(effect.catchEase * 100)}` : undefined,
      effect.lureSpeed ? `입질 +${Math.round(effect.lureSpeed * 100)}` : undefined,
      effect.reelPower ? `릴링 +${Math.round(effect.reelPower * 100)}` : undefined,
      effect.rareBoost ? `희귀 +${Math.round(effect.rareBoost * 100)}` : undefined,
      effect.mutationChance ? `변이 +${Math.round(effect.mutationChance * 100)}` : undefined,
      effect.boatSpeed ? `항해 +${Math.round(effect.boatSpeed * 100)}` : undefined,
    ].filter(Boolean);

    return parts.length > 0 ? parts.join(" · ") : "기본 장비";
  }

  private rodTint(itemId: string) {
    switch (itemId) {
      case "sparkle-rod":
        return PALETTE.butter;
      case "captain-rod":
        return PALETTE.coralDeep;
      case "tideglass-rod":
        return PALETTE.lagoon;
      case "aurora-rod":
        return PALETTE.lavender;
      default:
        return PALETTE.driftwoodDark;
    }
  }
}

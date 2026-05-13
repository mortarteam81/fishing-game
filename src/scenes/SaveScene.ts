import Phaser from "phaser";
import {
  getSaveSlotPage,
  getSaveSlotPageCount,
  hasCaptainPass,
  saveSlotCountForState,
} from "../game/monetization";
import { PALETTE, TEXT } from "../game/palette";
import { getSaveSlots, loadGame, loadGameFromSlot, saveGameToSlot } from "../game/storage";
import { addHeader, addMuteButton, addOceanBackground, addPanel, addTextButton } from "../game/ui";
import type { PlayerState } from "../game/types";

export class SaveScene extends Phaser.Scene {
  private state!: PlayerState;
  private message = "";
  private page = 0;

  constructor() {
    super("Save");
  }

  init(data: { message?: string; page?: number }) {
    this.message = data?.message ?? "";
    this.page = data?.page ?? 0;
  }

  create() {
    this.state = loadGame();
    addOceanBackground(this, "pearl");
    addHeader(this, "게임 저장", this.state);
    addMuteButton(this);

    const slotCount = saveSlotCountForState(this.state);
    this.add
      .text(480, 76, this.message || "선장실 서랍에 항해 기록 세 권이 가지런히 놓여 있어요.", {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "20px",
        fontStyle: "900",
        color: this.message ? TEXT.primary : TEXT.secondary,
        align: "center",
        wordWrap: { width: 760 },
      })
      .setOrigin(0.5);

    this.add.text(480, 104, hasCaptainPass(this.state) ? `선장 패스 보관함 · 저장 슬롯 ${slotCount}개` : "무료 보관함 · 저장 슬롯 3개", {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "15px",
      fontStyle: "900",
      color: TEXT.secondary,
      backgroundColor: "rgba(255,251,239,0.62)",
      padding: { x: 10, y: 4 },
    }).setOrigin(0.5);

    const pageCount = getSaveSlotPageCount(slotCount);
    const safePage = Math.max(0, Math.min(pageCount - 1, this.page));
    this.page = safePage;
    getSaveSlotPage(slotCount, safePage).forEach((slotId, index) => this.addSlotCard(slotId, index));
    if (pageCount > 1) {
      this.add.text(480, 450, `${safePage + 1} / ${pageCount}`, {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "15px",
        fontStyle: "900",
        color: TEXT.secondary,
      }).setOrigin(0.5);
      addTextButton(this, 378, 450, "이전", () => this.scene.restart({ page: Math.max(0, safePage - 1) }), {
        width: 96,
        height: 44,
        fontSize: 16,
        fill: PALETTE.seaFoam,
        disabled: safePage === 0,
      });
      addTextButton(this, 582, 450, "다음", () => this.scene.restart({ page: Math.min(pageCount - 1, safePage + 1) }), {
        width: 96,
        height: 44,
        fontSize: 16,
        fill: PALETTE.seaFoam,
        disabled: safePage >= pageCount - 1,
      });
    }

    addTextButton(this, 92, 500, "항구", () => this.scene.start("Harbor"), {
      width: 120,
      height: 44,
      fontSize: 18,
      fill: PALETTE.seaFoam,
      iconKey: "icon-harbor",
      iconScale: 0.34,
    });
    addTextButton(this, 232, 500, hasCaptainPass(this.state) ? "패스 확인" : "선장 패스", () => this.scene.start("CaptainPass"), {
      width: 134,
      height: 44,
      fontSize: 16,
      fill: PALETTE.butter,
      iconKey: "icon-shop",
      iconScale: 0.3,
    });
  }

  private addSlotCard(slotId: number, index: number) {
    const slot = getSaveSlots(this.state).find((entry) => entry.slotId === slotId);
    const x = 480;
    const y = 166 + index * 106;
    const width = 650;
    addPanel(this, x, y, width, 96, PALETTE.paper);
    this.add
      .text(x - width / 2 + 32, y - 32, `슬롯 ${slotId}`, {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "24px",
        fontStyle: "900",
        color: TEXT.primary,
      })
      .setOrigin(0, 0.5);

    const savedText = slot && !slot.empty
      ? `${slot.captainName} 선장 · Lv.${slot.level} · 조개 ${slot.shells} · 도감 ${slot.collectionCount}종`
      : "비어 있는 항해 기록";
    this.add
      .text(x - width / 2 + 32, y - 1, savedText, {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "18px",
        fontStyle: "800",
        color: TEXT.secondary,
        wordWrap: { width: 410 },
      })
      .setOrigin(0, 0.5);
    this.add
      .text(x - width / 2 + 32, y + 28, slot?.savedAt ? this.formatSavedAt(slot.savedAt) : "저장 시간이 아직 없어요.", {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "14px",
        fontStyle: "700",
        color: TEXT.disabled,
      })
      .setOrigin(0, 0.5);

    addTextButton(this, x + width / 2 - 88, y - 22, "저장", () => {
      saveGameToSlot(slotId, this.state);
      this.scene.restart({ message: `슬롯 ${slotId}에 현재 항해 기록을 저장했어요.`, page: this.page });
    }, {
      width: 112,
      height: 44,
      fontSize: 17,
      fill: PALETTE.butter,
    });
    addTextButton(this, x + width / 2 - 88, y + 26, "불러오기", () => {
      const loaded = loadGameFromSlot(slotId);
      if (loaded) {
        if (!slot?.empty && slot?.level && loaded.level > slot.level) {
          this.scene.restart({ message: `현재 진행도 Lv.${loaded.level}가 더 높아 낮은 슬롯으로 덮지 않았어요.`, page: this.page });
          return;
        }
        this.scene.start("Harbor");
      } else {
        this.scene.restart({ message: `슬롯 ${slotId}에는 불러올 기록이 없어요.`, page: this.page });
      }
    }, {
      width: 112,
      height: 44,
      fontSize: 16,
      fill: PALETTE.seaFoam,
      disabled: slot?.empty ?? true,
    });
  }

  private formatSavedAt(savedAt: string) {
    const date = new Date(savedAt);
    if (Number.isNaN(date.getTime())) {
      return "저장 시간을 읽을 수 없어요.";
    }
    return new Intl.DateTimeFormat("ko-KR", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  }
}

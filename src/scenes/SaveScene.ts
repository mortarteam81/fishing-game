import Phaser from "phaser";
import { PALETTE, TEXT } from "../game/palette";
import { getSaveSlots, loadGame, loadGameFromSlot, saveGameToSlot } from "../game/storage";
import { addHeader, addMuteButton, addOceanBackground, addPanel, addTextButton } from "../game/ui";
import type { PlayerState } from "../game/types";

export class SaveScene extends Phaser.Scene {
  private state!: PlayerState;
  private message = "";

  constructor() {
    super("Save");
  }

  init(data: { message?: string }) {
    this.message = data.message ?? "";
  }

  create() {
    this.state = loadGame();
    addOceanBackground(this, "pearl");
    addHeader(this, "게임 저장", this.state);
    addMuteButton(this);

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

    getSaveSlots().forEach((slot, index) => this.addSlotCard(slot.slotId, 148 + index * 140));

    addTextButton(this, 92, 500, "항구", () => this.scene.start("Harbor"), {
      width: 120,
      height: 44,
      fontSize: 18,
      fill: PALETTE.seaFoam,
      iconKey: "icon-harbor",
      iconScale: 0.34,
    });
  }

  private addSlotCard(slotId: number, y: number) {
    const slot = getSaveSlots().find((entry) => entry.slotId === slotId);
    const x = 480;
    addPanel(this, x, y, 650, 106, PALETTE.paper);
    this.add
      .text(x - 292, y - 36, `슬롯 ${slotId}`, {
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
      .text(x - 292, y - 2, savedText, {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "18px",
        fontStyle: "800",
        color: TEXT.secondary,
        wordWrap: { width: 410 },
      })
      .setOrigin(0, 0.5);
    this.add
      .text(x - 292, y + 29, slot?.savedAt ? this.formatSavedAt(slot.savedAt) : "저장 시간이 아직 없어요.", {
        fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
        fontSize: "14px",
        fontStyle: "700",
        color: TEXT.disabled,
      })
      .setOrigin(0, 0.5);

    addTextButton(this, x + 158, y - 20, "저장", () => {
      saveGameToSlot(slotId, this.state);
      this.scene.restart({ message: `슬롯 ${slotId}에 현재 항해 기록을 저장했어요.` });
    }, {
      width: 112,
      height: 38,
      fontSize: 17,
      fill: PALETTE.butter,
    });
    addTextButton(this, x + 158, y + 26, "불러오기", () => {
      const loaded = loadGameFromSlot(slotId);
      if (loaded) {
        this.scene.start("Harbor");
      } else {
        this.scene.restart({ message: `슬롯 ${slotId}에는 불러올 기록이 없어요.` });
      }
    }, {
      width: 112,
      height: 38,
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

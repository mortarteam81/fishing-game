import { describe, expect, it } from "vitest";
import {
  billingCopyForPlatform,
  captainPassParentSafetyLines,
  captainPassRewardPreviews,
  getSaveSlotPage,
  getSaveSlotPageCount,
} from "../src/game/monetization";

describe("captain pass presentation helpers", () => {
  it("defines visible rewards that can be previewed in the pass scene", () => {
    const rewards = captainPassRewardPreviews();

    expect(rewards.map((reward) => reward.id)).toEqual([
      "save-slots",
      "captain-cosmetics",
      "expedition-archive",
      "family-report",
    ]);
    expect(rewards.every((reward) => reward.title.length > 0)).toBe(true);
    expect(rewards.every((reward) => reward.visualKind.length > 0)).toBe(true);
  });

  it("keeps parent safety copy explicit and privacy-safe", () => {
    const lines = captainPassParentSafetyLines("web");

    expect(lines).toContain("광고, 채팅, 랜덤박스, 바다 친구 직접 판매를 넣지 않아요.");
    expect(lines).toContain("개인정보, 위치, 이메일, 기기 고유값은 수집하지 않아요.");
    expect(lines.some((line) => line.includes("개발용 복원"))).toBe(true);
  });

  it("separates Android purchase labels from local web mock labels", () => {
    expect(billingCopyForPlatform("android")).toMatchObject({
      purchaseCta: "Google Play 결제 화면 열기",
      restoreCta: "구매 복원",
      canStartPurchase: true,
    });
    expect(billingCopyForPlatform("web")).toMatchObject({
      purchaseCta: "닫힌 테스트 준비 중",
      restoreCta: "개발용 복원",
      canStartPurchase: false,
    });
  });

  it("paginates six pass slots into three-slot pages", () => {
    expect(getSaveSlotPageCount(3)).toBe(1);
    expect(getSaveSlotPageCount(6)).toBe(2);
    expect(getSaveSlotPage(6, 0)).toEqual([1, 2, 3]);
    expect(getSaveSlotPage(6, 1)).toEqual([4, 5, 6]);
    expect(getSaveSlotPage(6, 99)).toEqual([4, 5, 6]);
  });
});

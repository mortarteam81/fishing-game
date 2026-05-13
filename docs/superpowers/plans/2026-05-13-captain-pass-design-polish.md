# Captain Pass Design Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the Captain Pass MVP from a safe but plain information panel into a premium, trustworthy family purchase flow that fits Banjjakbada's hand-crafted sailing RPG direction.

**Architecture:** Keep the current entitlement, billing, and storage model. Add small pure presentation helpers for purchase copy, safety copy, reward preview data, and save-slot pagination, then use those helpers in Phaser scenes. The visual upgrade should stay inside the current Phaser/SVG pipeline and avoid new runtime dependencies.

**Tech Stack:** TypeScript, Phaser 3, Vitest, Capacitor, Google Play Billing bridge, `DESIGN.md` tokens.

---

## Design Review Findings To Address

- `CaptainPassScene` lacks a strong visual anchor. It explains the pass, but does not show why it feels worth buying.
- Parent gate CTA copy is too vague. Parents should know when Google Play will open and when local web is mock-only.
- Android and local web restore labels are mixed. "개발용 복원" must not appear as the normal Android restore label.
- `SaveScene` compresses six slots into small 11-13px text and 32px buttons. This is below the mobile landscape quality bar.
- The parent report looks like text, not a collectible exploration report.
- App copy mentions safe analytics in docs, but the in-app parent message does not clearly say what is not collected.

## File Structure

- Modify `src/game/monetization.ts`
  - Add reward preview data, parent safety lines, platform-aware pass copy, and save-slot page helpers.
- Modify `src/game/billing.ts`
  - Add pure copy helpers for `android` and `web` contexts while keeping native bridge calls unchanged.
- Modify `src/scenes/CaptainPassScene.ts`
  - Replace plain panels with a "captain cabin ledger" composition, reward preview cards, clearer parent gate, and report-stamp visual.
- Modify `src/scenes/SaveScene.ts`
  - Replace six-slot compression with three slots per page for pass users.
- Create `tests/monetization.test.ts`
  - Cover reward preview data, safety copy, platform labels, and save-slot page helpers.
- Modify `PLAY_STORE_READINESS.md`
  - Record the new UX rule: Android purchase copy and local mock copy must remain separate.

## Execution Strategy

Use two independent workers if implementing with subagents:

- Worker A owns `src/game/monetization.ts`, `src/game/billing.ts`, `tests/monetization.test.ts`, and docs.
- Worker B owns `src/scenes/CaptainPassScene.ts` and `src/scenes/SaveScene.ts`.
- Main integrator runs visual QA, fixes layout overlap, and runs the full verification suite.

Do not start from a large redesign. This is a focused polish pass on the monetization flow.

---

### Task 1: Add Presentation Helpers For Captain Pass Copy

**Files:**
- Modify: `src/game/monetization.ts`
- Test: `tests/monetization.test.ts`

- [ ] **Step 1: Create the monetization test file with failing tests**

Add `tests/monetization.test.ts`:

```ts
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
```

- [ ] **Step 2: Run the focused test and verify it fails**

Run:

```bash
npm test -- tests/monetization.test.ts
```

Expected: FAIL because the new helper exports do not exist yet.

- [ ] **Step 3: Implement the pure helper functions**

In `src/game/monetization.ts`, add these exports below the existing constants:

```ts
export type CaptainPassRewardPreview = {
  id: "save-slots" | "captain-cosmetics" | "expedition-archive" | "family-report";
  title: string;
  detail: string;
  visualKind: "slots" | "boat" | "ledger" | "report";
};

export type BillingPlatform = "android" | "web";

export type BillingCopy = {
  platform: BillingPlatform;
  purchaseCta: string;
  restoreCta: string;
  availabilityLine: string;
  canStartPurchase: boolean;
};

export function captainPassRewardPreviews(): CaptainPassRewardPreview[] {
  return [
    {
      id: "save-slots",
      title: "저장 슬롯 6개",
      detail: "형제, 부모, 아이가 항해 기록을 따로 보관해요.",
      visualKind: "slots",
    },
    {
      id: "captain-cosmetics",
      title: "전용 배와 깃발",
      detail: "성능 판매 없이 기념 외형만 열려요.",
      visualKind: "boat",
    },
    {
      id: "expedition-archive",
      title: "원정 기록 보관함",
      detail: "별고래와 왕관해 탐사를 오래 간직해요.",
      visualKind: "ledger",
    },
    {
      id: "family-report",
      title: "부모용 탐험 리포트",
      detail: "도감, 항구, 교역로 성장을 한눈에 봐요.",
      visualKind: "report",
    },
  ];
}

export function captainPassParentSafetyLines(platform: BillingPlatform): string[] {
  const lines = [
    "선장 패스는 1회성 구매예요.",
    "광고, 채팅, 랜덤박스, 바다 친구 직접 판매를 넣지 않아요.",
    "저장 슬롯과 전용 외형, 원정 기록 보관함을 열어요.",
    "개인정보, 위치, 이메일, 기기 고유값은 수집하지 않아요.",
    "결제와 환불 관리는 Google Play가 처리해요.",
  ];
  return platform === "web"
    ? [...lines, "로컬 웹에서는 실제 결제 대신 개발용 복원만 사용할 수 있어요."]
    : lines;
}

export function billingCopyForPlatform(platform: BillingPlatform): BillingCopy {
  if (platform === "android") {
    return {
      platform,
      purchaseCta: "Google Play 결제 화면 열기",
      restoreCta: "구매 복원",
      availabilityLine: "결제는 Google Play에서 안전하게 처리돼요.",
      canStartPurchase: true,
    };
  }

  return {
    platform,
    purchaseCta: "닫힌 테스트 준비 중",
    restoreCta: "개발용 복원",
    availabilityLine: "로컬 웹에서는 실제 결제를 열지 않아요.",
    canStartPurchase: false,
  };
}

export function getSaveSlotPageCount(slotCount: number): number {
  return Math.max(1, Math.ceil(slotCount / FREE_SAVE_SLOT_COUNT));
}

export function getSaveSlotPage(slotCount: number, page: number): number[] {
  const pageCount = getSaveSlotPageCount(slotCount);
  const safePage = Math.max(0, Math.min(pageCount - 1, page));
  const start = safePage * FREE_SAVE_SLOT_COUNT + 1;
  const end = Math.min(slotCount, start + FREE_SAVE_SLOT_COUNT - 1);
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}
```

- [ ] **Step 4: Run the focused test and verify it passes**

Run:

```bash
npm test -- tests/monetization.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit this unit if working in a feature branch**

```bash
git add src/game/monetization.ts tests/monetization.test.ts
git commit -m "feat: add captain pass presentation helpers"
```

---

### Task 2: Make Billing Copy Platform-Aware

**Files:**
- Modify: `src/game/billing.ts`
- Modify: `src/scenes/CaptainPassScene.ts`
- Test: `tests/monetization.test.ts`

- [ ] **Step 1: Add a platform helper to billing**

In `src/game/billing.ts`, add this import:

```ts
import { billingCopyForPlatform, type BillingCopy } from "./monetization";
```

Then add this function after `const nativeBilling = ...`:

```ts
export function getBillingCopy(): BillingCopy {
  return billingCopyForPlatform(Capacitor.getPlatform() === "android" ? "android" : "web");
}
```

- [ ] **Step 2: Use the helper in CaptainPassScene**

In `src/scenes/CaptainPassScene.ts`, change the billing import:

```ts
import {
  getBillingCopy,
  purchaseCaptainPass,
  queryCaptainPassProducts,
  restoreCaptainPass,
  type BillingProduct,
  type BillingResult,
} from "../game/billing";
```

Add a private field:

```ts
private billingCopy = getBillingCopy();
```

- [ ] **Step 3: Replace purchase and restore button labels**

In `addParentGate()`, replace:

```ts
"아래 설명을 읽고 계속"
```

with:

```ts
this.billingCopy.purchaseCta
```

Replace:

```ts
"개발용 복원"
```

with:

```ts
this.billingCopy.restoreCta
```

Keep the purchase handler wired to `handlePurchase()`. For local web, `purchaseCaptainPass()` already returns an unavailable result, so the user sees a safe message instead of a real payment.

- [ ] **Step 4: Add platform availability copy to the parent panel**

In `addParentGate()`, draw one small line above the CTA row:

```ts
this.add.text(150, 386, this.billingCopy.availabilityLine, {
  fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
  fontSize: "15px",
  fontStyle: "900",
  color: TEXT.secondary,
  wordWrap: { width: 640 },
}).setOrigin(0, 0.5);
```

- [ ] **Step 5: Run tests**

Run:

```bash
npm test -- tests/monetization.test.ts
```

Expected: PASS.

---

### Task 3: Redesign Captain Pass Intro Around A Premium Visual Anchor

**Files:**
- Modify: `src/scenes/CaptainPassScene.ts`

- [ ] **Step 1: Import reward preview helpers**

Update the monetization import:

```ts
import {
  CAPTAIN_PASS_PRODUCT_ID,
  billingCopyForPlatform,
  captainPassBenefitLines,
  captainPassParentSafetyLines,
  captainPassRewardPreviews,
  grantProductEntitlement,
  hasCaptainPass,
  saveSlotCountForState,
  type CaptainPassRewardPreview,
} from "../game/monetization";
```

If `billingCopyForPlatform` is unused because Task 2 uses `getBillingCopy()`, do not import it.

- [ ] **Step 2: Replace the plain top panel with a cabin-ledger composition**

In `addIntro()`, replace the existing top `addPanel` block with a wider "captain cabin ledger" visual:

```ts
addPanel(this, 480, 142, 780, 164, owned ? PALETTE.seaFoam : PALETTE.paper);
this.drawPassLedgerVisual(716, 142, owned);
this.add.text(118, 82, owned ? "선장 패스 사용 중" : "가족 원정을 더 오래 보관해요", {
  fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
  fontSize: "30px",
  fontStyle: "900",
  color: TEXT.primary,
}).setOrigin(0, 0.5);
this.add.text(118, 124, owned
  ? `저장 슬롯 ${saveSlotCountForState(this.state)}개와 전용 외형이 열려 있어요.`
  : "광고, 채팅, 랜덤박스 없이 가족이 믿고 열 수 있는 1회성 패스예요.", {
  fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
  fontSize: "18px",
  fontStyle: "800",
  color: TEXT.secondary,
  wordWrap: { width: 512 },
}).setOrigin(0, 0.5);
this.add.text(118, 166, this.message || (this.product?.formattedPrice ? `가격: ${this.product.formattedPrice}` : "가격은 Play Console에서 표시돼요."), {
  fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
  fontSize: "16px",
  fontStyle: "900",
  color: TEXT.primary,
  backgroundColor: "rgba(255,251,239,0.62)",
  padding: { x: 10, y: 4 },
}).setOrigin(0, 0.5);
```

- [ ] **Step 3: Add a ledger visual helper**

Add this method to `CaptainPassScene`:

```ts
private drawPassLedgerVisual(x: number, y: number, owned: boolean) {
  const g = this.add.graphics();
  g.fillStyle(PALETTE.warmCream, 1);
  g.fillRoundedRect(x - 102, y - 56, 204, 112, 8);
  g.lineStyle(3, PALETTE.ink, 0.62);
  g.strokeRoundedRect(x - 102, y - 56, 204, 112, 8);

  g.fillStyle(owned ? PALETTE.butter : PALETTE.seaFoam, 1);
  g.fillRoundedRect(x - 82, y - 38, 68, 48, 5);
  g.lineStyle(2, PALETTE.ink, 0.52);
  g.strokeRoundedRect(x - 82, y - 38, 68, 48, 5);

  g.fillStyle(PALETTE.lagoon, 1);
  g.fillRoundedRect(x + 8, y - 26, 74, 26, 4);
  g.fillStyle(PALETTE.coral, 1);
  g.fillTriangle(x + 40, y - 54, x + 40, y - 8, x + 78, y - 32);
  g.lineStyle(2, PALETTE.ink, 0.46);
  g.lineBetween(x + 40, y - 54, x + 40, y + 14);

  g.lineStyle(2, PALETTE.ink, 0.28);
  g.lineBetween(x - 82, y + 30, x + 82, y + 30);
  g.lineBetween(x - 82, y + 42, x + 54, y + 42);

  this.add.text(x, y + 60, owned ? "열린 항해 도구" : "패스 보상 미리보기", {
    fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
    fontSize: "13px",
    fontStyle: "900",
    color: TEXT.primary,
  }).setOrigin(0.5);
}
```

- [ ] **Step 4: Replace text-only benefits with reward preview cards**

Replace `this.addBenefitPanel(owned);` with:

```ts
this.addRewardPreviewPanel(owned);
```

Add:

```ts
private addRewardPreviewPanel(owned: boolean) {
  const rewards = captainPassRewardPreviews();
  addPanel(this, 282, 338, 356, 224, PALETTE.paper);
  this.add.text(126, 244, owned ? "열린 보상" : "패스 보상", {
    fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
    fontSize: "23px",
    fontStyle: "900",
    color: TEXT.primary,
  }).setOrigin(0, 0.5);

  rewards.forEach((reward, index) => {
    const y = 286 + index * 40;
    this.drawRewardGlyph(144, y, reward);
    this.add.text(174, y - 8, reward.title, {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "15px",
      fontStyle: "900",
      color: TEXT.primary,
    }).setOrigin(0, 0.5);
    this.add.text(174, y + 10, reward.detail, {
      fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
      fontSize: "11px",
      fontStyle: "800",
      color: TEXT.secondary,
      wordWrap: { width: 250 },
    }).setOrigin(0, 0.5);
  });
}
```

Add:

```ts
private drawRewardGlyph(x: number, y: number, reward: CaptainPassRewardPreview) {
  const g = this.add.graphics();
  g.fillStyle(PALETTE.seaFoam, 1);
  g.fillRoundedRect(x - 15, y - 15, 30, 30, 6);
  g.lineStyle(2, PALETTE.ink, 0.55);
  g.strokeRoundedRect(x - 15, y - 15, 30, 30, 6);

  g.lineStyle(2, PALETTE.ink, 0.72);
  if (reward.visualKind === "slots") {
    g.strokeRoundedRect(x - 8, y - 8, 7, 7, 1);
    g.strokeRoundedRect(x + 2, y - 8, 7, 7, 1);
    g.strokeRoundedRect(x - 8, y + 2, 7, 7, 1);
    return;
  }
  if (reward.visualKind === "boat") {
    g.fillStyle(PALETTE.lagoon, 1);
    g.fillTriangle(x - 10, y + 4, x + 10, y + 4, x + 5, y + 10);
    g.lineBetween(x, y - 10, x, y + 4);
    g.lineBetween(x, y - 8, x + 8, y - 2);
    return;
  }
  if (reward.visualKind === "ledger") {
    g.strokeRoundedRect(x - 8, y - 10, 16, 20, 2);
    g.lineBetween(x - 4, y - 2, x + 5, y - 2);
    g.lineBetween(x - 4, y + 4, x + 4, y + 4);
    return;
  }
  g.strokeCircle(x, y, 9);
  g.lineBetween(x - 5, y, x - 1, y + 4);
  g.lineBetween(x, y + 4, x + 6, y - 5);
}
```

- [ ] **Step 5: Run build**

Run:

```bash
npm run build
```

Expected: PASS.

---

### Task 4: Make Parent Gate Safer And More Specific

**Files:**
- Modify: `src/scenes/CaptainPassScene.ts`

- [ ] **Step 1: Replace hard-coded parent safety lines**

In `addParentGate()`, replace the local `lines` array with:

```ts
const lines = captainPassParentSafetyLines(this.billingCopy.platform);
```

- [ ] **Step 2: Adjust line spacing for six possible lines**

Change the parent line y-position from:

```ts
154 + index * 38
```

to:

```ts
146 + index * 34
```

Use `fontSize: "16px"` for the parent safety lines. This keeps the panel readable after adding the privacy sentence.

- [ ] **Step 3: Move CTAs down only if they still fit**

Keep CTA `y` at `432`. Do not push it lower, because the bottom navigation and mobile landscape safe area are already tight.

- [ ] **Step 4: Run visual browser QA**

Start the server:

```bash
npm run dev -- --host 127.0.0.1 --port 5175 --strictPort
```

Open:

```text
http://127.0.0.1:5175/
```

QA:
- Open `선장 패스`.
- Click `부모 안내 보기`.
- Confirm the parent panel shows no text overlap.
- Confirm local web shows `닫힌 테스트 준비 중` and `개발용 복원`.
- Confirm no actual payment dialog opens on web.

---

### Task 5: Redesign The Parent Report As A Visual Stamp Card

**Files:**
- Modify: `src/scenes/CaptainPassScene.ts`

- [ ] **Step 1: Replace the report body text with visible metrics**

In `addReportPanel()`, keep the panel and title, but replace the single multiline text with four metric stamps:

```ts
const metrics = [
  { label: "선장", value: `Lv.${this.state.level}` },
  { label: "도감", value: `${uniqueFriends}종` },
  { label: "항구", value: `${this.state.visitedPortIds.length}곳` },
  { label: "교역", value: `${this.state.tradeLedger.completedRoutes}회` },
];
metrics.forEach((metric, index) => {
  const col = index % 2;
  const row = Math.floor(index / 2);
  this.drawReportStamp(574 + col * 108, 304 + row * 58, metric.label, metric.value);
});
this.add.text(526, 414, hasCaptainPass(this.state) ? "원정 기록 보관 준비 완료" : "패스를 열면 기록 보관함이 확장돼요", {
  fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
  fontSize: "14px",
  fontStyle: "900",
  color: TEXT.secondary,
  wordWrap: { width: 284 },
}).setOrigin(0, 0.5);
```

- [ ] **Step 2: Add the stamp helper**

Add this method:

```ts
private drawReportStamp(x: number, y: number, label: string, value: string) {
  const g = this.add.graphics();
  g.fillStyle(PALETTE.paper, 1);
  g.fillRoundedRect(x - 44, y - 22, 88, 44, 7);
  g.lineStyle(2, PALETTE.ink, 0.42);
  g.strokeRoundedRect(x - 44, y - 22, 88, 44, 7);
  this.add.text(x, y - 8, label, {
    fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
    fontSize: "11px",
    fontStyle: "900",
    color: TEXT.secondary,
  }).setOrigin(0.5);
  this.add.text(x, y + 9, value, {
    fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
    fontSize: "17px",
    fontStyle: "900",
    color: TEXT.primary,
  }).setOrigin(0.5);
}
```

- [ ] **Step 3: Run build**

Run:

```bash
npm run build
```

Expected: PASS.

---

### Task 6: Replace Six-Slot Compression With Save Slot Paging

**Files:**
- Modify: `src/scenes/SaveScene.ts`
- Test: `tests/monetization.test.ts`

- [ ] **Step 1: Import page helpers**

Change the monetization import in `src/scenes/SaveScene.ts`:

```ts
import {
  getSaveSlotPage,
  getSaveSlotPageCount,
  hasCaptainPass,
  saveSlotCountForState,
} from "../game/monetization";
```

- [ ] **Step 2: Add a page field and init data**

Add:

```ts
private page = 0;
```

Change init:

```ts
init(data: { message?: string; page?: number }) {
  this.message = data.message ?? "";
  this.page = data.page ?? 0;
}
```

- [ ] **Step 3: Render only the current page**

Replace:

```ts
getSaveSlots(this.state).forEach((slot, index) => this.addSlotCard(slot.slotId, index, slotCount));
```

with:

```ts
const pageCount = getSaveSlotPageCount(slotCount);
const safePage = Math.max(0, Math.min(pageCount - 1, this.page));
getSaveSlotPage(slotCount, safePage).forEach((slotId, index) => this.addSlotCard(slotId, index, slotCount));
if (pageCount > 1) {
  this.add.text(480, 456, `${safePage + 1} / ${pageCount}`, {
    fontFamily: "Apple SD Gothic Neo, Noto Sans KR, sans-serif",
    fontSize: "15px",
    fontStyle: "900",
    color: TEXT.secondary,
  }).setOrigin(0.5);
  addTextButton(this, 378, 456, "이전", () => this.scene.restart({ page: Math.max(0, safePage - 1) }), {
    width: 96,
    height: 44,
    fontSize: 16,
    fill: PALETTE.seaFoam,
    disabled: safePage === 0,
  });
  addTextButton(this, 582, 456, "다음", () => this.scene.restart({ page: Math.min(pageCount - 1, safePage + 1) }), {
    width: 96,
    height: 44,
    fontSize: 16,
    fill: PALETTE.seaFoam,
    disabled: safePage >= pageCount - 1,
  });
}
```

- [ ] **Step 4: Make slot cards full-width again**

In `addSlotCard`, remove the compact branch and use:

```ts
const slot = getSaveSlots(this.state).find((entry) => entry.slotId === slotId);
const x = 480;
const y = 156 + index * 108;
const width = 650;
addPanel(this, x, y, width, 96, PALETTE.paper);
```

Then use the non-compact text/button sizes already present in the method:

```ts
fontSize: "24px"
fontSize: "18px"
fontSize: "14px"
width: 112
height: 44
fontSize: 17
```

The final save/load buttons must be at least `44px` high.

- [ ] **Step 5: Preserve page after saving an item**

Change save restart:

```ts
this.scene.restart({ message: `슬롯 ${slotId}에 현재 항해 기록을 저장했어요.`, page: this.page });
```

Change empty load restart:

```ts
this.scene.restart({ message: `슬롯 ${slotId}에는 불러올 기록이 없어요.`, page: this.page });
```

- [ ] **Step 6: Run tests**

Run:

```bash
npm test -- tests/monetization.test.ts tests/storage.test.ts
```

Expected: PASS.

---

### Task 7: Update Play Store Readiness Notes

**Files:**
- Modify: `PLAY_STORE_READINESS.md`

- [ ] **Step 1: Add the UX rule under Stage 4**

Append these bullets under `Stage 4: Captain Pass Monetization MVP`:

```md
- Captain Pass purchase UI must show reward value visually before asking a parent to continue.
- Android purchase copy must say `Google Play 결제 화면 열기`; local web copy must say `닫힌 테스트 준비 중`.
- Android restore copy must say `구매 복원`; local web mock restore may say `개발용 복원`.
- Parent gate must include a privacy sentence: no personal info, location, email, or device-unique identifiers.
```

- [ ] **Step 2: Run docs-adjacent verification**

Run:

```bash
npm run design:lint
```

Expected: PASS with zero errors and zero warnings.

---

### Task 8: Full Verification And Visual QA

**Files:**
- No source changes unless QA finds a defect.

- [ ] **Step 1: Run the full automated suite**

Run:

```bash
npm test
```

Expected: all test files pass.

- [ ] **Step 2: Run the production build**

Run:

```bash
npm run build
```

Expected: TypeScript and Vite build pass.

- [ ] **Step 3: Run Android sync**

Run:

```bash
npm run android:sync
```

Expected: build passes and Capacitor sync completes.

- [ ] **Step 4: Run browser QA on local web**

Start:

```bash
npm run dev -- --host 127.0.0.1 --port 5175 --strictPort
```

Check:

- Harbor has a path to Save and Port.
- Save shows 3 slots for free users.
- After local mock restore, Save shows 6 slots across 2 pages.
- Save slot buttons are readable and at least 44px tall.
- Captain Pass intro has a clear pass reward preview.
- Parent gate copy does not overlap.
- Local web purchase CTA does not imply real payment.
- Local mock restore opens the pass and returns to the owned state.

- [ ] **Step 5: Run mobile landscape QA**

Use a phone or browser device emulation in landscape. Check:

- `CaptainPassScene` has no clipped CTA buttons.
- `SaveScene` page controls do not overlap the bottom navigation.
- Text remains readable on small landscape phones.
- Orientation hint still appears in portrait.

- [ ] **Step 6: Commit the completed polish**

```bash
git add src/game/monetization.ts src/game/billing.ts src/scenes/CaptainPassScene.ts src/scenes/SaveScene.ts tests/monetization.test.ts PLAY_STORE_READINESS.md
git commit -m "polish: improve captain pass purchase design"
```

---

## Acceptance Criteria

- Captain Pass screen has a visible reward preview, not only explanatory text.
- Parent gate explains safety, privacy, purchase ownership, and platform behavior.
- Android and web copy are different where they need to be different.
- Free users see 3 save slots.
- Captain Pass users see 6 save slots without tiny 11-13px compressed card text.
- No runtime dependency is added.
- `npm run design:lint`, `npm test`, `npm run build`, and `npm run android:sync` pass.

## Not In Scope

- Real Play Console product configuration.
- Server-side purchase receipt validation.
- Store listing graphics, app icon, feature graphic, or trailer.
- Full-game typography migration from `Apple SD Gothic Neo` to `Pretendard`.
- A full visual redesign of Harbor, Ocean, Port, Exchange, or Collection scenes.

## Self-Review

- Spec coverage: all seven design review findings are mapped to tasks.
- Placeholder scan: no placeholder markers remain.
- Type consistency: helper names are defined before scene tasks use them.
- Scope check: this is one focused monetization design polish sprint, not a full UI redesign.

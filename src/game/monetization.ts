import type { Entitlements, PlayerState } from "./types";

export const CAPTAIN_PASS_PRODUCT_ID = "captain_pass_full";
export const CAPTAIN_PASS_BOAT_ID = "captain-pass-voyager";
export const CAPTAIN_PASS_FLAG_ID = "captain-pass-flag";
export const FREE_SAVE_SLOT_COUNT = 3;
export const CAPTAIN_PASS_SAVE_SLOT_COUNT = 6;

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

const captainPassItemIds = new Set([CAPTAIN_PASS_BOAT_ID, CAPTAIN_PASS_FLAG_ID]);

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

export function createDefaultEntitlements(): Entitlements {
  return {
    captainPass: false,
    purchasedProductIds: [],
  };
}

export function normalizeEntitlements(stored: Partial<Entitlements> | undefined): Entitlements {
  const rawProductIds = Array.isArray(stored?.purchasedProductIds) ? stored.purchasedProductIds : [];
  const purchasedProductIds = Array.from(
    new Set(rawProductIds.filter((productId): productId is string => typeof productId === "string" && productId.length > 0)),
  );
  const ownsCaptainPass = stored?.captainPass === true || purchasedProductIds.includes(CAPTAIN_PASS_PRODUCT_ID);
  return {
    captainPass: ownsCaptainPass,
    purchasedProductIds: ownsCaptainPass
      ? Array.from(new Set([...purchasedProductIds, CAPTAIN_PASS_PRODUCT_ID]))
      : purchasedProductIds,
    restoredAt: typeof stored?.restoredAt === "string" ? stored.restoredAt : undefined,
  };
}

export function hasCaptainPass(state: PlayerState): boolean {
  return state.entitlements.captainPass || state.entitlements.purchasedProductIds.includes(CAPTAIN_PASS_PRODUCT_ID);
}

export function isCaptainPassItem(itemId: string): boolean {
  return captainPassItemIds.has(itemId);
}

export function saveSlotCountForState(state: PlayerState): number {
  return hasCaptainPass(state) ? CAPTAIN_PASS_SAVE_SLOT_COUNT : FREE_SAVE_SLOT_COUNT;
}

export function grantProductEntitlement(state: PlayerState, productId: string, restoredAt?: string): PlayerState {
  if (productId !== CAPTAIN_PASS_PRODUCT_ID) {
    return state;
  }

  const entitlements = normalizeEntitlements({
    ...state.entitlements,
    captainPass: true,
    purchasedProductIds: [...state.entitlements.purchasedProductIds, CAPTAIN_PASS_PRODUCT_ID],
    restoredAt: restoredAt ?? state.entitlements.restoredAt,
  });

  return {
    ...state,
    entitlements,
    ownedItemIds: Array.from(new Set([...state.ownedItemIds, CAPTAIN_PASS_BOAT_ID, CAPTAIN_PASS_FLAG_ID])),
  };
}

export function captainPassBenefitLines(): string[] {
  return [
    "저장 슬롯 3개 추가",
    "선장 패스 전용 배와 깃발",
    "원정 기록 보관함",
    "시즌 원정 미리보기",
    "부모용 탐험 리포트",
  ];
}

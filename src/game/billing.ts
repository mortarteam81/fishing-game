import { Capacitor, registerPlugin } from "@capacitor/core";
import {
  billingCopyForPlatform,
  CAPTAIN_PASS_PRODUCT_ID,
  type BillingCopy,
} from "./monetization";

export type BillingProduct = {
  productId: string;
  title: string;
  description: string;
  formattedPrice?: string;
};

export type BillingResult = {
  status: "purchased" | "restored" | "cancelled" | "unavailable" | "error";
  productId?: string;
  purchasedProductIds?: string[];
  message?: string;
};

type BanjjakbadaBillingPlugin = {
  queryProducts: () => Promise<{ products: BillingProduct[] }>;
  purchaseProduct: (options: { productId: string }) => Promise<BillingResult>;
  restorePurchases: () => Promise<BillingResult>;
};

const nativeBilling = registerPlugin<BanjjakbadaBillingPlugin>("BanjjakbadaBilling");

export function getBillingCopy(): BillingCopy {
  return billingCopyForPlatform(Capacitor.getPlatform() === "android" ? "android" : "web");
}

export async function queryCaptainPassProducts(): Promise<BillingProduct[]> {
  if (Capacitor.getPlatform() !== "android") {
    return [webCaptainPassProduct()];
  }

  try {
    const result = await nativeBilling.queryProducts();
    return result.products.length > 0 ? result.products : [webCaptainPassProduct()];
  } catch {
    return [webCaptainPassProduct("Play Console 상품을 불러오지 못했어요")];
  }
}

export async function purchaseCaptainPass(): Promise<BillingResult> {
  if (Capacitor.getPlatform() !== "android") {
    return {
      status: "unavailable",
      productId: CAPTAIN_PASS_PRODUCT_ID,
      message: "로컬 웹에서는 실제 결제를 열지 않아요. 개발용 복원을 사용해 패스 화면을 확인할 수 있어요.",
    };
  }

  try {
    return await nativeBilling.purchaseProduct({ productId: CAPTAIN_PASS_PRODUCT_ID });
  } catch (error) {
    return {
      status: "error",
      productId: CAPTAIN_PASS_PRODUCT_ID,
      message: error instanceof Error ? error.message : "구매를 시작하지 못했어요.",
    };
  }
}

export async function restoreCaptainPass(): Promise<BillingResult> {
  if (Capacitor.getPlatform() !== "android") {
    return {
      status: "restored",
      productId: CAPTAIN_PASS_PRODUCT_ID,
      purchasedProductIds: [CAPTAIN_PASS_PRODUCT_ID],
      message: "개발용 복원으로 선장 패스를 확인했어요.",
    };
  }

  try {
    return await nativeBilling.restorePurchases();
  } catch (error) {
    return {
      status: "error",
      productId: CAPTAIN_PASS_PRODUCT_ID,
      message: error instanceof Error ? error.message : "구매 복원을 확인하지 못했어요.",
    };
  }
}

function webCaptainPassProduct(message = "닫힌 테스트 준비 중"): BillingProduct {
  return {
    productId: CAPTAIN_PASS_PRODUCT_ID,
    title: "선장 패스",
    description: "저장 슬롯, 전용 외형, 원정 기록 보관함을 여는 가족형 패스",
    formattedPrice: message,
  };
}

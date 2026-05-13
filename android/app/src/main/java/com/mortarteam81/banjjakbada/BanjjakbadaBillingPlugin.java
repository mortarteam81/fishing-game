package com.mortarteam81.banjjakbada;

import androidx.annotation.NonNull;

import com.android.billingclient.api.AcknowledgePurchaseParams;
import com.android.billingclient.api.BillingClient;
import com.android.billingclient.api.BillingClientStateListener;
import com.android.billingclient.api.BillingFlowParams;
import com.android.billingclient.api.BillingResult;
import com.android.billingclient.api.PendingPurchasesParams;
import com.android.billingclient.api.ProductDetails;
import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.PurchasesUpdatedListener;
import com.android.billingclient.api.QueryProductDetailsParams;
import com.android.billingclient.api.QueryProductDetailsResult;
import com.android.billingclient.api.QueryPurchasesParams;
import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.util.Collections;
import java.util.List;

@CapacitorPlugin(name = "BanjjakbadaBilling")
public class BanjjakbadaBillingPlugin extends Plugin implements PurchasesUpdatedListener {
    private static final String CAPTAIN_PASS_PRODUCT_ID = "captain_pass_full";

    private BillingClient billingClient;
    private PluginCall pendingPurchaseCall;
    private PluginCall activePurchaseCall;

    @Override
    public void load() {
        billingClient = BillingClient.newBuilder(getContext())
            .setListener(this)
            .enablePendingPurchases(
                PendingPurchasesParams.newBuilder()
                    .enableOneTimeProducts()
                    .build()
            )
            .build();
    }

    @PluginMethod
    public void queryProducts(PluginCall call) {
        connect(call, () -> queryProductDetails(CAPTAIN_PASS_PRODUCT_ID, (billingResult, result) -> {
            if (!isOk(billingResult)) {
                call.reject("상품 정보를 불러오지 못했어요: " + billingResult.getDebugMessage());
                return;
            }

            JSArray products = new JSArray();
            for (ProductDetails details : result.getProductDetailsList()) {
                products.put(productToJson(details));
            }

            JSObject response = new JSObject();
            response.put("products", products);
            call.resolve(response);
        }));
    }

    @PluginMethod
    public void purchaseProduct(PluginCall call) {
        String productId = call.getString("productId", CAPTAIN_PASS_PRODUCT_ID);
        if (!CAPTAIN_PASS_PRODUCT_ID.equals(productId)) {
            call.reject("지원하지 않는 상품이에요.");
            return;
        }
        if (activePurchaseCall != null) {
            call.reject("이미 구매 확인을 진행 중이에요.");
            return;
        }

        activePurchaseCall = call;
        connectForPurchase(call, () -> queryProductDetails(productId, (billingResult, result) -> {
            if (!isOk(billingResult) || result.getProductDetailsList().isEmpty()) {
                rejectPurchaseCall(call, "구매 상품을 찾지 못했어요: " + billingResult.getDebugMessage());
                return;
            }

            ProductDetails details = result.getProductDetailsList().get(0);
            BillingFlowParams.ProductDetailsParams productDetailsParams =
                BillingFlowParams.ProductDetailsParams.newBuilder()
                    .setProductDetails(details)
                    .build();
            BillingFlowParams flowParams = BillingFlowParams.newBuilder()
                .setProductDetailsParamsList(Collections.singletonList(productDetailsParams))
                .build();
            pendingPurchaseCall = call;
            BillingResult launchResult = billingClient.launchBillingFlow(getActivity(), flowParams);
            if (!isOk(launchResult)) {
                rejectPurchaseCall(call, "구매 화면을 열지 못했어요: " + launchResult.getDebugMessage());
            }
        }));
    }

    @PluginMethod
    public void restorePurchases(PluginCall call) {
        connect(call, () -> billingClient.queryPurchasesAsync(
            QueryPurchasesParams.newBuilder()
                .setProductType(BillingClient.ProductType.INAPP)
                .build(),
            (billingResult, purchases) -> {
                if (!isOk(billingResult)) {
                    call.reject("구매 복원을 확인하지 못했어요: " + billingResult.getDebugMessage());
                    return;
                }

                Purchase captainPass = findCaptainPassPurchase(purchases);
                if (captainPass == null) {
                    JSObject response = new JSObject();
                    response.put("status", "unavailable");
                    response.put("message", "복원할 선장 패스 구매 기록이 없어요.");
                    call.resolve(response);
                    return;
                }

                acknowledgeIfNeeded(call, captainPass, true);
            }
        ));
    }

    @Override
    public void onPurchasesUpdated(@NonNull BillingResult billingResult, List<Purchase> purchases) {
        PluginCall call = pendingPurchaseCall;
        pendingPurchaseCall = null;
        if (call == null) {
            return;
        }

        if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.USER_CANCELED) {
            JSObject response = new JSObject();
            response.put("status", "cancelled");
            response.put("message", "구매를 취소했어요.");
            resolveCall(call, response);
            return;
        }

        if (!isOk(billingResult)) {
            JSObject response = new JSObject();
            response.put("status", "error");
            response.put("message", billingResult.getDebugMessage());
            resolveCall(call, response);
            return;
        }

        Purchase captainPass = findCaptainPassPurchase(purchases);
        if (captainPass == null) {
            JSObject response = new JSObject();
            response.put("status", "error");
            response.put("message", "선장 패스 구매 결과를 확인하지 못했어요.");
            resolveCall(call, response);
            return;
        }

        acknowledgeIfNeeded(call, captainPass, false);
    }

    private void connect(PluginCall call, Runnable onReady) {
        connect(call, onReady, false);
    }

    private void connectForPurchase(PluginCall call, Runnable onReady) {
        connect(call, onReady, true);
    }

    private void connect(PluginCall call, Runnable onReady, boolean purchaseCall) {
        if (billingClient != null && billingClient.isReady()) {
            onReady.run();
            return;
        }

        billingClient.startConnection(new BillingClientStateListener() {
            @Override
            public void onBillingSetupFinished(@NonNull BillingResult billingResult) {
                if (isOk(billingResult)) {
                    onReady.run();
                } else {
                    if (purchaseCall) {
                        rejectPurchaseCall(call, "Google Play 결제를 준비하지 못했어요: " + billingResult.getDebugMessage());
                    } else {
                        call.reject("Google Play 결제를 준비하지 못했어요: " + billingResult.getDebugMessage());
                    }
                }
            }

            @Override
            public void onBillingServiceDisconnected() {
                // The next call reconnects. The game keeps the purchase screen open.
            }
        });
    }

    private void queryProductDetails(String productId, ProductDetailsCallback callback) {
        QueryProductDetailsParams.Product product = QueryProductDetailsParams.Product.newBuilder()
            .setProductId(productId)
            .setProductType(BillingClient.ProductType.INAPP)
            .build();
        QueryProductDetailsParams params = QueryProductDetailsParams.newBuilder()
            .setProductList(Collections.singletonList(product))
            .build();
        billingClient.queryProductDetailsAsync(params, callback::onProductDetailsResponse);
    }

    private void rejectPurchaseCall(PluginCall call, String message) {
        finishPurchaseCall(call);
        call.reject(message);
    }

    private void resolveCall(PluginCall call, JSObject response) {
        finishPurchaseCall(call);
        call.resolve(response);
    }

    private void finishPurchaseCall(PluginCall call) {
        if (call == activePurchaseCall) {
            activePurchaseCall = null;
        }
        if (call == pendingPurchaseCall) {
            pendingPurchaseCall = null;
        }
    }

    private void acknowledgeIfNeeded(PluginCall call, Purchase purchase, boolean restored) {
        if (purchase.getPurchaseState() != Purchase.PurchaseState.PURCHASED) {
            JSObject response = new JSObject();
            response.put("status", "error");
            response.put("message", "구매가 아직 완료 상태가 아니에요.");
            resolveCall(call, response);
            return;
        }

        if (purchase.isAcknowledged()) {
            resolveOwned(call, restored);
            return;
        }

        AcknowledgePurchaseParams params = AcknowledgePurchaseParams.newBuilder()
            .setPurchaseToken(purchase.getPurchaseToken())
            .build();
        billingClient.acknowledgePurchase(params, billingResult -> {
            if (isOk(billingResult)) {
                resolveOwned(call, restored);
            } else {
                JSObject response = new JSObject();
                response.put("status", "error");
                response.put("message", "구매 확인을 완료하지 못했어요: " + billingResult.getDebugMessage());
                resolveCall(call, response);
            }
        });
    }

    private void resolveOwned(PluginCall call, boolean restored) {
        JSArray productIds = new JSArray();
        productIds.put(CAPTAIN_PASS_PRODUCT_ID);

        JSObject response = new JSObject();
        response.put("status", restored ? "restored" : "purchased");
        response.put("productId", CAPTAIN_PASS_PRODUCT_ID);
        response.put("purchasedProductIds", productIds);
        response.put("message", restored ? "구매 기록을 복원했어요." : "선장 패스를 구매했어요.");
        resolveCall(call, response);
    }

    private Purchase findCaptainPassPurchase(List<Purchase> purchases) {
        if (purchases == null) {
            return null;
        }
        for (Purchase purchase : purchases) {
            if (purchase.getProducts().contains(CAPTAIN_PASS_PRODUCT_ID)) {
                return purchase;
            }
        }
        return null;
    }

    private JSObject productToJson(ProductDetails details) {
        JSObject product = new JSObject();
        product.put("productId", details.getProductId());
        product.put("title", details.getTitle());
        product.put("description", details.getDescription());
        ProductDetails.OneTimePurchaseOfferDetails offer = details.getOneTimePurchaseOfferDetails();
        if (offer != null) {
            product.put("formattedPrice", offer.getFormattedPrice());
        }
        return product;
    }

    private boolean isOk(BillingResult result) {
        return result.getResponseCode() == BillingClient.BillingResponseCode.OK;
    }

    private interface ProductDetailsCallback {
        void onProductDetailsResponse(BillingResult billingResult, QueryProductDetailsResult result);
    }
}

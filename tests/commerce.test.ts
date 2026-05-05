import { describe, expect, it } from "vitest";
import {
  buyTradeGood,
  canBuyTradeGood,
  deliveredGoodKey,
  getCargoCapacity,
  getMarketQuote,
  routeKey,
  sailToPort,
  sellTradeGood,
} from "../src/game/commerce";
import { createInitialState } from "../src/game/storage";

describe("commerce", () => {
  it("prices trade goods deterministically from market state", () => {
    const state = { ...createInitialState(), level: 80 };
    const first = getMarketQuote(state, "sunrise-port-food", "sunrise-port");
    const second = getMarketQuote(state, "sunrise-port-food", "sunrise-port");

    expect(first?.buyPrice).toBe(second?.buyPrice);
    expect(first?.sellPrice).toBe(second?.sellPrice);
  });

  it("keeps origin buying cheaper than demand-port selling", () => {
    const state = { ...createInitialState(), level: 80 };
    const origin = getMarketQuote(state, "sunrise-port-food", "sunrise-port");
    const demand = getMarketQuote(state, "sunrise-port-food", "mistfjord-port");

    expect(origin?.buyPrice).toBeLessThan(demand?.sellPrice ?? 0);
  });

  it("blocks buying beyond cargo capacity and records profitable sales", () => {
    let state = { ...createInitialState(), level: 80, shells: 10000 };
    expect(getCargoCapacity(state)).toBeGreaterThan(0);
    expect(canBuyTradeGood(state, "sunrise-port-food", 1)).toBe(true);

    for (let index = 0; index < 20; index += 1) {
      state = buyTradeGood(state, "sunrise-port-food", 1);
    }

    expect(canBuyTradeGood(state, "sunrise-port-food", 1)).toBe(false);
    const arrived = sailToPort(state, "mistfjord-port").state;
    const sold = sellTradeGood(arrived, "sunrise-port-food", 1);

    expect(sold.tradeLedger.deliveredGoods[deliveredGoodKey("sunrise-port-food", "mistfjord-port")]).toBe(1);
    expect(sold.tradeRouteHistory[routeKey("sunrise-port", "mistfjord-port")].completed).toBe(1);
    expect(sold.tradeLedger.totalRevenue).toBeGreaterThan(arrived.tradeLedger.totalRevenue);
  });

  it("rough sailing lowers cargo condition without deleting cargo", () => {
    let state = { ...createInitialState(), level: 170, shells: 10000 };
    state = buyTradeGood(state, "sunrise-port-relic", 1);
    const beforeQuantity = state.cargoHold[0]?.quantity ?? 0;
    const outcome = sailToPort(state, "deepcrown-port");

    expect(outcome.state.cargoHold[0]?.quantity).toBe(beforeQuantity);
    expect(outcome.state.cargoHold[0]?.condition).toBeGreaterThanOrEqual(0.55);
  });
});

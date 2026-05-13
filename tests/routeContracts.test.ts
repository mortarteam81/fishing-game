import { describe, expect, it } from "vitest";
import {
  buyTradeGood,
  deliveredGoodKey,
  getTradeGood,
  routeKey,
  sailToPort,
  sellTradeGood,
} from "../src/game/commerce";
import { ports, tradeGoods } from "../src/game/commerceContent";
import { conditionMet, stepLabel, stepProgress, stepTarget } from "../src/game/progression";
import { recordVoyageEventResult } from "../src/game/progression";
import {
  availableRouteContracts,
  completeRouteContract,
  getRouteContract,
  normalizeRouteContractProgress,
  normalizeRouteMilestones,
  routeContractCompleted,
  routeContractEventLabel,
  routeContractHasRequiredCargo,
  routeContractNextAction,
  routeContractRequiredEventCleared,
  routeContractRequiredEventStatus,
  routeContractRequiresGood,
  routeContracts,
  routeContractStage,
  routeMilestoneReached,
  startRouteContract,
} from "../src/game/routeContracts";
import { createInitialState } from "../src/game/storage";
import { voyageEvents } from "../src/game/voyageEvents";

describe("route contracts", () => {
  it("defines exactly 24 valid route contracts", () => {
    const portIds = new Set(ports.map((port) => port.id));
    const goodIds = new Set(tradeGoods.map((good) => good.id));
    const eventIds = new Set(voyageEvents.map((event) => event.id));
    const contractIds = new Set(routeContracts.map((contract) => contract.id));
    const milestoneIds = new Set(routeContracts.map((contract) => contract.milestoneId));

    expect(routeContracts).toHaveLength(24);
    expect(contractIds.size).toBe(routeContracts.length);
    expect(milestoneIds.size).toBe(routeContracts.length);

    for (const contract of routeContracts) {
      expect(portIds.has(contract.fromPortId)).toBe(true);
      expect(portIds.has(contract.toPortId)).toBe(true);
      expect(contract.fromPortId).not.toBe(contract.toPortId);
      expect(goodIds.has(contract.requiredGoodId)).toBe(true);
      expect(getTradeGood(contract.requiredGoodId)?.originPortId).toBe(contract.fromPortId);
      expect(contract.requiredQuantity).toBeGreaterThan(0);
      expect(contract.requiredLevel).toBeGreaterThan(0);
      expect(contract.title).toBeTruthy();
      expect(contract.intro).toBeTruthy();
      expect(contract.successText).toBeTruthy();
      if (contract.requiredEventId) {
        expect(eventIds.has(contract.requiredEventId)).toBe(true);
      }
      if (contract.bonusEventId) {
        expect(eventIds.has(contract.bonusEventId)).toBe(true);
      }
    }
  });

  it("moves from start to buy to sail to sell to claim without deleting unrelated cargo", () => {
    const contract = getRouteContract("route-contract-sunrise-coral-1")!;
    let state = {
      ...createInitialState(),
      level: 30,
      shells: 10000,
      currentPortId: contract.fromPortId,
      visitedPortIds: [contract.fromPortId, contract.toPortId],
    };

    expect(availableRouteContracts(state).map((entry) => entry.id)).toContain(contract.id);
    state = startRouteContract(state, contract.id);

    expect(state.activeRouteContractId).toBe(contract.id);
    expect(routeContractStage(state, contract.id)).toBe("accepted");
    expect(routeContractNextAction(state, contract.id)).toContain("싣");
    expect(routeContractRequiresGood(contract, contract.requiredGoodId)).toBe(true);

    state = buyTradeGood(state, "sunrise-port-craft", 1);
    state = buyTradeGood(state, contract.requiredGoodId, contract.requiredQuantity);

    expect(routeContractStage(state, contract.id)).toBe("cargo-ready");
    expect(state.cargoHold.find((lot) => lot.goodId === "sunrise-port-craft")?.quantity).toBe(1);

    state = sailToPort(state, contract.toPortId).state;
    expect(routeContractStage(state, contract.id)).toBe("sailed");

    state = sellTradeGood(state, contract.requiredGoodId, contract.requiredQuantity);
    expect(routeContractStage(state, contract.id)).toBe("sold");
    expect(state.tradeLedger.deliveredGoods[deliveredGoodKey(contract.requiredGoodId, contract.toPortId)]).toBe(contract.requiredQuantity);
    expect(state.tradeRouteHistory[routeKey(contract.fromPortId, contract.toPortId)]?.completed).toBe(1);

    const claimed = completeRouteContract(state, contract.id);
    expect(routeContractStage(claimed, contract.id)).toBe("claimed");
    expect(routeContractCompleted(claimed, contract.id)).toBe(true);
    expect(routeMilestoneReached(claimed, contract.milestoneId)).toBe(true);
    expect(claimed.activeRouteContractId).toBeUndefined();
    expect(claimed.cargoHold.find((lot) => lot.goodId === "sunrise-port-craft")?.quantity).toBe(1);
    expect(claimed.shells).toBeGreaterThan(state.shells);
  });

  it("allows rough sailing cargo condition to still complete after sale", () => {
    const contract = getRouteContract("route-contract-sunrise-mist-2")!;
    let state = {
      ...createInitialState(),
      level: 80,
      shells: 10000,
      currentPortId: contract.fromPortId,
      visitedPortIds: [contract.fromPortId, contract.toPortId],
      voyageEventHistory: contract.requiredEventId
        ? {
            ...createInitialState().voyageEventHistory,
            [contract.requiredEventId]: { attempts: 1, successes: 1, lastOutcome: "success" as const },
          }
        : createInitialState().voyageEventHistory,
    };

    expect(availableRouteContracts(state).map((entry) => entry.id)).toContain(contract.id);
    state = startRouteContract(state, contract.id);
    state = buyTradeGood(state, contract.requiredGoodId, contract.requiredQuantity);
    state = recordVoyageEventResult(state, contract.requiredEventId!, true);
    state = {
      ...state,
      cargoHold: state.cargoHold.map((lot) =>
        lot.goodId === contract.requiredGoodId ? { ...lot, condition: 0.55 } : lot,
      ),
    };
    state = sailToPort(state, contract.toPortId).state;
    state = sellTradeGood(state, contract.requiredGoodId, contract.requiredQuantity);

    expect(routeContractStage(state, contract.id)).toBe("sold");
    expect(routeContractCompleted(completeRouteContract(state, contract.id), contract.id)).toBe(true);
  });

  it("reports required event progress relative to contract acceptance", () => {
    const contract = getRouteContract("route-contract-sunrise-mist-2")!;
    let state = {
      ...createInitialState(),
      level: 80,
      shells: 10000,
      currentPortId: contract.fromPortId,
      visitedPortIds: [contract.fromPortId, contract.toPortId],
    };

    state = recordVoyageEventResult(state, contract.requiredEventId!, true);
    state = startRouteContract(state, contract.id);

    expect(routeContractRequiredEventStatus(state, contract.id)).toMatchObject({
      eventId: contract.requiredEventId,
      label: "유령 등대",
      required: true,
      cleared: false,
      successesAtStart: 1,
      successes: 1,
    });
    expect(routeContractRequiredEventCleared(state, contract.id)).toBe(false);

    state = recordVoyageEventResult(state, contract.requiredEventId!, true);

    expect(routeContractRequiredEventCleared(state, contract.id)).toBe(true);
    expect(routeContractRequiredEventStatus(state, contract.id)?.cleared).toBe(true);
  });

  it("does not complete required-event contracts when cargo was sold before the event", () => {
    const contract = getRouteContract("route-contract-sunrise-mist-2")!;
    let state = {
      ...createInitialState(),
      level: 80,
      shells: 10000,
      currentPortId: contract.fromPortId,
      visitedPortIds: [contract.fromPortId, contract.toPortId],
    };

    state = startRouteContract(state, contract.id);
    state = buyTradeGood(state, contract.requiredGoodId, contract.requiredQuantity);
    state = sailToPort(state, contract.toPortId).state;
    state = sellTradeGood(state, contract.requiredGoodId, contract.requiredQuantity);

    expect(routeContractStage(state, contract.id)).toBe("sailed");

    state = recordVoyageEventResult(state, contract.requiredEventId!, true);

    expect(routeContractRequiredEventCleared(state, contract.id)).toBe(true);
    expect(routeContractStage(state, contract.id)).toBe("sailed");

    state = sailToPort(state, contract.fromPortId).state;
    state = buyTradeGood(state, contract.requiredGoodId, contract.requiredQuantity);
    state = sailToPort(state, contract.toPortId).state;
    state = sellTradeGood(state, contract.requiredGoodId, contract.requiredQuantity);

    expect(routeContractStage(state, contract.id)).toBe("sold");
  });

  it("exposes UI labels and cargo readiness helpers for contracts", () => {
    const plain = getRouteContract("route-contract-sunrise-coral-1")!;
    const required = getRouteContract("route-contract-sunrise-mist-2")!;
    let state = {
      ...createInitialState(),
      level: 80,
      shells: 10000,
      currentPortId: plain.fromPortId,
      visitedPortIds: [plain.fromPortId, plain.toPortId],
    };

    state = startRouteContract(state, plain.id);
    expect(routeContractEventLabel(required.requiredEventId)).toBe("유령 등대");
    expect(routeContractEventLabel("pirate-crab")).toBe("장난꾸러기 해적게");
    expect(routeContractRequiredEventCleared(state, plain.id)).toBe(true);
    expect(routeContractHasRequiredCargo(state, plain.id)).toBe(false);

    state = buyTradeGood(state, plain.requiredGoodId, plain.requiredQuantity);
    expect(routeContractHasRequiredCargo(state, plain.id)).toBe(true);
  });

  it("supports route contract and milestone story conditions and quest steps", () => {
    const contract = getRouteContract("route-contract-sunrise-coral-1")!;
    let state = {
      ...createInitialState(),
      level: 30,
      shells: 10000,
      currentPortId: contract.fromPortId,
      visitedPortIds: [contract.fromPortId, contract.toPortId],
    };

    state = startRouteContract(state, contract.id);
    state = buyTradeGood(state, contract.requiredGoodId, contract.requiredQuantity);
    state = sailToPort(state, contract.toPortId).state;
    state = sellTradeGood(state, contract.requiredGoodId, contract.requiredQuantity);
    state = completeRouteContract(state, contract.id);

    expect(conditionMet(state, { kind: "routeContractCompleted", contractId: contract.id })).toBe(true);
    expect(conditionMet(state, { kind: "routeMilestoneReached", milestoneId: contract.milestoneId })).toBe(true);
    expect(stepProgress(state, { kind: "routeContractCompleted", contractId: contract.id })).toBe(1);
    expect(stepTarget({ kind: "routeContractCompleted", contractId: contract.id })).toBe(1);
    expect(stepLabel({ kind: "routeMilestoneReached", milestoneId: contract.milestoneId })).toContain("항로");
  });

  it("normalizes route contract progress and milestones", () => {
    expect(normalizeRouteContractProgress({
      "route-contract-sunrise-coral-1": {
        contractId: "route-contract-sunrise-coral-1",
        acceptedAtDay: 2.8,
        deliveredQuantityAtStart: -4,
        routeCompletionsAtStart: 1.2,
        claimed: false,
      },
      "missing-contract": {
        contractId: "missing-contract",
        acceptedAtDay: 1,
        deliveredQuantityAtStart: 0,
        routeCompletionsAtStart: 0,
        claimed: false,
      },
    })).toEqual({
      "route-contract-sunrise-coral-1": {
        contractId: "route-contract-sunrise-coral-1",
        acceptedAtDay: 2,
        deliveredQuantityAtStart: 0,
        routeCompletionsAtStart: 1,
        eventSuccessesAtStart: 0,
        requiredEventDeliveredQuantityAtClear: undefined,
        claimed: false,
      },
    });
    expect(normalizeRouteMilestones({ "route-milestone-sunrise-coral-1": true, missing: true })).toEqual({
      "route-milestone-sunrise-coral-1": true,
    });
  });
});

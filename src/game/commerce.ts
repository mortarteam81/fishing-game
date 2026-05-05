import { getItem } from "./content";
import { ports, tradeGoods } from "./commerceContent";
import type {
  CargoLot,
  MarketState,
  PlayerState,
  PortDefinition,
  StoryCondition,
  TradeGoodDefinition,
  TradeLedger,
  TradeRouteRecord,
} from "./types";

export type MarketQuote = {
  good: TradeGoodDefinition;
  port: PortDefinition;
  buyPrice: number;
  sellPrice: number;
  label: string;
  detail: string;
  trend: "cheap" | "normal" | "expensive" | "hot" | "rare";
};

export type SailOutcome = {
  state: PlayerState;
  message: string;
  rough: boolean;
};

const DEFAULT_PORT_ID = "sunrise-port";
const DEFAULT_MARKET_SEED = 8123;

export function getPort(portId: string | undefined): PortDefinition | undefined {
  return ports.find((port) => port.id === portId);
}

export function getTradeGood(goodId: string | undefined): TradeGoodDefinition | undefined {
  return tradeGoods.find((good) => good.id === goodId);
}

export function defaultCurrentPortId(): string {
  return DEFAULT_PORT_ID;
}

export function createInitialMarketState(day = 1, seed = DEFAULT_MARKET_SEED): MarketState {
  const featuredGoodIdsByPort: Record<string, string> = {};
  const portMoodById: MarketState["portMoodById"] = {};
  const moods: MarketState["portMoodById"][string][] = ["surplus", "steady", "shortage", "festival"];

  for (const port of ports) {
    const candidates = [...port.demandGoodIds, ...port.specialtyGoodIds];
    featuredGoodIdsByPort[port.id] = candidates[Math.abs(hashString(`${seed}:${day}:${port.id}:feature`)) % candidates.length];
    portMoodById[port.id] = moods[Math.abs(hashString(`${seed}:${day}:${port.id}:mood`)) % moods.length];
  }

  return { day, seed, featuredGoodIdsByPort, portMoodById };
}

export function normalizeMarketState(stored: Partial<MarketState> | undefined): MarketState {
  const day = Math.max(1, Math.floor(stored?.day ?? 1));
  const seed = Math.max(1, Math.floor(stored?.seed ?? DEFAULT_MARKET_SEED));
  return createInitialMarketState(day, seed);
}

export function normalizeCargoHold(stored: CargoLot[] | undefined): CargoLot[] {
  return (stored ?? [])
    .map((lot) => ({
      goodId: lot.goodId,
      quantity: Math.max(0, Math.floor(lot.quantity ?? 0)),
      averageCost: Math.max(0, Math.round(lot.averageCost ?? 0)),
      originPortId: lot.originPortId || getTradeGood(lot.goodId)?.originPortId || DEFAULT_PORT_ID,
      condition: clamp(lot.condition ?? 1, 0.55, 1),
    }))
    .filter((lot) => lot.quantity > 0 && Boolean(getTradeGood(lot.goodId)));
}

export function normalizePortReputation(stored: Record<string, number> | undefined): Record<string, number> {
  const reputation: Record<string, number> = {};
  for (const port of ports) {
    reputation[port.id] = Math.max(port.id === DEFAULT_PORT_ID ? 10 : 0, Math.floor(stored?.[port.id] ?? 0));
  }
  return reputation;
}

export function normalizeTradeLedger(stored: Partial<TradeLedger> | undefined): TradeLedger {
  return {
    totalProfit: Math.floor(stored?.totalProfit ?? 0),
    totalRevenue: Math.max(0, Math.floor(stored?.totalRevenue ?? 0)),
    totalSpend: Math.max(0, Math.floor(stored?.totalSpend ?? 0)),
    completedRoutes: Math.max(0, Math.floor(stored?.completedRoutes ?? 0)),
    deliveredGoods: normalizeNumberRecord(stored?.deliveredGoods),
    soldGoodsByPort: normalizeNumberRecord(stored?.soldGoodsByPort),
    bestProfit: Math.max(0, Math.floor(stored?.bestProfit ?? 0)),
  };
}

export function normalizeTradeRouteHistory(
  stored: Record<string, Partial<TradeRouteRecord>> | undefined,
): Record<string, TradeRouteRecord> {
  const history: Record<string, TradeRouteRecord> = {};
  for (const [routeKey, record] of Object.entries(stored ?? {})) {
    history[routeKey] = {
      completed: Math.max(0, Math.floor(record.completed ?? 0)),
      bestProfit: Math.max(0, Math.floor(record.bestProfit ?? 0)),
      lastCompletedDay: Math.max(0, Math.floor(record.lastCompletedDay ?? 0)),
    };
  }
  return history;
}

export function routeKey(fromPortId: string, toPortId: string): string {
  return `${fromPortId}->${toPortId}`;
}

export function deliveredGoodKey(goodId: string, portId: string): string {
  return `${goodId}@${portId}`;
}

export function isPortUnlocked(state: PlayerState, port: PortDefinition): boolean {
  return state.level >= port.requiredLevel && port.requirements?.every((condition) => commerceConditionMet(state, condition)) !== false;
}

export function availablePorts(state: PlayerState): PortDefinition[] {
  return ports.filter((port) => isPortUnlocked(state, port));
}

export function availableTradeGoodsForPort(state: PlayerState, portId = state.currentPortId): TradeGoodDefinition[] {
  const port = getPort(portId) ?? getPort(DEFAULT_PORT_ID)!;
  return tradeGoods
    .filter((good) => good.unlockConditions?.every((condition) => commerceConditionMet(state, condition)) !== false)
    .sort((left, right) => goodSortRank(port, left) - goodSortRank(port, right));
}

export function getCargoCapacity(state: PlayerState): number {
  const boat = getItem(state.equippedBoatId);
  const cosmetic = state.equippedBoatCosmeticId ? getItem(state.equippedBoatCosmeticId) : undefined;
  const boatScale = boat?.kind === "boat" ? Math.min(16, Math.floor((boat.shellCost ?? 0) / 9000)) : 0;
  return 6 + boatScale + (boat?.effect?.cargoCapacity ?? 0) + (cosmetic?.effect?.cargoCapacity ?? 0);
}

export function getUsedCargoVolume(state: PlayerState): number {
  return state.cargoHold.reduce((sum, lot) => sum + lot.quantity * (getTradeGood(lot.goodId)?.volume ?? 1), 0);
}

export function getMarketQuote(
  state: PlayerState,
  goodId: string,
  portId = state.currentPortId,
): MarketQuote | undefined {
  const good = getTradeGood(goodId);
  const port = getPort(portId);
  if (!good || !port) {
    return undefined;
  }

  const buyMultiplier = priceMultiplier(state, good, port, "buy");
  const sellMultiplier = priceMultiplier(state, good, port, "sell");
  const buyPrice = Math.max(1, Math.round(good.basePrice * buyMultiplier));
  const sellPrice = Math.max(1, Math.round(good.basePrice * sellMultiplier));
  const ratio = sellPrice / good.basePrice;
  const mood = state.marketState.portMoodById[port.id] ?? "steady";
  const featured = state.marketState.featuredGoodIdsByPort[port.id] === good.id;
  const trend = featured && ratio >= 1.15 ? "hot" : good.rarity === "legendary" && ratio >= 1.2 ? "rare" : ratio < 0.9 ? "cheap" : ratio > 1.14 ? "expensive" : "normal";
  const label = trend === "cheap" ? "싸요" : trend === "expensive" ? "비싸요" : trend === "hot" ? "오늘 인기" : trend === "rare" ? "희귀 수요" : "보통";
  const detail = `${marketMoodLabel(mood)} · 매입 ${buyPrice} / 매도 ${sellPrice}`;
  return { good, port, buyPrice, sellPrice, label, detail, trend };
}

export function canBuyTradeGood(state: PlayerState, goodId: string, quantity = 1): boolean {
  const quote = getMarketQuote(state, goodId);
  const good = quote?.good;
  if (!quote || !good || quantity <= 0) {
    return false;
  }
  return state.shells >= quote.buyPrice * quantity && getUsedCargoVolume(state) + good.volume * quantity <= getCargoCapacity(state);
}

export function buyTradeGood(state: PlayerState, goodId: string, quantity = 1): PlayerState {
  const quote = getMarketQuote(state, goodId);
  if (!quote || !canBuyTradeGood(state, goodId, quantity)) {
    return state;
  }

  const cost = quote.buyPrice * quantity;
  const currentLot = state.cargoHold.find((lot) => lot.goodId === goodId && lot.originPortId === state.currentPortId);
  const cargoHold = currentLot
    ? state.cargoHold.map((lot) => {
        if (lot !== currentLot) {
          return lot;
        }
        const totalQuantity = lot.quantity + quantity;
        return {
          ...lot,
          quantity: totalQuantity,
          averageCost: Math.round((lot.averageCost * lot.quantity + cost) / totalQuantity),
          condition: Math.min(1, (lot.condition * lot.quantity + quantity) / totalQuantity),
        };
      })
    : [
        ...state.cargoHold,
        {
          goodId,
          quantity,
          averageCost: quote.buyPrice,
          originPortId: state.currentPortId,
          condition: 1,
        },
      ];

  return advanceMarketDay({
    ...state,
    shells: state.shells - cost,
    cargoHold,
    tradeLedger: {
      ...state.tradeLedger,
      totalSpend: state.tradeLedger.totalSpend + cost,
    },
  });
}

export function sellTradeGood(state: PlayerState, goodId: string, quantity = 1): PlayerState {
  const quote = getMarketQuote(state, goodId);
  if (!quote || quantity <= 0) {
    return state;
  }

  let remaining = quantity;
  let revenue = 0;
  let costBasis = 0;
  let originPortId = quote.good.originPortId;
  const cargoHold: CargoLot[] = [];

  for (const lot of state.cargoHold) {
    if (lot.goodId !== goodId || remaining <= 0) {
      cargoHold.push(lot);
      continue;
    }

    const sold = Math.min(remaining, lot.quantity);
    remaining -= sold;
    originPortId = lot.originPortId;
    revenue += Math.round(quote.sellPrice * lot.condition) * sold;
    costBasis += lot.averageCost * sold;
    if (lot.quantity > sold) {
      cargoHold.push({ ...lot, quantity: lot.quantity - sold });
    }
  }

  if (remaining > 0) {
    return state;
  }

  const profit = revenue - costBasis;
  const deliveredKey = deliveredGoodKey(goodId, state.currentPortId);
  const soldByPort = deliveredGoodKey(goodId, state.currentPortId);
  const currentRouteKey = routeKey(originPortId, state.currentPortId);
  const currentRoute = state.tradeRouteHistory[currentRouteKey] ?? { completed: 0, bestProfit: 0, lastCompletedDay: 0 };
  const reputationGain = Math.max(1, Math.floor(Math.max(0, profit) / 260) + (quote.good.demandPortIds.includes(state.currentPortId) ? 2 : 0));
  const next = addPortReputation({
    ...state,
    shells: state.shells + revenue,
    cargoHold,
    tradeLedger: {
      ...state.tradeLedger,
      totalRevenue: state.tradeLedger.totalRevenue + revenue,
      totalProfit: state.tradeLedger.totalProfit + profit,
      completedRoutes: originPortId !== state.currentPortId ? state.tradeLedger.completedRoutes + 1 : state.tradeLedger.completedRoutes,
      bestProfit: Math.max(state.tradeLedger.bestProfit, profit),
      deliveredGoods: {
        ...state.tradeLedger.deliveredGoods,
        [deliveredKey]: (state.tradeLedger.deliveredGoods[deliveredKey] ?? 0) + quantity,
      },
      soldGoodsByPort: {
        ...state.tradeLedger.soldGoodsByPort,
        [soldByPort]: (state.tradeLedger.soldGoodsByPort[soldByPort] ?? 0) + quantity,
      },
    },
    tradeRouteHistory: originPortId !== state.currentPortId
      ? {
          ...state.tradeRouteHistory,
          [currentRouteKey]: {
            completed: currentRoute.completed + 1,
            bestProfit: Math.max(currentRoute.bestProfit, profit),
            lastCompletedDay: state.marketState.day,
          },
        }
      : state.tradeRouteHistory,
  }, state.currentPortId, reputationGain);

  return advanceMarketDay(next);
}

export function sailToPort(state: PlayerState, destinationPortId: string): SailOutcome {
  const destination = getPort(destinationPortId);
  const origin = getPort(state.currentPortId) ?? getPort(DEFAULT_PORT_ID)!;
  if (!destination || !isPortUnlocked(state, destination)) {
    return { state, message: "아직 갈 수 없는 항구예요.", rough: false };
  }
  if (destination.id === state.currentPortId) {
    return { state, message: `${destination.name}에 머무르고 있어요.`, rough: false };
  }

  const distance = portDistance(origin, destination);
  const risk = Math.max(0.04, Math.min(0.38, distance / 5200 - getRouteRiskReduction(state)));
  const roll = normalizedHash(`${state.marketState.seed}:${state.marketState.day}:${origin.id}:${destination.id}:risk`);
  const rough = roll < risk && state.cargoHold.length > 0;
  const cargoHold = rough
    ? state.cargoHold.map((lot) => ({ ...lot, condition: clamp(lot.condition - 0.09, 0.55, 1) }))
    : state.cargoHold;
  const next = addPortReputation(advanceMarketDay({
    ...state,
    currentPortId: destination.id,
    visitedPortIds: Array.from(new Set([...state.visitedPortIds, destination.id])),
    cargoHold,
  }), destination.id, rough ? 1 : 3);

  return {
    state: next,
    rough,
    message: rough
      ? `${destination.name} 도착. 거친 항로 때문에 화물 가치가 조금 낮아졌어요.`
      : `${destination.name} 도착. 항로 기록과 평판이 올랐어요.`,
  };
}

export function addPortReputation(state: PlayerState, portId: string, amount: number): PlayerState {
  if (!getPort(portId) || amount <= 0) {
    return state;
  }
  return {
    ...state,
    portReputation: {
      ...state.portReputation,
      [portId]: Math.max(0, Math.floor((state.portReputation[portId] ?? 0) + amount)),
    },
  };
}

function advanceMarketDay(state: PlayerState): PlayerState {
  return {
    ...state,
    marketState: createInitialMarketState(state.marketState.day + 1, state.marketState.seed),
  };
}

function priceMultiplier(
  state: PlayerState,
  good: TradeGoodDefinition,
  port: PortDefinition,
  mode: "buy" | "sell",
): number {
  const origin = good.originPortId === port.id;
  const demand = good.demandPortIds.includes(port.id) || port.demandGoodIds.includes(good.id);
  const featured = state.marketState.featuredGoodIdsByPort[port.id] === good.id;
  const mood = state.marketState.portMoodById[port.id] ?? "steady";
  const baseSupplyDemand = mode === "buy"
    ? origin ? 0.72 : demand ? 1.17 : 1.02
    : origin ? 0.62 : demand ? 1.42 : 0.98;
  const moodMultiplier = mood === "surplus"
    ? mode === "buy" ? 0.88 : 0.92
    : mood === "shortage"
      ? mode === "buy" ? 1.14 : 1.2
      : mood === "festival" && (good.category === "festival" || good.category === "relic")
        ? mode === "buy" ? 1.08 : 1.26
        : 1;
  const featureMultiplier = featured ? (mode === "sell" ? 1.18 : 1.08) : 1;
  const distanceMultiplier = mode === "sell" && !origin
    ? 1 + Math.min(0.28, portDistanceById(good.originPortId, port.id) / 9000)
    : 1;
  const reputation = state.portReputation[port.id] ?? 0;
  const reputationMultiplier = mode === "buy"
    ? 1 - Math.min(0.12, reputation * 0.0015 + getMarketInsight(state))
    : 1 + Math.min(0.18, reputation * 0.0017 + getTradeBonus(state));
  const fluctuation = 1 + (normalizedHash(`${state.marketState.seed}:${state.marketState.day}:${port.id}:${good.id}`) * 2 - 1) * good.volatility;
  return Math.max(0.32, baseSupplyDemand * moodMultiplier * featureMultiplier * distanceMultiplier * reputationMultiplier * fluctuation);
}

function goodSortRank(port: PortDefinition, good: TradeGoodDefinition): number {
  if (good.originPortId === port.id) {
    return 0;
  }
  if (port.demandGoodIds.includes(good.id) || good.demandPortIds.includes(port.id)) {
    return 1;
  }
  return 2;
}

function getTradeBonus(state: PlayerState): number {
  return (
    (getItem(state.equippedBoatId)?.effect?.tradeBonus ?? 0) +
    (state.equippedBoatCosmeticId ? (getItem(state.equippedBoatCosmeticId)?.effect?.tradeBonus ?? 0) : 0)
  );
}

function getRouteRiskReduction(state: PlayerState): number {
  return (
    (getItem(state.equippedBoatId)?.effect?.routeRiskReduction ?? 0) +
    (state.equippedBoatCosmeticId ? (getItem(state.equippedBoatCosmeticId)?.effect?.routeRiskReduction ?? 0) : 0)
  );
}

function getMarketInsight(state: PlayerState): number {
  return (
    (getItem(state.equippedBoatId)?.effect?.marketInsight ?? 0) +
    (state.equippedBoatCosmeticId ? (getItem(state.equippedBoatCosmeticId)?.effect?.marketInsight ?? 0) : 0)
  );
}

function commerceConditionMet(state: PlayerState, condition: StoryCondition): boolean {
  switch (condition.kind) {
    case "levelAtLeast":
      return state.level >= condition.level;
    case "questClaimed":
      return state.questProgress[condition.questId]?.claimed === true;
    case "storyFlag":
      return (state.storyFlags[condition.flag] ?? false) === (condition.value ?? true);
    case "notStoryFlag":
      return !state.storyFlags[condition.flag];
    case "portVisited":
      return state.visitedPortIds.includes(condition.portId);
    case "portReputationAtLeast":
      return (state.portReputation[condition.portId] ?? 0) >= condition.reputation;
    case "tradeProfitAtLeast":
      return state.tradeLedger.totalProfit >= condition.profit;
    case "completeTradeRoute":
      return (state.tradeRouteHistory[routeKey(condition.fromPortId, condition.toPortId)]?.completed ?? 0) >= condition.count;
    default:
      return true;
  }
}

function marketMoodLabel(mood: MarketState["portMoodById"][string]): string {
  switch (mood) {
    case "surplus":
      return "재고 넉넉";
    case "shortage":
      return "수요 급등";
    case "festival":
      return "항구 축제";
    default:
      return "안정 시장";
  }
}

function normalizeNumberRecord(value: Record<string, number> | undefined): Record<string, number> {
  return Object.fromEntries(
    Object.entries(value ?? {})
      .map(([key, count]): [string, number] => [key, Math.max(0, Math.floor(count ?? 0))])
      .filter(([, count]) => count > 0),
  );
}

function portDistanceById(leftPortId: string, rightPortId: string): number {
  const left = getPort(leftPortId);
  const right = getPort(rightPortId);
  return left && right ? portDistance(left, right) : 0;
}

function portDistance(left: PortDefinition, right: PortDefinition): number {
  return Math.hypot(left.position.x - right.position.x, left.position.y - right.position.y);
}

function normalizedHash(value: string): number {
  return (Math.abs(hashString(value)) % 10000) / 10000;
}

function hashString(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) | 0;
  }
  return hash;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

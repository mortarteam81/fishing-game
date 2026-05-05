import type { PortDefinition } from "./types";

export type PortMarkerShape =
  | "sunLighthouse"
  | "coralCrane"
  | "mistBeacon"
  | "kelpCanopy"
  | "basaltShipyard"
  | "pearlArch"
  | "stormCompass"
  | "auroraTower"
  | "starwhaleDome"
  | "deepCrownGate";

export type PortVisualDefinition = {
  portId: string;
  markerShape: PortMarkerShape;
  landmark: string;
  paletteRole: "warm" | "craft" | "mist" | "market" | "basalt" | "pearl" | "storm" | "aurora" | "starwhale" | "deep";
  interiorTextureKey: string;
  markerTextureKey: string;
  arrivalLine: string;
  canvaNotes: string;
};

export const portVisuals: Record<string, PortVisualDefinition> = {
  "sunrise-port": {
    portId: "sunrise-port",
    markerShape: "sunLighthouse",
    landmark: "햇살 등대",
    paletteRole: "warm",
    interiorTextureKey: "port-interior-sunrise-port",
    markerTextureKey: "port-marker-sunrise-port",
    arrivalLine: "등대 불빛이 잔잔한 푸른만을 비춰요.",
    canvaNotes: "밝은 출발항, 따뜻한 금빛, 낮은 방파제, 초심자 친화",
  },
  "coralworks-port": {
    portId: "coralworks-port",
    markerShape: "coralCrane",
    landmark: "산호 공방 크레인",
    paletteRole: "craft",
    interiorTextureKey: "port-interior-coralworks-port",
    markerTextureKey: "port-marker-coralworks-port",
    arrivalLine: "산호 장인들의 붉은 크레인이 물가에서 천천히 움직여요.",
    canvaNotes: "공방, 산호빛 지붕, 작업대, 수공예 실루엣",
  },
  "mistfjord-port": {
    portId: "mistfjord-port",
    markerShape: "mistBeacon",
    landmark: "안개 봉화탑",
    paletteRole: "mist",
    interiorTextureKey: "port-interior-mistfjord-port",
    markerTextureKey: "port-marker-mistfjord-port",
    arrivalLine: "안개 사이로 봉화탑의 은은한 불빛이 항로를 열어요.",
    canvaNotes: "회청 안개, 높은 봉화탑, 흐린 산맥, 조용한 탐사감",
  },
  "kelpmarket-port": {
    portId: "kelpmarket-port",
    markerShape: "kelpCanopy",
    landmark: "해초 시장 천막",
    paletteRole: "market",
    interiorTextureKey: "port-interior-kelpmarket-port",
    markerTextureKey: "port-marker-kelpmarket-port",
    arrivalLine: "초록 해초 천막 아래 향료와 생태 연구품이 오가요.",
    canvaNotes: "초록 해초 숲, 시장 천막, 바구니, 느긋한 교역",
  },
  "basalt-shipyard": {
    portId: "basalt-shipyard",
    markerShape: "basaltShipyard",
    landmark: "현무암 조선소",
    paletteRole: "basalt",
    interiorTextureKey: "port-interior-basalt-shipyard",
    markerTextureKey: "port-marker-basalt-shipyard",
    arrivalLine: "검은 절벽 아래 두꺼운 선체와 닻이 줄지어 있어요.",
    canvaNotes: "검은 절벽, 조선소, 강한 선체, 따뜻한 용광로빛",
  },
  "pearlbay-port": {
    portId: "pearlbay-port",
    markerShape: "pearlArch",
    landmark: "진주 아치",
    paletteRole: "pearl",
    interiorTextureKey: "port-interior-pearlbay-port",
    markerTextureKey: "port-marker-pearlbay-port",
    arrivalLine: "진주빛 아치가 석호 위에 반짝이고 축제 깃발이 흔들려요.",
    canvaNotes: "진주 석호, 축제, 우아한 아치, 밝은 반사광",
  },
  "stormcompass-port": {
    portId: "stormcompass-port",
    markerShape: "stormCompass",
    landmark: "폭풍 나침탑",
    paletteRole: "storm",
    interiorTextureKey: "port-interior-stormcompass-port",
    markerTextureKey: "port-marker-stormcompass-port",
    arrivalLine: "먹구름 속 나침탑이 위험 항로를 조심스럽게 가리켜요.",
    canvaNotes: "폭풍, 나침탑, 안전한 가족형 긴장감, 강한 바람",
  },
  "aurora-tradepost": {
    portId: "aurora-tradepost",
    markerShape: "auroraTower",
    landmark: "극광 전망대",
    paletteRole: "aurora",
    interiorTextureKey: "port-interior-aurora-tradepost",
    markerTextureKey: "port-marker-aurora-tradepost",
    arrivalLine: "오로라가 전망대 유리 위로 길게 흘러요.",
    canvaNotes: "극광, 투명 전망대, 변이 연구, 신비로운 축제",
  },
  "starwhale-observatory": {
    portId: "starwhale-observatory",
    markerShape: "starwhaleDome",
    landmark: "별고래 관측돔",
    paletteRole: "starwhale",
    interiorTextureKey: "port-interior-starwhale-observatory",
    markerTextureKey: "port-marker-starwhale-observatory",
    arrivalLine: "관측돔 너머 별고래 항로의 빛무리가 지나가요.",
    canvaNotes: "관측돔, 별빛 부표, 고래류 연구, 밤하늘",
  },
  "deepcrown-port": {
    portId: "deepcrown-port",
    markerShape: "deepCrownGate",
    landmark: "심해 왕관문",
    paletteRole: "deep",
    interiorTextureKey: "port-interior-deepcrown-port",
    markerTextureKey: "port-marker-deepcrown-port",
    arrivalLine: "심해 왕관문 아래 고대 유물의 푸른 빛이 깨어나요.",
    canvaNotes: "고대 왕관문, 심해 청록광, 최후반 항구, 장엄하지만 무섭지 않게",
  },
};

export function getPortVisual(port: Pick<PortDefinition, "id">): PortVisualDefinition {
  return portVisuals[port.id] ?? portVisuals["sunrise-port"];
}

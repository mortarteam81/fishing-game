import type {
  AreaDefinition,
  FishDefinition,
  ItemDefinition,
  QuestDefinition,
  SeaFriendBehavior,
  SeaFriendFamily,
  SeaFriendHabitat,
  SeaFriendSize,
  StoryChoiceDefinition,
} from "./types";
import { decorateGearItem } from "./gearRoles";

type FishDraft = Omit<FishDefinition, "family" | "habitatTags" | "size" | "behaviorTags"> &
  Partial<Pick<FishDefinition, "family" | "habitatTags" | "size" | "behaviorTags">>;

const baseFish: FishDraft[] = [
  {
    id: "sunny-minnow",
    name: "햇살 송사리",
    areaIds: ["sunny-beach"],
    rarity: "common",
    baseShells: 8,
    xp: 8,
    spawnWeight: 38,
    funFact: "햇빛이 비치면 비늘이 반짝여요.",
    assetKey: "fish-sunny-minnow",
  },
  {
    id: "bubble-flounder",
    name: "방울 가자미",
    areaIds: ["sunny-beach"],
    rarity: "common",
    baseShells: 10,
    xp: 9,
    spawnWeight: 30,
    funFact: "모래 위에서 숨바꼭질을 잘해요.",
    assetKey: "fish-bubble-flounder",
  },
  {
    id: "sand-shrimp",
    name: "모래 새우",
    areaIds: ["sunny-beach"],
    rarity: "common",
    baseShells: 9,
    xp: 8,
    spawnWeight: 28,
    funFact: "꼬리를 톡톡 튕기며 모래 위를 날아다녀요.",
    assetKey: "fish-sand-shrimp",
  },
  {
    id: "peach-seahorse",
    name: "복숭아 해마",
    areaIds: ["sunny-beach"],
    rarity: "uncommon",
    baseShells: 18,
    xp: 15,
    spawnWeight: 15,
    funFact: "작은 산호잎을 붙잡고 살랑살랑 춤춰요.",
    assetKey: "fish-peach-seahorse",
  },
  {
    id: "ribbon-squid",
    name: "리본 오징어",
    areaIds: ["sunny-beach", "little-pier"],
    rarity: "uncommon",
    baseShells: 16,
    xp: 14,
    spawnWeight: 18,
    funFact: "팔을 흔들며 인사하는 걸 좋아해요.",
    assetKey: "fish-ribbon-squid",
  },
  {
    id: "moon-jelly",
    name: "달빛 해파리",
    areaIds: ["sunny-beach", "little-pier"],
    rarity: "uncommon",
    baseShells: 19,
    xp: 16,
    spawnWeight: 14,
    funFact: "밤바다에서는 작은 달처럼 은은하게 빛나요.",
    assetKey: "fish-moon-jelly",
  },
  {
    id: "harbor-mackerel",
    name: "항구 고등어",
    areaIds: ["little-pier"],
    rarity: "common",
    baseShells: 14,
    xp: 12,
    spawnWeight: 35,
    funFact: "항구의 물결을 따라 빠르게 헤엄쳐요.",
    assetKey: "fish-harbor-mackerel",
  },
  {
    id: "shell-crab",
    name: "조개 게",
    areaIds: ["little-pier"],
    rarity: "uncommon",
    baseShells: 20,
    xp: 17,
    spawnWeight: 22,
    funFact: "작은 조개껍데기를 모자처럼 쓰고 다녀요.",
    assetKey: "fish-shell-crab",
  },
  {
    id: "drum-octopus",
    name: "북치는 문어",
    areaIds: ["little-pier"],
    rarity: "uncommon",
    baseShells: 23,
    xp: 19,
    spawnWeight: 18,
    funFact: "다리로 통통 리듬을 만들며 친구들을 불러요.",
    assetKey: "fish-drum-octopus",
  },
  {
    id: "sleepy-ray",
    name: "꾸벅 가오리",
    areaIds: ["little-pier"],
    rarity: "rare",
    baseShells: 36,
    xp: 28,
    spawnWeight: 8,
    funFact: "넓은 지느러미로 이불처럼 바다 모래를 덮어요.",
    assetKey: "fish-sleepy-ray",
  },
  {
    id: "candy-puffer",
    name: "사탕 복어",
    areaIds: ["little-pier", "coral-sea"],
    rarity: "uncommon",
    baseShells: 27,
    xp: 22,
    spawnWeight: 16,
    funFact: "놀라면 동그랗게 부풀어 사탕처럼 보여요.",
    assetKey: "fish-candy-puffer",
  },
  {
    id: "starfish-pal",
    name: "별친구 불가사리",
    areaIds: ["little-pier", "coral-sea"],
    rarity: "rare",
    baseShells: 32,
    xp: 26,
    spawnWeight: 9,
    funFact: "밤이 되면 별처럼 반짝이는 친구예요.",
    assetKey: "fish-starfish-pal",
  },
  {
    id: "coral-tang",
    name: "산호 탱글이",
    areaIds: ["coral-sea"],
    rarity: "common",
    baseShells: 22,
    xp: 18,
    spawnWeight: 32,
    funFact: "산호 사이를 통통 튀듯 움직여요.",
    assetKey: "fish-coral-tang",
  },
  {
    id: "ribbon-eel",
    name: "리본 장어",
    areaIds: ["coral-sea"],
    rarity: "common",
    baseShells: 24,
    xp: 20,
    spawnWeight: 24,
    funFact: "긴 몸으로 파도 무늬를 그리며 헤엄쳐요.",
    assetKey: "fish-ribbon-eel",
  },
  {
    id: "pearl-clam",
    name: "진주 조개",
    areaIds: ["coral-sea"],
    rarity: "rare",
    baseShells: 46,
    xp: 35,
    spawnWeight: 10,
    funFact: "기분이 좋으면 조개껍데기 사이로 빛을 내요.",
    assetKey: "fish-pearl-clam",
  },
  {
    id: "pearl-turtle",
    name: "진주 거북",
    areaIds: ["coral-sea"],
    rarity: "rare",
    baseShells: 44,
    xp: 34,
    spawnWeight: 12,
    funFact: "등껍질에 작은 진주빛 무늬가 있어요.",
    assetKey: "fish-pearl-turtle",
  },
  {
    id: "lantern-angler",
    name: "초롱 아귀",
    areaIds: ["coral-sea"],
    rarity: "rare",
    baseShells: 50,
    xp: 38,
    spawnWeight: 7,
    funFact: "머리 위 초롱불로 어두운 산호길을 밝혀요.",
    assetKey: "fish-lantern-angler",
  },
  {
    id: "sea-bunny",
    name: "바다 토끼",
    areaIds: ["coral-sea"],
    rarity: "mythic",
    baseShells: 72,
    xp: 54,
    spawnWeight: 4,
    funFact: "토끼 귀 같은 더듬이로 반짝 소리를 들어요.",
    assetKey: "fish-sea-bunny",
  },
  {
    id: "rainbow-whale",
    name: "무지개 아기고래",
    areaIds: ["coral-sea"],
    rarity: "legendary",
    baseShells: 80,
    xp: 60,
    spawnWeight: 3,
    funFact: "아주 특별한 날, 바다 위에 무지개 물방울을 만들어요.",
    assetKey: "fish-rainbow-whale",
  },
];

type ExtraAreaBlueprint = {
  id: string;
  name: string;
  requiredLevel: number;
  theme: AreaDefinition["theme"];
  mapTexture: string;
  flavor: string;
  prefixes: readonly string[];
  habitat: string;
};

const extraAreaBlueprints = [
  {
    id: "misty-fjord",
    name: "안개 협만",
    requiredLevel: 7,
    theme: "mist",
    mapTexture: "map-fjord",
    flavor: "낮은 안개와 회색 절벽 사이로 잔잔한 물길이 이어져요.",
    prefixes: ["안개", "은비늘", "자작", "서리", "물안개", "회청", "새벽", "유리", "숨결", "협만"],
    habitat: "흐린 수면 아래",
  },
  {
    id: "kelp-forest",
    name: "해초 숲길",
    requiredLevel: 9,
    theme: "kelp",
    mapTexture: "map-kelp",
    flavor: "키 큰 해초가 물결을 따라 숲처럼 흔들리는 길이에요.",
    prefixes: ["해초", "초록", "잎새", "비취", "숲그늘", "말미잘", "줄기", "연둣빛", "풀결", "해풍"],
    habitat: "짙은 해초 줄기 사이",
  },
  {
    id: "basalt-cove",
    name: "현무암 후미",
    requiredLevel: 11,
    theme: "basalt",
    mapTexture: "map-basalt",
    flavor: "검은 바위와 하얀 포말이 강한 대비를 이루는 조용한 후미예요.",
    prefixes: ["현무암", "흑요", "포말", "바위", "검푸른", "파편", "절벽", "먹빛", "소금", "그늘"],
    habitat: "검은 바위 틈",
  },
  {
    id: "pearl-lagoon",
    name: "진주 석호",
    requiredLevel: 13,
    theme: "pearl",
    mapTexture: "map-lagoon",
    flavor: "얕은 물빛이 진주처럼 퍼지고 작은 모래톱이 반짝여요.",
    prefixes: ["진주", "백사", "물빛", "조개", "분홍", "은모래", "흰물결", "비단", "석호", "윤슬"],
    habitat: "따뜻한 모래톱 주변",
  },
  {
    id: "storm-bank",
    name: "먹구름 여울",
    requiredLevel: 15,
    theme: "storm",
    mapTexture: "map-storm",
    flavor: "멀리 천둥이 울리고 짙은 물결이 힘차게 부서지는 곳이에요.",
    prefixes: ["먹구름", "천둥", "번개", "강풍", "비늘비", "먹물", "소용돌이", "폭우", "검파도", "바람"],
    habitat: "거친 여울 가장자리",
  },
  {
    id: "moonlit-current",
    name: "달빛 조류",
    requiredLevel: 17,
    theme: "moon",
    mapTexture: "map-moon",
    flavor: "밤바다의 물길이 은색 띠처럼 흐르는 신비로운 해역이에요.",
    prefixes: ["달빛", "은하", "초승", "별가루", "밤물", "자정", "달무리", "은조류", "몽환", "월영"],
    habitat: "은색 조류 속",
  },
  {
    id: "amber-archipelago",
    name: "호박빛 군도",
    requiredLevel: 19,
    theme: "amber",
    mapTexture: "map-amber",
    flavor: "해질녘 섬 그림자와 호박빛 바다가 길게 이어지는 군도예요.",
    prefixes: ["호박", "노을", "금귤", "석양", "황금", "따스한", "등대", "갈매빛", "귤빛", "해넘이"],
    habitat: "노을 물든 얕은 암초",
  },
  {
    id: "glacier-shelf",
    name: "빙하 선반",
    requiredLevel: 21,
    theme: "glacier",
    mapTexture: "map-glacier",
    flavor: "맑고 차가운 물 위로 푸른 빙하 조각이 천천히 떠다녀요.",
    prefixes: ["빙하", "서릿빛", "얼음", "청빙", "눈결", "차가운", "북극", "수정", "흰숨", "빙정"],
    habitat: "투명한 얼음 그늘",
  },
  {
    id: "lantern-trench",
    name: "초롱 해구",
    requiredLevel: 23,
    theme: "trench",
    mapTexture: "map-trench",
    flavor: "깊은 바다의 작은 빛들이 길잡이처럼 깜박이는 해구예요.",
    prefixes: ["초롱", "심해", "남빛", "등불", "그윽한", "흑청", "불씨", "고요", "깊은", "반딧"],
    habitat: "작은 빛이 모인 깊은 물길",
  },
  {
    id: "aurora-reef",
    name: "오로라 외해초",
    requiredLevel: 25,
    theme: "aurora",
    mapTexture: "map-aurora",
    flavor: "먼 바다 산호 위로 오로라빛 물결이 춤추는 최고급 낚시터예요.",
    prefixes: ["오로라", "극광", "무지개", "성운", "찬란한", "환상", "빛무리", "프리즘", "여명", "별빛"],
    habitat: "오로라빛 산호 사이",
  },
] as const satisfies readonly ExtraAreaBlueprint[];

const seaFriendSpecies = [
  { slug: "drifter", name: "드리프터", rarity: "common", base: 36, xp: 26, weight: 34 },
  { slug: "needlefish", name: "바늘고기", rarity: "common", base: 38, xp: 27, weight: 30 },
  { slug: "veil-ray", name: "베일가오리", rarity: "uncommon", base: 52, xp: 36, weight: 18 },
  { slug: "comet-squid", name: "혜성오징어", rarity: "uncommon", base: 58, xp: 39, weight: 16 },
  { slug: "mosaic-crab", name: "모자이크게", rarity: "uncommon", base: 61, xp: 41, weight: 15 },
  { slug: "lantern-eel", name: "등불장어", rarity: "rare", base: 82, xp: 55, weight: 9 },
  { slug: "velvet-turtle", name: "벨벳거북", rarity: "rare", base: 88, xp: 58, weight: 8 },
  { slug: "crown-clam", name: "왕관조개", rarity: "epic", base: 94, xp: 62, weight: 7 },
  { slug: "skywhale", name: "하늘고래", rarity: "mythic", base: 128, xp: 82, weight: 4 },
  { slug: "mythic-nudibranch", name: "환상갯민숭달팽이", rarity: "mythic", base: 140, xp: 88, weight: 3 },
] as const;

const generatedFish: FishDraft[] = extraAreaBlueprints.flatMap((area, areaIndex) =>
  seaFriendSpecies.map((species, speciesIndex) => ({
    id: `${area.id}-${species.slug}`,
    name: `${area.prefixes[speciesIndex]} ${species.name}`,
    areaIds: [area.id],
    rarity: species.rarity,
    baseShells: species.base + areaIndex * 8 + speciesIndex * 2,
    xp: species.xp + areaIndex * 5 + Math.floor(speciesIndex * 1.5),
    spawnWeight: Math.max(2, species.weight - Math.floor(areaIndex / 3)),
    funFact: `${area.name}의 ${area.habitat}에서 독특한 무늬를 뽐내는 바다 친구예요.`,
    assetKey: `fish-${area.id}-${species.slug}`,
  })),
);

const legendAreasBlueprints = [
  {
    id: "starlit-offshore",
    name: "별모래 외해",
    requiredLevel: 51,
    theme: "moon",
    mapTexture: "map-starlit",
    flavor: "멀리 떨어진 외해에 별모래가 흩뿌려져 밤에도 항로가 반짝여요.",
  },
  {
    id: "glass-trench",
    name: "유리 해연",
    requiredLevel: 56,
    theme: "trench",
    mapTexture: "map-glass-trench",
    flavor: "투명한 해연 벽 너머로 오래된 빛과 깊은 그림자가 겹쳐 보여요.",
  },
  {
    id: "tempest-pass",
    name: "폭풍나침 해협",
    requiredLevel: 62,
    theme: "storm",
    mapTexture: "map-tempest-pass",
    flavor: "나침반이 빙글 도는 거친 물길. 강한 장비와 침착한 릴링이 필요해요.",
  },
  {
    id: "temporal-garden",
    name: "시간 산호정원",
    requiredLevel: 68,
    theme: "pearl",
    mapTexture: "map-temporal-garden",
    flavor: "느리게 자라는 산호가 시간의 결처럼 층층이 빛나는 정원이에요.",
  },
  {
    id: "aurora-crown",
    name: "극광 왕관해",
    requiredLevel: 75,
    theme: "aurora",
    mapTexture: "map-aurora-crown",
    flavor: "오로라가 왕관처럼 펼쳐지는 최상위 외해. 전설의 소문이 모이는 곳이에요.",
  },
] as const satisfies readonly Pick<AreaDefinition, "id" | "name" | "requiredLevel" | "theme" | "mapTexture" | "flavor">[];

const legendFish: FishDraft[] = [
  {
    id: "starlit-offshore-drifter",
    name: "별모래 드리프터",
    areaIds: ["starlit-offshore"],
    rarity: "rare",
    family: "spirit",
    habitatTags: ["moon", "legend"],
    size: "medium",
    behaviorTags: ["drifting", "glowing"],
    baseShells: 156,
    xp: 126,
    spawnWeight: 28,
    funFact: "별모래를 등불처럼 품고 조류를 따라 천천히 떠다니는 친구예요.",
    assetKey: "fish-starlit-offshore-drifter",
  },
  {
    id: "glass-trench-needlefish",
    name: "유리심연 바늘고기",
    areaIds: ["starlit-offshore", "glass-trench"],
    rarity: "rare",
    family: "fish",
    habitatTags: ["trench", "legend"],
    size: "small",
    behaviorTags: ["swift", "shy"],
    baseShells: 164,
    xp: 134,
    spawnWeight: 24,
    funFact: "유리처럼 투명한 몸으로 빛의 틈을 재빠르게 가르는 바다 친구예요.",
    assetKey: "fish-glass-trench-needlefish",
  },
  {
    id: "tempest-pass-veil-ray",
    name: "폭풍 베일가오리",
    areaIds: ["glass-trench", "tempest-pass"],
    rarity: "epic",
    family: "fish",
    habitatTags: ["storm", "legend"],
    size: "large",
    behaviorTags: ["erratic", "drifting"],
    baseShells: 214,
    xp: 170,
    spawnWeight: 15,
    funFact: "폭풍 속에서도 베일처럼 넓은 지느러미를 펼쳐 물살을 타요.",
    assetKey: "fish-tempest-pass-veil-ray",
  },
  {
    id: "temporal-garden-comet-squid",
    name: "시간정원 혜성오징어",
    areaIds: ["tempest-pass", "temporal-garden"],
    rarity: "epic",
    family: "mollusk",
    habitatTags: ["pearl", "ancient"],
    size: "medium",
    behaviorTags: ["swift", "glowing"],
    baseShells: 232,
    xp: 186,
    spawnWeight: 13,
    funFact: "지나간 자리마다 혜성 꼬리 같은 빛줄기를 남기는 장난꾸러기예요.",
    assetKey: "fish-temporal-garden-comet-squid",
  },
  {
    id: "aurora-crown-mosaic-crab",
    name: "극광 모자이크게",
    areaIds: ["starlit-offshore", "aurora-crown"],
    rarity: "epic",
    family: "crustacean",
    habitatTags: ["aurora", "legend"],
    size: "medium",
    behaviorTags: ["steady", "glowing"],
    baseShells: 245,
    xp: 194,
    spawnWeight: 12,
    funFact: "집게마다 다른 오로라빛 조각무늬가 있어 수집가들이 소문내는 친구예요.",
    assetKey: "fish-aurora-crown-mosaic-crab",
  },
  {
    id: "starlit-offshore-lantern-eel",
    name: "별해협 등불장어",
    areaIds: ["starlit-offshore", "glass-trench"],
    rarity: "mythic",
    family: "deep",
    habitatTags: ["moon", "trench"],
    size: "large",
    behaviorTags: ["nocturnal", "glowing"],
    baseShells: 318,
    xp: 236,
    spawnWeight: 7,
    funFact: "밤바다의 길잡이처럼 작은 등불을 켜고 깊은 수로를 안내해요.",
    assetKey: "fish-starlit-offshore-lantern-eel",
  },
  {
    id: "glass-trench-velvet-turtle",
    name: "유리 벨벳거북",
    areaIds: ["glass-trench", "temporal-garden"],
    rarity: "mythic",
    family: "reptile",
    habitatTags: ["trench", "pearl"],
    size: "large",
    behaviorTags: ["heavy", "steady"],
    baseShells: 344,
    xp: 252,
    spawnWeight: 6,
    funFact: "벨벳처럼 부드러운 등껍질에 오래된 해연의 무늬가 남아 있어요.",
    assetKey: "fish-glass-trench-velvet-turtle",
  },
  {
    id: "tempest-pass-crown-clam",
    name: "폭풍 왕관조개",
    areaIds: ["tempest-pass", "aurora-crown"],
    rarity: "mythic",
    family: "mollusk",
    habitatTags: ["storm", "legend"],
    size: "medium",
    behaviorTags: ["heavy", "glowing"],
    baseShells: 368,
    xp: 268,
    spawnWeight: 5,
    funFact: "폭풍이 지나간 뒤 왕관처럼 열린 껍데기 안에서 은빛 진주가 빛나요.",
    assetKey: "fish-tempest-pass-crown-clam",
  },
  {
    id: "temporal-garden-skywhale",
    name: "시간정원 하늘고래",
    areaIds: ["temporal-garden", "aurora-crown"],
    rarity: "legendary",
    family: "whale",
    habitatTags: ["pearl", "ancient"],
    size: "giant",
    behaviorTags: ["drifting", "ancient"],
    baseShells: 520,
    xp: 330,
    spawnWeight: 3,
    funFact: "수면 위 구름 그림자를 따라 헤엄치며 오래된 시간을 노래하는 고래예요.",
    assetKey: "fish-temporal-garden-skywhale",
  },
  {
    id: "aurora-crown-mythic-nudibranch",
    name: "극광 환상갯민숭달팽이",
    areaIds: ["aurora-crown"],
    rarity: "ancient",
    family: "mollusk",
    habitatTags: ["aurora", "ancient"],
    size: "small",
    behaviorTags: ["shy", "ancient", "glowing"],
    baseShells: 680,
    xp: 420,
    spawnWeight: 2,
    funFact: "극광 왕관해의 가장 깊은 빛을 등에 두른, 전설 탐사선의 마지막 소문이에요.",
    assetKey: "fish-aurora-crown-mythic-nudibranch",
  },
];

export const fish: FishDefinition[] = [...baseFish, ...generatedFish, ...legendFish].map(withFishProfile);

const baseAreas: AreaDefinition[] = [
  {
    id: "sunny-beach",
    name: "햇살 해변",
    requiredLevel: 1,
    fishIds: ["sunny-minnow", "bubble-flounder", "sand-shrimp", "peach-seahorse", "ribbon-squid", "moon-jelly"],
    backgroundKey: "bg-sunny-beach",
    theme: "beach",
    mapTexture: "map-island",
    flavor: "따뜻한 모래와 얕은 물길이 처음 항해에 알맞아요.",
  },
  {
    id: "little-pier",
    name: "작은 방파제",
    requiredLevel: 3,
    fishIds: [
      "ribbon-squid",
      "moon-jelly",
      "harbor-mackerel",
      "shell-crab",
      "drum-octopus",
      "sleepy-ray",
      "candy-puffer",
      "starfish-pal",
    ],
    backgroundKey: "bg-little-pier",
    theme: "pier",
    mapTexture: "map-pier",
    flavor: "낡은 목재 방파제 주변으로 항구 친구들이 모여요.",
  },
  {
    id: "coral-sea",
    name: "산호초 바다",
    requiredLevel: 5,
    fishIds: [
      "starfish-pal",
      "candy-puffer",
      "coral-tang",
      "ribbon-eel",
      "pearl-clam",
      "pearl-turtle",
      "lantern-angler",
      "sea-bunny",
      "rainbow-whale",
    ],
    backgroundKey: "bg-coral-sea",
    theme: "coral",
    mapTexture: "map-reef",
    flavor: "산호와 따뜻한 조류가 희귀한 만남을 불러요.",
  },
];

const generatedAreas: AreaDefinition[] = extraAreaBlueprints.map((area) => ({
  id: area.id,
  name: area.name,
  requiredLevel: area.requiredLevel,
  fishIds: generatedFish.filter((entry) => entry.areaIds.includes(area.id)).map((entry) => entry.id),
  backgroundKey: `bg-${area.id}`,
  theme: area.theme,
  mapTexture: area.mapTexture,
  flavor: area.flavor,
}));

const legendAreas: AreaDefinition[] = legendAreasBlueprints.map((area) => ({
  id: area.id,
  name: area.name,
  requiredLevel: area.requiredLevel,
  fishIds: legendFish.filter((entry) => entry.areaIds.includes(area.id)).map((entry) => entry.id),
  backgroundKey: `bg-${area.id}`,
  theme: area.theme,
  mapTexture: area.mapTexture,
  flavor: area.flavor,
}));

const hiddenAreas: AreaDefinition[] = [
  {
    id: "fog-whale-route",
    name: "안개 고래길",
    requiredLevel: 31,
    fishIds: [
      "misty-fjord-drifter",
      "misty-fjord-lantern-eel",
      "moonlit-current-skywhale",
      "rainbow-whale",
      "glass-trench-velvet-turtle",
    ],
    backgroundKey: "bg-fog-whale-route",
    theme: "mist",
    mapTexture: "map-fog-whale-route",
    flavor: "안개가 내려앉을 때만 고래의 숨결처럼 흐릿한 물길이 보여요.",
    hidden: true,
    weatherPool: ["fog", "moonTide", "rain"],
    route: {
      discoveryLevel: 31,
      discoveryHint: "은빛 안개 사이로 커다란 물결이 들려와요.",
      revealText: "안개가 걷히며 고래들이 지나가는 숨은 항로가 기록됐어요.",
    },
  },
  {
    id: "storm-wreck-reef",
    name: "폭풍 난파초",
    requiredLevel: 43,
    fishIds: [
      "storm-bank-veil-ray",
      "storm-bank-lantern-eel",
      "basalt-cove-crown-clam",
      "tempest-pass-veil-ray",
      "tempest-pass-crown-clam",
    ],
    backgroundKey: "bg-storm-wreck-reef",
    theme: "storm",
    mapTexture: "map-storm-wreck-reef",
    flavor: "부서진 난파선 주변으로 강한 물살과 희귀한 소문이 모여요.",
    hidden: true,
    weatherPool: ["storm", "rain", "fog"],
    route: {
      discoveryLevel: 43,
      discoveryHint: "먹구름 아래에서 오래된 닻소리가 들려요.",
      revealText: "번개가 바다 위를 비추자 난파초의 숨은 길이 드러났어요.",
    },
  },
  {
    id: "aurora-secret-atoll",
    name: "극광 비밀환초",
    requiredLevel: 58,
    fishIds: [
      "aurora-reef-skywhale",
      "aurora-reef-mythic-nudibranch",
      "starlit-offshore-lantern-eel",
      "temporal-garden-skywhale",
      "aurora-crown-mythic-nudibranch",
    ],
    backgroundKey: "bg-aurora-secret-atoll",
    theme: "aurora",
    mapTexture: "map-aurora-secret-atoll",
    flavor: "오로라가 수면에 왕관처럼 내려앉는 밤, 비밀 환초가 모습을 드러내요.",
    hidden: true,
    weatherPool: ["aurora", "moonTide", "fog"],
    route: {
      discoveryLevel: 58,
      discoveryHint: "오로라빛 파문이 지도 바깥에서 반짝여요.",
      revealText: "극광이 항로를 그리며 비밀 환초의 위치를 알려줬어요.",
    },
  },
];

export const areas: AreaDefinition[] = [...baseAreas, ...generatedAreas, ...legendAreas, ...hiddenAreas];

const baseItems: ItemDefinition[] = [
  {
    id: "twig-rod",
    name: "나뭇가지 낚싯대",
    kind: "rod",
    shellCost: 0,
    description: "처음부터 함께하는 기본 낚싯대예요.",
    effect: { catchEase: 0, lureSpeed: 0, reelPower: 0 },
  },
  {
    id: "sparkle-rod",
    name: "반짝 낚싯대",
    kind: "rod",
    shellCost: 70,
    description: "타이밍 구간과 입질 속도가 조금 좋아져요.",
    effect: { catchEase: 0.08, lureSpeed: 0.12, reelPower: 0.02 },
  },
  {
    id: "captain-rod",
    name: "용감한 선장 낚싯대",
    kind: "rod",
    shellCost: 150,
    description: "릴 힘이 좋아져 큰 친구를 붙잡기 쉬워요.",
    effect: { catchEase: 0.13, lureSpeed: 0.16, reelPower: 0.05, rareBoost: 0.03 },
  },
  {
    id: "tideglass-rod",
    name: "물빛 유리 낚싯대",
    kind: "rod",
    shellCost: 260,
    description: "입질이 빨라지고 변이 친구를 만날 확률이 올라요.",
    effect: { catchEase: 0.17, lureSpeed: 0.26, reelPower: 0.08, rareBoost: 0.07, mutationChance: 0.04 },
  },
  {
    id: "aurora-rod",
    name: "오로라 심해 낚싯대",
    kind: "rod",
    shellCost: 460,
    description: "강한 릴링과 오로라 변이 확률을 지닌 고급 장비예요.",
    effect: { catchEase: 0.22, lureSpeed: 0.34, reelPower: 0.12, rareBoost: 0.12, mutationChance: 0.08 },
  },
  {
    id: "harbor-skiff",
    name: "항구 소형 작업선",
    kind: "boat",
    shellCost: 0,
    description: "기본 선체. 잔잔한 항해에 알맞아요.",
    effect: { boatSpeed: 0 },
  },
  {
    id: "blue-runabout",
    name: "블루 러너 보트",
    kind: "boat",
    shellCost: 120,
    description: "가벼운 선체로 바다 지도를 더 빠르게 항해해요.",
    effect: { boatSpeed: 0.14, lureSpeed: 0.04 },
  },
  {
    id: "coral-runner",
    name: "산호 탐사선",
    kind: "boat",
    shellCost: 260,
    description: "산호초 탐험에 맞춘 선체. 희귀 친구 소문이 늘어요.",
    effect: { boatSpeed: 0.22, rareBoost: 0.06, mutationChance: 0.02 },
  },
  {
    id: "aurora-cutter",
    name: "오로라 커터",
    kind: "boat",
    shellCost: 520,
    description: "먼 바다용 고급 선체. 항해와 낚시 보너스가 모두 좋아요.",
    effect: { boatSpeed: 0.32, catchEase: 0.04, lureSpeed: 0.08, mutationChance: 0.05 },
  },
  {
    id: "sweet-bait",
    name: "달콤 미끼",
    kind: "bait",
    shellCost: 45,
    description: "가끔 만나는 친구가 조금 더 찾아와요.",
    effect: { rareBoost: 0.18 },
  },
  {
    id: "coral-bait",
    name: "산호 미끼",
    kind: "bait",
    shellCost: 90,
    description: "특별한 바다 친구를 만날 확률이 올라가요.",
    effect: { rareBoost: 0.32 },
  },
  {
    id: "star-flag",
    name: "별 깃발",
    kind: "boatCosmetic",
    shellCost: 60,
    description: "배 위에서 살랑살랑 빛나는 깃발이에요.",
  },
  {
    id: "harbor-pennant",
    name: "조선공 삼각깃발",
    kind: "boatCosmetic",
    shellCost: 80,
    description: "항구 사람들의 신뢰를 담은 단정한 깃발이에요.",
  },
  {
    id: "coral-pennant",
    name: "산호 수호 깃발",
    kind: "boatCosmetic",
    shellCost: 80,
    description: "산호초를 지키겠다는 약속이 은은히 빛나요.",
  },
];

const gearThemes = [
  { slug: "harbor", name: "항구", color: "단정한" },
  { slug: "sunray", name: "햇살", color: "밝은" },
  { slug: "reef", name: "산호", color: "따뜻한" },
  { slug: "mist", name: "안개", color: "은은한" },
  { slug: "kelp", name: "해초", color: "차분한" },
  { slug: "basalt", name: "현무암", color: "묵직한" },
  { slug: "pearl", name: "진주", color: "고운" },
  { slug: "storm", name: "먹구름", color: "강한" },
  { slug: "moon", name: "달빛", color: "맑은" },
  { slug: "amber", name: "호박빛", color: "따뜻한" },
  { slug: "glacier", name: "빙하", color: "서늘한" },
  { slug: "lantern", name: "초롱", color: "깊은" },
  { slug: "aurora", name: "오로라", color: "찬란한" },
  { slug: "compass", name: "나침반", color: "정교한" },
  { slug: "tide", name: "조류", color: "유려한" },
] as const;

const craftedLevels = ["수습", "견습", "단련", "숙련", "명장", "원정"] as const;

const generatedRods: ItemDefinition[] = Array.from({ length: 30 }, (_, index) => {
  const theme = gearThemes[index % gearThemes.length];
  const level = Math.floor(index / 5);
  const levelName = craftedLevels[level] ?? "원정";
  return {
    id: `${theme.slug}-${level + 1}-rod`,
    name: `${theme.name} ${levelName} 낚싯대`,
    kind: "rod",
    shellCost: 150 + index * 58 + level * 70,
    description: `${theme.color} 소재와 균형 잡힌 릴로 제작한 상급 낚싯대예요.`,
    effect: {
      catchEase: 0.1 + level * 0.025 + (index % 5) * 0.006,
      lureSpeed: 0.12 + level * 0.03 + (index % 4) * 0.01,
      reelPower: 0.04 + level * 0.018,
      rareBoost: 0.02 + level * 0.018 + (index % 3) * 0.008,
      mutationChance: level >= 2 ? 0.015 + level * 0.01 : undefined,
    },
  };
});

const generatedBoats: ItemDefinition[] = Array.from({ length: 30 }, (_, index) => {
  const theme = gearThemes[(index + 2) % gearThemes.length];
  const level = Math.floor(index / 5);
  const className = ["소형선", "순항선", "탐사선", "쌍동선", "커터", "원양정"][level] ?? "원양정";
  return {
    id: `${theme.slug}-${level + 1}-boat`,
    name: `${theme.name} ${className}`,
    kind: "boat",
    shellCost: 220 + index * 76 + level * 110,
    description: `${theme.color} 선체 라인과 안정적인 갑판을 갖춘 항해용 배예요.`,
    effect: {
      boatSpeed: 0.12 + level * 0.055 + (index % 5) * 0.012,
      catchEase: level >= 2 ? 0.015 + level * 0.008 : undefined,
      lureSpeed: 0.025 + level * 0.012,
      rareBoost: level >= 1 ? 0.018 + level * 0.012 : undefined,
      mutationChance: level >= 4 ? 0.025 + level * 0.006 : undefined,
    },
  };
});

const generatedBaits: ItemDefinition[] = Array.from({ length: 30 }, (_, index) => {
  const theme = gearThemes[(index + 5) % gearThemes.length];
  const level = Math.floor(index / 5);
  const baitKind = ["반죽", "젤리", "해초볼", "향낭", "진주캡슐", "별빛캡슐"][level] ?? "별빛캡슐";
  return {
    id: `${theme.slug}-${level + 1}-bait`,
    name: `${theme.name} ${baitKind}`,
    kind: "bait",
    shellCost: 80 + index * 36 + level * 46,
    description: `${theme.name} 해역의 향과 색을 담아 특정 친구들의 호기심을 끌어요.`,
    effect: {
      rareBoost: 0.16 + level * 0.06 + (index % 4) * 0.018,
      lureSpeed: 0.03 + level * 0.012,
      mutationChance: level >= 3 ? 0.02 + level * 0.009 : undefined,
    },
  };
});

const generatedFlags: ItemDefinition[] = Array.from({ length: 30 }, (_, index) => {
  const theme = gearThemes[(index + 8) % gearThemes.length];
  const level = Math.floor(index / 5);
  const flagKind = ["삼각깃발", "분대기", "리본깃발", "문장기", "항해기", "왕실기"][level] ?? "왕실기";
  return {
    id: `${theme.slug}-${level + 1}-flag`,
    name: `${theme.name} ${flagKind}`,
    kind: "boatCosmetic",
    shellCost: 70 + index * 32 + level * 52,
    description: `${theme.color} 문양으로 배의 인상을 바꾸고 항해 보너스를 조금 더해요.`,
    effect: {
      boatSpeed: level >= 1 ? 0.015 + level * 0.006 : undefined,
      rareBoost: 0.012 + level * 0.008,
      mutationChance: level >= 4 ? 0.012 + level * 0.006 : undefined,
    },
  };
});

const legendRods: ItemDefinition[] = [
  {
    id: "starline-rod",
    name: "별줄기 탐사 낚싯대",
    kind: "rod",
    shellCost: 6200,
    description: "별모래 외해의 긴 입질을 안정적으로 받아내는 후반부 낚싯대예요.",
    effect: { catchEase: 0.18, lureSpeed: 0.22, reelPower: 0.16, rareBoost: 0.1, rarityBoosts: { rare: 0.18, epic: 0.08 } },
  },
  {
    id: "glass-depth-rod",
    name: "유리심도 낚싯대",
    kind: "rod",
    shellCost: 7600,
    description: "깊은 해연의 작은 떨림을 읽어 심해 친구에게 강해요.",
    effect: { catchEase: 0.17, lureSpeed: 0.2, reelPower: 0.19, rareBoost: 0.11, familyBoost: "deep", habitatBoost: "trench" },
  },
  {
    id: "tempest-anchor-rod",
    name: "폭풍닻 릴 낚싯대",
    kind: "rod",
    shellCost: 8900,
    description: "거친 물살에서도 릴링 힘을 유지해 대형 친구를 놓치기 어려워요.",
    effect: { catchEase: 0.15, lureSpeed: 0.18, reelPower: 0.24, rareBoost: 0.12, habitatBoost: "storm" },
  },
  {
    id: "chronocoral-rod",
    name: "시간산호 낚싯대",
    kind: "rod",
    shellCost: 10300,
    description: "느린 타이밍과 빠른 반응을 함께 잡아 신비한 친구에게 유리해요.",
    effect: { catchEase: 0.21, lureSpeed: 0.24, reelPower: 0.18, rareBoost: 0.14, mutationChance: 0.045, habitatBoost: "ancient" },
  },
  {
    id: "aurora-crown-rod",
    name: "극광왕관 낚싯대",
    kind: "rod",
    shellCost: 12100,
    description: "전설 등급 소문을 따라가는 오로라빛 고급 장비예요.",
    effect: { catchEase: 0.2, lureSpeed: 0.28, reelPower: 0.22, rareBoost: 0.15, mutationChance: 0.055, rarityBoosts: { mythic: 0.12, legendary: 0.1 } },
  },
  {
    id: "whalesong-rod",
    name: "고래노래 낚싯대",
    kind: "rod",
    shellCost: 13800,
    description: "큰 바다 친구의 긴 호흡을 따라가는 부드러운 릴을 갖췄어요.",
    effect: { catchEase: 0.18, lureSpeed: 0.2, reelPower: 0.27, rareBoost: 0.14, familyBoost: "whale", rarityBoosts: { legendary: 0.16 } },
  },
  {
    id: "mirror-tide-rod",
    name: "거울조류 낚싯대",
    kind: "rod",
    shellCost: 15400,
    description: "물결 반사를 읽어 변칙 이동 친구의 초록 구간을 넓혀줘요.",
    effect: { catchEase: 0.24, lureSpeed: 0.23, reelPower: 0.2, rareBoost: 0.15, mutationChance: 0.06, habitatBoost: "legend" },
  },
  {
    id: "comet-spool-rod",
    name: "혜성스풀 낚싯대",
    kind: "rod",
    shellCost: 16900,
    description: "입질이 빠른 친구에게 맞춰 스풀이 부드럽고 빠르게 풀려요.",
    effect: { catchEase: 0.19, lureSpeed: 0.34, reelPower: 0.21, rareBoost: 0.17, familyBoost: "mollusk" },
  },
  {
    id: "ancient-loop-rod",
    name: "고대고리 낚싯대",
    kind: "rod",
    shellCost: 18600,
    description: "오래된 바다의 순환을 따라 고대종 소문을 더 자주 불러요.",
    effect: { catchEase: 0.22, lureSpeed: 0.27, reelPower: 0.24, rareBoost: 0.18, mutationChance: 0.075, rarityBoosts: { ancient: 0.15 } },
  },
  {
    id: "legend-voyager-rod",
    name: "전설 탐사선 낚싯대",
    kind: "rod",
    shellCost: 21000,
    description: "전설 탐사선의 마지막 장비. 어려운 만남을 끝까지 붙잡아줘요.",
    effect: { catchEase: 0.25, lureSpeed: 0.32, reelPower: 0.28, rareBoost: 0.2, mutationChance: 0.085, rarityBoosts: { legendary: 0.16, ancient: 0.12 } },
  },
];

const legendBoats: ItemDefinition[] = [
  {
    id: "starlit-trawler",
    name: "별모래 트롤선",
    kind: "boat",
    shellCost: 7800,
    description: "별모래 외해를 안정적으로 지나는 넓은 갑판의 탐사선이에요.",
    effect: { boatSpeed: 0.42, lureSpeed: 0.08, rareBoost: 0.08, habitatBoost: "moon" },
  },
  {
    id: "glass-subrunner",
    name: "유리 해연 순항선",
    kind: "boat",
    shellCost: 9800,
    description: "투명한 선실과 낮은 선체로 심해 탐사에 특화된 배예요.",
    effect: { boatSpeed: 0.47, catchEase: 0.035, rareBoost: 0.09, familyBoost: "deep" },
  },
  {
    id: "tempest-brig",
    name: "폭풍나침 쌍돛배",
    kind: "boat",
    shellCost: 12200,
    description: "거친 물살에서도 방향을 잃지 않는 강한 항해용 배예요.",
    effect: { boatSpeed: 0.52, reelPower: 0.04, rareBoost: 0.1, habitatBoost: "storm" },
  },
  {
    id: "chronocoral-ark",
    name: "시간산호 방주",
    kind: "boat",
    shellCost: 15100,
    description: "산호 정원의 느린 조류를 타고 희귀한 만남을 찾아가는 배예요.",
    effect: { boatSpeed: 0.5, catchEase: 0.04, mutationChance: 0.055, habitatBoost: "ancient" },
  },
  {
    id: "aurora-regalia",
    name: "극광 왕관정",
    kind: "boat",
    shellCost: 18800,
    description: "오로라 왕관해에 어울리는 최상위 선체. 전설 소문이 더 가까워져요.",
    effect: { boatSpeed: 0.58, lureSpeed: 0.1, rareBoost: 0.13, mutationChance: 0.07, rarityBoosts: { legendary: 0.12, ancient: 0.08 } },
  },
];

const legendBaits: ItemDefinition[] = [
  {
    id: "stardust-bait",
    name: "별가루 미끼",
    kind: "bait",
    shellCost: 1800,
    description: "별모래를 좋아하는 희귀 친구의 호기심을 끌어요.",
    effect: { rareBoost: 0.28, lureSpeed: 0.07, habitatBoost: "moon", rarityBoosts: { rare: 0.18 } },
  },
  {
    id: "glass-krill-bait",
    name: "유리크릴 미끼",
    kind: "bait",
    shellCost: 2300,
    description: "작고 빠른 심해 친구를 불러내는 맑은 크릴 미끼예요.",
    effect: { rareBoost: 0.3, lureSpeed: 0.09, familyBoost: "fish", habitatBoost: "trench" },
  },
  {
    id: "tempest-plume-bait",
    name: "폭풍깃 미끼",
    kind: "bait",
    shellCost: 2800,
    description: "거친 해협의 대담한 친구에게 잘 보이는 흔들림을 만들어요.",
    effect: { rareBoost: 0.34, lureSpeed: 0.07, habitatBoost: "storm", rarityBoosts: { epic: 0.14 } },
  },
  {
    id: "clockwork-kelp-bait",
    name: "시계해초 미끼",
    kind: "bait",
    shellCost: 3400,
    description: "시간 산호정원의 느린 조류를 닮은 향을 내요.",
    effect: { rareBoost: 0.36, lureSpeed: 0.06, habitatBoost: "ancient", rarityBoosts: { mythic: 0.12 } },
  },
  {
    id: "aurora-pearl-bait",
    name: "극광진주 미끼",
    kind: "bait",
    shellCost: 4100,
    description: "오로라빛 진주가 전설급 친구의 시선을 끌어요.",
    effect: { rareBoost: 0.4, lureSpeed: 0.08, mutationChance: 0.025, habitatBoost: "aurora", rarityBoosts: { legendary: 0.12 } },
  },
  {
    id: "moonwhisper-bait",
    name: "달속삭임 미끼",
    kind: "bait",
    shellCost: 4900,
    description: "밤에 움직이는 친구에게 은은하게 들리는 미끼예요.",
    effect: { rareBoost: 0.38, lureSpeed: 0.11, habitatBoost: "moon", familyBoost: "spirit" },
  },
  {
    id: "deep-lantern-bait",
    name: "심해등불 미끼",
    kind: "bait",
    shellCost: 5700,
    description: "어두운 해연 속 등불을 따라오는 친구에게 특화됐어요.",
    effect: { rareBoost: 0.42, lureSpeed: 0.07, mutationChance: 0.02, familyBoost: "deep", habitatBoost: "trench" },
  },
  {
    id: "crown-coral-bait",
    name: "왕관산호 미끼",
    kind: "bait",
    shellCost: 6600,
    description: "왕관해와 산호정원의 신비한 조개류를 불러내요.",
    effect: { rareBoost: 0.43, lureSpeed: 0.08, familyBoost: "mollusk", rarityBoosts: { mythic: 0.14 } },
  },
  {
    id: "skywhale-song-bait",
    name: "하늘고래 노래미끼",
    kind: "bait",
    shellCost: 7800,
    description: "거대한 고래류의 느린 울림을 닮은 고급 미끼예요.",
    effect: { rareBoost: 0.46, lureSpeed: 0.05, familyBoost: "whale", rarityBoosts: { legendary: 0.18 } },
  },
  {
    id: "ancient-glow-bait",
    name: "고대빛 미끼",
    kind: "bait",
    shellCost: 9200,
    description: "아주 오래된 생물의 흔적을 불러오는 전설 탐사선 미끼예요.",
    effect: { rareBoost: 0.48, lureSpeed: 0.06, mutationChance: 0.035, habitatBoost: "ancient", rarityBoosts: { ancient: 0.16 } },
  },
];

const legendFlags: ItemDefinition[] = [
  {
    id: "starlit-banner",
    name: "별모래 배너",
    kind: "boatCosmetic",
    shellCost: 1400,
    description: "별모래 외해의 빛을 따라 항해 속도를 조금 높여요.",
    effect: { boatSpeed: 0.045, rareBoost: 0.025, habitatBoost: "moon" },
  },
  {
    id: "glass-pennant",
    name: "유리해연 페넌트",
    kind: "boatCosmetic",
    shellCost: 1700,
    description: "투명한 해연 문양이 깊은 바다 친구의 소문을 더해요.",
    effect: { boatSpeed: 0.04, rareBoost: 0.03, familyBoost: "deep" },
  },
  {
    id: "tempest-standard",
    name: "폭풍나침 군기",
    kind: "boatCosmetic",
    shellCost: 2100,
    description: "거친 바람에도 꺾이지 않는 해협용 깃발이에요.",
    effect: { boatSpeed: 0.055, rareBoost: 0.025, habitatBoost: "storm" },
  },
  {
    id: "clock-coral-flag",
    name: "시간산호 깃발",
    kind: "boatCosmetic",
    shellCost: 2500,
    description: "느린 산호 무늬가 변이 친구의 소문을 조금 높여요.",
    effect: { boatSpeed: 0.04, rareBoost: 0.035, mutationChance: 0.018, habitatBoost: "ancient" },
  },
  {
    id: "aurora-crown-flag",
    name: "극광왕관 깃발",
    kind: "boatCosmetic",
    shellCost: 3100,
    description: "왕관해의 오로라 문장이 배 위에서 은은하게 빛나요.",
    effect: { boatSpeed: 0.06, rareBoost: 0.04, mutationChance: 0.02, habitatBoost: "aurora" },
  },
  {
    id: "whale-tail-flag",
    name: "고래꼬리 깃발",
    kind: "boatCosmetic",
    shellCost: 3800,
    description: "큰 바다 친구를 존중하는 탐사선의 표식이에요.",
    effect: { boatSpeed: 0.045, rareBoost: 0.04, familyBoost: "whale" },
  },
  {
    id: "comet-ribbon-flag",
    name: "혜성리본 깃발",
    kind: "boatCosmetic",
    shellCost: 4400,
    description: "빠른 친구의 움직임처럼 리본이 길게 흔들려요.",
    effect: { boatSpeed: 0.065, rareBoost: 0.035, familyBoost: "mollusk" },
  },
  {
    id: "deep-crown-flag",
    name: "심해왕관 깃발",
    kind: "boatCosmetic",
    shellCost: 5200,
    description: "심해와 왕관해를 모두 건넌 선장에게 어울리는 깃발이에요.",
    effect: { boatSpeed: 0.055, rareBoost: 0.045, rarityBoosts: { mythic: 0.08 } },
  },
  {
    id: "ancient-map-flag",
    name: "고대지도 깃발",
    kind: "boatCosmetic",
    shellCost: 6100,
    description: "오래된 항로가 새겨져 전설 탐사의 방향을 잡아줘요.",
    effect: { boatSpeed: 0.05, rareBoost: 0.05, mutationChance: 0.025, rarityBoosts: { legendary: 0.08 } },
  },
  {
    id: "legend-fleet-flag",
    name: "전설 함대기",
    kind: "boatCosmetic",
    shellCost: 7400,
    description: "전설 탐사선의 마지막 깃발. 배의 인상이 확실히 달라져요.",
    effect: { boatSpeed: 0.07, rareBoost: 0.055, mutationChance: 0.03, rarityBoosts: { ancient: 0.08 } },
  },
];

const rawItems: ItemDefinition[] = [
  ...baseItems,
  ...generatedRods,
  ...generatedBoats,
  ...generatedBaits,
  ...generatedFlags,
  ...legendRods,
  ...legendBoats,
  ...legendBaits,
  ...legendFlags,
];

export const items: ItemDefinition[] = rawItems.map(decorateGearItem);

export const storyChoices: StoryChoiceDefinition[] = [
  {
    id: "first-voyage-route",
    title: "첫 항로를 정하기",
    helper: "선장 수첩에 첫 목표를 적어두면 새로운 부탁이 열려요.",
    requirements: [{ kind: "questClaimed", questId: "first-friend" }],
    options: [
      {
        id: "harbor-route",
        label: "항구 재건 돕기",
        description: "더 좋은 배와 장비를 빨리 준비하는 안정적인 항로예요.",
        setFlags: ["route-harbor"],
        rewards: { shells: 35, xp: 18, itemId: "harbor-pennant" },
      },
      {
        id: "coral-route",
        label: "산호초 지키기",
        description: "희귀한 바다 친구와 신비한 소문을 따라가는 탐험 항로예요.",
        setFlags: ["route-coral"],
        rewards: { shells: 25, xp: 24, itemId: "coral-pennant" },
      },
    ],
  },
];

export const quests: QuestDefinition[] = [
  {
    id: "first-friend",
    title: "첫 바다 친구 만나기",
    helper: "낚시 버튼을 눌러 첫 친구를 만나봐요.",
    steps: [{ kind: "catchAny", count: 1 }],
    rewards: { shells: 25, xp: 18 },
  },
  {
    id: "shipwright-ledger",
    title: "조선공의 항해 장부",
    helper: "항구 재건을 도우려면 튼튼한 장비와 충분한 항해 기록이 필요해요.",
    requirements: [{ kind: "storyFlag", flag: "route-harbor" }],
    steps: [
      { kind: "catchAny", count: 5 },
      { kind: "ownItem", itemId: "sparkle-rod" },
    ],
    rewards: { shells: 65, xp: 46, itemId: "star-flag" },
    effects: { setFlags: ["harbor-trusted"] },
  },
  {
    id: "coral-nursery",
    title: "산호 묘목 지키기",
    helper: "은은한 빛을 따라가며 산호초를 돌보는 친구들을 찾아봐요.",
    requirements: [{ kind: "storyFlag", flag: "route-coral" }],
    steps: [
      { kind: "catchFish", fishId: "moon-jelly", count: 1 },
      { kind: "collectUnique", count: 4 },
    ],
    rewards: { shells: 55, xp: 54, itemId: "star-flag" },
    effects: { setFlags: ["coral-guardian"] },
  },
  {
    id: "tiny-collector",
    title: "도감에 친구 3종 기록하기",
    helper: "서로 다른 바다 친구를 세 종류 만나봐요.",
    steps: [{ kind: "collectUnique", count: 3 }],
    rewards: { shells: 40, xp: 28 },
  },
  {
    id: "better-rod",
    title: "반짝 낚싯대 준비하기",
    helper: "조개를 모아 반짝 낚싯대를 바꿔봐요.",
    steps: [{ kind: "ownItem", itemId: "sparkle-rod" }],
    rewards: { shells: 30, xp: 30 },
  },
  {
    id: "pier-trip",
    title: "작은 방파제로 떠나요",
    helper: "레벨 3이 되면 새로운 낚시터가 열려요.",
    steps: [{ kind: "unlockArea", areaId: "little-pier" }],
    rewards: { shells: 45, xp: 35 },
  },
  {
    id: "rainbow-dream",
    title: "무지개 아기고래 소문",
    helper: "산호초 바다에서 특별한 친구를 찾아봐요.",
    steps: [
      { kind: "unlockArea", areaId: "coral-sea" },
      { kind: "catchFish", fishId: "rainbow-whale", count: 1 },
    ],
    rewards: { shells: 120, xp: 80, itemId: "star-flag" },
  },
  {
    id: "legend-expedition-launch",
    title: "전설 탐사선 출항",
    helper: "레벨 51이 되면 별모래 외해로 가는 새 항로가 열려요.",
    steps: [
      { kind: "reachLevel", level: 51 },
      { kind: "unlockArea", areaId: "starlit-offshore" },
    ],
    rewards: { shells: 900, xp: 260, itemId: "starlit-banner" },
    effects: { setFlags: ["legend-expedition"] },
  },
  {
    id: "glass-chart",
    title: "유리 해연의 항로도",
    helper: "별모래 외해와 유리 해연에서 전설 탐사의 첫 표식을 찾아요.",
    requirements: [{ kind: "storyFlag", flag: "legend-expedition" }],
    steps: [
      { kind: "catchFish", fishId: "starlit-offshore-drifter", count: 1 },
      { kind: "catchFish", fishId: "glass-trench-needlefish", count: 1 },
      { kind: "unlockArea", areaId: "glass-trench" },
    ],
    rewards: { shells: 1400, xp: 430, itemId: "starline-rod" },
    effects: { setFlags: ["glass-charted"] },
  },
  {
    id: "ancient-crown-sighting",
    title: "극광 왕관해의 고대 소문",
    helper: "시간 산호정원과 극광 왕관해에서 전설급 친구의 흔적을 남겨요.",
    requirements: [{ kind: "storyFlag", flag: "glass-charted" }],
    steps: [
      { kind: "unlockArea", areaId: "aurora-crown" },
      { kind: "catchFish", fishId: "temporal-garden-skywhale", count: 1 },
      { kind: "catchFish", fishId: "aurora-crown-mythic-nudibranch", count: 1 },
    ],
    rewards: { shells: 2600, xp: 760, itemId: "legend-voyager-rod" },
    effects: { setFlags: ["ancient-witness"] },
  },
];

function withFishProfile(fish: FishDraft): FishDefinition {
  return {
    ...fish,
    family: fish.family ?? familyForFish(fish.id),
    habitatTags: fish.habitatTags ?? [habitatForArea(fish.areaIds[0] ?? "sunny-beach")],
    size: fish.size ?? sizeForFish(fish.id, fish.rarity),
    behaviorTags: fish.behaviorTags ?? behaviorForFish(fish.id, fish.rarity),
  };
}

function familyForFish(id: string): SeaFriendFamily {
  if (id.includes("crab")) return "crustacean";
  if (id.includes("squid") || id.includes("octopus") || id.includes("clam") || id.includes("nudibranch") || id.includes("bunny")) {
    return "mollusk";
  }
  if (id.includes("jelly")) return "jelly";
  if (id.includes("whale")) return "whale";
  if (id.includes("turtle")) return "reptile";
  if (id.includes("starfish")) return "echinoderm";
  if (id.includes("angler") || id.includes("eel") || id.includes("lantern")) return "deep";
  if (id.includes("drifter")) return "spirit";
  return "fish";
}

function habitatForArea(areaId: string): SeaFriendHabitat {
  if (areaId === "sunny-beach") return "coastal";
  if (areaId === "little-pier") return "pier";
  if (areaId === "coral-sea") return "coral";
  if (areaId.includes("mist")) return "mist";
  if (areaId.includes("kelp")) return "kelp";
  if (areaId.includes("basalt")) return "basalt";
  if (areaId.includes("pearl") || areaId.includes("temporal")) return "pearl";
  if (areaId.includes("storm") || areaId.includes("tempest")) return "storm";
  if (areaId.includes("moon") || areaId.includes("starlit")) return "moon";
  if (areaId.includes("amber")) return "amber";
  if (areaId.includes("glacier")) return "glacier";
  if (areaId.includes("lantern") || areaId.includes("trench") || areaId.includes("glass")) return "trench";
  if (areaId.includes("aurora")) return "aurora";
  return "coastal";
}

function sizeForFish(id: string, rarity: FishDefinition["rarity"]): SeaFriendSize {
  if (id.includes("whale")) return "giant";
  if (id.includes("ray") || id.includes("turtle") || id.includes("eel")) return "large";
  if (id.includes("minnow") || id.includes("shrimp") || id.includes("bunny") || id.includes("needlefish") || id.includes("nudibranch")) return "small";
  if (rarity === "legendary" || rarity === "ancient") return "giant";
  if (rarity === "mythic" || rarity === "epic") return "large";
  return "medium";
}

function behaviorForFish(id: string, rarity: FishDefinition["rarity"]): SeaFriendBehavior[] {
  const behaviors: SeaFriendBehavior[] = [];
  if (id.includes("needle") || id.includes("mackerel") || id.includes("comet")) behaviors.push("swift");
  if (id.includes("ray") || id.includes("drifter") || id.includes("jelly") || id.includes("whale")) behaviors.push("drifting");
  if (id.includes("clam") || id.includes("turtle") || id.includes("crab")) behaviors.push("heavy");
  if (id.includes("moon") || id.includes("lantern") || id.includes("aurora") || id.includes("starlit")) behaviors.push("glowing");
  if (id.includes("bunny") || id.includes("nudibranch")) behaviors.push("shy");
  if (rarity === "ancient" || rarity === "legendary") behaviors.push("ancient");
  if (behaviors.length === 0) behaviors.push("steady");
  return Array.from(new Set(behaviors));
}

export const getFish = (id: string) => fish.find((entry) => entry.id === id);
export const getArea = (id: string) => areas.find((entry) => entry.id === id);
export const getItem = (id: string) => items.find((entry) => entry.id === id);
export const getQuest = (id: string) => quests.find((entry) => entry.id === id);
export const getStoryChoice = (id: string) => storyChoices.find((entry) => entry.id === id);

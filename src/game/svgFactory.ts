import { CREATURE_SVGS } from "./creatureSvgs";
import { boatFlagTextureKey, boatMapTextureKey, boatSideTextureKey, captainTextureKey, itemIconTextureKey } from "./textureKeys";
import type { CaptainStyle, FishDefinition, ItemDefinition } from "./types";

type SvgPalette = {
  body: string;
  bodyDeep: string;
  accent: string;
  accentSoft: string;
  ink: string;
  paper: string;
  glow: string;
};

type CreatureShape =
  | "fish"
  | "needle"
  | "ray"
  | "squid"
  | "crab"
  | "eel"
  | "turtle"
  | "clam"
  | "whale"
  | "nudibranch";

const INK = "#1a2430";
const PAPER = "#fff7e8";

const themePalettes: Record<string, SvgPalette> = {
  beach: palette("#f7cf5d", "#c77d2c", "#ff8d72", "#ffe7a3", "#1a2430", PAPER, "#fff2a8"),
  pier: palette("#67bdd0", "#21627b", "#d89b54", "#d7f2ee", "#1a2430", PAPER, "#c7f4ff"),
  coral: palette("#58c9b6", "#267a71", "#ff8f91", "#ffd4cb", "#1a2430", PAPER, "#fff0b8"),
  mist: palette("#b8ccd2", "#647d8d", "#f2e4c7", "#e8f2f4", "#1a2430", PAPER, "#ffffff"),
  kelp: palette("#5ebf8d", "#245f57", "#d5e875", "#ccefc6", "#1a2430", PAPER, "#e9ff9f"),
  basalt: palette("#567988", "#263745", "#f0b45e", "#b7ccd2", "#172330", PAPER, "#ffd486"),
  pearl: palette("#e7d4cc", "#b88aa0", "#8bded8", "#fff5f0", "#1a2430", PAPER, "#ffffff"),
  storm: palette("#456277", "#1f3142", "#f0d16b", "#b9c6d3", "#101923", PAPER, "#ffe887"),
  moon: palette("#687bb2", "#263761", "#b9c3ff", "#e8eaff", "#101923", PAPER, "#dfe6ff"),
  amber: palette("#e8955d", "#8d5745", "#ffe08a", "#ffd3a3", "#1f2930", PAPER, "#ffe19b"),
  glacier: palette("#9dddec", "#4f8fb8", "#ffffff", "#d8f5ff", "#173346", PAPER, "#f0feff"),
  trench: palette("#24445f", "#08182a", "#74d7cf", "#6da6c9", "#07111c", PAPER, "#8df9ed"),
  aurora: palette("#5f78cc", "#192e61", "#9effdf", "#d9ccff", "#0c1730", PAPER, "#b9ffd8"),
};

export function svgDataUri(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function creatureSvgFor(fish: FishDefinition): string {
  return CREATURE_SVGS[fish.assetKey] ?? createGeneratedCreatureSvg(fish);
}

export function itemIconSvgFor(item: ItemDefinition): string {
  if (item.kind === "rod") {
    return createRodSvg(item);
  }
  if (item.kind === "bait") {
    return createBaitSvg(item);
  }
  if (item.kind === "boat") {
    return createBoatIconSvg(item);
  }
  return createFlagSvg(item);
}

export function boatSideSvgFor(item: ItemDefinition): string {
  return createBoatSvg(item, "side");
}

export function boatMapSvgFor(item: ItemDefinition): string {
  return createBoatSvg(item, "map");
}

export function boatFlagSvgFor(item: ItemDefinition): string {
  return createFlagSvg(item, 88, 62);
}

export function captainSvgFor(captain: CaptainStyle): string {
  const skin = hexColor(captain.skinTone);
  const hair = hexColor(captain.hairTint);
  const outfit = hexColor(captain.outfitTint);
  const accent = hexColor(captain.accentTint);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="190" viewBox="-60 -100 120 190">
    <defs>
      <linearGradient id="captain-coat" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${accent}"/>
        <stop offset="42%" stop-color="${outfit}"/>
        <stop offset="100%" stop-color="#172330"/>
      </linearGradient>
      <filter id="captain-shadow" x="-25%" y="-25%" width="150%" height="150%">
        <feDropShadow dx="0" dy="1.8" stdDeviation="1.2" flood-color="${INK}" flood-opacity="0.16"/>
      </filter>
    </defs>
    <ellipse cx="0" cy="82" rx="32" ry="7" fill="${INK}" opacity="0.14"/>
    <g filter="url(#captain-shadow)">
      <path d="M-18 17 L-5 17 L-10 78 L-24 78Z" fill="#1e2b36" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M6 17 L19 17 L26 78 L12 78Z" fill="#1e2b36" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M-28 82 H-8 M10 82 H31" stroke="#221b18" stroke-width="6" stroke-linecap="round"/>
      <path d="M-25 -40 C-16 -47 17 -47 26 -40 L30 24 C17 32 -18 32 -31 24Z" fill="url(#captain-coat)" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="M-12 -35 H13 L16 18 C8 23 -8 23 -17 18Z" fill="${accent}" opacity="0.86" stroke="${INK}" stroke-width="1.2"/>
      <path d="M-4 -34 V20 M8 -34 V20" stroke="#102333" stroke-width="3" opacity="0.45"/>
      <path d="M-23 -28 C-34 -12 -39 3 -42 18" fill="none" stroke="${outfit}" stroke-width="8" stroke-linecap="round"/>
      <path d="M23 -28 C36 -17 42 -7 46 6" fill="none" stroke="${outfit}" stroke-width="8" stroke-linecap="round"/>
      <path d="M-23 -28 C-34 -12 -39 3 -42 18 M23 -28 C36 -17 42 -7 46 6" fill="none" stroke="${INK}" stroke-width="2.2" stroke-linecap="round" opacity="0.28"/>
      <ellipse cx="-42" cy="20" rx="5.5" ry="7" fill="${skin}" stroke="${INK}" stroke-width="1.1"/>
      <ellipse cx="46" cy="7" rx="5.5" ry="7" fill="${skin}" stroke="${INK}" stroke-width="1.1"/>
      <ellipse cx="0" cy="-61" rx="15" ry="18" fill="${skin}" stroke="${INK}" stroke-width="2"/>
      <path d="M-16 -67 C-13 -84 13 -85 18 -68 C9 -72 -5 -75 -16 -67Z" fill="${hair}" stroke="${INK}" stroke-width="1.5"/>
      <path d="M-24 -80 H24 L20 -68 H-20Z" fill="${outfit}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>
      <path d="M-6 -91 H7 L11 -80 H-10Z" fill="${accent}" stroke="${INK}" stroke-width="1.4" stroke-linejoin="round"/>
      <path d="M-10 -60 H-3 M6 -60 H13" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
      <path d="M0 -56 L-2 -50" stroke="#6b4432" stroke-width="2" stroke-linecap="round"/>
      <path d="M-7 -45 Q0 -40 8 -45" fill="none" stroke="#4e3428" stroke-width="2" stroke-linecap="round"/>
      <path d="M43 7 L56 -23" stroke="#6d4b34" stroke-width="4" stroke-linecap="round"/>
      <path d="M56 -23 L55 0" stroke="${INK}" stroke-width="1.8" opacity="0.4"/>
      <ellipse cx="55" cy="6" rx="5" ry="4" fill="${accent}" stroke="${INK}" stroke-width="1"/>
      <path d="M-18 -38 C-3 -32 12 -32 27 -38" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.28"/>
    </g>
  </svg>`;
}

function createGeneratedCreatureSvg(fish: FishDefinition): string {
  const seed = hashString(fish.id);
  const theme = themeFromAreaId(fish.areaIds[0] ?? fish.id);
  const colors = themePalettes[theme] ?? themePalettes.beach;
  const shape = creatureShapeFor(fish.id);
  const gradientId = `cg-${seed.toString(36)}`;
  const pattern = seed % 4;
  const rarityAura = !["common", "uncommon"].includes(fish.rarity);

  return svg(96, 68, `
    <defs>
      <radialGradient id="${gradientId}" cx="45%" cy="34%" r="72%">
        <stop offset="0%" stop-color="${colors.accentSoft}"/>
        <stop offset="58%" stop-color="${colors.body}"/>
        <stop offset="100%" stop-color="${colors.bodyDeep}"/>
      </radialGradient>
      <filter id="soft-${gradientId}" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="1.4" stdDeviation="1.2" flood-color="${colors.ink}" flood-opacity="0.18"/>
      </filter>
    </defs>
    <ellipse cx="49" cy="61" rx="${shape === "eel" ? 34 : 26}" ry="5" fill="${colors.ink}" opacity="0.1"/>
    ${rarityAura ? `<ellipse cx="48" cy="35" rx="42" ry="27" fill="${colors.glow}" opacity="0.18"/>` : ""}
    <g filter="url(#soft-${gradientId})">
      ${creatureBody(shape, `url(#${gradientId})`, colors)}
      ${creaturePattern(shape, pattern, colors)}
      ${creatureFace(shape, colors)}
    </g>
  `);
}

function creatureBody(shape: CreatureShape, fill: string, colors: SvgPalette): string {
  switch (shape) {
    case "needle":
      return `
        <path d="M10 35 C25 24 55 23 86 32 C61 41 31 43 10 35Z" fill="${fill}" stroke="${colors.ink}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M14 35 L2 24 L6 36 L2 48Z" fill="${colors.bodyDeep}" stroke="${colors.ink}" stroke-width="1.5" stroke-linejoin="round"/>
        <path d="M52 25 Q61 10 73 18" fill="${colors.bodyDeep}" stroke="${colors.ink}" stroke-width="1.4"/>
        <path d="M60 41 Q70 54 79 45" fill="${colors.accent}" stroke="${colors.ink}" stroke-width="1.2"/>
      `;
    case "ray":
      return `
        <path d="M8 38 C22 20 37 14 48 16 C60 14 76 20 88 38 C69 43 58 51 48 65 C38 51 27 43 8 38Z" fill="${fill}" stroke="${colors.ink}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M55 52 C69 56 78 60 88 65" fill="none" stroke="${colors.bodyDeep}" stroke-width="3" stroke-linecap="round"/>
      `;
    case "squid":
      return `
        <path d="M22 28 L12 18 L18 42Z" fill="${colors.accentSoft}" stroke="${colors.ink}" stroke-width="1.5"/>
        <path d="M74 28 L84 18 L78 42Z" fill="${colors.accentSoft}" stroke="${colors.ink}" stroke-width="1.5"/>
        <path d="M27 50 C25 28 36 10 48 8 C60 10 71 28 69 50 C58 56 38 56 27 50Z" fill="${fill}" stroke="${colors.ink}" stroke-width="2"/>
        ${tentacles(colors, 28, 50, 6)}
      `;
    case "crab":
      return `
        <path d="M24 46 L9 37 M26 52 L10 52 M70 46 L86 37 M68 52 L86 52" stroke="${colors.bodyDeep}" stroke-width="3" stroke-linecap="round"/>
        <ellipse cx="48" cy="45" rx="28" ry="18" fill="${fill}" stroke="${colors.ink}" stroke-width="2"/>
        <ellipse cx="18" cy="33" rx="10" ry="8" fill="${colors.accent}" stroke="${colors.ink}" stroke-width="1.5"/>
        <ellipse cx="78" cy="33" rx="10" ry="8" fill="${colors.accent}" stroke="${colors.ink}" stroke-width="1.5"/>
      `;
    case "eel":
      return `
        <path d="M8 43 C23 24 40 48 54 31 C67 17 79 31 90 39 C79 49 65 48 54 43 C37 36 25 60 8 43Z" fill="${fill}" stroke="${colors.ink}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M16 41 C33 33 49 46 68 33" fill="none" stroke="${colors.accentSoft}" stroke-width="4" stroke-linecap="round" opacity="0.72"/>
      `;
    case "turtle":
      return `
        <circle cx="73" cy="35" r="12" fill="${colors.accentSoft}" stroke="${colors.ink}" stroke-width="1.7"/>
        <ellipse cx="45" cy="38" rx="32" ry="24" fill="${fill}" stroke="${colors.ink}" stroke-width="2"/>
        <path d="M26 36 C36 19 55 20 66 36 C56 52 37 53 26 36Z" fill="${colors.bodyDeep}" opacity="0.3"/>
        <path d="M38 19 L45 54 M56 22 L48 55 M28 35 L67 36" stroke="${colors.ink}" stroke-width="1" opacity="0.24"/>
      `;
    case "clam":
      return `
        <ellipse cx="48" cy="42" rx="34" ry="20" fill="${fill}" stroke="${colors.ink}" stroke-width="2"/>
        <path d="M18 42 C24 23 35 16 48 17 C62 16 74 24 78 42Z" fill="${colors.accentSoft}" stroke="${colors.ink}" stroke-width="1.6"/>
        <circle cx="49" cy="45" r="8" fill="${colors.paper}" opacity="0.95"/>
        <path d="M48 18 L48 47 M36 22 L43 48 M60 22 L54 48 M26 33 L40 49 M70 33 L57 49" stroke="${colors.ink}" stroke-width="1" opacity="0.25"/>
      `;
    case "whale":
      return `
        <path d="M11 40 L2 26 Q7 39 2 53Z" fill="${colors.bodyDeep}" stroke="${colors.ink}" stroke-width="1.5"/>
        <ellipse cx="50" cy="39" rx="37" ry="23" fill="${fill}" stroke="${colors.ink}" stroke-width="2.3"/>
        <ellipse cx="53" cy="49" rx="23" ry="10" fill="${colors.paper}" opacity="0.22"/>
        <path d="M69 22 Q82 6 91 13 M69 25 Q83 14 93 23" fill="none" stroke="${colors.accent}" stroke-width="3" stroke-linecap="round"/>
      `;
    case "nudibranch":
      return `
        ${tentacles(colors, 27, 23, 7, true)}
        <path d="M13 46 C17 29 31 23 50 24 C69 23 83 31 85 47 C78 61 58 65 38 62 C22 60 13 54 13 46Z" fill="${fill}" stroke="${colors.ink}" stroke-width="2"/>
        <path d="M35 29 Q32 14 35 7 M58 28 Q61 13 60 6" fill="none" stroke="${colors.accent}" stroke-width="5" stroke-linecap="round"/>
      `;
    default:
      return `
        <path d="M18 35 L4 20 Q9 35 4 50Z" fill="${colors.bodyDeep}" stroke="${colors.ink}" stroke-width="1.5" stroke-linejoin="round"/>
        <ellipse cx="51" cy="35" rx="32" ry="19" fill="${fill}" stroke="${colors.ink}" stroke-width="2"/>
        <path d="M47 18 Q57 8 70 17" fill="${colors.bodyDeep}" stroke="${colors.ink}" stroke-width="1.4"/>
        <path d="M54 51 Q62 61 70 51" fill="${colors.accent}" stroke="${colors.ink}" stroke-width="1.2"/>
      `;
  }
}

function creaturePattern(shape: CreatureShape, pattern: number, colors: SvgPalette): string {
  if (shape === "crab" || shape === "clam") {
    return `<path d="M31 39 Q48 32 65 39" fill="none" stroke="${colors.ink}" stroke-width="1" opacity="0.22"/>`;
  }
  if (pattern === 0) {
    return `<path d="M28 28 Q48 20 70 28" fill="none" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" opacity="0.48"/>`;
  }
  if (pattern === 1) {
    return `<circle cx="39" cy="31" r="4" fill="${colors.accent}" opacity="0.48"/><circle cx="54" cy="42" r="3.5" fill="${colors.accent}" opacity="0.42"/>`;
  }
  if (pattern === 2) {
    return `<path d="M30 24 L36 48 M45 22 L49 51 M61 25 L57 49" stroke="${colors.ink}" stroke-width="1" opacity="0.22"/>`;
  }
  return `<path d="M26 43 Q48 51 70 43" fill="none" stroke="${colors.paper}" stroke-width="2" stroke-linecap="round" opacity="0.35"/>`;
}

function creatureFace(shape: CreatureShape, colors: SvgPalette): string {
  const leftX = shape === "crab" ? 39 : shape === "nudibranch" ? 68 : 66;
  const rightX = shape === "crab" ? 57 : shape === "nudibranch" ? 77 : 0;
  const y = shape === "nudibranch" ? 41 : 32;
  if (shape === "crab") {
    return `
      <circle cx="${leftX}" cy="27" r="5.5" fill="#ffffff" stroke="${colors.ink}" stroke-width="1.4"/>
      <circle cx="${leftX + 1}" cy="27" r="3" fill="${colors.ink}"/>
      <circle cx="${rightX}" cy="27" r="5.5" fill="#ffffff" stroke="${colors.ink}" stroke-width="1.4"/>
      <circle cx="${rightX + 1}" cy="27" r="3" fill="${colors.ink}"/>
      <path d="M42 43 Q48 47 54 43" fill="none" stroke="${colors.ink}" stroke-width="1.4" stroke-linecap="round"/>
    `;
  }
  return `
    <circle cx="${leftX}" cy="${y}" r="6.2" fill="#ffffff" stroke="${colors.ink}" stroke-width="1.5"/>
    <circle cx="${leftX + 1}" cy="${y}" r="3.7" fill="${colors.ink}"/>
    <circle cx="${leftX + 2.4}" cy="${y - 1.8}" r="1.3" fill="#ffffff"/>
    ${rightX ? `<circle cx="${rightX}" cy="${y}" r="4.8" fill="#ffffff" stroke="${colors.ink}" stroke-width="1.2"/><circle cx="${rightX + 1}" cy="${y}" r="2.7" fill="${colors.ink}"/>` : ""}
    <path d="M${leftX - 10} ${y + 13} Q${leftX - 4} ${y + 18} ${leftX + 3} ${y + 13}" fill="none" stroke="${colors.ink}" stroke-width="1.4" stroke-linecap="round" opacity="0.75"/>
  `;
}

function tentacles(colors: SvgPalette, startX: number, startY: number, count: number, dorsal = false): string {
  return Array.from({ length: count }, (_, index) => {
    const x = startX + index * 7;
    const sway = index % 2 === 0 ? -5 : 5;
    const y2 = dorsal ? startY - 16 - (index % 3) * 3 : startY + 16 + (index % 3) * 3;
    return `<path d="M${x} ${startY} Q${x + sway} ${(startY + y2) / 2} ${x + sway * 0.5} ${y2}" fill="none" stroke="${colors.bodyDeep}" stroke-width="${dorsal ? 2.4 : 2.8}" stroke-linecap="round" opacity="0.84"/>`;
  }).join("");
}

function createRodSvg(item: ItemDefinition): string {
  const colors = paletteForItem(item.id);
  const tier = tierForItem(item.id);
  return svg(96, 96, `
    <defs>${gearGradient("rod", colors)}</defs>
    <ellipse cx="48" cy="82" rx="29" ry="5" fill="${INK}" opacity="0.1"/>
    <path d="M24 72 C39 49 55 28 77 10" fill="none" stroke="${colors.bodyDeep}" stroke-width="${5 + tier * 0.4}" stroke-linecap="round"/>
    <path d="M24 72 C39 49 55 28 77 10" fill="none" stroke="url(#rod-grad)" stroke-width="${3 + tier * 0.3}" stroke-linecap="round"/>
    <circle cx="33" cy="60" r="9" fill="${colors.paper}" stroke="${INK}" stroke-width="2"/>
    <circle cx="33" cy="60" r="4" fill="${colors.accent}"/>
    <path d="M72 14 C87 22 83 39 68 42" fill="none" stroke="${colors.ink}" stroke-width="1.7" opacity="0.44"/>
    <path d="M68 42 L58 54" stroke="${colors.ink}" stroke-width="1.4" opacity="0.35"/>
    ${tier >= 3 ? `<path d="M78 9 L83 16 L91 14 L85 20 L88 28 L80 23 L73 28 L76 19 L70 14Z" fill="${colors.glow}" opacity="0.92"/>` : ""}
  `);
}

function createBaitSvg(item: ItemDefinition): string {
  const colors = paletteForItem(item.id);
  const tier = tierForItem(item.id);
  return svg(96, 96, `
    <defs>${gearGradient("bait", colors)}</defs>
    <ellipse cx="48" cy="82" rx="28" ry="5" fill="${INK}" opacity="0.1"/>
    <path d="M30 35 C30 21 41 16 50 23 C59 16 71 22 69 37 C77 42 76 57 65 63 C59 74 39 75 32 63 C21 58 21 42 30 35Z" fill="url(#bait-grad)" stroke="${INK}" stroke-width="2.4"/>
    <path d="M37 34 Q49 25 62 35" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.45"/>
    <circle cx="39" cy="49" r="4.5" fill="${colors.accent}" opacity="0.72"/>
    <circle cx="56" cy="40" r="3.8" fill="${colors.paper}" opacity="0.84"/>
    <circle cx="57" cy="58" r="4.2" fill="${colors.accentSoft}" opacity="0.8"/>
    ${tier >= 2 ? `<path d="M48 17 C49 9 55 7 61 6" fill="none" stroke="${colors.accent}" stroke-width="3" stroke-linecap="round"/>` : ""}
  `);
}

function createFlagSvg(item: ItemDefinition, width = 96, height = 96): string {
  const colors = paletteForItem(item.id);
  const tier = tierForItem(item.id);
  return svg(width, height, `
    <defs>${gearGradient("flag", colors)}</defs>
    <path d="M24 16 L24 ${height - 14}" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
    <path d="M27 18 C44 10 58 25 74 17 L74 52 C58 61 44 45 27 54Z" fill="url(#flag-grad)" stroke="${INK}" stroke-width="2.2" stroke-linejoin="round"/>
    <path d="M34 27 L45 34 L57 25 L63 41 L48 49 L36 43Z" fill="${colors.paper}" opacity="0.84" stroke="${INK}" stroke-width="1.1"/>
    <path d="M31 22 C45 18 57 31 71 24" fill="none" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.42"/>
    ${tier >= 3 ? `<circle cx="66" cy="21" r="4" fill="${colors.glow}" opacity="0.95"/>` : ""}
  `);
}

function createBoatIconSvg(item: ItemDefinition): string {
  return createBoatSvg(item, "icon");
}

function createBoatSvg(item: ItemDefinition, mode: "side" | "map" | "icon"): string {
  const colors = paletteForItem(item.id);
  const tier = tierForItem(item.id);
  if (mode === "map") {
    return svg(120, 132, `
      <defs>${gearGradient("boatmap", colors)}</defs>
      <ellipse cx="60" cy="72" rx="35" ry="52" fill="${INK}" opacity="0.13"/>
      <path d="M60 9 C82 38 90 82 72 121 L48 121 C30 82 38 38 60 9Z" fill="url(#boatmap-grad)" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M43 70 L77 70 M47 91 L73 91" stroke="${colors.paper}" stroke-width="5" stroke-linecap="round" opacity="0.6"/>
      <rect x="46" y="37" width="28" height="25" rx="5" fill="${colors.paper}" stroke="${INK}" stroke-width="1.7"/>
      <path d="M51 43 H69 M53 52 H67" stroke="${colors.bodyDeep}" stroke-width="2" opacity="0.58"/>
      ${tier >= 3 ? `<ellipse cx="60" cy="116" rx="24" ry="8" fill="${colors.glow}" opacity="0.34"/>` : ""}
    `);
  }

  const width = mode === "icon" ? 96 : 250;
  const height = mode === "icon" ? 96 : 168;
  const scale = mode === "icon" ? 0.42 : 1;
  const tx = mode === "icon" ? -5 : 0;
  const ty = mode === "icon" ? -31 : 0;
  return svg(width, height, `
    <defs>${gearGradient("boat", colors)}</defs>
    <g transform="translate(${tx} ${ty}) scale(${scale})">
      <ellipse cx="126" cy="145" rx="94" ry="14" fill="${INK}" opacity="0.14"/>
      <path d="M34 87 H220 C211 124 188 142 67 144 C47 133 37 116 34 87Z" fill="url(#boat-grad)" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
      <path d="M54 106 C95 116 158 115 204 101 C194 120 173 132 70 134 C61 127 56 119 54 106Z" fill="${colors.bodyDeep}" opacity="0.5"/>
      <path d="M63 78 H178" stroke="${colors.paper}" stroke-width="8" stroke-linecap="round"/>
      <path d="M80 78 V92 M112 78 V92 M144 78 V92" stroke="${INK}" stroke-width="2" opacity="0.35"/>
      <rect x="98" y="44" width="65" height="38" rx="7" fill="${colors.paper}" stroke="${INK}" stroke-width="2.4"/>
      <rect x="107" y="53" width="17" height="13" rx="3" fill="${colors.accentSoft}" stroke="${INK}" stroke-width="1" opacity="0.9"/>
      <rect x="132" y="53" width="19" height="13" rx="3" fill="${colors.accentSoft}" stroke="${INK}" stroke-width="1" opacity="0.9"/>
      <path d="M84 28 V89" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>
      <path d="M88 35 C116 40 139 56 157 76 L88 76Z" fill="${colors.accentSoft}" stroke="${INK}" stroke-width="2" stroke-linejoin="round" opacity="0.95"/>
      <path d="M49 91 C91 86 164 87 209 90" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.42"/>
      ${tier >= 3 ? `<ellipse cx="140" cy="145" rx="70" ry="9" fill="${colors.glow}" opacity="0.3"/>` : ""}
    </g>
  `);
}

function gearGradient(prefix: string, colors: SvgPalette): string {
  return `
    <linearGradient id="${prefix}-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${colors.accentSoft}"/>
      <stop offset="48%" stop-color="${colors.body}"/>
      <stop offset="100%" stop-color="${colors.bodyDeep}"/>
    </linearGradient>
  `;
}

function themeFromAreaId(areaId: string): string {
  if (areaId === "sunny-beach") return "beach";
  if (areaId === "little-pier") return "pier";
  if (areaId === "coral-sea") return "coral";
  if (areaId.includes("starlit")) return "moon";
  if (areaId.includes("glass")) return "trench";
  if (areaId.includes("tempest")) return "storm";
  if (areaId.includes("temporal")) return "pearl";
  if (areaId.includes("misty")) return "mist";
  if (areaId.includes("kelp")) return "kelp";
  if (areaId.includes("basalt")) return "basalt";
  if (areaId.includes("pearl")) return "pearl";
  if (areaId.includes("storm")) return "storm";
  if (areaId.includes("moon")) return "moon";
  if (areaId.includes("starwhale") || areaId.includes("galaxy") || areaId.includes("stars-breath")) return "aurora";
  if (areaId.includes("moonhalo")) return "moon";
  if (areaId.includes("meteor")) return "pearl";
  if (areaId.includes("crown") || areaId.includes("black-pearl") || areaId.includes("ancient-lantern")) return "trench";
  if (areaId.includes("silent-throne")) return "basalt";
  if (areaId.includes("amber")) return "amber";
  if (areaId.includes("glacier")) return "glacier";
  if (areaId.includes("lantern")) return "trench";
  if (areaId.includes("aurora")) return "aurora";
  return "beach";
}

function creatureShapeFor(id: string): CreatureShape {
  if (id.includes("needlefish")) return "needle";
  if (id.includes("veil-ray")) return "ray";
  if (id.includes("comet-squid")) return "squid";
  if (id.includes("mosaic-crab")) return "crab";
  if (id.includes("lantern-eel")) return "eel";
  if (id.includes("velvet-turtle")) return "turtle";
  if (id.includes("crown-clam")) return "clam";
  if (id.includes("skywhale")) return "whale";
  if (id.includes("mythic-nudibranch")) return "nudibranch";
  return "fish";
}

function paletteForItem(itemId: string): SvgPalette {
  const slug = itemId.split("-")[0] ?? "harbor";
  const mapped =
    slug === "harbor" ? "pier" :
    slug === "sunray" ? "beach" :
    slug === "reef" ? "coral" :
    slug === "tide" ? "coral" :
    slug === "compass" ? "amber" :
    slug === "starline" || slug === "stardust" || slug === "starlit" || slug === "moonwhisper" ? "moon" :
    slug === "glass" || slug === "deep" ? "trench" :
    slug === "tempest" ? "storm" :
    slug === "chronocoral" || slug === "clockwork" || slug === "clock" || slug === "crown" ? "pearl" :
    slug === "whalesong" || slug === "whale" || slug === "skywhale" ? "aurora" :
    slug === "mirror" || slug === "comet" ? "coral" :
    slug === "ancient" || slug === "legend" ? "aurora" :
    slug;
  return themePalettes[mapped] ?? themePalettes.beach;
}

function tierForItem(itemId: string): number {
  if (itemId.includes("aurora")) return 5;
  if (itemId.includes("tideglass")) return 4;
  if (itemId.includes("captain") || itemId.includes("coral-runner")) return 3;
  if (itemId.includes("sparkle") || itemId.includes("blue-runabout")) return 2;
  const match = itemId.match(/-(\d+)-/);
  return match ? Number(match[1]) : 1;
}

function palette(body: string, bodyDeep: string, accent: string, accentSoft: string, ink: string, paper: string, glow: string): SvgPalette {
  return { body, bodyDeep, accent, accentSoft, ink, paper, glow };
}

function svg(width: number, height: number, body: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${body}</svg>`;
}

function hexColor(value: number): string {
  return `#${value.toString(16).padStart(6, "0")}`;
}

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

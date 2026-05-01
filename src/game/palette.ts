// Japanese nature illustration palette
// 墨(sumi) · 和紙(washi) · 藍(ai) · 朱(shu) · 金箔(kinpaku) · 翡翠(hisui)
export const PALETTE = {
  ink: 0x1a1209,        // 墨 sumi — warm ink (not cold navy)
  inkSoft: 0x3d2c1e,    // soft sumi — medium warm brown
  paper: 0xf7f0e0,      // 和紙 washi — warm ivory
  warmCream: 0xeee3c8,  // aged washi — slightly deeper
  seaFoam: 0xa8d5c8,    // pale jade-teal
  seaGlass: 0x5db8b0,   // sea-glass green
  lagoon: 0x1e6080,     // 藍 ai — deep indigo sea
  deepLagoon: 0x124460, // deep water indigo
  butter: 0xcf9820,     // 金箔 kinpaku — warm gold
  coral: 0xc85020,      // 朱 shu — vermilion
  coralDeep: 0xa83818,  // deep vermilion
  moss: 0x2a6848,       // 翡翠 hisui — jade green
  mossDark: 0x1a4830,   // dark jade
  driftwood: 0x7a5535,
  driftwoodDark: 0x5a3a20,
  lavender: 0x8895c8,   // 縹 hanada — pale blue-grey (fusuma)
  disabled: 0xb0b8bc,
  white: 0xffffff,
} as const;

export const TEXT = {
  primary: "#1a1209",   // warm sumi ink
  secondary: "#4a3220", // warm medium brown
  disabled: "#8a7868",  // warm grey
} as const;

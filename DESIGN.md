---
version: alpha
name: Banjjakbada Commercial Art Direction
description: Premium family-friendly sailing RPG design system for Phaser, SVG assets, port trade scenes, collection cards, and mobile landscape play.
colors:
  primary: "#123A4A"
  on-primary: "#F6FBFF"
  secondary: "#2F7D8C"
  on-secondary: "#F7FCFA"
  tertiary: "#E87D4F"
  on-tertiary: "#2A140D"
  accent-gold: "#F3BE4C"
  accent-coral: "#F06F61"
  sea-glass: "#7EC8B7"
  deep-navy: "#082536"
  storm-indigo: "#39446D"
  aurora-mint: "#9BE7C6"
  pearl: "#F7F2E7"
  paper: "#FFF8EA"
  ink: "#17313A"
  muted-ink: "#58707A"
  line: "#D6E4E6"
  surface: "#FFFFFF"
  surface-blue: "#E9F7F9"
  shadow: "#0A2233"
typography:
  display:
    fontFamily: Pretendard, system-ui, sans-serif
    fontSize: 2rem
    fontWeight: 800
    lineHeight: 1.12
    letterSpacing: 0
  title:
    fontFamily: Pretendard, system-ui, sans-serif
    fontSize: 1.25rem
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: 0
  body:
    fontFamily: Pretendard, system-ui, sans-serif
    fontSize: 1rem
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: 0
  label:
    fontFamily: Pretendard, system-ui, sans-serif
    fontSize: 0.78rem
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: 0
rounded:
  sm: 4px
  md: 8px
  lg: 14px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 36px
components:
  button-primary:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-tertiary}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: 12px
  button-secondary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label}"
    rounded: "{rounded.md}"
    padding: 12px
  panel:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: 16px
  card-collection:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: 12px
  map-port-marker:
    backgroundColor: "{colors.accent-gold}"
    textColor: "{colors.deep-navy}"
    rounded: "{rounded.lg}"
    size: 44px
  route-line:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-secondary}"
    rounded: "{rounded.sm}"
    height: 4px
  creature-tag:
    backgroundColor: "{colors.sea-glass}"
    textColor: "{colors.deep-navy}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: 8px
  rarity-coral:
    backgroundColor: "{colors.accent-coral}"
    textColor: "{colors.on-tertiary}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: 8px
  storm-event:
    backgroundColor: "{colors.storm-indigo}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    padding: 16px
  aurora-badge:
    backgroundColor: "{colors.aurora-mint}"
    textColor: "{colors.deep-navy}"
    typography: "{typography.label}"
    rounded: "{rounded.lg}"
    padding: 8px
  pearl-chip:
    backgroundColor: "{colors.pearl}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    rounded: "{rounded.lg}"
    padding: 8px
  caption-surface:
    backgroundColor: "{colors.surface-blue}"
    textColor: "{colors.muted-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: 8px
  divider-line:
    backgroundColor: "{colors.line}"
    textColor: "{colors.ink}"
    rounded: "{rounded.sm}"
    height: 2px
  deep-shadow-overlay:
    backgroundColor: "{colors.shadow}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.md}"
    padding: 16px
---

# 반짝바다 Commercial Art Direction

## Overview

반짝바다는 낚시 게임에서 수집형 항해 RPG로 확장 중인 가족형 프리미엄 게임이다. 목표 무드는 calm, premium, collectible, gently cinematic이다. 플레이어가 항구를 발견하고, 배를 운항하고, 바다 친구를 수집하고, 교역로를 개척할 때 화면 전체가 손으로 다듬은 해양 모험책처럼 보여야 한다.

The visual north star is an original warm hand-painted coastal adventure: mineral blues, sea glass greens, coral accents, ochre sunlight, deep navy ink lines, and visible craft in silhouettes. Avoid toddler proportions, toy-like plastic colors, neon gradients, and direct imitation of any named studio.

## Colors

The palette balances readable UI surfaces with cinematic sea scenes.

- **Primary (#123A4A):** maritime ink for headers, dock structures, map labels, and serious navigation controls.
- **Secondary (#2F7D8C):** ocean teal for route lines, tabs, and safe action states.
- **Tertiary (#E87D4F):** coral-orange for primary actions, bite feedback, trade opportunity highlights, and warm harbor lights.
- **Accent Gold (#F3BE4C):** premium reward signal for rare cards, port seals, trade profit, and expedition milestones.
- **Pearl/Paper:** warm readable surfaces for inventory, quests, trade ledgers, and collection cards.
- **Deep Navy/Storm Indigo:** depth layers for night routes, dangerous sea events, and deep-crown chapter scenes.

Do not let one hue dominate the whole screen. Every major scene should include a warm accent, a cool sea tone, and a neutral reading surface.

## Typography

Use rounded, readable Korean-friendly sans typography. Text should feel polished but never corporate. Large display type is reserved for chapter titles, port arrival banners, and major discoveries. Dense RPG panels use compact title/body/label scale so mobile landscape screens stay uncluttered.

All in-game text must keep letter spacing at 0, avoid viewport-width font scaling, and use responsive wrapping rather than shrinking into unreadable labels.

## Layout

Mobile landscape is a first-class layout. Use the full viewport width and height, with safe-area padding only where device notches or browser controls require it. Avoid fixed central canvases that leave wide empty bars on the left and right.

For gameplay scenes, the Phaser canvas owns the first visual layer. UI overlays should be concise, docked to edges, and sized by practical touch targets. Port, trade, exchange, and collection screens may use panels, but panels should not be nested inside other panels.

Port travel must feel like sailing, not menu teleportation. A port selected on the map should become a sailing destination. The player enters the port only after reaching its dock radius and confirming arrival.

## Elevation & Depth

Use depth to make the sea feel alive:

- Far background: sky gradients, clouds, islands, aurora, storm curtains.
- Mid background: route landmarks, port silhouettes, reef shapes, distant boats.
- Foreground water: animated wave bands, foam, wakes, bubbles, glints, swimming sea friends.
- UI layer: crisp ink outlines, soft sea-colored shadows, and warm focus accents.

Keep shadows soft and low-contrast for family friendliness. Dangerous voyage events can increase contrast briefly, but should not become harsh or violent.

## Shapes

Characters should read as young adult coastal explorers: smaller head ratio, longer legs, practical clothes, grounded stance, and deck-aware foot placement. Boats need stronger hull language with cabin, deck rail, wake, and tinted paint variations. Higher tiers may add glow, sail trim, or wake effects without becoming noisy sci-fi assets.

Port map markers should have unique silhouettes: lighthouse, crane, pearl arch, basalt dock, aurora tower, crown gate, observatory mast. Interior port backgrounds need a distinct landmark in the first viewport so the player immediately knows where they arrived.

Sea friends should be unique silhouette first, color second. Every new creature family needs recognizable body language, habitat tags, and motion personality.

## Components

- **Collection cards:** card-game feel with rarity frame, creature silhouette window, habitat tags, size tag, affinity or research status, and subtle foil accents for mythic/legendary/ancient creatures.
- **Port markers:** icon-led, not text-led. Use compact labels only on hover/tap focus or selected state.
- **Trade table:** show price grade labels such as "싸요", "보통", "비싸요", "오늘 인기", and "희귀 수요" beside numeric values.
- **Voyage event popup:** 6-8 second timing challenge with clear success zone, non-destructive failure copy, and companion encouragement.
- **Equipment tiles:** communicate role at a glance: navigator, reeler, naturalist, stormbreaker, deepExplorer, mythSeeker, mutationHunter.

## Do's and Don'ts

Do:

- Read this file before changing UI, SVG assets, Phaser scene composition, port interiors, boats, characters, rods, bait, flags, creatures, or mobile layout.
- Run `npm run design:lint` after editing this file.
- Favor original art direction over copying any commercial brand or studio.
- Make ports navigable through sailing flow only.
- Use SVG factory/lazy texture patterns for scalable content families.

Don't:

- Do not add direct port teleport buttons that bypass sailing.
- Do not return to toddler body proportions, giant heads, oversized torsos, or floating feet.
- Do not use a one-note blue/purple gradient palette.
- Do not hide major gameplay behind explanatory marketing text.
- Do not remove existing loved sea-life ambience such as baby whale sightings without replacing the emotional moment.

## Port Visual Sprint

This sprint turns the port network into a sailing-first trade RPG loop. A port marker on the ocean map is a destination, not a teleport button. The player must sail to the dock radius, then use the arrival prompt to enter the port. `sailToPort` should only run at this arrival moment.

Port visuals must be checked against the Canva QA board and implemented as original SVG assets through the lazy texture pipeline. Canva is a moodboard and review surface, not the final asset source.

- **Map markers:** 10 ports need unique icon silhouettes: 햇살 등대, 산호 공방 크레인, 안개 봉화탑, 해초 시장 천막, 현무암 조선소, 진주 아치, 폭풍 나침탑, 극광 전망대, 별고래 관측돔, 심해 왕관문.
- **Interior images:** every port entry screen needs a first-viewport landmark image with sky, water, dock, and one signature structure.
- **Trade UI:** price labels must read clearly as chips: "싸요", "보통", "비싸요", "오늘 인기", "희귀 수요".
- **Mobile landscape QA:** port markers, route target rings, arrival prompts, market rows, and bottom navigation must not overlap.
- **Forbidden:** no direct port selection panel that changes the current port without sailing.

## Canva Style Boards

- Port Design QA Board: https://www.canva.com/d/Ccc0cHi1MM29ujE
- Candidate A: https://www.canva.com/d/JUUYkVbeylHPPvb
- Candidate B: https://www.canva.com/d/gupoE9i2P_UAcu_
- Candidate C: https://www.canva.com/d/Kab-VlVT2FtX6rR
- Candidate D: https://www.canva.com/d/7JsaAoaZy72mN8q

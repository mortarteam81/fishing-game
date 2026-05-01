/**
 * High-quality SVG illustrations for all 19 named sea creatures.
 * Style: Japanese nature illustration — bold ink outlines, flat colour with gradient,
 * expressive faces, detailed anatomy. ViewBox 0 0 96 68 matching texture dimensions.
 */
export const CREATURE_SVGS: Record<string, string> = {

  /* ───────── 1. 햇살 송사리 · Sunny Minnow ───────── */
  "fish-sunny-minnow": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 68">
  <defs>
    <radialGradient id="g" cx="60%" cy="38%" r="65%">
      <stop offset="0%" stop-color="#ffe87a"/>
      <stop offset="100%" stop-color="#cf9820"/>
    </radialGradient>
  </defs>
  <ellipse cx="50" cy="60" rx="26" ry="5" fill="#1a1209" opacity="0.1"/>
  <path d="M20 34 L4 20 Q9 34 4 48Z" fill="#cf9820" stroke="#1a1209" stroke-width="1.5" stroke-linejoin="round"/>
  <ellipse cx="51" cy="34" rx="30" ry="18" fill="url(#g)" stroke="#1a1209" stroke-width="2"/>
  <path d="M36 18 Q48 8 62 16" fill="none" stroke="#d4a018" stroke-width="5" stroke-linecap="round"/>
  <path d="M46 50 Q52 58 58 52" fill="none" stroke="#d4a018" stroke-width="4" stroke-linecap="round"/>
  <ellipse cx="44" cy="30" rx="3" ry="3.5" fill="none" stroke="#1a1209" stroke-width="0.8" opacity="0.4"/>
  <ellipse cx="54" cy="27" rx="3" ry="3.5" fill="none" stroke="#1a1209" stroke-width="0.8" opacity="0.4"/>
  <ellipse cx="52" cy="38" rx="3" ry="3.5" fill="none" stroke="#1a1209" stroke-width="0.8" opacity="0.4"/>
  <path d="M30 26 Q52 21 68 28" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" opacity="0.5"/>
  <circle cx="70" cy="31" r="6.5" fill="white" stroke="#1a1209" stroke-width="1.5"/>
  <circle cx="71" cy="31" r="3.8" fill="#1a1209"/>
  <circle cx="72.5" cy="29.5" r="1.4" fill="white"/>
  <ellipse cx="62" cy="37" rx="4.5" ry="2.5" fill="#ff8040" opacity="0.35"/>
  <path d="M9 30 L11 34 L14 33 L11 37 L13 40 L10 37 L7 38 L9 35 L7 31 L10 33Z" fill="#ffe87a" opacity="0.9"/>
</svg>`,

  /* ───────── 2. 방울 가자미 · Bubble Flounder ───────── */
  "fish-bubble-flounder": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 68">
  <defs>
    <radialGradient id="g" cx="45%" cy="38%" r="65%">
      <stop offset="0%" stop-color="#c4ecfc"/>
      <stop offset="100%" stop-color="#5db8b0"/>
    </radialGradient>
  </defs>
  <ellipse cx="48" cy="62" rx="30" ry="5" fill="#1a1209" opacity="0.1"/>
  <path d="M12 36 Q16 22 26 18 Q36 12 48 18 Q60 12 72 18 Q82 22 84 36 Q82 52 68 58 Q54 64 42 60 Q22 56 12 36Z" fill="url(#g)" stroke="#1a1209" stroke-width="2"/>
  <path d="M22 30 Q48 14 76 30" fill="none" stroke="#1a1209" stroke-width="1.2" opacity="0.35"/>
  <circle cx="36" cy="32" r="5.5" fill="#1a1209" opacity="0.12"/>
  <circle cx="50" cy="26" r="4.5" fill="#1a1209" opacity="0.12"/>
  <circle cx="64" cy="33" r="5" fill="#1a1209" opacity="0.12"/>
  <circle cx="44" cy="44" r="4" fill="#1a1209" opacity="0.1"/>
  <path d="M28 28 Q48 20 68 28" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" opacity="0.5"/>
  <circle cx="64" cy="24" r="5.5" fill="white" stroke="#1a1209" stroke-width="1.5"/>
  <circle cx="65" cy="24" r="3.2" fill="#1a1209"/>
  <circle cx="66.5" cy="22.5" r="1.2" fill="white"/>
  <circle cx="50" cy="20" r="4.5" fill="white" stroke="#1a1209" stroke-width="1.5"/>
  <circle cx="51" cy="20" r="2.6" fill="#1a1209"/>
  <circle cx="52.5" cy="18.8" r="1" fill="white"/>
  <path d="M30 44 Q32 48 36 46" fill="none" stroke="#1a1209" stroke-width="1.5" stroke-linecap="round"/>
</svg>`,

  /* ───────── 3. 모래 새우 · Sand Shrimp ───────── */
  "fish-sand-shrimp": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 68">
  <defs>
    <radialGradient id="g" cx="50%" cy="40%" r="65%">
      <stop offset="0%" stop-color="#ffcc88"/>
      <stop offset="100%" stop-color="#d4762a"/>
    </radialGradient>
  </defs>
  <ellipse cx="52" cy="62" rx="22" ry="5" fill="#1a1209" opacity="0.1"/>
  <path d="M76 40 L88 29 L90 44 L84 52 L80 40Z" fill="#d4762a" stroke="#1a1209" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M18 26 Q28 16 44 20 Q60 18 70 28 Q78 36 74 50 Q68 60 56 58 Q40 62 28 52 Q14 40 18 26Z" fill="url(#g)" stroke="#1a1209" stroke-width="2"/>
  <path d="M36 18 Q38 38 44 58" fill="none" stroke="#1a1209" stroke-width="1" opacity="0.3"/>
  <path d="M50 17 Q52 38 54 58" fill="none" stroke="#1a1209" stroke-width="1" opacity="0.3"/>
  <path d="M63 24 Q64 40 64 56" fill="none" stroke="#1a1209" stroke-width="1" opacity="0.3"/>
  <path d="M40 54 L34 64" stroke="#d4762a" stroke-width="2" stroke-linecap="round"/>
  <path d="M48 57 L44 66" stroke="#d4762a" stroke-width="2" stroke-linecap="round"/>
  <path d="M56 57 L54 66" stroke="#d4762a" stroke-width="2" stroke-linecap="round"/>
  <path d="M22 26 Q10 16 4 8" fill="none" stroke="#d4762a" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M20 22 Q8 12 2 4" fill="none" stroke="#d4762a" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M22 28 Q44 18 68 28" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" opacity="0.45"/>
  <circle cx="20" cy="28" r="6" fill="white" stroke="#1a1209" stroke-width="1.5"/>
  <circle cx="21" cy="28" r="3.5" fill="#1a1209"/>
  <circle cx="22.5" cy="26.5" r="1.3" fill="white"/>
</svg>`,

  /* ───────── 4. 복숭아 해마 · Peach Seahorse ───────── */
  "fish-peach-seahorse": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 68">
  <defs>
    <radialGradient id="g" cx="45%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#ffc4b0"/>
      <stop offset="100%" stop-color="#e07858"/>
    </radialGradient>
  </defs>
  <path d="M56 46 Q68 48 70 57 Q70 65 62 65 Q54 65 54 58 Q54 52 60 52" fill="none" stroke="#e07858" stroke-width="5" stroke-linecap="round"/>
  <ellipse cx="48" cy="38" rx="16" ry="22" fill="url(#g)" stroke="#1a1209" stroke-width="2"/>
  <ellipse cx="52" cy="18" rx="14" ry="14" fill="url(#g)" stroke="#1a1209" stroke-width="2"/>
  <path d="M58 16 L74 11" stroke="#1a1209" stroke-width="5" stroke-linecap="round"/>
  <path d="M58 16 L74 11" stroke="#ffc4b0" stroke-width="3" stroke-linecap="round"/>
  <path d="M44 6 L46 2 L50 6 L53 1 L56 6 L59 3 L61 8" fill="none" stroke="#cf9820" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M36 28 Q30 22 34 40" fill="none" stroke="#e07858" stroke-width="4" stroke-linecap="round" opacity="0.8"/>
  <path d="M34 44 Q50 42 62 46" fill="none" stroke="#1a1209" stroke-width="1" opacity="0.28"/>
  <path d="M34 36 Q50 34 62 38" fill="none" stroke="#1a1209" stroke-width="1" opacity="0.28"/>
  <path d="M34 50 Q50 48 62 52" fill="none" stroke="#1a1209" stroke-width="1" opacity="0.22"/>
  <path d="M44 14 Q50 10 58 14" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" opacity="0.5"/>
  <ellipse cx="50" cy="42" rx="8" ry="14" fill="white" opacity="0.18"/>
  <circle cx="56" cy="16" r="5.5" fill="white" stroke="#1a1209" stroke-width="1.5"/>
  <circle cx="57" cy="16" r="3.2" fill="#1a1209"/>
  <circle cx="58.5" cy="14.5" r="1.2" fill="white"/>
</svg>`,

  /* ───────── 5. 리본 오징어 · Ribbon Squid ───────── */
  "fish-ribbon-squid": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 68">
  <defs>
    <radialGradient id="g" cx="50%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#f8c0e0"/>
      <stop offset="100%" stop-color="#c060a8"/>
    </radialGradient>
  </defs>
  <path d="M30 48 Q26 58 28 66" fill="none" stroke="#c060a8" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M38 50 Q36 60 38 66" fill="none" stroke="#c060a8" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M46 50 Q46 60 48 67" fill="none" stroke="#c060a8" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M54 50 Q56 60 56 67" fill="none" stroke="#c060a8" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M62 48 Q64 58 64 66" fill="none" stroke="#c060a8" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M70 44 Q74 54 72 65" fill="none" stroke="#c060a8" stroke-width="2" stroke-linecap="round"/>
  <path d="M20 28 L10 20 L18 40Z" fill="#f8c0e0" stroke="#1a1209" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M78 28 L88 20 L80 40Z" fill="#f8c0e0" stroke="#1a1209" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M26 50 Q24 28 36 14 Q48 6 60 14 Q72 28 70 50 Q60 54 48 54 Q36 54 26 50Z" fill="url(#g)" stroke="#1a1209" stroke-width="2"/>
  <ellipse cx="48" cy="30" rx="14" ry="10" fill="#c060a8" opacity="0.22"/>
  <path d="M36 18 Q48 14 60 18" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" opacity="0.5"/>
  <circle cx="38" cy="36" r="5.5" fill="white" stroke="#1a1209" stroke-width="1.5"/>
  <circle cx="39" cy="36" r="3.2" fill="#1a1209"/>
  <circle cx="40.5" cy="34.5" r="1.2" fill="white"/>
  <circle cx="58" cy="36" r="5.5" fill="white" stroke="#1a1209" stroke-width="1.5"/>
  <circle cx="59" cy="36" r="3.2" fill="#1a1209"/>
  <circle cx="60.5" cy="34.5" r="1.2" fill="white"/>
  <path d="M42 44 Q48 49 54 44" fill="none" stroke="#1a1209" stroke-width="1.5" stroke-linecap="round"/>
</svg>`,

  /* ───────── 6. 달빛 해파리 · Moon Jellyfish ───────── */
  "fish-moon-jelly": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 68">
  <defs>
    <radialGradient id="g" cx="45%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#e4f4ff"/>
      <stop offset="100%" stop-color="#8cb8e0"/>
    </radialGradient>
  </defs>
  <path d="M28 52 Q22 60 24 67" fill="none" stroke="#8cb8e0" stroke-width="1.5" stroke-linecap="round" opacity="0.8"/>
  <path d="M36 55 Q32 63 34 68" fill="none" stroke="#8cb8e0" stroke-width="1.5" stroke-linecap="round" opacity="0.8"/>
  <path d="M45 57 Q43 65 45 68" fill="none" stroke="#8cb8e0" stroke-width="1.5" stroke-linecap="round" opacity="0.8"/>
  <path d="M55 57 Q55 65 57 68" fill="none" stroke="#8cb8e0" stroke-width="1.5" stroke-linecap="round" opacity="0.8"/>
  <path d="M63 55 Q65 63 67 68" fill="none" stroke="#8cb8e0" stroke-width="1.5" stroke-linecap="round" opacity="0.8"/>
  <path d="M71 51 Q75 59 73 66" fill="none" stroke="#8cb8e0" stroke-width="1.5" stroke-linecap="round" opacity="0.8"/>
  <path d="M16 38 Q16 14 48 12 Q80 14 80 38 Q80 54 48 56 Q16 54 16 38Z" fill="url(#g)" stroke="#1a1209" stroke-width="2" opacity="0.96"/>
  <ellipse cx="34" cy="32" rx="7" ry="5" fill="none" stroke="#8cb8e0" stroke-width="2" opacity="0.7"/>
  <ellipse cx="48" cy="30" rx="7" ry="5" fill="none" stroke="#8cb8e0" stroke-width="2" opacity="0.7"/>
  <ellipse cx="62" cy="32" rx="7" ry="5" fill="none" stroke="#8cb8e0" stroke-width="2" opacity="0.7"/>
  <path d="M36 46 Q34 54 36 60" fill="none" stroke="#7898c8" stroke-width="2" stroke-linecap="round" opacity="0.65"/>
  <path d="M48 48 Q48 56 48 62" fill="none" stroke="#7898c8" stroke-width="2" stroke-linecap="round" opacity="0.65"/>
  <path d="M60 46 Q62 54 60 60" fill="none" stroke="#7898c8" stroke-width="2" stroke-linecap="round" opacity="0.65"/>
  <path d="M26 22 Q48 15 70 22" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" opacity="0.55"/>
  <path d="M16 38 Q16 14 48 12 Q80 14 80 38" fill="none" stroke="#c8e8ff" stroke-width="1.5" opacity="0.55"/>
  <circle cx="40" cy="37" r="4" fill="white" opacity="0.9"/>
  <circle cx="41" cy="37" r="2.5" fill="#1a3a60"/>
  <circle cx="42" cy="35.8" r="0.9" fill="white"/>
  <circle cx="56" cy="37" r="4" fill="white" opacity="0.9"/>
  <circle cx="57" cy="37" r="2.5" fill="#1a3a60"/>
  <circle cx="58" cy="35.8" r="0.9" fill="white"/>
  <path d="M44 44 Q48 48 52 44" fill="none" stroke="#1a3a60" stroke-width="1.5" stroke-linecap="round"/>
</svg>`,

  /* ───────── 7. 항구 고등어 · Harbor Mackerel ───────── */
  "fish-harbor-mackerel": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 68">
  <defs>
    <radialGradient id="g" cx="55%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#78d0e8"/>
      <stop offset="100%" stop-color="#1e6080"/>
    </radialGradient>
  </defs>
  <path d="M14 26 L2 16 L6 34 L2 52 L14 42Z" fill="#1e6080" stroke="#1a1209" stroke-width="1.5" stroke-linejoin="round"/>
  <ellipse cx="52" cy="34" rx="34" ry="18" fill="url(#g)" stroke="#1a1209" stroke-width="2"/>
  <path d="M22 22 Q44 18 74 24" fill="none" stroke="#124460" stroke-width="2.5" opacity="0.5"/>
  <path d="M20 28 Q44 22 76 28" fill="none" stroke="#124460" stroke-width="2" opacity="0.4"/>
  <path d="M18 26 Q44 22 76 28" fill="none" stroke="#124460" stroke-width="1.5" opacity="0.3"/>
  <path d="M14 34 Q44 32 80 34" fill="none" stroke="#1a1209" stroke-width="1" opacity="0.35" stroke-dasharray="4,3"/>
  <path d="M34 16 Q44 6 58 14" fill="#1e6080" stroke="#1a1209" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M58 18 Q64 12 70 18" fill="#1e6080" stroke="#1a1209" stroke-width="1.5"/>
  <path d="M46 50 Q52 60 58 52" fill="#1e6080" stroke="#1a1209" stroke-width="1.5"/>
  <path d="M54 36 Q62 44 62 38" fill="#3890b0" stroke="#1a1209" stroke-width="1.2" opacity="0.8"/>
  <path d="M22 26 Q52 20 82 28" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" opacity="0.45"/>
  <circle cx="76" cy="32" r="6.5" fill="white" stroke="#1a1209" stroke-width="1.5"/>
  <circle cx="77" cy="32" r="3.8" fill="#1a1209"/>
  <circle cx="78.5" cy="30.5" r="1.4" fill="white"/>
</svg>`,

  /* ───────── 8. 조개 게 · Shell Crab ───────── */
  "fish-shell-crab": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 68">
  <defs>
    <radialGradient id="g" cx="50%" cy="42%" r="60%">
      <stop offset="0%" stop-color="#ff9060"/>
      <stop offset="100%" stop-color="#c83018"/>
    </radialGradient>
  </defs>
  <path d="M24 44 L10 38 M26 50 L10 50 M28 56 L12 60" stroke="#c83018" stroke-width="3" stroke-linecap="round"/>
  <path d="M72 44 L86 38 M70 50 L86 50 M68 56 L84 60" stroke="#c83018" stroke-width="3" stroke-linecap="round"/>
  <ellipse cx="48" cy="50" rx="26" ry="16" fill="url(#g)" stroke="#1a1209" stroke-width="2"/>
  <path d="M24 44 Q28 22 48 20 Q68 22 72 44" fill="#e0c088" stroke="#1a1209" stroke-width="2"/>
  <path d="M48 20 Q50 36 50 44" fill="none" stroke="#1a1209" stroke-width="1" opacity="0.35"/>
  <path d="M38 22 Q38 38 40 44" fill="none" stroke="#1a1209" stroke-width="1" opacity="0.35"/>
  <path d="M58 22 Q58 38 56 44" fill="none" stroke="#1a1209" stroke-width="1" opacity="0.35"/>
  <path d="M30 30 Q35 44 40 46" fill="none" stroke="#1a1209" stroke-width="1" opacity="0.3"/>
  <path d="M66 30 Q61 44 56 46" fill="none" stroke="#1a1209" stroke-width="1" opacity="0.3"/>
  <ellipse cx="16" cy="34" rx="10" ry="8" fill="#c83018" stroke="#1a1209" stroke-width="1.5"/>
  <path d="M8 30 L14 26 M8 38 L14 40" fill="none" stroke="#1a1209" stroke-width="1.5" stroke-linecap="round"/>
  <ellipse cx="80" cy="34" rx="10" ry="8" fill="#c83018" stroke="#1a1209" stroke-width="1.5"/>
  <path d="M88 30 L82 26 M88 38 L82 40" fill="none" stroke="#1a1209" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M40 40 L36 32" stroke="#1a1209" stroke-width="2" stroke-linecap="round"/>
  <circle cx="35" cy="30" r="5.5" fill="white" stroke="#1a1209" stroke-width="1.5"/>
  <circle cx="36" cy="30" r="3" fill="#1a1209"/>
  <circle cx="37" cy="28.8" r="1.1" fill="white"/>
  <path d="M56 40 L60 32" stroke="#1a1209" stroke-width="2" stroke-linecap="round"/>
  <circle cx="61" cy="30" r="5.5" fill="white" stroke="#1a1209" stroke-width="1.5"/>
  <circle cx="62" cy="30" r="3" fill="#1a1209"/>
  <circle cx="63" cy="28.8" r="1.1" fill="white"/>
</svg>`,

  /* ───────── 9. 북치는 문어 · Drum Octopus ───────── */
  "fish-drum-octopus": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 68">
  <defs>
    <radialGradient id="g" cx="45%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#e0a0ff"/>
      <stop offset="100%" stop-color="#9040c8"/>
    </radialGradient>
  </defs>
  <path d="M28 46 Q14 52 10 64" fill="none" stroke="#9040c8" stroke-width="4" stroke-linecap="round"/>
  <path d="M34 52 Q24 60 22 68" fill="none" stroke="#9040c8" stroke-width="4" stroke-linecap="round"/>
  <path d="M42 56 Q38 64 40 68" fill="none" stroke="#9040c8" stroke-width="4" stroke-linecap="round"/>
  <path d="M52 56 Q52 64 54 68" fill="none" stroke="#9040c8" stroke-width="4" stroke-linecap="round"/>
  <path d="M62 52 Q68 60 68 68" fill="none" stroke="#9040c8" stroke-width="4" stroke-linecap="round"/>
  <path d="M68 46 Q78 52 82 62" fill="none" stroke="#9040c8" stroke-width="4" stroke-linecap="round"/>
  <path d="M18 36 Q8 30 6 18" fill="none" stroke="#9040c8" stroke-width="3.5" stroke-linecap="round"/>
  <path d="M76 36 Q86 30 90 18" fill="none" stroke="#9040c8" stroke-width="3.5" stroke-linecap="round"/>
  <circle cx="24" cy="57" r="2.5" fill="#c070e8" stroke="#1a1209" stroke-width="0.8"/>
  <circle cx="44" cy="62" r="2.5" fill="#c070e8" stroke="#1a1209" stroke-width="0.8"/>
  <circle cx="56" cy="62" r="2.5" fill="#c070e8" stroke="#1a1209" stroke-width="0.8"/>
  <circle cx="72" cy="57" r="2.5" fill="#c070e8" stroke="#1a1209" stroke-width="0.8"/>
  <ellipse cx="48" cy="30" rx="26" ry="24" fill="url(#g)" stroke="#1a1209" stroke-width="2"/>
  <ellipse cx="48" cy="24" rx="14" ry="10" fill="#9040c8" opacity="0.22"/>
  <path d="M30 18 Q48 12 66 18" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" opacity="0.5"/>
  <circle cx="36" cy="28" r="7" fill="white" stroke="#1a1209" stroke-width="1.5"/>
  <circle cx="37" cy="28" r="4.5" fill="#1a1209"/>
  <circle cx="38.5" cy="26" r="1.6" fill="white"/>
  <circle cx="60" cy="28" r="7" fill="white" stroke="#1a1209" stroke-width="1.5"/>
  <circle cx="61" cy="28" r="4.5" fill="#1a1209"/>
  <circle cx="62.5" cy="26" r="1.6" fill="white"/>
  <path d="M40 40 Q48 46 56 40" fill="none" stroke="#1a1209" stroke-width="1.5" stroke-linecap="round"/>
</svg>`,

  /* ───────── 10. 꾸벅 가오리 · Sleepy Ray ───────── */
  "fish-sleepy-ray": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 68">
  <defs>
    <radialGradient id="g" cx="45%" cy="38%" r="65%">
      <stop offset="0%" stop-color="#a8dcd0"/>
      <stop offset="100%" stop-color="#2a6848"/>
    </radialGradient>
  </defs>
  <path d="M68 46 Q82 52 92 60" fill="none" stroke="#2a6848" stroke-width="4" stroke-linecap="round"/>
  <path d="M16 36 Q4 28 8 44" fill="#7ec0a8" stroke="#1a1209" stroke-width="1.5"/>
  <path d="M80 36 Q92 28 88 44" fill="#7ec0a8" stroke="#1a1209" stroke-width="1.5"/>
  <path d="M48 6 Q74 16 80 36 Q74 56 48 64 Q22 56 16 36 Q22 16 48 6Z" fill="url(#g)" stroke="#1a1209" stroke-width="2"/>
  <ellipse cx="48" cy="36" rx="18" ry="14" fill="#2a6848" opacity="0.2"/>
  <circle cx="38" cy="28" r="3" fill="#1a4830" opacity="0.4"/>
  <circle cx="56" cy="26" r="3" fill="#1a4830" opacity="0.4"/>
  <circle cx="60" cy="38" r="2.5" fill="#1a4830" opacity="0.3"/>
  <circle cx="36" cy="40" r="2.5" fill="#1a4830" opacity="0.3"/>
  <path d="M30 24 Q48 18 66 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" opacity="0.4"/>
  <circle cx="36" cy="32" r="6" fill="white" stroke="#1a1209" stroke-width="1.5"/>
  <path d="M30 32 Q36 36 42 32" fill="#1a1209"/>
  <circle cx="37" cy="30.5" r="1.2" fill="white"/>
  <circle cx="60" cy="32" r="6" fill="white" stroke="#1a1209" stroke-width="1.5"/>
  <path d="M54 32 Q60 36 66 32" fill="#1a1209"/>
  <circle cx="61" cy="30.5" r="1.2" fill="white"/>
  <path d="M42 44 Q48 50 54 44" fill="none" stroke="#1a1209" stroke-width="1.5" stroke-linecap="round"/>
</svg>`,

  /* ───────── 11. 사탕 복어 · Candy Puffer ───────── */
  "fish-candy-puffer": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 68">
  <defs>
    <radialGradient id="g" cx="40%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#ffcce4"/>
      <stop offset="100%" stop-color="#e880b0"/>
    </radialGradient>
  </defs>
  <path d="M48 8 L46 2 M58 10 L61 4 M38 10 L35 4 M28 18 L23 14 M68 18 L73 14 M20 30 L14 28 M76 30 L82 28 M20 44 L14 46 M76 44 L82 46 M28 54 L23 58 M68 54 L73 58 M48 60 L46 66 M38 56 L35 62 M58 56 L61 62" stroke="#e880b0" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="48" cy="34" r="26" fill="url(#g)" stroke="#1a1209" stroke-width="2"/>
  <path d="M26 26 Q38 20 50 24 Q62 20 72 26" fill="none" stroke="#ff80c0" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
  <path d="M24 34 Q38 28 52 32 Q64 28 72 34" fill="none" stroke="#ff80c0" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
  <path d="M26 42 Q40 36 52 40 Q64 36 70 42" fill="none" stroke="#ff80c0" stroke-width="3" stroke-linecap="round" opacity="0.7"/>
  <path d="M30 24 Q48 18 66 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" opacity="0.5"/>
  <ellipse cx="26" cy="38" rx="6" ry="4" fill="#e880b0" stroke="#1a1209" stroke-width="1.2" transform="rotate(-20 26 38)"/>
  <ellipse cx="70" cy="38" rx="6" ry="4" fill="#e880b0" stroke="#1a1209" stroke-width="1.2" transform="rotate(20 70 38)"/>
  <circle cx="38" cy="28" r="6.5" fill="white" stroke="#1a1209" stroke-width="1.5"/>
  <circle cx="39" cy="28" r="4" fill="#1a1209"/>
  <circle cx="40.5" cy="26.5" r="1.5" fill="white"/>
  <circle cx="60" cy="28" r="6.5" fill="white" stroke="#1a1209" stroke-width="1.5"/>
  <circle cx="61" cy="28" r="4" fill="#1a1209"/>
  <circle cx="62.5" cy="26.5" r="1.5" fill="white"/>
  <path d="M42 40 Q48 44 54 40" fill="none" stroke="#1a1209" stroke-width="1.5" stroke-linecap="round"/>
</svg>`,

  /* ───────── 12. 별친구 불가사리 · Starfish Pal ───────── */
  "fish-starfish-pal": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 68">
  <defs>
    <radialGradient id="g" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#ffe87a"/>
      <stop offset="100%" stop-color="#e0a020"/>
    </radialGradient>
  </defs>
  <path d="M48 8 L56 30 L78 26 L62 42 L70 64 L48 52 L26 64 L34 42 L18 26 L40 30Z" fill="url(#g)" stroke="#1a1209" stroke-width="2" stroke-linejoin="round"/>
  <path d="M48 8 L48 50" fill="none" stroke="#1a1209" stroke-width="1" opacity="0.22"/>
  <path d="M78 26 L30 42" fill="none" stroke="#1a1209" stroke-width="1" opacity="0.22"/>
  <path d="M18 26 L66 42" fill="none" stroke="#1a1209" stroke-width="1" opacity="0.22"/>
  <circle cx="48" cy="15" r="3" fill="#d4880c" opacity="0.55"/>
  <circle cx="71" cy="27" r="3" fill="#d4880c" opacity="0.55"/>
  <circle cx="63" cy="56" r="3" fill="#d4880c" opacity="0.55"/>
  <circle cx="33" cy="56" r="3" fill="#d4880c" opacity="0.55"/>
  <circle cx="25" cy="27" r="3" fill="#d4880c" opacity="0.55"/>
  <circle cx="48" cy="38" r="12" fill="#ffe880" stroke="#1a1209" stroke-width="1.5"/>
  <circle cx="44" cy="34" r="5" fill="white" opacity="0.28"/>
  <circle cx="42" cy="36" r="3.5" fill="white" stroke="#1a1209" stroke-width="1.2"/>
  <circle cx="43" cy="36" r="2" fill="#1a1209"/>
  <circle cx="44" cy="35" r="0.8" fill="white"/>
  <circle cx="54" cy="36" r="3.5" fill="white" stroke="#1a1209" stroke-width="1.2"/>
  <circle cx="55" cy="36" r="2" fill="#1a1209"/>
  <circle cx="56" cy="35" r="0.8" fill="white"/>
  <path d="M42 43 Q48 48 54 43" fill="none" stroke="#1a1209" stroke-width="1.5" stroke-linecap="round"/>
</svg>`,

  /* ───────── 13. 산호 탱글이 · Coral Tang ───────── */
  "fish-coral-tang": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 68">
  <defs>
    <radialGradient id="g" cx="50%" cy="42%" r="65%">
      <stop offset="0%" stop-color="#5de0cc"/>
      <stop offset="100%" stop-color="#1a6850"/>
    </radialGradient>
  </defs>
  <path d="M16 28 L2 18 Q6 34 2 50 L16 40Z" fill="#cf9820" stroke="#1a1209" stroke-width="1.5"/>
  <ellipse cx="52" cy="34" rx="32" ry="22" fill="url(#g)" stroke="#1a1209" stroke-width="2"/>
  <path d="M28 14 L34 6 L52 10 L62 14" fill="#1a6850" stroke="#1a1209" stroke-width="1.5" stroke-linejoin="round"/>
  <path d="M34 6 L34 14" stroke="#1a1209" stroke-width="1" opacity="0.5"/>
  <path d="M42 8 L42 14" stroke="#1a1209" stroke-width="1" opacity="0.5"/>
  <path d="M52 10 L52 14" stroke="#1a1209" stroke-width="1" opacity="0.5"/>
  <path d="M20 26 Q52 22 78 30" fill="none" stroke="#0a4030" stroke-width="1.5" opacity="0.4"/>
  <ellipse cx="24" cy="34" rx="8" ry="14" fill="#cf9820" opacity="0.72"/>
  <path d="M24 46 L18 52" stroke="#cf9820" stroke-width="3" stroke-linecap="round"/>
  <path d="M54 36 Q62 46 60 40" fill="#3ab8a0" stroke="#1a1209" stroke-width="1.2" opacity="0.8"/>
  <path d="M28 22 Q52 16 76 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" opacity="0.45"/>
  <circle cx="74" cy="30" r="6.5" fill="white" stroke="#1a1209" stroke-width="1.5"/>
  <circle cx="75" cy="30" r="3.8" fill="#1a1209"/>
  <circle cx="76.5" cy="28.5" r="1.4" fill="white"/>
</svg>`,

  /* ───────── 14. 리본 장어 · Ribbon Eel ───────── */
  "fish-ribbon-eel": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 68">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#2a6080"/>
      <stop offset="50%" stop-color="#4898c8"/>
      <stop offset="100%" stop-color="#2a5070"/>
    </linearGradient>
  </defs>
  <path d="M88 52 Q76 60 60 56 Q44 50 36 38 Q28 26 14 22 Q8 16 6 8" fill="none" stroke="#1a1209" stroke-width="16" stroke-linecap="round"/>
  <path d="M88 52 Q76 60 60 56 Q44 50 36 38 Q28 26 14 22 Q8 16 6 8" fill="none" stroke="url(#g)" stroke-width="12" stroke-linecap="round"/>
  <path d="M6 8 Q10 4 18 10 Q28 6 36 12 Q42 6 50 12 Q58 6 66 14 Q74 8 84 14" fill="none" stroke="#cf9820" stroke-width="4" stroke-linecap="round"/>
  <path d="M88 52 Q76 58 60 54 Q44 48 36 36" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" opacity="0.4"/>
  <ellipse cx="8" cy="10" rx="8" ry="6" fill="#4898c8" stroke="#1a1209" stroke-width="1.5" transform="rotate(30 8 10)"/>
  <path d="M4 6 L2 2 M8 4 L8 0" stroke="#cf9820" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="10" cy="8" r="4.5" fill="white" stroke="#1a1209" stroke-width="1.5"/>
  <circle cx="11" cy="8" r="2.8" fill="#1a1209"/>
  <circle cx="12" cy="7" r="1" fill="white"/>
  <path d="M86 50 L92 54 L88 58" fill="#cf9820" stroke="#1a1209" stroke-width="1.5" stroke-linejoin="round"/>
</svg>`,

  /* ───────── 15. 진주 조개 · Pearl Clam ───────── */
  "fish-pearl-clam": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 68">
  <defs>
    <radialGradient id="g1" cx="30%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#f0e8d8"/>
      <stop offset="100%" stop-color="#d4b890"/>
    </radialGradient>
    <radialGradient id="g2" cx="35%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#f8f4ff"/>
      <stop offset="100%" stop-color="#ccc0e0"/>
    </radialGradient>
  </defs>
  <path d="M10 44 Q18 64 48 64 Q78 64 86 44 Q80 54 48 56 Q16 54 10 44Z" fill="url(#g1)" stroke="#1a1209" stroke-width="2"/>
  <path d="M10 44 Q14 20 48 14 Q82 20 86 44 Q76 32 48 30 Q20 32 10 44Z" fill="url(#g1)" stroke="#1a1209" stroke-width="2"/>
  <path d="M48 14 Q52 30 52 44" fill="none" stroke="#1a1209" stroke-width="1" opacity="0.28"/>
  <path d="M38 15 Q40 30 40 44" fill="none" stroke="#1a1209" stroke-width="1" opacity="0.28"/>
  <path d="M58 15 Q58 30 60 44" fill="none" stroke="#1a1209" stroke-width="1" opacity="0.28"/>
  <path d="M28 20 Q28 34 30 44" fill="none" stroke="#1a1209" stroke-width="1" opacity="0.25"/>
  <path d="M68 20 Q68 34 66 44" fill="none" stroke="#1a1209" stroke-width="1" opacity="0.25"/>
  <path d="M16 44 Q22 36 48 34 Q74 36 80 44 Q76 52 48 54 Q20 52 16 44Z" fill="#c85020" opacity="0.82"/>
  <circle cx="48" cy="44" r="13" fill="url(#g2)" stroke="#1a1209" stroke-width="1.5"/>
  <circle cx="44" cy="40" r="4.5" fill="white" opacity="0.5"/>
  <circle cx="52" cy="48" r="3" fill="white" opacity="0.3"/>
  <circle cx="48" cy="44" r="3" fill="#d4b890" stroke="#1a1209" stroke-width="0.8" opacity="0.5"/>
</svg>`,

  /* ───────── 16. 진주 거북 · Pearl Turtle ───────── */
  "fish-pearl-turtle": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 68">
  <defs>
    <radialGradient id="g" cx="50%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#b0e0c8"/>
      <stop offset="100%" stop-color="#2a6848"/>
    </radialGradient>
  </defs>
  <ellipse cx="16" cy="30" rx="12" ry="7" fill="#2a6848" stroke="#1a1209" stroke-width="1.5" transform="rotate(-30 16 30)"/>
  <ellipse cx="80" cy="30" rx="12" ry="7" fill="#2a6848" stroke="#1a1209" stroke-width="1.5" transform="rotate(30 80 30)"/>
  <ellipse cx="20" cy="52" rx="10" ry="6" fill="#2a6848" stroke="#1a1209" stroke-width="1.5" transform="rotate(20 20 52)"/>
  <ellipse cx="76" cy="52" rx="10" ry="6" fill="#2a6848" stroke="#1a1209" stroke-width="1.5" transform="rotate(-20 76 52)"/>
  <ellipse cx="48" cy="40" rx="32" ry="26" fill="url(#g)" stroke="#1a1209" stroke-width="2.5"/>
  <polygon points="48,16 58,22 58,34 48,40 38,34 38,22" fill="none" stroke="#1a4830" stroke-width="1.5" opacity="0.5"/>
  <polygon points="28,24 38,30 38,42 28,48 18,42 18,30" fill="none" stroke="#1a4830" stroke-width="1.2" opacity="0.4"/>
  <polygon points="68,24 78,30 78,42 68,48 58,42 58,30" fill="none" stroke="#1a4830" stroke-width="1.2" opacity="0.4"/>
  <polygon points="38,40 48,46 48,58 38,64 28,58 28,46" fill="none" stroke="#1a4830" stroke-width="1.2" opacity="0.4"/>
  <polygon points="58,40 68,46 68,58 58,64 48,58 48,46" fill="none" stroke="#1a4830" stroke-width="1.2" opacity="0.4"/>
  <circle cx="48" cy="24" r="3.5" fill="white" opacity="0.35"/>
  <circle cx="34" cy="32" r="2.5" fill="white" opacity="0.28"/>
  <circle cx="62" cy="32" r="2.5" fill="white" opacity="0.28"/>
  <circle cx="48" cy="14" r="10" fill="#3a8858" stroke="#1a1209" stroke-width="2"/>
  <path d="M40 10 Q48 6 56 10" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" opacity="0.45"/>
  <circle cx="42" cy="12" r="4" fill="white" stroke="#1a1209" stroke-width="1.2"/>
  <circle cx="43" cy="12" r="2.5" fill="#1a1209"/>
  <circle cx="44" cy="11" r="0.9" fill="white"/>
  <circle cx="54" cy="12" r="4" fill="white" stroke="#1a1209" stroke-width="1.2"/>
  <circle cx="55" cy="12" r="2.5" fill="#1a1209"/>
  <circle cx="56" cy="11" r="0.9" fill="white"/>
  <path d="M42 18 Q48 22 54 18" fill="none" stroke="#1a1209" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M48 64 L46 68 L50 68Z" fill="#2a6848" stroke="#1a1209" stroke-width="1"/>
</svg>`,

  /* ───────── 17. 초롱 아귀 · Lantern Anglerfish ───────── */
  "fish-lantern-angler": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 68">
  <defs>
    <radialGradient id="g" cx="45%" cy="45%" r="65%">
      <stop offset="0%" stop-color="#5060a0"/>
      <stop offset="100%" stop-color="#1a2050"/>
    </radialGradient>
    <radialGradient id="g2" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="#ffff80"/>
      <stop offset="100%" stop-color="#cf9820"/>
    </radialGradient>
  </defs>
  <circle cx="74" cy="8" r="14" fill="#cf9820" opacity="0.25"/>
  <circle cx="74" cy="8" r="8" fill="url(#g2)" stroke="#1a1209" stroke-width="1.5"/>
  <path d="M56 20 Q64 14 72 10" fill="none" stroke="#1a1209" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M22 32 L8 22 L12 44Z" fill="#304070" stroke="#1a1209" stroke-width="1.5"/>
  <path d="M44 14 L40 6" stroke="#304070" stroke-width="2.5" stroke-linecap="round"/>
  <ellipse cx="46" cy="40" rx="34" ry="22" fill="url(#g)" stroke="#1a1209" stroke-width="2"/>
  <path d="M16 42 Q18 54 36 58 Q46 62 56 58 Q66 54 68 46" fill="#0a1030" stroke="#1a1209" stroke-width="1.5"/>
  <path d="M20 48 L22 42 L25 50 L28 43 L31 51 L34 44 L37 52 L40 45 L43 53 L46 46 L49 53 L52 46 L55 52 L58 46 L61 52 L63 46 L65 48" fill="none" stroke="white" stroke-width="1.5" stroke-linejoin="round" opacity="0.88"/>
  <ellipse cx="44" cy="50" rx="24" ry="8" fill="white" opacity="0.08"/>
  <path d="M20 30 Q46 22 72 32" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" opacity="0.35"/>
  <circle cx="66" cy="32" r="7" fill="white" stroke="#1a1209" stroke-width="1.5"/>
  <circle cx="67" cy="32" r="4.5" fill="#1a1209"/>
  <circle cx="68.5" cy="30" r="1.6" fill="white"/>
</svg>`,

  /* ───────── 18. 바다 토끼 · Sea Bunny (Jorunna parva) ───────── */
  "fish-sea-bunny": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 68">
  <defs>
    <radialGradient id="g" cx="45%" cy="42%" r="65%">
      <stop offset="0%" stop-color="#fffaf8"/>
      <stop offset="100%" stop-color="#f0e0d8"/>
    </radialGradient>
  </defs>
  <path d="M28 28 Q26 18 28 12" stroke="#f0c0a8" stroke-width="3" stroke-linecap="round" fill="none"/>
  <path d="M34 24 Q32 14 34 8" stroke="#f0c0a8" stroke-width="3" stroke-linecap="round" fill="none"/>
  <path d="M40 22 Q38 12 40 6" stroke="#f0c0a8" stroke-width="3" stroke-linecap="round" fill="none"/>
  <path d="M48 20 Q48 10 50 4" stroke="#f0c0a8" stroke-width="3" stroke-linecap="round" fill="none"/>
  <path d="M56 22 Q56 12 58 6" stroke="#f0c0a8" stroke-width="3" stroke-linecap="round" fill="none"/>
  <path d="M62 24 Q64 14 64 8" stroke="#f0c0a8" stroke-width="3" stroke-linecap="round" fill="none"/>
  <path d="M68 28 Q70 18 70 12" stroke="#f0c0a8" stroke-width="3" stroke-linecap="round" fill="none"/>
  <path d="M14 46 Q16 30 28 24 Q40 20 56 22 Q72 20 80 28 Q88 36 84 50 Q80 60 64 64 Q50 66 36 62 Q18 58 14 46Z" fill="url(#g)" stroke="#1a1209" stroke-width="2"/>
  <circle cx="36" cy="40" r="3.5" fill="#1a1209" opacity="0.78"/>
  <circle cx="50" cy="36" r="3" fill="#1a1209" opacity="0.78"/>
  <circle cx="62" cy="42" r="3.5" fill="#1a1209" opacity="0.78"/>
  <circle cx="44" cy="52" r="2.5" fill="#1a1209" opacity="0.68"/>
  <circle cx="58" cy="54" r="2.5" fill="#1a1209" opacity="0.68"/>
  <circle cx="30" cy="50" r="2" fill="#1a1209" opacity="0.58"/>
  <path d="M36 28 Q34 14 36 6" fill="none" stroke="#e8a080" stroke-width="6" stroke-linecap="round"/>
  <path d="M36 28 Q34 14 36 6" fill="none" stroke="#ffd8c8" stroke-width="3" stroke-linecap="round"/>
  <path d="M56 26 Q58 12 58 4" fill="none" stroke="#e8a080" stroke-width="6" stroke-linecap="round"/>
  <path d="M56 26 Q58 12 58 4" fill="none" stroke="#ffd8c8" stroke-width="3" stroke-linecap="round"/>
  <ellipse cx="72" cy="42" rx="12" ry="10" fill="#fffaf8" stroke="#1a1209" stroke-width="1.5"/>
  <circle cx="68" cy="40" r="3.5" fill="white" stroke="#1a1209" stroke-width="1.2"/>
  <circle cx="69" cy="40" r="2" fill="#1a1209"/>
  <circle cx="70" cy="39" r="0.7" fill="white"/>
  <circle cx="76" cy="40" r="3.5" fill="white" stroke="#1a1209" stroke-width="1.2"/>
  <circle cx="77" cy="40" r="2" fill="#1a1209"/>
  <circle cx="78" cy="39" r="0.7" fill="white"/>
  <circle cx="72" cy="44" r="2" fill="#ff8080" opacity="0.7"/>
  <path d="M68 47 Q72 50 76 47" fill="none" stroke="#1a1209" stroke-width="1.2" stroke-linecap="round"/>
</svg>`,

  /* ───────── 19. 무지개 아기고래 · Rainbow Baby Whale ───────── */
  "fish-rainbow-whale": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 68">
  <defs>
    <radialGradient id="g" cx="55%" cy="40%" r="65%">
      <stop offset="0%" stop-color="#c8b0ff"/>
      <stop offset="100%" stop-color="#6040a8"/>
    </radialGradient>
  </defs>
  <path d="M72 16 Q80 4 88 8" fill="none" stroke="#ff6060" stroke-width="2.5" stroke-linecap="round" opacity="0.85"/>
  <path d="M71 18 Q82 4 92 10" fill="none" stroke="#ffa020" stroke-width="2.5" stroke-linecap="round" opacity="0.85"/>
  <path d="M70 20 Q82 8 94 16" fill="none" stroke="#ffe020" stroke-width="2.5" stroke-linecap="round" opacity="0.85"/>
  <path d="M70 22 Q84 12 94 22" fill="none" stroke="#40c040" stroke-width="2.5" stroke-linecap="round" opacity="0.85"/>
  <path d="M70 24 Q84 18 92 28" fill="none" stroke="#2080ff" stroke-width="2.5" stroke-linecap="round" opacity="0.85"/>
  <path d="M70 26 Q82 24 90 34" fill="none" stroke="#9040e0" stroke-width="2.5" stroke-linecap="round" opacity="0.85"/>
  <circle cx="84" cy="6" r="2.5" fill="#88ccff" opacity="0.85"/>
  <circle cx="90" cy="12" r="2" fill="#88ccff" opacity="0.72"/>
  <circle cx="92" cy="20" r="1.5" fill="#88ccff" opacity="0.6"/>
  <path d="M10 38 L2 26 Q6 38 2 50 L10 44Z" fill="#6040a8" stroke="#1a1209" stroke-width="1.5"/>
  <ellipse cx="50" cy="40" rx="36" ry="24" fill="url(#g)" stroke="#1a1209" stroke-width="2.5"/>
  <ellipse cx="72" cy="22" rx="5" ry="3" fill="#503090" stroke="#1a1209" stroke-width="1.5"/>
  <ellipse cx="52" cy="48" rx="24" ry="12" fill="white" opacity="0.2"/>
  <path d="M30 46 Q52 52 74 46" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" opacity="0.4"/>
  <path d="M40 52 Q34 62 44 62" fill="#7050b8" stroke="#1a1209" stroke-width="1.5"/>
  <path d="M62 52 Q70 60 62 62" fill="#7050b8" stroke="#1a1209" stroke-width="1.5"/>
  <path d="M26 30 Q50 22 74 30" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" opacity="0.4"/>
  <circle cx="72" cy="36" r="7" fill="white" stroke="#1a1209" stroke-width="1.5"/>
  <circle cx="73" cy="36" r="4.5" fill="#1a1209"/>
  <circle cx="74.5" cy="34" r="1.6" fill="white"/>
  <path d="M60 48 Q68 54 74 48" fill="none" stroke="#1a1209" stroke-width="1.5" stroke-linecap="round"/>
</svg>`,
};

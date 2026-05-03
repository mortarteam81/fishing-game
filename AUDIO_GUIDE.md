# 반짝바다 낚시단 Audio Style Guide

이 문서는 Gemini 또는 다른 오디오 생성 도구에 전달하기 위한 제작 가이드입니다. 목표는 단순히 귀여운 소리를 붙이는 것이 아니라, `반짝바다 낚시단`을 수집형 항해 RPG로 느끼게 하는 일관된 사운드 세계를 만드는 것입니다.

## Audio North Star

`반짝바다 낚시단`의 소리는 따뜻한 바다 모험, 수집의 설렘, 동료와 함께 항해하는 안정감, 후반부 원정의 신비감을 동시에 가져야 합니다.

- 어린이가 오래 들어도 피곤하지 않은 부드러운 톤
- 유아틱한 장난감 소리가 아니라 상용 모바일 게임처럼 깨끗하고 세련된 질감
- 밝은 바다, 나무 배, 조개, 물방울, 별빛, 고래 노래, 고대 심해 유적의 이미지를 중심으로 구성
- 모든 음악과 효과음은 완전 오리지널이어야 하며 특정 영화, 애니메이션, 게임, 작곡가를 직접 모방하지 않음
- 효과음은 모바일 스피커에서도 또렷하게 들리되 날카롭지 않게 제작
- 배경음악은 seamless loop 중심으로 제작해 장시간 플레이에 어울리게 설계

## Sound Pillars

| Pillar | Meaning | Sound Texture |
| --- | --- | --- |
| Warm Harbor | 아이가 다시 돌아오고 싶은 안전한 시작점 | 마림바, 어쿠스틱 기타, 낮은 목재 타악, 부드러운 플루트 |
| Living Ocean | 항해 중 바다가 살아 있다는 느낌 | 잔잔한 파도, 물결 신스, 작은 해양 생물 움직임, 부드러운 퍼커션 |
| Collectible Sparkle | 새로운 친구와 아이템을 얻는 순간의 만족감 | 글로켄슈필, 하프 글리산도, 작은 차임, 밝은 카드 사운드 |
| Companion Bond | 바다 친구 동료와 친밀해지는 감정 | 둥근 물방울 멜로디, 따뜻한 벨, 짧은 상승음 |
| Expedition Wonder | 별고래 원정과 심해 왕관 탐사의 후반부 감동 | 하프, 현악, 유리 벨, 낮은 첼로, 부드러운 고래형 신스 패드 |
| Safe Tension | 위험 항로 이벤트의 긴장감 | 빠른 스트링 리듬, 물살, 가벼운 타악, 실패해도 위협적이지 않은 하강음 |

## Do And Do Not

Do:

- 밝고 부드러운 어택을 가진 악기를 사용합니다.
- SFX는 짧고 명확하게, BGM은 반복해도 피로하지 않게 만듭니다.
- 희귀도, 챕터, 장비 등급이 올라갈수록 소리의 밀도와 반짝임을 조금씩 올립니다.
- 고래, 심해, 별빛 같은 후반부 소재는 신비롭지만 무섭지 않게 만듭니다.

Do not:

- 공포, 전투, 폭발, 금속 충돌을 강하게 사용하지 않습니다.
- 지나친 8-bit, 장난감 피리, 삑삑거리는 아동용 앱 사운드를 피합니다.
- 유명 애니메이션/게임/영화 음악을 직접 언급하거나 모방하지 않습니다.
- BGM에 과도한 보컬, 강한 EDM 드롭, 날카로운 리드 신스를 넣지 않습니다.

## Technical Delivery Spec

권장 마스터:

- Format: WAV
- Sample rate: 48 kHz
- Bit depth: 24-bit
- Channels: BGM은 stereo, UI/SFX는 mono 또는 narrow stereo
- Peak: -1.0 dBTP 이하
- BGM loudness: 약 -18 LUFS integrated
- SFX loudness: 약 -14 LUFS short-term 기준, 너무 큰 효과음은 -16 LUFS까지 낮춤
- Loop: BGM은 시작/끝 클릭 없이 seamless loop 가능해야 함

게임 내 사용용 변환:

- BGM: OGG Vorbis, 160-192 kbps
- SFX: OGG Vorbis 또는 WAV, 48 kHz
- 짧은 UI SFX는 0.15-0.8초
- 포획/발견/원정 SFX는 1.0-3.0초

폴더 제안:

```text
assets/audio/bgm/
assets/audio/sfx/ui/
assets/audio/sfx/fishing/
assets/audio/sfx/reward/
assets/audio/sfx/equipment/
assets/audio/sfx/expedition/
assets/audio/ambience/
```

## Global Prompt For Gemini

Gemini에게 먼저 아래 프롬프트를 전달한 뒤, 이어지는 BGM/SFX 표의 각 행을 개별 생성 프롬프트로 사용합니다.

```text
You are an audio director and composer for a polished collectible sailing RPG called "Banjjakbada Fishing Club".

The game is a warm ocean adventure for children and families, but the audio must feel commercially polished, not babyish. The player prepares at a cozy harbor, sails across living ocean maps, discovers fishing points, catches collectible sea friends, upgrades boats and rods, bonds with companion sea creatures, and later enters mysterious expedition chapters called Starwhale Expedition and Deep Crown Survey.

Create completely original music and sound effects. Do not imitate any existing movie, animation, game, composer, studio, or copyrighted melody. Avoid harsh synths, horror tones, big explosions, aggressive combat sounds, and childish toy-like beeps.

The sonic world should use gentle ocean textures, marimba, acoustic guitar, soft flute, harp, glass bells, warm strings, subtle hand percussion, smooth water-like synth pads, cozy wooden UI sounds, shells, bubbles, and soft whale-like tones.

All BGM should be seamless loop friendly unless marked as sting. All SFX should be short, clean, mobile-game-ready, and emotionally warm.
```

## BGM File List And Generation Prompts

| File | Use | Length | BPM | Loop | Direction | Gemini Generation Prompt |
| --- | --- | ---: | ---: | --- | --- | --- |
| `assets/audio/bgm/bgm_harbor_home_loop.ogg` | 항구 메인 화면 | 75s | 88 | Yes | 안전한 항구, 나무 배, 동료와 준비하는 느낌 | Create a seamless 75-second loop for a cozy harbor in a polished collectible ocean RPG. Warm marimba, acoustic guitar, soft flute, light pizzicato strings, gentle wave bed, subtle wooden percussion. Calm, welcoming, child-friendly but not childish. Original melody, no vocals, clean mobile game mix. |
| `assets/audio/bgm/bgm_ocean_map_day_loop.ogg` | 일반 항해 지도 | 90s | 104 | Yes | 넓은 바다를 탐험하는 경쾌함 | Create a seamless 90-second sailing map loop for a collectible ocean adventure RPG. Light pizzicato strings, soft accordion-like pad, small hand percussion, watery synth shimmer, gentle forward motion. Adventurous and bright, not epic or loud. Original composition, no vocals. |
| `assets/audio/bgm/bgm_ocean_map_hidden_route_loop.ogg` | 숨은 항로 근처 | 80s | 96 | Yes | 수상한 물결, 아직 발견되지 않은 해역 | Create a seamless 80-second hidden route exploration loop. Gentle mystery, soft bells, muted harp, airy pads, distant wave swells, small pulsing percussion. Curious and magical, never scary. Suitable for a child-friendly sailing RPG. |
| `assets/audio/bgm/bgm_fishing_focus_loop.ogg` | 낚시 대기/집중 | 65s | 76 | Yes | 입질을 기다리는 차분한 집중 | Create a seamless 65-second fishing focus loop. Minimal gentle piano, soft glass bell accents, low warm string pad, tiny water droplets, very light rhythm. Calm concentration, enough space for gameplay SFX, no busy melody, no vocals. |
| `assets/audio/bgm/bgm_fishing_bite_tension_loop.ogg` | 입질 후 릴링 미니게임 | 35s | 112 | Yes | 짧은 긴장감, 낚싯줄 장력 | Create a seamless 35-second light tension loop for a fishing reel timing minigame. Soft plucked strings, quiet hand percussion, gentle rising water pulse, subtle line-tension texture. Exciting but safe, no combat feeling, no harsh hits. |
| `assets/audio/bgm/bgm_collection_dex_loop.ogg` | 도감/수집 카드 화면 | 70s | 82 | Yes | 카드 수집, 기록, 연구 | Create a seamless 70-second collectible card dex loop. Warm vibraphone, soft marimba, light paper/card texture, tiny magical chimes, relaxed bass. Polished collection UI music, satisfying and tidy, no vocals. |
| `assets/audio/bgm/bgm_exchange_shop_loop.ogg` | 교환소/장비 선택 | 75s | 92 | Yes | 조개 상점, 장비 고르는 재미 | Create a seamless 75-second cozy seaside shop loop. Wooden percussion, marimba, small ukulele or acoustic guitar, shell clicks, soft bass, cheerful but restrained. Fits a gear exchange shop in a collectible fishing RPG. |
| `assets/audio/bgm/bgm_quest_journal_loop.ogg` | 퀘스트/원정 기록 | 70s | 84 | Yes | 장기 목표와 모험 일지 | Create a seamless 70-second expedition journal loop. Gentle harp, soft strings, warm piano, quiet page-turn texture, hopeful melody. It should feel like planning a meaningful ocean journey with friends. Original, no vocals. |
| `assets/audio/bgm/bgm_starwhale_expedition_loop.ogg` | 별고래 원정 해역 | 110s | 88 | Yes | 별빛 바다, 거대한 고래, 후반부 감동 | Create a seamless 110-second Starwhale Expedition theme for a polished collectible sailing RPG. Warm orchestral fantasy with harp, soft strings, glass bells, low gentle horn, distant whale-like synth pad. Wondrous, emotional, safe, not scary, not imitating any existing score. |
| `assets/audio/bgm/bgm_deep_crown_survey_loop.ogg` | 심해 왕관 탐사 해역 | 105s | 72 | Yes | 깊은 바다, 고대 왕관 유적 | Create a seamless 105-second Deep Crown Survey theme. Mysterious but safe deep ocean fantasy, low cello drone, soft underwater pads, ancient metallic bells, slow hand percussion, occasional glowing chime. Elegant and magical, no horror, no vocals. |
| `assets/audio/bgm/bgm_voyage_event_loop.ogg` | 위험 항로 이벤트 | 28s | 124 | Yes | 해류 돌파/암초 미로의 타이밍 긴장 | Create a seamless 28-second nonviolent danger route event loop. Quick but gentle rhythm, light strings, water rush, small frame drum, rising motion, playful tension. It should support a 6-8 second timing challenge without sounding like battle music. |
| `assets/audio/bgm/bgm_rare_discovery_sting.ogg` | 희귀/전설 발견 짧은 스팅 | 12s | Free | No | 짧고 기억에 남는 발견 | Create a 12-second rare sea friend discovery sting. Harp glissando, sparkling glass bells, soft choir-like pad without vocals, gentle water splash, warm magical reveal. Joyful and polished, not loud. |
| `assets/audio/bgm/bgm_chapter_complete_sting.ogg` | 챕터 완료 | 18s | Free | No | 원정 완수의 작은 감동 | Create an 18-second chapter completion sting for a warm ocean expedition RPG. Hopeful strings, harp, soft brass swell, glass bells, gentle wave tail. Emotional but not overly cinematic, child-friendly, original. |

## Ambience File List

| File | Use | Length | Loop | Direction | Gemini Generation Prompt |
| --- | --- | ---: | --- | --- | --- |
| `assets/audio/ambience/amb_harbor_waves_loop.ogg` | 항구 배경 | 60s | Yes | 잔잔한 물결, 나무 부두 | Create a seamless 60-second harbor ambience loop. Gentle waves against wooden dock, very soft rope creaks, distant gull-like airy texture without realistic loud birds, warm seaside air. No melody, no abrupt sounds. |
| `assets/audio/ambience/amb_open_ocean_loop.ogg` | 항해 지도 | 60s | Yes | 열린 바다, 부드러운 바람 | Create a seamless 60-second open ocean ambience loop. Calm waves, light breeze, subtle water shimmer, very soft distant splashes. Clean, relaxing, not realistic stormy, suitable under game music. |
| `assets/audio/ambience/amb_starwhale_ocean_loop.ogg` | 별고래 해역 | 70s | Yes | 별빛 물결, 먼 고래 울림 | Create a seamless 70-second magical star ocean ambience. Soft waves, airy shimmer, distant gentle whale-like tones, sparkling water particles. Safe and wondrous, no scary whale calls, no melody. |
| `assets/audio/ambience/amb_deep_crown_loop.ogg` | 심해 왕관 해역 | 70s | Yes | 깊은 물, 고대 등불 | Create a seamless 70-second deep sea ambience. Low soft underwater pressure, slow bubbles, distant ancient bell resonance, gentle glowing water. Mysterious but comforting, no horror drones. |
| `assets/audio/ambience/amb_rain_storm_soft_loop.ogg` | 폭풍/비 날씨 | 50s | Yes | 위험 항로 전조, 과하지 않은 비바람 | Create a seamless 50-second soft storm ambience for a child-friendly sailing game. Light rain on water, rolling waves, distant soft wind, no thunder cracks, no danger panic. |

## SFX File List And Generation Prompts

### UI And Navigation

| File | Use | Length | Variations | Gemini Generation Prompt |
| --- | --- | ---: | ---: | --- |
| `assets/audio/sfx/ui/ui_button_tap_01.ogg` | 기본 버튼 클릭 | 0.18s | 3 | Create a short polished mobile game UI tap. Wooden button click mixed with tiny water droplet, soft attack, warm, not sharp, 0.18 seconds. |
| `assets/audio/sfx/ui/ui_tab_switch_01.ogg` | 탭 전환 | 0.25s | 3 | Create a shell-like tab switch sound. Small shell click, soft sparkle, clean and bright, 0.25 seconds, not childish. |
| `assets/audio/sfx/ui/ui_panel_open_01.ogg` | 패널 열림 | 0.45s | 2 | Create a soft panel open sound for a cozy ocean RPG UI. Gentle paper slide, small wooden frame tap, airy sparkle tail, 0.45 seconds. |
| `assets/audio/sfx/ui/ui_panel_close_01.ogg` | 패널 닫힘 | 0.35s | 2 | Create a soft panel close sound. Light paper fold, muted wooden tap, small water drop tail, 0.35 seconds. |
| `assets/audio/sfx/ui/ui_save_complete_01.ogg` | 저장 완료 | 0.85s | 2 | Create a warm save complete chime. Three gentle bell notes, safe and reassuring, soft water sparkle, 0.85 seconds, mobile game ready. |
| `assets/audio/sfx/ui/ui_error_soft_01.ogg` | 조개 부족/비활성 | 0.28s | 2 | Create a gentle unavailable UI sound. Soft low bubble pop and muted shell tap, not negative or harsh, 0.28 seconds. |

### Equipment

| File | Use | Length | Variations | Gemini Generation Prompt |
| --- | --- | ---: | ---: | --- |
| `assets/audio/sfx/equipment/equip_rod_01.ogg` | 낚싯대 장착 | 0.65s | 3 | Create a fishing rod equip sound. Flexible rod twang, soft line flick, tiny chime, polished and warm, 0.65 seconds. |
| `assets/audio/sfx/equipment/equip_boat_01.ogg` | 배 장착 | 0.85s | 3 | Create a boat equip sound. Wooden hull knock, small sail cloth flutter, water lap, confident but gentle, 0.85 seconds. |
| `assets/audio/sfx/equipment/equip_bait_01.ogg` | 미끼 장착 | 0.45s | 3 | Create a bait equip sound. Small plop, bubble sparkle, tiny shell click, cute but not babyish, 0.45 seconds. |
| `assets/audio/sfx/equipment/equip_flag_01.ogg` | 깃발 장착 | 0.7s | 3 | Create a flag equip sound. Soft cloth flap, light mast tap, small heroic chime, 0.7 seconds, warm seaside tone. |
| `assets/audio/sfx/equipment/shop_purchase_01.ogg` | 교환소 구매 | 0.75s | 3 | Create a shop purchase sound. Shell coins clink softly, warm confirmation chime, tiny sparkle, 0.75 seconds, not casino-like. |
| `assets/audio/sfx/equipment/gear_build_synergy_01.ogg` | 장비 빌드 시너지 표시 | 1.1s | 2 | Create a gear synergy activation sound. Four soft layered chimes, water shimmer, subtle rising tone, satisfying but restrained, 1.1 seconds. |

### Fishing Loop

| File | Use | Length | Variations | Gemini Generation Prompt |
| --- | --- | ---: | ---: | --- |
| `assets/audio/sfx/fishing/cast_rod_01.ogg` | 낚싯대 던지기 | 0.75s | 4 | Create a fishing rod cast sound. Smooth whoosh of fishing line, light splash into water, clean tail, 0.75 seconds, polished mobile game style. |
| `assets/audio/sfx/fishing/bobber_land_01.ogg` | 찌 착수 | 0.35s | 3 | Create a small bobber landing sound. Soft plop, tiny bubble ring, gentle water tail, 0.35 seconds. |
| `assets/audio/sfx/fishing/bite_common_01.ogg` | 일반 입질 | 0.32s | 4 | Create a common fish bite cue. Small water tick, bubble pop, subtle vibration-like pulse, clear but soft, 0.32 seconds. |
| `assets/audio/sfx/fishing/bite_rare_01.ogg` | 희귀 입질 | 0.55s | 3 | Create a rare bite cue. Water tick plus two sparkling bell notes, slightly more magical than common, 0.55 seconds, not loud. |
| `assets/audio/sfx/fishing/bite_legendary_01.ogg` | 전설/고대 입질 | 0.9s | 3 | Create a legendary bite cue. Deep soft water pulse, glass chime, tiny whale-like shimmer, exciting but warm, 0.9 seconds. |
| `assets/audio/sfx/fishing/reel_loop_light.ogg` | 릴 감기 반복 | 1.2s | 2 | Create a seamless 1.2-second loop of gentle fishing reel movement. Soft rotating reel, line tension, subtle water movement, no clicks that fatigue, loop cleanly. |
| `assets/audio/sfx/fishing/reel_strain_01.ogg` | 강한 장력 | 0.65s | 3 | Create a soft fishing line strain sound. Elastic line tension, small wooden rod creak, controlled excitement, 0.65 seconds, no harsh squeal. |
| `assets/audio/sfx/fishing/timing_nice_01.ogg` | 타이밍 nice | 0.45s | 2 | Create a nice timing feedback sound. Soft splash, one bright chime, satisfying but modest, 0.45 seconds. |
| `assets/audio/sfx/fishing/timing_great_01.ogg` | 타이밍 great | 0.65s | 2 | Create a great timing feedback sound. Bigger water sparkle, two chimes, smooth upward motion, 0.65 seconds. |
| `assets/audio/sfx/fishing/timing_sparkle_01.ogg` | 타이밍 sparkle | 0.9s | 2 | Create a perfect sparkle timing sound. Clean splash, harp sparkle, bright glass bell flourish, joyful but not too loud, 0.9 seconds. |
| `assets/audio/sfx/fishing/catch_miss_01.ogg` | 놓침/실패 | 0.7s | 3 | Create a gentle missed catch sound. Soft downward bubble, small water ripple, encouraging not punishing, 0.7 seconds. |

### Catch And Collection Rewards

| File | Use | Length | Variations | Gemini Generation Prompt |
| --- | --- | ---: | ---: | --- |
| `assets/audio/sfx/reward/catch_common_01.ogg` | common 포획 | 0.85s | 3 | Create a common catch success sound. Small splash, warm chime, tiny shell sparkle, 0.85 seconds, cheerful but simple. |
| `assets/audio/sfx/reward/catch_uncommon_01.ogg` | uncommon 포획 | 0.95s | 3 | Create an uncommon catch success sound. Splash plus two soft bells, slightly fuller sparkle, 0.95 seconds. |
| `assets/audio/sfx/reward/catch_rare_01.ogg` | rare 포획 | 1.15s | 3 | Create a rare catch success sound. Bright water splash, harp glissando, glass bell sparkle, polished collectible RPG reward, 1.15 seconds. |
| `assets/audio/sfx/reward/catch_epic_01.ogg` | epic 포획 | 1.4s | 2 | Create an epic catch success sound. Larger splash, layered magical chimes, warm low support tone, satisfying but not explosive, 1.4 seconds. |
| `assets/audio/sfx/reward/catch_mythic_01.ogg` | mythic 포획 | 1.7s | 2 | Create a mythic catch success sound. Sparkling water burst, harp, soft choir-like pad without voices, radiant bell tail, 1.7 seconds. |
| `assets/audio/sfx/reward/catch_legendary_01.ogg` | legendary 포획 | 2.1s | 2 | Create a legendary catch success sound. Deep warm water swell, whale-like soft tone, glass bells, elegant magical flourish, 2.1 seconds, not too loud. |
| `assets/audio/sfx/reward/catch_ancient_01.ogg` | ancient 포획 | 2.4s | 2 | Create an ancient catch success sound. Low ocean resonance, ancient bell, sparkling water, slow majestic chime tail, mysterious but safe, 2.4 seconds. |
| `assets/audio/sfx/reward/dex_register_01.ogg` | 도감 등록 | 1.0s | 3 | Create a collectible card registration sound. Soft card slide, magical sparkle, shell click, final warm bell, 1.0 seconds. |
| `assets/audio/sfx/reward/quest_complete_01.ogg` | 퀘스트 완료 | 1.4s | 2 | Create a warm quest complete fanfare. Three gentle notes, small shell sparkle, uplifting but restrained, 1.4 seconds. |
| `assets/audio/sfx/reward/level_up_01.ogg` | 레벨 업 | 1.6s | 2 | Create a level up sound for a cozy ocean RPG. Rising marimba and bell arpeggio, soft water shimmer, happy and polished, 1.6 seconds. |
| `assets/audio/sfx/reward/shell_reward_01.ogg` | 조개 획득 | 0.55s | 4 | Create a shell currency pickup sound. Soft shell clinks, tiny bubble sparkle, clean and satisfying, 0.55 seconds. |
| `assets/audio/sfx/reward/research_rank_up_01.ogg` | 연구 랭크 상승 | 1.2s | 2 | Create a research rank up sound. Notebook page flick, glass chime, small discovery sparkle, thoughtful and rewarding, 1.2 seconds. |
| `assets/audio/sfx/reward/companion_affinity_up_01.ogg` | 동료 친밀도 상승 | 1.0s | 3 | Create a companion affinity up sound. Friendly water bubble melody, soft warm bell, tiny happy shimmer, 1.0 seconds. |

### Voyage Events And Expedition

| File | Use | Length | Variations | Gemini Generation Prompt |
| --- | --- | ---: | ---: | --- |
| `assets/audio/sfx/expedition/voyage_event_start_01.ogg` | 위험 항로 시작 | 1.0s | 3 | Create a danger route start sound for a nonviolent sailing event. Rising water rush, soft wind, light tension chime, 1.0 seconds, exciting but safe. |
| `assets/audio/sfx/expedition/voyage_current_breakthrough_01.ogg` | 해류 돌파 성공 | 1.4s | 2 | Create a current breakthrough success sound. Fast water sweep, clean splash, bright navigation chime, 1.4 seconds, refreshing and triumphant. |
| `assets/audio/sfx/expedition/voyage_deep_shadow_01.ogg` | 심해 그림자 통과 | 1.5s | 2 | Create a deep shadow passage success sound. Low soft underwater pulse, companion-like warm chime, gentle darkness clearing, 1.5 seconds, not scary. |
| `assets/audio/sfx/expedition/voyage_pirate_crab_01.ogg` | 장난꾸러기 해적게 이벤트 | 1.1s | 3 | Create a playful pirate crab encounter sound. Tiny shell skitter, wooden tap, cheeky bubble pop, 1.1 seconds, funny but not cartoonish. |
| `assets/audio/sfx/expedition/voyage_storm_spout_01.ogg` | 폭풍 물기둥 통과 | 1.5s | 2 | Create a storm spout success sound. Soft rising water column, wind swirl, stable boat chime, 1.5 seconds, energetic but not frightening. |
| `assets/audio/sfx/expedition/voyage_reef_maze_01.ogg` | 암초 미로 통과 | 1.3s | 2 | Create a reef maze success sound. Gentle stone-water taps, route sparkle, soft map discovery chime, 1.3 seconds. |
| `assets/audio/sfx/expedition/voyage_event_fail_01.ogg` | 위험 항로 실패 | 0.9s | 3 | Create a gentle failed danger route sound. Low wave turn, soft bubble descent, safe retry feeling, 0.9 seconds, no damage or punishment mood. |
| `assets/audio/sfx/expedition/hidden_area_reveal_01.ogg` | 숨은 낚시터 발견 | 1.7s | 3 | Create a hidden ocean area reveal sound. Soft map sparkle, waves opening, harp glissando, warm discovery bell, 1.7 seconds. |
| `assets/audio/sfx/expedition/starwhale_appear_01.ogg` | 별고래 등장 | 2.8s | 2 | Create a starwhale appearance sound. Deep warm whale-like tone, glass star chimes, gentle ocean swell, emotional and wondrous, 2.8 seconds, no scary call. |
| `assets/audio/sfx/expedition/deep_crown_found_01.ogg` | 심해 왕관 발견 | 2.6s | 2 | Create a deep crown discovery sound. Low underwater resonance, ancient metallic bell, soft golden shimmer, mysterious but safe, 2.6 seconds. |
| `assets/audio/sfx/expedition/chapter_goal_progress_01.ogg` | 원정 기록 진행 | 1.0s | 2 | Create an expedition journal progress sound. Page mark, soft compass click, tiny bell sparkle, 1.0 seconds, purposeful and warm. |

## Rarity Audio Scaling

희귀도별 포획음은 같은 계열의 사운드를 공유하되 밀도와 꼬리를 늘립니다.

| Rarity | Audio Density | Tail | Texture |
| --- | --- | --- | --- |
| common | 1 splash + 1 chime | short | small water, shell tap |
| uncommon | 1 splash + 2 chimes | short-medium | brighter bubble |
| rare | splash + harp + bell | medium | collectible sparkle |
| epic | larger splash + layered bells | medium-long | magical flourish |
| mythic | radiant shimmer + soft pad | long | fantasy glow |
| legendary | deep warm pulse + whale-like tone | long | majestic ocean |
| ancient | low resonance + ancient bell | longest | deep time, mystery |

## Scene Mixing Notes

- 항구: BGM 70%, ambience 35%, UI SFX 80%
- 항해 지도: BGM 65%, ambience 45%, sea life SFX 30%, UI SFX 80%
- 낚시: BGM 45-55%, reel loop 45%, bite SFX 90%, success SFX 90%
- 도감/교환소: BGM 55%, UI SFX 75%, reward SFX 85%
- 위험 항로: event loop 70%, timing SFX 90%, success/fail SFX 90%
- 모바일: 작은 스피커에서 저음이 사라질 수 있으므로 SFX 핵심 정보는 800 Hz-4 kHz 사이에 반드시 존재해야 함

## Implementation Key Suggestions

나중에 코드에 붙일 때 사용할 사운드 키는 파일명에서 확장자를 뺀 형태로 맞춥니다.

```ts
bgm_harbor_home_loop
bgm_ocean_map_day_loop
bgm_fishing_focus_loop
sfx_ui_button_tap_01
sfx_fishing_bite_common_01
sfx_reward_catch_rare_01
sfx_expedition_starwhale_appear_01
```

현재 코드에는 `playSoftTone` 기반의 임시 톤이 있으므로, 실제 에셋 적용 시 다음 순서가 안전합니다.

1. UI 클릭/저장/구매 SFX부터 적용
2. 낚시 루프의 `cast`, `bite`, `reel`, `catch`, `miss` 적용
3. 항구/항해/낚시 BGM 적용
4. 희귀도별 포획음과 도감 등록음 적용
5. 별고래/심해 왕관/위험 항로 전용 BGM과 SFX 적용

## QA Checklist

- BGM loop 시작점과 끝점에서 클릭 또는 튐이 없는가
- 낚시 입질음이 BGM 위에서도 명확히 들리는가
- 포획 성공음이 희귀도별로 확실히 구분되는가
- 실패음이 아이에게 벌칙처럼 느껴지지 않는가
- 모바일 볼륨 40-60%에서도 UI 클릭과 입질음이 들리는가
- 같은 버튼을 반복 클릭해도 귀가 피곤하지 않은가
- 별고래와 심해 왕관 사운드가 신비롭지만 무섭지 않은가
- 모든 파일이 저작권 문제 없는 오리지널 생성물인가

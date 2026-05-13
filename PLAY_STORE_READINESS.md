# Play Store Readiness Plan

## Current Stage

The project now has a Capacitor Android wrapper, production web build support, and a web manifest for installable/mobile contexts.

- App id: `com.mortarteam81.banjjakbada`
- App name: `반짝바다 낚시단`
- Android target SDK: `36`
- Android minimum SDK: `24`
- Main release sync command: `npm run android:sync`
- Android Studio open command: `npm run android:open`
- Debug APK command: `npm run android:build:debug`

## Local Android Requirements

- Use JDK 21 for local Gradle builds. The current machine also has Java 25, but Gradle/Android builds should not use it.
- This session installed Homebrew JDK 21 at `/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home`.
- Install Android Studio or Android command line tools before running native APK/AAB builds.
- After installing the Android SDK, create `android/local.properties` with your SDK path, for example:

```properties
sdk.dir=/Users/mortarteam81/Library/Android/sdk
```

- To build from the terminal on this Mac:

```sh
JAVA_HOME=/opt/homebrew/opt/openjdk@21/libexec/openjdk.jdk/Contents/Home npm run android:build:debug
```

## Stage 1: Release Foundation

- Keep `npm test` and `npm run build` green before every Android sync.
- Run `npm run android:sync` after content, UI, or asset changes so the native project receives the latest `dist` output.
- Replace the generated launcher icon and splash images with final Play Store quality art before the first closed test.
- Create a signed Android App Bundle in Android Studio for Play Console upload.
- Store signing keys outside the repository.

## Stage 2: First 10 Minutes

- Add a short, playable tutorial quest chain from harbor to first catch to first collection reward.
- Add clearer success feedback for rare catches, companion affinity gains, and newly discovered routes.
- Add optional parent-friendly save backup/export guidance inside the settings flow.

## Stage 3: Retention

- Add daily expedition goals with small, reliable rewards.
- Add weekly chapter goals that rotate target areas, companions, and gear roles.
- Add non-punitive streak rewards so missed days do not feel like losing progress.

## Stage 4: Captain Pass Monetization MVP

- Use a single non-consumable Google Play product: `captain_pass_full`.
- Keep the first monetization model ad-free and family-trust first: no ads, no random boxes, no sea-friend direct sale, no failure-based purchase pressure.
- Free play keeps the core loop, first port/trade flow, and 3 save slots.
- Captain Pass opens 6 save slots, commemorative boat/flag cosmetics, expedition archive copy, season preview copy, and a parent-facing exploration report.
- Android uses the local Capacitor billing bridge backed by Google Play Billing Library `8.3.0`.
- Web/local builds must not open real payment UI; use mock restore only for QA.
- Captain Pass purchase UI must show reward value visually before asking a parent to continue.
- Android purchase copy must say `Google Play 결제 화면 열기`; local web copy must say `닫힌 테스트 준비 중`.
- Android restore copy must say `구매 복원`; local web mock restore may say `개발용 복원`.
- Parent gate must include a privacy sentence: no personal info, location, email, or device-unique identifiers.

## Stage 5: Anonymous Metrics

- Collect only first-party anonymous gameplay events for closed testing: tutorial start, first catch, first rare catch, first companion equip, first trade buy/profit, pass view, parent gate view, purchase start/complete/cancel, restore complete, D1 return.
- Do not collect AAID, IMEI, precise location, contacts, account email, child names, or device-unique identifiers.
- Add the privacy note to the app and Play Console before any cloud save or external analytics service is introduced.

## Stage 6: Family Safety

- Avoid ads, external links, chat, and user-generated content unless a parent gate is added.
- Keep all failure states non-destructive: no lost companions, collection items, or purchased gear.
- Add a simple privacy note before Play Store submission, especially if analytics or cloud save is introduced.

## Stage 7: Store Listing

- Prepare a 512 x 512 icon, feature graphic, 7-8 screenshots, and a 15-30 second trailer.
- Screenshot sequence should show: harbor, sailing map, fishing tension, rare catch, collection cards, companion, expedition chapter, shop builds.
- Store copy should emphasize: "안전한 가족형 수집 항해 RPG", collecting sea friends, ad-free family play, sailing RPG progression, and offline-friendly play.
- Run Google Play store listing experiments for icon/feature graphic/screenshot order before broad release.

## Closed Test Targets

- Audience: 10-30 family/friend testers for at least 14 days.
- Primary metrics: D1 return, first trade completion, Captain Pass screen reach, parent gate drop-off, purchase/restore success.
- Quality gates: no crash/ANR clusters, no save-loss reports, no harsh vibration complaints, no UI overlap on small landscape phones.

## Pre-Submission QA

- Android real-device landscape test on at least one small phone and one larger phone.
- Verify vibration patterns do not feel harsh and respect device/browser support.
- Verify save/load after app close, phone restart, and Android WebView update.
- Verify no UI overlap in harbor, exchange, collection, expedition, voyage event, and fishing result screens.
- Verify Android vitals basics: cold start, memory pressure, long play session, app background/resume.

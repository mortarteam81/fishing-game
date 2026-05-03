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

## Stage 4: Family Safety

- Avoid ads, external links, chat, and user-generated content unless a parent gate is added.
- Keep all failure states non-destructive: no lost companions, collection items, or purchased gear.
- Add a simple privacy note before Play Store submission, especially if analytics or cloud save is introduced.

## Stage 5: Store Listing

- Prepare a 512 x 512 icon, feature graphic, 7-8 screenshots, and a 15-30 second trailer.
- Screenshot sequence should show: harbor, sailing map, fishing tension, rare catch, collection cards, companion, expedition chapter, shop builds.
- Store copy should emphasize collecting sea friends, safe family play, sailing RPG progression, and offline-friendly play.

## Pre-Submission QA

- Android real-device landscape test on at least one small phone and one larger phone.
- Verify vibration patterns do not feel harsh and respect device/browser support.
- Verify save/load after app close, phone restart, and Android WebView update.
- Verify no UI overlap in harbor, exchange, collection, expedition, voyage event, and fishing result screens.
- Verify Android vitals basics: cold start, memory pressure, long play session, app background/resume.

# AGENTS.md - Shared Project Instructions

This project uses Google Labs `DESIGN.md` as the shared design contract for Codex, Claude Code, Gemini CLI, Antigravity, and OpenClaw.

## Design System

- Read `DESIGN.md` before changing UI, Phaser scene composition, SVG factories, characters, boats, fishing rods, bait, flags, sea creatures, port interiors, trade screens, collection cards, or mobile layout.
- Treat the YAML front matter in `DESIGN.md` as the normative token source and the markdown body as design rationale.
- Validate design changes with `npm run design:lint`.
- Use `npm run design:spec` when you need the Google `design.md` format reference.
- Do not replace the game's original art direction with a copied commercial brand style.

## OpenClaw Bridge

For OpenClaw-related work, read `/Users/mortarteam81/.openclaw/shared/OPENCLAW_AGENTIC_PROFILE.md` and `/Users/mortarteam81/.openclaw/shared/CODEX_BRIDGE.md`.

Use the main/orchestrator perspective by default. Do not copy Telegram tokens, OAuth data, private memory, or raw logs into Codex prompts or files.

## Local Commands

- `npm run design:lint` - validate the project `DESIGN.md` with `@google/design.md`.
- `npm run build` - typecheck and build the Vite/Phaser app.
- `npm test` - run the Vitest suite.
- `npm run dev` - start the local dev server.

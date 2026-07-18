# Project Context

This repo is greenfield/prototype work. Existing scaffolded UI and code can be replaced freely when it helps validate the cafe/bar membership workflow faster.

When touching customer pages, add proper translations (all languages in `apps/web/src/lib/i18n.ts`).

Before finishing any change, run from the repo root and fix everything they report:

```sh
pnpm lint && pnpm lint:css && pnpm typecheck && pnpm format
```

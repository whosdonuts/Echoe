---
name: echo-subagent
description: >-
  Runs a focused task loop for the Echo repo (Next.js App Router frontend, Node
  mock API backend): clarify the goal, locate code with search, implement with
  minimal diffs, run typecheck or dev as needed. Use when the user asks for
  features, fixes, refactors, debugging, or any implementation work in this
  repository.
---

# Echo task subagent

## Repo map

- **frontend/** — Next.js (App Router), routes under `frontend/app/`, UI in `frontend/components/`, shared logic in `frontend/lib/`.
- **backend/** — Standalone mock REST API (`server.js`); optional; frontend often uses inline mocks.
- **Root** — npm workspaces; common commands from repo root.

## Task loop

1. **Goal** — One-sentence restatement of what “done” means.
2. **Discover** — Use search/grep to find call sites, routes, and types before editing.
3. **Edit** — Match existing naming, imports, and patterns; avoid unrelated churn.
4. **Verify** — Run `npm run typecheck` from repo root after substantive TS changes. Use `npm run dev` when the user needs to exercise the UI (Mapbox: `frontend/.env.local` from `.env.local.example`).

## Execution norms

- Prefer reading surrounding files before writing new code.
- Run commands yourself when they are needed to validate the change (real shell).
- If the task is large or parallel exploration helps, delegate exploration to a readonly sub-task rather than thrashing in one thread.

## Out of scope

- Do not add docs or markdown unless the user asked for them.
- Do not broaden refactors beyond what the task requires.

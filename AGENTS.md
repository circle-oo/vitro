# Repository Guidelines

## Purpose
This document defines how to work in `vitro/` with high speed and high quality.

## Runtime Defaults (Trusted Personal Repo)
Use the following defaults when this repository is treated as trusted:
- `approval_policy: never`
- `sandbox_mode: danger-full-access`
- `network_access: enabled`

If a task is sensitive, use a safer execution mode for that task.

## Project Structure
- `src/` contains the library source.
- `src/components/` is grouped by domain (`ui`, `layout`, `glass`, `data`, `chat`, `feedback`).
- `src/charts/` holds Recharts wrappers and DAG helpers.
- `src/hooks/` and `src/utils/` hold shared logic.
- `src/styles/` includes `base.css`, `vitro.css`, and theme files under `src/styles/themes/`.
- `src/index.ts` is the public export surface and must stay accurate.
- `demo/` is the Vite showcase app (`demo/src/pages`, `demo/src/data`).
- `docs/` stores design and migration references.
- `scripts/verify-dist-exports.mjs` validates published exports after build.
- `dist/` is generated output; do not hand-edit it.

## Default Execution Workflow
Use this sequence unless the user asks otherwise.

1. Scope quickly
- Use `rg` or `rg --files` to identify only relevant files.
- Confirm whether the change touches library, demo, or both.

2. Implement minimally
- Prefer focused edits over broad refactors.
- Preserve existing design language and component patterns.

3. Validate in two layers
- Run targeted checks first.
- Run repository-level verification before handoff.

4. Report clearly
- Include changed files, behavior changes, validation results, and residual risks.

## Build, Test, and Dev Commands
Run from `vitro/` root unless noted.

Library:
- `npm install`: install dependencies.
- `npm run dev`: watch build with `tsup`.
- `npm run typecheck`: strict TypeScript checks.
- `npm run build`: create ESM/CJS bundles and declarations in `dist/`.
- `npm run verify`: typecheck + build + export smoke check.

Demo:
- `npm --prefix demo install`: install demo dependencies.
- `npm --prefix demo run dev`: start Vite dev server.
- `npm --prefix demo run build`: produce demo production bundle.

## Validation Policy
Minimum expected validation by change type:

- Library-only changes:
  - `npm run verify`
- Demo-only changes:
  - `npm --prefix demo run build`
- Library + demo changes:
  - `npm run verify`
  - `npm --prefix demo run build`

For UI changes, smoke-test affected states in demo (theme/mode/interactive states).
For bug fixes, add or update regression coverage when behavior changes.

## Coding Style and Naming
- Stack: TypeScript + React (ES modules, `strict: true`).
- Formatting: 2-space indentation, semicolons, single quotes.
- Components/pages: PascalCase filenames (for example, `Button.tsx`, `DashboardPage.tsx`).
- Hooks: `useX` camelCase (for example, `useDebounce.ts`).
- Keep public API explicit and stable through `src/index.ts`.
- Keep service/theme CSS under `src/styles/themes/`.

## Testing Guidelines
- No dedicated Jest/Vitest suite is required yet.
- Baseline pre-PR checks:
  - `npm run verify`
  - `npm --prefix demo run build`
- If tests are introduced, use `*.test.ts` or `*.test.tsx` colocated with source modules.

## Commit and PR Guidelines
- Use Conventional Commits: `feat(scope): ...`, `fix: ...`, `perf: ...`, `chore: ...`.
- Keep commits focused; avoid mixing unrelated library/demo changes.
- PRs should include:
  - concise summary
  - impacted paths (for example, `src/components/ui`, `demo/src/pages`)
  - verification commands and results
  - screenshots/GIFs for visual changes
  - related issues/tasks when available

## Request Templates
Use these prompts for better speed and quality.

### End-to-End Implementation Template
```txt
Handle this task end-to-end.
- First, find only relevant files using rg.
- Implement with minimal, focused edits and preserve existing style.
- Run targeted checks first, then full verification commands.
- If failures occur, explain root cause and retry steps.
- Final report must include: changed files, key logic, test results, and remaining risks.
```

### Definition of Done Template
```txt
Definition of Done:
1) Behavior implemented and edge cases handled.
2) Related checks/tests pass (`npm run verify`, demo build when needed).
3) Risks, assumptions, and follow-up items documented briefly.
```

### Code Review Request Template
```txt
Review this change for:
1) correctness and regressions
2) API compatibility and visual consistency
3) missing or weak validation coverage
List findings first by severity, then assumptions/open questions.
```

## Final Response Format (Recommended)
```txt
Summary: one short paragraph
Changed files: path list
Validation: command list with pass/fail
Residual risks: concise bullets
```

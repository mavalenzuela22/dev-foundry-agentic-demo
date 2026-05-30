# TSK-003: Frontend UI (browser-only, Vite-bundled)

## Objective

Implement a new interactive web UI for Foundry Request Board that runs the existing classifier entirely in the browser, provides in-memory classification history, and supports copying the JSON output.

## Governing spec

- `docs/40-specs/SPC-002-frontend-ui.md`
- Dependency: classifier behavior in `docs/40-specs/SPC-001-foundry-request-classification.md`

## Mode

Hybrid (new UI feature in an existing repo).

## Scope

### In-scope

- SPA UI implementing all MVP requirements from `SPC-002`.
- Bundler/dev server packaging strategy (prefer Vite).
- Minimal styling (modern card-based layout) without requiring an external UI component library.

### Out-of-scope

- Any backend API.
- Persistence beyond in-memory runtime history.
- Large UI frameworks unless governance explicitly approves.

## Constraints / governance-sensitive changes

- Tooling changes (adding Vite, updating `package.json`, etc.) require explicit Governance approval during execution.

## Implementation boundaries

### Allowed implementation areas (for future execution)

- UI source (to be created): `ui/**` (preferred) or `src/ui/**` (alternate; choose one during implementation).
- Static entrypoint (to be created): `index.html` (if using Vite default) and Vite config files as needed.
- Existing classifier module: `src/requestClassifier.js` (may be imported/bundled; edits only if required for browser compatibility).
- Tests:
  - Existing: `tests/requestClassifier.test.js` (keep)
  - New UI tests are optional for MVP unless governance mandates them.

### Forbidden

- Secrets and `.env` files.
- Deployment infrastructure (Docker, CI pipelines) for MVP.
- Any backend services.

## Acceptance criteria (task-level)

AC-TSK-UI-001 Spec traceability
- Implementation microtasks reference `SPC-002` acceptance criteria.

AC-TSK-UI-002 UI behaviors (MVP)
- Meets `SPC-002` AC-UI-001 through AC-UI-007.

AC-TSK-UI-003 Governed tooling change acknowledged
- Vite addition is represented as an explicit microtask requiring Governance review/approval before execution.

## Evidence expectations

- Code changes (to be produced by Code Author during execution) in allowed implementation areas.
- Validator report documenting:
  - automated checks run (tests/lint if present)
  - manual UI verification checklist results
- Updated `docs/00-product/source-of-truth-map.md` linking spec/task/MTP and evidence.

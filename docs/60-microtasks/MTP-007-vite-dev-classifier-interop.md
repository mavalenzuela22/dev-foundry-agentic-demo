# MTP-007: Vite Dev-server Classifier Interop Fix

## Status

COMPLETED PRODUCT MICRO-TASK PACK

## Purpose

Fix a Vite dev-server-only classifier import issue where the UI worked in preview mode but failed in dev mode.

This micro-task pack belongs to Foundry Request Board product runtime behavior. It does not define Dev Foundry agent-system hardening, Alita prompt behavior, Flow Evidence Manifest behavior, MCP read-reduction behavior, or Orchestrator behavior.

## Problem Statement

The Foundry Request Board UI worked under the production preview flow but failed under Vite dev server.

Observed behavior:

- `npm run preview` worked.
- `npm run dev` failed in the browser UI with classifier interop resolution error.
- The UI could not resolve a working `classifyRequest` export from `src/requestClassifier.js` under Vite dev server behavior.

Observed error text:

- `Could not resolve classifyRequest export from src/requestClassifier.js (CJS/ESM interop failed)`

## Root Cause Hypothesis

The classifier module originated as a CommonJS-compatible module for Node/Jest usage.

Vite preview/build behavior and Vite dev-server behavior can expose CommonJS/ESM interop differently. The existing browser wrapper could obtain the classifier in preview, but dev mode did not expose the expected export shape.

## Product Goal

Make classifier interop work consistently in both:

- Vite dev server
- Vite build and preview

without changing classifier behavior.

## Scope

### Implementation scope

- `src/requestClassifier.js`
- `ui/requestClassifierInterop.js`

### Source-of-truth and evidence scope

- `docs/60-microtasks/MTP-007-vite-dev-classifier-interop.md`
- `docs/30-validation/VAL-007-vite-dev-classifier-interop.md`

### Forbidden scope

- package files
- lockfiles
- dependency changes
- Vite config changes
- build config changes
- deployment files
- tests, unless separately approved
- UI files outside `ui/requestClassifierInterop.js`
- classifier behavior changes
- agent-system docs
- agent prompt files
- secrets
- environment files

## Non-goals

- Do not change classification output.
- Do not add dependencies.
- Do not change the test runner.
- Do not introduce a backend.
- Do not redesign the UI.
- Do not refactor the classifier.
- Do not change the product specification unless classifier behavior changes, which this fix should avoid.

## Proposed Minimal Fix

Use a minimal browser-safe fallback that allows the UI interop layer to resolve `classifyRequest` consistently.

Implementation direction:

1. In `src/requestClassifier.js`, expose a guarded browser-accessible fallback reference through `globalThis` when available.
2. Preserve existing CommonJS export behavior for Node/Jest compatibility.
3. In `ui/requestClassifierInterop.js`, resolve the classifier function in a safe order:
   - ESM named export, if present.
   - CommonJS default export shape, if present.
   - `globalThis` fallback after module evaluation.
4. If no function is found, keep a clear interop failure error.

## Acceptance Criteria

### AC-MTP-007-001 Dev server works

When running `npm run dev` and opening the app in the browser:

- the prior interop error is not observed;
- the app reaches the usable UI state;
- classification can run.

### AC-MTP-007-002 Preview still works

When running build and preview:

- build succeeds;
- preview server starts;
- UI loads;
- classification remains usable.

### AC-MTP-007-003 Tests still pass

User-run `npm test` passes.

### AC-MTP-007-004 Classifier behavior is unchanged

The fix must not change classification semantics.

The classifier should still satisfy existing regression tests, including:

- documentation-only request classification;
- security escalation;
- documentation-only security exception;
- negated `code` phrase regression.

### AC-MTP-007-005 Scope remains bounded

Only the approved implementation files should change:

- `src/requestClassifier.js`
- `ui/requestClassifierInterop.js`

No package, dependency, Vite config, test, backend, deployment, or agent-system changes are authorized.

## Micro-tasks

### [x] MT-001 — Source-of-truth scope and guardrails

Owner: Source-of-Truth Author

Purpose:

- Create a bounded micro-task pack for the Vite dev-server interop bugfix.
- Define problem, scope, forbidden changes, and validation expectations.

Allowed files:

- `docs/60-microtasks/MTP-007-vite-dev-classifier-interop.md`

Optional closure/evidence file:

- `docs/30-validation/VAL-007-vite-dev-classifier-interop.md`

Forbidden:

- implementation files
- tests
- package files
- dependency changes
- Vite config changes
- deployment files
- secrets
- agent-system docs
- agent prompt files

Requirements:

- State the observed dev-server-only failure.
- State that preview worked while dev failed.
- Limit implementation scope to the smallest set of files.
- Define validation evidence required from user-run runtime checks.

Acceptance criteria:

- MTP defines explicit allowlist.
- MTP defines explicit forbidden scope.
- MTP defines validation requirements for dev, test, build, and preview.
- MTP does not expand product behavior.

Evidence:

- `docs/60-microtasks/MTP-007-vite-dev-classifier-interop.md`

Status:

- Completed.

### [x] MT-002 — Implement minimal classifier interop fallback

Owner: Code Author

Purpose:

- Fix Vite dev-server classifier resolution while preserving Node/Jest compatibility and classifier behavior.

Allowed files:

- `src/requestClassifier.js`
- `ui/requestClassifierInterop.js`

Forbidden:

- any other source files
- tests
- package files
- lockfiles
- dependency changes
- Vite config changes
- deployment files
- secrets
- docs, except closure/evidence handled by source-of-truth steps

Requirements:

- Add a guarded browser-accessible fallback for `classifyRequest`.
- Preserve guarded CommonJS export for Node/Jest usage.
- Update browser interop resolution to try:
  - ESM named export
  - CommonJS default shape
  - browser global fallback
- Keep the existing failure mode clear if no classifier function is available.
- Do not change classifier logic or output.
- Do not add dependencies.

Acceptance criteria:

- Dev server no longer fails to resolve `classifyRequest`.
- Preview remains functional.
- Tests remain compatible.
- Classifier output is unchanged.
- Only approved implementation files are modified.

Evidence:

- Modified files:
  - `src/requestClassifier.js`
  - `ui/requestClassifierInterop.js`
- Summary:
  - Added guarded `globalThis` fallback in classifier module.
  - Updated interop resolution order in browser wrapper.
  - Preserved CommonJS compatibility.
  - No dependencies, config, package, test, or deployment changes.

Status:

- Completed.

### [x] MT-003 — Validate dev, test, build, and preview behavior

Owner: Validator

Purpose:

- Validate the interop fix using static review plus user-run runtime evidence.

Allowed read scope:

- `src/requestClassifier.js`
- `ui/requestClassifierInterop.js`
- `tests/requestClassifier.test.js`
- `package.json`
- `docs/60-microtasks/MTP-007-vite-dev-classifier-interop.md`

Allowed evidence scope:

- `docs/30-validation/VAL-007-vite-dev-classifier-interop.md`

Forbidden:

- implementation changes
- package changes
- dependency changes
- Vite config changes
- deployment changes
- secrets
- agent-system docs

Validation requirements:

- Confirm the implementation includes a browser-safe fallback.
- Confirm CommonJS compatibility remains present.
- Confirm interop wrapper resolves classifier through safe fallback order.
- Record user-run `npm test` evidence.
- Record user-run `npm run dev` evidence.
- Record user-run build and preview evidence.
- State clearly that runtime commands were run by the user, not by agents.

Acceptance criteria:

- `npm test` user-run evidence passes.
- `npm run dev` user-run evidence shows the prior error is not observed.
- `npm run build && npm run preview` user-run evidence passes.
- Validation report records the previous error string and confirms it is no longer observed.
- Validation report preserves user-run evidence attribution.

Evidence:

- `docs/30-validation/VAL-007-vite-dev-classifier-interop.md`
- User-run `npm test`: PASS, 8 tests passed.
- User-run `npm run dev`: PASS, UI loaded and classified without prior interop error.
- User-run `npm run build && npm run preview`: PASS, build succeeded and preview loaded.
- User-provided screenshots were referenced in validation evidence, but private/local attachment identifiers are not required for understanding this product record.

Status:

- Completed.

### [x] MT-004 — Source-of-truth closure

Owner: Source-of-Truth Author

Purpose:

- Close the micro-task pack and link validation evidence.

Allowed files:

- `docs/60-microtasks/MTP-007-vite-dev-classifier-interop.md`
- `docs/30-validation/VAL-007-vite-dev-classifier-interop.md`

Forbidden:

- implementation changes
- tests
- package changes
- dependency changes
- Vite config changes
- deployment files
- secrets
- agent-system docs
- agent prompt files

Requirements:

- Mark all micro-tasks completed.
- Link validation evidence.
- State no specification change was required because this was an interop-only bugfix.
- Preserve evidence attribution: runtime evidence was user-run.
- Do not reopen implementation scope.

Acceptance criteria:

- MTP status is completed.
- Validation evidence is linked.
- Runtime evidence attribution is honest.
- No product behavior change is claimed beyond runtime interop fix.

Evidence:

- `docs/30-validation/VAL-007-vite-dev-classifier-interop.md`
- This MTP closure record.
- No spec change required.

Status:

- Completed.

## Validation Evidence Summary

Validation record:

- `docs/30-validation/VAL-007-vite-dev-classifier-interop.md`

Runtime evidence source:

- User-run local commands and screenshots.

Recorded runtime outcomes:

- `npm test`: PASS, 8 tests passed.
- `npm run dev`: PASS; prior classifier interop error not observed.
- `npm run build && npm run preview`: PASS; build succeeded and preview loaded.

Important limitation:

- Agents did not execute runtime commands.
- Runtime evidence was provided by the user and recorded as user-run evidence.

## Product Outcome

The Foundry Request Board UI now works in both Vite dev-server and preview flows.

The fix preserves:

- classifier behavior;
- Jest compatibility;
- browser classification;
- Vite preview behavior;
- bounded implementation scope.

## No Specification Change Required

No product specification change was required because this fix addressed browser module interop only.

The classifier’s expected classification behavior remains governed by:

- `docs/40-specs/SPC-001-foundry-request-classification.md`

The browser UI behavior remains governed by:

- `docs/40-specs/SPC-002-frontend-ui.md`

## Final Status

MTP-007 is complete and ready to be used as a demo scenario for bounded bugfix handling with user-run runtime evidence.
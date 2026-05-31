# MTP-005: CJS Browser Interop Fix for requestClassifier

## Status

COMPLETED PRODUCT MICRO-TASK PACK

## Purpose

Fix a browser runtime error caused by the CommonJS export statement in `src/requestClassifier.js` when the classifier was loaded in the browser UI flow.

This micro-task pack belongs to Foundry Request Board product runtime behavior. It does not define Dev Foundry agent-system hardening, Alita prompt behavior, Flow Evidence Manifest behavior, MCP read-reduction behavior, or Orchestrator behavior.

## Problem Statement

The browser UI showed a classifier runtime error:

- `ReferenceError: module is not defined`

Observed location:

- `src/requestClassifier.js`

Root cause:

- `src/requestClassifier.js` ended with a CommonJS export statement:
  - `module.exports = { classifyRequest };`
- In browser runtime, `module` is not defined.
- The unguarded CommonJS export caused the browser flow to fail.

## Product Goal

Prevent the browser runtime `ReferenceError` without changing classifier behavior or output.

The fix must preserve:

- browser UI classification flow;
- Node/Jest CommonJS compatibility;
- deterministic classifier behavior;
- existing tests.

## Scope

### Implementation scope

- `src/requestClassifier.js`

### Read-only references

- `ui/requestClassifierInterop.js`
- `tests/requestClassifier.test.js`
- `docs/40-specs/SPC-001-foundry-request-classification.md`
- `docs/40-specs/SPC-002-frontend-ui.md`

### Source-of-truth and evidence scope

- `docs/60-microtasks/MTP-005-cjs-browser-interop-fix.md`
- `docs/30-validation/VAL-005-cjs-browser-interop-fix.md`

### Forbidden scope

- package files
- lockfiles
- dependency changes
- Vite config changes
- build config changes
- deployment files
- tests
- UI source changes
- classifier logic changes
- classifier output changes
- backend services
- secrets
- environment files
- agent-system docs
- agent prompt files

## Minimal Fix

Guard the CommonJS export assignment so it only runs when `module` exists.

Required behavior:

- In Node/Jest contexts where `module.exports` exists, preserve CommonJS export.
- In browser contexts where `module` does not exist, do not throw.
- Do not change `classifyRequest` logic.

Preferred implementation shape:

- `if (typeof module !== 'undefined' && module.exports) { module.exports = { classifyRequest }; }`

## Acceptance Criteria

### AC-MTP-005-001 Browser runtime no longer throws module ReferenceError

When the browser UI loads and classification runs, the previous error is not observed:

- `ReferenceError: module is not defined`

### AC-MTP-005-002 Classifier behavior is unchanged

The fix must not alter classifier output.

### AC-MTP-005-003 Node/Jest compatibility remains

CommonJS export must still be available when `module.exports` exists.

### AC-MTP-005-004 No dependency or configuration changes

The fix must not require:

- new dependencies
- package file changes
- lockfile changes
- Vite config changes
- build config changes

### AC-MTP-005-005 Scope remains bounded

Only the approved implementation file may change:

- `src/requestClassifier.js`

## Micro-tasks

### [x] MT-001 — Governance approval for bounded guard-only change

Owner: Governance Agent

Purpose:

- Approve the minimal implementation scope for guarding the CommonJS export.

Review inputs:

- `docs/60-microtasks/MTP-005-cjs-browser-interop-fix.md`
- `src/requestClassifier.js`, as proposed implementation target

Approved implementation file:

- `src/requestClassifier.js`

Forbidden:

- package files
- lockfiles
- dependencies
- Vite config
- UI files
- tests
- deployment files
- secrets
- agent-system docs
- agent prompt files

Decision criteria:

- Fix is strictly additive and guard-only.
- Fix does not change classifier logic.
- Fix does not require configuration or dependency changes.

Evidence:

- `docs/30-validation/VAL-005-cjs-browser-interop-fix.md`
- Governance decision: APPROVED.
- Scope bounded to `src/requestClassifier.js`.

Status:

- Completed.

### [x] MT-002 — Implement guarded CommonJS export

Owner: Code Author

Purpose:

- Prevent browser `ReferenceError` by guarding the CommonJS export assignment.

Allowed files:

- `src/requestClassifier.js`

Forbidden:

- any other source files
- UI files
- tests
- package files
- lockfiles
- dependency changes
- Vite config changes
- deployment files
- secrets
- docs, except closure/evidence handled by source-of-truth steps

Requirements:

- Locate the existing CommonJS export assignment.
- Replace the unguarded `module.exports` assignment with a guarded version.
- Preserve Node/Jest CommonJS compatibility.
- Do not change classifier logic.
- Do not refactor unrelated code.
- Do not change formatting beyond the minimal required edit.

Acceptance criteria:

- Browser no longer throws `ReferenceError: module is not defined`.
- CommonJS export remains available in Node/Jest contexts.
- No classifier output changes are introduced.
- No other files are modified by this implementation task.

Evidence:

- Modified file: `src/requestClassifier.js`
- Summary: guarded `module.exports` assignment with `typeof module !== 'undefined' && module.exports`.
- Validation evidence: `docs/30-validation/VAL-005-cjs-browser-interop-fix.md`

Status:

- Completed.

### [x] MT-003 — Validate export guard and runtime behavior

Owner: Validator

Purpose:

- Validate the guarded export fix through static inspection and user-run runtime evidence.

Allowed read scope:

- `src/requestClassifier.js`
- `ui/requestClassifierInterop.js`
- `tests/requestClassifier.test.js`
- `docs/60-microtasks/MTP-005-cjs-browser-interop-fix.md`

Allowed evidence scope:

- `docs/30-validation/VAL-005-cjs-browser-interop-fix.md`

Forbidden:

- implementation changes
- test changes
- UI changes
- package changes
- dependency changes
- Vite config changes
- deployment changes
- secrets
- agent-system docs

Validation requirements:

- Confirm guard exists around `module.exports`.
- Confirm there is no unguarded browser-executed `module.exports` statement.
- Confirm classifier interop reference remains compatible.
- Record user-run runtime evidence when provided.
- Record user-run test evidence when provided.
- State clearly that runtime evidence was user-run if agents did not execute commands.

Acceptance criteria:

- Static inspection confirms guarded export.
- Runtime evidence confirms prior browser error is not observed.
- User-run test evidence confirms Jest tests pass.
- Validation report preserves limitations honestly.

Evidence:

- `docs/30-validation/VAL-005-cjs-browser-interop-fix.md`
- User-run preview evidence indicated no module-related ReferenceError during classification flow.
- User-run `npm test` evidence reported the classifier test suite passing.

Status:

- Completed.

### [x] MT-004 — Source-of-truth closure and evidence links

Owner: Source-of-Truth Author

Purpose:

- Close the micro-task pack and link validation evidence.

Allowed files:

- `docs/60-microtasks/MTP-005-cjs-browser-interop-fix.md`
- `docs/30-validation/VAL-005-cjs-browser-interop-fix.md`

Forbidden:

- implementation changes
- tests
- UI changes
- package changes
- dependency changes
- Vite config changes
- deployment files
- secrets
- agent-system docs
- agent prompt files

Requirements:

- Mark all micro-tasks completed.
- Link governance, implementation, and validation evidence.
- Preserve user-run runtime evidence attribution.
- Do not reopen implementation scope.
- Do not claim classifier behavior changed.

Acceptance criteria:

- MTP reflects completed status.
- Validation evidence is linked.
- Runtime evidence attribution is honest.
- No unapproved files are added to the implementation scope.

Evidence:

- `docs/30-validation/VAL-005-cjs-browser-interop-fix.md`
- This MTP closure record.

Status:

- Completed.

## Validation Evidence Summary

Validation record:

- `docs/30-validation/VAL-005-cjs-browser-interop-fix.md`

Validation basis:

- Static inspection of export guard.
- User-run browser runtime evidence.
- User-run `npm test` evidence.

Important limitation:

- Agents did not independently execute runtime commands.
- Scope validation was evidence-based where repo-wide diff proof was unavailable.

## Product Outcome

The browser UI no longer fails due to an unguarded CommonJS export statement.

The fix preserves:

- classifier behavior;
- Node/Jest compatibility;
- browser UI compatibility;
- bounded implementation scope.

## Relationship to MTP-007

MTP-005 fixed the initial browser runtime `module is not defined` error.

A later interop issue specific to Vite dev-server export resolution was addressed separately in:

- `docs/60-microtasks/MTP-007-vite-dev-classifier-interop.md`

The two packs are related but distinct:

- MTP-005: prevent browser crash from unguarded `module.exports`.
- MTP-007: ensure Vite dev-server can resolve `classifyRequest` consistently.

## Final Status

MTP-005 is complete and retained as a bounded product runtime bugfix record.
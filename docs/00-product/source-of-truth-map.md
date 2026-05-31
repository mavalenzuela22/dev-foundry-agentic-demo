# Source-of-Truth Map

## Status

ACTIVE PRODUCT TRACEABILITY MAP

## Purpose

Map Foundry Request Board product behavior, implementation artifacts, validation evidence, and demo-facing traceability.

This document describes product traceability only. It does not define Dev Foundry agent-system hardening, Alita prompt behavior, Flow Evidence Manifest behavior, MCP read-reduction behavior, or Orchestrator behavior.

## Historical Note

The initial source-of-truth spine was created after the first classifier slice as retroactive SDD hardening. Later product slices moved toward source-of-truth-first execution and tighter validation evidence.

This map reflects the current product traceability state after classifier and browser UI demo hardening.

## Product Intent Anchors

- Product direction: `docs/00-product/product-direction.md`
- Demo guardrails: `docs/20-governance/demo-guardrails.md`

## Classifier Product Spine

### Base classifier behavior

- Spec: `docs/40-specs/SPC-001-foundry-request-classification.md`
- Task: `docs/50-tasks/TSK-001-documentation-only-classifier.md`
- Micro-task pack: `docs/60-microtasks/MTP-001-documentation-only-classifier.md`

### Security classification delta

- Spec: `docs/40-specs/SPC-001-foundry-request-classification.md`
- Task: `docs/50-tasks/TSK-002-security-request-classification-delta.md`
- Micro-task pack: `docs/60-microtasks/MTP-002-security-request-classification-delta.md`

### Negated code signal regression

- Spec: `docs/40-specs/SPC-001-foundry-request-classification.md`
- Micro-task pack: `docs/60-microtasks/MTP-006-negated-code-signal.md`
- Validation evidence: `docs/30-validation/VAL-006-negated-code-signal.md`

## UI Product Spine

### Browser-only frontend UI MVP

- Spec: `docs/40-specs/SPC-002-frontend-ui.md`
- Task: `docs/50-tasks/TSK-003-frontend-ui.md`
- Micro-task pack: `docs/60-microtasks/MTP-004-frontend-ui.md`
- Validation evidence: `docs/30-validation/validator-mtp-004-ui-ac-ui-001-007.md`

### Browser runtime interop fixes

Initial browser CommonJS guard:

- Micro-task pack: `docs/60-microtasks/MTP-005-cjs-browser-interop-fix.md`
- Validation evidence: `docs/30-validation/VAL-005-cjs-browser-interop-fix.md`

Vite dev-server classifier interop:

- Micro-task pack: `docs/60-microtasks/MTP-007-vite-dev-classifier-interop.md`
- Validation evidence: `docs/30-validation/VAL-007-vite-dev-classifier-interop.md`

## Implementation Artifacts

### Classifier

- Implementation: `src/requestClassifier.js`
- Tests: `tests/requestClassifier.test.js`

### Browser UI

- App entrypoint: `index.html`
- UI source: `ui/**`
- Browser classifier interop: `ui/requestClassifierInterop.js`
- UI styling: `ui/styles.css`

### Local tooling

- Package metadata and scripts: `package.json`
- Lockfile: `package-lock.json`
- Vite config: `vite.config.js`, if present

## Validation Evidence

### Slice 001 evidence

- Slice summary: `docs/30-validation/agentic-slice-001-summary.md`
- Commit review: `docs/30-validation/code-author-commit-review-e953f5a.md`
- Validator report: `docs/30-validation/validator-smoke-test-001.md`

### Slice 002 evidence

- Slice summary: `docs/30-validation/agentic-slice-002-security-delta-summary.md`
- Evidence-maintenance pack: `docs/60-microtasks/MTP-003-slice-002-security-delta-summary-template-alignment.md`

### Runtime and regression evidence

- CJS browser guard evidence: `docs/30-validation/VAL-005-cjs-browser-interop-fix.md`
- Negated code regression evidence: `docs/30-validation/VAL-006-negated-code-signal.md`
- Vite dev-server interop evidence: `docs/30-validation/VAL-007-vite-dev-classifier-interop.md`
- UI acceptance evidence: `docs/30-validation/validator-mtp-004-ui-ac-ui-001-007.md`

## Current Demo-ready Traceability

### Classifier demo path

`SPC-001` -> `TSK-001` -> `MTP-001` -> `src/requestClassifier.js` -> `tests/requestClassifier.test.js` -> validation evidence

### Security classifier demo path

`SPC-001` -> `TSK-002` -> `MTP-002` -> `src/requestClassifier.js` -> `tests/requestClassifier.test.js` -> Slice 002 validation evidence

### Negated code regression demo path

`SPC-001` -> `MTP-006` -> `src/requestClassifier.js` + `tests/requestClassifier.test.js` -> `VAL-006`

### Browser UI demo path

`SPC-002` -> `TSK-003` -> `MTP-004` -> `index.html` + `ui/**` -> UI validation evidence

### Dev-server runtime fix demo path

`MTP-007` -> `src/requestClassifier.js` + `ui/requestClassifierInterop.js` -> `VAL-007`

## Evidence Attribution Rules

Validation evidence must distinguish between:

- static inspection;
- agent-reported evidence;
- user-run runtime evidence;
- screenshots or manual verification provided by the user.

Agents must not claim runtime execution unless there is actual evidence that the agent executed the command. User-run commands must be labeled as user-run evidence.

## Product vs Agent-system Boundary

Product documents under this map describe Foundry Request Board behavior and evidence.

Agent-system hardening belongs outside this product map and is documented separately under agent-system documentation areas such as:

- `docs/10-agents/`
- `docs/70-agent-system/`

## Notes

- Foundry Request Board is intentionally small and demo-focused.
- The classifier is deterministic and keyword/regex based.
- Ambiguous requests route to `needs_review`.
- UI classification is browser-only and does not require a backend API.
- Some validation evidence is user-run because Alita agents did not have terminal/browser runtime access in this workflow.
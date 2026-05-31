# MTP-007 — Vite dev-server classifier import interop fix

Status: **COMPLETED**

- Request / Trigger: Vite dev-server-only failure resolving `classifyRequest` from `src/requestClassifier.js`.
- Repo: `/Users/martin.valenzuela/Development/dev-foundry-agentic-demo`
- Intended change type: **brownfield bugfix (interop)**
- Owner (Orchestrator): TBD

## Problem statement (observed)
- `npm run dev` (http://localhost:5173) shows UI error JSON:
  - `"Could not resolve classifyRequest export from src/requestClassifier.js (CJS/ESM interop failed)"`
  - thrown in `ui/requestClassifierInterop.js`.
- `npm run preview` (http://localhost:4173) works.

## Hypothesis (from request)
Vite dev serves local source as native ESM without CJS wrapping; the guarded `module.exports` assignment in `src/requestClassifier.js` does not apply, so no export is exposed to `import()` consumers in dev.

## Proposed minimal fix (from request)
1) In `src/requestClassifier.js`: attach a browser-accessible global export, e.g. `globalThis.__foundryRequestClassifier = { classifyRequest }` (guarded).
2) In `ui/requestClassifierInterop.js`: after awaiting dynamic import, if `classifyRequest` is not exposed, fallback to `globalThis.__foundryRequestClassifier.classifyRequest`.

## Scope and constraints
- **Implementation files allowed** (tight scope):
  - `src/requestClassifier.js`
  - `ui/requestClassifierInterop.js`
- **Spec impact**:
  - No spec change is required for this interop-only bugfix **unless** an existing spec explicitly defines how the classifier module must be imported in the browser. If such a spec exists, capture the note during MT-004 without expanding scope.
- **Forbidden**:
  - `package*.json`, dependency changes, Vite config changes, build/deploy changes
  - touching other source files beyond the two allowlisted files
  - docs changes except this MTP and explicitly referenced validation/closure documents

## Micro-task checklist

### MT-001 — SoT: scope, acceptance criteria, guardrails
- Owner agent: Dev Foundry Source-of-Truth Author
- Status: [x]
- Purpose: Make the work execution-safe and traceable; confirm minimal scope and define “done”.

#### Evidence (MT-001)
- This MTP defines execution-ready guardrails and “done” criteria:
  - **Allowlist / tight scope**: `src/requestClassifier.js`, `ui/requestClassifierInterop.js`
  - **Forbidden operations**: dependency/config/build/deploy changes; touching other files
  - **Acceptance criteria** for implementation (MT-002) and validation steps + evidence requirements (MT-003)
- Validation evidence doc target is explicitly declared: `docs/30-validation/VAL-007-vite-dev-classifier-interop.md`
- Allowed files/dirs:
  - `docs/60-microtasks/MTP-007-vite-dev-classifier-interop.md` (this file)
  - (If needed for closure) `docs/30-validation/VAL-007-vite-dev-classifier-interop.md`
- Forbidden:
  - Any code changes (implementation belongs to MT-002)
  - Any docs changes outside the two files above
- Inputs (evidence from request):
  - Error message: `Could not resolve classifyRequest export from src/requestClassifier.js (CJS/ESM interop failed)`
  - Current interop logic in `ui/requestClassifierInterop.js` as described in request
  - Current guarded CJS export in `src/requestClassifier.js` as described in request
- Acceptance criteria:
  1. This MTP contains execution-ready micro-tasks with explicit allowlist/forbidden and evidence requirements.
  2. Implementation scope is limited to exactly:
     - `src/requestClassifier.js`
     - `ui/requestClassifierInterop.js`
  3. Validation requirements are unambiguous (commands + expected results).
- Expected evidence:
  - Updated MTP content (this document) is ready for Governance delegation.

### MT-002 — Code: implement minimal interop fix (global fallback)
- Owner agent: Code Author
- Status: [x]
- Purpose: Fix Vite dev-server-only CJS/ESM interop so the UI can obtain a working `classifyRequest` function.

#### Evidence (MT-002)
- Governance: **APPROVED** tight scope only:
  - Allowed: `src/requestClassifier.js`, `ui/requestClassifierInterop.js`
  - Forbidden: everything else
- Code Author evidence (reported):
  - Modified: `src/requestClassifier.js`, `ui/requestClassifierInterop.js`
  - Change summary:
    - Added `globalThis` export fallback (guarded) for browser/dev-server execution.
    - Implemented interop resolution order in `ui/requestClassifierInterop.js` (prefer ESM named export → CJS default shape → `globalThis` fallback).
- Allowed files/dirs (strict):
  - `src/requestClassifier.js`
  - `ui/requestClassifierInterop.js`
- Forbidden:
  - any other files (including `package*.json`, `vite.config.*`, tests, or any docs)
- Requirements:
  1. In `src/requestClassifier.js`, after `classifyRequest` is defined, attach a browser-accessible global reference:
     - Set `globalThis.__foundryRequestClassifier = { classifyRequest }` **when `globalThis` exists**.
     - Do not remove the existing guarded `module.exports = { classifyRequest }` pattern; keep Node/Jest `require()` behavior.
     - Keep side effects minimal and idempotent (safe if executed more than once).
  2. In `ui/requestClassifierInterop.js` interop logic:
     - Continue to `await import('../src/requestClassifier.js')`.
     - Compute candidate classifier function in this priority order:
       1) `mod.classifyRequest` (ESM named export if present)
       2) `mod.default?.classifyRequest` (CJS default interop shape)
       3) `globalThis.__foundryRequestClassifier?.classifyRequest` (fallback after import evaluation)
     - If none resolves to a function, throw the existing error (or an equivalent error) that clearly indicates interop failure.
- Acceptance criteria:
  1. Running `npm run dev` no longer shows the JSON error, and the UI can classify requests (at least to the extent that the prior failing screen loads without error).
  2. `npm run preview` continues to work.
  3. `npm test` passes without modifications to test files.
- Expected evidence to return:
  - Diff/patch or file paths changed (from Code Author)
  - Notes of any edge cases encountered (e.g., `globalThis` availability)

### MT-003 — Validation: prove dev + tests
- Owner agent: Validator
- Status: [x]
- Purpose: Produce governed validation evidence that the fix works in dev and does not break tests.

#### Evidence (MT-003)
- Validation doc updated with user-run runtime evidence: `docs/30-validation/VAL-007-vite-dev-classifier-interop.md`
  - `npm test`: **PASS** (8/8 tests)
  - `npm run dev` at `http://localhost:5173`: **PASS**; previously observed error string is explicitly recorded as **not observed**
  - `npm run build && npm run preview` at `http://localhost:4173`: **PASS** (verbatim command output recorded)
  - Screenshot references recorded:
    - Dev: `/attachments/2cf157bc-446a-4b0b-84b0-cd09922127f2/image_20260530_223807_51040KB.png`
    - Preview: `/attachments/2cf157bc-446a-4b0b-84b0-cd09922127f2/image_20260530_224257_45792KB.png`
  - Validator verdict: **VALIDATION_PASSED**

#### Current Validator status (reported)
- Status: **COMPLETED**
- Validator verdict: **VALIDATION_PASSED** (see `docs/30-validation/VAL-007-vite-dev-classifier-interop.md`)
- Note: Evidence is user-run; agents did not execute commands.
- Allowed files/dirs:
  - (Write) `docs/30-validation/VAL-007-vite-dev-classifier-interop.md`
  - (Read) only what is needed to validate (implementation files + this MTP)
- Forbidden:
  - Implementation changes
  - Dependency/config changes
- Validation steps (required):
  1. `npm ci` (only if needed for clean environment; otherwise note existing install state)
  2. `npm test`
     - Expected: exit code 0
  3. `npm run dev`
     - Visit: http://localhost:5173
     - Expected: no UI JSON error about resolving `classifyRequest`; classifier interop does not throw.
     - Capture evidence: terminal output snippet and/or screenshot/console log excerpt showing absence of error.
  4. `npm run build && npm run preview`
     - Visit: http://localhost:4173
     - Expected: still works (regression check).
- Evidence requirements:
  - Record exact commands, timestamps (rough), and observed results in `VAL-007...`.
  - Include the exact previously observed error string and explicitly state it is no longer observed in dev.

### MT-004 — SoT closure: close MTP with evidence links
- Owner agent: Dev Foundry Source-of-Truth Author
- Status: [x]
- Purpose: Finalize the pack as a governed record by linking implementation + validation evidence.
- Allowed files/dirs:
  - `docs/60-microtasks/MTP-007-vite-dev-classifier-interop.md`
  - `docs/30-validation/VAL-007-vite-dev-classifier-interop.md`
- Forbidden:
  - Any implementation changes
- Closure requirements:
  1. Update this MTP:
     - Mark MT-001..MT-004 as `[x]` when complete.
     - Add links to:
       - validation evidence doc (`VAL-007...`)
       - code change evidence reference (PR link, diff hash, or file paths + summary as provided by Code Author)
  2. Spec impact:
     - If no spec exists or no behavior spec change is needed, explicitly note: “No spec changes required (interop-only bugfix).”
     - If a spec exists and mentions classifier import behavior, add a minimal note/reference (only if an existing spec doc is already in scope by Governance).
- Evidence:
  - Validation evidence: `docs/30-validation/VAL-007-vite-dev-classifier-interop.md` (Status: **VALIDATION_PASSED**)
  - No spec changes required (interop-only bugfix).

- Expected evidence:
  - Completed checklist in this MTP and cross-links to validation evidence.

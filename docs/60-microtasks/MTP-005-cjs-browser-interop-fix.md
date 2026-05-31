# Micro-Task Pack (MTP-005): CJS Browser Interop Fix (requestClassifier)

## Request / Problem
- Observed UI error when showing classifier result:
  - `{"error":"ReferenceError: module is not defined\n    at http://localhost:5173/src/requestClassifier.js:191:1"}`
- Root cause (reported): `src/requestClassifier.js` ends with CommonJS export `module.exports = { classifyRequest };` which throws in browser runtime where `module` is undefined.

## Purpose
Prevent the browser runtime `ReferenceError: module is not defined` without changing classifier logic or output, while preserving Node/Jest compatibility.

## Proposed Minimal Fix (preferred)
Edit `src/requestClassifier.js` ONLY to guard `module.exports` assignment:

```js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { classifyRequest };
}
```

## Governing Source-of-Truth References
- Spec (UI constraints): `docs/40-specs/SPC-002-frontend-ui.md`
- Spec (classifier behavior): `docs/40-specs/SPC-001-foundry-request-classification.md`

## Related Evidence / Files (read-only references)
- UI interop wrapper: `ui/requestClassifierInterop.js`
- Jest coverage: `tests/requestClassifier.test.js`

## Global Guardrails (apply to all micro-tasks unless overridden)
- **Must not** change classifier logic or output.
- **Must not** introduce new dependencies or configuration changes.
- **Forbidden** (unless explicitly allowed by a micro-task):
  - `package*.json`
  - Vite config (any `vite*.{js,ts}` or `config` changes)
  - dependency changes, lockfile changes
  - deployment/runtime config changes
  - `docs/**` (except creation/updates to this MTP and closure evidence document if MT-004 is executed)

## Acceptance Criteria (system-level)
1. In browser runtime, classification no longer produces `ReferenceError: module is not defined`.
2. Jest tests are still expected to pass (user-run).
3. Classifier output is unchanged (no behavior or formatting changes to classification result).

---

## MT-001 — Governance: Approve bounded change (guard-only)
- Owner: Governance Agent
- Status: [x]

### Evidence
- Governance decision packet recorded in: `docs/30-validation/VAL-005-cjs-browser-interop-fix.md` (APPROVED; bounded to `src/requestClassifier.js` only; forbid deps/config/other files).

### Purpose
Approve a minimal, bounded implementation change that only guards the CommonJS export assignment to prevent browser runtime errors.

### Scope layers
- **Allowed review scope:**
  - `docs/60-microtasks/MTP-005-cjs-browser-interop-fix.md` (this pack)
  - Proposed implementation target: `src/requestClassifier.js` (guard-only change)
- **Forbidden (must remain untouched):**
  - `package*.json`, any Vite config, dependency/lockfile changes
  - any files under `docs/**` besides this MTP and MT-004 closure artifact (if used)

### Requirements / Decision points
- Confirm the fix is strictly additive and **does not** change runtime logic aside from preventing the `module` reference in browser.
- Confirm no other interop mechanism is required (e.g., build config changes), per constraint to avoid config/deps edits.

### Acceptance criteria
- Governance explicitly approves:
  - Editing `src/requestClassifier.js` only.
  - Wrapping existing `module.exports = { classifyRequest };` with the provided `typeof module !== 'undefined'` guard (or functionally identical guard).
  - No other code edits.

### Expected evidence
- Governance approval note referencing MTP-005 and MT-001, plus any constraints or caveats.

---

## MT-002 — Code Author: Implement CJS export guard in browser
- Owner: Code Author
- Status: [x]

### Evidence
- Code Author change evidence recorded in: `docs/30-validation/VAL-005-cjs-browser-interop-fix.md` (COMPLETED; modified `src/requestClassifier.js` only; guarded `module.exports`).

### Purpose
Prevent browser `ReferenceError` by guarding the `module.exports` assignment in `src/requestClassifier.js` while preserving Node/Jest CommonJS usage.

### Implementation scope
- **Allowed files (implementation):**
  - `src/requestClassifier.js` **only**

### Forbidden
- `package*.json`
- Any Vite configuration files
- dependency changes, lockfile changes
- any other source files including (explicitly):
  - `ui/requestClassifierInterop.js`
  - `tests/requestClassifier.test.js`
- `docs/**` (except updating this MTP checkboxes if your workflow does that; otherwise leave docs unchanged)

### Implementation requirements
- Locate the trailing export in `src/requestClassifier.js` (reported near line ~191):
  - Current: `module.exports = { classifyRequest };`
- Replace it with the guarded version:
  - `if (typeof module !== 'undefined' && module.exports) { module.exports = { classifyRequest }; }`
- Keep formatting consistent with the file.
- Do not refactor, reformat the whole file, or change any classifier logic.

### Acceptance criteria
- `src/requestClassifier.js` no longer throws `ReferenceError: module is not defined` when loaded in the browser via Vite dev server.
- Node/Jest usage remains supported (CommonJS export still present when `module` exists).
- No other files changed.

### Expected evidence
- Diff or patch snippet showing only the guarded export change.
- Note of file path and the exact lines changed.

---

## MT-003 — Validator: Verify guard and provide manual runtime checklist
- Owner: Validator
- Status: [x]

### Evidence
- Validator packet recorded in: `docs/30-validation/VAL-005-cjs-browser-interop-fix.md` (**VALIDATION_PASSED** for `FLOW-MTP-005-MT-002-003`; notes: guard present, interop import ok, tests reference ok, evidence-based scope compliance).
- Addendum (user-run evidence captured in VAL-005): runtime `npm run preview` console screenshot shows no module error; `npm test` output indicates all Jest tests passed.

### Purpose
Confirm the guard exists, that UI interop still references the classifier, and provide a user-run manual verification checklist.

### Scope layers
- **Allowed (read-only):**
  - `src/requestClassifier.js`
  - `ui/requestClassifierInterop.js`
  - `tests/requestClassifier.test.js`
  - this MTP for checklist updates if needed (optional)
- **Forbidden (must not modify):**
  - All source files (Validator is read-only)
  - `package*.json`, Vite config, dependencies/lockfiles

### Validation steps
1. **Static check (read-only):**
   - Confirm `src/requestClassifier.js` contains the guard:
     - `typeof module !== 'undefined' && module.exports`
   - Confirm the unguarded `module.exports = ...` is not present as a top-level statement that will execute in browser.
2. **Interop check (read-only):**
   - Confirm `ui/requestClassifierInterop.js` still imports/uses the classifier as expected (no required change for this fix).
3. **Test reference check (read-only):**
   - Confirm `tests/requestClassifier.test.js` still references classifier entry points as expected.

### Manual runtime verification checklist (user-run)
- Run dev server:
  - `npm run dev`
- In the UI:
  - Navigate to a request entry flow that triggers classification.
  - Click **Classify**.
  - Confirm there is **no** `ReferenceError: module is not defined` in the browser console.
  - Confirm classifier output appears and is consistent with prior expected behavior.
- Optional (recommended) user-run tests:
  - `npm test`

### Acceptance criteria
- Validator reports:
  - Guard is present in `src/requestClassifier.js`.
  - No evidence of the prior browser `module` reference error on classification (based on manual checklist outcomes provided by user) OR provides the checklist and indicates that user-run confirmation is required.

### Expected evidence
- Validation note with:
  - File paths verified.
  - The exact guarded snippet (quoted) and/or line reference.
  - Manual checklist included (or referenced to this MTP section).

---

## MT-004 — Source-of-Truth Author: Record closure & evidence pointers
- Owner: Source-of-Truth Author
- Status: [x]

### Evidence
- This MTP updated to reflect closure status and evidence pointers.
- Consolidated evidence record created: `docs/30-validation/VAL-005-cjs-browser-interop-fix.md`.

### Purpose
Record closure status and pointers to execution and validation evidence for this micro-task pack.

### Scope layers
- **Allowed (docs only):**
  - `docs/60-microtasks/MTP-005-cjs-browser-interop-fix.md` (update checkboxes + evidence links)
  - Optional: create/update a validation evidence record under `docs/30-validation/` if required by your workflow
- **Forbidden:**
  - Any `src/**`, `ui/**`, `tests/**` edits
  - `package*.json`, Vite config, dependencies/lockfiles

### Closure requirements
- Update MT statuses to `[x]` when evidence is available.
- Add an "Evidence" section with pointers (paths/links) to:
  - Code Author diff evidence (MT-002)
  - Validator report/checklist results (MT-003)
  - Governance approval note (MT-001)

### Acceptance criteria
- MTP reflects accurate completion status and contains traceable evidence pointers.

### Expected evidence
- Updated MTP with:
  - completed checkboxes
  - evidence links/paths
  - brief closure note

# VAL-007 — Vite dev-server classifier import interop fix

Status: **VALIDATION_PASSED** (user-run runtime evidence captured for `npm test`, `npm run dev`, and `npm run build && npm run preview`; agents did not execute commands)

## What is being validated
Fix for dev-server-only failure resolving `classifyRequest` from `src/requestClassifier.js` in Vite dev mode.

## Previously observed failure
- Command: `npm run dev`
- URL: http://localhost:5173
- Observed error:
  - `Could not resolve classifyRequest export from src/requestClassifier.js (CJS/ESM interop failed)`
  - thrown in `ui/requestClassifierInterop.js`

## Reproduction steps (user-reported)
1. Start dev server: `npm run dev`
2. Open: http://localhost:5173
3. Observe UI error JSON including:
   - `Could not resolve classifyRequest export from src/requestClassifier.js (CJS/ESM interop failed)`
4. Regression note: `npm run preview` at http://localhost:4173 works.

## Validation procedure (required)
1. `npm test`
   - Expected: exit code 0
2. `npm run dev`
   - Visit http://localhost:5173
   - Expected: no JSON error about resolving `classifyRequest`; classifier interop does not throw
3. `npm run build && npm run preview`
   - Visit http://localhost:4173
   - Expected: still works (regression check)

## Evidence capture

### Evidence sources (user-provided runtime evidence)
1. User confirmation (verbatim): `"si, ya funciona en npm run dev"`.
2. `npm test` output (user-run): **PASS** (1 suite, 8 tests).

```text
❯ npm test

> foundry-request-board@0.0.0 test
> jest

 PASS  tests/requestClassifier.test.js
  classifyRequest
    ✓ classifies documentation-only request as low risk and bounded execution ready (2 ms)
    ✓ treats negated 'code' phrase as documentation-only (regression)
    ✓ does not classify mixed doc + code request as documentation-only (1 ms)
    ✓ classifies unknown or ambiguous request as unknown
    ✓ classifies security vulnerability fix request as code, medium risk, needs_review
    ✓ classifies Spanish security hardening request as code, medium risk, needs_review (1 ms)
    ✓ applies documentation-only security exception precedence over default security escalation
    ✓ classifies Spanish documentation-only security request as low risk and bounded execution ready

Test Suites: 1 passed, 1 total
Tests:       8 passed, 8 total
Snapshots:   0 total
Time:        0.186 s, estimated 1 s
Ran all test suites.
```

3. Dev UI screenshot (user-run):
   - `/attachments/2cf157bc-446a-4b0b-84b0-cd09922127f2/image_20260530_223807_51040KB.png`
   - Shows app running at `http://localhost:5173` and classifier output:
     - `type=documentation`, `risk=low`, `mode=bounded_execution_ready` for request: “Update the README... No code changes.”

### Runtime evidence (user-run): build + preview

Command output (verbatim):

```text
❯ npm run build && npm run preview

> foundry-request-board@0.0.0 build
> vite build

vite v5.4.21 building for production...
✓ 7 modules transformed.
dist/index.html                             0.41 kB │ gzip: 0.27 kB
dist/assets/index-DUiOhA_r.css              8.39 kB │ gzip: 2.50 kB
dist/assets/requestClassifier-D0LzMCPJ.js   2.94 kB │ gzip: 1.13 kB
dist/assets/index-DniKmEWw.js              14.52 kB │ gzip: 5.05 kB
✓ built in 341ms

> foundry-request-board@0.0.0 preview
> vite preview

  ➜  Local:   http://localhost:4173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

Preview UI screenshot (user-run):
- `/attachments/2cf157bc-446a-4b0b-84b0-cd09922127f2/image_20260530_224257_45792KB.png`

### Step results
- Step 1 — `npm test`: **PASS**
  - Summary:
    - `Test Suites: 1 passed, 1 total`
    - `Tests: 8 passed, 8 total`

- Step 2 — `npm run dev` + open `http://localhost:5173`: **PASS**
  - Previously observed error string is **not observed** in the provided evidence:
    - `Could not resolve classifyRequest export from src/requestClassifier.js (CJS/ESM interop failed)`
  - Evidence indicates the UI renders and classification executes (see screenshot path above).

- Step 3 — `npm run build && npm run preview` + open `http://localhost:4173`: **PASS**
  - Build succeeds and preview server starts (see verbatim command output above).
  - Preview UI loads (see screenshot path above).

## Result
- Overall: **VALIDATION_PASSED**
- Notes:
  - Evidence is user-run; agents did not execute commands.
  - Validation covers runtime behavior (`dev`, `test`, and `build/preview`). Scope compliance (only allowlisted files changed) is based on the Code Author report in MTP-007.

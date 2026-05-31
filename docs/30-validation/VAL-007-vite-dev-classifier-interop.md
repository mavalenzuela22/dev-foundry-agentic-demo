# VAL-007: Vite Dev-server Classifier Interop Fix

## Status

VALIDATION_PASSED

## Purpose

Record validation evidence for `MTP-007`, which fixed a Vite dev-server-only classifier interop issue.

## Traceability

- Micro-task pack: `docs/60-microtasks/MTP-007-vite-dev-classifier-interop.md`
- Classifier implementation: `src/requestClassifier.js`
- Browser interop layer: `ui/requestClassifierInterop.js`
- Classifier tests: `tests/requestClassifier.test.js`

## Problem Validated

The Foundry Request Board UI worked in Vite preview mode but failed in Vite dev mode.

Observed behavior:

- `npm run preview` worked.
- `npm run dev` failed in the UI.

Previously observed error:

- `Could not resolve classifyRequest export from src/requestClassifier.js (CJS/ESM interop failed)`

Failure location:

- `ui/requestClassifierInterop.js`

## Expected Behavior

The UI must be able to resolve and run `classifyRequest` in both:

- `npm run dev`
- `npm run build && npm run preview`

The fix must not change classifier behavior.

## Validation Scope

### In scope

- Static validation of classifier/browser interop implementation.
- User-run `npm test` evidence.
- User-run `npm run dev` evidence.
- User-run `npm run build && npm run preview` evidence.
- Confirmation that the previously observed dev-server interop error is no longer observed.

### Out of scope

- Browser automation by agents.
- Agent-run terminal execution.
- CI validation.
- Deployment validation.
- Full repo-wide diff proof.

## Required Validation Procedure

The validation procedure required the following checks:

1. Run classifier tests:
   - command: `npm test`
   - expected: exit code 0
2. Run Vite dev server:
   - command: `npm run dev`
   - URL: `http://localhost:5173`
   - expected: no UI JSON error about resolving `classifyRequest`
3. Run build and preview:
   - command: `npm run build && npm run preview`
   - URL: `http://localhost:4173`
   - expected: build succeeds and preview still works

## Evidence Sources

Runtime evidence was user-run.

Agents did not execute terminal commands or independently open a browser.

### User-run test evidence

Command:

- `npm test`

Observed result:

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

### User-run dev-server evidence

Command:

- `npm run dev`

URL:

- `http://localhost:5173`

Observed result:

- UI loaded successfully.
- Classification executed successfully.
- Previously observed error was not observed:
  - `Could not resolve classifyRequest export from src/requestClassifier.js (CJS/ESM interop failed)`

Screenshot evidence was provided by the user during validation. The repository record intentionally avoids embedding private/local attachment identifiers; the validation conclusion is based on the recorded user-provided evidence and Orchestrator/Validator summary.

### User-run build and preview evidence

Command:

- `npm run build && npm run preview`

Observed output:

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

Observed result:

- Build completed successfully.
- Preview server started.
- Preview UI loaded successfully based on user-provided evidence.

## Pass/Fail Matrix

| Check | Result | Basis |
|---|---:|---|
| `npm test` passes | PASS | User-run command output |
| Vite dev server works | PASS | User-run browser evidence |
| Prior dev interop error no longer observed | PASS | User-run browser evidence |
| Build succeeds | PASS | User-run command output |
| Preview still works | PASS | User-run browser evidence |
| Classifier behavior preserved | PASS | Existing test suite passed |
| Runtime evidence attribution is honest | PASS | Evidence labeled as user-run |
| Scope compliance | PASS WITH LIMITATION | Code Author report and evidence-based validation; no repo-wide diff proof captured |

## Limitations

- Runtime evidence was user-run, not agent-run.
- Agents did not execute `npm test`, `npm run dev`, `npm run build`, or `npm run preview`.
- Screenshot evidence was provided during the workflow but private/local attachment identifiers are intentionally not embedded in this sanitized validation record.
- Repo-wide diff proof was unavailable in this validation context.
- Scope compliance is based on Code Author evidence and targeted validation, not a full changed-files manifest.

## Final Assessment

`MTP-007` satisfied its acceptance criteria.

The Foundry Request Board UI now works under both Vite dev-server and build/preview flows, while classifier behavior remains covered by the passing test suite.
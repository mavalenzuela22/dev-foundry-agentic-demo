# VAL-006: Negated Code Signal Regression

## Status

VALIDATION_PASSED

## Purpose

Record validation evidence for `MTP-006`, which fixed a classifier false positive where explicit no-code phrases such as `No code changes` could accidentally trigger code intent.

## Traceability

- Micro-task pack: `docs/60-microtasks/MTP-006-negated-code-signal.md`
- Specification: `docs/40-specs/SPC-001-foundry-request-classification.md`
- Implementation: `src/requestClassifier.js`
- Tests: `tests/requestClassifier.test.js`

## Problem Validated

The following request was being classified too conservatively:

- `Update the README documentation for security guidance. No code changes.`

The classifier treated the literal word `code` as code intent even though the phrase explicitly negated code work.

## Expected Behavior

The request should classify as documentation-only:

- `type`: `documentation`
- `risk`: `low`
- `mode`: `bounded_execution_ready`

Security escalation must still be preserved for true security remediation requests such as:

- `Fix vulnerability in auth`

Expected result:

- `type`: `code`
- `risk`: `medium`
- `mode`: `needs_review`

## Validation Scope

### In scope

- Static inspection of classifier logic.
- Static inspection of regression tests.
- User-run runtime test evidence.
- Confirmation that security escalation remains preserved.
- Confirmation that explicit no-code phrases do not force code classification.

### Out of scope

- UI redesign.
- Browser automation.
- CI validation.
- Dependency changes.
- Repo-wide diff proof.

## Static Evidence Reviewed

### Implementation

File:

- `src/requestClassifier.js`

Observed behavior:

- code-signal detection suppresses or strips explicit negation phrases before evaluating the literal `code` signal;
- supported no-code phrases include English variants such as:
  - `no code changes`
  - `no code change`
  - `without code changes`
  - `without code change`
- Spanish no-code phrasing is also supported where implemented:
  - `sin cambios de código`

### Tests

File:

- `tests/requestClassifier.test.js`

Observed regression test:

- `treats negated 'code' phrase as documentation-only (regression)`

Representative input:

- `Update the README documentation for security guidance. No code changes.`

Expected asserted output includes:

- `type: 'documentation'`
- `risk: 'low'`
- `mode: 'bounded_execution_ready'`

Existing security escalation coverage remains present for:

- `Fix vulnerability in auth`

Expected asserted output includes:

- `type: 'code'`
- `risk: 'medium'`
- `mode: 'needs_review'`

## Runtime Evidence

Runtime evidence was provided by the user.

Command:

- `npm test`

Result:

- PASS

User-provided output:

    ❯ npm test

    > foundry-request-board@0.0.0 test
    > jest

     PASS  tests/requestClassifier.test.js
      classifyRequest
        ✓ classifies documentation-only request as low risk and bounded execution ready (1 ms)
        ✓ treats negated 'code' phrase as documentation-only (regression) (1 ms)
        ✓ does not classify mixed doc + code request as documentation-only
        ✓ classifies unknown or ambiguous request as unknown
        ✓ classifies security vulnerability fix request as code, medium risk, needs_review (1 ms)
        ✓ classifies Spanish security hardening request as code, medium risk, needs_review
        ✓ applies documentation-only security exception precedence over default security escalation
        ✓ classifies Spanish documentation-only security request as low risk and bounded execution ready (1 ms)

    Test Suites: 1 passed, 1 total
    Tests:       8 passed, 8 total
    Snapshots:   0 total
    Time:        0.193 s, estimated 1 s
    Ran all test suites.

## Pass/Fail Matrix

| Check | Result | Basis |
|---|---:|---|
| No-code phrase does not force code intent | PASS | Static inspection plus regression test |
| Reported README/security/no-code case classifies as documentation | PASS | Regression test and user-run test output |
| Existing security escalation remains preserved | PASS | Existing test coverage |
| Spanish security hardening still escalates | PASS | Existing test coverage |
| Documentation-only security exception still works | PASS | Existing test coverage |
| Runtime test suite passes | PASS | User-run `npm test` |
| Scope compliance | PASS WITH LIMITATION | Agent evidence; no repo-wide diff proof captured |

## Limitations

- Runtime evidence was user-run, not agent-run.
- No agent independently executed `npm test`.
- Repo-wide diff proof was unavailable in this validation context.
- Scope compliance is based on evidence packets and validation inspection, not a full repository diff.

## Final Assessment

`MTP-006` satisfied its acceptance criteria.

The classifier now treats explicit no-code phrases as negation of code intent when appropriate, while preserving security escalation for true security remediation and hardening requests.
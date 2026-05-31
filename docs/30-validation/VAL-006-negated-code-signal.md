# VAL-006: Negated “code” signal regression (MTP-006)

- **Date/Time**: 2026-05-31 (time not captured; recorded during SoT closure)
- **Validator**: Validator (child agent)
- **Status**: VALIDATION_PASSED (runtime evidence provided by user; embedded below)
- **Traceability**:
  - MTP: `docs/60-microtasks/MTP-006-negated-code-signal.md`
  - Spec: `docs/40-specs/SPC-001-foundry-request-classification.md`

## Scope

Validate MTP-006 changes to ensure explicit negation phrases (e.g., “No code changes”) do not count as code intent, preventing false escalation to `type=code`.

**In scope**
- Static inspection of:
  - `src/requestClassifier.js` (code intent detection)
  - `tests/requestClassifier.test.js` (regression + existing security escalation coverage)
- User-provided runtime evidence: `npm test` output (embedded below)

**Out of scope / limitations**
- No repo-wide diff proof captured in this validation.

## Runtime evidence (user-run)

- **Command**: `npm test`
- **Result**: PASS

```text
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
```

## Summary of changes validated

- `detectCodeSignals` updated to strip/suppress explicit negation phrases so the literal token `code` inside these phrases does not trigger code intent.
- Regression test added to assert a documentation-only security guidance request with “No code changes” is classified as:
  - `type: documentation`, `risk: low`, `mode: bounded_execution_ready`
- Existing security escalation coverage preserved for:
  - “Fix vulnerability in auth” => `type: code`, `risk: medium`, `mode: needs_review`

## Evidence snippets (static)

### Negation handling (implementation)

Implementation includes stripping/suppressing explicit negation phrases, including (case-insensitive):
- "no code changes"
- "no code change"
- "without code changes"
- "without code change"
- optional Spanish: "sin cambios de código"

### Regression test (tests)

Test name (as added):
- `treats negated 'code' phrase as documentation-only (regression)`

Representative input and expected output asserted:
- Input: "Update the README documentation for security guidance. No code changes."
- Expected includes:
  - `type: 'documentation'`
  - `risk: 'low'`
  - `mode: 'bounded_execution_ready'`

## Pass/Fail matrix

| Check | Result | Notes |
|---|---:|---|
| Negation phrases suppress code intent detection | PASS | `code` inside explicit negation does not trigger code classification |
| Regression test covers “No code changes” scenario | PASS | Test added with asserted expected output |
| Existing security escalation behavior preserved | PASS | “Fix vulnerability in auth” test preserved |
| Scope constraints respected | PASS | Only `src/requestClassifier.js` and `tests/requestClassifier.test.js` changed (per agent evidence packet) |

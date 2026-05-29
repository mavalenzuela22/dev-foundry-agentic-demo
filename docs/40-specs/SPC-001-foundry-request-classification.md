# SPC-001: Foundry Request Board Request Classification (Bootstrap)

> Honesty note (retroactive hardening): This spec was written after Agentic Slice 001 as SDD hardening. It documents already-validated behavior.

## Goal

Provide a pure deterministic classifier for Foundry Request Board change requests that identifies documentation-only requests as low risk and ready for bounded execution.

## In-scope

- Classification of a single request text string.
- Deterministic output fields: `type`, `risk`, `mode`, `reason`.
- Explicit handling for:
  - documentation-only requests
  - mixed documentation + code requests
  - code-related requests
  - unknown/ambiguous requests

## Out-of-scope (Slice 001)

- Any UI/CLI, persistence, services, or networking.
- Any runtime test runner setup (no `package.json`, no dependency installation).
- Any ML/NLP classification.

## Definitions

- **Documentation-only request**: request text includes documentation intent signals and does not include non-documentation/code intent signals.
- **Mixed request**: request includes both documentation intent signals and non-documentation/code intent signals.
- **Deterministic**: same input string produces same output; no I/O, no time/date, no randomness.

## Required behavior

### Input

- Function accepts `requestText` (string). Non-string inputs are treated as empty string.

### Output shape

Return an object:

- `type`: one of `documentation | mixed | code | unknown`
- `risk`: one of `low | medium | unknown`
- `mode`: one of `bounded_execution_ready | needs_review`
- `reason`: human-readable explanation string

### Decision rules (minimum)

1. If documentation signals present AND code signals absent:
   - `type: documentation`
   - `risk: low`
   - `mode: bounded_execution_ready`
   - `reason` mentions documentation-only, low risk, and bounded execution
2. If documentation signals present AND code signals present:
   - `type: mixed`
   - `risk: medium`
   - `mode: needs_review`
3. If documentation signals absent AND code signals present:
   - `type: code`
   - `risk: medium`
   - `mode: needs_review`
4. If neither signals present:
   - `type: unknown`
   - `risk: unknown`
   - `mode: needs_review`

## Acceptance criteria (Slice 001)

AC-001 Deterministic classifier
- No side effects; no I/O.

AC-002 Documentation-only classification
- For a request like: "update README" / "fix typos in documentation": output includes
  - `type: documentation`
  - `risk: low`
  - `mode: bounded_execution_ready`

AC-003 Mixed requests are not low-risk by default
- For a request like: "Update docs for the API and implement a new endpoint":
  - `type: mixed`
  - `risk` is not `low`
  - `mode: needs_review`

AC-004 Unknown requests are not auto-approved
- For a request like: "Make it better":
  - `type: unknown`
  - `risk: unknown`
  - `mode: needs_review`

AC-005 Validation mode
- Validation is by static inspection of implementation and tests; runtime execution is not required in Slice 001.

## Implementation and evidence (Slice 001)

- Implementation: `src/requestClassifier.js` (`classifyRequest(requestText)`)
- Tests (Jest-style, not executed): `tests/requestClassifier.test.js`
- Validation evidence: `docs/30-validation/validator-smoke-test-001.md`

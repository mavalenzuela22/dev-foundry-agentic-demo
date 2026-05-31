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

#### DELTA (unimplemented): Security-related request handling

This delta adds deterministic handling for security-related requests.

**Security signals (initial):**
- `security`
- `seguridad`
- `ciberseguridad`
- `vulnerability`
- `vulnerabilidad`
- `hardening`

**Security escalation default (when not doc-only exception):**
- If *any* security signal is present **and** the doc-only exception (below) does **not** apply:
  - `type: code`
  - `risk: medium`
  - `mode: needs_review`
  - `reason` mentions security-related request and review requirement

**Doc-only security exception (precedence rule):**
- This exception must be evaluated **before** the security escalation default.
- If the request is strictly security documentation:
  - documentation intent signals are present
  - **and** at least one security signal is present
  - **and** the request text does **not** mention any of:
    - `remediación`, `vulnerabilidad`, `hardening`, `implementación`, `endpoint`, `API`, `auth`, `permisos`
    - or any explicit code change intent
  - then classify as documentation-only:
    - `type: documentation`
    - `risk: low`
    - `mode: bounded_execution_ready`

**DELTA: Explicit negated code intent (doc-only security false positive prevention)**

When documentation intent signals are present, explicit negation phrases about code work MUST suppress code intent detection for the purposes of the doc-only security exception.

- If the word `code` appears only inside an explicit negation phrase (e.g., “no code changes”), it MUST NOT be treated as a code intent signal.
- This rule exists to prevent false positives where a request is explicitly documentation-only but mentions `code` only to negate code work.

**Normative examples (delta):**
1. "Fix vulnerability in auth" => `type: code`, `risk: medium`, `mode: needs_review`
2. "ciberseguridad hardening" => `type: code`, `risk: medium`, `mode: needs_review`
3. "actualizar documentación de seguridad" => `type: documentation`, `risk: low`, `mode: bounded_execution_ready`
4. "Update the README documentation for security guidance. No code changes." => `type: documentation`, `risk: low`, `mode: bounded_execution_ready`

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

### Acceptance criteria (DELTA: Security-related requests; unimplemented)

AC-006 Security requests escalate to code + needs_review
- If request text contains any security signal (`security`, `seguridad`, `ciberseguridad`, `vulnerability`, `vulnerabilidad`, `hardening`) and the doc-only exception (AC-007) does not apply, output includes:
  - `type: code`
  - `risk: medium`
  - `mode: needs_review`

AC-007 Doc-only security exception prevents escalation (precedence)
- If request text indicates documentation intent and includes a security signal, and does **not** include any of:
  - `remediación`, `vulnerabilidad`, `hardening`, `implementación`, `endpoint`, `API`, `auth`, `permisos`
  - or explicit code change intent
  then output includes:
  - `type: documentation`
  - `risk: low`
  - `mode: bounded_execution_ready`

AC-008 Normative examples for security delta
- "Fix vulnerability in auth" => `type: code`, `risk: medium`, `mode: needs_review`
- "ciberseguridad hardening" => `type: code`, `risk: medium`, `mode: needs_review`
- "actualizar documentación de seguridad" => `type: documentation`, `risk: low`, `mode: bounded_execution_ready`

## Implementation and evidence (Slice 001)

- Implementation: `src/requestClassifier.js` (`classifyRequest(requestText)`)
- Tests (Jest-style, not executed): `tests/requestClassifier.test.js`
- Validation evidence: `docs/30-validation/validator-smoke-test-001.md`

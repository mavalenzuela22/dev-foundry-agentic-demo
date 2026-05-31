# SPC-001: Foundry Request Board Request Classification

## Status

ACTIVE PRODUCT SPECIFICATION

## Purpose

Define the deterministic request classification behavior for Foundry Request Board.

This specification governs how a single user-provided request text is classified into a bounded output shape that can be used by the demo UI and downstream governance workflows.

## Scope Boundary

This document describes Foundry Request Board product behavior only.

It does not define Dev Foundry agent-system hardening, Orchestrator behavior, Flow Evidence Manifest behavior, MCP read-reduction behavior, or agent prompt behavior. Those concerns are documented separately under the agent-system documentation area.

## Historical Note

This specification began as a retroactive source-of-truth hardening document after the first classifier slice. It has since been updated to reflect implemented and validated classifier behavior.

The current document describes the active product behavior as of the latest validated classifier slices.

## Goal

Provide a pure deterministic classifier for Foundry Request Board change requests that identifies request intent, risk, and execution readiness using simple text signals.

## In Scope

- Classification of a single request text string.
- Deterministic output fields:
  - `type`
  - `risk`
  - `mode`
  - `reason`
- Handling for:
  - documentation-only requests
  - mixed documentation plus code requests
  - code or implementation requests
  - unknown or ambiguous requests
  - security-related requests
  - documentation-only security requests
  - explicit negated code intent, such as “no code changes”

## Out of Scope

- Backend services.
- Network calls.
- Persistence.
- Authentication or user accounts.
- Machine learning or probabilistic NLP.
- Agent orchestration.
- Dev Foundry agent-system hardening.
- Runtime environment setup beyond existing project scripts.
- CI/CD or deployment behavior.

## Definitions

### Documentation-only request

A request that includes documentation intent signals and does not include effective code or implementation intent signals.

Examples include:

- “Update README”
- “Fix typos in documentation”
- “Actualizar documentación de seguridad”
- “Update the README documentation for security guidance. No code changes.”

### Code or implementation request

A request that includes effective code, implementation, runtime, endpoint, dependency, or security-remediation intent.

Examples include:

- “Implement a new endpoint”
- “Fix vulnerability in auth”
- “Ciberseguridad hardening”
- “Update docs and implement API changes”

### Mixed request

A request that includes both documentation intent and effective code or implementation intent.

Example:

- “Update docs for the API and implement a new endpoint”

### Security-related request

A request that includes security signals such as vulnerability, hardening, security, seguridad, or ciberseguridad.

Security-related requests default to review unless the documentation-only security exception applies.

### Explicit negated code intent

A phrase where the user explicitly says code work should not happen.

Examples include:

- “No code changes”
- “No code change”
- “Without code changes”
- “Without code change”
- “Sin cambios de código”

When such a phrase appears in a documentation request, the word `code` inside the negation phrase must not count as effective code intent.

### Deterministic

The same input string must always produce the same output.

The classifier must not depend on I/O, network calls, time, date, randomness, external services, or mutable runtime state.

## Input

The classifier accepts `requestText`.

Non-string inputs are treated as empty or unknown input.

## Output Shape

The classifier returns an object with this shape:

- `type`: one of `documentation`, `mixed`, `code`, `unknown`
- `risk`: one of `low`, `medium`, `unknown`
- `mode`: one of `bounded_execution_ready`, `needs_review`
- `reason`: human-readable explanation string

## Required Behavior

### Rule 1: Documentation-only classification

If documentation signals are present and effective code signals are absent:

- `type`: `documentation`
- `risk`: `low`
- `mode`: `bounded_execution_ready`
- `reason`: explains that the request is documentation-only, low risk, and ready for bounded execution

### Rule 2: Mixed classification

If documentation signals are present and effective code signals are present:

- `type`: `mixed`
- `risk`: `medium`
- `mode`: `needs_review`
- `reason`: explains that the request mixes documentation and implementation intent

### Rule 3: Code classification

If documentation signals are absent and effective code signals are present:

- `type`: `code`
- `risk`: `medium`
- `mode`: `needs_review`
- `reason`: explains that the request appears to require code or implementation review

### Rule 4: Unknown classification

If neither documentation signals nor effective code signals are present:

- `type`: `unknown`
- `risk`: `unknown`
- `mode`: `needs_review`
- `reason`: explains that the request is ambiguous or does not contain enough actionable classification signals

### Rule 5: Security escalation default

If a security signal is present and the documentation-only security exception does not apply:

- `type`: `code`
- `risk`: `medium`
- `mode`: `needs_review`
- `reason`: explains that the request is security-related and requires review

Initial security signals include:

- `security`
- `seguridad`
- `ciberseguridad`
- `vulnerability`
- `vulnerabilidad`
- `hardening`

### Rule 6: Documentation-only security exception

This exception must be evaluated before the security escalation default.

If all of the following are true:

- documentation intent signals are present
- at least one security signal is present
- effective code intent is absent
- explicit security-remediation or implementation intent is absent

Then classify as documentation-only:

- `type`: `documentation`
- `risk`: `low`
- `mode`: `bounded_execution_ready`

Negative keywords or signals that prevent this exception include:

- `remediación`
- `vulnerabilidad`
- `hardening`
- `implementación`
- `endpoint`
- `API`
- `auth`
- `permisos`
- explicit code change intent

### Rule 7: Explicit negated code intent precedence

When documentation intent signals are present, explicit negation phrases about code work must suppress code intent detection for the negated phrase.

If the word `code` appears only inside an explicit negation phrase, such as “no code changes”, it must not be treated as effective code intent.

This rule prevents false positives where a request is explicitly documentation-only but mentions `code` only to exclude code work.

## Normative Examples

### Example 1: Documentation-only request

Input:

- “Update README”

Expected output includes:

- `type`: `documentation`
- `risk`: `low`
- `mode`: `bounded_execution_ready`

### Example 2: Mixed documentation and code request

Input:

- “Update docs for the API and implement a new endpoint”

Expected output includes:

- `type`: `mixed`
- `risk`: `medium`
- `mode`: `needs_review`

### Example 3: Unknown request

Input:

- “Make it better”

Expected output includes:

- `type`: `unknown`
- `risk`: `unknown`
- `mode`: `needs_review`

### Example 4: Security remediation request

Input:

- “Fix vulnerability in auth”

Expected output includes:

- `type`: `code`
- `risk`: `medium`
- `mode`: `needs_review`

### Example 5: Spanish security hardening request

Input:

- “ciberseguridad hardening”

Expected output includes:

- `type`: `code`
- `risk`: `medium`
- `mode`: `needs_review`

### Example 6: Documentation-only security request

Input:

- “actualizar documentación de seguridad”

Expected output includes:

- `type`: `documentation`
- `risk`: `low`
- `mode`: `bounded_execution_ready`

### Example 7: README security guidance with explicit no-code constraint

Input:

- “Update the README documentation for security guidance. No code changes.”

Expected output includes:

- `type`: `documentation`
- `risk`: `low`
- `mode`: `bounded_execution_ready`

## Acceptance Criteria

### AC-001 Deterministic classifier

The classifier must be deterministic.

It must not use:

- I/O
- network calls
- time or date
- randomness
- external services
- mutable runtime state

### AC-002 Documentation-only classification

For documentation-only requests such as “update README” or “fix typos in documentation”, the classifier returns:

- `type`: `documentation`
- `risk`: `low`
- `mode`: `bounded_execution_ready`

### AC-003 Mixed requests are not low-risk by default

For mixed documentation and implementation requests such as “Update docs for the API and implement a new endpoint”, the classifier returns:

- `type`: `mixed`
- `risk`: `medium`
- `mode`: `needs_review`

### AC-004 Unknown requests are not auto-approved

For ambiguous requests such as “Make it better”, the classifier returns:

- `type`: `unknown`
- `risk`: `unknown`
- `mode`: `needs_review`

### AC-005 Security requests escalate by default

If request text contains a security signal and the documentation-only security exception does not apply, the classifier returns:

- `type`: `code`
- `risk`: `medium`
- `mode`: `needs_review`

### AC-006 Documentation-only security exception prevents escalation

If request text indicates documentation intent, includes a security signal, and does not include effective code or security-remediation intent, the classifier returns:

- `type`: `documentation`
- `risk`: `low`
- `mode`: `bounded_execution_ready`

### AC-007 Explicit negated code intent does not force code classification

If request text indicates documentation intent and includes an explicit no-code phrase such as “No code changes”, the word `code` inside that phrase must not force code classification.

For the input “Update the README documentation for security guidance. No code changes.”, the classifier returns:

- `type`: `documentation`
- `risk`: `low`
- `mode`: `bounded_execution_ready`

### AC-008 Security escalation remains preserved after negated-code handling

Clear security remediation requests must still escalate.

For the input “Fix vulnerability in auth”, the classifier returns:

- `type`: `code`
- `risk`: `medium`
- `mode`: `needs_review`

### AC-009 Runtime behavior remains local and side-effect free

Classification must remain local and side-effect free whether invoked from tests or from the browser UI.

## Implementation References

Current implementation:

- `src/requestClassifier.js`
- exported function: `classifyRequest(requestText)`

Current regression tests:

- `tests/requestClassifier.test.js`

## Validation Evidence

Classifier behavior has been validated through a combination of static inspection and user-run runtime test evidence.

Relevant evidence includes:

- `docs/30-validation/validator-smoke-test-001.md`
- `docs/30-validation/agentic-slice-001-summary.md`
- `docs/30-validation/agentic-slice-002-security-delta-summary.md`
- `docs/30-validation/VAL-006-negated-code-signal.md`

Runtime evidence for the latest classifier regression coverage was user-run through `npm test` and recorded in validation evidence.

The user-run Jest output reported:

- 1 test suite passed
- 8 tests passed
- 0 snapshots
- all test suites completed successfully

## Traceability

Related task and micro-task documents:

- `docs/50-tasks/TSK-001-documentation-only-classifier.md`
- `docs/50-tasks/TSK-002-security-request-classification-delta.md`
- `docs/60-microtasks/MTP-001-documentation-only-classifier.md`
- `docs/60-microtasks/MTP-002-security-request-classification-delta.md`
- `docs/60-microtasks/MTP-006-negated-code-signal.md`

Related UI specification:

- `docs/40-specs/SPC-002-frontend-ui.md`

## Non-Goals for This Specification

This specification does not define:

- UI layout or visual design
- Vite configuration
- browser bundling strategy
- CJS/ESM interop strategy
- agent routing
- Dev Foundry governance process
- Alita agent prompt behavior
- Flow Evidence Manifest behavior
- MCP filesystem read behavior
- no-diff validation mode

Those concerns are governed by separate product or agent-system documents.
# TSK-002: Security-related Request Classification Delta

## Status

COMPLETED PRODUCT TASK

## Purpose

Define and close the product behavior delta that allows Foundry Request Board to classify security-related requests safely and deterministically.

This task belongs to Foundry Request Board product behavior. It does not define Dev Foundry agent-system hardening, Alita prompt behavior, Flow Evidence Manifest behavior, MCP read-reduction behavior, or Orchestrator behavior.

## Historical Note

This task was originally written as a spec-first delta before implementation. The delta has since been implemented, tested, validated, and closed through the related micro-task packs and validation evidence.

This document now describes the completed product task and its traceability.

## Governing Specification

- `docs/40-specs/SPC-001-foundry-request-classification.md`

## Related Micro-task Packs

- `docs/60-microtasks/MTP-002-security-request-classification-delta.md`
- `docs/60-microtasks/MTP-006-negated-code-signal.md`

## Objective

Update the request classifier so that security-related requests are classified conservatively by default while preserving a safe documentation-only exception.

## Product Problem

Before this task, security-related wording could be treated too simply as generic code intent.

The required behavior is more precise:

- clear security remediation or hardening requests must require review;
- documentation-only security requests must remain low-risk and bounded;
- explicit no-code wording must not accidentally force code classification.

## In Scope

- Update deterministic request classification behavior for security-related request text.
- Preserve documentation-only classification when the request is strictly documentation.
- Escalate security remediation, hardening, auth, endpoint, API, or implementation-oriented requests to review.
- Add or maintain regression tests for security escalation and documentation-only security exceptions.
- Keep classification deterministic and side-effect free.

## Out of Scope

- UI changes.
- Backend services.
- Network calls.
- Persistence.
- Runtime infrastructure beyond existing project scripts.
- Dependency changes.
- Build or deployment configuration.
- Agent-system hardening.
- Alita prompt changes.
- Flow Evidence Manifest or MCP behavior.

## Product Behavior Requirements

### Requirement 1: Security escalation default

If a request includes a security signal and no documentation-only exception applies, the classifier must return:

- `type`: `code`
- `risk`: `medium`
- `mode`: `needs_review`

Security signals include:

- `security`
- `seguridad`
- `ciberseguridad`
- `vulnerability`
- `vulnerabilidad`
- `hardening`

### Requirement 2: Documentation-only security exception

If a request includes documentation intent and a security signal, but does not include effective code, remediation, hardening, implementation, endpoint, API, auth, permissions, or similar execution intent, the classifier must return:

- `type`: `documentation`
- `risk`: `low`
- `mode`: `bounded_execution_ready`

### Requirement 3: Exception precedence

The documentation-only security exception must be evaluated before security escalation.

A request such as `actualizar documentación de seguridad` must not be escalated merely because it includes the word `seguridad`.

### Requirement 4: Negated code wording

A request that explicitly says code changes are not intended must not be treated as code solely because the word `code` appears inside a negation phrase.

Example:

- `Update the README documentation for security guidance. No code changes.`

Expected output:

- `type`: `documentation`
- `risk`: `low`
- `mode`: `bounded_execution_ready`

## Implementation Touchpoints

Implementation and test changes are limited to:

- `src/requestClassifier.js`
- `tests/requestClassifier.test.js`

## Forbidden Product Changes

This task does not authorize changes to:

- UI source files.
- Vite configuration.
- package files or lockfiles.
- deployment files.
- secrets.
- environment files.
- backend services.
- agent-system docs or prompts.

## Acceptance Criteria

### AC-TSK-002-001 Security escalation is implemented

For an input such as `Fix vulnerability in auth`, the classifier returns:

- `type`: `code`
- `risk`: `medium`
- `mode`: `needs_review`

### AC-TSK-002-002 Spanish security hardening escalates

For an input such as `ciberseguridad hardening`, the classifier returns:

- `type`: `code`
- `risk`: `medium`
- `mode`: `needs_review`

### AC-TSK-002-003 Documentation-only security exception is implemented

For an input such as `actualizar documentación de seguridad`, the classifier returns:

- `type`: `documentation`
- `risk`: `low`
- `mode`: `bounded_execution_ready`

### AC-TSK-002-004 Negated code wording is handled

For the input `Update the README documentation for security guidance. No code changes.`, the classifier returns:

- `type`: `documentation`
- `risk`: `low`
- `mode`: `bounded_execution_ready`

### AC-TSK-002-005 Determinism is preserved

The classifier remains deterministic and side-effect free.

It must not introduce:

- I/O
- network calls
- time or date dependence
- randomness
- external service calls
- mutable global state affecting classification output

### AC-TSK-002-006 Regression tests exist

Tests must cover at least:

- security vulnerability escalation
- Spanish security hardening escalation
- documentation-only security exception
- explicit no-code regression scenario

## Validation Evidence

Relevant validation and evidence records include:

- `docs/30-validation/agentic-slice-002-security-delta-summary.md`
- `docs/30-validation/VAL-006-negated-code-signal.md`

User-run runtime evidence for the final classifier regression set reported:

- 1 test suite passed
- 8 tests passed
- 0 snapshots
- all Jest test suites completed successfully

## Completion Summary

This task is complete.

The classifier now supports:

- default security escalation;
- documentation-only security exception precedence;
- explicit no-code phrase handling;
- regression tests that preserve the expected behavior.

## Traceability

Specification:

- `docs/40-specs/SPC-001-foundry-request-classification.md`

Micro-task packs:

- `docs/60-microtasks/MTP-002-security-request-classification-delta.md`
- `docs/60-microtasks/MTP-006-negated-code-signal.md`

Implementation:

- `src/requestClassifier.js`

Tests:

- `tests/requestClassifier.test.js`

Validation:

- `docs/30-validation/agentic-slice-002-security-delta-summary.md`
- `docs/30-validation/VAL-006-negated-code-signal.md`
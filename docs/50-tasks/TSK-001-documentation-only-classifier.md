# TSK-001: Documentation-only Request Classifier

## Status

COMPLETED PRODUCT TASK

## Purpose

Formalize the initial Foundry Request Board classifier behavior for documentation-only requests.

This task belongs to Foundry Request Board product behavior. It does not define Dev Foundry agent-system hardening, Alita prompt behavior, Flow Evidence Manifest behavior, MCP read-reduction behavior, or Orchestrator behavior.

## Historical Note

This task was created after the initial classifier implementation as retroactive source-of-truth hardening.

The underlying classifier behavior already existed when this task was written. This document preserves the product task boundary and traceability for the first classifier slice.

## Governing Specification

- `docs/40-specs/SPC-001-foundry-request-classification.md`

## Related Micro-task Pack

- `docs/60-microtasks/MTP-001-documentation-only-classifier.md`

## Objective

Document and close the initial deterministic request classifier behavior for documentation-only, mixed, code, and unknown requests.

## Product Problem

Foundry Request Board needed a small deterministic classifier that could classify a user request into safe execution categories before any richer UI or workflow demonstration.

The first product need was to distinguish documentation-only requests from higher-risk implementation or ambiguous requests.

## In Scope

- Deterministic classification of a single request text string.
- Documentation-only request detection.
- Mixed documentation plus code request detection.
- Code or implementation request detection.
- Unknown or ambiguous request handling.
- Output fields:
  - `type`
  - `risk`
  - `mode`
  - `reason`
- Source-of-truth traceability for the first classifier slice.

## Out of Scope

- UI behavior.
- Browser bundling.
- Backend services.
- Network calls.
- Persistence.
- Authentication.
- Machine learning or probabilistic NLP.
- Runtime environment setup beyond existing project scripts.
- CI/CD or deployment.
- Agent-system hardening.

## Implementation References

Initial implementation and tests:

- `src/requestClassifier.js`
- `tests/requestClassifier.test.js`

These files are product implementation and test artifacts. This task document does not authorize direct implementation changes by itself.

## Source-of-truth Documents

This task is traceable through:

- `docs/40-specs/SPC-001-foundry-request-classification.md`
- `docs/50-tasks/TSK-001-documentation-only-classifier.md`
- `docs/60-microtasks/MTP-001-documentation-only-classifier.md`
- `docs/00-product/source-of-truth-map.md`

## Product Behavior Requirements

### Requirement 1: Documentation-only classification

Requests with documentation intent and no effective code or implementation intent should classify as:

- `type`: `documentation`
- `risk`: `low`
- `mode`: `bounded_execution_ready`

### Requirement 2: Mixed request classification

Requests with both documentation intent and code or implementation intent should classify as:

- `type`: `mixed`
- `risk`: `medium`
- `mode`: `needs_review`

### Requirement 3: Code request classification

Requests with effective code or implementation intent and no documentation-only exception should classify as:

- `type`: `code`
- `risk`: `medium`
- `mode`: `needs_review`

### Requirement 4: Unknown request classification

Requests without enough actionable classification signals should classify as:

- `type`: `unknown`
- `risk`: `unknown`
- `mode`: `needs_review`

### Requirement 5: Deterministic behavior

The classifier must be deterministic and side-effect free.

It must not depend on:

- I/O
- network calls
- time or date
- randomness
- external services
- mutable runtime state

## Acceptance Criteria

### AC-TSK-001-001 Source-of-truth spine exists

The first classifier slice is traceable through:

- source-of-truth map
- product specification
- product task
- micro-task pack
- implementation references
- validation evidence

### AC-TSK-001-002 Specification captures validated behavior

`SPC-001` defines:

- classifier output shape
- documentation-only classification
- mixed request classification
- code request classification
- unknown request classification
- deterministic constraints

### AC-TSK-001-003 Product task captures boundaries

This task identifies:

- product objective
- scope
- out-of-scope items
- implementation references
- validation expectations

### AC-TSK-001-004 Micro-task pack provides traceability

`MTP-001` records the documentation and traceability work for the initial classifier slice.

### AC-TSK-001-005 Evidence is linked

Validation evidence is linked from the product source-of-truth chain.

## Validation Evidence

Relevant validation and evidence records include:

- `docs/30-validation/agentic-slice-001-summary.md`
- `docs/30-validation/code-author-commit-review-e953f5a.md`
- `docs/30-validation/validator-smoke-test-001.md`

Later user-run runtime evidence also confirmed the classifier test suite passes as the product evolved.

## Completion Summary

This task is complete.

The initial deterministic classifier behavior was implemented, documented, and linked into the product source-of-truth chain.

Later tasks extended this classifier with security-related behavior and explicit no-code phrase handling, but the base classification behavior from this task remains the foundation.

## Traceability

Specification:

- `docs/40-specs/SPC-001-foundry-request-classification.md`

Micro-task pack:

- `docs/60-microtasks/MTP-001-documentation-only-classifier.md`

Implementation:

- `src/requestClassifier.js`

Tests:

- `tests/requestClassifier.test.js`

Validation:

- `docs/30-validation/agentic-slice-001-summary.md`
- `docs/30-validation/code-author-commit-review-e953f5a.md`
- `docs/30-validation/validator-smoke-test-001.md`

Related later classifier work:

- `docs/50-tasks/TSK-002-security-request-classification-delta.md`
- `docs/60-microtasks/MTP-002-security-request-classification-delta.md`
- `docs/60-microtasks/MTP-006-negated-code-signal.md`